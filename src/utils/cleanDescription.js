/**
 * Limpia artefactos HTML dejados por el scraper de KidsHealth.
 */
export function cleanDescription(text) {
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
