import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, Mic, Globe } from 'lucide-react';
import { useTranslation } from '../lib/LanguageContext';
import AnimatedSection from '../components/AnimatedSection';
import SemiCircleGauge from '../components/SemiCircleGauge';
import AppFooter from '../components/AppFooter';
import './Pages.css';
import logoNewLightBlue from '../assets/logo-new-light-blue-02.png';
import botnoiAirLogo from '../assets/BOTNOI-AIR-logo.png';
import botnoiRestaurantLogo from '../assets/BOTNOI-Restaurant-logo.png';

export default function Home() {

  const { t } = useTranslation();

  const handleScrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Stagger variants for the features list
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { type: 'spring' as const, damping: 20, stiffness: 100 },
    },
  };

  return (
    <div style={{ position: 'relative', overflow: 'hidden', width: '100%' }}>

      {/* HERO SECTION */}
      <section className="hero-section" id="hero" aria-label="Hero Section">
        <div style={{ maxWidth: '1050px', zIndex: 1, width: '100%' }}>
          <AnimatedSection direction="up" duration={0.8} delay={0.1}>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 border border-indigo-100 text-indigo-600 mb-6 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></span>
              {t('home.badge')}
            </span>
            <h1 className="leading-tight text-wrap-balance">
              {t('home.hero_title')}
            </h1>
            <p className="hero-subtitle">
              {t('home.hero_subtitle')}
            </p>
          </AnimatedSection>

          <AnimatedSection direction="up" duration={0.8} delay={0.25} className="hero-ctas">
            <button className="btn btn-primary" onClick={() => handleScrollTo('demo-showcase')} id="btn-explore-demos">
              {t('home.btn_explore')}
            </button>
            <button className="btn btn-glass" onClick={() => handleScrollTo('avatar-tech-details')} id="btn-view-tech">
              {t('home.btn_tech')}
            </button>
          </AnimatedSection>
        </div>

        {/* Hero Interactive Mockup */}
        <AnimatedSection direction="up" duration={1.0} delay={0.4} className="hero-mockup-wrapper w-full z-10">
          <div className="hero-mockup">
            <div className="mockup-header">
              <div className="mockup-dot red"></div>
              <div className="mockup-dot yellow"></div>
              <div className="mockup-dot green"></div>
              <div className="mockup-address">https://botnoi.ai/labs/webavatar</div>
            </div>
            <div className="mockup-body">
              <div className="flex flex-col justify-between h-full">
                <div>
                  <h3 style={{ color: 'var(--card-foreground)', marginBottom: '1rem', letterSpacing: '-0.02em' }}>
                    {t('home.mockup_title')}
                  </h3>
                  <p style={{ fontSize: '0.9rem', color: 'var(--muted-foreground)', marginBottom: '1.5rem', lineHeight: '1.65' }}>
                    {t('home.mockup_desc')}
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', marginTop: 'auto' }}>
                  <Link className="btn btn-primary" style={{ padding: '0.5rem 1.25rem', fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }} to="/contact" id="mockup-cta">
                    {t('home.btn_request_live')}
                  </Link>
                  <button className="btn btn-secondary" style={{ padding: '0.5rem 1.25rem', fontSize: '0.85rem' }} onClick={() => handleScrollTo('demo-showcase')} id="mockup-pricing">
                    {t('home.btn_launch_usecases')}
                  </button>
                </div>
              </div>
              <div className="avatar-preview-box">
                <div className="avatar-visual-wrapper">
                  <div className="avatar-wave"></div>
                  <div className="avatar-wave-2"></div>
                  <div className="avatar-pulsing-circle" style={{ overflow: 'hidden', padding: '24px', background: 'var(--card)', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
                    <img src={logoNewLightBlue} alt="Avatar Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                  </div>
                </div>
                <div style={{ textAlign: 'center', zIndex: 1 }}>
                  <div style={{ fontWeight: '700', fontSize: '0.85rem', color: 'var(--card-foreground)' }}>{t('home.mockup_avatar_title')}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--accent-foreground)', fontWeight: '600', letterSpacing: '0.05em' }}>{t('home.mockup_awaiting')}</div>
                </div>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </section>

      {/* SOCIAL PROOF BAR / GAUGE STATS SECTION */}
      <section className="border-y border-border/40 bg-zinc-50/40 dark:bg-slate-900/30 backdrop-blur-md py-10 relative z-10" id="stats-section" aria-label="Key Statistics">
        <div style={{ maxWidth: '1150px', margin: '0 auto', padding: '0 1.5rem' }}>
          <AnimatedSection direction="up" duration={0.8}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              {/* Gauge 1: Active Clients */}
              <SemiCircleGauge
                value={5000}
                suffix="+"
                percentage={92}
                label={t('home.stats_clients')}
                icon={<Users className="size-5" />}
                gradientId="gauge-clients"
                colorStart="#0284c7"
                colorEnd="#6366f1"
                badgeBg="bg-sky-50 dark:bg-sky-950/60"
                badgeText="text-sky-600 dark:text-sky-400"
                badgeBorder="border border-sky-200/80 dark:border-sky-800/80"
              />

              {/* Gauge 2: Realistic Voices */}
              <SemiCircleGauge
                value={100}
                suffix="+"
                percentage={85}
                label={t('home.stats_voices')}
                icon={<Mic className="size-5" />}
                gradientId="gauge-voices"
                colorStart="#8b5cf6"
                colorEnd="#d946ef"
                badgeBg="bg-purple-50 dark:bg-purple-950/60"
                badgeText="text-purple-600 dark:text-purple-400"
                badgeBorder="border border-purple-200/80 dark:border-purple-800/80"
              />

              {/* Gauge 3: Supported Languages */}
              <SemiCircleGauge
                value={10}
                suffix="+"
                percentage={95}
                label={t('home.stats_languages')}
                icon={<Globe className="size-5" />}
                gradientId="gauge-languages"
                colorStart="#10b981"
                colorEnd="#06b6d4"
                badgeBg="bg-emerald-50 dark:bg-emerald-950/60"
                badgeText="text-emerald-600 dark:text-emerald-400"
                badgeBorder="border border-emerald-200/80 dark:border-emerald-800/80"
              />
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* DEMO SHOWCASE SECTION */}
      <section className="section-wrapper relative z-10" id="demo-showcase" style={{ margin: '6rem auto', maxWidth: '1150px', padding: '0 1.5rem' }} aria-label="Demo Showcase">
        <AnimatedSection direction="up" duration={0.8}>
          <div className="section-header">
            <h2>{t('home.select_usecase')}</h2>
            <p>{t('home.usecase_subtitle')}</p>
          </div>
        </AnimatedSection>


        <div className="bento-grid">
          {/* Card 1: Flight Booking */}
          <div className="bento-card col-3" id="card-flight-demo">
            <div className="bento-card-header">
              <div className="bento-icon-box bento-icon-air" style={{ width: '48px', height: '48px', padding: '3px', overflow: 'hidden', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img src={botnoiAirLogo} alt="Botnoi Air" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              </div>
              <h3 style={{ margin: 0, letterSpacing: '-0.02em' }}>{t('home.card_flight_title')}</h3>
            </div>
            <p>
              {t('home.card_flight_desc')}
            </p>
            <Link className="bento-card-footer" to="/flight-demo" id="link-flight-demo">
              {t('home.card_flight_cta')} <span aria-hidden="true">→</span>
            </Link>
          </div>

          {/* Card 2: Food Ordering */}
          <div className="bento-card col-3" id="card-food-demo">
            <div className="bento-card-header">
              <div className="bento-icon-box bento-icon-restaurant" style={{ width: '48px', height: '48px', padding: '3px', overflow: 'hidden', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img src={botnoiRestaurantLogo} alt="Botnoi Restaurant" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              </div>
              <h3 style={{ margin: 0, letterSpacing: '-0.02em' }}>{t('food.title')}</h3>
            </div>
            <p>
              {t('showcase.desc_restaurant')}
            </p>
            <Link className="bento-card-footer" to="/food-demo" id="link-food-demo">
              {t('showcase.launch_demo')} <span aria-hidden="true">→</span>
            </Link>
          </div>

          {/* Card 3: IT Store */}
          <div className="bento-card col-3" id="card-itstore-demo">
            <div className="bento-card-header">
              <div className="bento-icon-box bento-icon-b2b-style">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0ea5e9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>
                </svg>
              </div>
              <h3 style={{ margin: 0, letterSpacing: '-0.02em' }}>{t('home.card_itstore_title')}</h3>
            </div>
            <p>
              {t('home.card_itstore_desc')}
            </p>
            <Link className="bento-card-footer" to="/it-store-demo" id="link-itstore-demo">
              {t('home.card_itstore_cta')} <span aria-hidden="true">→</span>
            </Link>
          </div>

          {/* Card 4: Hotel & Resort Booking */}
          <div className="bento-card col-3" id="card-hotel-demo">
            <div className="bento-card-header">
              <div className="bento-icon-box bento-icon-b2b-style">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0ea5e9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 20v-8a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v8" />
                  <path d="M4 10V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v4" />
                  <path d="M12 4v6" />
                  <path d="M2 18h20" />
                </svg>
              </div>
              <h3 style={{ margin: 0, letterSpacing: '-0.02em' }}>{t('home.card_hotel_title')}</h3>
            </div>
            <p>
              {t('home.card_hotel_desc')}
            </p>
            <a
              className="bento-card-footer"
              href="https://botnoi-hotel-two.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              id="link-hotel-demo"
            >
              {t('home.card_hotel_cta')} <span aria-hidden="true">↗</span>
            </a>
          </div>

          {/* Card 5: B2B Sales Inquiry Form */}
          <div className="bento-card col-6" id="card-contact-demo">
            <div className="bento-card-header">
              <div className="bento-icon-box bento-icon-b2b-style">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0ea5e9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10zM2 12h20" /></svg>
              </div>
              <h3 style={{ margin: 0, letterSpacing: '-0.02em' }}>{t('home.card_contact_title')}</h3>
            </div>
            <p>
              {t('home.card_contact_desc')}
            </p>
            <Link className="bento-card-footer" to="/contact" id="link-contact-demo">
              {t('home.card_contact_cta')} <span aria-hidden="true">→</span>
            </Link>
          </div>

          {/* Card 6: All Demos Showcase Portal */}
          <div className="bento-card col-6" id="card-all-demo">
            <div className="bento-card-header">
              <div className="bento-icon-box bento-icon-b2b-style">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0ea5e9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
                </svg>
              </div>
              <h3 style={{ margin: 0, letterSpacing: '-0.02em' }}>{t('home.card_alldemo_title')}</h3>
            </div>
            <p>
              {t('home.card_alldemo_desc')}
            </p>
            <div style={{ display: 'flex', gap: '2rem', marginTop: '1.5rem', flexWrap: 'wrap' }}>
              <Link className="bento-card-footer" style={{ cursor: 'pointer', flex: '1 1 200px', marginTop: 0 }} to="/all-demo" id="link-all-demo">
                {t('home.card_alldemo_cta')} <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>


      {/* WEBAVATAR SHOWCASE PANEL */}
      <section className="section-wrapper relative z-10" style={{ margin: '6rem auto', maxWidth: '1150px', padding: '0 1.5rem' }} id="avatar-showcase" aria-label="WebAvatar Technology Showcase">
        <AnimatedSection direction="up" duration={0.8}>
          <div className="glass-panel" id="avatar-tech-details" style={{ padding: '3.5rem 3rem', transition: 'none' }}>
            <div className="showcase-grid">
              <div>
                <div style={{ textTransform: 'uppercase', fontSize: '0.75rem', color: 'var(--primary)', fontWeight: '800', letterSpacing: '0.1em', marginBottom: '0.75rem' }}>
                  {t('home.tech_title')}
                </div>
                <h2 style={{ fontSize: '2.2rem', marginBottom: '1.25rem', letterSpacing: '-0.03em' }}>{t('home.tech_subtitle')}</h2>
                <p style={{ lineHeight: '1.65', marginBottom: '1rem' }}>
                  {t('home.tech_desc')}
                </p>
                <Link className="btn btn-primary" to="/contact" id="avatar-contact-cta" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                  {t('home.tech_cta')}
                </Link>
              </div>

              <motion.div
                className="feature-list"
                id="avatar-features"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-10%' }}
              >
                <motion.div variants={itemVariants}>
                  <div className="feature-item">
                    <span className="feature-check">✓</span>
                    <div>
                      <div className="feature-item-title">{t('home.rule1_title')}</div>
                      <div className="feature-item-desc">{t('home.rule1_desc')}</div>
                    </div>
                  </div>
                </motion.div>
                <motion.div variants={itemVariants}>
                  <div className="feature-item">
                    <span className="feature-check">✓</span>
                    <div>
                      <div className="feature-item-title">{t('home.rule2_title')}</div>
                      <div className="feature-item-desc">{t('home.rule2_desc')}</div>
                    </div>
                  </div>
                </motion.div>
                <motion.div variants={itemVariants}>
                  <div className="feature-item">
                    <span className="feature-check">✓</span>
                    <div>
                      <div className="feature-item-title">{t('home.rule3_title')}</div>
                      <div className="feature-item-desc">{t('home.rule3_desc')}</div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </AnimatedSection>
      </section>

      {/* TECH FOOTER */}
      <AppFooter />
    </div>
  );
}