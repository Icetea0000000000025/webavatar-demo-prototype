import { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation, type TranslationKey } from "@/lib/LanguageContext";
import {
  Search,
  Plane,
  BedDouble,
  UtensilsCrossed,
  ShoppingBag,
  ChevronRight,
  Sparkles,
  FlaskConical,
  GraduationCap,
  Map,
  HeartPulse,
  Wrench,
  Coffee,
  Dumbbell,
  Clock,
  SlidersHorizontal,
  X,
  type LucideIcon,
} from "lucide-react";
import botnoiAirLogo from "../assets/BOTNOI-AIR-logo.png";
import botnoiRestaurantLogo from "../assets/BOTNOI-Restaurant-logo.png";
import AppFooter from "../components/AppFooter";

export type ProjectCategory = 
  | "education"
  | "skincare"
  | "map"
  | "hospital"
  | "restaurant"
  | "ac_service"
  | "coffee"
  | "fitness"
  | "flight"
  | "ecommerce"
  | "accommodation";

// House Item Interface
export interface HouseItem {
  id: number;
  code: string;
  name: string;
  style: string;
  type: ProjectCategory;
  color: string;
  progress: number;
  deployedUrl: string;
  githubUrl: string;
}

// Receipt & MenuItem Interfaces for Admin portal compatibility
export interface MenuItem {
  id: string;
  name: string;
  nameTh: string;
  nameEn: string;
  descTh: string;
  descEn: string;
  price: number;
  category: string;
}

export interface Receipt {
  orderId: string;
  orderedAt: string;
  items: Array<MenuItem & { quantity: number }>;
  subtotal: number;
  serviceFee: number;
  total: number;
}

// 20 Houses Mock Database mapped to Project Types and URLs
const projectData: HouseItem[] = [
  { id: -1, code: 'SANDBOX', name: 'Flight Demo', style: 'Interactive Sandbox', type: 'flight', color: '#0284c7', progress: 100, deployedUrl: '/flight-demo', githubUrl: '' },
  { id: -2, code: 'SANDBOX', name: 'IT Store Demo', style: 'Interactive Sandbox', type: 'ecommerce', color: '#6366F1', progress: 100, deployedUrl: '/it-store-demo', githubUrl: '' },
  { id: -3, code: 'SANDBOX', name: 'Botnoi Restaurant Food Order', style: 'Interactive Sandbox', type: 'restaurant', color: '#059669', progress: 100, deployedUrl: '/food-demo', githubUrl: '' },
  { id: -4, code: 'SANDBOX', name: 'Botnoi Grand Hotel & Resort', style: 'Interactive Sandbox', type: 'accommodation', color: '#f59e0b', progress: 100, deployedUrl: 'https://ai-learn-hub-22.lovable.app/', githubUrl: 'https://github.com/botnoi-demos/hotel-resort-sandbox' },
  { id: 1, code: 'TN01', name: '01-the-chill-crew', style: 'Modern Minimalist', type: 'education', color: '#6366F1', progress: 85, deployedUrl: 'https://ai-learn-hub-22.lovable.app/', githubUrl: 'https://github.com/Icetea0000000000025/ai-learn-hub-22.git  ' },
  { id: 2, code: 'TN02', name: '02-cozy-oracles', style: 'Neo-Classical', type: 'flight', color: '#b45309', progress: 45, deployedUrl: 'https://example.com', githubUrl: 'https://github.com' },
  { id: 3, code: 'TN03', name: '03-controller-kings', style: 'Nordic Timber', type: 'skincare', color: '#059669', progress: 90, deployedUrl: 'https://eucerin-mu.vercel.app/', githubUrl: 'https://github.com' },
  { id: 4, code: 'TN04', name: '04-the-netflix-hermits', style: 'Brutalist Concrete', type: 'map', color: '#1e293b', progress: 10, deployedUrl: 'https://trip-planner-botnoi.vercel.app/', githubUrl: 'https://github.com' },
  { id: 5, code: 'TN05', name: '05-aesthetic-dreamers', style: 'Cozy Wood Cabin', type: 'hospital', color: '#78350f', progress: 100, deployedUrl: 'https://hospital-health.lovable.app/', githubUrl: 'https://github.com' },
  { id: 6, code: 'TN06', name: '06-lo-fi-homebodies', style: 'Glass Contemporary', type: 'ecommerce', color: '#0284c7', progress: 60, deployedUrl: 'https://digital-friendly-companion.lovable.app/', githubUrl: 'https://github.com' },
  // Team 7 (Ours) - Lovable deployed app
  {
    id: 7,
    code: 'TN07',
    name: '07-steak-game-bros',
    style: 'Organic Earth Dome',
    type: 'restaurant',
    color: '#10B981',
    progress: 80,
    deployedUrl: 'https://ranlunggetdemo.vercel.app/',
    githubUrl: 'https://github.com/ran-lung-get/ran-lung-get-demo'
  },
  { id: 8, code: 'TN08', name: '08-vibe-architects', style: 'Industrial Brickwork', type: 'ecommerce', color: '#991b1b', progress: 75, deployedUrl: 'https://example.com', githubUrl: 'https://github.com' },
  { id: 9, code: 'TN09', name: '09-sunset-superfans', style: 'Japanese Zen', type: 'ecommerce', color: '#16a34a', progress: 100, deployedUrl: 'https://botnoi-live-speak.base44.app/', githubUrl: 'https://github.com' },
  { id: 10, code: 'TN10', name: '10-lazy-mermaids', style: 'Modular Container', type: 'ac_service', color: '#ca8a04', progress: 30, deployedUrl: 'https://b-grim-dashboard.vercel.app/', githubUrl: 'https://github.com' },
  { id: 11, code: 'TN11', name: '11-the-sharp-cuts', style: 'Mid-Century Gable', type: 'restaurant', color: '#475569', progress: 5, deployedUrl: 'https://example.com', githubUrl: 'https://github.com' },
  { id: 12, code: 'TN12', name: '12-coastal-avengers', style: 'Tropical Canopy', type: 'ecommerce', color: '#0d9488', progress: 95, deployedUrl: 'https://example.com', githubUrl: 'https://github.com' },
  { id: 13, code: 'TN13', name: '13-the-dungeon-masters', style: 'Step Architecture', type: 'accommodation', color: '#4338ca', progress: 55, deployedUrl: 'https://example.com', githubUrl: 'https://github.com' },
  { id: 14, code: 'TN14', name: '14-the-all-rounders', style: 'Atrium Courtyard', type: 'coffee', color: '#db2777', progress: 100, deployedUrl: 'https://botnoi-brewai-production.up.railway.app/', githubUrl: 'https://github.com' },
  { id: 15, code: 'TN15', name: '15-mountain-mode', style: 'Flat-Roof Minimal', type: 'restaurant', color: '#0f172a', progress: 15, deployedUrl: 'https://example.com', githubUrl: 'https://github.com' },
  { id: 16, code: 'TN16', name: '16-blue-hour-society', style: 'Modern Steel Frame', type: 'fitness', color: '#334155', progress: 70, deployedUrl: 'https://fitder-ai.vercel.app/', githubUrl: 'https://github.com' },
  { id: 17, code: 'TN17', name: '17-midnight-raiders', style: 'Spanish Terracotta', type: 'accommodation', color: '#c2410c', progress: 80, deployedUrl: 'https://example.com', githubUrl: 'https://github.com' },
  { id: 18, code: 'TN18', name: '18-indie-mountain-kids', style: 'Parametric Fluid', type: 'flight', color: '#06b6d4', progress: 0, deployedUrl: 'https://example.com', githubUrl: 'https://github.com' },
  { id: 19, code: 'TN19', name: '19-ocean-avengers', style: 'Victorian Restoration', type: 'restaurant', color: '#6d28d9', progress: 100, deployedUrl: 'https://example.com', githubUrl: 'https://github.com' },
  { id: 20, code: 'TN20', name: '20-final-boss-crew', style: 'Waterfront Living', type: 'ecommerce', color: '#0369a1', progress: 40, deployedUrl: 'https://example.com', githubUrl: 'https://github.com' }
];

// TN codes whose descriptions should be hidden/removed
const NO_DESC_CODES = new Set([
  'TN02', 'TN08', 'TN11', 'TN12', 'TN13', 'TN15', 'TN17', 'TN18', 'TN19', 'TN20'
]);

// Custom prompt description keys for active TN projects
const TN_CUSTOM_DESC_KEYS: Record<string, string> = {
  TN01: 'showcase.desc_tn01',
  TN03: 'showcase.desc_tn03',
  TN04: 'showcase.desc_tn04',
  TN05: 'showcase.desc_tn05',
  TN06: 'showcase.desc_tn06',
  TN07: 'showcase.desc_tn07',
  TN09: 'showcase.desc_tn09',
  TN10: 'showcase.desc_tn10',
  TN14: 'showcase.desc_tn14',
  TN16: 'showcase.desc_tn16',
};

const CATEGORY_STYLES: Record<string, { Icon: LucideIcon; bg: string }> = {
  education: { Icon: GraduationCap, bg: "bg-indigo-50 text-indigo-700 border-indigo-200/50" },
  skincare: { Icon: Sparkles, bg: "bg-pink-50 text-pink-700 border-pink-200/50" },
  map: { Icon: Map, bg: "bg-teal-50 text-teal-700 border-teal-200/50" },
  hospital: { Icon: HeartPulse, bg: "bg-rose-50 text-rose-700 border-rose-200/50" },
  restaurant: { Icon: UtensilsCrossed, bg: "bg-emerald-50 text-emerald-700 border-emerald-200/50" },
  ac_service: { Icon: Wrench, bg: "bg-cyan-50 text-cyan-700 border-cyan-200/50" },
  coffee: { Icon: Coffee, bg: "bg-amber-50 text-amber-800 border-amber-200/50" },
  fitness: { Icon: Dumbbell, bg: "bg-purple-50 text-purple-700 border-purple-200/50" },
  flight: { Icon: Plane, bg: "bg-sky-50 text-sky-700 border-sky-200/50" },
  ecommerce: { Icon: ShoppingBag, bg: "bg-blue-50 text-blue-700 border-blue-200/50" },
  accommodation: { Icon: BedDouble, bg: "bg-amber-50 text-amber-700 border-amber-200/50" },
};

function isHouseDeployed(house: HouseItem): boolean {
  return Boolean(
    house.deployedUrl &&
    house.deployedUrl.trim() !== "" &&
    house.deployedUrl.trim() !== "https://example.com",
  );
}

// ─── Shared card renderer ─────────────────────────────────────────────────────
function DemoCard({ house, t }: { house: HouseItem; t: (key: any) => string }) {
  const hasDeployed = isHouseDeployed(house);
  let typeLabel: string;
  let TypeIcon: LucideIcon = UtensilsCrossed;
  let typeBg = "bg-stone-50 text-stone-600 border-stone-200";
  let cardDescription = "";
  let displayName = house.name;

  if (house.id === -1) {
    typeLabel = t("showcase.type_flight");
    TypeIcon = Plane;
    typeBg = "bg-blue-50 text-blue-700 border-blue-200/50";
    cardDescription = t("showcase.desc_flight");
    displayName = t("showcase.flight_demo_name");
  } else if (house.id === -2) {
    typeLabel = t("showcase.type_ecommerce");
    TypeIcon = ShoppingBag;
    typeBg = "bg-indigo-50 text-indigo-700 border-indigo-200/50";
    cardDescription = t("showcase.desc_ecommerce");
    displayName = t("showcase.itstore_demo_name");
  } else if (house.id === -3) {
    typeLabel = t("showcase.type_restaurant");
    TypeIcon = UtensilsCrossed;
    typeBg = "bg-emerald-50 text-emerald-700 border-emerald-200/50";
    cardDescription = t("showcase.desc_restaurant");
    displayName = t("food.title");
  } else if (house.id === -4) {
    typeLabel = t("showcase.type_accommodation");
    TypeIcon = BedDouble;
    typeBg = "bg-amber-50 text-amber-700 border-amber-200/50";
    cardDescription = t("showcase.desc_accommodation");
    displayName = t("showcase.hotel_demo_name");
  } else {
    if (TN_CUSTOM_DESC_KEYS[house.code]) {
      cardDescription = t(TN_CUSTOM_DESC_KEYS[house.code] as any);
    } else if (!NO_DESC_CODES.has(house.code)) {
      cardDescription = t(`showcase.desc_${house.type}` as any);
    }

    if (!hasDeployed) {
      typeLabel = t("showcase.type_pending");
      TypeIcon = Clock;
      typeBg = "bg-stone-50 text-stone-500 border-stone-200/50";
    } else {
      typeLabel = t(`showcase.type_${house.type}` as any);
      if (CATEGORY_STYLES[house.type]) {
        TypeIcon = CATEGORY_STYLES[house.type].Icon;
        typeBg = CATEGORY_STYLES[house.type].bg;
      }
    }
  }

  const cardId = house.id < 0
    ? `card-sandbox-${house.id === -1 ? 'flight' : house.id === -2 ? 'itstore' : house.id === -3 ? 'food' : 'hotel'}`
    : `card-${house.code.toLowerCase()}`;

  return (
    <motion.article
      key={house.id}
      id={cardId}
      aria-label={`${house.code}: ${displayName}`}
      className="bg-card border border-border rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group relative overflow-hidden"
      style={{ borderTop: `4px solid ${house.color || '#38bdf8'}` }}
      whileHover={{ y: -4, scale: 1.01 }}
    >
      <div>
        {/* Top header: Logo / Icon + Tag Badges + House Code */}
        <div className="flex items-center justify-between gap-2.5 mb-4">
          <div className="flex items-center gap-2 min-w-0 overflow-hidden">
            <div className="w-10 h-10 rounded-2xl bg-muted/40 border border-border flex items-center justify-center p-2 shadow-xs group-hover:scale-105 transition-transform shrink-0">
              {house.id === -1 ? (
                <img src={botnoiAirLogo} alt="BotnoiAir" className="w-full h-full object-contain" />
              ) : house.id === -3 ? (
                <img src={botnoiRestaurantLogo} alt="Botnoi Restaurant" className="w-full h-full object-contain" />
              ) : (
                <TypeIcon className="size-5 text-primary shrink-0" />
              )}
            </div>
            <span className={`text-[10px] font-black tracking-wider uppercase px-2.5 py-1 rounded-full border flex items-center gap-1.5 truncate ${typeBg}`}>
              {typeLabel}
            </span>
          </div>
          <span className="text-xs font-black text-foreground font-mono bg-muted/50 px-2 py-0.5 rounded-lg border border-border shrink-0">
            {house.code}
          </span>
        </div>

        {/* Title & Description */}
        <div className="mb-5">
          <h3 className="text-lg font-black text-foreground mb-2 group-hover:text-primary transition-colors font-mono tracking-tight truncate">
            {displayName}
          </h3>
          <p
            className="text-xs text-muted-foreground leading-relaxed min-h-[4.5rem] max-h-[4.5rem] overflow-hidden group-hover:overflow-y-auto line-clamp-3 group-hover:line-clamp-none transition-all pr-1 cursor-text"
            style={{ scrollbarWidth: 'thin' }}
          >
            {cardDescription}
          </p>
        </div>
      </div>

      {/* Action Link Footer */}
      <div className="flex items-center gap-3 pt-3.5 border-t border-border">
        {hasDeployed ? (
          house.deployedUrl.startsWith('/') ? (
            <Link
              to={house.deployedUrl}
              aria-label={`${t('showcase.launch_demo')} - ${house.code} ${displayName}`}
              className="flex-1 text-center py-3 text-xs font-extrabold rounded-xl border transition-all cursor-pointer flex items-center justify-center gap-1.5 bg-cta hover:bg-cta/90 border-cta text-cta-foreground shadow-sm shadow-cta/10"
            >
              <span>{t('showcase.launch_demo')}</span>
              <ChevronRight className="size-3.5" />
            </Link>
          ) : (
            <a
              href={house.deployedUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${t('showcase.launch_demo')} - ${house.code} ${displayName}`}
              className="flex-1 text-center py-3 text-xs font-extrabold rounded-xl border transition-all cursor-pointer flex items-center justify-center gap-1.5 bg-cta hover:bg-cta/90 border-cta text-cta-foreground shadow-sm shadow-cta/10"
            >
              <span>{t('showcase.launch_demo')}</span>
              <ChevronRight className="size-3.5" />
            </a>
          )
        ) : (
          <button
            disabled
            aria-disabled="true"
            aria-label={`${t('showcase.launch_demo')} - ${house.code} ${displayName} (Unavailable)`}
            className="flex-1 text-center py-3 text-xs font-extrabold rounded-xl border transition-all flex items-center justify-center gap-1.5 bg-muted/30 border-border text-muted-foreground/50 cursor-not-allowed opacity-60"
          >
            <span>{t('showcase.launch_demo')}</span>
            <ChevronRight className="size-3.5" />
          </button>
        )}
      </div>
    </motion.article>
  );
}

// ─── Page Component ───────────────────────────────────────────────────────────
export default function OrderDemo() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const [statusFilter, setStatusFilter] = useState<"all" | "deployed" | "pending">("all");
  const [sortBy, setSortBy] = useState<"code" | "progress">("code");
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  // Split filtered results into two groups and apply filters/sorting
  const { sandboxDemos, projectDemos } = useMemo(() => {
    const allFiltered = projectData.filter(house => {
      let overviewText = "";
      if (house.id === -1) {
        overviewText = t("showcase.desc_flight");
      } else if (house.id === -2) {
        overviewText = t("showcase.desc_ecommerce");
      } else if (house.id === -3) {
        overviewText = `${t("food.title")} ${t("showcase.desc_restaurant")}`;
      } else if (house.id === -4) {
        overviewText = t("showcase.desc_accommodation");
      } else if (TN_CUSTOM_DESC_KEYS[house.code]) {
        overviewText = t(TN_CUSTOM_DESC_KEYS[house.code] as any);
      } else if (!NO_DESC_CODES.has(house.code)) {
        overviewText = t(`showcase.desc_${house.type}` as any);
      }

      const matchesSearch =
        house.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        house.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        overviewText.toLowerCase().includes(searchQuery.toLowerCase()) ||
        house.style.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = selectedCategory === "all" || house.type === selectedCategory;

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "deployed" && isHouseDeployed(house)) ||
        (statusFilter === "pending" && !isHouseDeployed(house));

      return matchesSearch && matchesCategory && matchesStatus;
    });

    const sandboxes = allFiltered.filter(h => h.code === 'SANDBOX');
    const projects = allFiltered.filter(h => h.code !== 'SANDBOX');

    // Apply sorting to project demos
    if (sortBy === "progress") {
      projects.sort((a, b) => b.progress - a.progress || a.id - b.id);
    } else {
      projects.sort((a, b) => a.id - b.id);
    }

    return {
      sandboxDemos: sandboxes,
      projectDemos: projects,
    };
  }, [searchQuery, selectedCategory, statusFilter, sortBy, t]);

  const totalResults = sandboxDemos.length + projectDemos.length;

  useEffect(() => {
    if (!isFilterModalOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsFilterModalOpen(false);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isFilterModalOpen]);

  useEffect(() => {
    if (isFilterModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isFilterModalOpen]);

  return (
    <div
      className="min-h-[calc(100vh-68px)] w-full flex flex-col pb-10 selection:bg-primary selection:text-primary-foreground relative z-10"
      aria-label="All Demos Showcase Portal"
    >
      {/* Search & Filtering Controls */}
      <section className="max-w-7xl mx-auto w-full px-4 md:px-8 mt-4" aria-label="Search and Filter Demos" id="search-filter-section">
        <div className="flex flex-col gap-4 bg-card/70 backdrop-blur-md border border-border/80 p-4 rounded-3xl shadow-sm">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 w-full">
            {/* Search Input */}
            <div className="relative w-full lg:max-w-xs shrink-0">
              <label htmlFor="demo-search-input" className="sr-only">
                {t('showcase.search_placeholder')}
              </label>
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <input
                id="demo-search-input"
                name="searchQuery"
                type="text"
                aria-label={t('showcase.search_placeholder')}
                placeholder={t('showcase.search_placeholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-muted/30 border border-border focus:border-primary rounded-2xl text-xs font-bold text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-mono"
              />
            </div>

            {/* Quick Filters (Middle - Scrollable) */}
            <div className="flex flex-nowrap items-center justify-start gap-1.5 overflow-x-auto min-w-0 py-1 flex-1 mx-2 scroll-smooth select-none" style={{ scrollbarWidth: "thin" }}>
              {[
                { id: "all", translationKey: "showcase.cat_all" as const, icon: Sparkles },
                { id: "accommodation", translationKey: "showcase.cat_accommodation" as const, icon: BedDouble },
                { id: "education", translationKey: "showcase.cat_education" as const, icon: GraduationCap },
                { id: "skincare", translationKey: "showcase.cat_skincare" as const, icon: Sparkles },
                { id: "map", translationKey: "showcase.cat_map" as const, icon: Map },
                { id: "hospital", translationKey: "showcase.cat_hospital" as const, icon: HeartPulse },
                { id: "restaurant", translationKey: "showcase.cat_restaurant" as const, icon: UtensilsCrossed },
                { id: "ac_service", translationKey: "showcase.cat_ac_service" as const, icon: Wrench },
                { id: "coffee", translationKey: "showcase.cat_coffee" as const, icon: Coffee },
                { id: "fitness", translationKey: "showcase.cat_fitness" as const, icon: Dumbbell },
                { id: "flight", translationKey: "showcase.cat_flight" as const, icon: Plane },
                { id: "ecommerce", translationKey: "showcase.cat_ecommerce" as const, icon: ShoppingBag },
              ].map((cat) => {
                const isActive = selectedCategory === cat.id;
                const Icon = cat.icon;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-3 py-1.5 rounded-xl text-[11px] font-extrabold transition-all flex items-center gap-1.5 cursor-pointer border shrink-0 ${
                      isActive
                        ? "bg-primary text-primary-foreground border-primary shadow-xs"
                        : "text-muted-foreground bg-muted/30 hover:bg-muted/50 hover:text-foreground border-border"
                    }`}
                  >
                    <Icon className="size-3.5 shrink-0" />
                    <span>{t(cat.translationKey as TranslationKey)}</span>
                  </button>
                );
              })}
            </div>

            {/* Filter Toggle Button */}
            <button
              onClick={() => setIsFilterModalOpen(true)}
              className="px-4 py-2.5 rounded-2xl bg-muted/30 border border-border hover:bg-muted/50 hover:text-foreground text-foreground text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0 font-mono"
              id="filter-modal-trigger"
            >
              <SlidersHorizontal className="size-4 text-primary" />
              <span>{t('showcase.filter')}</span>
              {(selectedCategory !== "all" || statusFilter !== "all" || sortBy !== "code") && (
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              )}
            </button>
          </div>

          {/* Active Filter Tags */}
          {(selectedCategory !== "all" || statusFilter !== "all" || sortBy !== "code") && (
            <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-border/40 w-full min-w-0" id="active-filter-tags">
              <span className="text-[10px] font-black text-muted-foreground uppercase tracking-wider mr-1 font-mono">
                {t('showcase.active_filters')}
              </span>
              {selectedCategory !== "all" && (
                <span className="px-3 py-1 rounded-xl text-[10px] font-extrabold bg-primary/10 text-primary border border-primary/20 flex items-center gap-1">
                  {t('showcase.category')}: {t(`showcase.cat_${selectedCategory}` as any)}
                  <button
                    onClick={() => setSelectedCategory("all")}
                    className="hover:text-foreground ml-0.5 text-xs font-black cursor-pointer"
                    aria-label="Remove category filter"
                  >
                    ✕
                  </button>
                </span>
              )}
              {statusFilter !== "all" && (
                <span className="px-3 py-1 rounded-xl text-[10px] font-extrabold bg-primary/10 text-primary border border-primary/20 flex items-center gap-1">
                  {t('showcase.status')}: {statusFilter === "deployed" ? t('showcase.status_deployed') : t('showcase.status_in_progress')}
                  <button
                    onClick={() => setStatusFilter("all")}
                    className="hover:text-foreground ml-0.5 text-xs font-black cursor-pointer"
                    aria-label="Remove status filter"
                  >
                    ✕
                  </button>
                </span>
              )}
              {sortBy !== "code" && (
                <span className="px-3 py-1 rounded-xl text-[10px] font-extrabold bg-primary/10 text-primary border border-primary/20 flex items-center gap-1">
                  {t('showcase.sort')}: {sortBy === "progress" ? t('showcase.sort_progress') : t('showcase.sort_code')}
                  <button
                    onClick={() => setSortBy("code")}
                    className="hover:text-foreground ml-0.5 text-xs font-black cursor-pointer"
                    aria-label="Remove sort order"
                  >
                    ✕
                  </button>
                </span>
              )}
              <button
                onClick={() => {
                  setSelectedCategory("all");
                  setStatusFilter("all");
                  setSortBy("code");
                }}
                className="text-[10px] font-black text-muted-foreground hover:text-primary transition-colors cursor-pointer ml-1 font-mono"
              >
                {t('showcase.clear_all')}
              </button>
            </div>
          )}
        </div>
      </section>

      <main className="max-w-7xl mx-auto w-full px-4 md:px-8 mt-8 mb-66 flex-1 space-y-12" aria-label="All Demo Projects" id="all-demos-main">
        {totalResults === 0 ? (
          /* Empty state */
          <div className="text-center py-20 bg-card border border-border rounded-3xl p-8 max-w-md mx-auto shadow-sm">
            <div className="w-16 h-16 bg-muted/40 rounded-full flex items-center justify-center mx-auto mb-4 border border-border">
              <Search className="size-6 text-muted-foreground" />
            </div>
            <h3 className="text-sm font-bold text-foreground mb-1">
              {t('showcase.no_projects')}
            </h3>
            <p className="text-xs text-muted-foreground font-bold">
              {t('showcase.no_projects_desc')}
            </p>
          </div>
        ) : (
          <>
            {/* ── Section 1: Sandbox Demos ───────────────────────────────── */}
            {sandboxDemos.length > 0 && (
              <section aria-label="Sandbox Demos" id="sandbox-demos-section">
                <div className="flex items-center gap-2.5 mb-5">
                  <FlaskConical className="size-4 text-primary shrink-0" />
                  <h2 className="text-xs font-black text-primary uppercase tracking-widest font-mono leading-none m-0 p-0 flex items-center">
                    {t('showcase.sandbox_demos' as any)}
                  </h2>
                  <span className="text-[10px] font-black text-muted-foreground bg-muted/40 border border-border px-2 py-0.5 rounded-full font-mono inline-flex items-center justify-center leading-none">
                    {sandboxDemos.length}
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {sandboxDemos.map(house => (
                    <DemoCard key={house.id} house={house} t={t} />
                  ))}
                </div>
              </section>
            )}

            {/* ── Section 2: TN Student Projects ────────────────────────── */}
            {projectDemos.length > 0 && (
              <section aria-label="TN Student Projects" id="tn-student-projects-section">
                <div className="flex items-center gap-2.5 mb-5">
                  <Sparkles className="size-4 text-primary shrink-0" />
                  <h2 className="text-xs font-black text-primary uppercase tracking-widest font-mono leading-none m-0 p-0 flex items-center">
                    {t('showcase.student_projects')}
                  </h2>
                  <span className="text-[10px] font-black text-muted-foreground bg-muted/40 border border-border px-2 py-0.5 rounded-full font-mono inline-flex items-center justify-center leading-none">
                    {projectDemos.length}
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {projectDemos.map(house => (
                    <DemoCard key={house.id} house={house} t={t} />
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </main>

      {/* 3. Filter & Sort Modal */}
      <AnimatePresence>
        {isFilterModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFilterModalOpen(false)}
              className="absolute inset-0 bg-background/80 backdrop-blur-md cursor-pointer"
            />

            {/* Modal Dialog Panel */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: "spring", duration: 0.4 }}
              className="relative w-full max-w-lg bg-card border border-border rounded-3xl shadow-2xl p-6 overflow-hidden max-h-[90vh] flex flex-col z-10"
              id="filter-modal-dialog"
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-border/60">
                <h2 className="text-sm font-black text-foreground tracking-tight flex items-center gap-2">
                  <SlidersHorizontal className="size-4 text-primary" />
                  <span>
                    {t('showcase.filters_sorting')}
                  </span>
                </h2>
                <button
                  onClick={() => setIsFilterModalOpen(false)}
                  className="p-1.5 rounded-xl hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                  aria-label="Close filters modal"
                >
                  <X className="size-4" />
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto py-5 space-y-6 pr-1" style={{ scrollbarWidth: 'thin' }}>
                {/* 1. Sort By */}
                <div className="space-y-2.5">
                  <h3 className="text-xs font-black text-muted-foreground uppercase tracking-widest font-mono">
                    {t('showcase.sort_by')}
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: "code", label: t('showcase.sort_code_label') },
                      { id: "progress", label: t('showcase.sort_progress_label') },
                    ].map((opt) => {
                      const active = sortBy === opt.id;
                      return (
                        <button
                          key={opt.id}
                          onClick={() => setSortBy(opt.id as any)}
                          className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer text-center ${
                            active
                              ? "bg-primary text-primary-foreground border-primary shadow-xs"
                              : "bg-muted/20 border-border text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                          }`}
                        >
                          {opt.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Project Status */}
                <div className="space-y-2.5">
                  <h3 className="text-xs font-black text-muted-foreground uppercase tracking-widest font-mono">
                    {t('showcase.project_status')}
                  </h3>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: "all", label: t('showcase.status_all') },
                      { id: "deployed", label: t('showcase.status_deployed') },
                      { id: "pending", label: t('showcase.status_in_progress') },
                    ].map((opt) => {
                      const active = statusFilter === opt.id;
                      return (
                        <button
                          key={opt.id}
                          onClick={() => setStatusFilter(opt.id as any)}
                          className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer text-center ${
                            active
                              ? "bg-primary text-primary-foreground border-primary shadow-xs"
                              : "bg-muted/20 border-border text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                          }`}
                        >
                          {opt.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 3. Project Category */}
                <div className="space-y-2.5">
                  <h3 className="text-xs font-black text-muted-foreground uppercase tracking-widest font-mono">
                    {t('showcase.project_category')}
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {[
                      { id: "all", translationKey: "showcase.cat_all" as const, icon: Sparkles },
                      { id: "education", translationKey: "showcase.cat_education" as const, icon: GraduationCap },
                      { id: "skincare", translationKey: "showcase.cat_skincare" as const, icon: Sparkles },
                      { id: "map", translationKey: "showcase.cat_map" as const, icon: Map },
                      { id: "hospital", translationKey: "showcase.cat_hospital" as const, icon: HeartPulse },
                      { id: "restaurant", translationKey: "showcase.cat_restaurant" as const, icon: UtensilsCrossed },
                      { id: "ac_service", translationKey: "showcase.cat_ac_service" as const, icon: Wrench },
                      { id: "coffee", translationKey: "showcase.cat_coffee" as const, icon: Coffee },
                      { id: "fitness", translationKey: "showcase.cat_fitness" as const, icon: Dumbbell },
                      { id: "flight", translationKey: "showcase.cat_flight" as const, icon: Plane },
                      { id: "ecommerce", translationKey: "showcase.cat_ecommerce" as const, icon: ShoppingBag },
                    ].map((cat) => {
                      const active = selectedCategory === cat.id;
                      const Icon = cat.icon;
                      return (
                        <button
                          key={cat.id}
                          onClick={() => setSelectedCategory(cat.id)}
                          className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center justify-center gap-2 ${
                            active
                              ? "bg-primary text-primary-foreground border-primary shadow-xs"
                              : "bg-muted/20 border-border text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                          }`}
                        >
                          <Icon className="size-3.5 shrink-0" />
                          <span className="truncate">{t(cat.translationKey as TranslationKey)}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="pt-4 border-t border-border/60 flex items-center gap-3">
                <button
                  onClick={() => {
                    setSelectedCategory("all");
                    setStatusFilter("all");
                    setSortBy("code");
                  }}
                  disabled={selectedCategory === "all" && statusFilter === "all" && sortBy === "code"}
                  className="px-4 py-2.5 rounded-xl border border-border text-foreground hover:bg-muted disabled:opacity-40 disabled:hover:bg-transparent text-xs font-bold transition-all cursor-pointer flex-1 text-center"
                >
                  {t('showcase.reset_all')}
                </button>
                <button
                  onClick={() => setIsFilterModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-cta hover:bg-cta/90 text-cta-foreground text-xs font-extrabold transition-all cursor-pointer flex-1 text-center shadow-md shadow-cta/15"
                >
                  {`OK (${totalResults})`}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AppFooter />
    </div>
  );
}
