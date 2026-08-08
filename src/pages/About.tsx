import { Link } from 'react-router-dom';
import { motion, useScroll, useSpring } from 'framer-motion';
import { useRef } from 'react';
import { useTranslation } from '../lib/LanguageContext';
import AnimatedSection from '../components/AnimatedSection';
import AppFooter from '../components/AppFooter';
import './Pages.css';

function About() {

  const timelineRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();

  // Scroll tracking for the timeline line draw animation
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ['start center', 'end center'],
  });

  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const renderTimelineDesc = (text: string) => {
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
              <span className="timeline-bullet-dot" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      );
    }

    return <p>{text}</p>;
  };

  return (
    <div style={{ position: 'relative', overflow: 'hidden', width: '100%' }}>

      {/* ABOUT HERO */}
      <section className="hero-section" id="about-hero" style={{ paddingBottom: '4rem' }} aria-label="About Us Hero">
        <AnimatedSection direction="up" duration={0.8}>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 border border-indigo-100 text-indigo-600 mb-6 shadow-sm">
            {t('about.badge')}
          </span>
          <h1 className="leading-tight text-wrap-balance">{t('about.title')}</h1>
          <p className="hero-subtitle max-w-2xl mx-auto">
            {t('about.subtitle')}
          </p>
        </AnimatedSection>
      </section>

      {/* MISSION & VISION */}
      <section className="section-wrapper relative z-10" style={{ margin: '3rem auto', maxWidth: '1150px', padding: '0 1.5rem' }} id="purpose" aria-label="Company Purpose">
        <AnimatedSection direction="up" duration={0.8}>
          <div className="glass-panel" id="mission-vision" style={{ padding: '3.5rem 3rem', transition: 'none' }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div>
                <h2>{t('about.purpose_title')}</h2>
                <p style={{ fontSize: '1rem', color: 'var(--muted-foreground)', lineHeight: 1.7, marginBottom: '1rem' }}>
                  {t('about.purpose_desc1')}
                </p>
                <p style={{ fontSize: '1rem', color: 'var(--muted-foreground)', lineHeight: 1.7 }}>
                  {t('about.purpose_desc2')}
                </p>
              </div>

              <div style={{ borderLeft: '1px solid var(--border)', paddingLeft: '2.5rem' }}>
                <h2>{t('about.vision_title')}</h2>
                <p style={{ fontSize: '1rem', color: 'var(--muted-foreground)', lineHeight: 1.7, marginBottom: '1.5rem' }}>
                  {t('about.vision_desc')}
                </p>
                <Link className="btn btn-primary" to="/contact" id="about-vision-cta" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                  {t('about.vision_cta')}
                </Link>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </section>

      {/* COMPANY HISTORY TIMELINE */}
      <section className="section-wrapper relative z-10" id="company-history" style={{ margin: '4rem auto', maxWidth: '1150px', padding: '0 1.5rem' }} aria-label="Company History">
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

      {/* CORE COMPETENCIES */}
      <section className="section-wrapper relative z-10" style={{ margin: '6rem auto', maxWidth: '1150px', padding: '0 1.5rem' }} id="competencies-section" aria-label="Core Competencies">
        <AnimatedSection direction="up" duration={0.8}>
          <div className="glass-panel" id="competencies" style={{ padding: '3.5rem 3rem', transition: 'none' }}>
            <div className="section-header">
              <h2>{t('about.competency_title')}</h2>
              <p>{t('about.competency_subtitle')}</p>
            </div>

            <div className="competency-grid">
              <div className="competency-card">
                <h3 style={{ color: 'var(--primary)', letterSpacing: '-0.015em' }}>{t('about.comp1_title')}</h3>
                {renderTimelineDesc(t('about.comp1_desc'))}
              </div>

              <div className="competency-card">
                <h3 style={{ color: 'var(--cta)', letterSpacing: '-0.015em' }}>{t('about.comp2_title')}</h3>
                {renderTimelineDesc(t('about.comp2_desc'))}
              </div>

              <div className="competency-card">
                <h3 style={{ color: 'var(--primary)', letterSpacing: '-0.015em' }}>{t('about.comp3_title')}</h3>
                {renderTimelineDesc(t('about.comp3_desc'))}
              </div>

              <div className="competency-card">
                <h3 style={{ color: 'var(--cta)', letterSpacing: '-0.015em' }}>{t('about.comp4_title')}</h3>
                {renderTimelineDesc(t('about.comp4_desc'))}
              </div>
            </div>
          </div>
        </AnimatedSection>
      </section>

      {/* TEAM SECTION */}
      <section className="section-wrapper relative z-10" id="team-section" style={{ paddingBottom: '6rem', margin: '0 auto', maxWidth: '1150px', paddingLeft: '1.5rem', paddingRight: '1.5rem' }} aria-label="Our Team">
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

      <AppFooter />
    </div>
  );
}

export default About;
