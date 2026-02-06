import React from 'react';
import { useLanguage } from '../LanguageContext';

// Componente para las pestañas de categorías
const CategoryTabs = ({ activeCategory, setActiveCategory, categories }) => {
  const { t } = useLanguage();
  
  return (
    <div className="category-tabs">
      {categories.map(category => (
        <button 
          key={category}
          className={`category-tab ${activeCategory === category ? 'active' : ''}`}
          onClick={() => setActiveCategory(category)}
          aria-label={t(`featuredTopics.categories.${category}.title`)}
        >
          <span className="tab-text">{t(`featuredTopics.categories.${category}.title`)}</span>
        </button>
      ))}
    </div>
  );
};

// Componente para la cuadrícula de temas
const TopicsGrid = ({ category, selectedTopic, handleTopicClick }) => {
  const { t } = useLanguage();
  
  const getTopicsForCategory = (category) => {
    try {
      const topics = t(`featuredTopics.categories.${category}.topics`);
      return Object.keys(topics);
    } catch {
      return [];
    }
  };
  
  const topics = getTopicsForCategory(category);
  
  return (
    <div className="topics-grid">
      {topics.map(topicKey => (
        <div
          key={topicKey}
          className={`topic-card ${selectedTopic === topicKey ? 'active' : ''}`}
          onClick={() => handleTopicClick(topicKey)}
        >
          <h4>{t(`featuredTopics.categories.${category}.topics.${topicKey}.title`)}</h4>
        </div>
      ))}
    </div>
  );
};

// Componente para el contenido del tema seleccionado
const TopicContent = ({ category, selectedTopic, setSelectedTopic, expandedAccordion, handleAccordionClick, selectedSubtopic, setSelectedSubtopic, isSubtopicDialogOpen, setIsSubtopicDialogOpen }) => {
  const { t } = useLanguage();
  
  if (!selectedTopic) return null;
  
  const getSubtopics = () => {
    try {
      return t(`featuredTopics.categories.${category}.topics.${selectedTopic}.subtopics`);
    } catch {
      return [];
    }
  };
  
  const subtopics = getSubtopics();
  
  const handleSubtopicClick = (subtopic) => {
    setSelectedSubtopic(subtopic);
    setIsSubtopicDialogOpen(true);
  };
  
  const renderSubtopics = () => {
    if (!Array.isArray(subtopics)) return null;
    
    // Si es array de objetos (acordeón)
    if (subtopics.length > 0 && typeof subtopics[0] === 'object' && subtopics[0].title) {
      return (
        <div className="accordion-container">
          {subtopics.map((accordion, index) => (
            <div key={index} className="accordion-item">
              <button
                className={`accordion-header ${expandedAccordion === accordion.title ? 'expanded' : ''}`}
                onClick={() => handleAccordionClick(accordion.title)}
              >
                <span>{accordion.title}</span>
                <span className="accordion-icon">{expandedAccordion === accordion.title ? '−' : '+'}</span>
              </button>
              <div className={`accordion-content ${expandedAccordion === accordion.title ? 'expanded' : ''}`}> 
                <ul className="subtopics-list">
                  {accordion.items && typeof accordion.items === 'object' && Object.keys(accordion.items).map((itemKey, itemIndex) => (
                    <li 
                      key={itemIndex}
                      className="clickable-subtopic-item"
                      onClick={() => handleSubtopicClick({ 
                        title: itemKey, 
                        subtopicTitle: accordion.title,
                        description: accordion.items[itemKey].description,
                        items: [itemKey] 
                      })}
                    >
                      {itemKey}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      );
    }
    
    // Si es array de strings (lista simple)
    return (
      <ul className="subtopics-list">
        {subtopics.map((subtopic, index) => (
          <li 
            key={index}
            className="clickable-subtopic-item"
            onClick={() => handleSubtopicClick({ title: subtopic, items: [] })}
          >
            {subtopic}
          </li>
        ))}
      </ul>
    );
  };
  
  return (
    <div className="topic-content-area">
      <div className="topic-content-header">
        <h3>{t(`featuredTopics.categories.${category}.topics.${selectedTopic}.title`)}</h3>
        <button
          className="close-topic-btn"
          onClick={() => setSelectedTopic(null)}
          aria-label="Cerrar tema"
        >
          ×
        </button>
      </div>
      <div className="topic-content-body">
        <p className="topic-description">
          {t(`featuredTopics.categories.${category}.topics.${selectedTopic}.description`)}
        </p>
        <div className="topic-subtopics">
          {renderSubtopics()}
        </div>
      </div>
      
      {/* Diálogo de subtemas */}
      {/* Removido - ahora se renderiza en App.js */}
    </div>
  );
};

// Componente principal para una categoría
const TopicCategory = ({ category, activeCategory, selectedTopic, handleTopicClick, setSelectedTopic, expandedAccordion, handleAccordionClick, selectedSubtopic, setSelectedSubtopic, isSubtopicDialogOpen, setIsSubtopicDialogOpen }) => {
  const { t } = useLanguage();
  
  return (
    <div className={`topic-category ${activeCategory === category ? 'active' : ''}`}>
      <div className="category-header">
        <h3>{t(`featuredTopics.categories.${category}.title`)}</h3>
        <p>{t(`featuredTopics.categories.${category}.description`)}</p>
      </div>
      <TopicsGrid 
        category={category}
        selectedTopic={selectedTopic}
        handleTopicClick={handleTopicClick}
      />
      {activeCategory === category && (
        <TopicContent 
          category={category}
          selectedTopic={selectedTopic}
          setSelectedTopic={setSelectedTopic}
          expandedAccordion={expandedAccordion}
          handleAccordionClick={handleAccordionClick}
          selectedSubtopic={selectedSubtopic}
          setSelectedSubtopic={setSelectedSubtopic}
          isSubtopicDialogOpen={isSubtopicDialogOpen}
          setIsSubtopicDialogOpen={setIsSubtopicDialogOpen}
        />
      )}
    </div>
  );
};

// Componente principal de Featured Topics
const FeaturedTopics = ({ 
  activeCategory, 
  setActiveCategory, 
  selectedTopic, 
  handleTopicClick, 
  setSelectedTopic, 
  expandedAccordion, 
  handleAccordionClick,
  selectedSubtopic,
  setSelectedSubtopic,
  isSubtopicDialogOpen,
  setIsSubtopicDialogOpen
}) => {
  const { t } = useLanguage();
  
  const categories = ['parents', 'children', 'teenagers'];
  
  return (
    <section className="featured-topics" id="temas-destacados">
      <div className="section-header">
        <span className="section-badge">{t('featuredTopics.badge')}</span>
        <h2>{t('featuredTopics.title')}</h2>
        <p className="section-description">{t('featuredTopics.description')}</p>
      </div>
      
      <CategoryTabs 
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        categories={categories}
      />

      <div className="featured-topics-container">
        {categories.map(category => (
          <TopicCategory
            key={category}
            category={category}
            activeCategory={activeCategory}
            selectedTopic={selectedTopic}
            handleTopicClick={handleTopicClick}
            setSelectedTopic={setSelectedTopic}
            expandedAccordion={expandedAccordion}
            handleAccordionClick={handleAccordionClick}
            selectedSubtopic={selectedSubtopic}
            setSelectedSubtopic={setSelectedSubtopic}
            isSubtopicDialogOpen={isSubtopicDialogOpen}
            setIsSubtopicDialogOpen={setIsSubtopicDialogOpen}
          />
        ))}
      </div>
    </section>
  );
};

export default FeaturedTopics; 