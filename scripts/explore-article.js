const https = require('https');
const fs = require('fs');

function fetch(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      let data = '';
      res.on('data', (c) => (data += c));
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

async function main() {
  const html = await fetch('https://kidshealth.org/es/parents/fever.html');
  fs.writeFileSync('scripts/sample-article.html', html);
  const classes = [...html.matchAll(/class="([^"]+)"/g)].map((m) => m[1]);
  const unique = [...new Set(classes)].filter((c) => /article|content|body|text/i.test(c));
  console.log('Relevant classes:', unique.slice(0, 30));
  console.log('Has kh-article:', html.includes('kh-article'));
  console.log('Has article-body:', html.includes('article-body'));
  const idx = html.indexOf('temperatura');
  console.log('Context around temperatura:', html.slice(Math.max(0, idx - 100), idx + 300));
}

main();
