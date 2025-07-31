import React from 'react';
import { useLanguage } from '../LanguageContext';

const Certifications = () => {
  const { t } = useLanguage();

  const certifications = [
    {
      id: 1,
      title: "AAAHC Accreditation",
      institution: "Accreditation Association for Ambulatory Health Care",
      year: "2023",
      badgeType: "accreditation",
      description: "Certificación AAAHC que garantiza los más altos estándares de calidad y seguridad en atención médica ambulatoria. Esta acreditación demuestra nuestro compromiso con la excelencia en el cuidado pediátrico.",
      officialLink: "https://www.aaahc.org/",
      linkText: t('certifications.links.aaahc')
    },
    {
      id: 2,
      title: "PCMH Recognition",
      institution: "National Committee for Quality Assurance (NCQA)",
      year: "2023",
      badgeType: "recognition",
      description: "Reconocimiento PCMH (Patient-Centered Medical Home) que certifica nuestro modelo de atención integral centrado en el paciente y su familia, garantizando coordinación de cuidados y seguimiento continuo.",
      officialLink: "https://www.ncqa.org/programs/health-care-providers-practices/patient-centered-medical-home-pcmh/",
      linkText: t('certifications.links.pcmh')
    }
  ];

  const renderBadge = (badgeType) => {
    if (badgeType === 'accreditation') {
      return (
        <div className="certification-badge-container accreditation-badge">
          <div className="badge-icon">🏆</div>
          <div className="badge-text">
            <div className="badge-title">{t('certifications.badges.accredited')}</div>
            <div className="badge-subtitle">AAAHC</div>
          </div>
        </div>
      );
    } else if (badgeType === 'recognition') {
      return (
        <div className="certification-badge-container recognition-badge">
          <div className="badge-icon">🏠</div>
          <div className="badge-text">
            <div className="badge-title">{t('certifications.badges.recognized')}</div>
            <div className="badge-subtitle">PCMH</div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <section className="certifications" id="certificaciones">
      <div className="section-header">
        <span className="section-badge">{t('certifications.badge')}</span>
        <h2>{t('certifications.title')}</h2>
        <p className="section-description">{t('certifications.description')}</p>
      </div>
      
      <div className="certifications-grid">
        {certifications.map((cert) => (
          <div key={cert.id} className="certification-card">
            <div className="certification-icon">
              {renderBadge(cert.badgeType)}
            </div>
            <div className="certification-content">
              <h3 className="certification-title">{cert.title}</h3>
              <p className="certification-institution">{cert.institution}</p>
              <p className="certification-year">{cert.year}</p>
              <p className="certification-description">{cert.description}</p>
              <div className="certification-link">
                <a 
                  href={cert.officialLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="official-link"
                >
                  {cert.linkText} →
                </a>
              </div>
            </div>
            <div className="certification-badge">
              <span className="verified-badge">{t('certifications.badges.verified')}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="certifications-footer">
        <div className="certifications-note">
          <p>{t('certifications.note')}</p>
        </div>
      </div>
    </section>
  );
};

export default Certifications; 