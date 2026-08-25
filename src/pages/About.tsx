import { motion, useScroll, useSpring, AnimatePresence, type Variants } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import {
  Languages,
  AudioLines,
  Workflow,
  LayoutTemplate
} from 'lucide-react';
import { useTranslation } from '../lib/LanguageContext';
import AnimatedSection from '../components/AnimatedSection';
import AppFooter from '../components/AppFooter';
import './Pages.css';

function About() {
  const timelineRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();

  // ═══════════════════════════════════════════════════
  // AUTO-ROTATING CLOCKWISE PRESET STATE (เวลาเลื่อนช้าลงอย่างนุ่มนวล)
  // ═══════════════════════════════════════════════════
  const [activePresetIndex, setActivePresetIndex] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [selectedNlpLang, setSelectedNlpLang] = useState<number>(0);

  const seaLanguages = [
    { code: 'TH', name: 'ไทย', tokens: ['สวัสดี', 'ครับ', 'ยินดี', 'ต้อนรับ'] },
    { code: 'ID', name: 'Bahasa', tokens: ['Selamat', 'datang', 'sistem', 'AI'] },
    { code: 'VN', name: 'Tiếng Việt', tokens: ['Xin chào', 'chào mừng', 'trí tuệ'] },
    { code: 'PH', name: 'Tagalog', tokens: ['Kumusta', 'maligayang', 'pagdating'] },
    { code: 'LOCAL', name: 'ภาษาถิ่น', tokens: ['ยินดีจ๊าดนัก', 'แซ่บหลาย', 'หรอยแรง'] }
  ];

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setActivePresetIndex((prev) => (prev + 1) % 4);
    }, 6800); // 6.8s leisurely interval
    return () => clearInterval(interval);
  }, [isPaused]);

  // Auto-cycle SEA language tokens for NLP demonstration
  useEffect(() => {
    if (isPaused) return;
    const langInterval = setInterval(() => {
      setSelectedNlpLang((prev) => (prev + 1) % 5);
    }, 2400);
    return () => clearInterval(langInterval);
  }, [isPaused]);

  // Scroll tracking for Journey timeline tube
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ['start center', 'end center'],
  });

  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const renderTimelineDesc = (text: string, dotColor?: string) => {
    if (!text) return null;
    const lines = text
      .split('\n')
      .map((line) => line.replace(/^[•\-\*]\s*/, '').trim())
      .filter(Boolean);

    if (lines.length > 1) {
      return (
        <ul className="timeline-bullet-list">
          {lines.map((item, idx) => (
            <li key={idx}>
              <span
                className="timeline-bullet-dot"
                style={dotColor ? { background: dotColor, boxShadow: `0 0 6px ${dotColor}` } : undefined}
              />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      );
    }

    return <p>{text}</p>;
  };

  // ═══════════════════════════════════════════════════
  // 4 FIXED SLOTS ITEMS (DYNAMIC ROTATING ITEMS)
  // Preset 0: Slot A=NLP Core, Slot B=Voice AI, Slot C=DOM Mapping, Slot D=Multi-Agent
  // ═══════════════════════════════════════════════════
  // 4 Core Competency Items
  const compNLP = {
    id: 'nlp',
    title: t('about.comp1_title'),
    tag: 'NLP CORE',
    icon: <Languages size={24} className="icon-anim-nlp" />,
    color: 'var(--primary)',
    desc: t('about.comp1_desc'),
  };

  const compVoice = {
    id: 'voice',
    title: t('about.comp2_title'),
    tag: 'VOICE AI',
    icon: <AudioLines size={24} className="icon-anim-voice" />,
    color: 'var(--cta)',
    desc: t('about.comp2_desc'),
  };

  const compSwarm = {
    id: 'agent',
    title: t('about.comp3_title'),
    tag: 'MULTI-AGENT',
    icon: <Workflow size={24} className="icon-anim-agent" />,
    color: '#A855F7',
    desc: t('about.comp3_desc'),
  };

  const compDOM = {
    id: 'dom',
    title: t('about.comp4_title'),
    tag: 'DOM MAPPING',
    icon: <LayoutTemplate size={24} className="icon-anim-dom" />,
    color: '#10B981',
    desc: t('about.comp4_desc'),
  };

  // ═══════════════════════════════════════════════════
  // 4 FIXED SLOTS ITEMS (DYNAMIC ROTATING ITEMS)
  // Preset 0: Slot A=NLP Core, Slot B=Voice AI, Slot C=DOM Mapping, Slot D=Multi-Agent
  // ═══════════════════════════════════════════════════
  const getSlotAItem = (index: number) => {
    switch (index) {
      case 0: return compNLP;
      case 1: return compDOM;
      case 2: return compSwarm;
      case 3: default: return compVoice;
    }
  };

  const getSlotBItem = (index: number) => {
    switch (index) {
      case 0: return compVoice;
      case 1: return compNLP;
      case 2: return compDOM;
      case 3: default: return compSwarm;
    }
  };

  const getSlotCItem = (index: number) => {
    switch (index) {
      case 0: return compDOM;
      case 1: return compSwarm;
      case 2: return compVoice;
      case 3: default: return compNLP;
    }
  };

  const getSlotDItem = (index: number) => {
    switch (index) {
      case 0: return compSwarm;
      case 1: return compVoice;
      case 2: return compNLP;
      case 3: default: return compDOM;
    }
  };

  const slotAItem = getSlotAItem(activePresetIndex);
  const slotBItem = getSlotBItem(activePresetIndex);
  const slotCItem = getSlotCItem(activePresetIndex);
  const slotDItem = getSlotDItem(activePresetIndex);

  // Render Graphic inside Slot B (Large Square) based on active preset
  const renderSlotBGraphic = (index: number) => {
    switch (index) {
      case 0: // Voice AI (Soundwave clean)
        return (
          <div className="slot-b-voice-soundwave-clean">
            <div className="voice-soundwave-spectrum clean-spectrum">
              <div className="vbar vb-1" />
              <div className="vbar vb-2" />
              <div className="vbar vb-3" />
              <div className="vbar vb-4" />
              <div className="vbar vb-5" />
              <div className="vbar vb-6" />
              <div className="vbar vb-7" />
              <div className="vbar vb-8" />
              <div className="vbar vb-9" />
              <div className="vbar vb-10" />
              <div className="vbar vb-11" />
              <div className="vbar vb-12" />
              <div className="vbar vb-13" />
              <div className="vbar vb-14" />
            </div>
          </div>
        );
      case 1: // NLP (Dynamic Multi-Language SEA Tokenizer)
        const currentLang = seaLanguages[selectedNlpLang];
        return (
          <div className="slot-b-nlp-dynamic-display">
            {/* Language Switcher Tabs */}
            <div className="nlp-lang-tabs-row">
              {seaLanguages.map((lang, idx) => (
                <button
                  key={lang.code}
                  type="button"
                  className={`nlp-lang-tab-pill ${selectedNlpLang === idx ? 'active' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedNlpLang(idx);
                  }}
                >
                  {lang.name}
                </button>
              ))}
            </div>

            {/* Dynamic Tokenized Output Chips */}
            <div className="nlp-dynamic-tokens-box">
              <div className="nlp-tokens-track">
                {currentLang.tokens.map((token, tIdx) => (
                  <span key={`${selectedNlpLang}-${tIdx}-${token}`} className="nlp-dynamic-chip">
                    {token}
                  </span>
                ))}
              </div>
            </div>
          </div>
        );
      case 2: // DOM Mapping
      case 3: // Multi-Agent
      default:
        return null;
    }
  };

  // Snappy responsive slide transition (fast exit + crisp enter)
  const easeCurve: [number, number, number, number] = [0.16, 1, 0.3, 1];

  const slideVariants: Record<string, Variants> = {
    slotA: {
      initial: { opacity: 0, x: -25 },
      animate: { opacity: 1, x: 0, transition: { duration: 0.32, ease: easeCurve } },
      exit: { opacity: 0, x: 25, transition: { duration: 0.16, ease: 'easeOut' } }
    },
    slotB: {
      initial: { opacity: 0, y: -25 },
      animate: { opacity: 1, y: 0, transition: { duration: 0.32, ease: easeCurve } },
      exit: { opacity: 0, y: 25, transition: { duration: 0.16, ease: 'easeOut' } }
    },
    slotC: {
      initial: { opacity: 0, y: 25 },
      animate: { opacity: 1, y: 0, transition: { duration: 0.32, ease: easeCurve } },
      exit: { opacity: 0, y: -25, transition: { duration: 0.16, ease: 'easeOut' } }
    },
    slotD: {
      initial: { opacity: 0, x: 25 },
      animate: { opacity: 1, x: 0, transition: { duration: 0.32, ease: easeCurve } },
      exit: { opacity: 0, x: -25, transition: { duration: 0.16, ease: 'easeOut' } }
    }
  };

  return (
    <div className="about3-page-wrapper">
      <div className="about3-container">
        {/* ═══════════════════════════════════════
            1. HERO HEADER BANNER (FROM ABOUT5)
        ═══════════════════════════════════════ */}
        <section className="about3-hero-section" id="about-hero" aria-label="About Us Hero">
          <AnimatedSection direction="up" duration={0.8} className="about3-hero-centered-box">
            <h1 className="about3-hero-headline">
              {t('about.title')}
            </h1>

            <p className="about3-hero-subtitle">
              {t('about.subtitle')}
            </p>
          </AnimatedSection>
        </section>

        {/* ══════════════════════════════════════════════════════════
            2. SECTION: OUR PURPOSE & MISSION (PILL CONTAINER - FROM ABOUT5)
        ══════════════════════════════════════════════════════════ */}
        <section className="about3-mission-section" id="mission-section" aria-label="Our Mission and Purpose">
          <AnimatedSection direction="up" duration={0.8}>
            <div className="about3-mission-pill-card">
              {/* Section Header */}
              <div className="about3-section-badge-row">
                <h2>{t('about.purpose_title')}</h2>
              </div>

              <div className="about3-mission-body-content">
                <p className="about3-lead-text">{t('about.purpose_desc1')}</p>
                <p className="about3-sub-text">{t('about.purpose_desc2')}</p>

                {/* Vision Box Inside Pill Card */}
                <div className="about3-vision-callout-box">
                  <div>
                    <h4>{t('about.vision_title')}</h4>
                    <p>{t('about.vision_desc')}</p>
                  </div>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </section>

        {/* ═══════════════════════════════════════
            3. COMPANY HISTORY TIMELINE (จาก ABOUT.TSX)
        ═══════════════════════════════════════ */}
        <section
          className="section-wrapper relative z-10"
          id="company-history"
          style={{ margin: '4rem auto', maxWidth: '1150px', padding: '0 1.5rem' }}
          aria-label="Company History"
        >
          <AnimatedSection direction="up" duration={0.8}>
            <div className="section-header">
              <h2>{t('about.journey_title')}</h2>
              <p>{t('about.journey_subtitle')}</p>
            </div>
          </AnimatedSection>

          <div className="timeline" ref={timelineRef}>
            {/* Animated line drawing as scroll progresses */}
            <motion.div className="timeline-line-progress" style={{ scaleY, transformOrigin: 'top' }} />

            <div className="timeline-item" id="history-2018">
              <AnimatedSection direction="left" duration={0.6}>
                <div className="timeline-dot active" />
                <div className="timeline-year">2018</div>
                <div className="timeline-panel">
                  <h3>{t('about.timeline_2018_title')}</h3>
                  {renderTimelineDesc(t('about.timeline_2018_desc'))}
                </div>
              </AnimatedSection>
            </div>

            <div className="timeline-item" id="history-2020">
              <AnimatedSection direction="left" duration={0.6} delay={0.1}>
                <div className="timeline-dot active" />
                <div className="timeline-year">2020</div>
                <div className="timeline-panel">
                  <h3>{t('about.timeline_2020_title')}</h3>
                  {renderTimelineDesc(t('about.timeline_2020_desc'))}
                </div>
              </AnimatedSection>
            </div>

            <div className="timeline-item" id="history-2022">
              <AnimatedSection direction="left" duration={0.6} delay={0.15}>
                <div className="timeline-dot active" />
                <div className="timeline-year">2022</div>
                <div className="timeline-panel">
                  <h3>{t('about.timeline_2022_title')}</h3>
                  {renderTimelineDesc(t('about.timeline_2022_desc'))}
                </div>
              </AnimatedSection>
            </div>

            <div className="timeline-item" id="history-2026">
              <AnimatedSection direction="left" duration={0.6} delay={0.2}>
                <div className="timeline-dot active" />
                <div className="timeline-year">2026</div>
                <div className="timeline-panel">
                  <h3>{t('about.timeline_2026_title')}</h3>
                  {renderTimelineDesc(t('about.timeline_2026_desc'))}
                </div>
              </AnimatedSection>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════
            4. 4-BOX CLOCKWISE REVOLVING BENTO GRID
            - ซ้ายบน Slide ขวา
            - ขวาบน Slide ล่าง
            - ขวาล่าง Slide ซ้าย
            - ซ้ายล่าง Slide บน
            - ชี้แล้วหยุดหมุน + Icon ขยับ + กราฟิกขยับ + กล่องเปลี่ยนสีกรอบ
        ══════════════════════════════════════════════════════════ */}
        <section
          className="about3-revolving-bento-section"
          id="competencies"
          aria-label="Core Competencies Revolving Grid"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <AnimatedSection direction="up" duration={0.8} className="about3-section-header-center">
            <h2>{t('about.competency_title')}</h2>
            <p>{t('about.competency_subtitle')}</p>
          </AnimatedSection>

          {/* ══════════════════════════════════════════════════
              4-BOX GEOMETRIC DISSECTION (LOCKED 745px FIXED CONTAINER)
          ══════════════════════════════════════════════════ */}
          <AnimatedSection direction="up" duration={0.8} delay={0.15}>
            <div className="about3-revolve-grid-container">
              <div className="about3-preset-grid-inner">
                {/* ── LEFT COLUMN ── */}
                <div className="about3-bento-col-left">
                  {/* 1. SLOT A (บนซ้าย): SLIDE ขวา */}
                  <div
                    className={`about3-bento-slot slot-a theme-${slotAItem.id}`}
                    style={{ '--slot-accent': slotAItem.color } as React.CSSProperties}
                  >
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={`slotA-${activePresetIndex}-${slotAItem.id}`}
                        className="about3-slot-inner-card"
                        variants={slideVariants.slotA}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                      >
                        <div className="slot-top-row">
                          <div className="slot-item-icon-wrap" style={{ color: slotAItem.color }}>
                            {slotAItem.icon}
                          </div>
                          <span className="slot-tech-name-pill">
                            {slotAItem.tag}
                          </span>
                        </div>
                        <h3 className="slot-title-compact">{slotAItem.title}</h3>
                        <div className="slot-desc-full">
                          {renderTimelineDesc(slotAItem.desc, slotAItem.color)}
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  </div>

                  {/* 2. SLOT C (ซ้ายล่าง): SLIDE บน */}
                  <div
                    className={`about3-bento-slot slot-c theme-${slotCItem.id}`}
                    style={{ '--slot-accent': slotCItem.color } as React.CSSProperties}
                  >
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={`slotC-${activePresetIndex}-${slotCItem.id}`}
                        className="about3-slot-inner-card"
                        variants={slideVariants.slotC}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                      >
                        <div className="slot-top-row">
                          <div className="slot-item-icon-wrap" style={{ color: slotCItem.color }}>
                            {slotCItem.icon}
                          </div>
                          <span className="slot-tech-name-pill">
                            {slotCItem.tag}
                          </span>
                        </div>
                        <h3>{slotCItem.title}</h3>
                        <div className="slot-desc-pillar">
                          {renderTimelineDesc(slotCItem.desc, slotCItem.color)}
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>

                {/* ── RIGHT COLUMN ── */}
                <div className="about3-bento-col-right">
                  {/* 3. SLOT B (ขวาบน): SLIDE ล่าง */}
                  <div
                    className={`about3-bento-slot slot-b theme-${slotBItem.id}`}
                    style={{ '--slot-accent': slotBItem.color } as React.CSSProperties}
                  >
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={`slotB-${activePresetIndex}-${slotBItem.id}`}
                        className="about3-slot-inner-card slot-b-hero-card"
                        variants={slideVariants.slotB}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                      >
                        <div className="slot-b-top-section">
                          <div className="slot-top-row">
                            <div className="slot-item-icon-wrap" style={{ color: slotBItem.color }}>
                              {slotBItem.icon}
                            </div>
                            <span className="slot-tech-name-pill">
                              {slotBItem.tag}
                            </span>
                          </div>
                          <h3 className="slot-hero-title">{slotBItem.title}</h3>
                          <div className="slot-desc-full">
                            {renderTimelineDesc(slotBItem.desc, slotBItem.color)}
                          </div>
                        </div>

                        {/* Dynamic Graphic for Slot B */}
                        {renderSlotBGraphic(activePresetIndex)}
                      </motion.div>
                    </AnimatePresence>
                  </div>

                  {/* 4. SLOT D (ขวาล่าง): SLIDE ซ้าย */}
                  <div
                    className={`about3-bento-slot slot-d theme-${slotDItem.id}`}
                    style={{ '--slot-accent': slotDItem.color } as React.CSSProperties}
                  >
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={`slotD-${activePresetIndex}-${slotDItem.id}`}
                        className="about3-slot-inner-card"
                        variants={slideVariants.slotD}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                      >
                        <div className="slot-top-row">
                          <div className="slot-item-icon-wrap" style={{ color: slotDItem.color }}>
                            {slotDItem.icon}
                          </div>
                          <span className="slot-tech-name-pill">
                            {slotDItem.tag}
                          </span>
                        </div>
                        <h3 className="slot-title-d">{slotDItem.title}</h3>
                        <div className="slot-desc-wide">
                          {renderTimelineDesc(slotDItem.desc, slotDItem.color)}
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </section>

        {/* ═══════════════════════════════════════════════════
            5. "OUR TEAM" (เหมือน ABOUT.TSX 100%)
        ═══════════════════════════════════════════════════ */}
        <section className="about3-team-section" id="team-section" aria-label="Our Team">
          <AnimatedSection direction="up" duration={0.8}>
            <div className="section-header">
              <h2>{t('about.team_title')}</h2>
              <p>{t('about.team_subtitle')}</p>
            </div>
          </AnimatedSection>

          <AnimatedSection direction="up" duration={0.8} staggerChildren={0.15} className="team-grid">
            <div className="team-card" id="team-winn">
              <div className="team-card-inner">
                <div className="team-card-front">
                  <div className="team-avatar-box">DW</div>
                  <h3>Dr. Winn</h3>
                  <p>{t('about.team1_role')}</p>
                </div>
                <div className="team-card-back">
                  <p>{t('about.team1_desc')}</p>
                </div>
              </div>
            </div>

            <div className="team-card" id="team-panya">
              <div className="team-card-inner">
                <div className="team-card-front">
                  <div className="team-avatar-box">KP</div>
                  <h3>K. Panya</h3>
                  <p>{t('about.team2_role')}</p>
                </div>
                <div className="team-card-back">
                  <p>{t('about.team2_desc')}</p>
                </div>
              </div>
            </div>

            <div className="team-card" id="team-suchada">
              <div className="team-card-inner">
                <div className="team-card-front">
                  <div className="team-avatar-box">KS</div>
                  <h3>K. Suchada</h3>
                  <p>{t('about.team3_role')}</p>
                </div>
                <div className="team-card-back">
                  <p>{t('about.team3_desc')}</p>
                </div>
              </div>
            </div>

            <div className="team-card" id="team-fern">
              <div className="team-card-inner">
                <div className="team-card-front">
                  <div className="team-avatar-box">KF</div>
                  <h3>K. Fern</h3>
                  <p>{t('about.team4_role')}</p>
                </div>
                <div className="team-card-back">
                  <p>{t('about.team4_desc')}</p>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </section>
      </div>

      <AppFooter />
    </div>
  );
}

export default About;
