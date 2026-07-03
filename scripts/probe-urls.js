const { fetch } = require('./content-utils');
const { extractArticleContent } = require('./article-extract');

const tests = [
  ['action-plan-art', 'en', 'https://kidshealth.org/en/parents/action-plan-art.html'],
  ['action-plan-art', 'en', 'https://kidshealth.org/en/parents/asthma-action-plan.html'],
  ['separation', 'en', 'https://kidshealth.org/en/parents/separation-anxiety.html'],
  ['sex', 'en', 'https://kidshealth.org/en/parents/talking-about-sex.html'],
  ['sex', 'en', 'https://kidshealth.org/en/parents/sex.html'],
  ['exercise', 'es', 'https://kidshealth.org/es/parents/exercise-at-home.html'],
  ['doctor', 'en', 'https://kidshealth.org/en/parents/doctor-visits.html'],
  ['doctor', 'en', 'https://kidshealth.org/en/parents/medical-visits.html'],
  ['crib', 'en', 'https://kidshealth.org/en/parents/products-crib.html'],
  ['crib', 'en', 'https://kidshealth.org/en/parents/crib-safety.html'],
  ['firearms', 'en', 'https://kidshealth.org/en/parents/safety-firearms.html'],
  ['firearms', 'en', 'https://kidshealth.org/en/parents/gun-safety.html'],
  ['ski', 'en', 'https://kidshealth.org/en/parents/ski-safety.html'],
  ['emergency', 'en', 'https://kidshealth.org/en/parents/travel-size-emergency.html'],
  ['emergency', 'en', 'https://kidshealth.org/en/parents/emergency-numbers.html'],
];

(async () => {
  for (const [name, lang, url] of tests) {
    try {
      const html = await fetch(url);
      const text = extractArticleContent(html, url);
      console.log('OK', name, text.length, url.split('/').pop());
    } catch (e) {
      console.log('FAIL', name, url.split('/').pop());
    }
  }
})();
