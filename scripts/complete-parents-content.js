/**
 * Completa artículos parents incompletos (ES + EN) al 100%.
 * Uso: node scripts/complete-parents-content.js
 */
const fs = require('fs');
const path = require('path');
const { fetch, normalizeTitle, buildSlugMaps } = require('./content-utils');
const { CATEGORY_URLS, PARENT_TOPICS } = require('./category-urls');
const { extractArticleContent, minContentLength } = require('./article-extract');
const { decodeHtmlEntities } = require('./decode-html-entities');

const CONTENT_DIR = path.join(__dirname, '../content');
const ARTICLES_DIR = path.join(CONTENT_DIR, 'articles');

const SLUG_ALIASES = {
  nightmares: { en: 'nightmare' },
  'blood-types-es': { en: 'blood-types', es: 'blood-types-es' },
  'article-7-5-ejercicios-en-casa': { es: 'exercise', en: 'exercise' },
  'child-humor': { en: 'humor' },
  hear: { es: 'hear', en: 'hear' },
};

const URL_OVERRIDES = {
  es: {
    'travel-size-emergency': 'https://kidshealth.org/es/parents/safety-skiing.html',
    'article-7-5-ejercicios-en-casa': 'https://kidshealth.org/es/parents/exercise.html',
  },
  en: {
    'action-plan-art': 'https://kidshealth.org/en/parents/action-plan.html',
    'separation-anxiety': 'https://kidshealth.org/en/parents/sep-anxiety.html',
    sex: 'https://kidshealth.org/en/parents/questions-sex.html',
    'products-crib': 'https://kidshealth.org/en/parents/products-cribs.html',
    'safety-firearms': 'https://kidshealth.org/en/parents/gun-safety.html',
    'doctor-visits': 'https://kidshealth.org/en/parents/dr-visits.html',
    'travel-size-emergency': 'https://kidshealth.org/en/parents/safety-skiing.html',
    'article-7-5-ejercicios-en-casa': 'https://kidshealth.org/en/parents/exercise.html',
  },
};

const PRINTABLE_EN_DESCRIPTIONS = {
  'travel-size-emergency-27':
    'The best time to prepare for an emergency is before one happens. Fill out this sheet and keep a copy in your wallet, purse, first-aid kit, and in each of your family\'s vehicles. Be sure to update it often to ensure quick, efficient medical care for your child.',
};

const TITLE_SEARCH_CACHE = {};

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function getCatalogArticleIds() {
  const ids = new Set();
  for (const topic of PARENT_TOPICS) {
    const catalog = JSON.parse(
      fs.readFileSync(path.join(CONTENT_DIR, `parents-${topic}.json`), 'utf8')
    );
    for (const subtopic of catalog.subtopics) {
      for (const id of subtopic.articles) ids.add(id);
    }
  }
  return [...ids];
}

function swapLangInUrl(url, lang) {
  return url.replace(/\/(es|en)\//, `/${lang}/`);
}

function slugCandidates(article, lang) {
  const id = article.id;
  const aliases = SLUG_ALIASES[id]?.[lang];
  const slugs = new Set([id, id.replace(/-es$/, ''), aliases].filter(Boolean));

  const title = article[lang === 'es' ? 'es' : 'en']?.title || article.es?.title || article.en?.title;
  if (title) {
    const normalized = title
      .toLowerCase()
      .replace(/^breve resumen:\s*/i, '')
      .replace(/^las vacunas de su hijo:\s*/i, '')
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
    if (match) return match[1];
  }
  return null;
}

function buildUrlCandidates(article, lang) {
  const urls = new Set();
  const existing = article.source?.urls?.[lang];
  const otherLang = lang === 'es' ? 'en' : 'es';
  const otherUrl = article.source?.urls?.[otherLang];
  const override = URL_OVERRIDES[lang]?.[article.id];

  if (override) urls.add(override);
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
    urls.add(`https://kidshealth.org/${lang}/parents/${slug}.html`);
    urls.add(`https://kidshealth.org/${lang}/parents/center/${slug}.html`);
    if (slug.endsWith('-center')) {
      urls.add(`https://kidshealth.org/${lang}/parents/center/${slug}.html`);
    }
  }

  return [...urls];
}

async function findUrlByTitle(article, lang, topic) {
  const title = article.es?.title || article.en?.title;
  if (!title) return null;

  if (!TITLE_SEARCH_CACHE[topic]) {
    const url = CATEGORY_URLS[lang]?.parents?.[topic];
    if (!url) return null;
    const { titleToId, byId } = await buildSlugMaps(
      CATEGORY_URLS.es.parents[topic],
      CATEGORY_URLS.en.parents[topic]
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
      if (text.length >= minContentLength(url)) {
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

    if (lang === 'en' && PRINTABLE_EN_DESCRIPTIONS[articleId]) {
      article[lang] = article[lang] || {};
      article[lang].description = PRINTABLE_EN_DESCRIPTIONS[articleId];
      result.filled.push(lang);
      continue;
    }

    if (lang === 'en' && article.source?.urls?.es && !URL_OVERRIDES.en[articleId]) {
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
  for (const topic of PARENT_TOPICS) {
    const catalog = JSON.parse(
      fs.readFileSync(path.join(CONTENT_DIR, `parents-${topic}.json`), 'utf8')
    );
    for (const subtopic of catalog.subtopics) {
      for (const id of subtopic.articles) {
        if (!articleTopics.has(id)) articleTopics.set(id, topic);
      }
    }
  }

  const incomplete = [];
  for (const id of articleTopics.keys()) {
    const filePath = path.join(ARTICLES_DIR, `${id}.json`);
    if (!fs.existsSync(filePath)) continue;
    const article = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const es = !needsRefill(article, 'es');
    const en = !needsRefill(article, 'en');
    if (!es || !en) incomplete.push({ id, topic: articleTopics.get(id), es, en });
  }

  console.log(`\n🔧 Completando ${incomplete.length} artículos parents incompletos...\n`);

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

  require('child_process').execSync('node scripts/build-topic-bundle.js', {
    cwd: path.join(__dirname, '..'),
    stdio: 'inherit',
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
