const https = require('https');
const fs = require('fs');

function fetch(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        const next = res.headers.location.startsWith('http') ? res.headers.location : `https://kidshealth.org${res.headers.location}`;
        return fetch(next).then(resolve, reject);
      }
      let data = '';
      res.on('data', (c) => (data += c));
      res.on('end', () => resolve({ status: res.statusCode, data }));
    }).on('error', reject);
  });
}

async function main() {
  const { status, data } = await fetch('https://kidshealth.org/es/parents/general/');
  console.log('Status:', status, 'Length:', data.length);
  fs.writeFileSync('scripts/sample-general.html', data);

  const patterns = [
    /href="([^"]*parents[^"]*)"/g,
    /href='([^']*parents[^']*)'/g,
    /<a[^>]+href="([^"]+)"/g,
  ];

  for (const regex of patterns) {
    const found = new Set();
    let m;
    while ((m = regex.exec(data)) !== null) found.add(m[1]);
    console.log(regex.source.slice(0, 40), '=>', found.size);
    if (found.size > 0) console.log('  samples:', Array.from(found).slice(0, 8));
  }
}

main().catch(console.error);
