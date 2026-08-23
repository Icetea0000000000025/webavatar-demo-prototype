import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { useTranslation } from '../lib/LanguageContext';

export const AppFooter: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div 
      className="footer-reveal-wrapper"
      style={{ clipPath: 'polygon(0% 0, 100% 0%, 100% 100%, 0 100%)' }}
    >
      {/* Invisible spacer creating document height for the uncurtain reveal */}
      <div className="footer-reveal-spacer" />

      {/* Fixed Footer underneath revealed as user scrolls */}
      <footer className="footer-reveal-content" id="app-footer">
        <div className="max-w-[1240px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 flex flex-col justify-between h-full relative z-10">
          
          {/* Main Content Grid: Brand + 3 Navigation Columns */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 py-2 items-start">
            
            {/* Brand Column (4 cols) */}
            <div className="md:col-span-4 flex flex-col gap-3">
              <h3 className="text-lg font-bold tracking-tight text-foreground cursor-default">
                Botnoi Group
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-sm">
                {t('footer.brand_desc')}
              </p>
            </div>

            {/* Column 1: Use Cases (3 cols) */}
            <div className="md:col-span-3 flex flex-col gap-3">
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-foreground cursor-default">
                {t('footer.usecases')}
              </h4>
              <ul className="flex flex-col gap-2 text-sm">
                <li>
                  <Link to="/flight-demo" className="text-muted-foreground hover:text-sky-500 dark:hover:text-sky-400 transition-colors">
                    {t('footer.flight_booking')}
                  </Link>
                </li>
                <li>
                  <a 
                    href="https://botnoi-hotel-two.vercel.app/" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-muted-foreground hover:text-sky-500 dark:hover:text-sky-400 transition-colors inline-flex items-center gap-1 group"
                  >
                    {t('footer.hotel_booking')}
                    <ArrowUpRight className="size-3 opacity-40 group-hover:opacity-100 group-hover:text-sky-500 dark:group-hover:text-sky-400 transition-all" />
                  </a>
                </li>
                <li>
                  <Link to="/food-demo" className="text-muted-foreground hover:text-sky-500 dark:hover:text-sky-400 transition-colors">
                    {t('food.title')}
                  </Link>
                </li>
                <li>
                  <Link to="/it-store-demo" className="text-muted-foreground hover:text-sky-500 dark:hover:text-sky-400 transition-colors">
                    {t('nav.itstore')}
                  </Link>
                </li>
                <li>
                  <Link to="/all-demo" className="text-muted-foreground hover:text-sky-500 dark:hover:text-sky-400 transition-colors">
                    {t('nav.all_demos')}
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="text-muted-foreground hover:text-sky-500 dark:hover:text-sky-400 transition-colors">
                    {t('footer.contact_leads')}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 2: Company (3 cols) */}
            <div className="md:col-span-2 lg:col-span-3 flex flex-col gap-3">
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-foreground cursor-default">
                {t('footer.company')}
              </h4>
              <ul className="flex flex-col gap-2 text-sm">
                <li>
                  <Link to="/about" className="text-muted-foreground hover:text-sky-500 dark:hover:text-sky-400 transition-colors">
                    {t('nav.about')}
                  </Link>
                </li>
                <li>
                  <a 
                    href="https://botnoi.ai" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-muted-foreground hover:text-sky-500 dark:hover:text-sky-400 transition-colors inline-flex items-center gap-1 group"
                  >
                    {t('footer.botnoi_ai')}
                    <ArrowUpRight className="size-3 opacity-40 group-hover:opacity-100 group-hover:text-sky-500 dark:group-hover:text-sky-400 transition-all" />
                  </a>
                </li>
                <li>
                  <a 
                    href="https://voice.botnoi.ai" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-muted-foreground hover:text-sky-500 dark:hover:text-sky-400 transition-colors inline-flex items-center gap-1 group"
                  >
                    {t('footer.botnoi_voice')}
                    <ArrowUpRight className="size-3 opacity-40 group-hover:opacity-100 group-hover:text-sky-500 dark:group-hover:text-sky-400 transition-all" />
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 3: Support (2 cols) */}
            <div className="md:col-span-3 lg:col-span-2 flex flex-col gap-3">
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-foreground cursor-default">
                {t('footer.support')}
              </h4>
              <ul className="flex flex-col gap-2 text-sm">
                <li>
                  <Link to="/contact" className="text-muted-foreground hover:text-sky-500 dark:hover:text-sky-400 transition-colors">
                    {t('footer.request_live')}
                  </Link>
                </li>
                <li>
                  <a href="mailto:admin@botnoigroup.com" className="text-muted-foreground hover:text-sky-500 dark:hover:text-sky-400 transition-colors">
                    {t('footer.email_dev')}
                  </a>
                </li>
              </ul>
            </div>

          </div>

          {/* Bottom Bar: Copyright & Legal */}
          <div className="pt-6 border-t border-border/40 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
            <div>
              © {new Date().getFullYear()} {t('footer.all_rights')}
            </div>
            <div className="flex items-center gap-4 font-mono">
              <span className="hover:text-sky-500 dark:hover:text-sky-400 cursor-pointer transition-colors">{t('footer.privacy')}</span>
              <span>•</span>
              <span className="hover:text-sky-500 dark:hover:text-sky-400 cursor-pointer transition-colors">{t('footer.terms')}</span>
            </div>
          </div>

        </div>
      </footer>
    </div>
  );
};

export default AppFooter;
