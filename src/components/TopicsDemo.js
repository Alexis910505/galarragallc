import React, { useState } from 'react';
import { useLanguage } from '../LanguageContext';

const TopicsDemo = () => {
  const { t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState('parents');
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [expandedSubtopic, setExpandedSubtopic] = useState(null);

  const featuredTopics = t('featuredTopics');
  const categories = featuredTopics?.categories || {};

  if (!featuredTopics || !categories || Object.keys(categories).length === 0) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: 'red' }}>
        <h2>❌ Error: No se pudieron cargar los temas</h2>
        <p>Verifica que las traducciones estén disponibles</p>
      </div>
    );
  }

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setSelectedTopic(null);
    setExpandedSubtopic(null);
  };

  const handleTopicClick = (topicKey) => {
    setSelectedTopic(selectedTopic === topicKey ? null : topicKey);
    setExpandedSubtopic(null);
  };

  const handleSubtopicClick = (subtopicTitle) => {
    setExpandedSubtopic(expandedSubtopic === subtopicTitle ? null : subtopicTitle);
  };

  return (
    <div style={{ 
      maxWidth: '1200px', 
      margin: '0 auto', 
      padding: '2rem',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1 style={{ textAlign: 'center', color: '#1e293b', marginBottom: '2rem' }}>
        🎯 DEMOSTRACIÓN DE TEMAS DESTACADOS
      </h1>

      {/* Información general */}
      <div style={{
        backgroundColor: '#dbeafe',
        padding: '1rem',
        borderRadius: '8px',
        marginBottom: '2rem',
        border: '2px solid #3b82f6'
      }}>
        <h3>📊 Información del Sistema</h3>
        <p><strong>Título:</strong> {featuredTopics.title}</p>
        <p><strong>Descripción:</strong> {featuredTopics.description}</p>
        <p><strong>Categorías disponibles:</strong> {Object.keys(categories).join(', ')}</p>
        <p><strong>Categoría seleccionada:</strong> {selectedCategory}</p>
      </div>

      {/* Selector de categorías */}
      <div style={{ marginBottom: '2rem' }}>
        <h3>🏷️ Selecciona una Categoría:</h3>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          {Object.entries(categories).map(([key, category]) => (
            <button
              key={key}
              onClick={() => handleCategoryChange(key)}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: selectedCategory === key ? '#3b82f6' : 'white',
                color: selectedCategory === key ? 'white' : '#374151',
                border: `2px solid ${selectedCategory === key ? '#3b82f6' : '#d1d5db'}`,
                borderRadius: '25px',
                cursor: 'pointer',
                fontWeight: '600',
                transition: 'all 0.3s ease'
              }}
            >
              {category.title}
            </button>
          ))}
        </div>
      </div>

      {/* Contenido de la categoría seleccionada */}
      {selectedCategory && categories[selectedCategory] && (
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '2rem',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          border: '2px solid #e5e7eb'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h2 style={{ color: '#1e293b', marginBottom: '0.5rem' }}>
              {categories[selectedCategory].title}
            </h2>
            <p style={{ color: '#6b7280', fontSize: '1.1rem' }}>
              {categories[selectedCategory].description}
            </p>
          </div>

          {/* Lista de topics */}
          <div style={{ display: 'grid', gap: '1rem' }}>
            {Object.entries(categories[selectedCategory].topics || {}).map(([topicKey, topic]) => (
              <div key={topicKey} style={{
                border: '2px solid #e5e7eb',
                borderRadius: '8px',
                overflow: 'hidden'
              }}>
                {/* Header del topic */}
                <button
                  onClick={() => handleTopicClick(topicKey)}
                  style={{
                    width: '100%',
                    padding: '1rem',
                    backgroundColor: selectedTopic === topicKey ? '#3b82f6' : '#f9fafb',
                    color: selectedTopic === topicKey ? 'white' : '#374151',
                    border: 'none',
                    cursor: 'pointer',
                    textAlign: 'left',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontWeight: '600'
                  }}
                >
                  <span>{topic.title}</span>
                  <span style={{ fontSize: '1.2rem' }}>
                    {selectedTopic === topicKey ? '▼' : '▶'}
                  </span>
                </button>

                {/* Contenido del topic */}
                {selectedTopic === topicKey && (
                  <div style={{ padding: '1rem', backgroundColor: 'white' }}>
                    <p style={{ color: '#6b7280', marginBottom: '1rem' }}>
                      {topic.description}
                    </p>
                    
                    {/* Subtemas */}
                    {topic.subtopics && topic.subtopics.length > 0 ? (
                      <div>
                        <h4 style={{ color: '#7c3aed', marginBottom: '1rem' }}>
                          🔍 Subtemas disponibles ({topic.subtopics.length}):
                        </h4>
                        <div style={{ display: 'grid', gap: '0.5rem' }}>
                          {topic.subtopics.map((subtopic, index) => (
                            <div key={index} style={{
                              border: '1px solid #e5e7eb',
                              borderRadius: '6px',
                              overflow: 'hidden'
                            }}>
                              <button
                                onClick={() => handleSubtopicClick(subtopic.title)}
                                style={{
                                  width: '100%',
                                  padding: '0.75rem',
                                  backgroundColor: expandedSubtopic === subtopic.title ? '#7c3aed' : '#f3f4f6',
                                  color: expandedSubtopic === subtopic.title ? 'white' : '#374151',
                                  border: 'none',
                                  cursor: 'pointer',
                                  textAlign: 'left',
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  alignItems: 'center',
                                  fontWeight: '500'
                                }}
                              >
                                <span>{subtopic.title}</span>
                                <span>
                                  {expandedSubtopic === subtopic.title ? '▼' : '▶'}
                                </span>
                              </button>

                              {/* Items del subtopic */}
                              {expandedSubtopic === subtopic.title && (
                                <div style={{ padding: '0.75rem', backgroundColor: 'white' }}>
                                  <p style={{ color: '#6b7280', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                                    <strong>Items disponibles ({subtopic.items?.length || 0}):</strong>
                                  </p>
                                  <ul style={{ margin: 0, paddingLeft: '1rem' }}>
                                    {subtopic.items && subtopic.items.map((item, itemIndex) => (
                                      <li key={itemIndex} style={{ marginBottom: '0.25rem' }}>
                                        {typeof item === 'object' && item.title ? (
                                          <span style={{ fontWeight: '500' }}>{item.title}</span>
                                        ) : (
                                          <span>{item}</span>
                                        )}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <p style={{ color: '#6b7280', fontStyle: 'italic' }}>
                        No hay subtemas disponibles para este tema.
                      </p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Resumen */}
      <div style={{
        backgroundColor: '#f0fdf4',
        padding: '1rem',
        borderRadius: '8px',
        marginTop: '2rem',
        border: '2px solid #22c55e',
        textAlign: 'center'
      }}>
        <h3>✅ Sistema Funcionando Correctamente</h3>
        <p>
          Los temas se están cargando desde las traducciones y se muestran correctamente.
          <br />
          Puedes navegar entre categorías, temas y subtemas haciendo clic en ellos.
        </p>
      </div>
    </div>
  );
};

export default TopicsDemo;

