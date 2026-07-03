const https = require('https');

function slugify(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

function articleIdFromUrl(url) {
  const match = url.match(/\/([^/]+)\.html$/);
  return match ? match[1] : slugify(url);
}

function fetch(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (compatible; GalarragaLLC/1.0)' } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        const next = res.headers.location.startsWith('http')
          ? res.headers.location
          : `https://kidshealth.org${res.headers.location}`;
        return fetch(next).then(resolve, reject);
      }
      let data = '';
      res.on('data', (c) => (data += c));
      res.on('end', () => {
        if (res.statusCode !== 200) reject(new Error(`HTTP ${res.statusCode} for ${url}`));
        else resolve(data);
      });
    }).on('error', reject);
  });
}

function parseCategoryPage(html) {
  const sections = [];
  const sectionRegex = /<button[^>]*class="kh-category-title"[^>]*>([^<]+)<\/button>[\s\S]*?<ul class="kh-category-single">([\s\S]*?)<\/ul>/g;
  let match;
  while ((match = sectionRegex.exec(html)) !== null) {
    const sectionTitle = match[1].trim();
    const linksHtml = match[2];
    const items = [];
    const linkRegex = /<a class="linkFromCat" href="([^"]+)">([^<]+)<\/a>/g;
    let linkMatch;
    while ((linkMatch = linkRegex.exec(linksHtml)) !== null) {
      const url = linkMatch[1].trim();
      items.push({
        url,
        title: linkMatch[2].trim(),
        id: articleIdFromUrl(url),
      });
    }
    sections.push({ title: sectionTitle, items });
  }
  return sections;
}

function normalizeTitle(title) {
  return title
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ');
}

function getItemsFromSubtopic(subtopic) {
  if (Array.isArray(subtopic.items)) {
    return subtopic.items.map((item) => {
      if (typeof item === 'string') return { title: item, description: '' };
      return { title: item.title || '', description: item.description || '' };
    });
  }
  if (subtopic.items && typeof subtopic.items === 'object') {
    return Object.entries(subtopic.items).map(([title, value]) => ({
      title,
      description: typeof value === 'object' ? value.description || '' : '',
    }));
  }
  return [];
}

async function buildSlugMaps(categoryUrlEs, categoryUrlEn) {
  const [htmlEs, htmlEn] = await Promise.all([fetch(categoryUrlEs), fetch(categoryUrlEn)]);
  const sectionsEs = parseCategoryPage(htmlEs);
  const sectionsEn = parseCategoryPage(htmlEn);

  const byId = {};
  const titleToId = { es: {}, en: {} };

  for (const section of sectionsEs) {
    for (const item of section.items) {
      byId[item.id] = byId[item.id] || { id: item.id, sourceUrl: {} };
      byId[item.id].sourceUrl.es = item.url;
      titleToId.es[normalizeTitle(item.title)] = item.id;
    }
  }

  for (const section of sectionsEn) {
    for (const item of section.items) {
      byId[item.id] = byId[item.id] || { id: item.id, sourceUrl: {} };
      byId[item.id].sourceUrl.en = item.url;
      titleToId.en[normalizeTitle(item.title)] = item.id;
    }
  }

  return { byId, titleToId, sectionsEs, sectionsEn };
}

function findArticleId(title, lang, titleToId) {
  if (!title?.trim()) return null;
  const normalized = normalizeTitle(title);
  if (titleToId[lang][normalized]) return titleToId[lang][normalized];

  const entries = Object.entries(titleToId[lang]);

  const partial = entries.find(
    ([key]) => key.includes(normalized) || normalized.includes(key)
  );
  if (partial) return partial[1];

  const words = normalized.split(' ').filter((w) => w.length > 2);
  if (words.length === 0) return null;

  let bestId = null;
  let bestScore = 0;
  for (const [key, id] of entries) {
    const keyWords = key.split(' ');
    const score = words.filter((w) =>
      keyWords.some((kw) => kw.includes(w) || w.includes(kw))
    ).length;
    if (score > bestScore) {
      bestScore = score;
      bestId = id;
    }
  }

  const threshold = Math.min(2, words.length);
  return bestScore >= threshold ? bestId : null;
}

function resolveArticleMeta(itemEs, itemEn, titleToId, byId, subIndex, itemIndex) {
  const esTitle = itemEs.title || '';
  const enTitle = itemEn?.title || '';

  let id =
    findArticleId(esTitle, 'es', titleToId) ||
    findArticleId(enTitle, 'en', titleToId);

  if (id && byId[id]) {
    return { id, meta: byId[id] };
  }

  id = resolveArticleId(esTitle, 'es', titleToId, subIndex, itemIndex);
  return { id, meta: byId[id] || { id, sourceUrl: {} } };
}

function resolveArticleId(title, lang, titleToId, subtopicIndex, itemIndex) {
  const normalized = normalizeTitle(title);
  if (titleToId[lang][normalized]) return titleToId[lang][normalized];

  const partial = Object.entries(titleToId[lang]).find(
    ([key]) => key.startsWith(normalized) || normalized.startsWith(key)
  );
  if (partial) return partial[1];

  return `article-${subtopicIndex + 1}-${itemIndex + 1}-${slugify(title).slice(0, 40)}`;
}

module.exports = {
  slugify,
  articleIdFromUrl,
  fetch,
  parseCategoryPage,
  normalizeTitle,
  getItemsFromSubtopic,
  buildSlugMaps,
  findArticleId,
  resolveArticleMeta,
  resolveArticleId,
};
