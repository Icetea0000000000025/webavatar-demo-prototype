import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../lib/LanguageContext';

export const AppFooter: React.FC = () => {
  const { t } = useTranslation();

  return (
    <footer className="tech-footer relative z-10" id="footer-test">
      <div className="footer-content">
        <div className="footer-brand">
          <h3>Botnoi Group</h3>
          <p>{t('footer.brand_desc')}</p>
        </div>
        <nav className="footer-links-col" aria-label="Usecases Links">
          <h4>{t('footer.usecases')}</h4>
          <ul>
            <li><Link to="/flight-demo">{t('footer.flight_booking')}</Link></li>
            <li><Link to="/food-demo">{t('food.title')}</Link></li>
            <li><Link to="/it-store-demo">{t('nav.itstore')}</Link></li>
            <li><Link to="/all-demo">{t('nav.all_demos')}</Link></li>
            <li><Link to="/contact">{t('footer.contact_leads')}</Link></li>
          </ul>
        </nav>
        <nav className="footer-links-col" aria-label="Company Links">
          <h4>{t('footer.company')}</h4>
          <ul>
            <li><Link to="/about">{t('nav.about')}</Link></li>
            <li><a href="https://botnoi.ai" target="_blank" rel="noopener noreferrer">{t('footer.botnoi_ai')}</a></li>
            <li><a href="https://voice.botnoi.ai" target="_blank" rel="noopener noreferrer">{t('footer.botnoi_voice')}</a></li>
          </ul>
        </nav>
        <nav className="footer-links-col" aria-label="Support Links">
          <h4>{t('footer.support')}</h4>
          <ul>
            <li><Link to="/contact">{t('footer.request_live')}</Link></li>
            <li><a href="mailto:admin@botnoigroup.com">{t('footer.email_dev')}</a></li>
          </ul>
        </nav>
      </div>
      <div className="footer-bottom">
        <div>© {new Date().getFullYear()} {t('footer.all_rights')}</div>
        <div style={{ display: 'flex', gap: '1.5rem' }}>
          <span>{t('footer.privacy')}</span>
          <span>{t('footer.terms')}</span>
        </div>
      </div>
    </footer>
  );
};

export default AppFooter;
