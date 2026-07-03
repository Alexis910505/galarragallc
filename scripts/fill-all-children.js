/**
 * Exporta y rellena todos los temas de Niños (ES + EN) desde KidsHealth.
 * Uso: node scripts/fill-all-children.js [--skip-export] [--from <tema>]
 */
const { execSync } = require('child_process');
const path = require('path');
const { CHILDREN_TOPICS } = require('./category-urls');

const ROOT = path.join(__dirname, '..');

function run(cmd) {
  console.log(`\n▶ ${cmd}\n`);
  execSync(cmd, { cwd: ROOT, stdio: 'inherit' });
}

function main() {
  const skipExport = process.argv.includes('--skip-export');
  const fromTopic = process.argv.find((a, i) => process.argv[i - 1] === '--from') || null;
  const topics = fromTopic
    ? CHILDREN_TOPICS.slice(CHILDREN_TOPICS.indexOf(fromTopic))
    : CHILDREN_TOPICS;

  if (fromTopic && !CHILDREN_TOPICS.includes(fromTopic)) {
    console.error(`Tema desconocido: ${fromTopic}`);
    process.exit(1);
  }

  console.log('🚀 Procesando temas de Niños (ES + EN)\n');

  for (const topic of topics) {
    console.log(`\n${'='.repeat(60)}\n📂 children / ${topic}\n${'='.repeat(60)}`);

    if (!skipExport) {
      run(`node scripts/export-content.js --category children --topic ${topic}`);
    }
    run(`node scripts/fill-content-json.js --lang es --category children --topic ${topic}`);
    run(`node scripts/fill-content-json.js --lang en --category children --topic ${topic}`);
  }

  run('node scripts/complete-children-content.js');
  run('node scripts/build-topic-bundle.js');
  console.log('\n✅ Todos los temas de Niños procesados.');
}

main();
