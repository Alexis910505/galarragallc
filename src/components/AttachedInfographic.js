import React, { useMemo } from 'react';
import { useLanguage } from '../LanguageContext';

const AttachedInfographic = () => {
  const { t } = useLanguage();

  // Lista de archivos PDF reales - se recrea cuando cambia el idioma
  const pdfFiles = useMemo(() => [
    {
      id: 1,
      title: t('infographic.files.leadScreening.title'),
      description: t('infographic.files.leadScreening.description'),
      filename: 'Lead Screening Flyer (1).pdf',
      thumbnail: 'lead-screening-thumb.jpg',
      icon: '⚠️',
      color: '#ef4444',
      previewLines: ['La buena noticia:', 'El envenenamiento', 'por plomo es 100%', 'prevenible.'],
      previewColor: '#fff5f5'
    },
    {
      id: 2,
      title: t('infographic.files.patientsBill.title'),
      description: t('infographic.files.patientsBill.description'),
      filename: 'Patients Bill of Right and Responsibility-Flyer (1).pdf',
      thumbnail: 'patients-bill-thumb.jpg',
      icon: '📄',
      color: '#3b82f6',
      previewLines: ['GALARRAGA &', 'ASOCIADOS, MD, PAAP', 'Carta de Derechos', 'y Responsabilidades'],
      previewColor: '#eff6ff'
    },
    {
      id: 3,
      title: t('infographic.files.vipPcmh.title'),
      description: t('infographic.files.vipPcmh.description'),
      filename: 'VIP PCMH Flyer (1).pdf',
      thumbnail: 'vip-pcmh-thumb.jpg',
      icon: '⭐',
      color: '#f59e0b',
      previewLines: ['THE VIP Patient', 'Experience with', 'Patient-Centered', 'Medical Home'],
      previewColor: '#fffbeb'
    },
    {
      id: 4,
      title: t('infographic.files.patientMedicalHome.title'),
      description: t('infographic.files.patientMedicalHome.description'),
      filename: 'WHAT IS A PATIENT MEDICAL HOME-letter size (1).pdf',
      thumbnail: 'patient-medical-home-thumb.jpg',
      icon: '🏠',
      color: '#10b981',
      previewLines: ['What is a', 'Patient-Centered', 'Medical Home', '(PCMH)?'],
      previewColor: '#f0fdf4'
    }
  ], [t]);

  const handleDownload = (filename) => {
    // Crear un enlace temporal para forzar la descarga
    const pdfPath = `${process.env.PUBLIC_URL || ''}/pdfs/${filename}`;
    const link = document.createElement('a');
    link.href = pdfPath;
    link.download = filename; // Esto fuerza la descarga en lugar de abrir
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section className="attached-infographic" id="infografias">
      <div className="section-header">
        <span className="section-badge">{t('infographic.badge')}</span>
        <h2>{t('infographic.title')}</h2>
        <p className="section-description">{t('infographic.description')}</p>
      </div>
      
      <div className="infographic-grid">
        {pdfFiles.map((file) => (
          <div 
            key={file.id} 
            className="pdf-document-card"
            onClick={() => handleDownload(file.filename)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleDownload(file.filename);
              }
            }}
            aria-label={`Descargar ${file.title}`}
          >
            <div className="pdf-preview-container">
              <div className="pdf-preview" style={{ '--preview-bg': file.previewColor }}>
                <img 
                  src={`${process.env.PUBLIC_URL || ''}/images/pdf-thumbnails/${file.thumbnail}`}
                  alt={file.title}
                  className="pdf-thumbnail-image"
                  onError={(e) => {
                    // Si no existe la imagen, ocultar la img y mostrar el fallback
                    e.target.style.display = 'none';
                    const container = e.target.parentElement;
                    const fallback = container.nextElementSibling;
                    if (fallback && fallback.classList.contains('pdf-preview-fallback')) {
                      fallback.style.display = 'flex';
                    }
                  }}
                />
                <div className="folded-corner"></div>
                <div className="pdf-hover-overlay">
                  <div className="pdf-hover-content">
                    <div className="pdf-hover-title">{file.title}</div>
                    <div className="pdf-hover-button">
                      <svg className="download-icon" xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" fill="currentColor">
                        <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
              <div className="pdf-preview-fallback" style={{display: 'none', '--preview-bg': file.previewColor}}>
                <div className="pdf-preview-content">
                  <div className="pdf-body-preview">
                    <div className="pdf-preview-icon">{file.icon}</div>
                    {file.previewLines.map((line, index) => (
                      <div key={index} className="pdf-preview-line">{line}</div>
                    ))}
                  </div>
                </div>
                <div className="folded-corner"></div>
              </div>
            </div>
            <div className="pdf-label">
              <span className="pdf-badge-red">PDF</span>
            </div>
          </div>
        ))}
      </div>
      
      <div className="infographic-footer">
        <p className="infographic-note">{t('infographic.note')}</p>
      </div>
    </section>
  );
};

export default AttachedInfographic;
