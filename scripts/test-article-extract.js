const https = require('https');

function fetch(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        const next = res.headers.location.startsWith('http') ? res.headers.location : `https://kidshealth.org${res.headers.location}`;
        return fetch(next).then(resolve, reject);
      }
      let data = '';
      res.on('data', (c) => (data += c));
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

function extractArticleContent(html) {
  // Try main content area patterns used by KidsHealth
  const patterns = [
    /<div[^>]*class="[^"]*kh-article-content[^"]*"[^>]*>([\s\S]*?)<\/div>\s*<div[^>]*class="[^"]*kh-article-footer/,
    /<div[^>]*id="content"[^>]*>([\s\S]*?)<\/div>\s*<div[^>]*class="[^"]*kh-article-footer/,
    /<article[^>]*>([\s\S]*?)<\/article>/,
  ];

  let content = '';
  for (const p of patterns) {
    const m = html.match(p);
    if (m) {
      content = m[1];
      break;
    }
  }

  if (!content) {
    const start = html.indexOf('<h1');
    const end = html.indexOf('kh-article-footer');
    if (start > -1 && end > start) content = html.slice(start, end);
  }

  if (!content) return '';

  return content
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
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
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/(\s*<br>\s*){3,}/gi, '<br><br>')
    .replace(/\s+/g, ' ')
    .trim();
}

async function main() {
  const urls = [
    'https://kidshealth.org/es/parents/medical.html',
    'https://kidshealth.org/es/parents/fever.html',
    'https://kidshealth.org/es/parents/fractures-heal.html',
  ];

  for (const url of urls) {
    const html = await fetch(url);
    const title = (html.match(/<h1[^>]*>([^<]+)<\/h1>/) || [])[1];
    const content = extractArticleContent(html);
    console.log('\n===', url, '===');
    console.log('Title:', title);
    console.log('Length:', content.length);
    console.log('Preview:', content.slice(0, 400));
  }
}

main().catch(console.error);
