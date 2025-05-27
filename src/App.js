import './App.css';
import { useState, useEffect, useRef } from 'react';
import { LanguageProvider, useLanguage } from './LanguageContext';

// Componente para el botón de cambio de idioma
function LanguageToggle() {
  const { language, toggleLanguage } = useLanguage();
  return (
    <button 
      className="language-toggle" 
      onClick={toggleLanguage}
      aria-label={language === 'es' ? 'Switch to English' : 'Cambiar a Español'}
    >
      {language === 'es' ? 'EN' : 'ES'}
    </button>
  );
}

// Componente principal envuelto en el contexto de idioma
function AppContent() {
  const [isHeroVisible, setIsHeroVisible] = useState(true);
  const [isServicesVisible, setIsServicesVisible] = useState(true);
  const [isContactVisible, setIsContactVisible] = useState(true);
  const heroRef = useRef(null);
  const servicesRef = useRef(null);
  const contactRef = useRef(null);
  const { t, language } = useLanguage();

  const openMaps = (e) => {
    e.preventDefault();
    const address = t('contact.info.addressValue');
    const encodedAddress = encodeURIComponent(address);
    
    // Detectar si es un dispositivo móvil
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
      // Detectar si es iOS
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
      
      if (isIOS) {
        // Abrir Apple Maps en iOS
        window.open(`maps://maps.apple.com/?q=${encodedAddress}`, '_blank');
      } else {
        // Abrir Google Maps en Android
        window.open(`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`, '_blank');
      }
    } else {
      // En la web, usar la URL específica
      window.open('https://maps.app.goo.gl/i2w4hWe67Z6bcAjWA', '_blank');
    }
  };

  const scrollToServices = (e) => {
    e.preventDefault();
    servicesRef.current?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  };

  const scrollToContact = (e) => {
    e.preventDefault();
    contactRef.current?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  };

  useEffect(() => {
    const currentHeroRef = heroRef.current;
    const currentServicesRef = servicesRef.current;
    const currentContactRef = contactRef.current;

    const heroObserver = new IntersectionObserver(
      ([entry]) => {
        setIsHeroVisible(entry.isIntersecting);
      },
      {
        threshold: 0,
        rootMargin: '-100px 0px 0px 0px'
      }
    );

    const servicesObserver = new IntersectionObserver(
      ([entry]) => {
        setIsServicesVisible(entry.isIntersecting);
      },
      {
        threshold: 0,
        rootMargin: '-100px 0px 0px 0px'
      }
    );

    const contactObserver = new IntersectionObserver(
      ([entry]) => {
        setIsContactVisible(entry.isIntersecting);
      },
      {
        threshold: 0,
        rootMargin: '-100px 0px 0px 0px'
      }
    );

    if (currentHeroRef) {
      heroObserver.observe(currentHeroRef);
    }

    if (currentServicesRef) {
      servicesObserver.observe(currentServicesRef);
    }

    if (currentContactRef) {
      contactObserver.observe(currentContactRef);
    }

    return () => {
      if (currentHeroRef) {
        heroObserver.unobserve(currentHeroRef);
      }
      if (currentServicesRef) {
        servicesObserver.unobserve(currentServicesRef);
      }
      if (currentContactRef) {
        contactObserver.unobserve(currentContactRef);
      }
    };
  }, []);

  return (
    <div className="App" lang={language}>
      {/* AppBar */}
      <div 
        className={`app-bar ${!isHeroVisible ? 'visible' : ''}`}
        style={{ 
          backgroundImage: `linear-gradient(rgba(15, 118, 110, 0.3), rgba(15, 118, 110, 0.5)), url(${process.env.PUBLIC_URL}/images/hero_image.jpg)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="app-bar-content">
          <h2 className="app-bar-title">{t('appBar.title')}</h2>
          <div className="app-bar-buttons">
            {!isContactVisible && (
              <button 
                className="app-bar-button primary" 
                onClick={scrollToContact}
                aria-label={t('appBar.requestAppointment')}
                type="button"
              >
                {t('appBar.requestAppointment')}
              </button>
            )}
            {!isServicesVisible && (
              <button 
                className="app-bar-button secondary" 
                onClick={scrollToServices}
                aria-label={t('appBar.knowServices')}
                type="button"
              >
                {t('appBar.knowServices')}
              </button>
            )}
          </div>
          <div className="language-toggle-container">
            <LanguageToggle />
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section ref={heroRef} className="hero" style={{ backgroundImage: `linear-gradient(rgba(15, 118, 110, 0.3), rgba(15, 118, 110, 0.5)), url(${process.env.PUBLIC_URL}/images/hero_image.jpg)` }}>
        <div className="language-toggle-container hero-language-toggle">
          <LanguageToggle />
        </div>
        <div className="hero-content">
          <span className="hero-badge">{t('hero.badge')}</span>
          <h1>{t('hero.title')}</h1>
          <p>{t('hero.description')}</p>
          <div className="hero-buttons">
            <button className="cta-button primary" onClick={scrollToContact}>{t('appBar.requestAppointment')}</button>
            <button className="cta-button secondary" onClick={scrollToServices}>{t('appBar.knowServices')}</button>
          </div>
          <div className="hero-features">
            <div className="feature">
              <i className="feature-icon">👨‍⚕️</i>
              <span>{t('hero.features.certifiedDoctors')}</span>
            </div>
            <div className="feature">
              <i className="feature-icon">💉</i>
              <span>{t('hero.features.modernEquipment')}</span>
            </div>
            <div className="feature">
              <i className="feature-icon">⏰</i>
              <span>{t('hero.features.immediateAttention')}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Servicios Section */}
      <section ref={servicesRef} className="services" id="servicios">
        <div className="section-header">
          <span className="section-badge">{t('services.badge')}</span>
          <h2>{t('services.title')}</h2>
          <p className="section-description">{t('services.description')}</p>
        </div>
        <div className="services-grid">
          <div className="service-card">
            <div className="service-icon">🩺</div>
            <h3>{t('services.cards.generalMedicine.title')}</h3>
            <p>{t('services.cards.generalMedicine.description')}</p>
            <ul className="service-features">
              {t('services.cards.generalMedicine.features').map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
          </div>
          <div className="service-card">
            <div className="service-icon">💊</div>
            <h3>{t('services.cards.preventiveMedicine.title')}</h3>
            <p>{t('services.cards.preventiveMedicine.description')}</p>
            <ul className="service-features">
              {t('services.cards.preventiveMedicine.features').map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
          </div>
          <div className="service-card">
            <div className="service-icon">🏥</div>
            <h3>{t('services.cards.emergencyMedicine.title')}</h3>
            <p>{t('services.cards.emergencyMedicine.description')}</p>
            <ul className="service-features">
              {t('services.cards.emergencyMedicine.features').map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* How We Help Section */}
      <section className="how-we-help" id="how-we-help">
        <div className="section-header">
          <span className="section-badge">{t('howWeHelp.badge')}</span>
          <h2>{t('howWeHelp.title')}</h2>
          <p className="section-description">{t('howWeHelp.description')}</p>
        </div>
        <div className="how-we-help-grid">
          <div className="help-card">
            <div className="help-icon">{t('howWeHelp.cards.personalizedCare.icon')}</div>
            <h3>{t('howWeHelp.cards.personalizedCare.title')}</h3>
            <p>{t('howWeHelp.cards.personalizedCare.description')}</p>
          </div>
          <div className="help-card">
            <div className="help-icon">{t('howWeHelp.cards.preventiveCare.icon')}</div>
            <h3>{t('howWeHelp.cards.preventiveCare.title')}</h3>
            <p>{t('howWeHelp.cards.preventiveCare.description')}</p>
          </div>
          <div className="help-card">
            <div className="help-icon">{t('howWeHelp.cards.familyCare.icon')}</div>
            <h3>{t('howWeHelp.cards.familyCare.title')}</h3>
            <p>{t('howWeHelp.cards.familyCare.description')}</p>
          </div>
          <div className="help-card">
            <div className="help-icon">{t('howWeHelp.cards.emergencyCare.icon')}</div>
            <h3>{t('howWeHelp.cards.emergencyCare.title')}</h3>
            <p>{t('howWeHelp.cards.emergencyCare.description')}</p>
          </div>
        </div>
      </section>

      {/* Subscribe Section */}
      <section className="subscribe">
        <div className="subscribe-container">
          <div className="subscribe-content">
            <div className="section-header">
              <span className="section-badge">{t('subscribe.badge')}</span>
              <h2>{t('subscribe.title')}</h2>
              <p className="section-description">{t('subscribe.description')}</p>
            </div>
            <form className="subscribe-form" onSubmit={(e) => e.preventDefault()}>
              <div className="form-group">
                <input
                  type="email"
                  placeholder={t('subscribe.form.placeholder')}
                  aria-label={t('subscribe.form.email')}
                  required
                />
                <button type="submit" className="subscribe-button">
                  {t('subscribe.form.button')}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Testimonios Section */}
      <section className="testimonials">
        <div className="section-header">
          <span className="section-badge">{t('testimonials.badge')}</span>
          <h2>{t('testimonials.title')}</h2>
          <p className="section-description">{t('testimonials.description')}</p>
        </div>
        <div className="testimonials-grid">
          <div className="testimonial-card">
            <div className="testimonial-content">
              <p>"La atención médica es excepcional. Los doctores son muy profesionales y dedicados. Me siento muy bien atendida y segura en sus manos."</p>
            </div>
            <div className="testimonial-author">
              <div className="author-avatar">👤</div>
              <div className="author-info">
                <h4>María González</h4>
                <span>{t('testimonials.patientSince')} 2022</span>
              </div>
            </div>
          </div>
          <div className="testimonial-card">
            <div className="testimonial-content">
              <p>"Las instalaciones son modernas y el personal es muy amable. Los doctores toman el tiempo necesario para explicar todo detalladamente. Altamente recomendado."</p>
            </div>
            <div className="testimonial-author">
              <div className="author-avatar">👤</div>
              <div className="author-info">
                <h4>Carlos Rodríguez</h4>
                <span>{t('testimonials.patientSince')} 2021</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="about" id="about">
        <div className="about-badge-container">
          <span className="section-badge">{t('about.badge')}</span>
        </div>
        <div className="about-container">
          <div className="about-content">
            <div className="about-text">
              <h2>{t('about.title')}</h2>
              <p>{t('about.description')}</p>
              <div className="about-features">
                <div className="about-feature">
                  <span className="feature-number">15+</span>
                  <span className="feature-text">{t('about.features.yearsExperience')}</span>
                </div>
                <div className="about-feature">
                  <span className="feature-number">10k+</span>
                  <span className="feature-text">{t('about.features.satisfiedPatients')}</span>
                </div>
                <div className="about-feature">
                  <span className="feature-number">100%</span>
                  <span className="feature-text">{t('about.features.healthCommitment')}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="about-image">
            <img 
              src={`${process.env.PUBLIC_URL}/images/thumbnail.jpeg`}
              alt="Yolanda A. Galarraga Ramirez MD" 
              className="about-thumbnail"
            />
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section ref={contactRef} className="contact" id="contacto">
        <div className="section-header">
          <span className="section-badge">{t('contact.badge')}</span>
          <h2>{t('contact.title')}</h2>
          <p className="section-description">{t('contact.description')}</p>
        </div>
        <div className="contact-container">
          <form className="contact-form">
            <div className="form-group">
              <label htmlFor="name">{t('contact.form.name')}</label>
              <input type="text" id="name" placeholder={t('contact.form.name')} required />
            </div>
            <div className="form-group">
              <label htmlFor="email">{t('contact.form.email')}</label>
              <input type="email" id="email" placeholder="tu@email.com" required />
            </div>
            <div className="form-group">
              <label htmlFor="phone">{t('contact.form.phone')}</label>
              <input type="tel" id="phone" placeholder="(123) 456-7890" required />
            </div>
            <div className="form-group">
              <label htmlFor="service">{t('contact.form.service')}</label>
              <select id="service" required>
                <option value="">{t('contact.form.selectService')}</option>
                <option value="general">{t('services.cards.generalMedicine.title')}</option>
                <option value="preventive">{t('services.cards.preventiveMedicine.title')}</option>
                <option value="emergency">{t('services.cards.emergencyMedicine.title')}</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="message">{t('contact.form.message')}</label>
              <textarea id="message" placeholder={t('contact.form.message')}></textarea>
            </div>
            <button type="submit" className="submit-button">{t('contact.form.submit')}</button>
          </form>
          <div className="contact-info">
            <div className="info-card">
              <h3>{t('contact.info.title')}</h3>
              <div className="info-item">
                <i className="info-icon">📞</i>
                <div>
                  <h4>{t('contact.info.phone')}</h4>
                  <a 
                    href={`tel:${t('contact.info.phoneValue').replace(/\D/g, '')}`} 
                    className="phone"
                    aria-label={t('contact.info.phoneValue')}
                  >
                    {t('contact.info.phoneValue')}
                  </a>
                </div>
              </div>
              <div className="info-item">
                <i className="info-icon">⏰</i>
                <div>
                  <h4>{t('contact.info.hours')}</h4>
                  <p>{t('contact.info.hoursWeekdays')}</p>
                  <p>{t('contact.info.hoursSaturday')}</p>
                  <p>{t('contact.info.hoursSunday')}</p>
                </div>
              </div>
              <div className="info-item">
                <i className="info-icon">📍</i>
                <div>
                  <h4>{t('contact.info.address')}</h4>
                  <p>{t('contact.info.addressValue')}</p>
                  <button 
                    className="location-button"
                    onClick={openMaps}
                    aria-label={t('contact.info.findUs')}
                  >
                    <i className="location-icon">🗺️</i>
                    {t('contact.info.findUs')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h3>{t('appBar.title')}</h3>
            <p>{t('footer.description')}</p>
          </div>
          <div className="footer-section">
            <h4>{t('footer.quickLinks')}</h4>
            <ul>
              <li><a href="#servicios" onClick={scrollToServices}>{t('footer.services')}</a></li>
              <li><a href="#how-we-help">{t('footer.howWeHelp')}</a></li>
              <li><a href="#about">{t('footer.aboutUs')}</a></li>
              <li><a href="#contacto" onClick={scrollToContact}>{t('footer.contact')}</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>{t('footer.followUs')}</h4>
            <div className="social-links">
              <button className="social-link" aria-label="Facebook" onClick={() => window.open('https://facebook.com', '_blank')}>📱</button>
              <button className="social-link" aria-label="WhatsApp" onClick={() => window.open('https://wa.me/13056497663', '_blank')}>💬</button>
              <button className="social-link" aria-label="Instagram" onClick={() => window.open('https://instagram.com', '_blank')}>📸</button>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <div className="footer-copyright">
              Copyright © 2024 {t('appBar.title')} - {t('footer.rights')}
            </div>
            <div className="footer-developer">
              {t('footer.developedBy')}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Componente App que envuelve todo con el Provider
function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}

export default App;
