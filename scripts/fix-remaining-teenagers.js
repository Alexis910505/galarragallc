const fs = require('fs');
const path = require('path');
const { fetch } = require('./content-utils');
const { extractArticleContent, minContentLength } = require('./article-extract');
const { decodeHtmlEntities } = require('./decode-html-entities');

const ARTICLES_DIR = path.join(__dirname, '../content/articles');

const TEEN_BASE = 'https://kidshealth.org';
const ARCHIVE = {
  'culture-shock': 'https://web.archive.org/web/2018id_/https://kidshealth.org/en/teens/culture-shock.html',
  'tell-parents': 'https://web.archive.org/web/2018id_/https://kidshealth.org/en/teens/tell-parents.html',
  'phelps-coach': 'https://web.archive.org/web/2020id_/https://kidshealth.org/en/teens/phelps-coach.html',
};

function teenUrl(lang, slug) {
  return `${TEEN_BASE}/${lang}/teens/${slug}.html`;
}

const PATCHES = {
  'article-2-13-lesiones-de-rodilla': {
    urls: { es: teenUrl('es', 'knee-injuries'), en: teenUrl('en', 'knee-injuries') },
  },
  'article-6-37-lesiones-de-rodilla': {
    urls: { es: teenUrl('es', 'knee-injuries'), en: teenUrl('en', 'knee-injuries') },
  },
  'article-2-14-lesiones-de-rodilla': {
    urls: { es: teenUrl('es', 'knee-injuries'), en: teenUrl('en', 'knee-injuries') },
  },
  'flu-tips': {
    urls: { es: teenUrl('es', 'flu-tips'), en: teenUrl('en', 'flu') },
  },
  'flu-tips-8': {
    urls: { es: teenUrl('es', 'flu-tips'), en: teenUrl('en', 'flu') },
  },
  'flu-tips-12': {
    urls: { es: teenUrl('es', 'flu-tips'), en: teenUrl('en', 'flu') },
  },
  'culture-shock': {
    urls: { es: teenUrl('es', 'culture-shock'), en: ARCHIVE['culture-shock'] },
    forceLangs: ['en'],
  },
  'tell-parents': {
    urls: { es: teenUrl('es', 'tell-parents'), en: ARCHIVE['tell-parents'] },
    forceLangs: ['en'],
  },
  'tell-parents-17': {
    urls: { es: teenUrl('es', 'tell-parents'), en: ARCHIVE['tell-parents'] },
    forceLangs: ['en'],
  },
  'phelps-coach-3': {
    urls: { es: teenUrl('es', 'phelps-coach'), en: ARCHIVE['phelps-coach'] },
    forceLangs: ['en'],
  },
  'phelps-coach-24': {
    urls: { es: teenUrl('es', 'phelps-coach'), en: ARCHIVE['phelps-coach'] },
    forceLangs: ['en'],
  },
  'phelps-coach-13': {
    urls: { es: teenUrl('es', 'safety-lacrosse'), en: teenUrl('en', 'safety-lacrosse') },
    forceLangs: ['es', 'en'],
  },
  'phelps-coach-15': {
    urls: { es: teenUrl('es', 'safety-swimming'), en: teenUrl('en', 'safety-swimming') },
    forceLangs: ['es', 'en'],
  },
  'phelps-coach-16': {
    urls: { es: teenUrl('es', 'safety-inline'), en: teenUrl('en', 'safety-inline') },
    forceLangs: ['es', 'en'],
  },
  'phelps-coach-17': {
    urls: { es: teenUrl('es', 'safety-skateboarding'), en: teenUrl('en', 'safety-skateboarding') },
    forceLangs: ['es', 'en'],
  },
  'phelps-coach-18': {
    urls: { es: teenUrl('es', 'safety-snowboarding'), en: teenUrl('en', 'safety-snowboarding') },
    forceLangs: ['es', 'en'],
  },
  'phelps-coach-20': {
    urls: { es: teenUrl('es', 'safety-snowboarding'), en: teenUrl('en', 'safety-snowboarding') },
    forceLangs: ['es', 'en'],
  },
  'phelps-coach-32': {
    urls: { es: teenUrl('es', 'runners-knee'), en: teenUrl('en', 'runners-knee') },
    forceLangs: ['es', 'en'],
  },
};

function getTitle(html) {
  const m = html.match(/<h1[^>]*>([^<]+)<\/h1>/);
  return m ? m[1].trim() : null;
}

function sourceUrlForExtract(url) {
  const match = url.match(/kidshealth\.org\/(en|es)\/teens\/[^/]+\.html/);
  return match ? `https://${match[0]}` : url;
}

async function fillFromUrl(article, lang, url) {
  const html = await fetch(url);
  const extractUrl = sourceUrlForExtract(url);
  const text = extractArticleContent(html, extractUrl);
  const min = minContentLength(extractUrl);
  if (text.length < min) {
    throw new Error(`Contenido insuficiente (${text.length} chars) en ${url}`);
  }
  article.source.urls[lang] = url.includes('web.archive.org')
    ? extractUrl
    : url;
  article[lang] = article[lang] || {};
  const title = getTitle(html);
  if (title) article[lang].title = decodeHtmlEntities(title);
  article[lang].description = text;
}

function needsFill(article, lang, patch) {
  const len = article[lang]?.description?.trim().length || 0;
  if (patch.forceLangs?.includes(lang)) return true;
  return len < 80;
}

async function main() {
  for (const [id, patch] of Object.entries(PATCHES)) {
    const filePath = path.join(ARTICLES_DIR, `${id}.json`);
    if (!fs.existsSync(filePath)) {
      console.log(`❌ ${id}: no encontrado`);
      continue;
    }

    const article = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    article.source = article.source || { name: 'kidshealth', urls: {} };
    if (patch.urls) Object.assign(article.source.urls, patch.urls);

    for (const lang of ['es', 'en']) {
      if (!needsFill(article, lang, patch)) continue;
      const url = patch.urls?.[lang];
      if (!url) {
        console.log(`⚠️  ${id} [${lang}]: sin URL`);
        continue;
      }
      try {
        await fillFromUrl(article, lang, url);
        console.log(`✅ ${id} [${lang}]`);
      } catch (err) {
        console.log(`❌ ${id} [${lang}]: ${err.message}`);
      }
    }

    article.updatedAt = new Date().toISOString();
    fs.writeFileSync(filePath, JSON.stringify(article, null, 2), 'utf8');
  }

  require('child_process').execSync('node scripts/build-topic-bundle.js', {
    cwd: path.join(__dirname, '..'),
    stdio: 'inherit',
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
