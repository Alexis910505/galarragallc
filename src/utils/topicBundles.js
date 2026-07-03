import { parents } from '../generated/parents-index';
import { children } from '../generated/children-index';
import { teenagers } from '../generated/teenagers-index';
import { decodeHtmlEntities } from './decodeHtmlEntities';

const BUNDLES = {
  parents,
  children,
  teenagers,
};

export function getTopicBundle(category, topic) {
  return BUNDLES[category]?.[topic] ?? null;
}

export function getLocalizedTopic(bundle, lang) {
  if (!bundle) return null;
  return {
    title: decodeHtmlEntities(bundle.title[lang] || bundle.title.es),
    description: bundle.description[lang] || bundle.description.es,
    subtopics: bundle.subtopics.map((subtopic) => ({
      title: decodeHtmlEntities(subtopic.title[lang] || subtopic.title.es),
      items: subtopic.items
        .filter((item) => item[lang]?.description?.trim())
        .map((item) => ({
          title: decodeHtmlEntities(item[lang].title),
          description: item[lang].description,
        })),
    })),
  };
}
