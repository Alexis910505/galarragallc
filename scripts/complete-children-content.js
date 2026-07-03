/**
 * Completa artículos children incompletos (ES + EN) al 100%.
 * Uso: node scripts/complete-children-content.js
 */
const fs = require('fs');
const path = require('path');
const { fetch, normalizeTitle, buildSlugMaps } = require('./content-utils');
const { CATEGORY_URLS, CHILDREN_TOPICS } = require('./category-urls');
const { extractArticleContent, minContentLength } = require('./article-extract');
const { decodeHtmlEntities } = require('./decode-html-entities');

const CATEGORY = 'children';
const CONTENT_DIR = path.join(__dirname, '../content');
const ARTICLES_DIR = path.join(CONTENT_DIR, 'articles');

const TITLE_SEARCH_CACHE = {};

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function swapLangInUrl(url, lang) {
  return url.replace(/\/(es|en)\//, `/${lang}/`);
}

function slugCandidates(article, lang) {
  const id = article.id;
  const slugs = new Set([id, id.replace(/-es$/, '')]);

  const title = article[lang === 'es' ? 'es' : 'en']?.title || article.es?.title || article.en?.title;
  if (title) {
    const normalized = title
      .toLowerCase()
      .replace(/^breve resumen:\s*/i, '')
      .trim();
    slugs.add(normalized.replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '').slice(0, 60));
  }

  return [...slugs];
}

function getHreflangUrl(html, lang) {
  const patterns = [
    new RegExp(`<link[^>]+hreflang=["']${lang}["'][^>]+href=["']([^"']+)["']`, 'i'),
    new RegExp(`<link[^>]+href=["']([^"']+)["'][^>]+hreflang=["']${lang}["']`, 'i'),
  ];
  for (const re of patterns) {
    const match = html.match(re);
    if (match) {
      return match[1].replace('https://kidshealth.orghttps://', 'https://');
    }
  }
  return null;
}

function buildUrlCandidates(article, lang) {
  const urls = new Set();
  const existing = article.source?.urls?.[lang];
  const otherLang = lang === 'es' ? 'en' : 'es';
  const otherUrl = article.source?.urls?.[otherLang];

  if (existing) urls.add(existing);
  if (otherUrl) {
    urls.add(swapLangInUrl(otherUrl, lang));
    if (lang === 'en' && otherUrl.includes('-es.html')) {
      urls.add(swapLangInUrl(otherUrl, lang).replace('-es.html', '.html'));
    }
    if (lang === 'es' && !otherUrl.includes('-es.html')) {
      urls.add(swapLangInUrl(otherUrl, lang).replace('.html', '-es.html'));
    }
  }

  for (const slug of slugCandidates(article, lang)) {
    urls.add(`https://kidshealth.org/${lang}/kids/${slug}.html`);
    urls.add(`https://kidshealth.org/${lang}/kids/center/${slug}.html`);
    if (slug.endsWith('-center')) {
      urls.add(`https://kidshealth.org/${lang}/kids/center/${slug}.html`);
    }
  }

  return [...urls];
}

async function findUrlByTitle(article, lang, topic) {
  const title = article.es?.title || article.en?.title;
  if (!title) return null;

  if (!TITLE_SEARCH_CACHE[topic]) {
    const url = CATEGORY_URLS[lang]?.[CATEGORY]?.[topic];
    if (!url) return null;
    const { titleToId, byId } = await buildSlugMaps(
      CATEGORY_URLS.es[CATEGORY][topic],
      CATEGORY_URLS.en[CATEGORY][topic]
    );
    TITLE_SEARCH_CACHE[topic] = { titleToId, byId };
  }

  const { titleToId, byId } = TITLE_SEARCH_CACHE[topic];
  const normalized = normalizeTitle(title);
  let id = titleToId[lang][normalized];
  if (!id) {
    const partial = Object.entries(titleToId[lang]).find(
      ([key]) => key.includes(normalized) || normalized.includes(key)
    );
    id = partial?.[1];
  }
  if (id && byId[id]?.sourceUrl?.[lang]) return byId[id].sourceUrl[lang];
  return null;
}

async function resolveWorkingUrl(article, lang, topic) {
  const candidates = buildUrlCandidates(article, lang);
  const fromIndex = await findUrlByTitle(article, lang, topic);
  if (fromIndex) candidates.unshift(fromIndex);

  for (const url of candidates) {
    try {
      const html = await fetch(url);
      const text = extractArticleContent(html, url);
      const minLen =
        /movie|video|animation/i.test(url) || /movie$/i.test(article.id)
          ? 25
          : minContentLength(url);
      if (text.length >= minLen) {
        return { url, html, text };
      }
    } catch {
      // try next
    }
    await sleep(150);
  }
  return null;
}

function needsRefill(article, lang) {
  const description = article[lang]?.description?.trim();
  if (!description) return true;
  return /KidsHealth\.org/i.test(description) && /Nemours Foundation/i.test(description);
}

async function fillArticle(articleId, topic) {
  const filePath = path.join(ARTICLES_DIR, `${articleId}.json`);
  if (!fs.existsSync(filePath)) return { id: articleId, status: 'missing-file' };

  const article = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const result = { id: articleId, filled: [] };
  article.source = article.source || { name: 'kidshealth', urls: {} };

  for (const lang of ['es', 'en']) {
    if (!needsRefill(article, lang)) continue;

    if (lang === 'en' && article.source?.urls?.es) {
      try {
        const esHtml = await fetch(article.source.urls.es);
        const hreflangEn = getHreflangUrl(esHtml, 'en');
        if (hreflangEn) article.source.urls.en = hreflangEn;
      } catch {
        // try candidates below
      }
    }

    const resolved = await resolveWorkingUrl(article, lang, topic);
    if (!resolved) {
      result[lang] = 'not-found';
      continue;
    }

    const titleMatch = resolved.html.match(/<h1[^>]*>([^<]+)<\/h1>/);
    article.source.urls[lang] = resolved.url;
    article[lang] = article[lang] || {};
    if (titleMatch) article[lang].title = decodeHtmlEntities(titleMatch[1].trim());
    article[lang].description = resolved.text;
    result.filled.push(lang);
    await sleep(250);
  }

  if (result.filled.length > 0) {
    article.updatedAt = new Date().toISOString();
    fs.writeFileSync(filePath, JSON.stringify(article, null, 2), 'utf8');
  }

  return result;
}

async function main() {
  const articleTopics = new Map();
  for (const topic of CHILDREN_TOPICS) {
    const catalogPath = path.join(CONTENT_DIR, `${CATEGORY}-${topic}.json`);
    if (!fs.existsSync(catalogPath)) continue;
    const catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));
    for (const subtopic of catalog.subtopics) {
      for (const id of subtopic.articles) {
        if (!articleTopics.has(id)) articleTopics.set(id, topic);
      }
    }
  }

  const incomplete = [];
  for (const [id, topic] of articleTopics) {
    const filePath = path.join(ARTICLES_DIR, `${id}.json`);
    if (!fs.existsSync(filePath)) continue;
    const article = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const es = !needsRefill(article, 'es');
    const en = !needsRefill(article, 'en');
    if (!es || !en) incomplete.push({ id, topic, es, en });
  }

  console.log(`\n🔧 Completando ${incomplete.length} artículos children incompletos...\n`);

  let ok = 0;
  let partial = 0;
  let failed = 0;

  for (const item of incomplete) {
    console.log(`📄 ${item.id} (${item.topic})`);
    const result = await fillArticle(item.id, item.topic);
    if (result.filled?.length === 2 || (result.filled?.length === 1 && (item.es || item.en))) {
      ok++;
      console.log(`   ✅ ${result.filled.join(', ')}`);
    } else if (result.filled?.length === 1) {
      partial++;
      console.log(`   ⚠️  solo ${result.filled.join(', ')}`);
    } else {
      failed++;
      console.log(`   ❌ sin contenido (${result.es || ''} ${result.en || ''})`);
    }
  }

  console.log(`\n📊 Completados: ${ok} | Parciales: ${partial} | Fallidos: ${failed}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
