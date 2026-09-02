import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '../lib/LanguageContext';
import { niaSiteAgendaData } from '../lib/niaSiteAgendaData';
import AnimatedSection from '../components/AnimatedSection';
import AppFooter from '../components/AppFooter';
import './Pages.css';

export default function NiaSite2026() {
  const { t, language } = useTranslation();
  
  // State for active hall/stage
  const [activeHallId, setActiveHallId] = useState('main-stage');
  
  // State for active day (1, 2, or 3)
  const [activeDay, setActiveDay] = useState(1);
  
  // Search query state
  const [searchQuery, setSearchQuery] = useState('');

  // Logo & images
  const siteLogo = "https://site.nia.or.th/wp-content/uploads/2026/05/asset-13@2x.webp";
  const bgPattern = "https://site.nia.or.th/wp-content/uploads/2026/05/bgs-01.webp";

  // Partner images list
  const partners = [
    { name: "Hosted By", url: "https://site.nia.or.th/wp-content/uploads/2026/05/1-hosted-by@2x.webp" },
    { name: "Co-host", url: "https://site.nia.or.th/wp-content/uploads/2026/05/2-co-host@2x.webp" },
    { name: "Forum & Activity Partners", url: "https://site.nia.or.th/wp-content/uploads/2026/06/forum-activity.webp" },
    { name: "Media Partners", url: "https://site.nia.or.th/wp-content/uploads/2026/06/media.webp" },
    { name: "International Partners", url: "https://site.nia.or.th/wp-content/uploads/2026/06/international.webp" },
    { name: "Thai Government Partners", url: "https://site.nia.or.th/wp-content/uploads/2026/06/thai-government.webp" },
    { name: "Investor Partners", url: "https://site.nia.or.th/wp-content/uploads/2026/06/investor.webp" },
    { name: "Community Partners", url: "https://site.nia.or.th/wp-content/uploads/2026/06/community.webp" },
    { name: "University Partners", url: "https://site.nia.or.th/wp-content/uploads/2026/05/9-university-partners@2x.webp" }
  ];

  // Activities list
  const activities = [
    {
      id: "forum",
      titleKey: "site2026.activity_forum_title",
      descKey: "site2026.activity_forum_desc",
      bg: "https://site.nia.or.th/wp-content/uploads/2026/05/forum@2x.webp"
    },
    {
      id: "exhibition",
      titleKey: "site2026.activity_exhibition_title",
      descKey: "site2026.activity_exhibition_desc",
      bg: "https://site.nia.or.th/wp-content/uploads/2026/05/newexhibition.webp"
    },
    {
      id: "matching",
      titleKey: "site2026.activity_match_title",
      descKey: "site2026.activity_match_desc",
      bg: "https://site.nia.or.th/wp-content/uploads/2026/05/businessmatch@2x.webp"
    },
    {
      id: "pitching",
      titleKey: "site2026.activity_pitch_title",
      descKey: "site2026.activity_pitch_desc",
      bg: "https://site.nia.or.th/wp-content/uploads/2026/05/pitching@2x.webp"
    },
    {
      id: "pma",
      titleKey: "site2026.activity_pma_title",
      descKey: "site2026.activity_pma_desc",
      bg: "https://site.nia.or.th/wp-content/uploads/2026/05/newpma.webp"
    }
  ];

  // Filtered agenda sessions based on active hall, active day, and search query
  const filteredSessions = useMemo(() => {
    const currentHall = niaSiteAgendaData.find(h => h.id === activeHallId);
    if (!currentHall) return [];
    
    const currentDayData = currentHall.days.find(d => d.day === activeDay);
    if (!currentDayData) return [];

    if (!searchQuery.trim()) {
      return currentDayData.sessions;
    }

    const query = searchQuery.toLowerCase();
    return currentDayData.sessions.filter(session => {
      const matchEn = session.titleEn.toLowerCase().includes(query);
      const matchTh = session.titleTh.toLowerCase().includes(query);
      const matchTime = session.time.toLowerCase().includes(query);
      return matchEn || matchTh || matchTime;
    });
  }, [activeHallId, activeDay, searchQuery]);

  // Active Day object to display dates
  const activeDayObject = useMemo(() => {
    const currentHall = niaSiteAgendaData.find(h => h.id === activeHallId);
    return currentHall?.days.find(d => d.day === activeDay);
  }, [activeHallId, activeDay]);

  return (
    <div className="site2026-theme min-h-screen bg-stone-950 text-stone-100 relative overflow-x-hidden">
      {/* Background patterns */}
      <div 
        className="fixed inset-0 z-0 opacity-70 pointer-events-none bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${bgPattern})` }}
      />
      <div className="fixed inset-0 z-0 bg-radial-gradient opacity-10 pointer-events-none" />

      {/* HERO SECTION */}
      <section className="relative isolate overflow-hidden pt-32 pb-24 md:pt-40 md:pb-32 flex flex-col justify-center items-center text-center z-10 px-6 border-b border-rose-500/10" id="site2026-hero" aria-label="NIA Exhibition Hero">
        <AnimatedSection direction="up" duration={0.8} delay={0.1} className="max-w-4xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-50 border border-rose-100 text-rose-600 mb-6 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span>
            {t('site2026.badge')}
          </span>
          
          <div className="flex justify-center mb-8">
            <motion.img 
              src={siteLogo} 
              alt="SITE 2026 Logo" 
              className="h-16 md:h-24 w-auto object-contain drop-shadow-[0_2px_10px_rgba(239,68,68,0.2)]"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6 }}
              id="site2026-hero-logo"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
          </div>

          <h1 className="leading-tight text-4xl md:text-6xl font-extrabold tracking-tight text-white leading-none [-webkit-text-stroke:0px_darkgrey] [-webkit-text-fill-color:white] drop-shadow-md">
            {t('site2026.hero_title')}
          </h1>
          
          <div className="mt-8 inline-block px-5 py-2.5 border border-rose-500/30 rounded-full bg-rose-950/30 backdrop-blur-md text-sm md:text-base text-rose-200 font-bold shadow-lg shadow-rose-950/20">
            {t('site2026.hero_subtitle')}
          </div>
        </AnimatedSection>
      </section>

      {/* ABOUT & OBJECTIVES */}
      <section className="section-wrapper relative z-10 py-16 max-w-5xl mx-auto px-6" id="site2026-about-section" aria-label="About the NIA Exhibition">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          <div className="md:col-span-7">
            <AnimatedSection direction="left" duration={0.8}>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 border-l-4 border-rose-500 pl-4" id="about-site-2026-heading">
                {t('site2026.about_title')}
              </h2>
              <p className="text-zinc-300 leading-relaxed font-medium">
                {t('site2026.about_desc')}
              </p>
            </AnimatedSection>
          </div>

          <div className="md:col-span-5 bg-zinc-900/60 backdrop-blur-md rounded-2xl border border-rose-500/20 p-6 shadow-xl shadow-rose-950/5">
            <AnimatedSection direction="right" duration={0.8}>
              <h3 className="text-xl font-bold text-white mb-4" id="objectives-site-2026-heading">
                {t('site2026.objective_title')}
              </h3>
              <ul className="space-y-3.5 text-zinc-300 font-semibold text-sm">
                <li id="objective-1-item">{t('site2026.objective_1')}</li>
                <li id="objective-2-item">{t('site2026.objective_2')}</li>
                <li id="objective-3-item">{t('site2026.objective_3')}</li>
              </ul>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* MAIN ACTIVITIES (Bento Grid) */}
      <section className="section-wrapper relative z-10 py-16 max-w-7xl mx-auto px-6" id="site2026-activities-section" aria-label="Exhibition Activities">
        <AnimatedSection direction="up" duration={0.8}>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-white" id="activities-site-2026-heading">
              {t('site2026.activities_title')}
            </h2>
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {activities.map((activity, index) => (
            <AnimatedSection 
              key={activity.id} 
              direction="up" 
              duration={0.6} 
              delay={index * 0.1}
              className="group"
            >
              <div 
                className="activity-glass-card p-6 min-h-[260px] flex flex-col justify-end relative overflow-hidden rounded-2xl border border-rose-500/10 shadow-lg cursor-pointer transition-all duration-300"
                id={`activity-${activity.id}`}
                style={{
                  background: `linear-gradient(to top, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0.02) 100%), url(${activity.bg})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              >
                <div className="absolute inset-0 bg-rose-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                <div className="relative z-10">
                  <h3 className="font-bold text-white text-lg mb-2 group-hover:text-rose-400 transition-colors duration-200">
                    {t(activity.titleKey as any)}
                  </h3>
                  <p className="text-zinc-300 text-xs leading-relaxed max-h-0 opacity-0 group-hover:max-h-[150px] group-hover:opacity-100 group-hover:overflow-y-auto transition-all duration-300 overflow-hidden pr-1" style={{ scrollbarWidth: 'thin' }}>
                    {t(activity.descKey as any)}
                  </p>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </section>

      {/* AGENDA SECTION */}
      <section className="section-wrapper relative z-10 py-16 max-w-6xl mx-auto px-6 border-t border-rose-500/10" id="site2026-agenda-section" aria-label="Event Agenda and Schedule">
        <AnimatedSection direction="up" duration={0.8}>
          <div className="text-center mb-10">
            <h2 className="text-3xl font-extrabold text-white" id="agenda-site-2026-heading">
              {t('site2026.agenda_title')}
            </h2>
          </div>
        </AnimatedSection>

        {/* INTERACTIVE CONTROLS */}
        <div className="bg-zinc-900/60 backdrop-blur-md rounded-3xl border border-rose-500/20 p-4 sm:p-6 shadow-2xl mb-8">
          
          {/* SEARCH BAR */}
          <div className="mb-6 relative">
            <input 
              type="text" 
              placeholder={t('site2026.search_placeholder') || 'Search...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-950/40 border border-rose-500/20 rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-rose-500/40 text-sm font-semibold text-white shadow-inner"
              id="site2026-agenda-search"
              aria-label="Search Agenda"
            />
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-rose-500/60 pointer-events-none">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            </div>
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 px-1 py-1"
                id="site2026-clear-search"
              >
                ✕
              </button>
            )}
          </div>

          {/* HALL / STAGE SELECTOR TABS */}
          <div className="mb-6">
            <label className="block text-xs font-bold uppercase tracking-wider text-rose-600 mb-2">
              {t('site2026.hall_selector')}
            </label>
            <div 
              className="flex gap-2 overflow-x-auto pb-2 scrollbar-none snap-x"
              id="site2026-halls-container"
              role="group"
              aria-label="Hall Selection"
            >
              {niaSiteAgendaData.map(hall => (
                <button
                  key={hall.id}
                  onClick={() => {
                    setActiveHallId(hall.id);
                    // Don't clear search so user can filter across halls if desired
                  }}
                  className={`flex-none px-4 py-2 text-sm font-bold rounded-xl border transition-all duration-200 snap-center ${
                    activeHallId === hall.id
                      ? "bg-rose-600 border-rose-600 text-white shadow-lg shadow-rose-500/20"
                      : "bg-zinc-950/65 border-zinc-800 text-zinc-300 hover:border-rose-500/30 hover:bg-rose-500/10"
                  }`}
                  id={`site2026-hall-tab-${hall.id}`}
                >
                  {hall.nameEn}
                </button>
              ))}
            </div>
          </div>

          {/* DAY SELECTOR TABS */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-rose-600 mb-2">
              {t('site2026.day_selector')}
            </label>
            <div className="flex gap-2" id="site2026-days-container" role="group" aria-label="Day Selection">
              {[1, 2, 3].map(dayNum => {
                const dayLabel = `Day ${dayNum}`;
                return (
                  <button
                    key={dayNum}
                    onClick={() => setActiveDay(dayNum)}
                    className={`flex-1 py-3 text-center border rounded-xl transition-all duration-200 ${
                      activeDay === dayNum
                        ? "bg-rose-600 border-rose-600 text-white shadow-lg shadow-rose-500/20"
                        : "bg-zinc-950/65 border-zinc-800 text-zinc-300 hover:border-rose-500/30 hover:bg-rose-500/10"
                    }`}
                    id={`site2026-day-tab-${dayNum}`}
                  >
                    <div className="flex items-center justify-center gap-2 flex-wrap sm:flex-nowrap py-1">
                      <span className="text-base md:text-lg font-bold">{dayLabel}</span>
                      <span className={`text-xs md:text-sm font-semibold ${activeDay === dayNum ? "text-rose-100" : "text-zinc-400"}`}>
                        ({dayNum === 1 ? '25 Jun' :
                          dayNum === 2 ? '26 Jun' :
                                         '27 Jun'})
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

        </div>

        {/* AGENDA CONTENT DISPLAY */}
        <div className="bg-zinc-900/50 backdrop-blur-md rounded-3xl border border-rose-500/25 p-6 md:p-8 shadow-xl">
          {/* Active Date Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-rose-500/10 pb-4 mb-6">
            <h3 className="text-lg font-bold text-white" id="active-day-date-heading">
              {language === 'th' ? activeDayObject?.dateTh : activeDayObject?.dateEn}
            </h3>
            <span className="text-xs font-bold text-rose-400 bg-rose-950/40 px-2.5 py-1 rounded-full border border-rose-500/20 mt-2 sm:mt-0 max-w-max">
              {language === 'th' ? 'กำหนดการกิจกรรม' : 'Sessions list'}
            </span>
          </div>

          <div className="space-y-4" id="site2026-sessions-list">
            <AnimatePresence mode="popLayout">
              {filteredSessions.length > 0 ? (
                filteredSessions.map((session, index) => (
                  <motion.div
                    key={`${session.time}-${index}`}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                    className="p-5 bg-zinc-900 border border-zinc-800/80 hover:border-rose-500/30 rounded-2xl flex flex-col md:flex-row md:items-start gap-4 hover:shadow-lg transition-all duration-300"
                    id={`site2026-session-card-${activeHallId}-${activeDay}-${index}`}
                  >
                    <div className="md:w-32 flex-none">
                      <span className="inline-block px-3 py-1 text-xs font-bold bg-rose-950/40 border border-rose-500/20 text-rose-400 rounded-full shadow-sm">
                        {session.time}
                      </span>
                    </div>
                    
                    <div className="flex-1">
                      <h4 className="font-bold text-zinc-100 text-base leading-snug">
                        {language === 'th' ? session.titleTh : session.titleEn}
                      </h4>
                    </div>
                  </motion.div>
                ))
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-12 text-zinc-500 font-semibold"
                  id="site2026-no-sessions-found"
                >
                  {t('site2026.no_sessions')}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* PARTNERS SECTION */}
      <section className="section-wrapper relative z-10 py-16 max-w-6xl mx-auto px-6 border-t border-rose-500/10" id="site2026-partners-section" aria-label="Exhibition Partners">
        <AnimatedSection direction="up" duration={0.8}>
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-white" id="partners-site-2026-heading">
              {t('site2026.partner_title')}
            </h2>
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 w-full mx-auto">
          {partners.map((partner, index) => (
            <AnimatedSection
              key={partner.name}
              direction="up"
              duration={0.6}
              delay={index * 0.05}
              className="w-full flex flex-col items-stretch bg-zinc-900/60 backdrop-blur-md rounded-2xl border border-rose-500/20 p-5 md:p-8 shadow-xl"
            >
              <h3 className="text-xs md:text-sm font-bold text-rose-500 uppercase tracking-wider mb-4 text-center">
                {partner.name}
              </h3>
              <div className="w-full flex justify-center bg-white rounded-xl p-4 md:p-6 border border-zinc-100 hover:scale-[1.01] transition-transform duration-300 shadow-sm">
                <img 
                  src={partner.url} 
                  alt={partner.name} 
                  className="w-full max-h-[14rem] sm:max-h-[18rem] md:max-h-[22rem] lg:max-h-[26rem] object-contain"
                  id={`partner-logo-${index}`}
                  loading="lazy"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.alt = `${partner.name} (image unavailable)`;
                    target.style.opacity = '0.3';
                    target.style.filter = 'grayscale(1)';
                  }}
                />
              </div>
            </AnimatedSection>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <div className="relative z-10">
        <AppFooter />
      </div>

    </div>
  );
}
