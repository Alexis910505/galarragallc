const { fetch } = require('./content-utils');

(async () => {
  const html = await fetch('https://kidshealth.org/es/parents/firstaid-safe/');
  const matches = [...html.matchAll(/href="([^"]*ski[^"]*)"/gi)];
  console.log([...new Set(matches.map((m) => m[1]))].slice(0, 20));
})();
