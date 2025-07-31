import React from 'react';
import { useLanguage } from '../LanguageContext';

const Certifications = () => {
  const { t } = useLanguage();

  const certification = {
    id: 1,
    title: t('certifications.certifiedAsPcmhByAaahc'),
    institution: t('certifications.aaahcFullName'),
    year: "2023",
    description: t('certifications.certificationDescription'),
    features: t('certifications.features'),
          links: [
        {
          url: "https://www.aaahc.org/",
          text: t('certifications.links.aaahc')
        },
        {
          url: "https://www.aaahc.org/certification/primary-care/",
          text: t('certifications.links.pcmh')
        }
      ]
  };

  const renderBadge = () => {
    return (
      <div className="certification-badge-container combined-badge">
        <div className="badge-icon">🏆</div>
        <div className="badge-text">
          <div className="badge-title">{t('certifications.badges.certified')}</div>
          <div className="badge-subtitle">{t('certifications.pcmhCertified')}</div>
        </div>
      </div>
    );
  };

  return (
    <section className="certifications" id="certificaciones">
      <div className="section-header">
        <span className="section-badge">{t('certifications.badge')}</span>
        <h2>{t('certifications.title')}</h2>
        <p className="section-description">{t('certifications.description')}</p>
      </div>
      
      <div className="certifications-grid">
        <div className="certification-card enhanced-card">
          <div className="certification-header">
            <div className="certification-icon">
              {renderBadge()}
            </div>
            <div className="certification-badge">
              <span className="verified-badge">{t('certifications.badges.verified')}</span>
            </div>
          </div>
          
          <div className="certification-content">
            <h3 className="certification-title">{certification.title}</h3>
            <p className="certification-institution">{certification.institution}</p>
            <p className="certification-year">{certification.year}</p>
            
            <div className="certification-description-section">
              <p className="certification-description">{certification.description}</p>
              
              <div className="certification-features">
                <h4 className="features-title">{t('certifications.featuresTitle')}</h4>
                <ul className="features-list">
                  {certification.features.map((feature, index) => (
                    <li key={index} className="feature-item">
                      <span className="feature-icon">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div className="certification-links">
              <h4 className="links-title">{t('certifications.linksTitle')}</h4>
              <div className="links-container">
                {certification.links.map((link, index) => (
                  <a 
                    key={index}
                    href={link.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="official-link"
                  >
                    {link.text} →
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
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