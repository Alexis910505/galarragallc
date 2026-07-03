const fs = require('fs');
const { fetch } = require('./content-utils');
const { extractArticleContent } = require('./article-extract');

const ids = [
  'action-plan-art',
  'separation-anxiety',
  'sex',
  'products-crib',
  'safety-firearms',
  'travel-size-emergency',
  'doctor-visits',
  'article-7-5-ejercicios-en-casa',
];

(async () => {
  for (const id of ids) {
    const a = JSON.parse(fs.readFileSync(`content/articles/${id}.json`, 'utf8'));
    const u = a.source?.urls?.es;
    if (!u) {
      console.log(id, 'no es url');
      continue;
    }
    const h = await fetch(u);
    const alt = h.match(/hreflang="en" href="([^"]+)"/);
    const enLink = h.match(/in English: <a href="([^"]+)"/);
    const enUrl = (alt?.[1] || enLink?.[1] || '').replace('https://kidshealth.orghttps://', 'https://');
    console.log(id, '->', enUrl || 'no alt');
    if (enUrl) {
      try {
        const html = await fetch(enUrl);
        const text = extractArticleContent(html, enUrl);
        console.log('  chars', text.length);
      } catch (e) {
        console.log('  fetch fail', e.message);
      }
    }
  }
})();
