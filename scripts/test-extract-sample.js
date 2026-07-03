const { fetch } = require('./content-utils');
const { extractArticleContent } = require('./fill-content-json-extract');

const urls = [
  ['center', 'https://kidshealth.org/es/parents/center/allergies-center.html'],
  ['video', 'https://kidshealth.org/en/parents/ears-video.html'],
  ['nightmares-en', 'https://kidshealth.org/en/parents/nightmares.html'],
  ['fitness', 'https://kidshealth.org/es/parents/center/fitness-nutrition-center.html'],
  ['handwash', 'https://kidshealth.org/es/parents/handwashing.html'],
];

(async () => {
  for (const [name, url] of urls) {
    const html = await fetch(url);
    const text = extractArticleContent(html);
    console.log(name, 'chars:', text.length, 'preview:', text.slice(0, 120));
  }
})();
