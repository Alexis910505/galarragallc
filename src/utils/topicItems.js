/**
 * Normaliza los items de un acordeón a un formato uniforme { title, description }.
 * Soporta: arrays de strings, arrays de objetos, y objetos con clave=título.
 */
export function normalizeAccordionItems(items) {
  if (!items) return [];

  if (Array.isArray(items)) {
    return items.map((item) => {
      if (typeof item === 'string') {
        return { title: item, description: '' };
      }
      if (typeof item === 'object' && item !== null) {
        return {
          title: item.title || '',
          description: item.description || '',
        };
      }
      return { title: String(item), description: '' };
    });
  }

  if (typeof items === 'object') {
    return Object.entries(items).map(([key, value]) => ({
      title: key,
      description:
        typeof value === 'object' && value !== null ? value.description || '' : '',
    }));
  }

  return [];
}

export function hasItemContent(item) {
  return Boolean(item.description && item.description.trim());
}

export function getItemsWithContent(items) {
  return normalizeAccordionItems(items).filter(hasItemContent);
}
