/**
 * Corrige los últimos artículos parents incompletos y rellena EN/ES.
 */
const fs = require('fs');
const path = require('path');
const { fetch } = require('./content-utils');
const { extractArticleContent, minContentLength } = require('./article-extract');
const { decodeHtmlEntities } = require('./decode-html-entities');

const ARTICLES_DIR = path.join(__dirname, '../content/articles');

const PATCHES = {
  'action-plan-art': {
    urls: {
      es: 'https://kidshealth.org/es/parents/action-plan-art.html',
      en: 'https://kidshealth.org/en/parents/action-plan.html',
    },
  },
  'separation-anxiety': {
    urls: {
      es: 'https://kidshealth.org/es/parents/separation-anxiety.html',
      en: 'https://kidshealth.org/en/parents/sep-anxiety.html',
    },
  },
  sex: {
    urls: {
      es: 'https://kidshealth.org/es/parents/sex.html',
      en: 'https://kidshealth.org/en/parents/questions-sex.html',
    },
  },
  'products-crib': {
    urls: {
      es: 'https://kidshealth.org/es/parents/products-crib.html',
      en: 'https://kidshealth.org/en/parents/products-cribs.html',
    },
  },
  'safety-firearms': {
    urls: {
      es: 'https://kidshealth.org/es/parents/safety-firearms.html',
      en: 'https://kidshealth.org/en/parents/gun-safety.html',
    },
  },
  'doctor-visits': {
    urls: {
      es: 'https://kidshealth.org/es/parents/doctor-visits.html',
      en: 'https://kidshealth.org/en/parents/dr-visits.html',
    },
  },
  'travel-size-emergency-27': {
    urls: {
      es: 'https://kidshealth.org/es/parents/travel-size-emergency.html',
    },
    force: ['es', 'en'],
    enDescription:
      "The best time to prepare for an emergency is before one happens. Fill out this sheet and keep a copy in your wallet, purse, first-aid kit, and in each of your family's vehicles. Be sure to update it often to ensure quick, efficient medical care for your child.",
  },
  'travel-size-emergency': {
    urls: {
      es: 'https://kidshealth.org/es/parents/safety-skiing.html',
      en: 'https://kidshealth.org/en/parents/safety-skiing.html',
    },
    force: ['es'],
  },
  'article-7-5-ejercicios-en-casa': {
    urls: {
      es: 'https://kidshealth.org/es/parents/exercise.html',
      en: 'https://kidshealth.org/en/parents/exercise.html',
    },
    titles: {
      es: 'Los niños y el ejercicio',
      en: 'Kids and Exercise',
    },
  },
};

function getTitle(html) {
  const m = html.match(/<h1[^>]*>([^<]+)<\/h1>/);
  return m ? m[1].trim() : null;
}

async function fillFromUrl(article, lang, url) {
  const html = await fetch(url);
  const text = extractArticleContent(html, url);
  if (text.length < minContentLength(url)) {
    throw new Error(`Contenido insuficiente (${text.length} chars) en ${url}`);
  }
  article.source.urls[lang] = url;
  article[lang] = article[lang] || {};
  const title = getTitle(html);
  if (title) article[lang].title = decodeHtmlEntities(title);
  article[lang].description = text;
}

async function findEnAlternate(esUrl) {
  const html = await fetch(esUrl);
  const patterns = [
    /<link[^>]+hreflang=["']en["'][^>]+href=["']([^"']+)["']/i,
    /<link[^>]+href=["']([^"']+)["'][^>]+hreflang=["']en["']/i,
  ];
  for (const re of patterns) {
    const m = html.match(re);
    if (m) return m[1];
  }
  return null;
}

async function main() {
  for (const [id, patch] of Object.entries(PATCHES)) {
    const filePath = path.join(ARTICLES_DIR, `${id}.json`);
    if (!fs.existsSync(filePath)) {
      console.log(`❌ ${id}: archivo no encontrado`);
      continue;
    }

    const article = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    article.source = article.source || { name: 'kidshealth', urls: {} };
    article.source.urls = article.source.urls || {};

    if (patch.urls) Object.assign(article.source.urls, patch.urls);
    if (patch.titles) {
      for (const [lang, title] of Object.entries(patch.titles)) {
        article[lang] = article[lang] || {};
        article[lang].title = title;
      }
    }

    for (const lang of ['es', 'en']) {
      const force = patch.force?.includes(lang);
      if (!force && article[lang]?.description?.trim()) continue;
      if (lang === 'en' && patch.enDescription) {
        article[lang] = article[lang] || {};
        article[lang].description = patch.enDescription;
        console.log(`✅ ${id} [${lang}] (printable fallback)`);
        continue;
      }
      let url = article.source.urls[lang];
      if (!url && lang === 'en' && article.source.urls.es) {
        url = await findEnAlternate(article.source.urls.es);
        if (url) article.source.urls.en = url;
      }
      if (!url) {
        console.log(`⚠️  ${id}: sin URL ${lang}`);
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
