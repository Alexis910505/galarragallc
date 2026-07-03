/** Temas ocultos en la UI (sin contenido de artículo útil). */
export const EXCLUDED_TOPICS = {
  parents: ['videos'],
  children: ['videos'],
  teenagers: ['videos'],
};

export function getVisibleTopics(category, topicKeys) {
  const excluded = EXCLUDED_TOPICS[category] || [];
  return topicKeys.filter((key) => !excluded.includes(key));
}
