// Script de prueba para verificar la nueva estructura de infections
import { translations } from './src/translations.js';

console.log('=== PRUEBA DE TRADUCCIONES ===');

// Verificar estructura en español
console.log('\n--- ESPAÑOL ---');
try {
  const esInfections = translations.es.featuredTopics.categories.parents.topics.generalHealth.subtopics.find(
    subtopic => subtopic.title === 'Infecciones'
  );
  
  if (esInfections) {
    console.log('✅ Título:', esInfections.title);
    console.log('✅ Descripción:', esInfections.description);
    console.log('✅ Número de subtópicos:', esInfections.subtopics.length);
    
    // Verificar primer subtópico
    const firstSubtopic = esInfections.subtopics[0];
    console.log('✅ Primer subtópico:', firstSubtopic.title);
    console.log('✅ Número de items:', firstSubtopic.items.length);
    
    // Verificar primer item
    const firstItem = firstSubtopic.items[0];
    console.log('✅ Primer item:', firstItem.title);
    console.log('✅ Descripción del item:', firstItem.description);
  } else {
    console.log('❌ No se encontró la sección de Infecciones');
  }
  
} catch (error) {
  console.error('❌ Error en español:', error.message);
}

// Verificar estructura en inglés
console.log('\n--- INGLÉS ---');
try {
  const enInfections = translations.en.featuredTopics.categories.parents.topics.generalHealth.subtopics.find(
    subtopic => subtopic.title === 'Infections'
  );
  
  if (enInfections) {
    console.log('✅ Title:', enInfections.title);
    console.log('✅ Description:', enInfections.description);
    console.log('✅ Number of subtopics:', enInfections.subtopics.length);
    
    // Verificar primer subtópico
    const firstSubtopic = enInfections.subtopics[0];
    console.log('✅ First subtopic:', firstSubtopic.title);
    console.log('✅ Number of items:', firstSubtopic.items.length);
    
    // Verificar primer item
    const firstItem = firstSubtopic.items[0];
    console.log('✅ First item:', firstItem.title);
    console.log('✅ Item description:', firstItem.description);
  } else {
    console.log('❌ No se encontró la sección de Infections');
  }
  
} catch (error) {
  console.error('❌ Error en inglés:', error.message);
}

console.log('\n=== PRUEBA COMPLETADA ===');
