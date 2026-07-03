import { cleanDescription } from './cleanDescription';
import { decodeHtmlEntities } from './decodeHtmlEntities';

function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// Preguntas EN: mayúscula inicial, sin puntos internos, tras inicio o fin de oración.
const EN_QUESTION_TEXT =
  "(?:What(?:'s| is| are)|How (?:Do|Can|Long| to)|Why |When |Where |Who |Can |Should |Do |Does )[^.?]{1,140}\\?";

const SECTION_SPLIT = new RegExp(
  `(?=¿[^¿]+?\\?)|(?<=^)(?=${EN_QUESTION_TEXT})|(?<=[.!?]\\s)(?=${EN_QUESTION_TEXT})`
);

const ES_QUESTION = /^(¿[^¿]+?\?)([\s\S]*)$/;
const EN_QUESTION = new RegExp(`^(${EN_QUESTION_TEXT})([\\s\\S]*)$`);

function capitalizeFirstLetter(text) {
  if (!text) return text;
  const index = text.search(/\S/);
  if (index === -1) return text;
  return text.slice(0, index) + text[index].toLocaleUpperCase('es') + text.slice(index + 1);
}

function formatBody(body) {
  const trimmed = body.trim();
  if (!trimmed) return '';

  const bulletParts = trimmed.split(/\s•\s/);
  if (bulletParts.length < 2) {
    return `<p>${escapeHtml(trimmed)}</p>`;
  }

  const intro = bulletParts[0].trim();
  const items = bulletParts.slice(1).map((item) => item.trim()).filter(Boolean);

  let html = '';
  if (intro) {
    html += `<p>${escapeHtml(intro)}</p>`;
  }
  if (items.length > 0) {
    html += `<ul class="article-list">${items
      .map((item) => `<li>${escapeHtml(capitalizeFirstLetter(item))}</li>`)
      .join('')}</ul>`;
  }
  return html;
}

function formatSegment(segment) {
  if (!segment) return '';

  const esMatch = segment.match(ES_QUESTION);
  if (esMatch) {
    return `<h4>${escapeHtml(esMatch[1])}</h4>${formatBody(esMatch[2])}`;
  }

  const enMatch = segment.match(EN_QUESTION);
  if (enMatch) {
    return `<h4>${escapeHtml(enMatch[1])}</h4>${formatBody(enMatch[2])}`;
  }

  return formatBody(segment);
}

function splitIntoBlocks(text) {
  return text
    .split(/<br\s*\/?>\s*<br\s*\/?>/gi)
    .map((block) => block.replace(/<br\s*\/?>/gi, ' ').replace(/\s+/g, ' ').trim())
    .filter(Boolean);
}

function formatBlock(block) {
  return block
    .split(SECTION_SPLIT)
    .map((segment) => formatSegment(segment.trim()))
    .filter(Boolean)
    .join('');
}

/**
 * Convierte la descripción de un artículo en HTML estructurado:
 * preguntas como encabezados centrados, párrafos a la izquierda y viñetas en lista.
 */
export function formatArticleHtml(description) {
  const cleaned = cleanDescription(description);
  if (!cleaned) return '';

  const text = decodeHtmlEntities(cleaned.trim());
  const blocks = splitIntoBlocks(text);

  if (blocks.length === 0) {
    return formatBlock(text.replace(/<br\s*\/?>/gi, ' ').replace(/\s+/g, ' ').trim());
  }

  return blocks.map((block) => formatBlock(block)).join('');
}
