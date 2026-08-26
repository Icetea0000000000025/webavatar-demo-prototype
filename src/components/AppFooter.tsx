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
            <div className="md:col-span-4 lg:col-span-4 flex flex-col gap-3">
              <div className="h-7 flex items-center">
                <h3 className="text-base sm:text-lg font-bold tracking-tight text-foreground cursor-default">
                  Botnoi Group
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-sm">
                {t('footer.brand_desc')}
              </p>
            </div>

            {/* Column 1: Use Cases Part 1 (2 cols) */}
            <div className="md:col-span-2 lg:col-span-2 flex flex-col gap-3">
              <div className="h-7 flex items-center">
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-foreground cursor-default">
                  {t('footer.usecases')}
                </h4>
              </div>
              <ul className="flex flex-col gap-2 text-sm">
                <li className="min-h-[28px] flex items-center leading-snug">
                  <Link to="/flight-demo" className="text-muted-foreground hover:text-sky-500 dark:hover:text-sky-400 transition-colors inline-block break-words whitespace-normal">
                    {t('footer.flight_booking')}
                  </Link>
                </li>
                <li className="min-h-[28px] flex items-center leading-snug">
                  <a 
                    href="https://botnoi-hotel-two.vercel.app/" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-muted-foreground hover:text-sky-500 dark:hover:text-sky-400 transition-colors inline-flex items-center gap-1 group break-words whitespace-normal"
                  >
                    <span>{t('footer.hotel_booking')}</span>
                    <ArrowUpRight className="size-3 opacity-40 group-hover:opacity-100 group-hover:text-sky-500 dark:group-hover:text-sky-400 transition-all flex-shrink-0" />
                  </a>
                </li>
                <li className="min-h-[28px] flex items-center leading-snug">
                  <Link to="/food-demo" className="text-muted-foreground hover:text-sky-500 dark:hover:text-sky-400 transition-colors inline-block break-words whitespace-normal">
                    {t('food.title')}
                  </Link>
                </li>
                <li className="min-h-[28px] flex items-center leading-snug">
                  <Link to="/it-store-demo" className="text-muted-foreground hover:text-sky-500 dark:hover:text-sky-400 transition-colors inline-block break-words whitespace-normal">
                    {t('nav.itstore')}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 2: Use Cases Part 2 (2 cols) */}
            <div className="md:col-span-2 lg:col-span-2 flex flex-col gap-3">
              <div className="h-7 flex items-center">
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-foreground cursor-default">
                  {t('footer.usecases')}
                </h4>
              </div>
              <ul className="flex flex-col gap-2 text-sm">
                <li className="min-h-[28px] flex items-center leading-snug">
                  <Link to="/all-demo" className="text-muted-foreground hover:text-sky-500 dark:hover:text-sky-400 transition-colors inline-block break-words whitespace-normal">
                    {t('nav.all_demos')}
                  </Link>
                </li>
                <li className="min-h-[28px] flex items-center leading-snug">
                  <Link to="/ai-sales" className="text-muted-foreground hover:text-sky-500 dark:hover:text-sky-400 transition-colors inline-block break-words whitespace-normal">
                    {t('nav.ai_sales')}
                  </Link>
                </li>
                <li className="min-h-[28px] flex items-center leading-snug">
                  <Link to="/event" className="text-muted-foreground hover:text-sky-500 dark:hover:text-sky-400 transition-colors inline-block break-words whitespace-normal">
                    {t('nav.event')}
                  </Link>
                </li>
                <li className="min-h-[28px] flex items-center leading-snug">
                  <Link to="/contact" className="text-muted-foreground hover:text-sky-500 dark:hover:text-sky-400 transition-colors inline-block break-words whitespace-normal">
                    {t('footer.contact_leads')}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3: Company (2 cols) */}
            <div className="md:col-span-2 lg:col-span-2 flex flex-col gap-3">
              <div className="h-7 flex items-center">
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-foreground cursor-default">
                  {t('footer.company')}
                </h4>
              </div>
              <ul className="flex flex-col gap-2 text-sm">
                <li className="min-h-[28px] flex items-center leading-snug">
                  <Link to="/about" className="text-muted-foreground hover:text-sky-500 dark:hover:text-sky-400 transition-colors inline-block break-words whitespace-normal">
                    {t('nav.about')}
                  </Link>
                </li>
                <li className="min-h-[28px] flex items-center leading-snug">
                  <a 
                    href="https://botnoi.ai" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-muted-foreground hover:text-sky-500 dark:hover:text-sky-400 transition-colors inline-flex items-center gap-1 group break-words whitespace-normal"
                  >
                    <span>{t('footer.botnoi_ai')}</span>
                    <ArrowUpRight className="size-3 opacity-40 group-hover:opacity-100 group-hover:text-sky-500 dark:group-hover:text-sky-400 transition-all flex-shrink-0" />
                  </a>
                </li>
                <li className="min-h-[28px] flex items-center leading-snug">
                  <a 
                    href="https://voice.botnoi.ai" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-muted-foreground hover:text-sky-500 dark:hover:text-sky-400 transition-colors inline-flex items-center gap-1 group break-words whitespace-normal"
                  >
                    <span>{t('footer.botnoi_voice')}</span>
                    <ArrowUpRight className="size-3 opacity-40 group-hover:opacity-100 group-hover:text-sky-500 dark:group-hover:text-sky-400 transition-all flex-shrink-0" />
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 4: Support (2 cols) */}
            <div className="md:col-span-2 lg:col-span-2 flex flex-col gap-3">
              <div className="h-7 flex items-center">
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-foreground cursor-default">
                  {t('footer.support')}
                </h4>
              </div>
              <ul className="flex flex-col gap-2 text-sm">
                <li className="min-h-[28px] flex items-center leading-snug">
                  <Link to="/contact" className="text-muted-foreground hover:text-sky-500 dark:hover:text-sky-400 transition-colors inline-block break-words whitespace-normal">
                    {t('footer.request_live')}
                  </Link>
                </li>
                <li className="min-h-[28px] flex items-center leading-snug">
                  <a href="mailto:admin@botnoigroup.com" className="text-muted-foreground hover:text-sky-500 dark:hover:text-sky-400 transition-colors inline-block break-words whitespace-normal">
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
