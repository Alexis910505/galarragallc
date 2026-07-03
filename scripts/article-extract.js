const { fetch } = require('./content-utils');

function htmlToText(html) {
  return html
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

function extractArticleBlock(html) {
  const articleMatch = html.match(
    /<div[^>]*id="khcontent_article"[^>]*>([\s\S]*?)(?:<section class="video-playlist-container"|<div[^>]*class="[^"]*video-playlist-container)/
  );

  if (articleMatch) return articleMatch[1];

  const startIdx = html.indexOf('id="khcontent_article"');
  if (startIdx === -1) return '';
  const openTagEnd = html.indexOf('>', startIdx);
  const endIdx = html.indexOf('class="video-playlist-container"');
  return html.slice(openTagEnd + 1, endIdx > openTagEnd ? endIdx : undefined);
}

function extractCenterBlock(html) {
  const mainMatch = html.match(/<main[^>]*id="khMSMain"[^>]*>([\s\S]*?)<\/main>/i);
  return mainMatch ? mainMatch[1] : '';
}

function extractMetaDescription(html) {
  const meta =
    html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i) ||
    html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*name=["']description["']/i) ||
    html.match(/<meta[^>]*name=["']kh:pageDescription["'][^>]*content=["']([^"']+)["']/i);
  return meta?.[1]?.trim() || '';
}

function isPrintableImagePage(html) {
  return /\/printables\//i.test(html) && /<img[^>]+printables/i.test(html);
}

function isLowQualityScrape(text) {
  return (
    /KidsHealth\.org/i.test(text) &&
    /Nemours Foundation/i.test(text) &&
    text.length < 500
  );
}

function extractArticleContent(html, url = '') {
  let content = extractArticleBlock(html);
  if (!content.trim()) {
    content = extractCenterBlock(html);
  }

  content = content.replace(/<ul id="msArticleControls">[\s\S]*?<\/ul>/i, '');
  content = content.replace(/<!--[\s\S]*?-->/g, '');

  const converted = cleanScrapedText(htmlToText(content));
  const metaDescription = extractMetaDescription(html);

  if (isPrintableImagePage(html) || isLowQualityScrape(converted)) {
    if (metaDescription.length >= 40) return metaDescription;
  }

  if (converted.length >= 80) return converted;

  if (metaDescription.length > 40) {
    return metaDescription;
  }

  const isVideo = /video|animation|\.html$/i.test(url) &&
    (url.includes('video') || url.includes('animation') || url.includes('/center/'));
  if (isVideo && converted.length >= 25) return converted;

  return converted;
}

function isVideoOrAnimationUrl(url) {
  return /video|animation/i.test(url || '');
}

function minContentLength(url) {
  return isVideoOrAnimationUrl(url) || /\/center\//.test(url || '') ? 25 : 80;
}

module.exports = {
  htmlToText,
  cleanScrapedText,
  extractArticleContent,
  minContentLength,
};
