import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  Users, Mic, Globe, Laptop,
  Building2, FileText, Layers, ArrowRight,
  ChevronDown
} from 'lucide-react';
import { useTranslation } from '../lib/LanguageContext';
import AppFooter from '../components/AppFooter';
import SemiCircleGauge from '../components/SemiCircleGauge';
import InteractiveBoxesBackground from '../components/InteractiveBoxesBackground';
import './Pages.css';
import logoNewLightBlue from '../assets/logo-new-light-blue-02.png';
import botnoiAirLogo from '../assets/BOTNOI-AIR-logo.png';
import botnoiRestaurantLogo from '../assets/BOTNOI-Restaurant-logo.png';



/* ─────────────────────────────────────────────
   Marquee Strip
───────────────────────────────────────────── */
function MarqueeStrip() {
  const { t } = useTranslation();
  const items = [
    { src: botnoiAirLogo, label: t('marquee.botnoi_air') },
    { src: botnoiRestaurantLogo, label: t('marquee.botnoi_restaurant') },
    { src: logoNewLightBlue, label: t('marquee.webavatar') },
    { src: botnoiAirLogo, label: t('marquee.flight_booking') },
    { src: botnoiRestaurantLogo, label: t('marquee.food_ordering') },
    { src: logoNewLightBlue, label: t('marquee.voice_ai') },
  ];
  const doubled = [...items, ...items];
  return (
    <div className="home-marquee-wrap">
      <div className="home-marquee-track">
        {doubled.map((item, i) => (
          <div key={i} className="home-marquee-item">
            <img src={item.src} alt={item.label} className="home-marquee-logo" />
            <span className="home-marquee-label">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Main Home Component
───────────────────────────────────────────── */
export default function Home() {
  const { t } = useTranslation();
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const [typedText, setTypedText] = useState('');
  const fullText = t('home.hero_title');

  const [activeCard, setActiveCard] = useState<number | null>(null);
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({});

  const toggleCardExpand = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setExpandedCards((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const getCardStatus = () => {
    if (activeCard === 0) return { label: 'EVENT ROUTING ACTIVE', color: '#6366f1', dotColor: '#818cf8', class: 'halo-event' };
    if (activeCard === 1) return { label: 'FOCUS HOOKS ACTIVE', color: '#0ea5e9', dotColor: '#38bdf8', class: 'halo-focus' };
    if (activeCard === 2) return { label: 'INPUT VALIDATION ACTIVE', color: '#10b981', dotColor: '#34d399', class: 'halo-validation' };
    return { label: 'AWAITING COMMAND...', color: '#6366f1', dotColor: '#10b981', class: '' };
  };

  const statusInfo = getCardStatus();

  // Bento Card 3D Perspective Tilt & Magnetic Spotlight Handler
  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -6;
    const rotateY = ((x - centerX) / centerX) * 6;

    card.style.setProperty('--mouse-x', `${(x / rect.width) * 100}%`);
    card.style.setProperty('--mouse-y', `${(y / rect.height) * 100}%`);
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
  };

  const handleCardMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)`;
  };

  // Typewriter effect
  useEffect(() => {
    let i = 0;
    setTypedText('');
    const timer = setInterval(() => {
      if (i < fullText.length) {
        setTypedText(fullText.slice(0, i + 1));
        i++;
      } else {
        clearInterval(timer);
      }
    }, 38);
    return () => clearInterval(timer);
  }, [fullText]);

  const renderRuleBullets = (text: string) => {
    if (!text) return null;
    return text.split('\n').map((l) => l.trim()).filter(Boolean).map((line, idx) => (
      <div key={idx} className="home-rule-bullet">
        <span className="home-rule-dot" />
        <span>{line.replace(/^[•\-\*]\s*/, '')}</span>
      </div>
    ));
  };

  return (
    <div className="home-root">

      {/* ═══════════════════════════════════════
          SECTION 1 · CINEMATIC HERO
      ═══════════════════════════════════════ */}
      <section ref={heroRef} className="home-hero" id="hero" aria-label="Hero">
        {/* About Us Style Ambient Glows */}
        <div className="bg-glow-purple" />
        <div className="bg-glow-blue" />
        {/* Custom 3D Interactive Boxes Background */}
        <InteractiveBoxesBackground />
        {/* Hero Content */}
        <motion.div className="home-hero-content" style={{ opacity: heroOpacity }}>

          {/* Typewriter Title */}
          <motion.h1
            className="home-hero-title"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.25 }}
          >
            {typedText}
            <motion.span
              className="home-hero-cursor"
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.5, repeat: Infinity, repeatType: 'reverse' }}
            >|</motion.span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            className="home-hero-subtitle"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
          >
            {t('home.hero_subtitle')}
          </motion.p>

          {/* CTAs */}
          <motion.div
            className="home-hero-ctas"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.8 }}
          >
            <button
              className="home-btn-primary"
              id="btn-explore-demos"
              onClick={() => document.getElementById('demo-showcase')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <span>{t('home.btn_explore')}</span>
            </button>
            <button
              className="home-btn-ghost"
              id="btn-view-tech"
              onClick={() => document.getElementById('webavatar-engine')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <span>{t('home.btn_tech')}</span>
              <ArrowRight className="size-4" />
            </button>
          </motion.div>
        </motion.div>

        {/* Scroll Cue */}
        <motion.div
          className="home-hero-scroll-cue"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          onClick={() => document.getElementById('stats-section')?.scrollIntoView({ behavior: 'smooth' })}
        >
          <ChevronDown className="size-5" />
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════
          SECTION 2 · MARQUEE BANNER
      ═══════════════════════════════════════ */}
      <div className="home-marquee-section">
        <MarqueeStrip />
      </div>

      {/* ═══════════════════════════════════════
          SECTION 3 · STATS
      ═══════════════════════════════════════ */}
      <section id="stats-section" className="home-stats-section relative z-10 overflow-hidden" aria-label="Statistics">
        {/* Soft harmonious color glows behind the stats bar in Light and Dark mode */}
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 -translate-x-1/2 w-96 h-64 rounded-full bg-indigo-500/25 dark:bg-indigo-500/18 blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 right-1/4 -translate-y-1/2 translate-x-1/2 w-96 h-64 rounded-full bg-cyan-400/25 dark:bg-cyan-400/15 blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 w-80 h-48 rounded-full bg-purple-500/20 dark:bg-purple-500/15 blur-3xl pointer-events-none" />

        <div className="home-section-container relative z-10">
          <div className="home-stats-grid">
            <motion.div
              initial={{ opacity: 0, y: 35, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.7, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
            >
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
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 35, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.7, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
            >
              <SemiCircleGauge
                value={100}
                suffix="+"
                percentage={85}
                label={t('home.stats_voices')}
                icon={<Mic className="size-5" />}
                gradientId="gauge-voices"
                colorStart="#10b981"
                colorEnd="#06b6d4"
                badgeBg="bg-emerald-50 dark:bg-emerald-950/60"
                badgeText="text-emerald-600 dark:text-emerald-400"
                badgeBorder="border border-emerald-200/80 dark:border-emerald-800/80"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 35, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.7, delay: 0.31, ease: [0.16, 1, 0.3, 1] }}
            >
              <SemiCircleGauge
                value={10}
                suffix="+"
                percentage={95}
                label={t('home.stats_languages')}
                icon={<Globe className="size-5" />}
                gradientId="gauge-languages"
                colorStart="#8b5cf6"
                colorEnd="#d946ef"
                badgeBg="bg-purple-50 dark:bg-purple-950/60"
                badgeText="text-purple-600 dark:text-purple-400"
                badgeBorder="border border-purple-200/80 dark:border-purple-800/80"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 35, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.7, delay: 0.44, ease: [0.16, 1, 0.3, 1] }}
            >
              <SemiCircleGauge
                value={20}
                suffix="+"
                percentage={90}
                label={t('home.stats_projects')}
                icon={<Layers className="size-5" />}
                gradientId="gauge-projects"
                colorStart="#06b6d4"
                colorEnd="#8b5cf6"
                badgeBg="bg-teal-50 dark:bg-teal-950/60"
                badgeText="text-teal-600 dark:text-teal-400"
                badgeBorder="border border-teal-200/80 dark:border-teal-800/80"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          SECTION 4 · DEMO SHOWCASE GRID (BENTO)
      ═══════════════════════════════════════ */}
      <section id="demo-showcase" className="home-demos-section" aria-label="Demo Showcase">
        {/* Glow accents matching WebAvatar Engine section background visual style */}
        <div className="bg-glow-purple" style={{ top: '20%', right: '-10%', opacity: 0.6 }} />
        <div className="bg-glow-blue" style={{ bottom: '15%', left: '-10%', opacity: 0.6 }} />

        <div className="home-section-container relative z-10">
          {/* Section Header */}
          <motion.div
            className="home-section-header"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="home-section-title">{t('home.select_usecase')}</h2>
            <p className="home-section-subtitle">{t('home.usecase_subtitle')}</p>
          </motion.div>

          {/* 6-Card Bento Grid with Liquid Water Color Fill Micro Interaction */}
          <div className="bento-grid">

            {/* Card 1: BotnoiAir */}
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.96 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, delay: 0.05 }}
              className="bento-card col-3 group relative overflow-hidden bento-card-interactive"
              id="card-flight-demo"
              style={{
                '--card-theme': '#0ea5e9',
                '--card-glow': 'rgba(14, 165, 233, 0.35)',
                '--card-liquid-grad': 'linear-gradient(135deg, #0ea5e9 0%, #6366f1 100%)',
                '--card-liquid-dark-grad': 'linear-gradient(135deg, #0369a1 0%, #4338ca 100%)',
              } as React.CSSProperties}
              onMouseMove={handleCardMouseMove}
              onMouseLeave={handleCardMouseLeave}
            >
              {/* Liquid Water Color Fill Layer (Expands from cursor position) */}
              <span className="card-liquid-bg" />
              <Link to="/flight-demo" className="block h-full w-full p-6 text-left no-underline text-inherit relative z-10" id="link-flight-demo">
                <div className="bento-card-header">
                  <div className="flex items-center gap-3 min-w-0 flex-1" title={t('home.card_flight_title')}>
                    <div className="bento-icon-box bento-icon-air">
                      <img src={botnoiAirLogo} alt="Botnoi Air" className="w-full h-full object-contain p-1" />
                    </div>
                    <h3 title={t('home.card_flight_title')}>{t('home.card_flight_title')}</h3>
                  </div>

                  {/* Plus (+) Action Button Aligned Vertically with Title */}
                  <div
                    className="bento-card-plus-btn"
                    onClick={(e) => toggleCardExpand('flight', e)}
                    role="button"
                    tabIndex={0}
                    title={expandedCards['flight'] ? t('home.hide_details') : t('home.show_details')}
                  >
                    <ChevronDown className={`size-4 transition-transform duration-300 ${expandedCards['flight'] ? 'rotate-180' : ''}`} />
                  </div>
                </div>

                {/* Expandable Bullet Points Description */}
                <motion.div
                  initial={false}
                  animate={{
                    height: expandedCards['flight'] ? 'auto' : 0,
                    opacity: expandedCards['flight'] ? 1 : 0,
                    marginTop: expandedCards['flight'] ? '0.75rem' : 0
                  }}
                  transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
                  className="overflow-hidden"
                >
                  <p className="whitespace-pre-line pr-2">{t('home.card_flight_desc')}</p>
                </motion.div>
              </Link>
            </motion.div>

            {/* Card 2: Food */}
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.96 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="bento-card col-3 group relative overflow-hidden bento-card-interactive"
              id="card-food-demo"
              style={{
                '--card-theme': '#0ea5e9',
                '--card-glow': 'rgba(14, 165, 233, 0.35)',
                '--card-liquid-grad': 'linear-gradient(135deg, #0ea5e9 0%, #6366f1 100%)',
                '--card-liquid-dark-grad': 'linear-gradient(135deg, #0369a1 0%, #4338ca 100%)',
              } as React.CSSProperties}
              onMouseMove={handleCardMouseMove}
              onMouseLeave={handleCardMouseLeave}
            >
              {/* Liquid Water Color Fill Layer (Expands from cursor position) */}
              <span className="card-liquid-bg" />
              <Link to="/food-demo" className="block h-full w-full p-6 text-left no-underline text-inherit relative z-10" id="link-food-demo">
                <div className="bento-card-header">
                  <div className="flex items-center gap-3 min-w-0 flex-1" title={t('home.card_food_title')}>
                    <div className="bento-icon-box bento-icon-restaurant">
                      <img src={botnoiRestaurantLogo} alt="Botnoi Restaurant" className="w-full h-full object-contain p-1" />
                    </div>
                    <h3 title={t('home.card_food_title')}>{t('home.card_food_title')}</h3>
                  </div>

                  {/* Plus (+) Action Button Aligned Vertically with Title */}
                  <div
                    className="bento-card-plus-btn"
                    onClick={(e) => toggleCardExpand('food', e)}
                    role="button"
                    tabIndex={0}
                    title={expandedCards['food'] ? t('home.hide_details') : t('home.show_details')}
                  >
                    <ChevronDown className={`size-4 transition-transform duration-300 ${expandedCards['food'] ? 'rotate-180' : ''}`} />
                  </div>
                </div>

                {/* Expandable Bullet Points Description */}
                <motion.div
                  initial={false}
                  animate={{
                    height: expandedCards['food'] ? 'auto' : 0,
                    opacity: expandedCards['food'] ? 1 : 0,
                    marginTop: expandedCards['food'] ? '0.75rem' : 0
                  }}
                  transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
                  className="overflow-hidden"
                >
                  <p className="whitespace-pre-line pr-2">{t('home.card_food_desc')}</p>
                </motion.div>
              </Link>
            </motion.div>

            {/* Card 3: IT Store */}
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.96 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="bento-card col-3 group relative overflow-hidden bento-card-interactive"
              id="card-itstore-demo"
              style={{
                '--card-theme': '#0ea5e9',
                '--card-glow': 'rgba(14, 165, 233, 0.35)',
                '--card-liquid-grad': 'linear-gradient(135deg, #0ea5e9 0%, #6366f1 100%)',
                '--card-liquid-dark-grad': 'linear-gradient(135deg, #0369a1 0%, #4338ca 100%)',
              } as React.CSSProperties}
              onMouseMove={handleCardMouseMove}
              onMouseLeave={handleCardMouseLeave}
            >
              {/* Liquid Water Color Fill Layer (Expands from cursor position) */}
              <span className="card-liquid-bg" />
              <Link to="/it-store-demo" className="block h-full w-full p-6 text-left no-underline text-inherit relative z-10" id="link-itstore-demo">
                <div className="bento-card-header">
                  <div className="flex items-center gap-3 min-w-0 flex-1" title={t('home.card_itstore_title')}>
                    <div className="bento-icon-box bento-icon-air">
                      <Laptop className="size-6" />
                    </div>
                    <h3 title={t('home.card_itstore_title')}>{t('home.card_itstore_title')}</h3>
                  </div>

                  {/* Plus (+) Action Button Aligned Vertically with Title */}
                  <div
                    className="bento-card-plus-btn"
                    onClick={(e) => toggleCardExpand('itstore', e)}
                    role="button"
                    tabIndex={0}
                    title={expandedCards['itstore'] ? t('home.hide_details') : t('home.show_details')}
                  >
                    <ChevronDown className={`size-4 transition-transform duration-300 ${expandedCards['itstore'] ? 'rotate-180' : ''}`} />
                  </div>
                </div>

                {/* Expandable Bullet Points Description */}
                <motion.div
                  initial={false}
                  animate={{
                    height: expandedCards['itstore'] ? 'auto' : 0,
                    opacity: expandedCards['itstore'] ? 1 : 0,
                    marginTop: expandedCards['itstore'] ? '0.75rem' : 0
                  }}
                  transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
                  className="overflow-hidden"
                >
                  <p className="whitespace-pre-line pr-2">{t('home.card_itstore_desc')}</p>
                </motion.div>
              </Link>
            </motion.div>

            {/* Card 4: Hotel */}
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.96 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="bento-card col-3 group relative overflow-hidden bento-card-interactive"
              id="card-hotel-demo"
              style={{
                '--card-theme': '#0ea5e9',
                '--card-glow': 'rgba(14, 165, 233, 0.35)',
                '--card-liquid-grad': 'linear-gradient(135deg, #0ea5e9 0%, #6366f1 100%)',
                '--card-liquid-dark-grad': 'linear-gradient(135deg, #0369a1 0%, #4338ca 100%)',
              } as React.CSSProperties}
              onMouseMove={handleCardMouseMove}
              onMouseLeave={handleCardMouseLeave}
            >
              {/* Liquid Water Color Fill Layer (Expands from cursor position) */}
              <span className="card-liquid-bg" />
              <a href="https://botnoi-hotel-two.vercel.app/" target="_blank" rel="noopener noreferrer" className="block h-full w-full p-6 text-left no-underline text-inherit relative z-10" id="link-hotel-demo">
                <div className="bento-card-header">
                  <div className="flex items-center gap-3 min-w-0 flex-1" title={t('home.card_hotel_title')}>
                    <div className="bento-icon-box bento-icon-air">
                      <Building2 className="size-6" />
                    </div>
                    <h3 title={t('home.card_hotel_title')}>{t('home.card_hotel_title')}</h3>
                  </div>

                  {/* Plus (+) Action Button Aligned Vertically with Title */}
                  <div
                    className="bento-card-plus-btn"
                    onClick={(e) => toggleCardExpand('hotel', e)}
                    role="button"
                    tabIndex={0}
                    title={expandedCards['hotel'] ? t('home.hide_details') : t('home.show_details')}
                  >
                    <ChevronDown className={`size-4 transition-transform duration-300 ${expandedCards['hotel'] ? 'rotate-180' : ''}`} />
                  </div>
                </div>

                {/* Expandable Bullet Points Description */}
                <motion.div
                  initial={false}
                  animate={{
                    height: expandedCards['hotel'] ? 'auto' : 0,
                    opacity: expandedCards['hotel'] ? 1 : 0,
                    marginTop: expandedCards['hotel'] ? '0.75rem' : 0
                  }}
                  transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
                  className="overflow-hidden"
                >
                  <p className="whitespace-pre-line pr-2">{t('home.card_hotel_desc')}</p>
                </motion.div>
              </a>
            </motion.div>

            {/* Card 5: B2B Contact */}
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.96 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, delay: 0.45 }}
              className="bento-card col-6 group relative overflow-hidden bento-card-interactive"
              id="card-contact-demo"
              style={{
                '--card-theme': '#0ea5e9',
                '--card-glow': 'rgba(14, 165, 233, 0.35)',
                '--card-liquid-grad': 'linear-gradient(135deg, #0ea5e9 0%, #6366f1 100%)',
                '--card-liquid-dark-grad': 'linear-gradient(135deg, #0369a1 0%, #4338ca 100%)',
              } as React.CSSProperties}
              onMouseMove={handleCardMouseMove}
              onMouseLeave={handleCardMouseLeave}
            >
              {/* Liquid Water Color Fill Layer (Expands from cursor position) */}
              <span className="card-liquid-bg" />
              <Link to="/contact" className="block h-full w-full p-6 text-left no-underline text-inherit relative z-10" id="link-contact-demo">
                <div className="bento-card-header">
                  <div className="flex items-center gap-3 min-w-0 flex-1" title={t('home.card_contact_title')}>
                    <div className="bento-icon-box bento-icon-air">
                      <FileText className="size-6" />
                    </div>
                    <h3 title={t('home.card_contact_title')}>{t('home.card_contact_title')}</h3>
                  </div>

                  {/* Plus (+) Action Button Aligned Vertically with Title */}
                  <div
                    className="bento-card-plus-btn"
                    onClick={(e) => toggleCardExpand('contact', e)}
                    role="button"
                    tabIndex={0}
                    title={expandedCards['contact'] ? t('home.hide_details') : t('home.show_details')}
                  >
                    <ChevronDown className={`size-4 transition-transform duration-300 ${expandedCards['contact'] ? 'rotate-180' : ''}`} />
                  </div>
                </div>

                {/* Expandable Bullet Points Description */}
                <motion.div
                  initial={false}
                  animate={{
                    height: expandedCards['contact'] ? 'auto' : 0,
                    opacity: expandedCards['contact'] ? 1 : 0,
                    marginTop: expandedCards['contact'] ? '0.75rem' : 0
                  }}
                  transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
                  className="overflow-hidden"
                >
                  <p className="whitespace-pre-line pr-2">{t('home.card_contact_desc')}</p>
                </motion.div>
              </Link>
            </motion.div>

            {/* Card 6: All Demos */}
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.96 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, delay: 0.55 }}
              className="bento-card col-6 group relative overflow-hidden bento-card-interactive"
              id="card-alldemo-card"
              style={{
                '--card-theme': '#0ea5e9',
                '--card-glow': 'rgba(14, 165, 233, 0.35)',
                '--card-liquid-grad': 'linear-gradient(135deg, #0ea5e9 0%, #6366f1 100%)',
                '--card-liquid-dark-grad': 'linear-gradient(135deg, #0369a1 0%, #4338ca 100%)',
              } as React.CSSProperties}
              onMouseMove={handleCardMouseMove}
              onMouseLeave={handleCardMouseLeave}
            >
              {/* Liquid Water Color Fill Layer (Expands from cursor position) */}
              <span className="card-liquid-bg" />
              <Link to="/all-demo" className="block h-full w-full p-6 text-left no-underline text-inherit relative z-10" id="link-alldemo">
                <div className="bento-card-header">
                  <div className="flex items-center gap-3 min-w-0 flex-1" title={t('home.card_alldemo_title')}>
                    <div className="bento-icon-box bento-icon-air">
                      <Layers className="size-6" />
                    </div>
                    <h3 title={t('home.card_alldemo_title')}>{t('home.card_alldemo_title')}</h3>
                  </div>

                  {/* Plus (+) Action Button Aligned Vertically with Title */}
                  <div
                    className="bento-card-plus-btn"
                    onClick={(e) => toggleCardExpand('alldemo', e)}
                    role="button"
                    tabIndex={0}
                    title={expandedCards['alldemo'] ? t('home.hide_details') : t('home.show_details')}
                  >
                    <ChevronDown className={`size-4 transition-transform duration-300 ${expandedCards['alldemo'] ? 'rotate-180' : ''}`} />
                  </div>
                </div>

                {/* Expandable Bullet Points Description */}
                <motion.div
                  initial={false}
                  animate={{
                    height: expandedCards['alldemo'] ? 'auto' : 0,
                    opacity: expandedCards['alldemo'] ? 1 : 0,
                    marginTop: expandedCards['alldemo'] ? '0.75rem' : 0
                  }}
                  transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
                  className="overflow-hidden"
                >
                  <p className="whitespace-pre-line pr-2">{t('home.card_alldemo_desc')}</p>
                </motion.div>
              </Link>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          SECTION 5 · AVATAR SHOWCASE
      ═══════════════════════════════════════ */}
      <section className="home-avatar-section relative z-10 overflow-hidden" aria-label="WebAvatar Engine" id="webavatar-engine">
        {/* Glow accents matching About page background visual style */}
        <div className="bg-glow-purple" style={{ top: '10%', left: '-10%', opacity: 0.7 }} />
        <div className="bg-glow-blue" style={{ bottom: '10%', right: '-10%', opacity: 0.7 }} />

        <div className="home-section-container relative z-10">
          {/* Header */}
          <motion.div
            className="home-section-header max-w-3xl mx-auto text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="home-section-title text-center">{t('home.tech_title')}</h2>
            <p className="home-section-subtitle text-center max-w-2xl mx-auto">{t('home.tech_desc')}</p>
          </motion.div>

          {/* Crescent Orbital Grid surrounding AWAITING COMMAND Core */}
          <div className="home-avatar-orbit-grid relative">
            {/* Holographic Laser Beam SVG Connection Layer */}
            {activeCard !== null && (
              <svg className="absolute inset-0 w-full h-full pointer-events-none z-15 overflow-visible">
                <defs>
                  <linearGradient id="laserGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor={statusInfo.color} stopOpacity="1" />
                    <stop offset="50%" stopColor="#38bdf8" stopOpacity="0.9" />
                    <stop offset="100%" stopColor={statusInfo.color} stopOpacity="0.3" />
                  </linearGradient>
                  <filter id="laserGlow" x="-30%" y="-30%" width="160%" height="160%">
                    <feGaussianBlur stdDeviation="5" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                {activeCard === 0 && (
                  <motion.path
                    d="M 32% 50% L 65% 18%"
                    stroke="url(#laserGrad)"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeDasharray="10 6"
                    filter="url(#laserGlow)"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1, strokeDashoffset: [0, -32] }}
                    transition={{ opacity: { duration: 0.2 }, pathLength: { duration: 0.35, ease: 'easeOut' }, strokeDashoffset: { duration: 0.7, repeat: Infinity, ease: 'linear' } }}
                  />
                )}

                {activeCard === 1 && (
                  <motion.path
                    d="M 32% 50% L 65% 50%"
                    stroke="url(#laserGrad)"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeDasharray="10 6"
                    filter="url(#laserGlow)"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1, strokeDashoffset: [0, -32] }}
                    transition={{ opacity: { duration: 0.2 }, pathLength: { duration: 0.35, ease: 'easeOut' }, strokeDashoffset: { duration: 0.7, repeat: Infinity, ease: 'linear' } }}
                  />
                )}

                {activeCard === 2 && (
                  <motion.path
                    d="M 32% 50% L 65% 82%"
                    stroke="url(#laserGrad)"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeDasharray="10 6"
                    filter="url(#laserGlow)"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1, strokeDashoffset: [0, -32] }}
                    transition={{ opacity: { duration: 0.2 }, pathLength: { duration: 0.35, ease: 'easeOut' }, strokeDashoffset: { duration: 0.7, repeat: Infinity, ease: 'linear' } }}
                  />
                )}
              </svg>
            )}

            {/* Left Core Column: Avatar Visual with Concentric Energy Ripple & Holographic Laser Receptor */}
            <motion.div
              className="home-avatar-visual home-avatar-center-core relative z-20"
              initial={{ opacity: 0, scale: 0.85 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              animate={activeCard !== null ? { scale: 1.08 } : { scale: 1, y: [0, -10, 0] }}
              transition={
                activeCard !== null
                  ? { type: 'spring', stiffness: 300, damping: 20 }
                  : { y: { duration: 4, repeat: Infinity, ease: 'easeInOut' } }
              }
            >
              <div className="home-avatar-circle-wrapper">
                {/* Concentric Energy Ripple Radar Waves */}
                {activeCard !== null && (
                  <>
                    <motion.div
                      key={`ripple-1-${activeCard}`}
                      className="energy-ripple-ring"
                      initial={{ scale: 0.9, opacity: 0.8 }}
                      animate={{ scale: 2.2, opacity: 0 }}
                      transition={{ duration: 1.6, repeat: Infinity, ease: 'easeOut' }}
                      style={{ borderColor: statusInfo.color, boxShadow: `0 0 25px ${statusInfo.color}70` }}
                    />
                    <motion.div
                      key={`ripple-2-${activeCard}`}
                      className="energy-ripple-ring"
                      initial={{ scale: 0.9, opacity: 0.8 }}
                      animate={{ scale: 2.2, opacity: 0 }}
                      transition={{ duration: 1.6, repeat: Infinity, ease: 'easeOut', delay: 0.5 }}
                      style={{ borderColor: statusInfo.color, boxShadow: `0 0 25px ${statusInfo.color}70` }}
                    />
                  </>
                )}

                {/* Glowing Crescent Moon Arc Halo - Dynamic Morphing */}
                <div className={`crescent-moon-halo ${statusInfo.class}`} />

                <div className="home-avatar-ring ring-3 transition-colors duration-500" style={{ borderColor: `${statusInfo.color}45` }} />
                <div className="home-avatar-ring ring-2 transition-colors duration-500" style={{ borderColor: `${statusInfo.color}65` }} />
                <div className="home-avatar-ring ring-1 transition-colors duration-500" style={{ borderColor: statusInfo.color }} />
                
                <motion.div
                  className="home-avatar-circle transition-all duration-500"
                  animate={activeCard !== null ? { scale: 1.12 } : { scale: 1 }}
                  transition={{ type: 'spring', stiffness: 320, damping: 20 }}
                  style={{
                    borderColor: statusInfo.color,
                    boxShadow: activeCard !== null
                      ? `0 0 60px ${statusInfo.color}80, 0 0 100px ${statusInfo.color}40`
                      : `0 0 45px ${statusInfo.color}40, 0 4px 25px ${statusInfo.color}25`,
                  }}
                >
                  <img
                    src={logoNewLightBlue}
                    alt="WebAvatar"
                    className="home-avatar-logo transition-all duration-500"
                    style={{
                      transform: activeCard !== null ? 'scale(1.22)' : 'scale(1)',
                      filter: activeCard !== null ? `drop-shadow(0 0 12px ${statusInfo.color})` : 'none',
                    }}
                  />
                </motion.div>
              </div>

              <div className="home-avatar-bars">
                {[40, 75, 100, 60, 90, 45, 95, 55, 80, 35].map((h, i) => (
                  <motion.span
                    key={i}
                    className="home-avatar-bar transition-colors duration-500"
                    animate={{ scaleY: activeCard !== null ? [0.15, 1.7, 0.15] : [0.3, 1, 0.3] }}
                    transition={{
                      duration: activeCard !== null ? 0.3 + (i % 3) * 0.08 : 1 + (i % 5) * 0.3,
                      repeat: Infinity,
                      ease: 'easeInOut',
                      delay: i * 0.03,
                    }}
                    style={{
                      height: `${h}%`,
                      background: `linear-gradient(180deg, ${statusInfo.color} 0%, #06b6d4 100%)`,
                      boxShadow: activeCard !== null ? `0 0 10px ${statusInfo.color}` : 'none',
                    }}
                  />
                ))}
              </div>

              <motion.div
                className="home-avatar-status transition-colors duration-300"
                style={{ color: statusInfo.color }}
                animate={activeCard !== null ? { scale: 1.08 } : { scale: 1 }}
                transition={{ type: 'spring', stiffness: 350, damping: 20 }}
              >
                <span
                  className="home-avatar-status-dot transition-colors duration-300"
                  style={{ background: statusInfo.dotColor, boxShadow: `0 0 14px ${statusInfo.dotColor}` }}
                />
                <span className="font-mono tracking-wider font-bold">{statusInfo.label}</span>
              </motion.div>
            </motion.div>

            {/* Right Column Orbit: All 3 Cards (Event-Driven Routing, Declarative Focus Hooks, Redundant Input Validation) */}
            <div className="orbit-node-group-right">
              {/* Card 1: Event-Driven Routing */}
              <motion.div
                className="orbit-node orbit-node-right-top"
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.8, delay: 0.1 }}
                onMouseEnter={() => setActiveCard(0)}
                onMouseLeave={() => setActiveCard(null)}
              >
                <motion.div
                  className={`home-feature-card orbit-card ${activeCard === 0 ? 'orbit-card-active' : ''}`}
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                  style={{ '--fc': '#6366f1' } as React.CSSProperties}
                >
                  <div className="home-feature-body">
                    <div className="home-feature-title flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 shadow-[0_0_8px_#6366f1]" />
                      {t('home.rule1_title')}
                    </div>
                    <div className="home-feature-desc">{renderRuleBullets(t('home.rule1_desc'))}</div>
                  </div>
                </motion.div>
              </motion.div>

              {/* Card 2: Declarative Focus Hooks */}
              <motion.div
                className="orbit-node orbit-node-right-mid"
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.8, delay: 0.2 }}
                onMouseEnter={() => setActiveCard(1)}
                onMouseLeave={() => setActiveCard(null)}
              >
                <motion.div
                  className={`home-feature-card orbit-card ${activeCard === 1 ? 'orbit-card-active' : ''}`}
                  animate={{ y: [0, 6, 0] }}
                  transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                  style={{ '--fc': '#0ea5e9' } as React.CSSProperties}
                >
                  <div className="home-feature-body">
                    <div className="home-feature-title flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-sky-500 shadow-[0_0_8px_#0ea5e9]" />
                      {t('home.rule2_title')}
                    </div>
                    <div className="home-feature-desc">{renderRuleBullets(t('home.rule2_desc'))}</div>
                  </div>
                </motion.div>
              </motion.div>

              {/* Card 3: Dynamic Input Validation */}
              <motion.div
                className="orbit-node orbit-node-right-bottom"
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.8, delay: 0.3 }}
                onMouseEnter={() => setActiveCard(2)}
                onMouseLeave={() => setActiveCard(null)}
              >
                <motion.div
                  className={`home-feature-card orbit-card ${activeCard === 2 ? 'orbit-card-active' : ''}`}
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
                  style={{ '--fc': '#10b981' } as React.CSSProperties}
                >
                  <div className="home-feature-body">
                    <div className="home-feature-title flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
                      {t('home.rule3_title')}
                    </div>
                    <div className="home-feature-desc">{renderRuleBullets(t('home.rule3_desc'))}</div>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          FOOTER
      ═══════════════════════════════════════ */}
      <AppFooter />
    </div>
  );
}