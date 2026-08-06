import { useState, useMemo, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation, type TranslationKey } from "@/lib/LanguageContext";
import {
  Search,
  Plane,
  BedDouble,
  UtensilsCrossed,
  ShoppingBag,
  ChevronLeft,
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
  { id: -2, code: 'SANDBOX', name: 'IT Store Demo', style: 'Interactive Sandbox', type: 'ecommerce', color: '#0284c7', progress: 100, deployedUrl: '/it-store-demo', githubUrl: '' },
  { id: -3, code: 'SANDBOX', name: 'Botnoi Restaurant Food Order', style: 'Interactive Sandbox', type: 'restaurant', color: '#0284c7', progress: 100, deployedUrl: '/food-demo', githubUrl: '' },
  { id: -4, code: 'SANDBOX', name: 'Botnoi Grand Hotel & Resort', style: 'Interactive Sandbox', type: 'accommodation', color: '#0284c7', progress: 100, deployedUrl: 'https://botnoi-hotel-two.vercel.app/', githubUrl: 'https://github.com/botnoi-demos/hotel-resort-sandbox' },
  { id: 1, code: 'TN01', name: 'LearnLab', style: 'Modern Minimalist', type: 'education', color: '#0284c7', progress: 85, deployedUrl: 'https://ai-learn-hub-22.lovable.app/', githubUrl: 'https://github.com/Icetea0000000000025/ai-learn-hub-22.git  ' },
  { id: 2, code: 'TN02', name: '', style: 'Neo-Classical', type: 'flight', color: '#0284c7', progress: 45, deployedUrl: 'https://example.com', githubUrl: 'https://github.com' },
  { id: 3, code: 'TN03', name: 'Skinbot', style: 'Nordic Timber', type: 'skincare', color: '#0284c7', progress: 90, deployedUrl: 'https://eucerin-mu.vercel.app/', githubUrl: 'https://github.com' },
  { id: 4, code: 'TN04', name: 'AI Trip Map Planner', style: 'Brutalist Concrete', type: 'map', color: '#0284c7', progress: 10, deployedUrl: 'https://trip-planner-botnoi.vercel.app/', githubUrl: 'https://github.com' },
  { id: 5, code: 'TN05', name: 'SamitiveJ', style: 'Cozy Wood Cabin', type: 'hospital', color: '#0284c7', progress: 100, deployedUrl: 'https://hospital-health.lovable.app/', githubUrl: 'https://github.com' },
  { id: 6, code: 'TN06', name: 'Botnoi API', style: 'Glass Contemporary', type: 'ecommerce', color: '#0284c7', progress: 60, deployedUrl: 'https://digital-friendly-companion.lovable.app/', githubUrl: 'https://github.com' },
  // Team 7 (Ours) - Lovable deployed app
  {
    id: 7,
    code: 'TN07',
    name: 'Ran-lung-get',
    style: 'Organic Earth Dome',
    type: 'restaurant',
    color: '#0284c7',
    progress: 80,
    deployedUrl: 'https://ranlunggetdemo.vercel.app/',
    githubUrl: 'https://github.com/ran-lung-get/ran-lung-get-demo'
  },
  { id: 8, code: 'TN08', name: 'Chevi Shop', style: 'Industrial Brickwork', type: 'ac_service', color: '#0284c7', progress: 75, deployedUrl: 'https://chevi-shop.netlify.app/', githubUrl: 'https://github.com' },
  { id: 9, code: 'TN09', name: 'Botnoi Live Translate', style: 'Japanese Zen', type: 'ecommerce', color: '#0284c7', progress: 100, deployedUrl: 'https://botnoi-live-speak.base44.app/', githubUrl: 'https://github.com' },
  { id: 10, code: 'TN10', name: 'CoolCare Pro', style: 'Modular Container', type: 'ac_service', color: '#0284c7', progress: 30, deployedUrl: 'https://b-grim-dashboard.vercel.app/', githubUrl: 'https://github.com' },
  { id: 11, code: 'TN11', name: 'MediQ', style: 'Mid-Century Gable', type: 'hospital', color: '#0284c7', progress: 80, deployedUrl: 'https://mediq-demo.vercel.app/', githubUrl: 'https://github.com' },
  { id: 12, code: 'TN12', name: 'Homiq(Arex-platform)', style: 'Tropical Canopy', type: 'accommodation', color: '#0284c7', progress: 95, deployedUrl: 'https://arex-platform.lovable.app/', githubUrl: 'https://github.com' },
  { id: 13, code: 'TN13', name: '', style: 'Step Architecture', type: 'accommodation', color: '#0284c7', progress: 55, deployedUrl: 'https://example.com', githubUrl: 'https://github.com' },
  { id: 14, code: 'TN14', name: 'BrewAI', style: 'Atrium Courtyard', type: 'coffee', color: '#0284c7', progress: 100, deployedUrl: 'https://botnoi-brewai-production.up.railway.app/', githubUrl: 'https://github.com' },
  { id: 15, code: 'TN15', name: 'Glow Med Spa', style: 'Flat-Roof Minimal', type: 'fitness', color: '#0284c7', progress: 15, deployedUrl: 'https://medspa-booking-buddy.lovable.app/', githubUrl: 'https://github.com' },
  { id: 16, code: 'TN16', name: 'Fitder', style: 'Modern Steel Frame', type: 'fitness', color: '#0284c7', progress: 70, deployedUrl: 'https://fitder-ai.vercel.app/', githubUrl: 'https://github.com' },
  { id: 17, code: 'TN17', name: 'AI Commerce Agent', style: 'Spanish Terracotta', type: 'ecommerce', color: '#0284c7', progress: 80, deployedUrl: 'https://ai-e-commerce-brown.vercel.app/', githubUrl: 'https://github.com' },
  { id: 18, code: 'TN18', name: '18-indie-mountain-kids', style: 'Parametric Fluid', type: 'flight', color: '#0284c7', progress: 0, deployedUrl: 'https://example.com', githubUrl: 'https://github.com' },
  { id: 19, code: 'TN19', name: '19-ocean-avengers', style: 'Victorian Restoration', type: 'ac_service', color: '#0284c7', progress: 100, deployedUrl: '', githubUrl: 'https://github.com' },
  { id: 20, code: 'TN20', name: '', style: 'Waterfront Living', type: 'ecommerce', color: '#0284c7', progress: 40, deployedUrl: 'https://example.com', githubUrl: 'https://github.com' }
];

// TN codes whose descriptions should be hidden/removed
const NO_DESC_CODES = new Set([
  'TN02', 'TN13', 'TN18', 'TN20'
]);

// Custom prompt description keys for active TN projects
const TN_CUSTOM_DESC_KEYS: Record<string, string> = {
  TN01: 'showcase.desc_tn01',
  TN03: 'showcase.desc_tn03',
  TN04: 'showcase.desc_tn04',
  TN05: 'showcase.desc_tn05',
  TN06: 'showcase.desc_tn06',
  TN07: 'showcase.desc_tn07',
  TN08: 'showcase.desc_tn08',
  TN09: 'showcase.desc_tn09',
  TN10: 'showcase.desc_tn10',
  TN11: 'showcase.desc_tn11',
  TN12: 'showcase.desc_tn12',
  TN14: 'showcase.desc_tn14',
  TN15: 'showcase.desc_tn15',
  TN16: 'showcase.desc_tn16',
  TN17: 'showcase.desc_tn17',
  TN19: 'showcase.desc_tn19',
};

const TN_TYPE_KEYS: Record<string, string> = {
  TN01: 'showcase.type_tn01',
  TN03: 'showcase.type_tn03',
  TN04: 'showcase.type_tn04',
  TN05: 'showcase.type_tn05',
  TN06: 'showcase.type_tn06',
  TN08: 'showcase.type_tn08',
  TN10: 'showcase.type_tn10',
  TN11: 'showcase.type_tn11',
  TN12: 'showcase.type_tn12',
  TN14: 'showcase.type_tn14',
  TN15: 'showcase.type_tn15',
  TN16: 'showcase.type_tn16',
  TN17: 'showcase.type_tn17',
  TN19: 'showcase.type_tn19',
};

const CATEGORY_STYLES: Record<string, { Icon: LucideIcon; bg: string }> = {
  education: { Icon: GraduationCap, bg: "bg-indigo-50 text-indigo-700 border-indigo-200/50 dark:bg-indigo-950/80 dark:text-indigo-300 dark:border-indigo-800/80" },
  skincare: { Icon: Sparkles, bg: "bg-pink-50 text-pink-700 border-pink-200/50 dark:bg-pink-950/80 dark:text-pink-300 dark:border-pink-800/80" },
  map: { Icon: Map, bg: "bg-teal-50 text-teal-700 border-teal-200/50 dark:bg-teal-950/80 dark:text-teal-300 dark:border-teal-800/80" },
  hospital: { Icon: HeartPulse, bg: "bg-rose-50 text-rose-700 border-rose-200/50 dark:bg-rose-950/80 dark:text-rose-300 dark:border-rose-800/80" },
  restaurant: { Icon: UtensilsCrossed, bg: "bg-emerald-50 text-emerald-700 border-emerald-200/50 dark:bg-emerald-950/80 dark:text-emerald-300 dark:border-emerald-800/80" },
  ac_service: { Icon: Wrench, bg: "bg-cyan-50 text-cyan-700 border-cyan-200/50 dark:bg-cyan-950/80 dark:text-cyan-300 dark:border-cyan-800/80" },
  coffee: { Icon: Coffee, bg: "bg-amber-50 text-amber-800 border-amber-200/50 dark:bg-amber-950/80 dark:text-amber-300 dark:border-amber-800/80" },
  fitness: { Icon: Dumbbell, bg: "bg-purple-50 text-purple-700 border-purple-200/50 dark:bg-purple-950/80 dark:text-purple-300 dark:border-purple-800/80" },
  flight: { Icon: Plane, bg: "bg-sky-50 text-sky-700 border-sky-200/50 dark:bg-sky-950/80 dark:text-sky-300 dark:border-sky-800/80" },
  ecommerce: { Icon: ShoppingBag, bg: "bg-blue-50 text-blue-700 border-blue-200/50 dark:bg-blue-950/80 dark:text-blue-300 dark:border-blue-800/80" },
  accommodation: { Icon: BedDouble, bg: "bg-amber-50 text-amber-700 border-amber-200/50 dark:bg-amber-950/80 dark:text-amber-300 dark:border-amber-800/80" },
};

const CATEGORY_COLOR_MAP: Record<
  string,
  {
    active: string;
    hover: string;
  }
> = {
  all: {
    active: "bg-sky-500 text-white border-sky-500 shadow-md shadow-sky-500/25 dark:bg-sky-900/80 dark:text-sky-100 dark:border-sky-500/60 dark:shadow-sky-950/40",
    hover: "hover:bg-sky-500/15 hover:text-sky-600 dark:hover:text-sky-400 hover:border-sky-400/60 hover:shadow-sm hover:shadow-sky-500/15",
  },
  accommodation: {
    active: "bg-amber-500 text-white border-amber-500 shadow-md shadow-amber-500/25 dark:bg-amber-900/80 dark:text-amber-100 dark:border-amber-500/60 dark:shadow-amber-950/40",
    hover: "hover:bg-amber-500/15 hover:text-amber-600 dark:hover:text-amber-400 hover:border-amber-400/60 hover:shadow-sm hover:shadow-amber-500/15",
  },
  education: {
    active: "bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-600/25 dark:bg-indigo-900/80 dark:text-indigo-100 dark:border-indigo-500/60 dark:shadow-indigo-950/40",
    hover: "hover:bg-indigo-500/15 hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-400/60 hover:shadow-sm hover:shadow-indigo-500/15",
  },
  skincare: {
    active: "bg-pink-500 text-white border-pink-500 shadow-md shadow-pink-500/25 dark:bg-pink-900/80 dark:text-pink-100 dark:border-pink-500/60 dark:shadow-pink-950/40",
    hover: "hover:bg-pink-500/15 hover:text-pink-600 dark:hover:text-pink-400 hover:border-pink-400/60 hover:shadow-sm hover:shadow-pink-500/15",
  },
  map: {
    active: "bg-teal-500 text-white border-teal-500 shadow-md shadow-teal-500/25 dark:bg-teal-900/80 dark:text-teal-100 dark:border-teal-500/60 dark:shadow-teal-950/40",
    hover: "hover:bg-teal-500/15 hover:text-teal-600 dark:hover:text-teal-400 hover:border-teal-400/60 hover:shadow-sm hover:shadow-teal-500/15",
  },
  hospital: {
    active: "bg-rose-500 text-white border-rose-500 shadow-md shadow-rose-500/25 dark:bg-rose-900/80 dark:text-rose-100 dark:border-rose-500/60 dark:shadow-rose-950/40",
    hover: "hover:bg-rose-500/15 hover:text-rose-600 dark:hover:text-rose-400 hover:border-rose-400/60 hover:shadow-sm hover:shadow-rose-500/15",
  },
  restaurant: {
    active: "bg-emerald-500 text-white border-emerald-500 shadow-md shadow-emerald-500/25 dark:bg-emerald-900/80 dark:text-emerald-100 dark:border-emerald-500/60 dark:shadow-emerald-950/40",
    hover: "hover:bg-emerald-500/15 hover:text-emerald-600 dark:hover:text-emerald-400 hover:border-emerald-400/60 hover:shadow-sm hover:shadow-emerald-500/15",
  },
  ac_service: {
    active: "bg-cyan-500 text-white border-cyan-500 shadow-md shadow-cyan-500/25 dark:bg-cyan-900/80 dark:text-cyan-100 dark:border-cyan-500/60 dark:shadow-cyan-950/40",
    hover: "hover:bg-cyan-500/15 hover:text-cyan-600 dark:hover:text-cyan-400 hover:border-cyan-400/60 hover:shadow-sm hover:shadow-cyan-500/15",
  },
  coffee: {
    active: "bg-amber-700 text-white border-amber-700 shadow-md shadow-amber-700/25 dark:bg-amber-900/80 dark:text-amber-100 dark:border-amber-600/60 dark:shadow-amber-950/40",
    hover: "hover:bg-amber-700/15 hover:text-amber-800 dark:hover:text-amber-400 hover:border-amber-600/60 hover:shadow-sm hover:shadow-amber-700/15",
  },
  fitness: {
    active: "bg-purple-600 text-white border-purple-600 shadow-md shadow-purple-600/25 dark:bg-purple-900/80 dark:text-purple-100 dark:border-purple-500/60 dark:shadow-purple-950/40",
    hover: "hover:bg-purple-500/15 hover:text-purple-600 dark:hover:text-purple-400 hover:border-purple-400/60 hover:shadow-sm hover:shadow-purple-500/15",
  },
  flight: {
    active: "bg-sky-500 text-white border-sky-500 shadow-md shadow-sky-500/25 dark:bg-sky-900/80 dark:text-sky-100 dark:border-sky-500/60 dark:shadow-sky-950/40",
    hover: "hover:bg-sky-500/15 hover:text-sky-600 dark:hover:text-sky-400 hover:border-sky-400/60 hover:shadow-sm hover:shadow-sky-500/15",
  },
  ecommerce: {
    active: "bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-600/25 dark:bg-blue-900/80 dark:text-blue-100 dark:border-blue-500/60 dark:shadow-blue-950/40",
    hover: "hover:bg-blue-500/15 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-400/60 hover:shadow-sm hover:shadow-blue-500/15",
  },
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
  let typeBg = "bg-stone-50 text-stone-600 border-stone-200 dark:bg-slate-800/80 dark:text-slate-300 dark:border-slate-700";
  let cardDescription = "";
  let displayName = house.name;

  if (house.id === -1) {
    typeLabel = t("showcase.type_flight");
    TypeIcon = Plane;
    typeBg = "bg-blue-50 text-blue-700 border-blue-200/50 dark:bg-blue-950/80 dark:text-blue-300 dark:border-blue-800/80";
    cardDescription = t("showcase.desc_flight");
    displayName = t("showcase.flight_demo_name");
  } else if (house.id === -2) {
    typeLabel = t("showcase.type_ecommerce");
    TypeIcon = ShoppingBag;
    typeBg = "bg-indigo-50 text-indigo-700 border-indigo-200/50 dark:bg-indigo-950/80 dark:text-indigo-300 dark:border-indigo-800/80";
    cardDescription = t("showcase.desc_ecommerce");
    displayName = t("showcase.itstore_demo_name");
  } else if (house.id === -3) {
    typeLabel = t("showcase.type_restaurant");
    TypeIcon = UtensilsCrossed;
    typeBg = "bg-emerald-50 text-emerald-700 border-emerald-200/50 dark:bg-emerald-950/80 dark:text-emerald-300 dark:border-emerald-800/80";
    cardDescription = t("showcase.desc_restaurant");
    displayName = t("food.title");
  } else if (house.id === -4) {
    typeLabel = t("showcase.type_accommodation");
    TypeIcon = BedDouble;
    typeBg = "bg-amber-50 text-amber-700 border-amber-200/50 dark:bg-amber-950/80 dark:text-amber-300 dark:border-amber-800/80";
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
      typeBg = "bg-stone-50 text-stone-500 border-stone-200/50 dark:bg-slate-800/80 dark:text-slate-300 dark:border-slate-700";
    } else {
      typeLabel = TN_TYPE_KEYS[house.code]
        ? t(TN_TYPE_KEYS[house.code] as any)
        : t(`showcase.type_${house.type}` as any);
      if (CATEGORY_STYLES[house.type]) {
        TypeIcon = CATEGORY_STYLES[house.type].Icon;
        typeBg = CATEGORY_STYLES[house.type].bg;
      }
    }
  }

  const bulletItems = useMemo(() => {
    if (!cardDescription) return [];
    if (cardDescription.includes('\n') || cardDescription.includes('•')) {
      return cardDescription
        .split(/[\n•]/)
        .map((s) => s.trim())
        .filter(Boolean);
    }
    if (cardDescription.includes(': ')) {
      const parts = cardDescription.split(/:\s*(.+)/);
      if (parts[1]) {
        const subItems = parts[1]
          .split(/[,;\.]|\bและ\b|\band\b|\bincluding\b|\bfeaturing\b/i)
          .map((s) => s.trim())
          .filter(Boolean);
        return subItems.length > 0 ? subItems : [parts[1].trim()];
      }
    }
    return cardDescription
      .split(/[,;\.]|\bและ\b|\band\b/i)
      .map((s) => s.trim())
      .filter(Boolean);
  }, [cardDescription]);

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
        <div className="flex items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-1.5 min-w-0">
            <div className="w-10 h-10 rounded-2xl border border-sky-200 dark:border-sky-800/80 bg-sky-50/60 dark:bg-sky-950/40 group-hover:border-sky-400 dark:group-hover:border-sky-500 group-hover:shadow-[0_0_18px_rgba(14,165,233,0.45)] group-hover:scale-110 flex items-center justify-center p-2 shadow-xs transition-all duration-300 shrink-0">
              {house.id === -1 ? (
                <img src={botnoiAirLogo} alt="BotnoiAir" className="w-full h-full object-contain" />
              ) : house.id === -3 ? (
                <img src={botnoiRestaurantLogo} alt="Botnoi Restaurant" className="w-full h-full object-contain" />
              ) : (
                <TypeIcon className="size-4.5 text-sky-600 dark:text-sky-400 shrink-0" />
              )}
            </div>
            <span className={`text-[9.5px] font-black tracking-wider uppercase px-2 py-0.5 rounded-full border flex items-center gap-1 whitespace-nowrap shrink-0 ${typeBg}`}>
              {typeLabel}
            </span>
          </div>
          <span className="text-[11px] font-black text-foreground font-mono bg-muted/50 px-2 py-0.5 rounded-lg border border-border shrink-0 ml-auto">
            {house.code}
          </span>
        </div>

        {/* Title & Description */}
        <div className="mb-5">
          <h3 className="text-base sm:text-lg font-black text-foreground mb-2 group-hover:text-primary transition-colors tracking-tight leading-snug min-h-[2.75rem] flex items-center">
            {displayName}
          </h3>
          {bulletItems.length > 0 ? (
            <ul
              className="text-xs text-muted-foreground leading-relaxed min-h-[4.5rem] max-h-[4.5rem] overflow-hidden group-hover:overflow-y-auto transition-all pr-1 cursor-text space-y-1 scrollbar-none"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {bulletItems.map((bullet, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <span className="size-1.5 rounded-full bg-primary/70 mt-1.5 shrink-0" />
                  <span className="flex-1 font-sans">{bullet}</span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="min-h-[4.5rem]" />
          )}
        </div>
      </div>

      {/* Action Link Footer */}
      <div className="flex items-center gap-3 pt-3.5 border-t border-border">
        {hasDeployed ? (
          house.deployedUrl.startsWith('/') ? (
            <Link
              to={house.deployedUrl}
              aria-label={`${t('showcase.launch_demo')} - ${house.code} ${displayName}`}
              className="btn btn-primary flex-1 text-center py-3 text-xs font-extrabold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 dark:bg-indigo-950/80 dark:hover:bg-indigo-900/90 dark:border-indigo-800/80 dark:text-indigo-200 dark:shadow-none"
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
              className="btn btn-primary flex-1 text-center py-3 text-xs font-extrabold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 dark:bg-indigo-950/80 dark:hover:bg-indigo-900/90 dark:border-indigo-800/80 dark:text-indigo-200 dark:shadow-none"
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

  const filterScrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (filterScrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = filterScrollRef.current;
      setCanScrollLeft(scrollLeft > 5);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 5);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, []);

  const handleScroll = (direction: "left" | "right") => {
    if (filterScrollRef.current) {
      const scrollAmount = direction === "left" ? -220 : 220;
      filterScrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

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

      const isFilterActive = selectedCategory !== "all" || searchQuery.trim() !== "";

      const matchesStatus =
        statusFilter === "deployed" ? isHouseDeployed(house) :
        statusFilter === "pending" ? !isHouseDeployed(house) :
        isFilterActive ? isHouseDeployed(house) : true;

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
            <div className="relative w-full lg:max-w-xs shrink-0 flex items-center">
              <label htmlFor="demo-search-input" className="sr-only">
                {t('showcase.search_placeholder')}
              </label>
              <Search className="absolute left-3.5 size-4 text-muted-foreground pointer-events-none" />
              <input
                id="demo-search-input"
                name="searchQuery"
                type="text"
                aria-label={t('showcase.search_placeholder')}
                placeholder={t('showcase.search_placeholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-10 pl-10 pr-4 bg-muted/30 border border-border focus:border-primary rounded-2xl text-xs font-bold text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-mono"
              />
            </div>

            {/* Quick Filters Tab Container with Scroll Buttons & Bounded Scrollbar Track */}
            <div className="flex items-center min-w-0 flex-1 gap-2 mt-1 lg:mt-0">
              <button
                type="button"
                onClick={() => handleScroll("left")}
                disabled={!canScrollLeft}
                className={`w-10 h-10 rounded-2xl bg-card/95 backdrop-blur-md border border-border shadow-sm transition-all shrink-0 flex items-center justify-center -translate-y-1.5 ${
                  canScrollLeft
                    ? "text-foreground hover:bg-primary hover:text-primary-foreground opacity-100 cursor-pointer"
                    : "text-muted-foreground/30 opacity-30 cursor-not-allowed border-border/40"
                }`}
                aria-label="Scroll left filters"
              >
                <ChevronLeft className="size-4" />
              </button>

              <div
                ref={filterScrollRef}
                onScroll={checkScroll}
                className="flex flex-nowrap items-center justify-start gap-1.5 overflow-x-auto min-w-0 pt-1 pb-4 flex-1 scroll-smooth select-none [&::-webkit-scrollbar]:h-1 [&::-webkit-scrollbar-track]:bg-muted/15 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-thumb]:bg-muted-foreground/20 hover:[&::-webkit-scrollbar-thumb]:bg-muted-foreground/40 [&::-webkit-scrollbar-thumb]:rounded-full transition-colors"
                style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(148, 163, 184, 0.25) transparent" }}
              >
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
                  const label = t(cat.translationKey as TranslationKey);
                  const colorConfig = CATEGORY_COLOR_MAP[cat.id] || CATEGORY_COLOR_MAP.all;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`h-10 px-3.5 rounded-2xl text-xs font-extrabold transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer border shrink-0 whitespace-nowrap ${
                        isActive
                          ? colorConfig.active
                          : `text-muted-foreground bg-muted/30 border-border ${colorConfig.hover}`
                      }`}
                    >
                      <Icon className="size-3.5 shrink-0" />
                      <span className="whitespace-nowrap">{label}</span>
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={() => handleScroll("right")}
                disabled={!canScrollRight}
                className={`w-10 h-10 rounded-2xl bg-card/95 backdrop-blur-md border border-border shadow-sm transition-all shrink-0 flex items-center justify-center -translate-y-1.5 ${
                  canScrollRight
                    ? "text-foreground hover:bg-primary hover:text-primary-foreground opacity-100 cursor-pointer"
                    : "text-muted-foreground/30 opacity-30 cursor-not-allowed border-border/40"
                }`}
                aria-label="Scroll right filters"
              >
                <ChevronRight className="size-4" />
              </button>
            </div>

            {/* Filter Toggle Icon Button */}
            <button
              onClick={() => setIsFilterModalOpen(true)}
              title={t('showcase.filter')}
              aria-label={t('showcase.filter')}
              className="w-10 h-10 rounded-2xl bg-muted/30 border border-border hover:bg-muted/50 hover:text-foreground text-foreground transition-all flex items-center justify-center cursor-pointer shrink-0 relative group shadow-sm -translate-y-1.5"
              id="filter-modal-trigger"
            >
              <SlidersHorizontal className="size-4.5 text-primary shrink-0" />
              {(selectedCategory !== "all" || statusFilter !== "all" || sortBy !== "code") && (
                <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-primary ring-2 ring-background animate-pulse" />
              )}
              {/* Tooltip on hover */}
              <span className="absolute -top-9 left-1/2 -translate-x-1/2 px-2.5 py-1 bg-slate-900/90 dark:bg-slate-800/95 backdrop-blur-md text-white text-[11px] font-bold rounded-xl shadow-lg border border-slate-700/50 opacity-0 group-hover:opacity-100 transition-all duration-150 pointer-events-none whitespace-nowrap z-50">
                {t('showcase.filter')}
              </span>
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
                  {t('showcase.filter_category')}: {t(`showcase.cat_${selectedCategory}` as any)}
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
                  {t('showcase.filter_status')}: {statusFilter === "deployed" ? t('showcase.status_deployed') : t('showcase.status_pending')}
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
                  {t('showcase.filter_sort')}: {sortBy === "progress" ? t('showcase.sort_progress_short') : t('showcase.sort_code_short')}
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
                  <span className="card-count-badge" id="badge-sandbox-count">
                    <span>{sandboxDemos.length}</span>
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {sandboxDemos.map(house => (
                    <DemoCard key={house.id} house={house} t={t} />
                  ))}
                </div>
              </section>
            )}

            {/* ── Section 2: TN Startup Demos ────────────────────────── */}
            {projectDemos.length > 0 && (
              <section aria-label="TN Startup Demos" id="tn-startup-demos-section">
                <div className="flex items-center gap-2.5 mb-5">
                  <Sparkles className="size-4 text-primary shrink-0" />
                  <h2 className="text-xs font-black text-primary uppercase tracking-widest font-mono leading-none m-0 p-0 flex items-center">
                    {t('showcase.student_projects')}
                  </h2>
                  <span className="card-count-badge" id="badge-projects-count">
                    <span>{projectDemos.length}</span>
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
                    {t('showcase.filter_title')}
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
                    {t('showcase.sort_heading')}
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: "code", label: t('showcase.sort_code_short') },
                      { id: "progress", label: t('showcase.sort_progress_short') },
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
                    {t('showcase.status_heading')}
                  </h3>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: "all", label: t('showcase.cat_all') },
                      { id: "deployed", label: t('showcase.status_deployed') },
                      { id: "pending", label: t('showcase.status_pending') },
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
                    {t('showcase.category_heading')}
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
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
                      const active = selectedCategory === cat.id;
                      const Icon = cat.icon;
                      const label = t(cat.translationKey as TranslationKey);
                      const colorConfig = CATEGORY_COLOR_MAP[cat.id] || CATEGORY_COLOR_MAP.all;
                      return (
                        <button
                          key={cat.id}
                          onClick={() => setSelectedCategory(cat.id)}
                          className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5 ${
                            active
                              ? colorConfig.active
                              : `bg-muted/20 border-border text-muted-foreground ${colorConfig.hover}`
                          }`}
                        >
                          <Icon className="size-3.5 shrink-0" />
                          <span className="whitespace-nowrap font-sans">{label}</span>
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