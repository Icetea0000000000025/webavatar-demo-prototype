import { useState, useEffect, useCallback, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '../lib/LanguageContext';
import { useTheme } from '../lib/ThemeContext';
import ThemeToggle from './ThemeToggle';
import logoNewLightBlue from '../assets/logo-new-light-blue-02.png';
import textLogoNew from '../assets/Asset-5-8.png';
import { pagesConfig } from '../config/pages';
import { X } from 'lucide-react';


export default function AppNavbar() {
  const location = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { language, setLanguage, t } = useTranslation();
  const { isDark } = useTheme();

  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [mobileLangMenuOpen, setMobileLangMenuOpen] = useState(false);


  const supportedLanguages = [
    { code: 'en', label: 'EN', flagCode: 'us', native: 'English' },
    { code: 'th', label: 'TH', flagCode: 'th', native: 'ไทย' },
    { code: 'zh', label: 'ZH', flagCode: 'cn', native: '中文' },
    { code: 'ja', label: 'JA', flagCode: 'jp', native: '日本語' },
    { code: 'ko', label: 'KO', flagCode: 'kr', native: '한국어' },
    { code: 'es', label: 'ES', flagCode: 'es', native: 'Español' },
    { code: 'fr', label: 'FR', flagCode: 'fr', native: 'Français' },
  ] as const;

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const mainNavPages = pagesConfig.filter(p => p.enabled && !['flight', 'order', 'itstore'].includes(p.id));
  const isDemoActive = isActive('/all-demo');



  const openDrawer = () => setDrawerOpen(true);
  const closeDrawer = useCallback(() => setDrawerOpen(false), []);

  /* Close drawer and language dropdowns on route change */
  useEffect(() => {
    closeDrawer();
    setLangMenuOpen(false);
    setMobileLangMenuOpen(false);
  }, [location, closeDrawer]);

  /* Close drawer on Escape key */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') closeDrawer(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [closeDrawer]);

  const navRef = useRef<HTMLElement>(null);

  /* Horizontal scroll on mouse wheel hover */
  useEffect(() => {
    const el = navRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      if (e.deltaY === 0) return;
      e.preventDefault();
      el.scrollLeft += e.deltaY;
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, []);

  /* Prevent body scroll when drawer is open */
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [drawerOpen]);

  const [scrolled, setScrolled] = useState(false);
  const scrolledRef = useRef(false);
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(() => {
          const isScrolled = window.scrollY > 10;
          if (scrolledRef.current !== isScrolled) {
            scrolledRef.current = isScrolled;
            setScrolled(isScrolled);
          }
          ticking = false;
        });
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Navbar background
  const isSitePage = location.pathname === '/nia-site-2026';
  const navbarBg = 'transparent';
  const navbarBorder = 'transparent';

  // Animation variants
  const logoVariants = {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const } }
  };

  const navItemVariants = {
    initial: { opacity: 0, y: -10 },
    animate: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.05,
        duration: 0.5,
        ease: [0.16, 1, 0.3, 1] as const
      }
    })
  };

  const drawerVariants = {
    closed: { x: '100%', transition: { type: 'spring' as const, damping: 25, stiffness: 200 } },
    open: { x: 0, transition: { type: 'spring' as const, damping: 25, stiffness: 200 } }
  };

  const overlayVariants = {
    closed: { opacity: 0 },
    open: { opacity: 1 }
  };

  return (
    <>
      <motion.header
        className={`navbar ${isSitePage ? 'site2026-theme' : ''} ${scrolled ? 'navbar-scrolled' : ''}`}
        style={{
          backgroundColor: navbarBg,
          borderColor: navbarBorder,
          transition: 'none', // Prevent conflict with Framer Motion scroll transform
        }}
      >
        <Link
          to="/"
          onClick={() => window.scrollTo(0, 0)}
          style={{ textDecoration: 'none', color: 'inherit' }}
        >
          <motion.div
            className="logo-container"
            style={{ cursor: 'pointer' }}
            variants={logoVariants}
            initial="initial"
            animate="animate"
          >
            <img className="logo-icon" src={logoNewLightBlue} alt="Botnoi Logo" />
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <span className="logo-text" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', lineHeight: 1 }}>
                <img src={textLogoNew} alt="Botnoi" style={{ height: '1.25rem', objectFit: 'contain', verticalAlign: 'middle' }} />
                <span>Labs</span>
              </span>
            </div>
          </motion.div>
        </Link>

        {/* Desktop nav */}
        <nav ref={navRef} aria-label="Main Navigation" style={{ justifySelf: 'start', marginLeft: '6rem' }}>
          <ul className="nav-links">
            {mainNavPages.map((page, index) => {
              const path = page.path;
              const id = `nav-${page.id}`;
              const key = page.key as any;
              const active = isActive(path) && (path !== '/' || location.pathname === '/');
              return (
                <motion.li
                  key={path}
                  className={`nav-item ${active ? 'active-link' : ''}`}
                  custom={index}
                  variants={navItemVariants}
                  initial="initial"
                  animate="animate"
                >
                  <Link to={path} id={id} onClick={() => window.scrollTo(0, 0)}>
                    {t(key)}
                    {active && (
                      <motion.div
                        layoutId="activeTab"
                        className="nav-active-pill"
                        transition={{
                          x: { type: 'spring', stiffness: 380, damping: 30 },
                          width: { type: 'spring', stiffness: 380, damping: 30 },
                          y: { type: 'tween', duration: 0 },
                          height: { type: 'tween', duration: 0 }
                        }}
                      />
                    )}
                  </Link>
                </motion.li>
              );
            })}

            {/* All Demos — direct link to /all-demo */}
            <motion.li
              className={`nav-item ${isDemoActive ? 'active-link' : ''}`}
              custom={mainNavPages.length}
              variants={navItemVariants}
              initial="initial"
              animate="animate"
            >
              <Link
                to="/all-demo"
                id="nav-all-demos"
                onClick={() => window.scrollTo(0, 0)}
                style={{ whiteSpace: 'nowrap' }}
              >
                {t('nav.all_demos')}
                {isDemoActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="nav-active-pill"
                    transition={{
                      x: { type: 'spring', stiffness: 380, damping: 30 },
                      width: { type: 'spring', stiffness: 380, damping: 30 },
                      y: { type: 'tween', duration: 0 },
                      height: { type: 'tween', duration: 0 }
                    }}
                  />
                )}
              </Link>
            </motion.li>
          </ul>
        </nav>

        {/* Desktop CTA & Language Switch */}
        <motion.div
          className="navbar-cta"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.25, duration: 0.5 }}
          style={{ marginLeft: 'auto' }}
        >
          {/* Dark / Light Theme Toggle */}
          <ThemeToggle isSitePage={isSitePage} />

          {/* Language Switch Toggle */}
          <div style={{ position: 'relative', zIndex: 10 }}>
            <button
              onClick={() => setLangMenuOpen(!langMenuOpen)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '0.5rem',
                minWidth: '95px',
                backgroundColor: isSitePage
                  ? 'rgba(28, 25, 23, 0.5)'
                  : isDark
                  ? 'rgba(30, 41, 59, 0.8)'
                  : 'rgba(244, 244, 245, 0.9)',
                borderRadius: '10px',
                padding: '0.45rem 1rem',
                border: `1px solid ${
                  isSitePage
                    ? 'rgba(244, 63, 94, 0.2)'
                    : isDark
                    ? 'rgba(255, 255, 255, 0.15)'
                    : 'rgba(228, 228, 231, 0.8)'
                }`,
                cursor: 'pointer',
                fontSize: '0.75rem',
                fontWeight: '700',
                color: isSitePage ? '#FFFFFF' : isDark ? '#F8FAFC' : 'var(--primary)',
                transition: 'all 0.2s',
              }}
              id="lang-dropdown-trigger"
            >
              <img
                src={`https://flagcdn.com/w40/${supportedLanguages.find(l => l.code === language)?.flagCode || 'us'}.png`}
                alt={language}
                style={{
                  width: '16px',
                  height: '16px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '1px solid rgba(0,0,0,0.08)'
                }}
              />
              <span>{language.toUpperCase()}</span>
              <span style={{
                fontSize: '0.6rem',
                opacity: 0.7,
                display: 'inline-block',
                transform: langMenuOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s'
              }}>▼</span>
            </button>

            {langMenuOpen && (
              <>
                {/* Backdrop overlay */}
                <div
                  onClick={() => setLangMenuOpen(false)}
                  style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    zIndex: 998,
                    backgroundColor: 'transparent',
                  }}
                />

                {/* Dropdown list */}
                <div
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 0.5rem)',
                    right: 0,
                    backgroundColor: isSitePage
                      ? 'rgba(28, 25, 23, 0.95)'
                      : isDark
                      ? 'rgba(15, 23, 42, 0.95)'
                      : 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(12px)',
                    border: `1px solid ${
                      isSitePage
                        ? 'rgba(244, 63, 94, 0.15)'
                        : isDark
                        ? 'rgba(255, 255, 255, 0.15)'
                        : 'rgba(228, 228, 231, 0.85)'
                    }`,
                    borderRadius: '12px',
                    padding: '0.4rem',
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.05)',
                    minWidth: '150px',
                    zIndex: 999,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.2rem',
                  }}
                  id="lang-dropdown-menu"
                >
                  {supportedLanguages.map((lang) => {
                    const active = language === lang.code;
                    return (
                      <button
                        key={lang.code}
                        onClick={() => {
                          setLanguage(lang.code);
                          setLangMenuOpen(false);
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.75rem',
                          padding: '0.45rem 0.6rem',
                          borderRadius: '8px',
                          border: 'none',
                          backgroundColor: active
                            ? isSitePage
                              ? 'rgba(239, 68, 68, 0.15)'
                              : isDark
                              ? 'rgba(99, 102, 241, 0.25)'
                              : 'rgba(99, 102, 241, 0.08)'
                            : 'transparent',
                          color: active
                            ? isSitePage
                              ? '#FFFFFF'
                              : isDark
                              ? '#818CF8'
                              : 'var(--primary)'
                            : isSitePage
                            ? '#A1A1AA'
                            : isDark
                            ? '#94A3B8'
                            : 'var(--muted-foreground)',
                          fontSize: '0.75rem',
                          fontWeight: active ? '700' : '500',
                          textAlign: 'left',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                        }}
                        className={`lang-option-${lang.code}`}
                      >
                        <span style={{ flex: 1 }}>{lang.native}</span>
                        <img
                          src={`https://flagcdn.com/w40/${lang.flagCode}.png`}
                          alt={lang.label}
                          style={{
                            width: '16px',
                            height: '16px',
                            borderRadius: '50%',
                            objectFit: 'cover',
                            border: '1px solid rgba(0,0,0,0.08)'
                          }}
                        />
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>

          <div className="widget-indicator" id="widget-status">
            <span className="widget-dot"></span>
            <span>{t('nav.live')}</span>
          </div>
        </motion.div>

        {/* Hamburger (mobile only) */}
        <button
          className={`hamburger-btn${drawerOpen ? ' open' : ''}`}
          onClick={drawerOpen ? closeDrawer : openDrawer}
          aria-label="Toggle navigation menu"
          aria-expanded={drawerOpen}
          id="hamburger-btn"
        >
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
        </button>
      </motion.header>

      {/* Mobile Drawer using AnimatePresence */}
      <AnimatePresence>
        {drawerOpen && (
          <div className="mobile-drawer-portal" id="mobile-drawer">
            {/* Backdrop */}
            <motion.div
              className="mobile-drawer-overlay"
              variants={overlayVariants}
              initial="closed"
              animate="open"
              exit="closed"
              onClick={closeDrawer}
            />

            {/* Panel */}
            <motion.div
              className={`mobile-drawer-panel ${isSitePage ? 'site2026-theme dark bg-zinc-950 text-stone-100 border-l border-rose-500/10' : ''}`}
              variants={drawerVariants}
              initial="closed"
              animate="open"
              exit="closed"
            >
              {/* Drawer header */}
              <div className="mobile-drawer-header">
                <Link
                  to="/"
                  onClick={closeDrawer}
                  className="mobile-drawer-logo"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', textDecoration: 'none' }}
                >
                  <img src={textLogoNew} alt="Botnoi" style={{ height: '1.25rem', objectFit: 'contain', verticalAlign: 'middle' }} />
                  <span>Labs</span>
                </Link>

                <button
                  type="button"
                  className="mobile-drawer-close"
                  onClick={closeDrawer}
                  aria-label="Close menu"
                >
                  <X style={{ width: '16px', height: '16px' }} />
                </button>
              </div>

              {/* Mobile Quick Controls Toolbar (Theme & Language) */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '0.5rem',
                  padding: '0.5rem 0.75rem',
                  marginBottom: '1.25rem',
                  borderRadius: '14px',
                  border: `1px solid ${
                    isSitePage
                      ? 'rgba(244, 63, 94, 0.2)'
                      : isDark
                      ? 'rgba(255, 255, 255, 0.12)'
                      : 'rgba(228, 228, 231, 0.8)'
                  }`,
                  backgroundColor: isSitePage
                    ? 'rgba(28, 25, 23, 0.4)'
                    : isDark
                    ? 'rgba(30, 41, 59, 0.4)'
                    : 'rgba(244, 244, 245, 0.7)',
                }}
              >
                {/* Theme Toggle for Mobile */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <ThemeToggle isSitePage={isSitePage} />
                  <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--foreground)' }}>
                    {isDark ? t('theme.dark') : t('theme.light')}
                  </span>
                </div>

                {/* Language Switch Toggle for Mobile */}
                <div style={{ position: 'relative', zIndex: 10 }}>
                  <button
                    onClick={() => setMobileLangMenuOpen(!mobileLangMenuOpen)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.45rem',
                      backgroundColor: isSitePage
                        ? 'rgba(28, 25, 23, 0.7)'
                        : isDark
                        ? 'rgba(30, 41, 59, 0.8)'
                        : 'rgba(255, 255, 255, 0.9)',
                      borderRadius: '10px',
                      padding: '0.4rem 0.75rem',
                      border: `1px solid ${
                        isSitePage
                          ? 'rgba(244, 63, 94, 0.2)'
                          : isDark
                          ? 'rgba(255, 255, 255, 0.15)'
                          : 'rgba(228, 228, 231, 0.8)'
                      }`,
                      cursor: 'pointer',
                      fontSize: '0.7rem',
                      fontWeight: '700',
                      color: isSitePage ? '#FFFFFF' : isDark ? '#F8FAFC' : 'var(--primary)',
                      transition: 'all 0.2s',
                    }}
                    id="mobile-lang-dropdown-trigger"
                  >
                    <img
                      src={`https://flagcdn.com/w40/${supportedLanguages.find(l => l.code === language)?.flagCode || 'us'}.png`}
                      alt={language}
                      style={{
                        width: '14px',
                        height: '14px',
                        borderRadius: '50%',
                        objectFit: 'cover',
                        border: '1px solid rgba(0,0,0,0.08)'
                      }}
                    />
                    <span>{language.toUpperCase()}</span>
                    <span style={{
                      fontSize: '0.55rem',
                      opacity: 0.7,
                      display: 'inline-block',
                      transform: mobileLangMenuOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.2s'
                    }}>▼</span>
                  </button>

                  {mobileLangMenuOpen && (
                    <>
                      {/* Backdrop overlay */}
                      <div
                        onClick={() => setMobileLangMenuOpen(false)}
                        style={{
                          position: 'fixed',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          zIndex: 998,
                          backgroundColor: 'transparent',
                        }}
                      />

                      {/* Dropdown list */}
                      <div
                        style={{
                          position: 'absolute',
                          top: 'calc(100% + 0.5rem)',
                          right: 0,
                          backgroundColor: isSitePage
                            ? 'rgba(28, 25, 23, 0.95)'
                            : isDark
                            ? 'rgba(15, 23, 42, 0.95)'
                            : 'rgba(255, 255, 255, 0.95)',
                          backdropFilter: 'blur(12px)',
                          border: `1px solid ${
                            isSitePage
                              ? 'rgba(244, 63, 94, 0.15)'
                              : isDark
                              ? 'rgba(255, 255, 255, 0.15)'
                              : 'rgba(228, 228, 231, 0.85)'
                          }`,
                          borderRadius: '12px',
                          padding: '0.4rem',
                          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.05)',
                          minWidth: '140px',
                          zIndex: 999,
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '0.2rem',
                        }}
                        id="mobile-lang-dropdown-menu"
                      >
                        {supportedLanguages.map((lang) => {
                          const active = language === lang.code;
                          return (
                            <button
                              key={lang.code}
                              onClick={() => {
                                setLanguage(lang.code);
                                setMobileLangMenuOpen(false);
                              }}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                                padding: '0.4rem 0.5rem',
                                borderRadius: '8px',
                                border: 'none',
                                backgroundColor: active
                                  ? isSitePage
                                    ? 'rgba(239, 68, 68, 0.15)'
                                    : isDark
                                    ? 'rgba(99, 102, 241, 0.25)'
                                    : 'rgba(99, 102, 241, 0.08)'
                                  : 'transparent',
                                color: active
                                  ? isSitePage
                                    ? '#FFFFFF'
                                    : isDark
                                    ? '#818CF8'
                                    : 'var(--primary)'
                                  : isSitePage
                                  ? '#A1A1AA'
                                  : isDark
                                  ? '#94A3B8'
                                  : 'var(--muted-foreground)',
                                fontSize: '0.7rem',
                                fontWeight: active ? '700' : '500',
                                textAlign: 'left',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                              }}
                            >
                              <span style={{ flex: 1 }}>{lang.native}</span>
                              <img
                                src={`https://flagcdn.com/w40/${lang.flagCode}.png`}
                                alt={lang.label}
                                style={{
                                  width: '14px',
                                  height: '14px',
                                  borderRadius: '50%',
                                  objectFit: 'cover',
                                  border: '1px solid rgba(0,0,0,0.08)'
                                }}
                              />
                            </button>
                          );
                        })}
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Nav links */}
              <nav aria-label="Mobile Navigation">
                <ul className="mobile-nav-links">
                  {mainNavPages.map((page) => {
                    const path = page.path;
                    const id = `mobile-nav-${page.id}`;
                    const key = page.key as any;
                    const active = isActive(path) && (path !== '/' || location.pathname === '/');
                    return (
                      <li
                        key={path}
                        className={`mobile-nav-item ${active ? 'active-link' : ''}`}
                      >
                        <Link to={path} id={id} onClick={() => {
                          window.scrollTo(0, 0);
                          closeDrawer();
                        }}>
                          {t(key)}
                        </Link>
                      </li>
                    );
                  })}

                  {/* All Demos — direct link in mobile drawer */}
                  <li className={`mobile-nav-item ${isDemoActive ? 'active-link' : ''}`}>
                    <Link
                      to="/all-demo"
                      id="mobile-nav-all-demos"
                      onClick={() => {
                        window.scrollTo(0, 0);
                        closeDrawer();
                      }}
                    >
                      {t('nav.all_demos')}
                    </Link>
                  </li>
                </ul>
              </nav>

              <div className="mobile-nav-divider" />

              {/* CTA in drawer */}
              <div className="mobile-cta-section">
                <div className="mobile-widget-indicator">
                  <span className="widget-dot"></span>
                  <span>{t('nav.live')}</span>
                </div>
                <Link
                  className="btn btn-primary"
                  to="/contact"
                  onClick={() => {
                    window.scrollTo(0, 0);
                    closeDrawer();
                  }}
                  id="mobile-cta-button"
                  style={{ display: 'block', textAlign: 'center' }}
                >
                  {t('nav.request')}
                </Link>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
