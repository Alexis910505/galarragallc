/**
 * Genera bundles de contenido bilingüe para la app.
 * Uso: node scripts/build-topic-bundle.js
 */
const fs = require('fs');
const path = require('path');

const CONTENT_DIR = path.join(__dirname, '../content');
const OUT_DIR = path.join(__dirname, '../src/generated');

function buildBundle(catalogPath) {
  const catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));
  const articles = catalog.subtopics.map((subtopic) => ({
    id: subtopic.id,
    title: subtopic.title,
    items: subtopic.articles.map((articleId) => {
      const articlePath = path.join(CONTENT_DIR, 'articles', `${articleId}.json`);
      if (!fs.existsSync(articlePath)) return null;
      const article = JSON.parse(fs.readFileSync(articlePath, 'utf8'));
      return {
        id: article.id,
        es: article.es,
        en: article.en,
      };
    }).filter(Boolean),
  }));

  return {
    category: catalog.category,
    topic: catalog.topic,
    title: catalog.title,
    description: catalog.description,
    subtopics: articles,
    builtAt: new Date().toISOString(),
  };
}

function main() {
  ensureDir(OUT_DIR);
  const catalogs = fs.readdirSync(CONTENT_DIR).filter((f) => f.endsWith('.json') && f.includes('-'));

  const indexByCategory = {};

  for (const file of catalogs) {
    const bundle = buildBundle(path.join(CONTENT_DIR, file));
    const outName = `${bundle.category}-${bundle.topic}.json`;
    fs.writeFileSync(path.join(OUT_DIR, outName), JSON.stringify(bundle, null, 2), 'utf8');
    console.log(`✅ ${outName} — ${bundle.subtopics.length} subtemas`);

    if (!indexByCategory[bundle.category]) {
      indexByCategory[bundle.category] = [];
    }
    if (!indexByCategory[bundle.category].includes(bundle.topic)) {
      indexByCategory[bundle.category].push(bundle.topic);
    }
  }

  for (const [category, topics] of Object.entries(indexByCategory)) {
    const indexContent = [
      ...topics.map((topic) => `import ${topic} from './${category}-${topic}.json';`),
      '',
      `export const ${category} = { ${topics.join(', ')} };`,
      '',
    ].join('\n');
    fs.writeFileSync(path.join(OUT_DIR, `${category}-index.js`), indexContent, 'utf8');
    console.log(`✅ ${category}-index.js — ${topics.length} temas`);
  }
}

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

main();
