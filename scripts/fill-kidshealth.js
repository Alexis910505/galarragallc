/**
 * Rellena descripciones vacías desde KidsHealth.org
 * Uso: node scripts/fill-kidshealth.js --lang es --category parents --topic generalHealth
 */
const https = require('https');
const fs = require('fs');
const path = require('path');

const TRANSLATIONS_PATH = path.join(__dirname, '../src/translations.js');

const CATEGORY_URLS = {
  es: {
    parents: {
      generalHealth: 'https://kidshealth.org/es/parents/general/',
      growthDevelopment: 'https://kidshealth.org/es/parents/growth/',
      infections: 'https://kidshealth.org/es/parents/infections/',
      diseasesConditions: 'https://kidshealth.org/es/parents/medical/',
      pregnancyBaby: 'https://kidshealth.org/es/parents/pregnancy/',
      nutritionExercise: 'https://kidshealth.org/es/parents/nutrition/',
      emotionsBehavior: 'https://kidshealth.org/es/parents/emotions/',
      schoolFamily: 'https://kidshealth.org/es/parents/school/',
      firstAidSafety: 'https://kidshealth.org/es/parents/firstaid/',
      doctorsHospitals: 'https://kidshealth.org/es/parents/doctors/',
    },
  },
  en: {
    parents: {
      generalHealth: 'https://kidshealth.org/en/parents/general/',
      growthDevelopment: 'https://kidshealth.org/en/parents/growth/',
      infections: 'https://kidshealth.org/en/parents/infections/',
      diseasesConditions: 'https://kidshealth.org/en/parents/medical/',
      pregnancyBaby: 'https://kidshealth.org/en/parents/pregnancy/',
      nutritionExercise: 'https://kidshealth.org/en/parents/nutrition/',
      emotionsBehavior: 'https://kidshealth.org/en/parents/emotions/',
      schoolFamily: 'https://kidshealth.org/en/parents/school/',
      firstAidSafety: 'https://kidshealth.org/en/parents/firstaid/',
      doctorsHospitals: 'https://kidshealth.org/en/parents/doctors/',
    },
  },
};

const MANUAL_URL_MAP = {
  es: {
    'Fractura ósea': 'https://kidshealth.org/es/parents/b-bone.html',
    'Aparato reproductor masculino': 'https://kidshealth.org/es/parents/male-reproductive-system.html',
    'Cómo tratar la tos': 'https://kidshealth.org/es/parents/cough-sheet.html',
    'Las vacunas de su hijo: Vacuna contra la hepatitis B': 'https://kidshealth.org/es/parents/hepb-vaccine.html',
    'El sueño y su hijo de 1 a 2 años': 'https://kidshealth.org/es/parents/sleep12yr.html',
    'El sueño y su hijo de 1 a 3 meses': 'https://kidshealth.org/es/parents/sleep13m.html',
    'El sueño y su hijo de 4 a 7 meses': 'https://kidshealth.org/es/parents/sleep47m.html',
    'El sueño y su hijo de 8 a 12 meses': 'https://kidshealth.org/es/parents/sleep812m.html',
  },
  en: {
    'Bone fracture': 'https://kidshealth.org/en/parents/b-bone.html',
    'How to treat cough': 'https://kidshealth.org/en/parents/cough-sheet.html',
    "Your Child's Vaccines: Hepatitis B Vaccine": 'https://kidshealth.org/en/parents/hepb-vaccine.html',
    'Sleep and Your 1- to 2-Year-Old': 'https://kidshealth.org/en/parents/sleep12yr.html',
    'Baby Sleep: 1- to 3-Month-Olds': 'https://kidshealth.org/en/parents/sleep13m.html',
    'Baby Sleep: 4- to 7-Month-Olds': 'https://kidshealth.org/en/parents/sleep47m.html',
    'Baby Sleep: 8- to 12-Month-Olds': 'https://kidshealth.org/en/parents/sleep812m.html',
  },
};

const TITLE_ALIASES = {
  'fractura ósea': ['huesos rotos', 'broken bones'],
  desmayos: ['síncope', 'syncope', 'fainting'],
  fiebre: ['fiebre (temperatura alta)', 'fever (high temperature)'],
  aftas: ['aftas (úlceras aftosas)', 'canker sores'],
  'mojar la cama (enuresis)': ['mojar la cama', 'bedwetting', 'enuresis'],
  'cómo tratar la tos': ['tos: tratamiento', 'cough: treatment'],
  'las vacunas de su hijo: vacuna contra la hepatitis b': ['hepatitis b', 'hepatitis b vaccine'],
};

function parseArgs() {
  const args = process.argv.slice(2);
  const opts = { lang: 'es', category: 'parents', topic: 'generalHealth', dryRun: false, limit: 0, force: false, only: [] };
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--lang') opts.lang = args[++i];
    else if (args[i] === '--category') opts.category = args[++i];
    else if (args[i] === '--topic') opts.topic = args[++i];
    else if (args[i] === '--dry-run') opts.dryRun = true;
    else if (args[i] === '--force') opts.force = true;
    else if (args[i] === '--limit') opts.limit = parseInt(args[++i], 10);
    else if (args[i] === '--only') opts.only = args[++i].split('|');
  }
  return opts;
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function fetch(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (compatible; GalarragaLLC/1.0)' } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        const next = res.headers.location.startsWith('http')
          ? res.headers.location
          : `https://kidshealth.org${res.headers.location}`;
        return fetch(next).then(resolve, reject);
      }
      let data = '';
      res.on('data', (c) => (data += c));
      res.on('end', () => {
        if (res.statusCode !== 200) reject(new Error(`HTTP ${res.statusCode} for ${url}`));
        else resolve(data);
      });
    }).on('error', reject);
  });
}

function normalizeTitle(title) {
  return title
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ')
    .replace(/\([^)]*\)/g, '')
    .trim();
}

function scoreTitleMatch(localTitle, remoteTitle) {
  const a = normalizeTitle(localTitle);
  const b = normalizeTitle(remoteTitle);
  if (!a || !b) return 0;
  if (a === b) return 100;
  if (b.startsWith(a) || a.startsWith(b)) return 90;

  const aliases = TITLE_ALIASES[a];
  if (aliases && aliases.some((alias) => b.includes(normalizeTitle(alias)))) return 85;

  const aWords = a.split(' ').filter((w) => w.length > 2);
  const bWords = b.split(' ').filter((w) => w.length > 2);
  const overlap = aWords.filter((w) => bWords.includes(w));
  if (overlap.length === 0) return 0;

  const overlapRatio = overlap.length / Math.max(aWords.length, bWords.length);
  if (overlapRatio < 0.6) return 0;

  return Math.round(50 + overlapRatio * 40);
}

function findUrlForTitle(localTitle, sections, preferredSection = null) {
  const searchSections = preferredSection
    ? [
        ...sections.filter((s) => normalizeTitle(s.title) === normalizeTitle(preferredSection)),
        ...sections.filter((s) => normalizeTitle(s.title) !== normalizeTitle(preferredSection)),
      ]
    : sections;

  let best = null;
  let bestScore = 0;

  for (const section of searchSections) {
    const sectionBonus = preferredSection && normalizeTitle(section.title) === normalizeTitle(preferredSection) ? 10 : 0;
    for (const item of section.items) {
      const score = scoreTitleMatch(localTitle, item.title) + sectionBonus;
      if (score > bestScore) {
        bestScore = score;
        best = { url: item.url, remoteTitle: item.title, section: section.title, score };
      }
    }
  }

  return bestScore >= 60 ? best : null;
}

function parseCategoryPage(html) {
  const sections = [];
  const sectionRegex = /<button[^>]*class="kh-category-title"[^>]*>([^<]+)<\/button>[\s\S]*?<ul class="kh-category-single">([\s\S]*?)<\/ul>/g;
  let match;
  while ((match = sectionRegex.exec(html)) !== null) {
    const sectionTitle = match[1].trim();
    const linksHtml = match[2];
    const items = [];
    const linkRegex = /<a class="linkFromCat" href="([^"]+)">([^<]+)<\/a>/g;
    let linkMatch;
    while ((linkMatch = linkRegex.exec(linksHtml)) !== null) {
      items.push({ url: linkMatch[1].trim(), title: linkMatch[2].trim() });
    }
    sections.push({ title: sectionTitle, items });
  }
  return sections;
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
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/\s*-->\s*-->\s*/g, '<br><br>')
    .replace(/\s*-->\s*/g, ' ')
    .replace(/<section[\s\S]*$/i, '')
    .replace(/class="khLeft"[^>]*>/gi, '')
    .replace(/(\s*<br>\s*){3,}/gi, '<br><br>')
    .replace(/\s+/g, ' ')
    .trim();
}

function escapeJsString(str) {
  return str
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/\r/g, '')
    .replace(/\n/g, ' ');
}

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function getEmptyItems(topic, opts = {}) {
  const items = [];
  if (!topic.subtopics) return items;
  for (const sub of topic.subtopics) {
    if (Array.isArray(sub.items)) {
      for (const item of sub.items) {
        if (typeof item === 'string') {
          if (opts.force || opts.only?.length) {
            if (!opts.only?.length || opts.only.includes(item)) {
              items.push({ subtopicTitle: sub.title, itemKey: item, type: 'array-string' });
            }
          }
        } else if (item.title) {
          const empty = !item.description || !item.description.trim();
          if (empty || opts.force || opts.only?.includes(item.title)) {
            if (!opts.only?.length || opts.only.includes(item.title)) {
              items.push({ subtopicTitle: sub.title, itemKey: item.title, type: 'array-object' });
            }
          }
        }
      }
    } else if (sub.items && typeof sub.items === 'object') {
      for (const [key, value] of Object.entries(sub.items)) {
        const desc = typeof value === 'object' ? value.description : '';
        const empty = !desc || !desc.trim();
        if (empty || opts.force || opts.only?.includes(key)) {
          if (!opts.only?.length || opts.only.includes(key)) {
            items.push({ subtopicTitle: sub.title, itemKey: key, type: 'object' });
          }
        }
      }
    }
  }
  return items;
}

function updateTranslationFile(fileContent, itemKey, description) {
  const escapedKey = escapeRegex(itemKey);
  const escapedDesc = escapeJsString(description);

  const objectPattern = new RegExp(
    `("${escapedKey}":\\s*\\{\\s*description:\\s*)"(?:[^"\\\\]|\\\\.)*"(\\s*\\})`,
    'm'
  );
  if (objectPattern.test(fileContent)) {
    return fileContent.replace(objectPattern, `$1"${escapedDesc}"$2`);
  }

  const objectEmptyPattern = new RegExp(
    `("${escapedKey}":\\s*\\{\\s*description:\\s*)""`,
    'm'
  );
  if (objectEmptyPattern.test(fileContent)) {
    return fileContent.replace(objectEmptyPattern, `$1"${escapedDesc}"`);
  }

  const arrayObjectPattern = new RegExp(
    `(title:\\s*'${escapedKey.replace(/'/g, "\\'")}',\\s*description:\\s*)''`,
    'm'
  );
  if (arrayObjectPattern.test(fileContent)) {
    return fileContent.replace(arrayObjectPattern, `$1'${description.replace(/'/g, "\\'")}'`);
  }

  return null;
}

async function main() {
  const opts = parseArgs();
  const categoryUrl = CATEGORY_URLS[opts.lang]?.[opts.category]?.[opts.topic];
  if (!categoryUrl) {
    console.error('URL no configurada para:', opts);
    process.exit(1);
  }

  const { translations } = require('../src/translations.js');
  const topic = translations[opts.lang]?.featuredTopics?.categories?.[opts.category]?.topics?.[opts.topic];
  if (!topic) {
    console.error('Tema no encontrado en traducciones');
    process.exit(1);
  }

  console.log(`\n📚 Rellenando: ${opts.lang} / ${opts.category} / ${opts.topic}`);
  console.log(`🔗 Fuente: ${categoryUrl}\n`);

  const categoryHtml = await fetch(categoryUrl);
  const sections = parseCategoryPage(categoryHtml);
  console.log(`Secciones encontradas en KidsHealth: ${sections.length}`);
  sections.forEach((s) => console.log(`  - ${s.title}: ${s.items.length} artículos`));

  let emptyItems = getEmptyItems(topic, opts);
  if (opts.limit > 0) emptyItems = emptyItems.slice(0, opts.limit);
  console.log(`\nÍtems vacíos a rellenar: ${emptyItems.length}`);

  let fileContent = fs.readFileSync(TRANSLATIONS_PATH, 'utf8');
  let filled = 0;
  let notFound = 0;
  let failed = 0;

  for (const item of emptyItems) {
    let match = null;
    const manualMap = MANUAL_URL_MAP[opts.lang] || {};
    if (manualMap[item.itemKey]) {
      match = { url: manualMap[item.itemKey], remoteTitle: item.itemKey, section: item.subtopicTitle };
    } else {
      match = findUrlForTitle(item.itemKey, sections, item.subtopicTitle);
    }
    if (!match) {
      console.log(`  ⚠️  Sin coincidencia: "${item.itemKey}"`);
      notFound++;
      continue;
    }

    try {
      console.log(`  📥 "${item.itemKey}" ← "${match.remoteTitle}"`);
      await sleep(400);
      const articleHtml = await fetch(match.url);
      const content = extractArticleContent(articleHtml);

      if (!content || content.length < 80) {
        console.log(`     ❌ Contenido muy corto (${content.length} chars)`);
        failed++;
        continue;
      }

      if (opts.dryRun) {
        console.log(`     ✓ [dry-run] ${content.length} chars`);
        filled++;
        continue;
      }

      const updated = updateTranslationFile(fileContent, item.itemKey, content);
      if (updated) {
        fileContent = updated;
        filled++;
        console.log(`     ✅ ${content.length} caracteres`);
      } else {
        console.log(`     ❌ No se pudo actualizar en translations.js`);
        failed++;
      }
    } catch (err) {
      console.log(`     ❌ Error: ${err.message}`);
      failed++;
    }
  }

  if (!opts.dryRun && filled > 0) {
    fs.writeFileSync(TRANSLATIONS_PATH, fileContent, 'utf8');
    console.log(`\n💾 Guardado: ${TRANSLATIONS_PATH}`);
  }

  console.log(`\n📊 Resumen: ${filled} rellenados, ${notFound} sin coincidencia, ${failed} fallidos`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
