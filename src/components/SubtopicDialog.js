import React, { useEffect } from 'react';
import { formatArticleHtml } from '../utils/formatArticleHtml';
import { decodeHtmlEntities } from '../utils/decodeHtmlEntities';

const SubtopicDialog = ({ subtopic, isOpen, onClose }) => {
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

    return () => {
      document.body.style.overflow = 'unset';
      document.documentElement.classList.remove('modal-open');
      document.body.classList.remove('modal-open');
    };
  }, [isOpen]);

  if (!isOpen || !subtopic) {
    return null;
  }

  const formattedContent = formatArticleHtml(subtopic.description);

  if (!formattedContent) {
    return null;
  }

  return (
    <div className="subtopic-dialog-overlay" onClick={onClose}>
      <div className="subtopic-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="subtopic-dialog-header">
          <h3>{decodeHtmlEntities(subtopic.title)}</h3>
          <button
            className="close-subtopic-dialog-btn"
            onClick={onClose}
            aria-label="Cerrar diálogo"
          >
            <span>×</span>
          </button>
        </div>
        <div className="subtopic-dialog-body">
          <div
            className="subtopic-description"
            dangerouslySetInnerHTML={{ __html: formattedContent }}
          />
        </div>
      </div>
    </div>
  );
};

export default SubtopicDialog;
