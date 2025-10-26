// Archivo de prueba simple para verificar traducciones
import { translations } from './src/translations.js';

console.log('=== PRUEBA DE TRADUCCIONES ===');

// Verificar que las traducciones se carguen
console.log('¿Traducciones cargadas?', !!translations);
console.log('Idiomas disponibles:', Object.keys(translations));

// Verificar featuredTopics en español
const esFeaturedTopics = translations.es?.featuredTopics;
console.log('¿featuredTopics en español existe?', !!esFeaturedTopics);

if (esFeaturedTopics) {
  console.log('Título:', esFeaturedTopics.title);
  console.log('Descripción:', esFeaturedTopics.description);
  console.log('Categorías:', Object.keys(esFeaturedTopics.categories || {}));
  
  // Verificar categoría "parents"
  const parentsCategory = esFeaturedTopics.categories?.parents;
  if (parentsCategory) {
    console.log('Categoría "parents" encontrada');
    console.log('Título de categoría:', parentsCategory.title);
    console.log('Topics disponibles:', Object.keys(parentsCategory.topics || {}));
    
    // Verificar topic "generalHealth"
    const generalHealth = parentsCategory.topics?.generalHealth;
    if (generalHealth) {
      console.log('Topic "generalHealth" encontrado');
      console.log('Título del topic:', generalHealth.title);
      console.log('Número de subtopics:', generalHealth.subtopics?.length || 0);
      
      if (generalHealth.subtopics && generalHealth.subtopics.length > 0) {
        console.log('Primer subtopic:', generalHealth.subtopics[0]);
      }
    }
  }
}

// Verificar featuredTopics en inglés
const enFeaturedTopics = translations.en?.featuredTopics;
console.log('¿featuredTopics en inglés existe?', !!enFeaturedTopics);

console.log('=== FIN DE PRUEBA ===');

