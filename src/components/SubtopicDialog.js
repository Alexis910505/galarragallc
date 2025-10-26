import React, { useEffect } from 'react';

const SubtopicDialog = ({ subtopic, isOpen, onClose }) => {
  // Deshabilitar scroll del body cuando el modal está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.documentElement.classList.add('modal-open');
      document.body.classList.add('modal-open');
    } else {
      document.body.style.overflow = 'unset';
      document.documentElement.classList.remove('modal-open');
      document.body.classList.remove('modal-open');
    }

    // Cleanup: restaurar scroll cuando el componente se desmonte
    return () => {
      document.body.style.overflow = 'unset';
      document.documentElement.classList.remove('modal-open');
      document.body.classList.remove('modal-open');
    };
  }, [isOpen]);

  if (!isOpen || !subtopic) {
    return null;
  }

  const displayTitle = subtopic.title;

  const formatDescription = (description) => {
    // Dividir por las preguntas que comienzan con "¿"
    const sections = description.split(/(?=¿[^¿]*\?)/);
    
    return sections.map((section, index) => {
      if (section.trim()) {
        // Si la sección comienza con una pregunta, crear un h4
        if (section.trim().startsWith('¿')) {
          const questionEnd = section.indexOf('?');
          const question = section.substring(0, questionEnd + 1);
          const content = section.substring(questionEnd + 1);
          
          return `
            <h4>${question}</h4>
            <p>${content.trim()}</p>
          `;
        } else {
          // Si no es una pregunta, solo crear un párrafo
          return `<p>${section.trim()}</p>`;
        }
      }
      return '';
    }).join('');
  };

  return (
    <div className="subtopic-dialog-overlay" onClick={onClose}>
      <div className="subtopic-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="subtopic-dialog-header">
          <h3>{displayTitle}</h3>
          <button
            className="close-subtopic-dialog-btn"
            onClick={onClose}
            aria-label="Cerrar diálogo"
          >
            <span>×</span>
          </button>
        </div>
        <div className="subtopic-dialog-body">
          <div className="subtopic-description">
            {subtopic.description ? (
              <div dangerouslySetInnerHTML={{ __html: formatDescription(subtopic.description) }} />
            ) : (
              'Información detallada sobre este tema'
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubtopicDialog;
