const { fetch, parseCategoryPage } = require('./content-utils');

(async () => {
  for (const url of [
    'https://kidshealth.org/es/parents/center/summer-center.html',
    'https://kidshealth.org/es/parents/center/safety-center.html',
    'https://kidshealth.org/es/parents/positive/',
  ]) {
    console.log('\n===', url);
    const sections = parseCategoryPage(await fetch(url));
    for (const item of sections.flatMap((s) => s.items)) {
      if (/esqu|ski|snowboard/i.test(item.title + item.url)) {
        console.log(item.title, '->', item.url);
      }
    }
  }
})();
