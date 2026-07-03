/**
 * Elimina del catálogo referencias a artículos que no existen en content/articles/.
 * Uso: node scripts/prune-catalogs.js
 */
const fs = require('fs');
const path = require('path');

const CONTENT_DIR = path.join(__dirname, '../content');
const ARTICLES_DIR = path.join(CONTENT_DIR, 'articles');

function pruneCatalog(catalogPath) {
  const catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));
  let removed = 0;

  for (const subtopic of catalog.subtopics) {
    const kept = [];
    for (const articleId of subtopic.articles) {
      const articlePath = path.join(ARTICLES_DIR, `${articleId}.json`);
      if (fs.existsSync(articlePath)) {
        kept.push(articleId);
      } else {
        removed++;
      }
    }
    subtopic.articles = kept;
  }

  if (removed > 0) {
    fs.writeFileSync(catalogPath, JSON.stringify(catalog, null, 2), 'utf8');
  }
  return removed;
}

function main() {
  const catalogs = fs.readdirSync(CONTENT_DIR).filter((f) => f.endsWith('.json') && f.includes('-'));
  let total = 0;
  for (const file of catalogs) {
    const removed = pruneCatalog(path.join(CONTENT_DIR, file));
    if (removed > 0) {
      console.log(`  ${file}: ${removed} referencias eliminadas`);
      total += removed;
    }
  }
  console.log(total > 0 ? `\n✅ ${total} referencias huérfanas eliminadas` : '\n✅ Catálogos sin referencias huérfanas');
}

main();
