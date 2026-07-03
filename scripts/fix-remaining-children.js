const fs = require('fs');
const path = require('path');
const { fetch } = require('./content-utils');
const { extractArticleContent, minContentLength } = require('./article-extract');
const { decodeHtmlEntities } = require('./decode-html-entities');

const ARTICLES_DIR = path.join(__dirname, '../content/articles');

const PATCHES = {
  'nails-nosw': {
    urls: {
      es: 'https://kidshealth.org/es/kids/nails-nosw.html',
      en: 'https://kidshealth.org/en/kids/your-nails.html',
    },
  },
  msmovie: {
    urls: {
      es: 'https://kidshealth.org/es/kids/msmovie.html',
      en: 'https://kidshealth.org/en/kids/msmovie.html',
    },
    allowShort: true,
  },
  'fractures-greenstick-es': {
    urls: {
      es: 'https://kidshealth.org/es/kids/fractures-greenstick-es.html',
      en: 'https://kidshealth.org/en/kids/broken-bones.html',
    },
  },
  'ecoli-1': {
    urls: {
      es: 'https://kidshealth.org/es/kids/ecoli.html',
      en: 'https://kidshealth.org/en/parents/ecoli.html',
    },
  },
  cavities: {
    urls: {
      es: 'https://kidshealth.org/es/kids/cavities.html',
      en: 'https://kidshealth.org/en/kids/cavity.html',
    },
  },
  'h1n1-spread': {
    urls: {
      es: 'https://kidshealth.org/es/kids/h1n1-spread.html',
      en: 'https://kidshealth.org/en/kids/flu-spread.html',
    },
  },
  'h1n1-spread-13': {
    urls: {
      es: 'https://kidshealth.org/es/kids/h1n1-spread.html',
      en: 'https://kidshealth.org/en/kids/flu-spread.html',
    },
  },
  'h1n1-spread-22': {
    urls: {
      es: 'https://kidshealth.org/es/kids/h1n1-spread.html',
      en: 'https://kidshealth.org/en/kids/flu-spread.html',
    },
  },
  'article-1-11-herpes-labial': {
    urls: {
      es: 'https://kidshealth.org/es/kids/cold-sores.html',
      en: 'https://kidshealth.org/en/kids/cold-sores.html',
    },
  },
  'article-4-8-fiebre': {
    urls: {
      es: 'https://kidshealth.org/es/kids/fever.html',
      en: 'https://kidshealth.org/en/kids/fever.html',
    },
  },
  'article-4-18-que-es-la-fiebre': {
    urls: {
      es: 'https://kidshealth.org/es/kids/fever.html',
      en: 'https://kidshealth.org/en/kids/fever.html',
    },
  },
};

function getTitle(html) {
  const m = html.match(/<h1[^>]*>([^<]+)<\/h1>/);
  return m ? m[1].trim() : null;
}

async function fillFromUrl(article, lang, url, allowShort) {
  const html = await fetch(url);
  const text = extractArticleContent(html, url);
  const min = allowShort || /movie|video|animation/i.test(url) ? 25 : minContentLength(url);
  if (text.length < min) {
    throw new Error(`Contenido insuficiente (${text.length} chars) en ${url}`);
  }
  article.source.urls[lang] = url;
  article[lang] = article[lang] || {};
  const title = getTitle(html);
  if (title) article[lang].title = decodeHtmlEntities(title);
  article[lang].description = text;
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
      if (article[lang]?.description?.trim()) continue;
      const url = article.source.urls[lang];
      if (!url) {
        console.log(`⚠️  ${id} [${lang}]: sin URL`);
        continue;
      }
      try {
        await fillFromUrl(article, lang, url, patch.allowShort);
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
