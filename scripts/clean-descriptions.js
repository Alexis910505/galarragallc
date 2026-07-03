/**
 * Limpia artefactos HTML en descriptions existentes de translations.js
 */
const fs = require('fs');
const path = require('path');

const TRANSLATIONS_PATH = path.join(__dirname, '../src/translations.js');

function cleanDescription(text) {
  if (!text || typeof text !== 'string') return text;

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
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/\s*-->\s*-->\s*/g, '<br><br>')
    .replace(/\s*-->\s*/g, ' ')
    .replace(/<section[\s\S]*$/i, '')
    .replace(/class="khLeft"[^>]*>/gi, '')
    .replace(/(\s*<br>\s*){3,}/gi, '<br><br>')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

function needsCleaning(text) {
  return /khcontent_article|khLeft|<section|--> -->|Revisor médico:|MÁS SOBRE ESTE TEMA|Quiénes somos/.test(text);
}

function walkDescriptions(obj, onDesc) {
  if (!obj || typeof obj !== 'object') return;
  if (typeof obj.description === 'string' && obj.description) onDesc(obj);
  if (Array.isArray(obj)) return obj.forEach((item) => walkDescriptions(item, onDesc));
  Object.values(obj).forEach((value) => walkDescriptions(value, onDesc));
}

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function escapeJsString(str) {
  return str.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\r/g, '').replace(/\n/g, ' ');
}

function main() {
  const { translations } = require('../src/translations.js');
  let fileContent = fs.readFileSync(TRANSLATIONS_PATH, 'utf8');
  let cleaned = 0;

  for (const lang of Object.keys(translations)) {
    walkDescriptions(translations[lang], (item) => {
      if (!needsCleaning(item.description)) return;
      const original = item.description;
      const fixed = cleanDescription(original);
      if (fixed === original) return;

      const escapedOriginal = escapeRegex(escapeJsString(original));
      const pattern = new RegExp(`(description:\\s*")${escapedOriginal}(")`, 'm');
      if (pattern.test(fileContent)) {
        fileContent = fileContent.replace(pattern, `$1${escapeJsString(fixed)}$2`);
        cleaned++;
      }
    });
  }

  if (cleaned > 0) fs.writeFileSync(TRANSLATIONS_PATH, fileContent, 'utf8');
  console.log(`Descripciones limpiadas: ${cleaned}`);
}

main();
