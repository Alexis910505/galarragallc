const { fetch, parseCategoryPage } = require('./content-utils');

(async () => {
  const html = await fetch('https://kidshealth.org/es/parents/firstaid-safe/');
  const sections = parseCategoryPage(html);
  const all = sections.flatMap((s) => s.items);
  const terms = ['esqu', 'ski', 'emergenc', 'números', 'emergency', 'gun', 'arma', 'ejercicio', 'exercise'];
  for (const item of all) {
    if (terms.some((t) => item.title.toLowerCase().includes(t) || item.url.toLowerCase().includes(t))) {
      console.log(item.title, '->', item.url);
    }
  }
})();
