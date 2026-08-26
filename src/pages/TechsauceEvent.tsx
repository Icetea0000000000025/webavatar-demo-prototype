import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Search, Copy, Check, Bookmark, Volume2, VolumeX
} from 'lucide-react';
import {
  techsauceData,
  answerEventQuestion,
  type Workshop,
  type Exhibitor,
  type EventAIAnswer,
  type SupportedLanguage,
} from '../lib/techsauceData';
import { useTranslation } from '../lib/LanguageContext';
import AppFooter from '../components/AppFooter';
import './Pages.css';

export default function TechsauceEvent() {
  const { t, language } = useTranslation();

  // Active Tab: 'qa' | 'workshops' | 'exhibitors' | 'awards' | 'ocr'
  const [activeTab, setActiveTab] = useState<'qa' | 'workshops' | 'exhibitors' | 'awards' | 'ocr'>('qa');

  // View Mode: 'cards' | 'table'
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');

  // Q&A Question input & current active answer
  const [currentQuestion, setCurrentQuestion] = useState('BOTNOI GROUP');
  const [inputQuery, setInputQuery] = useState('');
  const [activeAIAnswer, setActiveAIAnswer] = useState<EventAIAnswer>(() =>
    answerEventQuestion('BOTNOI GROUP', 'en')
  );

  // Text-To-Speech (TTS) state
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Workshop Filters
  const [selectedDay, setSelectedDay] = useState<string>('all');
  const [selectedRoom, setSelectedRoom] = useState<string>('all');
  const [selectedAccess, setSelectedAccess] = useState<string>('all');

  // Exhibitor Filter
  const [selectedZone, setSelectedZone] = useState<string>('all');
  const [exhibitorSearch, setExhibitorSearch] = useState('');

  // Awards Active Category
  const [activeAwardCategory, setActiveAwardCategory] = useState<string>('all');

  // Copied state for feedback
  const [copiedText, setCopiedText] = useState<string | null>(null);

  // Bookmarked workshops
  const [bookmarkedWorkshops, setBookmarkedWorkshops] = useState<string[]>([]);

  const presetQuestions = useMemo(() => [
    { label: t('event.qa_preset_1'), query: t('event.preset_query_1') },
    { label: t('event.qa_preset_2'), query: t('event.preset_query_2') },
    { label: t('event.qa_preset_3'), query: t('event.preset_query_3') },
    { label: t('event.qa_preset_4'), query: t('event.preset_query_4') },
    { label: t('event.qa_preset_5'), query: t('event.preset_query_5') },
    { label: t('event.qa_preset_6'), query: t('event.preset_query_6') },
  ], [t]);

  const handleAskQuestion = (question: string) => {
    if (!question.trim()) return;
    setCurrentQuestion(question);
    const answer = answerEventQuestion(question, language);
    setActiveAIAnswer(answer);
    setInputQuery('');
    // Stop any ongoing speech when new question is asked
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  // Re-synthesize current answer whenever language changes
  useEffect(() => {
    if (currentQuestion) {
      setActiveAIAnswer(answerEventQuestion(currentQuestion, language));
    }
  }, [language, currentQuestion]);

  const currentLocalizedContent = useMemo(() => {
    if (!activeAIAnswer) return null;
    const lang = (['en', 'th', 'zh', 'ja', 'ko', 'es', 'fr'].includes(language) ? language : 'en') as SupportedLanguage;
    if (activeAIAnswer.localized && activeAIAnswer.localized[lang]) {
      return activeAIAnswer.localized[lang];
    }
    return {
      headline: language === 'th' ? activeAIAnswer.headlineTh : (activeAIAnswer.headlineEn || activeAIAnswer.headlineTh),
      answer: language === 'th' ? activeAIAnswer.answerTh : (activeAIAnswer.answerEn || activeAIAnswer.answerTh),
      categoryTag: activeAIAnswer.categoryTag,
      keyBadges: activeAIAnswer.keyBadges || [],
      suggestedQuestions: activeAIAnswer.suggestedQuestions || [],
    };
  }, [activeAIAnswer, language]);

  const currentAnswerHeadline = useMemo(() => {
    if (!currentLocalizedContent) return '';
    return currentLocalizedContent.headline.replace(/\*\*/g, '');
  }, [currentLocalizedContent]);

  const currentAnswerBody = useMemo(() => {
    if (!currentLocalizedContent) return '';
    return currentLocalizedContent.answer.replace(/\*\*/g, '');
  }, [currentLocalizedContent]);

  const handleSpeechToggle = (textToSpeak: string) => {
    if (!('speechSynthesis' in window)) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel();
    const cleanText = textToSpeak.replace(/[*_#•]/g, ' ');
    const utterance = new SpeechSynthesisUtterance(cleanText);

    // Detect language
    const isThai = language === 'th' || /[\u0E00-\u0E7F]/.test(cleanText);
    utterance.lang = isThai ? 'th-TH' : (language === 'zh' ? 'zh-CN' : language === 'ja' ? 'ja-JP' : language === 'ko' ? 'ko-KR' : language === 'es' ? 'es-ES' : language === 'fr' ? 'fr-FR' : 'en-US');
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const toggleBookmark = (title: string) => {
    setBookmarkedWorkshops((prev) =>
      prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title]
    );
  };

  // Filtered Workshops
  const filteredWorkshops = useMemo(() => {
    return techsauceData.workshops.filter((w) => {
      const matchDay = selectedDay === 'all' || w.date === selectedDay;
      const matchRoom = selectedRoom === 'all' || w.room === selectedRoom;
      const matchAccess = selectedAccess === 'all' || w.access.toLowerCase().includes(selectedAccess.toLowerCase());
      return matchDay && matchRoom && matchAccess;
    });
  }, [selectedDay, selectedRoom, selectedAccess]);

  // Filtered Exhibitors
  const filteredExhibitors = useMemo(() => {
    return techsauceData.exhibitors.filter((e) => {
      const matchQuery =
        !exhibitorSearch.trim() ||
        e.company.toLowerCase().includes(exhibitorSearch.toLowerCase().trim()) ||
        (e.booth && e.booth.toLowerCase().includes(exhibitorSearch.toLowerCase().trim()));

      if (!matchQuery) return false;

      if (selectedZone === 'all') return true;
      if (selectedZone === 'A') return e.booth && e.booth.startsWith('A');
      if (selectedZone === 'B') return e.booth && e.booth.startsWith('B');
      if (selectedZone === 'C') return e.booth && e.booth.startsWith('C');
      if (selectedZone === 'D') return e.booth && e.booth.startsWith('D');
      if (selectedZone === 'numbered') return e.booth && /^\d+$/.test(e.booth);
      if (selectedZone === 'other') return !e.booth || e.booth === 'Not shown' || (!e.booth.startsWith('A') && !e.booth.startsWith('B') && !e.booth.startsWith('C') && !e.booth.startsWith('D') && !/^\d+$/.test(e.booth));

      return true;
    });
  }, [exhibitorSearch, selectedZone]);

  const awardCategories = useMemo(() => {
    return Object.keys(techsauceData.techsauce_awards.categories);
  }, []);

  return (
    <div className="techsauce-page-root w-full relative overflow-hidden bg-transparent text-foreground">
      {/* ═══════════════════════════════════════
          HERO SECTION — LIVE EVENT Q&A SHOWCASE CONCIERGE
          ═══════════════════════════════════════ */}
      <section className="techsauce-hero bg-transparent">
        <div className="techsauce-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="techsauce-hero-content"
          >
            {/* Main Title */}
            <h1 className="techsauce-hero-title">
              {t('event.title')}
              <span className="techsauce-title-sub">{t('event.subtitle')}</span>
            </h1>

            {/* Subtitle Purpose */}
            <p className="techsauce-hero-theme">
              {t('event.theme_desc')}
            </p>

            {/* Event Metadata Banner */}
            <div className="techsauce-meta-grid">
              <div className="techsauce-meta-item">
                <div>
                  <div className="techsauce-meta-label">{t('event.meta_dates_label')}</div>
                  <div className="techsauce-meta-value">{t('event.meta_dates_val')}</div>
                </div>
              </div>

              <div className="techsauce-meta-item">
                <div>
                  <div className="techsauce-meta-label">{t('event.meta_venue_label')}</div>
                  <div className="techsauce-meta-value">{t('event.meta_venue_val')}</div>
                </div>
              </div>

              <div className="techsauce-meta-item">
                <div>
                  <div className="techsauce-meta-label">{t('event.meta_awards_label')}</div>
                  <div className="techsauce-meta-value">{t('event.meta_awards_val')}</div>
                </div>
              </div>
            </div>

            {/* Key Stats Strip */}
            <div className="techsauce-stats-strip">
              <div className="techsauce-stat-card">
                <div className="techsauce-stat-num">{techsauceData.workshops.length}</div>
                <div className="techsauce-stat-lbl">{t('event.stat_workshops')}</div>
              </div>
              <div className="techsauce-stat-card">
                <div className="techsauce-stat-num">{techsauceData.exhibitors.length}</div>
                <div className="techsauce-stat-lbl">{t('event.stat_exhibitors')}</div>
              </div>
              <div className="techsauce-stat-card">
                <div className="techsauce-stat-num">{awardCategories.length}</div>
                <div className="techsauce-stat-lbl">{t('event.stat_categories')}</div>
              </div>
              <div className="techsauce-stat-card">
                <div className="techsauce-stat-num">18</div>
                <div className="techsauce-stat-lbl">{t('event.stat_honors')}</div>
              </div>
            </div>

            {/* ═══════════════════════════════════════════════════════
                LIVE AI EVENT Q&A INTERACTIVE CONSOLE (FRONT & CENTER)
                ═══════════════════════════════════════════════════════ */}
            <div className="techsauce-qa-console-card">
              <div className="techsauce-qa-header">
                <div className="flex items-center gap-2">
                  <div className="techsauce-ai-pulse-dot" />
                  <span className="font-extrabold text-sm text-foreground">
                    {t('event.qa_header')}
                  </span>
                </div>
                <span className="techsauce-badge-verified">
                  {t('event.qa_verified_badge')}
                </span>
              </div>

              {/* Question Input Form */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleAskQuestion(inputQuery);
                }}
                className="techsauce-qa-input-box"
              >
                <input
                  type="text"
                  placeholder={t('event.qa_input_placeholder')}
                  value={inputQuery}
                  onChange={(e) => setInputQuery(e.target.value)}
                  className="techsauce-qa-input"
                />
                <button
                  type="submit"
                  disabled={!inputQuery.trim()}
                  className="techsauce-qa-send-btn"
                >
                  <span>{t('event.qa_send_btn')}</span>
                </button>
              </form>

              {/* Preset Clickable Showcase Questions */}
              <div className="techsauce-preset-questions-wrap">
                <div className="text-xs font-bold text-muted-foreground mb-2">
                  <span>{t('event.qa_preset_label')}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {presetQuestions.map((item, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleAskQuestion(item.query)}
                      className={`techsauce-preset-btn ${currentQuestion === item.query ? 'active' : ''}`}
                    >
                      <span>{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* ────────────────────────────────────────────────
                  ACTIVE AI RESPONSE SHOWCASE CARD
                  ──────────────────────────────────────────────── */}
              {activeAIAnswer && (
                <motion.div
                  key={currentQuestion + language}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="techsauce-ai-response-box"
                >
                  {/* Response Header */}
                  <div className="techsauce-ai-response-header">
                    <div>
                      <div className="techsauce-response-category">
                        {currentLocalizedContent?.categoryTag || activeAIAnswer.categoryTag}
                      </div>
                      <h3 className="techsauce-response-title">
                        {currentAnswerHeadline}
                      </h3>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {/* Voice Read Aloud Button */}
                      <button
                        type="button"
                        onClick={() => handleSpeechToggle(currentAnswerBody)}
                        className={`techsauce-tts-btn ${isSpeaking ? 'speaking' : ''}`}
                        title={isSpeaking ? t('event.voice_stop') : t('event.voice_read_aloud')}
                      >
                        {isSpeaking ? (
                          <>
                            <VolumeX className="w-3.5 h-3.5 text-destructive animate-pulse" />
                            <span className="text-destructive">{t('event.voice_stop')}</span>
                          </>
                        ) : (
                          <>
                            <Volume2 className="w-3.5 h-3.5 text-primary" />
                            <span>{t('event.voice_read_aloud')}</span>
                          </>
                        )}
                      </button>

                      {/* Copy Answer Button */}
                      <button
                        type="button"
                        onClick={() => handleCopy(currentAnswerBody)}
                        className="techsauce-copy-ans-btn"
                        title={t('event.copy')}
                      >
                        {copiedText === currentAnswerBody ? (
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                        ) : (
                          <Copy className="w-3.5 h-3.5 text-muted-foreground" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Highlighted Key Information Badges */}
                  {(currentLocalizedContent?.keyBadges || activeAIAnswer.keyBadges)?.length > 0 && (
                    <div className="techsauce-badges-strip">
                      {(currentLocalizedContent?.keyBadges || activeAIAnswer.keyBadges).map((badge, bIdx) => (
                        <div key={bIdx} className="techsauce-key-badge">
                          <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">{badge.label}:</span>
                          <span className="font-extrabold text-xs text-foreground">{badge.value}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Synthesized Natural Language Answer */}
                  <div className="techsauce-ai-body-text">
                    <p>{currentAnswerBody}</p>
                  </div>

                  {/* Matched Direct Workshops Cards (if any) */}
                  {activeAIAnswer.matchedWorkshops.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-border">
                      <div className="text-xs font-bold text-foreground mb-2">
                        {t('event.related_workshops')}
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {activeAIAnswer.matchedWorkshops.map((w, wIdx) => (
                          <div key={wIdx} className="p-2.5 rounded-xl bg-card border border-border text-left">
                            <div className="flex items-center justify-between gap-1 mb-1">
                              <span className="text-[10px] font-mono text-muted-foreground">{w.date} • {w.time}</span>
                              <span className="techsauce-access-pill techsauce-access-reserve">{w.access}</span>
                            </div>
                            <div className="font-bold text-xs text-foreground line-clamp-1">{w.title}</div>
                            <div className="text-[11px] text-muted-foreground mt-0.5">
                              {w.speakers.map(s => `${s.name} (${s.company})`).join(', ') || w.room}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Matched Direct Exhibitor Cards (if any) */}
                  {activeAIAnswer.matchedExhibitors.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-border">
                      <div className="text-xs font-bold text-foreground mb-2">
                        {t('event.related_exhibitors')}
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {activeAIAnswer.matchedExhibitors.map((ex, exIdx) => (
                          <div key={exIdx} className="p-2.5 rounded-xl bg-card border border-border flex items-center justify-between">
                            <div>
                              <div className="font-bold text-xs text-foreground">{ex.company}</div>
                              <div className="text-[10px] text-muted-foreground font-mono">{t('event.location_label')} {ex.booth || t('event.booth_not_shown')}</div>
                            </div>
                            <span className="techsauce-booth-pill booth-botnoi">
                              {ex.booth ? `${t('event.booth')} ${ex.booth}` : t('event.booth_not_shown')}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Suggested Follow-up Questions */}
                  {(currentLocalizedContent?.suggestedQuestions || activeAIAnswer.suggestedQuestions)?.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-border flex items-center gap-2 flex-wrap text-xs">
                      <span className="text-muted-foreground font-bold">{t('event.follow_up_label')}</span>
                      {(currentLocalizedContent?.suggestedQuestions || activeAIAnswer.suggestedQuestions).map((sq, sqIdx) => (
                        <button
                          key={sqIdx}
                          type="button"
                          onClick={() => handleAskQuestion(sq)}
                          className="text-primary hover:underline font-semibold cursor-pointer"
                        >
                          {sq}
                        </button>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          COLLECTION NAVIGATION TABS
          ═══════════════════════════════════════ */}
      <section className="techsauce-tabs-section">
        <div className="techsauce-container">
          <div className="flex items-center justify-between gap-3">
            <div className="techsauce-nav-pills" role="tablist">
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === 'qa'}
                onClick={() => setActiveTab('qa')}
                className={`techsauce-tab-pill ${activeTab === 'qa' ? 'active' : ''}`}
              >
                <span>{t('event.tab_qa')}</span>
              </button>

              <button
                type="button"
                role="tab"
                aria-selected={activeTab === 'workshops'}
                onClick={() => setActiveTab('workshops')}
                className={`techsauce-tab-pill ${activeTab === 'workshops' ? 'active' : ''}`}
              >
                <span>{t('event.tab_workshops')} ({techsauceData.workshops.length})</span>
              </button>

              <button
                type="button"
                role="tab"
                aria-selected={activeTab === 'exhibitors'}
                onClick={() => setActiveTab('exhibitors')}
                className={`techsauce-tab-pill ${activeTab === 'exhibitors' ? 'active' : ''}`}
              >
                <span>{t('event.tab_exhibitors')} ({techsauceData.exhibitors.length})</span>
              </button>

              <button
                type="button"
                role="tab"
                aria-selected={activeTab === 'awards'}
                onClick={() => setActiveTab('awards')}
                className={`techsauce-tab-pill ${activeTab === 'awards' ? 'active' : ''}`}
              >
                <span>{t('event.tab_awards')}</span>
              </button>

              <button
                type="button"
                role="tab"
                aria-selected={activeTab === 'ocr'}
                onClick={() => setActiveTab('ocr')}
                className={`techsauce-tab-pill ${activeTab === 'ocr' ? 'active' : ''}`}
              >
                <span>{t('event.tab_ocr')}</span>
              </button>
            </div>

            {/* View Mode Toggle (Card vs Table) */}
            {(activeTab === 'workshops' || activeTab === 'exhibitors') && (
              <div className="hidden md:flex items-center gap-1 bg-card border border-border p-1 rounded-lg">
                <button
                  type="button"
                  onClick={() => setViewMode('cards')}
                  className={`px-2.5 py-1 rounded text-xs font-semibold ${
                    viewMode === 'cards' ? 'bg-primary text-white' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <span>{t('event.view_cards')}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('table')}
                  className={`px-2.5 py-1 rounded text-xs font-semibold ${
                    viewMode === 'table' ? 'bg-primary text-white' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <span>{t('event.view_table')}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          TAB 1: SHOWCASE Q&A & EVENT HIGHLIGHTS
          ═══════════════════════════════════════ */}
      {activeTab === 'qa' && (
        <section className="techsauce-tab-content">
          <div className="techsauce-container">
            {/* Knowledge Base Note */}
            <div className="techsauce-notice-card">
              <div className="techsauce-notice-content">
                <h3 className="text-base font-bold text-foreground">{t('event.notice_title')}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {t('event.theme_desc')}
                </p>
                <div className="techsauce-notice-tags mt-2.5">
                  <span className="techsauce-badge-verified">{t('event.notice_tag_workshops')}</span>
                  <span className="techsauce-badge-verified">{t('event.notice_tag_exhibitors')}</span>
                  <span className="techsauce-badge-verified">{t('event.notice_tag_awards')}</span>
                  <span className="techsauce-badge-ocr">{t('event.notice_tag_ocr')}</span>
                </div>
              </div>
            </div>

            {/* Featured Highlights Grid */}
            <div className="techsauce-overview-grid mt-8">
              {/* Card 1: Workshops preview */}
              <div className="techsauce-overview-card">
                <div className="techsauce-overview-card-header">
                  <div>
                    <h3 className="font-bold text-lg text-foreground">{t('event.tab_workshops')}</h3>
                    <p className="text-xs text-muted-foreground">{t('event.overview_workshops_sub')}</p>
                  </div>
                </div>
                <div className="techsauce-overview-card-body">
                  <p className="text-sm text-muted-foreground">
                    {t('event.overview_workshops_desc')}
                  </p>
                  <button
                    type="button"
                    onClick={() => setActiveTab('workshops')}
                    className="btn btn-primary text-xs w-full mt-4"
                  >
                    {t('event.tab_workshops')} →
                  </button>
                </div>
              </div>

              {/* Card 2: Exhibitors preview */}
              <div className="techsauce-overview-card">
                <div className="techsauce-overview-card-header">
                  <div>
                    <h3 className="font-bold text-lg text-foreground">{t('event.tab_exhibitors')}</h3>
                    <p className="text-xs text-muted-foreground">{t('event.overview_exhibitors_sub')}</p>
                  </div>
                </div>
                <div className="techsauce-overview-card-body">
                  <p className="text-sm text-muted-foreground">
                    {t('event.overview_exhibitors_desc')}
                  </p>
                  <button
                    type="button"
                    onClick={() => setActiveTab('exhibitors')}
                    className="btn btn-primary text-xs w-full mt-4"
                  >
                    {t('event.tab_exhibitors')} (215) →
                  </button>
                </div>
              </div>

              {/* Card 3: Awards preview */}
              <div className="techsauce-overview-card">
                <div className="techsauce-overview-card-header">
                  <div>
                    <h3 className="font-bold text-lg text-foreground">{t('event.tab_awards')}</h3>
                    <p className="text-xs text-muted-foreground">{t('event.overview_awards_sub')}</p>
                  </div>
                </div>
                <div className="techsauce-overview-card-body">
                  <p className="text-sm text-muted-foreground">
                    {t('event.overview_awards_desc')}
                  </p>
                  <button
                    type="button"
                    onClick={() => setActiveTab('awards')}
                    className="btn btn-primary text-xs w-full mt-4"
                  >
                    {t('event.tab_awards')} →
                  </button>
                </div>
              </div>
            </div>

            {/* Featured Workshops Teaser */}
            <div className="mt-12">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-extrabold text-foreground">{t('event.featured_workshops_title')}</h3>
                  <p className="text-xs text-muted-foreground">{t('event.featured_workshops_sub')}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('workshops')}
                  className="text-xs font-bold text-primary flex items-center gap-1 hover:underline cursor-pointer"
                >
                  {t('event.tab_workshops')} →
                </button>
              </div>

              <div className="techsauce-workshops-grid">
                {techsauceData.workshops.slice(0, 3).map((w, idx) => (
                  <WorkshopCard
                    key={idx}
                    workshop={w}
                    onBookmark={toggleBookmark}
                    isBookmarked={bookmarkedWorkshops.includes(w.title)}
                    onCopy={handleCopy}
                    copiedText={copiedText}
                    saveLabel={t('event.save')}
                    savedLabel={t('event.saved')}
                    copyLabel={t('event.copy')}
                    copiedLabel={t('event.copied')}
                    speakersLabel={t('event.speakers_label')}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════
          TAB 2: WORKSHOPS COLLECTION
          ═══════════════════════════════════════ */}
      {activeTab === 'workshops' && (
        <section className="techsauce-tab-content">
          <div className="techsauce-container">
            {/* Filter Bar */}
            <div className="techsauce-filter-toolbar">
              {/* Day Filter */}
              <div className="techsauce-filter-group">
                <label className="techsauce-filter-label">{t('event.filter_date')}</label>
                <div className="techsauce-filter-buttons">
                  <button
                    type="button"
                    onClick={() => setSelectedDay('all')}
                    className={`techsauce-filter-btn ${selectedDay === 'all' ? 'active' : ''}`}
                  >
                    {t('event.filter_all_days')} ({techsauceData.workshops.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedDay('2026-08-26')}
                    className={`techsauce-filter-btn ${selectedDay === '2026-08-26' ? 'active' : ''}`}
                  >
                    {t('event.filter_day1')}
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedDay('2026-08-27')}
                    className={`techsauce-filter-btn ${selectedDay === '2026-08-27' ? 'active' : ''}`}
                  >
                    {t('event.filter_day2')}
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedDay('2026-08-28')}
                    className={`techsauce-filter-btn ${selectedDay === '2026-08-28' ? 'active' : ''}`}
                  >
                    {t('event.filter_day3')}
                  </button>
                </div>
              </div>

              {/* Room & Access Selectors */}
              <div className="techsauce-select-filters">
                <div>
                  <label className="techsauce-filter-label">{t('event.filter_room')}</label>
                  <select
                    value={selectedRoom}
                    onChange={(e) => setSelectedRoom(e.target.value)}
                    className="techsauce-select"
                  >
                    <option value="all">{t('event.filter_all_rooms')}</option>
                    <option value="Workshop Room A">{t('event.room_a')}</option>
                    <option value="Workshop Room B">{t('event.room_b')}</option>
                  </select>
                </div>

                <div>
                  <label className="techsauce-filter-label">{t('event.filter_access')}</label>
                  <select
                    value={selectedAccess}
                    onChange={(e) => setSelectedAccess(e.target.value)}
                    className="techsauce-select"
                  >
                    <option value="all">{t('event.filter_all_access')}</option>
                    <option value="Reserve">{t('event.access_reserve')}</option>
                    <option value="Invitation only">{t('event.access_invitation')}</option>
                    <option value="Walk-in">{t('event.access_walkin')}</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Results count & reset */}
            <div className="flex items-center justify-between my-4 text-xs text-muted-foreground flex-wrap gap-2">
              <span>{t('event.showing_workshops').replace('{count}', String(filteredWorkshops.length))}</span>
              <div className="flex items-center gap-3">
                {(selectedDay !== 'all' || selectedRoom !== 'all' || selectedAccess !== 'all') && (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedDay('all');
                      setSelectedRoom('all');
                      setSelectedAccess('all');
                    }}
                    className="text-muted-foreground hover:text-foreground font-semibold cursor-pointer"
                  >
                    {t('event.reset_filters')}
                  </button>
                )}
              </div>
            </div>

            {/* Table View Mode */}
            {viewMode === 'table' ? (
              <div className="techsauce-sheet-table-wrap">
                <table className="techsauce-sheet-table">
                  <thead>
                    <tr>
                      <th>{t('event.table_date')}</th>
                      <th>{t('event.table_time')}</th>
                      <th>{t('event.table_title')}</th>
                      <th>{t('event.speakers_label')}</th>
                      <th>{t('event.filter_room')}</th>
                      <th>{t('event.filter_access')}</th>
                      <th>{t('event.table_actions')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredWorkshops.map((w, idx) => (
                      <tr key={idx}>
                        <td className="font-mono text-xs whitespace-nowrap">{w.date}</td>
                        <td className="font-mono text-xs whitespace-nowrap">{w.time}</td>
                        <td className="font-bold text-sm">{w.title}</td>
                        <td>
                          {w.speakers.length > 0 ? (
                            <div className="space-y-1">
                              {w.speakers.map((s, sIdx) => (
                                <div key={sIdx} className="text-xs">
                                  <strong className="text-foreground">{s.name}</strong> ({s.role} @ <span className="text-primary">{s.company}</span>)
                                </div>
                              ))}
                            </div>
                          ) : (
                            <span className="text-xs text-muted-foreground italic">{t('event.panel_open_session')}</span>
                          )}
                        </td>
                        <td>
                          <span className="techsauce-room-pill techsauce-room-a">{w.room}</span>
                        </td>
                        <td>
                          <span className="techsauce-access-pill techsauce-access-reserve">{w.access}</span>
                        </td>
                        <td>
                          <button
                            type="button"
                            onClick={() => toggleBookmark(w.title)}
                            className={`p-1.5 rounded cursor-pointer ${bookmarkedWorkshops.includes(w.title) ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                            title={t('event.save')}
                          >
                            <Bookmark className={`w-4 h-4 ${bookmarkedWorkshops.includes(w.title) ? 'fill-primary' : ''}`} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              /* Cards View Mode */
              <div className="techsauce-workshops-grid">
                {filteredWorkshops.map((w, idx) => (
                  <WorkshopCard
                    key={idx}
                    workshop={w}
                    onBookmark={toggleBookmark}
                    isBookmarked={bookmarkedWorkshops.includes(w.title)}
                    onCopy={handleCopy}
                    copiedText={copiedText}
                    saveLabel={t('event.save')}
                    savedLabel={t('event.saved')}
                    copyLabel={t('event.copy')}
                    copiedLabel={t('event.copied')}
                    speakersLabel={t('event.speakers_label')}
                  />
                ))}
              </div>
            )}

            {filteredWorkshops.length === 0 && (
              <div className="techsauce-empty-state">
                <p>{t('event.no_workshops_match')}</p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════
          TAB 3: EXHIBITORS DIRECTORY (215 EXHIBITORS)
          ═══════════════════════════════════════ */}
      {activeTab === 'exhibitors' && (
        <section className="techsauce-tab-content">
          <div className="techsauce-container">
            {/* Exhibitors Search and Zone Selector */}
            <div className="techsauce-filter-toolbar">
              <div className="w-full md:max-w-md">
                <div className="techsauce-search-box-sm">
                  <Search className="w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder={t('event.search_exhibitors_placeholder')}
                    value={exhibitorSearch}
                    onChange={(e) => setExhibitorSearch(e.target.value)}
                    className="techsauce-search-input-sm"
                  />
                  {exhibitorSearch && (
                    <button
                      type="button"
                      onClick={() => setExhibitorSearch('')}
                      className="text-xs text-muted-foreground hover:text-foreground cursor-pointer"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>

              {/* Zone Filter */}
              <div className="techsauce-filter-buttons">
                <button
                  type="button"
                  onClick={() => setSelectedZone('all')}
                  className={`techsauce-filter-btn ${selectedZone === 'all' ? 'active' : ''}`}
                >
                  {t('event.zone_all')}
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedZone('A')}
                  className={`techsauce-filter-btn ${selectedZone === 'A' ? 'active' : ''}`}
                >
                  {t('event.zone_a')}
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedZone('B')}
                  className={`techsauce-filter-btn ${selectedZone === 'B' ? 'active' : ''}`}
                >
                  {t('event.zone_b')}
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedZone('C')}
                  className={`techsauce-filter-btn ${selectedZone === 'C' ? 'active' : ''}`}
                >
                  {t('event.zone_c')}
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedZone('D')}
                  className={`techsauce-filter-btn ${selectedZone === 'D' ? 'active' : ''}`}
                >
                  {t('event.zone_d')}
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedZone('numbered')}
                  className={`techsauce-filter-btn ${selectedZone === 'numbered' ? 'active' : ''}`}
                >
                  {t('event.zone_numbered')}
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedZone('other')}
                  className={`techsauce-filter-btn ${selectedZone === 'other' ? 'active' : ''}`}
                >
                  {t('event.zone_other')}
                </button>
              </div>
            </div>

            {/* Note regarding preserved names */}
            <div className="flex items-center justify-between text-xs text-muted-foreground my-3 flex-wrap gap-2">
              <span>{t('event.exhibitor_note')} {t('event.showing_exhibitors').replace('{count}', String(filteredExhibitors.length))}.</span>
            </div>

            {/* Table View Mode */}
            {viewMode === 'table' ? (
              <div className="techsauce-sheet-table-wrap">
                <table className="techsauce-sheet-table">
                  <thead>
                    <tr>
                      <th style={{ width: '80px' }}>#</th>
                      <th>{t('event.table_company')}</th>
                      <th style={{ width: '180px' }}>{t('event.table_booth_location')}</th>
                      <th style={{ width: '120px' }}>{t('event.table_actions')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredExhibitors.map((ex, idx) => (
                      <tr key={idx} className={ex.company.toLowerCase().includes('botnoi') ? 'bg-primary/5' : ''}>
                        <td className="font-mono text-xs text-muted-foreground">{idx + 1}</td>
                        <td className="font-bold text-sm">
                          {ex.company}
                          {ex.company.toLowerCase().includes('botnoi') && (
                            <span className="ml-2 techsauce-featured-badge">{t('event.featured_ai')}</span>
                          )}
                        </td>
                        <td>
                          <span className={`techsauce-booth-pill ${ex.company.toLowerCase().includes('botnoi') ? 'booth-botnoi' : ''}`}>
                            {ex.booth ? `${t('event.booth')} ${ex.booth}` : t('event.booth_not_shown')}
                          </span>
                        </td>
                        <td>
                          <button
                            type="button"
                            onClick={() => handleCopy(`${ex.company} (${ex.booth ? `${t('event.booth')} ${ex.booth}` : t('event.booth_not_shown')})`)}
                            className="btn btn-secondary text-xs py-1 px-2 cursor-pointer"
                          >
                            <span>{t('event.copy')}</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              /* Exhibitor Cards Grid */
              <div className="techsauce-exhibitors-grid">
                {filteredExhibitors.map((ex, idx) => (
                  <ExhibitorCard
                    key={idx}
                    exhibitor={ex}
                    onCopy={handleCopy}
                    copiedText={copiedText}
                    boothLabel={t('event.booth')}
                    boothNotShownLabel={t('event.booth_not_shown')}
                    featuredAiLabel={t('event.featured_ai')}
                    copyTitle={t('event.copy_booth_title')}
                  />
                ))}
              </div>
            )}

            {filteredExhibitors.length === 0 && (
              <div className="techsauce-empty-state">
                <p>{t('event.no_exhibitors_match').replace('{query}', exhibitorSearch)}</p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════
          TAB 4: TECHSAUCE AWARDS 2026 (18 HONORS)
          ═══════════════════════════════════════ */}
      {activeTab === 'awards' && (
        <section className="techsauce-tab-content">
          <div className="techsauce-container">
            {/* Category Filter Pills */}
            <div className="techsauce-award-cats-nav">
              <button
                type="button"
                onClick={() => setActiveAwardCategory('all')}
                className={`techsauce-award-cat-btn ${activeAwardCategory === 'all' ? 'active' : ''}`}
              >
                {t('event.all_categories')}
              </button>
              {awardCategories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveAwardCategory(cat)}
                  className={`techsauce-award-cat-btn ${activeAwardCategory === cat ? 'active' : ''}`}
                >
                  {cat} ({techsauceData.techsauce_awards.categories[cat].length})
                </button>
              ))}
            </div>

            {/* Awards Category Sections */}
            <div className="techsauce-awards-categories-wrap mt-8">
              {awardCategories
                .filter((cat) => activeAwardCategory === 'all' || activeAwardCategory === cat)
                .map((cat) => (
                  <div key={cat} className="techsauce-award-category-block">
                    <div className="techsauce-award-category-title-row">
                      <div className="flex-1 flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <h3 className="text-lg font-bold text-foreground">{cat}</h3>
                          <p className="text-xs text-muted-foreground">
                            {t('event.award_honors_count').replace('{count}', String(techsauceData.techsauce_awards.categories[cat].length))}
                          </p>
                        </div>

                        {/* Category Metadata Badges */}
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-amber-500/10 text-amber-500 font-medium text-xs">
                            <span>{t('event.nomination_period_label')}: {techsauceData.techsauce_awards.nomination_period}</span>
                          </span>
                          <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-indigo-500/10 text-indigo-500 font-medium text-xs">
                            <span>{t('event.announcement_date_label')}: {techsauceData.techsauce_awards.announcement_date}</span>
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="techsauce-award-items-grid">
                      {techsauceData.techsauce_awards.categories[cat].map((awardName, i) => (
                        <div key={i} className="techsauce-award-item-card">
                          <div className="w-full">
                            <span className="inline-block text-[10px] font-bold text-amber-500 uppercase tracking-wider mb-1">
                              {cat}
                            </span>
                            <div className="techsauce-award-item-text">{awardName}</div>
                          </div>

                          {/* Metadata Information Box */}
                          <div className="techsauce-award-meta-box">
                            <div className="techsauce-award-meta-row">
                              <span className="techsauce-award-meta-label">{t('event.nomination_period_label')}: </span>
                              <span className="techsauce-award-meta-val">{techsauceData.techsauce_awards.nomination_period}</span>
                            </div>

                            <div className="techsauce-award-meta-row">
                              <span className="techsauce-award-meta-label">{t('event.announcement_date_label')}: </span>
                              <span className="techsauce-award-meta-val font-mono font-bold text-amber-500">{techsauceData.techsauce_awards.announcement_date}</span>
                            </div>

                            <div className="techsauce-award-meta-row">
                              <span className="techsauce-award-meta-label">{t('event.venue_label')}: </span>
                              <span className="techsauce-award-meta-val text-[11px] leading-tight block mt-0.5">{techsauceData.techsauce_awards.venue}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════
          TAB 5: RAW SOURCE TEXT & OCR TRACE LAYER
          ═══════════════════════════════════════ */}
      {activeTab === 'ocr' && (
        <section className="techsauce-tab-content">
          <div className="techsauce-container">
            {/* Caution Banner */}
            <div className="techsauce-alert-banner">
              <div>
                <h4 className="font-bold text-amber-700 dark:text-amber-300">{t('event.ocr_notice_title')}</h4>
                <p className="text-xs text-amber-800 dark:text-amber-200 mt-0.5">
                  {t('event.ocr_notice_desc')}
                </p>
              </div>
            </div>

            {/* OCR Cards Grid */}
            <div className="techsauce-ocr-grid mt-6">
              {techsauceData.raw_source_text.map((ocr, idx) => (
                <div key={idx} className="techsauce-ocr-card">
                  <div className="techsauce-ocr-header">
                    <div className="flex-1 min-w-0 pr-2">
                      <span className="font-mono text-xs text-muted-foreground block truncate" title={ocr.source_image}>
                        {ocr.source_image}
                      </span>
                    </div>
                    <span className="techsauce-pill-review flex-shrink-0 whitespace-nowrap">
                      {ocr.verification_status}
                    </span>
                  </div>
                  <pre className="techsauce-ocr-text">{ocr.text}</pre>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <AppFooter />
    </div>
  );
}

/* ─────────────────────────────────────────────
   Component: Workshop Card
───────────────────────────────────────────── */
interface WorkshopCardProps {
  workshop: Workshop;
  isBookmarked: boolean;
  onBookmark: (title: string) => void;
  onCopy: (text: string) => void;
  copiedText: string | null;
  saveLabel: string;
  savedLabel: string;
  copyLabel: string;
  copiedLabel: string;
  speakersLabel: string;
}

function WorkshopCard({
  workshop,
  isBookmarked,
  onBookmark,
  onCopy,
  copiedText,
  saveLabel,
  savedLabel,
  copyLabel,
  copiedLabel,
  speakersLabel,
}: WorkshopCardProps) {
  const getAccessBadgeClass = (access: string) => {
    const acc = access.toLowerCase();
    if (acc.includes('reserve')) return 'techsauce-access-reserve';
    if (acc.includes('invitation')) return 'techsauce-access-invitation';
    if (acc.includes('walk-in')) return 'techsauce-access-walkin';
    return 'techsauce-access-default';
  };

  const getRoomBadgeClass = (room: string) => {
    return room.includes('Room A') ? 'techsauce-room-a' : 'techsauce-room-b';
  };

  const shareText = `${workshop.title} | ${workshop.date} ${workshop.time} at ${workshop.room}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="techsauce-workshop-card"
    >
      {/* Top Metadata Row */}
      <div className="techsauce-card-top">
        <div className="techsauce-time-pill">
          <span>{workshop.date} • {workshop.time}</span>
        </div>

        <div className="flex items-center gap-1.5">
          <span className={`techsauce-room-pill ${getRoomBadgeClass(workshop.room)}`}>
            {workshop.room}
          </span>
          <span className={`techsauce-access-pill ${getAccessBadgeClass(workshop.access)}`}>
            {workshop.access}
          </span>
        </div>
      </div>

      {/* Title */}
      <h3 className="techsauce-workshop-title">{workshop.title}</h3>

      {/* Speakers */}
      {workshop.speakers && workshop.speakers.length > 0 && (
        <div className="techsauce-speakers-wrap">
          <div className="text-xs font-bold text-muted-foreground mb-1.5">{speakersLabel}</div>
          <div className="space-y-2">
            {workshop.speakers.map((s, idx) => (
              <div key={idx} className="techsauce-speaker-item">
                <div className="techsauce-speaker-avatar">
                  {s.name.charAt(0)}
                </div>
                <div className="techsauce-speaker-info">
                  <div className="font-bold text-sm text-foreground">{s.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {s.role} <span className="text-primary font-semibold">@ {s.company}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actions footer */}
      <div className="techsauce-card-actions">
        <button
          type="button"
          onClick={() => onBookmark(workshop.title)}
          className={`techsauce-action-btn ${isBookmarked ? 'active' : ''}`}
          title={isBookmarked ? savedLabel : saveLabel}
        >
          <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-primary text-primary' : ''}`} />
          <span>{isBookmarked ? savedLabel : saveLabel}</span>
        </button>

        <button
          type="button"
          onClick={() => onCopy(shareText)}
          className="techsauce-action-btn"
          title={copyLabel}
        >
          {copiedText === shareText ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-500" />
              <span className="text-emerald-500">{copiedLabel}</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>{copyLabel}</span>
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   Component: Exhibitor Card
───────────────────────────────────────────── */
interface ExhibitorCardProps {
  exhibitor: Exhibitor;
  onCopy: (text: string) => void;
  copiedText: string | null;
  boothLabel: string;
  boothNotShownLabel: string;
  featuredAiLabel: string;
  copyTitle: string;
}

function ExhibitorCard({
  exhibitor,
  onCopy,
  copiedText,
  boothLabel,
  boothNotShownLabel,
  featuredAiLabel,
  copyTitle,
}: ExhibitorCardProps) {
  const isBotnoi = exhibitor.company.toLowerCase().includes('botnoi');
  const boothDisplay = exhibitor.booth
    ? (exhibitor.booth === 'Not shown' ? boothNotShownLabel : `${boothLabel} ${exhibitor.booth}`)
    : boothNotShownLabel;

  return (
    <div className={`techsauce-exhibitor-card ${isBotnoi ? 'botnoi-featured' : ''}`}>
      <div className="flex items-start justify-between gap-2">
        <span className={`techsauce-booth-pill ${isBotnoi ? 'booth-botnoi' : ''}`}>
          {boothDisplay}
        </span>
        {isBotnoi && (
          <span className="techsauce-featured-badge">{featuredAiLabel}</span>
        )}
      </div>

      <h4 className="techsauce-exhibitor-name" title={exhibitor.company}>
        {exhibitor.company}
      </h4>

      <button
        type="button"
        onClick={() => onCopy(`${exhibitor.company} (${boothDisplay})`)}
        className="techsauce-exhibitor-copy"
        title={copyTitle}
      >
        {copiedText === `${exhibitor.company} (${boothDisplay})` ? (
          <Check className="w-3 h-3 text-emerald-500" />
        ) : (
          <Copy className="w-3 h-3" />
        )}
      </button>
    </div>
  );
}
