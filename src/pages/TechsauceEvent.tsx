import { useState, useMemo, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Search, Copy, Check, Sparkles,
  Users, Award, Building2, Presentation,
  Calendar, MapPin, Grid, Table, X,
  RotateCcw
} from 'lucide-react';
import {
  techsauceData,
  type Workshop,
  type Exhibitor,
} from '../lib/techsauceData';
import { useTranslation } from '../lib/LanguageContext';
import AppFooter from '../components/AppFooter';
import './Pages.css';

type TabType = 'workshops' | 'exhibitors' | 'awards';

function getAccessBadgeClass(access: string) {
  const acc = (access || '').toLowerCase();
  if (acc.includes('reserve')) return 'techsauce-access-reserve';
  if (acc.includes('invitation')) return 'techsauce-access-invitation';
  if (acc.includes('walk-in') || acc.includes('walkin')) return 'techsauce-access-walkin';
  return 'techsauce-access-default';
}

function getRoomBadgeClass(room: string) {
  const r = (room || '').toLowerCase();
  if (r.includes('room a')) return 'techsauce-room-a';
  if (r.includes('room b')) return 'techsauce-room-b';
  return 'techsauce-room-default';
}

export default function TechsauceEvent() {
  const { t } = useTranslation();

  // Active Tab: 'workshops' | 'exhibitors' | 'awards'
  const [activeTab, setActiveTab] = useState<TabType>(() => {
    const hash = typeof window !== 'undefined' ? window.location.hash.toLowerCase().replace('#', '') : '';
    if (hash === 'exhibitors' || hash === 'awards' || hash === 'workshops') {
      return hash as TabType;
    }
    return 'workshops';
  });

  // View Mode: 'cards' | 'table'
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');

  // Workshop Filters
  const [workshopSearch, setWorkshopSearch] = useState('');
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

  // Synchronize hash with active tab for direct URL navigation & Avatar tool calls
  const handleHashChange = useCallback(() => {
    const hash = window.location.hash.toLowerCase().replace('#', '');
    if (hash === 'workshops' || hash === 'exhibitors' || hash === 'awards') {
      setActiveTab(hash as TabType);
    }
  }, []);

  useEffect(() => {
    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [handleHashChange]);

  const switchTab = (tab: TabType, scrollIntoView = false) => {
    setActiveTab(tab);
    if (window.history.pushState) {
      window.history.pushState(null, '', `#${tab}`);
    } else {
      window.location.hash = tab;
    }
    if (scrollIntoView) {
      const navEl = document.getElementById('event-tab-navigation');
      if (navEl) {
        navEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(null), 2000);
  };

  // Filtered Workshops
  const filteredWorkshops = useMemo(() => {
    return techsauceData.workshops.filter((w) => {
      const matchDay = selectedDay === 'all' || w.date === selectedDay;
      const matchRoom = selectedRoom === 'all' || w.room === selectedRoom;
      const matchAccess = selectedAccess === 'all' || w.access.toLowerCase().includes(selectedAccess.toLowerCase());

      const query = workshopSearch.trim().toLowerCase();
      const matchSearch =
        !query ||
        w.title.toLowerCase().includes(query) ||
        w.room.toLowerCase().includes(query) ||
        w.access.toLowerCase().includes(query) ||
        w.speakers.some(
          (s) =>
            s.name.toLowerCase().includes(query) ||
            s.company.toLowerCase().includes(query) ||
            s.role.toLowerCase().includes(query)
        );

      return matchDay && matchRoom && matchAccess && matchSearch;
    });
  }, [selectedDay, selectedRoom, selectedAccess, workshopSearch]);

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
      if (selectedZone === 'other')
        return (
          !e.booth ||
          e.booth === 'Not shown' ||
          (!e.booth.startsWith('A') &&
            !e.booth.startsWith('B') &&
            !e.booth.startsWith('C') &&
            !e.booth.startsWith('D') &&
            !/^\d+$/.test(e.booth))
        );

      return true;
    });
  }, [exhibitorSearch, selectedZone]);

  const awardCategories = useMemo(() => {
    return Object.keys(techsauceData.techsauce_awards.categories);
  }, []);

  const totalHonorsCount = useMemo(() => {
    return Object.values(techsauceData.techsauce_awards.categories).reduce((acc, cat) => acc + cat.length, 0);
  }, []);

  return (
    <main id="techsauce-event-main" className="techsauce-page-root w-full relative overflow-hidden bg-transparent text-foreground">
      {/* Anchor targets for direct scanner & route jumping */}
      <div id="workshops" className="sr-only" aria-hidden="true" />
      <div id="exhibitors" className="sr-only" aria-hidden="true" />
      <div id="awards" className="sr-only" aria-hidden="true" />

      {/* ═══════════════════════════════════════
          HERO SECTION — SUMMIT OVERVIEW & QUICK ACTIONS
          ═══════════════════════════════════════ */}
      <section id="event-hero" aria-label="Techsauce Global Summit 2026 Overview" className="techsauce-hero bg-transparent">
        <div className="techsauce-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="techsauce-hero-content"
          >
            {/* Summit Badge */}
            <div className="techsauce-badge">
              <Sparkles className="w-4 h-4 text-primary animate-pulse" />
              <span>Techsauce Global Summit 2026</span>
            </div>

            {/* Main Title */}
            <h1 className="techsauce-hero-title">
              {t('event.title')}
              <span className="techsauce-title-sub">{t('event.subtitle')}</span>
            </h1>

            {/* Event Theme Subtitle */}
            <p className="techsauce-hero-theme">
              {t('event.theme_desc')}
            </p>

            {/* Event Metadata Cards */}
            <div className="techsauce-meta-grid" role="region" aria-label="Summit Schedule and Location Details">
              <div className="techsauce-meta-item">
                <div className="techsauce-meta-icon-wrap">
                  <Calendar className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="techsauce-meta-label">{t('event.meta_dates_label')}</div>
                  <div className="techsauce-meta-value">{t('event.meta_dates_val')}</div>
                </div>
              </div>

              <div className="techsauce-meta-item">
                <div className="techsauce-meta-icon-wrap">
                  <MapPin className="w-5 h-5 text-indigo-500" />
                </div>
                <div>
                  <div className="techsauce-meta-label">{t('event.meta_venue_label')}</div>
                  <div className="techsauce-meta-value">{t('event.meta_venue_val')}</div>
                </div>
              </div>

              <div className="techsauce-meta-item">
                <div className="techsauce-meta-icon-wrap">
                  <Award className="w-5 h-5 text-amber-500" />
                </div>
                <div>
                  <div className="techsauce-meta-label">{t('event.meta_awards_label')}</div>
                  <div className="techsauce-meta-value">{t('event.meta_awards_val')}</div>
                </div>
              </div>
            </div>

            {/* Key Stats Strip */}
            <div className="techsauce-stats-strip" role="region" aria-label="Summit Key Figures">
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
                <div className="techsauce-stat-num">{totalHonorsCount}</div>
                <div className="techsauce-stat-lbl">{t('event.stat_honors')}</div>
              </div>
            </div>

            {/* Single Primary Tab Navigation */}
            <nav id="event-tab-navigation" role="tablist" aria-label="Event Directory Sections" className="techsauce-hero-quicknav">
              <button
                id="tab-workshops"
                type="button"
                role="tab"
                aria-controls="section-workshops"
                aria-selected={activeTab === 'workshops'}
                onClick={() => switchTab('workshops', true)}
                className={`techsauce-hero-quick-btn ${activeTab === 'workshops' ? 'active' : ''}`}
                aria-label="Curated Workshops"
              >
                <Presentation className="w-4 h-4 text-primary" />
                <span className="font-bold">{t('event.tab_workshops')}</span>
                <span className="techsauce-quick-badge">{techsauceData.workshops.length}</span>
              </button>

              <button
                id="tab-exhibitors"
                type="button"
                role="tab"
                aria-controls="section-exhibitors"
                aria-selected={activeTab === 'exhibitors'}
                onClick={() => switchTab('exhibitors', true)}
                className={`techsauce-hero-quick-btn ${activeTab === 'exhibitors' ? 'active' : ''}`}
                aria-label="Exhibitor Directory"
              >
                <Building2 className="w-4 h-4 text-emerald-500" />
                <span className="font-bold">{t('event.tab_exhibitors')}</span>
                <span className="techsauce-quick-badge">{techsauceData.exhibitors.length}</span>
              </button>

              <button
                id="tab-awards"
                type="button"
                role="tab"
                aria-controls="section-awards"
                aria-selected={activeTab === 'awards'}
                onClick={() => switchTab('awards', true)}
                className={`techsauce-hero-quick-btn ${activeTab === 'awards' ? 'active' : ''}`}
                aria-label="Techsauce Awards"
              >
                <Award className="w-4 h-4 text-amber-500" />
                <span className="font-bold">{t('event.tab_awards')}</span>
                <span className="techsauce-quick-badge">{totalHonorsCount}</span>
              </button>
            </nav>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          AI AVATAR WIDGET INTERACTION DIRECTIVES & CONTEXT
          (Hidden assistive context scanned by DomScanner & Gemini Live Tools)
          ═══════════════════════════════════════ */}
      <div
        id="ai-widget-interaction-context"
        role="note"
        aria-hidden="false"
        className="techsauce-ai-context-instructions"
        style={{
          position: 'absolute',
          width: '1px',
          height: '1px',
          padding: 0,
          margin: '-1px',
          overflow: 'hidden',
          clip: 'rect(0, 0, 0, 0)',
          whiteSpace: 'normal',
          border: 0,
          opacity: 0.01,
          pointerEvents: 'none',
        }}
      >
        AI Avatar Assistant Directives:
        1. When answering user queries or discussing a specific workshop, exhibitor, or award honor, actively scroll and highlight the target card or section so the user can easily see it on the page.
        2. Use scan_section or scan_page on target element selectors: #workshop-0 through #workshop-14 for workshops, #exhibitor-0 through #exhibitor-214 for exhibitors, and #award-category-0 through #award-category-5 for awards.
        3. Switch tabs between #tab-workshops, #tab-exhibitors, and #tab-awards when the user inquires about different areas of Techsauce Global Summit 2026.
      </div>

      {/* ═══════════════════════════════════════
          TAB 1: WORKSHOPS & MASTERCLASSES
          ═══════════════════════════════════════ */}
      {activeTab === 'workshops' && (
        <section
          id="section-workshops"
          role="tabpanel"
          aria-labelledby="tab-workshops"
          aria-label="Workshops and Masterclasses"
          className="techsauce-tab-content"
        >
          <div className="techsauce-container">
            {/* Filter Toolbar */}
            <div className="techsauce-filter-toolbar" role="search" aria-label="Workshop Search and Filters">
              {/* Workshop Search Input */}
              <div className="w-full md:max-w-xs">
                <div className="techsauce-search-box-sm">
                  <Search className="w-4 h-4 text-muted-foreground" />
                  <input
                    id="search-workshops"
                    type="search"
                    placeholder="Search topics, speakers, companies..."
                    value={workshopSearch}
                    onChange={(e) => setWorkshopSearch(e.target.value)}
                    className="techsauce-search-input-sm"
                    aria-label="Search workshops by keyword, speaker, or company"
                  />
                  {workshopSearch && (
                    <button
                      id="btn-clear-workshop-search"
                      type="button"
                      onClick={() => setWorkshopSearch('')}
                      className="text-xs text-muted-foreground hover:text-foreground cursor-pointer"
                      aria-label="Clear workshop search"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Day Filter Buttons */}
              <div id="workshop-date-filters" className="techsauce-filter-buttons" role="radiogroup" aria-label="Filter by Date">
                <button
                  id="filter-workshop-day-all"
                  type="button"
                  role="radio"
                  aria-checked={selectedDay === 'all'}
                  onClick={() => setSelectedDay('all')}
                  className={`techsauce-filter-btn ${selectedDay === 'all' ? 'active' : ''}`}
                >
                  {t('event.filter_all_days')} ({techsauceData.workshops.length})
                </button>
                <button
                  id="filter-workshop-day-1"
                  type="button"
                  role="radio"
                  aria-checked={selectedDay === '2026-08-26'}
                  onClick={() => setSelectedDay('2026-08-26')}
                  className={`techsauce-filter-btn ${selectedDay === '2026-08-26' ? 'active' : ''}`}
                >
                  {t('event.filter_day1')}
                </button>
                <button
                  id="filter-workshop-day-2"
                  type="button"
                  role="radio"
                  aria-checked={selectedDay === '2026-08-27'}
                  onClick={() => setSelectedDay('2026-08-27')}
                  className={`techsauce-filter-btn ${selectedDay === '2026-08-27' ? 'active' : ''}`}
                >
                  {t('event.filter_day2')}
                </button>
                <button
                  id="filter-workshop-day-3"
                  type="button"
                  role="radio"
                  aria-checked={selectedDay === '2026-08-28'}
                  onClick={() => setSelectedDay('2026-08-28')}
                  className={`techsauce-filter-btn ${selectedDay === '2026-08-28' ? 'active' : ''}`}
                >
                  {t('event.filter_day3')}
                </button>
              </div>

              {/* Room & Access Dropdowns */}
              <div className="techsauce-select-filters">
                <div>
                  <select
                    id="filter-workshop-room"
                    name="workshop-room"
                    value={selectedRoom}
                    onChange={(e) => setSelectedRoom(e.target.value)}
                    className="techsauce-select"
                    aria-label="Filter workshops by room"
                  >
                    <option value="all">{t('event.filter_all_rooms')}</option>
                    <option value="Workshop Room A">{t('event.room_a')}</option>
                    <option value="Workshop Room B">{t('event.room_b')}</option>
                  </select>
                </div>

                <div>
                  <select
                    id="filter-workshop-access"
                    name="workshop-access"
                    value={selectedAccess}
                    onChange={(e) => setSelectedAccess(e.target.value)}
                    className="techsauce-select"
                    aria-label="Filter workshops by access type"
                  >
                    <option value="all">{t('event.filter_all_access')}</option>
                    <option value="Reserve">{t('event.access_reserve')}</option>
                    <option value="Invitation only">{t('event.access_invitation')}</option>
                    <option value="Walk-in">{t('event.access_walkin')}</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Results count, reset & View Mode Toggle */}
            <div className="flex items-center justify-between my-4 text-xs text-muted-foreground flex-wrap gap-3">
              <div className="flex items-center gap-3 flex-wrap">
                <span className="font-semibold">{t('event.showing_workshops').replace('{count}', String(filteredWorkshops.length))}</span>
                {(selectedDay !== 'all' || selectedRoom !== 'all' || selectedAccess !== 'all' || workshopSearch) && (
                  <button
                    id="btn-reset-workshop-filters"
                    type="button"
                    onClick={() => {
                      setSelectedDay('all');
                      setSelectedRoom('all');
                      setSelectedAccess('all');
                      setWorkshopSearch('');
                    }}
                    className="inline-flex items-center gap-1 text-primary hover:underline font-semibold cursor-pointer"
                    aria-label="Reset all workshop filters"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>{t('event.reset_filters')}</span>
                  </button>
                )}
              </div>

              {/* View Mode Toggle (Card vs Table) */}
              <div className="flex items-center gap-1 bg-card border border-border p-1 rounded-xl shadow-xs" role="toolbar" aria-label="Workshops layout view mode">
                <button
                  id="view-mode-cards"
                  type="button"
                  onClick={() => setViewMode('cards')}
                  aria-pressed={viewMode === 'cards'}
                  aria-label="Switch to Card Grid View"
                  className={`techsauce-viewmode-btn ${viewMode === 'cards' ? 'active' : ''}`}
                >
                  <Grid className="w-3.5 h-3.5" />
                  <span>{t('event.view_cards')}</span>
                </button>
                <button
                  id="view-mode-table"
                  type="button"
                  onClick={() => setViewMode('table')}
                  aria-pressed={viewMode === 'table'}
                  aria-label="Switch to Structured Table View"
                  className={`techsauce-viewmode-btn ${viewMode === 'table' ? 'active' : ''}`}
                >
                  <Table className="w-3.5 h-3.5" />
                  <span>{t('event.view_table')}</span>
                </button>
              </div>
            </div>

            {/* Table View Mode */}
            {viewMode === 'table' ? (
              <div className="techsauce-sheet-table-wrap">
                <table className="techsauce-sheet-table" aria-label="Workshops directory table">
                  <thead>
                    <tr>
                      <th style={{ width: '110px', minWidth: '100px', whiteSpace: 'nowrap' }}>{t('event.table_date')}</th>
                      <th style={{ width: '130px', minWidth: '120px', whiteSpace: 'nowrap' }}>{t('event.table_time')}</th>
                      <th style={{ minWidth: '220px' }}>{t('event.table_title')}</th>
                      <th style={{ minWidth: '220px' }}>{t('event.speakers_label')}</th>
                      <th style={{ width: '160px', minWidth: '150px', whiteSpace: 'nowrap' }}>{t('event.filter_room')}</th>
                      <th style={{ width: '150px', minWidth: '140px', whiteSpace: 'nowrap' }}>{t('event.filter_access')}</th>
                      <th style={{ width: '110px', minWidth: '100px', whiteSpace: 'nowrap' }}>{t('event.table_actions')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredWorkshops.map((w, idx) => (
                      <tr key={idx} id={`workshop-row-${idx}`}>
                        <td className="font-mono text-xs whitespace-nowrap">{w.date}</td>
                        <td className="font-mono text-xs whitespace-nowrap">{w.time}</td>
                        <td className="font-bold text-sm text-foreground">{w.title}</td>
                        <td>
                          {w.speakers.length > 0 ? (
                            <div className="space-y-1">
                              {w.speakers.map((s, sIdx) => (
                                <div key={sIdx} className="text-xs leading-relaxed">
                                  <strong className="text-foreground">{s.name}</strong>{' '}
                                  <span className="text-muted-foreground">({s.role} @ <span className="text-primary font-semibold">{s.company}</span>)</span>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <span className="text-xs text-muted-foreground italic">{t('event.panel_open_session')}</span>
                          )}
                        </td>
                        <td className="whitespace-nowrap">
                          <span className={`techsauce-room-pill ${getRoomBadgeClass(w.room)}`}>
                            {w.room}
                          </span>
                        </td>
                        <td className="whitespace-nowrap">
                          <span className={`techsauce-access-pill ${getAccessBadgeClass(w.access)}`}>
                            {w.access}
                          </span>
                        </td>
                        <td className="whitespace-nowrap">
                          <button
                            id={`btn-copy-workshop-row-${idx}`}
                            type="button"
                            onClick={() => handleCopy(`${w.title} | ${w.date} ${w.time} at ${w.room} (${w.access})`)}
                            className="btn btn-secondary text-xs py-1 px-2.5 cursor-pointer inline-flex items-center gap-1"
                            aria-label={`Copy details for ${w.title}`}
                          >
                            {copiedText === `${w.title} | ${w.date} ${w.time} at ${w.room} (${w.access})` ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-500" />
                                <span className="text-emerald-500">{t('event.copied')}</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3 text-muted-foreground" />
                                <span>{t('event.copy')}</span>
                              </>
                            )}
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
                    index={idx}
                    workshop={w}
                    onCopy={handleCopy}
                    copiedText={copiedText}
                    copyLabel={t('event.copy')}
                    copiedLabel={t('event.copied')}
                    speakersLabel={t('event.speakers_label')}
                  />
                ))}
              </div>
            )}

            {filteredWorkshops.length === 0 && (
              <div className="techsauce-empty-state">
                <Presentation className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
                <p className="font-semibold">{t('event.no_workshops_match')}</p>
                <p className="text-xs text-muted-foreground mt-1">Try resetting filters or adjusting search keywords.</p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════
          TAB 2: EXHIBITORS DIRECTORY (215 BOOTHS)
          ═══════════════════════════════════════ */}
      {activeTab === 'exhibitors' && (
        <section
          id="section-exhibitors"
          role="tabpanel"
          aria-labelledby="tab-exhibitors"
          aria-label="Exhibitors Directory (215 Booths)"
          className="techsauce-tab-content"
        >
          <div className="techsauce-container">
            {/* Exhibitors Search and Zone Selector */}
            <div className="techsauce-filter-toolbar" role="search" aria-label="Exhibitor Search and Zone Filters">
              <div className="w-full md:max-w-md">
                <div className="techsauce-search-box-sm">
                  <Search className="w-4 h-4 text-muted-foreground" />
                  <input
                    id="search-exhibitors"
                    type="search"
                    placeholder={t('event.search_exhibitors_placeholder')}
                    value={exhibitorSearch}
                    onChange={(e) => setExhibitorSearch(e.target.value)}
                    className="techsauce-search-input-sm"
                    aria-label="Search exhibitors by company name or booth number"
                  />
                  {exhibitorSearch && (
                    <button
                      id="btn-clear-exhibitor-search"
                      type="button"
                      onClick={() => setExhibitorSearch('')}
                      className="text-xs text-muted-foreground hover:text-foreground cursor-pointer"
                      aria-label="Clear exhibitor search"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Zone Filter Buttons */}
              <div id="exhibitor-zone-filters" className="techsauce-filter-buttons" role="radiogroup" aria-label="Filter Exhibitors by Zone">
                <button
                  id="filter-zone-all"
                  type="button"
                  role="radio"
                  aria-checked={selectedZone === 'all'}
                  onClick={() => setSelectedZone('all')}
                  className={`techsauce-filter-btn ${selectedZone === 'all' ? 'active' : ''}`}
                >
                  {t('event.zone_all')}
                </button>
                <button
                  id="filter-zone-a"
                  type="button"
                  role="radio"
                  aria-checked={selectedZone === 'A'}
                  onClick={() => setSelectedZone('A')}
                  className={`techsauce-filter-btn ${selectedZone === 'A' ? 'active' : ''}`}
                >
                  {t('event.zone_a')}
                </button>
                <button
                  id="filter-zone-b"
                  type="button"
                  role="radio"
                  aria-checked={selectedZone === 'B'}
                  onClick={() => setSelectedZone('B')}
                  className={`techsauce-filter-btn ${selectedZone === 'B' ? 'active' : ''}`}
                >
                  {t('event.zone_b')}
                </button>
                <button
                  id="filter-zone-c"
                  type="button"
                  role="radio"
                  aria-checked={selectedZone === 'C'}
                  onClick={() => setSelectedZone('C')}
                  className={`techsauce-filter-btn ${selectedZone === 'C' ? 'active' : ''}`}
                >
                  {t('event.zone_c')}
                </button>
                <button
                  id="filter-zone-d"
                  type="button"
                  role="radio"
                  aria-checked={selectedZone === 'D'}
                  onClick={() => setSelectedZone('D')}
                  className={`techsauce-filter-btn ${selectedZone === 'D' ? 'active' : ''}`}
                >
                  {t('event.zone_d')}
                </button>
                <button
                  id="filter-zone-numbered"
                  type="button"
                  role="radio"
                  aria-checked={selectedZone === 'numbered'}
                  onClick={() => setSelectedZone('numbered')}
                  className={`techsauce-filter-btn ${selectedZone === 'numbered' ? 'active' : ''}`}
                >
                  {t('event.zone_numbered')}
                </button>
                <button
                  id="filter-zone-other"
                  type="button"
                  role="radio"
                  aria-checked={selectedZone === 'other'}
                  onClick={() => setSelectedZone('other')}
                  className={`techsauce-filter-btn ${selectedZone === 'other' ? 'active' : ''}`}
                >
                  {t('event.zone_other')}
                </button>
              </div>
            </div>

            {/* Note regarding preserved names & View Mode Toggle */}
            <div className="flex items-center justify-between text-xs text-muted-foreground my-3 flex-wrap gap-3">
              <div className="flex items-center gap-3 flex-wrap">
                <span>{t('event.exhibitor_note')} {t('event.showing_exhibitors').replace('{count}', String(filteredExhibitors.length))}.</span>
                {(selectedZone !== 'all' || exhibitorSearch) && (
                  <button
                    id="btn-reset-exhibitor-filters"
                    type="button"
                    onClick={() => {
                      setSelectedZone('all');
                      setExhibitorSearch('');
                    }}
                    className="inline-flex items-center gap-1 text-primary hover:underline font-semibold cursor-pointer"
                    aria-label="Reset all exhibitor filters"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>{t('event.reset_filters')}</span>
                  </button>
                )}
              </div>

              {/* View Mode Toggle (Card vs Table) */}
              <div className="flex items-center gap-1 bg-card border border-border p-1 rounded-xl shadow-xs" role="toolbar" aria-label="Exhibitors layout view mode">
                <button
                  id="exhibitor-view-mode-cards"
                  type="button"
                  onClick={() => setViewMode('cards')}
                  aria-pressed={viewMode === 'cards'}
                  aria-label="Switch to Card Grid View"
                  className={`techsauce-viewmode-btn ${viewMode === 'cards' ? 'active' : ''}`}
                >
                  <Grid className="w-3.5 h-3.5" />
                  <span>{t('event.view_cards')}</span>
                </button>
                <button
                  id="exhibitor-view-mode-table"
                  type="button"
                  onClick={() => setViewMode('table')}
                  aria-pressed={viewMode === 'table'}
                  aria-label="Switch to Structured Table View"
                  className={`techsauce-viewmode-btn ${viewMode === 'table' ? 'active' : ''}`}
                >
                  <Table className="w-3.5 h-3.5" />
                  <span>{t('event.view_table')}</span>
                </button>
              </div>
            </div>

            {/* Table View Mode */}
            {viewMode === 'table' ? (
              <div className="techsauce-sheet-table-wrap">
                <table className="techsauce-sheet-table" aria-label="Exhibitors directory table">
                  <thead>
                    <tr>
                      <th style={{ width: '70px' }}>#</th>
                      <th>{t('event.table_company')}</th>
                      <th style={{ width: '200px' }}>{t('event.table_booth_location')}</th>
                      <th style={{ width: '120px' }}>{t('event.table_actions')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredExhibitors.map((ex, idx) => (
                      <tr key={idx} id={`exhibitor-row-${idx}`} className={ex.company.toLowerCase().includes('botnoi') ? 'bg-primary/10' : ''}>
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
                            id={`btn-copy-exhibitor-row-${idx}`}
                            type="button"
                            onClick={() => handleCopy(`${ex.company} (${ex.booth ? `${t('event.booth')} ${ex.booth}` : t('event.booth_not_shown')})`)}
                            className="btn btn-secondary text-xs py-1 px-2.5 cursor-pointer inline-flex items-center gap-1"
                            aria-label={`Copy booth details for ${ex.company}`}
                          >
                            {copiedText === `${ex.company} (${ex.booth ? `${t('event.booth')} ${ex.booth}` : t('event.booth_not_shown')})` ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-500" />
                                <span className="text-emerald-500">{t('event.copied')}</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3 text-muted-foreground" />
                                <span>{t('event.copy')}</span>
                              </>
                            )}
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
                    index={idx}
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
                <Building2 className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
                <p className="font-semibold">{t('event.no_exhibitors_match').replace('{query}', exhibitorSearch)}</p>
                <p className="text-xs text-muted-foreground mt-1">Check the spelling or switch zone filters.</p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════
          TAB 3: TECHSAUCE AWARDS 2026 (18 HONORS)
          ═══════════════════════════════════════ */}
      {activeTab === 'awards' && (
        <section
          id="section-awards"
          role="tabpanel"
          aria-labelledby="tab-awards"
          aria-label="Techsauce Awards 2026"
          className="techsauce-tab-content"
        >
          <div className="techsauce-container">
            {/* Category Filter Pills */}
            <div id="award-category-filters" className="techsauce-award-cats-nav" role="tablist" aria-label="Filter Awards by Category">
              <button
                id="filter-award-cat-all"
                type="button"
                role="tab"
                aria-selected={activeAwardCategory === 'all'}
                onClick={() => setActiveAwardCategory('all')}
                className={`techsauce-award-cat-btn ${activeAwardCategory === 'all' ? 'active' : ''}`}
              >
                {t('event.all_categories')}
              </button>
              {awardCategories.map((cat, catIdx) => (
                <button
                  key={cat}
                  id={`filter-award-cat-${catIdx}`}
                  type="button"
                  role="tab"
                  aria-selected={activeAwardCategory === cat}
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
                .map((cat, catIdx) => {
                  const catSlug = cat.toLowerCase().replace(/[^a-z0-9]/g, '-');
                  return (
                    <section
                      key={cat}
                      id={`award-category-${catSlug}`}
                      aria-label={`${cat} Category (${techsauceData.techsauce_awards.categories[cat].length} Honors)`}
                      className="techsauce-award-category-block"
                    >
                      <div className="techsauce-award-category-title-row">
                        <div className="flex-1 flex flex-wrap items-center justify-between gap-3">
                          <div>
                            <h3 className="text-lg font-bold text-foreground">{cat}</h3>
                            <p className="text-xs text-muted-foreground">
                              {t('event.award_honors_count').replace(
                                '{count}',
                                String(techsauceData.techsauce_awards.categories[cat].length)
                              )}
                            </p>
                          </div>

                          {/* Category Metadata Badges */}
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-amber-500/10 text-amber-500 font-medium text-xs border border-amber-500/20">
                              <span>
                                {t('event.nomination_period_label')}: {techsauceData.techsauce_awards.nomination_period}
                              </span>
                            </span>
                            <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-indigo-500/10 text-indigo-500 font-medium text-xs border border-indigo-500/20">
                              <span>
                                {t('event.announcement_date_label')}: {techsauceData.techsauce_awards.announcement_date}
                              </span>
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="techsauce-award-items-grid">
                        {techsauceData.techsauce_awards.categories[cat].map((awardName, i) => (
                          <article
                            key={i}
                            id={`award-item-${catIdx}-${i}`}
                            className="techsauce-award-item-card"
                            aria-label={`${awardName} (${cat})`}
                          >
                            <div className="w-full flex items-start justify-between gap-2">
                              <div>
                                <span className="inline-block text-[10px] font-bold text-amber-500 uppercase tracking-wider mb-1">
                                  {cat}
                                </span>
                                <h4 className="techsauce-award-item-text">{awardName}</h4>
                              </div>
                              <button
                                id={`btn-copy-award-${catIdx}-${i}`}
                                type="button"
                                onClick={() => handleCopy(`${awardName} — ${cat} (${techsauceData.techsauce_awards.venue}, ${techsauceData.techsauce_awards.announcement_date})`)}
                                className="techsauce-award-copy-btn cursor-pointer"
                                title={`Copy ${awardName} info`}
                                aria-label={`Copy details for ${awardName}`}
                              >
                                {copiedText === `${awardName} — ${cat} (${techsauceData.techsauce_awards.venue}, ${techsauceData.techsauce_awards.announcement_date})` ? (
                                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                                ) : (
                                  <Copy className="w-3.5 h-3.5 text-muted-foreground" />
                                )}
                              </button>
                            </div>

                            {/* Metadata Information Box */}
                            <div className="techsauce-award-meta-box">
                              <div className="techsauce-award-meta-row">
                                <span className="techsauce-award-meta-label">{t('event.nomination_period_label')}: </span>
                                <span className="techsauce-award-meta-val">{techsauceData.techsauce_awards.nomination_period}</span>
                              </div>

                              <div className="techsauce-award-meta-row">
                                <span className="techsauce-award-meta-label">{t('event.announcement_date_label')}: </span>
                                <span className="techsauce-award-meta-val font-mono font-bold text-amber-500">
                                  {techsauceData.techsauce_awards.announcement_date}
                                </span>
                              </div>

                              <div className="techsauce-award-meta-row">
                                <span className="techsauce-award-meta-label">{t('event.venue_label')}: </span>
                                <span className="techsauce-award-meta-val text-[11px] leading-tight block mt-0.5">
                                  {techsauceData.techsauce_awards.venue}
                                </span>
                              </div>
                            </div>
                          </article>
                        ))}
                      </div>
                    </section>
                  );
                })}
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <AppFooter />
    </main>
  );
}

/* ─────────────────────────────────────────────
   Component: Workshop Card (Clean, Save Button Removed)
───────────────────────────────────────────── */
interface WorkshopCardProps {
  index: number;
  workshop: Workshop;
  onCopy: (text: string) => void;
  copiedText: string | null;
  copyLabel: string;
  copiedLabel: string;
  speakersLabel: string;
}

function WorkshopCard({
  index,
  workshop,
  onCopy,
  copiedText,
  copyLabel,
  copiedLabel,
  speakersLabel,
}: WorkshopCardProps) {
  const shareText = `${workshop.title} | ${workshop.date} ${workshop.time} at ${workshop.room} (${workshop.access})`;

  return (
    <motion.article
      id={`workshop-${index}`}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="techsauce-workshop-card"
      aria-label={`${workshop.title} (${workshop.date} ${workshop.time} at ${workshop.room})`}
    >
      {/* Top Metadata Row */}
      <div className="techsauce-card-top">
        <div className="techsauce-time-pill">
          <Calendar className="w-3 h-3 text-muted-foreground mr-1" />
          <span>{workshop.date} • {workshop.time}</span>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          <span className={`techsauce-room-pill ${getRoomBadgeClass(workshop.room)}`}>
            {workshop.room}
          </span>
          <span className={`techsauce-access-pill ${getAccessBadgeClass(workshop.access)}`}>
            {workshop.access}
          </span>
        </div>
      </div>

      {/* Workshop Title */}
      <h3 className="techsauce-workshop-title">{workshop.title}</h3>

      {/* Speakers */}
      {workshop.speakers && workshop.speakers.length > 0 ? (
        <div className="techsauce-speakers-wrap">
          <div className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-1.5 flex items-center gap-1">
            <Users className="w-3 h-3" />
            <span>{speakersLabel}</span>
          </div>
          <div className="space-y-2">
            {workshop.speakers.map((s, idx) => (
              <div key={idx} className="techsauce-speaker-item">
                <div className="techsauce-speaker-avatar">
                  {s.name.charAt(0)}
                </div>
                <div className="techsauce-speaker-info">
                  <div className="font-bold text-xs text-foreground">{s.name}</div>
                  <div className="text-[11px] text-muted-foreground">
                    {s.role} <span className="text-primary font-semibold">@ {s.company}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="techsauce-speakers-wrap">
          <div className="text-xs text-muted-foreground italic">
            Panel / Open Masterclass Session
          </div>
        </div>
      )}

      {/* Actions footer (Save button removed, Clean copy button only) */}
      <div className="techsauce-card-actions">
        <button
          id={`btn-copy-workshop-${index}`}
          type="button"
          onClick={() => onCopy(shareText)}
          className="techsauce-action-btn w-full justify-center"
          title={copyLabel}
          aria-label={`Copy details for ${workshop.title}`}
        >
          {copiedText === shareText ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-500" />
              <span className="text-emerald-500 font-semibold">{copiedLabel}</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-muted-foreground" />
              <span>{copyLabel}</span>
            </>
          )}
        </button>
      </div>
    </motion.article>
  );
}

/* ─────────────────────────────────────────────
   Component: Exhibitor Card
───────────────────────────────────────────── */
interface ExhibitorCardProps {
  index: number;
  exhibitor: Exhibitor;
  onCopy: (text: string) => void;
  copiedText: string | null;
  boothLabel: string;
  boothNotShownLabel: string;
  featuredAiLabel: string;
  copyTitle: string;
}

function ExhibitorCard({
  index,
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
    <article
      id={`exhibitor-${index}`}
      className={`techsauce-exhibitor-card ${isBotnoi ? 'botnoi-featured' : ''}`}
      aria-label={`${exhibitor.company} (${boothDisplay})`}
    >
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
        id={`btn-copy-exhibitor-${index}`}
        type="button"
        onClick={() => onCopy(`${exhibitor.company} (${boothDisplay})`)}
        className="techsauce-exhibitor-copy"
        title={copyTitle}
        aria-label={`Copy booth details for ${exhibitor.company}`}
      >
        {copiedText === `${exhibitor.company} (${boothDisplay})` ? (
          <Check className="w-3 h-3 text-emerald-500" />
        ) : (
          <Copy className="w-3 h-3" />
        )}
      </button>
    </article>
  );
}
