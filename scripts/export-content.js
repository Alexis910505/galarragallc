/**
 * Exporta contenido bilingüe a content/ para reutilizar en otra web.
 * Uso: node scripts/export-content.js --category parents --topic generalHealth
 */
const fs = require('fs');
const path = require('path');
const {
  slugify,
  buildSlugMaps,
  getItemsFromSubtopic,
  resolveArticleMeta,
} = require('./content-utils');
const { CATEGORY_URLS } = require('./category-urls');

const CONTENT_DIR = path.join(__dirname, '../content');
const ARTICLES_DIR = path.join(CONTENT_DIR, 'articles');

function parseArgs() {
  const args = process.argv.slice(2);
  const opts = { category: 'parents', topic: 'generalHealth' };
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--category') opts.category = args[++i];
    else if (args[i] === '--topic') opts.topic = args[++i];
  }
  return opts;
}

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

async function main() {
  const opts = parseArgs();
  const { translations } = require('../src/translations.js');

  const topicEs = translations.es?.featuredTopics?.categories?.[opts.category]?.topics?.[opts.topic];
  const topicEn = translations.en?.featuredTopics?.categories?.[opts.category]?.topics?.[opts.topic];

  if (!topicEs) {
    console.error('Tema no encontrado en español');
    process.exit(1);
  }

  const urlEs = CATEGORY_URLS.es[opts.category]?.[opts.topic];
  const urlEn = CATEGORY_URLS.en[opts.category]?.[opts.topic];
  if (!urlEs || !urlEn) {
    console.error(`URLs no configuradas para ${opts.category} / ${opts.topic}`);
    process.exit(1);
  }

  const { byId, titleToId } = await buildSlugMaps(urlEs, urlEn);

  ensureDir(ARTICLES_DIR);

  const catalog = {
    version: 1,
    source: 'kidshealth',
    exportedAt: new Date().toISOString(),
    category: opts.category,
    topic: opts.topic,
    title: {
      es: topicEs.title,
      en: topicEn?.title || '',
    },
    description: {
      es: topicEs.description,
      en: topicEn?.description || '',
    },
    subtopics: [],
  };

  const usedIds = new Set();
  let exported = 0;

  topicEs.subtopics.forEach((subEs, subIndex) => {
    const subEn = topicEn?.subtopics?.[subIndex];
    const subtopicId = slugify(subEs.title);

    const itemsEs = getItemsFromSubtopic(subEs);
    const itemsEn = subEn ? getItemsFromSubtopic(subEn) : [];

    const articleIds = [];

    itemsEs.forEach((itemEs, itemIndex) => {
      const itemEn = itemsEn[itemIndex] || { title: '', description: '' };
      const { id: articleId, meta } = resolveArticleMeta(
        itemEs,
        itemEn,
        titleToId,
        byId,
        subIndex,
        itemIndex
      );

      const finalId = usedIds.has(articleId) ? `${articleId}-${itemIndex + 1}` : articleId;
      usedIds.add(finalId);
      articleIds.push(finalId);

      const metaResolved = byId[articleId] || meta;

      const existingPath = path.join(ARTICLES_DIR, `${finalId}.json`);
      const existing = fs.existsSync(existingPath)
        ? JSON.parse(fs.readFileSync(existingPath, 'utf8'))
        : null;

      const article = {
        id: finalId,
        category: opts.category,
        topic: opts.topic,
        subtopicId,
        es: {
          title: itemEs.title,
          description: itemEs.description?.trim() || existing?.es?.description || '',
        },
        en: {
          title: itemEn.title || existing?.en?.title || '',
          description: itemEn.description?.trim() || existing?.en?.description || '',
        },
        source: {
          name: 'kidshealth',
          urls: { ...metaResolved.sourceUrl, ...(existing?.source?.urls || {}) },
        },
        updatedAt: new Date().toISOString(),
      };

      fs.writeFileSync(
        path.join(ARTICLES_DIR, `${finalId}.json`),
        JSON.stringify(article, null, 2),
        'utf8'
      );
      exported++;
    });

    catalog.subtopics.push({
      id: subtopicId,
      title: {
        es: subEs.title,
        en: subEn?.title || '',
      },
      articles: articleIds,
    });
  });

  fs.writeFileSync(
    path.join(CONTENT_DIR, `${opts.category}-${opts.topic}.json`),
    JSON.stringify(catalog, null, 2),
    'utf8'
  );

  const withEs = exported;
  let esContent = 0;
  let enContent = 0;
  for (const file of fs.readdirSync(ARTICLES_DIR)) {
    const a = JSON.parse(fs.readFileSync(path.join(ARTICLES_DIR, file), 'utf8'));
    if (a.es?.description?.trim()) esContent++;
    if (a.en?.description?.trim()) enContent++;
  }

  console.log(`\n✅ Exportado: ${opts.category} / ${opts.topic}`);
  console.log(`   Catálogo: content/${opts.category}-${opts.topic}.json`);
  console.log(`   Artículos: ${exported} archivos en content/articles/`);
  console.log(`   Con contenido ES: ${esContent} | Con contenido EN: ${enContent}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
