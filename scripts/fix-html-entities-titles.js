/**
 * Corrige entidades HTML en títulos de content/articles/*.json
 * Uso: node scripts/fix-html-entities-titles.js
 */
const fs = require('fs');
const path = require('path');
const { decodeHtmlEntities } = require('./decode-html-entities');

const ARTICLES_DIR = path.join(__dirname, '../content/articles');
let fixed = 0;

for (const file of fs.readdirSync(ARTICLES_DIR).filter((f) => f.endsWith('.json'))) {
  const filePath = path.join(ARTICLES_DIR, file);
  const article = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  let changed = false;

  for (const lang of ['es', 'en']) {
    const title = article[lang]?.title;
    if (!title) continue;
    const decoded = decodeHtmlEntities(title);
    if (decoded !== title) {
      article[lang].title = decoded;
      changed = true;
    }
  }

  if (changed) {
    article.updatedAt = new Date().toISOString();
    fs.writeFileSync(filePath, JSON.stringify(article, null, 2), 'utf8');
    fixed++;
  }
}

console.log(`✅ ${fixed} artículos con títulos corregidos`);

require('child_process').execSync('node scripts/build-topic-bundle.js', {
  cwd: path.join(__dirname, '..'),
  stdio: 'inherit',
});
