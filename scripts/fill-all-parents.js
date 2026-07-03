/**
 * Exporta y rellena todos los temas de Padres (ES + EN) desde KidsHealth.
 * Uso: node scripts/fill-all-parents.js
 */
const { execSync } = require('child_process');
const path = require('path');
const { PARENT_TOPICS } = require('./category-urls');

const ROOT = path.join(__dirname, '..');

function run(cmd) {
  console.log(`\n▶ ${cmd}\n`);
  execSync(cmd, { cwd: ROOT, stdio: 'inherit' });
}

function main() {
  const skipExport = process.argv.includes('--skip-export');
  const fromTopic = process.argv.find((a, i) => process.argv[i - 1] === '--from') || null;
  const topics = fromTopic
    ? PARENT_TOPICS.slice(PARENT_TOPICS.indexOf(fromTopic))
    : PARENT_TOPICS;

  if (fromTopic && !PARENT_TOPICS.includes(fromTopic)) {
    console.error(`Tema desconocido: ${fromTopic}`);
    process.exit(1);
  }

  console.log('🚀 Procesando temas de Padres (ES + EN)\n');

  for (const topic of topics) {
    console.log(`\n${'='.repeat(60)}\n📂 parents / ${topic}\n${'='.repeat(60)}`);

    if (!skipExport) {
      run(`node scripts/export-content.js --category parents --topic ${topic}`);
    }
    run(`node scripts/fill-content-json.js --lang es --category parents --topic ${topic}`);
    run(`node scripts/fill-content-json.js --lang en --category parents --topic ${topic}`);
  }

  run('node scripts/build-topic-bundle.js');
  console.log('\n✅ Todos los temas de Padres procesados.');
}

main();
