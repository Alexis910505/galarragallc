/**
 * Rellena descripciones vacías en content/articles/*.json desde KidsHealth.
 * Uso: node scripts/fill-content-json.js --lang en
 */
const fs = require('fs');
const path = require('path');
const { fetch } = require('./content-utils');
const { decodeHtmlEntities } = require('./decode-html-entities');

const ARTICLES_DIR = path.join(__dirname, '../content/articles');

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function extractArticleContent(html) {
  const articleMatch = html.match(
    /<div[^>]*id="khcontent_article"[^>]*>([\s\S]*?)(?:<section class="video-playlist-container"|<div[^>]*class="[^"]*video-playlist-container)/
  );

  let content = '';
  if (articleMatch) {
    content = articleMatch[1];
  } else {
    const startIdx = html.indexOf('id="khcontent_article"');
    const endIdx = html.indexOf('class="video-playlist-container"');
    if (startIdx === -1) return '';
    const openTagEnd = html.indexOf('>', startIdx);
    content = html.slice(openTagEnd + 1, endIdx > openTagEnd ? endIdx : undefined);
  }

  content = content.replace(/<ul id="msArticleControls">[\s\S]*?<\/ul>/i, '');
  content = content.replace(/<!--[\s\S]*?-->/g, '');

  const converted = content
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<img[^>]*>/gi, '')
    .replace(/<h2[^>]*>/gi, '<br><br>')
    .replace(/<\/h2>/gi, '')
    .replace(/<h3[^>]*>/gi, '<br>')
    .replace(/<\/h3>/gi, '')
    .replace(/<h4[^>]*>/gi, '<br>')
    .replace(/<\/h4>/gi, '')
    .replace(/<li[^>]*>/gi, '<br>• ')
    .replace(/<\/li>/gi, '')
    .replace(/<br\s*\/?>/gi, '<br>')
    .replace(/<\/p>/gi, '<br><br>')
    .replace(/<p[^>]*>/gi, '')
    .replace(/<a[^>]*>/gi, '')
    .replace(/<\/a>/gi, '')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"');

  return cleanScrapedText(converted);
}

function cleanScrapedText(text) {
  if (!text) return '';
  const footerMarkers = [
    'Revisor médico:',
    'Medical reviewer:',
    'MÁS SOBRE ESTE TEMA',
    'MORE ON THIS TOPIC',
    'Quiénes somos',
    'Who We Are',
    '/content/kidshealth/misc/medicalcodes/',
  ];
  let cleaned = text;
  for (const marker of footerMarkers) {
    const idx = cleaned.indexOf(marker);
    if (idx > 0) cleaned = cleaned.slice(0, idx);
  }
  return cleaned
    .replace(/^id="khcontent_article"[^>]*>\s*-->\s*/i, '')
    .replace(/\s*-->\s*-->\s*/g, '<br><br>')
    .replace(/\s*-->\s*/g, ' ')
    .replace(/<section[\s\S]*$/i, '')
    .replace(/(\s*<br>\s*){3,}/gi, '<br><br>')
    .replace(/\s+/g, ' ')
    .trim();
}

function parseArgs() {
  const args = process.argv.slice(2);
  const opts = { lang: 'en', force: false, category: null, topic: null };
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--lang') opts.lang = args[++i];
    else if (args[i] === '--force') opts.force = true;
    else if (args[i] === '--category') opts.category = args[++i];
    else if (args[i] === '--topic') opts.topic = args[++i];
  }
  return opts;
}

function matchesFilter(article, opts) {
  if (opts.category && article.category !== opts.category) return false;
  if (opts.topic && article.topic !== opts.topic) return false;
  return true;
}

async function main() {
  const opts = parseArgs();
  const files = fs.readdirSync(ARTICLES_DIR).filter((f) => f.endsWith('.json'));
  let filled = 0;
  let skipped = 0;
  let failed = 0;

  const filterLabel = opts.category || opts.topic
    ? ` (${[opts.category, opts.topic].filter(Boolean).join(' / ')})`
    : '';
  console.log(`\n📥 Rellenando content/articles (${opts.lang})${filterLabel}\n`);

  for (const file of files) {
    const filePath = path.join(ARTICLES_DIR, file);
    if (!fs.existsSync(filePath)) {
      skipped++;
      continue;
    }
    let article;
    try {
      article = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    } catch {
      failed++;
      continue;
    }

    if (!matchesFilter(article, opts)) {
      continue;
    }
    const url = article.source?.urls?.[opts.lang];

    if (!url) {
      skipped++;
      continue;
    }

    const hasContent = article[opts.lang]?.description?.trim();
    if (hasContent && !opts.force) {
      skipped++;
      continue;
    }

    try {
      console.log(`  📄 ${article.id}`);
      await sleep(300);
      const html = await fetch(url);
      const titleMatch = html.match(/<h1[^>]*>([^<]+)<\/h1>/);
      const description = extractArticleContent(html);

      if (!description || description.length < 80) {
        console.log(`     ⚠️  Contenido muy corto (${description.length} chars)`);
        failed++;
        continue;
      }

      article[opts.lang] = article[opts.lang] || {};
      if (titleMatch) article[opts.lang].title = decodeHtmlEntities(titleMatch[1].trim());
      article[opts.lang].description = description;
      article.updatedAt = new Date().toISOString();

      fs.writeFileSync(filePath, JSON.stringify(article, null, 2), 'utf8');
      filled++;
      console.log(`     ✅ ${description.length} caracteres`);
    } catch (err) {
      console.log(`     ❌ ${err.message}`);
      failed++;
    }
  }

  console.log(`\n📊 ${filled} rellenados, ${skipped} omitidos, ${failed} fallidos`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
