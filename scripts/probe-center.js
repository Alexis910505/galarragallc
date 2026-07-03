const { fetch } = require('./content-utils');
const fs = require('fs');

(async () => {
  const h = await fetch('https://kidshealth.org/es/parents/center/allergies-center.html');
  fs.writeFileSync('scripts/sample-center.html', h.slice(0, 50000));
  console.log('saved', h.length);
})();
