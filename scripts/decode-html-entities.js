/**
 * Decodifica entidades HTML comunes (p. ej. &#39; → ').
 */
function decodeHtmlEntities(text) {
  if (!text || typeof text !== 'string') return text;

  return text
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}

module.exports = { decodeHtmlEntities };
