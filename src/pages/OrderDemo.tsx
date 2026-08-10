import { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useTranslation, type TranslationKey } from "@/lib/LanguageContext";
import {
  Search,
  Plane,
  BedDouble,
  UtensilsCrossed,
  ShoppingBag,
  ChevronDown,
  Sparkles,
  FlaskConical,
  GraduationCap,
  Map,
  HeartPulse,
  Wrench,
  Coffee,
  Dumbbell,
  Clock,
  Users,
  RotateCcw,
  SlidersHorizontal,
  X,
  ArrowUpDown,
  Check,
  Building2,
  ExternalLink,
  type LucideIcon,
} from "lucide-react";
import botnoiAirLogo from "../assets/Screenshot 2026-08-10 140706.png";
import botnoiRestaurantLogo from "../assets/IT.png";
import promoPhuket from "../assets/hotel.png";
import padKrapaoImage from "../assets/Restarant.png";
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
  teamName?: string | string[];
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
  { id: -1, code: 'SANDBOX', name: 'Flight Demo', teamName: 'Botnoi Air Team', style: 'Interactive Sandbox', type: 'flight', color: '#0284c7', progress: 100, deployedUrl: '/flight-demo', githubUrl: '' },
  { id: -2, code: 'SANDBOX', name: 'IT Store Demo', teamName: 'Botnoi IT Team', style: 'Interactive Sandbox', type: 'ecommerce', color: '#0284c7', progress: 100, deployedUrl: '/it-store-demo', githubUrl: '' },
  { id: -3, code: 'SANDBOX', name: 'Botnoi Restaurant Food Order', teamName: 'Botnoi Food Team', style: 'Interactive Sandbox', type: 'restaurant', color: '#0284c7', progress: 100, deployedUrl: '/food-demo', githubUrl: '' },
  { id: -4, code: 'SANDBOX', name: 'Botnoi Grand Hotel & Resort', teamName: 'Botnoi Hotel Team', style: 'Interactive Sandbox', type: 'accommodation', color: '#0284c7', progress: 100, deployedUrl: 'https://botnoi-hotel-two.vercel.app/', githubUrl: 'https://github.com/botnoi-demos/hotel-resort-sandbox' },
  { id: 1, code: 'TN01, TN07', name: 'LearnLab', teamName: ['The-chill-crew', 'steak-game-bros'], style: 'Modern Minimalist', type: 'education', color: '#0284c7', progress: 85, deployedUrl: 'https://ai-learn-hub-22.lovable.app/', githubUrl: 'https://github.com/Icetea0000000000025/ai-learn-hub-22.git  ' },
  //{ id: 2, code: 'TN02', name: '', teamName: 'Team 02', style: 'Neo-Classical', type: 'flight', color: '#0284c7', progress: 45, deployedUrl: 'https://example.com', githubUrl: 'https://github.com' },
  { id: 3, code: 'TN03', name: 'Skinbot', teamName: 'Controller-kings', style: 'Nordic Timber', type: 'skincare', color: '#0284c7', progress: 90, deployedUrl: 'https://eucerin-mu.vercel.app/', githubUrl: 'https://github.com' },
  { id: 4, code: 'TN04', name: 'AI Trip Map Planner', teamName: 'The-netflix-hermits', style: 'Brutalist Concrete', type: 'map', color: '#0284c7', progress: 10, deployedUrl: 'https://trip-planner-botnoi.vercel.app/', githubUrl: 'https://github.com' },
  { id: 5, code: 'TN05', name: 'Demo Health', teamName: 'Aesthetic-dreamers', style: 'Cozy Wood Cabin', type: 'hospital', color: '#0284c7', progress: 100, deployedUrl: 'https://hospital-demo-kohl.vercel.app/', githubUrl: 'https://github.com' },
  { id: 6, code: 'TN06', name: 'Botnoi API', teamName: 'lo-fi-homebodies', style: 'Glass Contemporary', type: 'ecommerce', color: '#0284c7', progress: 60, deployedUrl: 'https://digital-friendly-companion.lovable.app/', githubUrl: 'https://github.com' },
  { id: 7, code: 'TN07', name: 'Ran-lung-get', teamName: 'steak-game-bros', style: 'Organic Earth Dome', type: 'restaurant', color: '#0284c7', progress: 80, deployedUrl: 'https://ranlunggetdemo.vercel.app/', githubUrl: 'https://github.com/ran-lung-get/ran-lung-get-demo' },
  { id: 8, code: 'TN08, TN19', name: 'Chevi Shop', teamName: ['Vibe-architects', 'ocean-avengers'], style: 'Industrial Brickwork', type: 'ac_service', color: '#0284c7', progress: 75, deployedUrl: 'https://chevi-shop.netlify.app/', githubUrl: 'https://github.com' },
  { id: 9, code: 'TN09', name: 'Botnoi Live Translate', teamName: 'Sunset-superfans', style: 'Japanese Zen', type: 'ecommerce', color: '#0284c7', progress: 100, deployedUrl: 'https://botnoi-live-speak.base44.app/', githubUrl: 'https://github.com' },
  { id: 10, code: 'TN10', name: 'CoolCare Pro', teamName: 'lazy-mermaids', style: 'Modular Container', type: 'ac_service', color: '#0284c7', progress: 30, deployedUrl: 'https://b-grim-dashboard.vercel.app/', githubUrl: 'https://github.com' },
  { id: 11, code: 'TN11', name: 'MediQ', teamName: 'The-sharp-cuts', style: 'Mid-Century Gable', type: 'hospital', color: '#0284c7', progress: 80, deployedUrl: 'https://mediq-demo.vercel.app/', githubUrl: 'https://github.com' },
  { id: 12, code: 'TN12', name: 'Homiq(Arex-platform)', teamName: 'Coastal-avengers', style: 'Tropical Canopy', type: 'accommodation', color: '#0284c7', progress: 95, deployedUrl: 'https://arex-platform.lovable.app/', githubUrl: 'https://github.com' },
  //{ id: 13, code: 'TN13', name: '', teamName: 'Team 13', style: 'Step Architecture', type: 'accommodation', color: '#0284c7', progress: 55, deployedUrl: 'https://example.com', githubUrl: 'https://github.com' },
  { id: 14, code: 'TN14', name: 'BrewAI', teamName: 'The-dungeon-masters', style: 'Atrium Courtyard', type: 'coffee', color: '#0284c7', progress: 100, deployedUrl: 'https://botnoi-brewai-production.up.railway.app/', githubUrl: 'https://github.com' },
  { id: 15, code: 'TN15', name: 'Glow Med Spa', teamName: 'Mountain-mode', style: 'Flat-Roof Minimal', type: 'map', color: '#0284c7', progress: 15, deployedUrl: 'https://medspa-booking-buddy.lovable.app/', githubUrl: 'https://github.com' },
  { id: 16, code: 'TN16', name: 'Fitder', teamName: 'Blue-hour-society', style: 'Modern Steel Frame', type: 'fitness', color: '#0284c7', progress: 70, deployedUrl: 'https://fitder-ai.vercel.app/', githubUrl: 'https://github.com' },
  { id: 17, code: 'TN17', name: 'AI Commerce Agent', teamName: 'Midnight-raiders', style: 'Spanish Terracotta', type: 'ecommerce', color: '#0284c7', progress: 80, deployedUrl: 'https://ai-e-commerce-brown.vercel.app/', githubUrl: 'https://github.com' },
  //{ id: 18, code: 'TN18', name: '18-indie-mountain-kids', teamName: 'Team 18', style: 'Parametric Fluid', type: 'flight', color: '#0284c7', progress: 0, deployedUrl: 'https://example.com', githubUrl: 'https://github.com' },
  //{ id: 19, code: 'TN19', name: '19-ocean-avengers', teamName: 'Team 19', style: 'Victorian Restoration', type: 'ac_service', color: '#0284c7', progress: 100, deployedUrl: '', githubUrl: 'https://github.com' },
  //{ id: 20, code: 'TN20', name: '', teamName: 'Team 20', style: 'Waterfront Living', type: 'ecommerce', color: '#0284c7', progress: 40, deployedUrl: 'https://example.com', githubUrl: 'https://github.com' }
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

function getTNCustomDescKey(code: string): string | undefined {
  if (TN_CUSTOM_DESC_KEYS[code]) return TN_CUSTOM_DESC_KEYS[code];
  const codes = code.split(/[\s,]+/);
  for (const c of codes) {
    if (TN_CUSTOM_DESC_KEYS[c]) return TN_CUSTOM_DESC_KEYS[c];
  }
  return undefined;
}

function getTNTypeKey(code: string): string | undefined {
  if (TN_TYPE_KEYS[code]) return TN_TYPE_KEYS[code];
  const codes = code.split(/[\s,]+/);
  for (const c of codes) {
    if (TN_TYPE_KEYS[c]) return TN_TYPE_KEYS[c];
  }
  return undefined;
}

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

// Auto-discover any image files placed in src/assets/ (e.g. TN01.png, tn03.jpg, tn07.webp)
const localAssetsMap = import.meta.glob<{ default: string }>('../assets/*.{png,jpg,jpeg,webp,svg}', {
  eager: true,
  import: 'default',
});

function getLocalAssetForHouse(code: string): string | undefined {
  const codes = code.toLowerCase().split(/[\s,]+/);
  for (const c of codes) {
    for (const path in localAssetsMap) {
      const filename = path.split('/').pop()?.toLowerCase();
      if (filename && (filename.startsWith(c + '.') || filename.startsWith(c + '_') || filename.startsWith(c + '-')) ) {
        return localAssetsMap[path] as unknown as string;
      }
    }
  }
  return undefined;
}

const DEMO_PREVIEW_IMAGES: Record<string, string> = {
  '-1': botnoiAirLogo,
  '-2': botnoiRestaurantLogo,
  '-3': padKrapaoImage,
  '-4': promoPhuket,
  TN01: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=600&q=80&auto=format&fit=crop',
  TN03: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&q=80&auto=format&fit=crop',
  TN04: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600&q=80&auto=format&fit=crop',
  TN05: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&q=80&auto=format&fit=crop',
  TN06: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&q=80&auto=format&fit=crop',
  TN07: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&q=80&auto=format&fit=crop',
  TN08: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=600&q=80&auto=format&fit=crop',
  TN09: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?w=600&q=80&auto=format&fit=crop',
  TN10: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&q=80&auto=format&fit=crop',
  TN11: 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=600&q=80&auto=format&fit=crop',
  TN12: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&q=80&auto=format&fit=crop',
  TN14: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=600&q=80&auto=format&fit=crop',
  TN15: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600&q=80&auto=format&fit=crop',
  TN16: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&q=80&auto=format&fit=crop',
  TN17: 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=600&q=80&auto=format&fit=crop',
  TN19: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&q=80&auto=format&fit=crop',
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
  let typeBg = "bg-stone-50 text-stone-600 border-stone-200 dark:bg-slate-800/80 dark:text-slate-300 dark:border-slate-700";
  let cardDescription = "";
  let displayName = house.name;

  if (house.id === -1) {
    typeLabel = t("showcase.type_flight");
    typeBg = "bg-blue-50 text-blue-700 border-blue-200/50 dark:bg-blue-950/80 dark:text-blue-300 dark:border-blue-800/80";
    cardDescription = t("showcase.desc_flight");
    displayName = t("showcase.flight_demo_name");
  } else if (house.id === -2) {
    typeLabel = t("showcase.type_ecommerce");
    typeBg = "bg-indigo-50 text-indigo-700 border-indigo-200/50 dark:bg-indigo-950/80 dark:text-indigo-300 dark:border-indigo-800/80";
    cardDescription = t("showcase.desc_ecommerce");
    displayName = t("showcase.itstore_demo_name");
  } else if (house.id === -3) {
    typeLabel = t("showcase.type_restaurant");
    typeBg = "bg-emerald-50 text-emerald-700 border-emerald-200/50 dark:bg-emerald-950/80 dark:text-emerald-300 dark:border-emerald-800/80";
    cardDescription = t("showcase.desc_restaurant");
    displayName = t("food.title");
  } else if (house.id === -4) {
    typeLabel = t("showcase.type_accommodation");
    typeBg = "bg-amber-50 text-amber-700 border-amber-200/50 dark:bg-amber-950/80 dark:text-amber-300 dark:border-amber-800/80";
    cardDescription = t("showcase.desc_accommodation");
    displayName = t("showcase.hotel_demo_name");
  } else {
    const customDescKey = getTNCustomDescKey(house.code);
    if (customDescKey) {
      cardDescription = t(customDescKey as any);
    } else if (!NO_DESC_CODES.has(house.code)) {
      cardDescription = t(`showcase.desc_${house.type}` as any);
    }

    if (!hasDeployed) {
      typeLabel = t("showcase.type_pending");
      typeBg = "bg-stone-50 text-stone-500 border-stone-200/50 dark:bg-slate-800/80 dark:text-slate-300 dark:border-slate-700";
    } else {
      const typeKey = getTNTypeKey(house.code);
      typeLabel = typeKey
        ? t(typeKey as any)
        : t(`showcase.type_${house.type}` as any);
      if (CATEGORY_STYLES[house.type]) {
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

  const teamNamesArray = useMemo(() => {
    if (!house.teamName) {
      return [house.code.startsWith('TN') ? `Team ${house.code.replace('TN', '')}` : 'Botnoi Team'];
    }
    if (Array.isArray(house.teamName)) {
      return house.teamName;
    }
    return [house.teamName];
  }, [house.teamName, house.code]);

  const previewImg = getLocalAssetForHouse(house.code) || DEMO_PREVIEW_IMAGES[String(house.id)] || DEMO_PREVIEW_IMAGES[house.code] || "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=600&q=80&auto=format&fit=crop";

  const cardInnerContent = (
    <motion.article
      key={house.id}
      id={cardId}
      aria-label={`${house.code}: ${displayName}`}
      className="playing-card relative bg-card border-2 border-border/80 dark:border-slate-800 rounded-[24px] shadow-md hover:shadow-2xl hover:border-sky-400/70 transition-all duration-300 flex flex-col justify-between group overflow-hidden cursor-pointer h-full"
      style={{
        boxShadow: "0 10px 25px -8px rgba(0,0,0,0.08), 0 4px 6px -2px rgba(0,0,0,0.04)",
      }}
      whileHover={{ y: -6, scale: 1.02, rotate: house.id % 2 === 0 ? 0.8 : -0.8 }}
    >
      {/* Top Demo Image Thumbnail Preview Box */}
      <div className="relative w-full h-36 sm:h-40 overflow-hidden bg-slate-900 border-b border-border/60">
        <img
          src={previewImg}
          alt={displayName}
          className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500 opacity-90 group-hover:opacity-100"
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=600&q=80&auto=format&fit=crop";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card via-card/15 to-black/35 pointer-events-none" />
      </div>

      {/* Top Accent Strip below image */}
      <div
        className="h-1 opacity-90"
        style={{ background: house.color || "var(--primary)" }}
      />

      <div className="relative z-10 flex flex-col flex-1 justify-between p-4.5">
        <div>
          {/* Card Title */}
          <div className="mb-2">
            <h3 className="text-base sm:text-[16px] font-black text-foreground group-hover:text-sky-500 dark:group-hover:text-sky-400 transition-colors tracking-tight leading-snug min-h-[2.4rem] flex items-center">
              {displayName}
            </h3>
          </div>

          {/* Card Description Bullets */}
          {bulletItems.length > 0 ? (
            <ul
              className="text-[11.5px] text-muted-foreground leading-relaxed max-h-[4.8rem] overflow-hidden group-hover:overflow-y-auto pr-1 cursor-text space-y-1 scrollbar-none"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
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

          {/* Tags Row Below Description: Code Tag (SANDBOX / StartUP) & Category Type Tag */}
          <div className="flex items-center gap-2 mt-4 pt-1 flex-wrap">
            {/* Code Badge (SANDBOX / StartUP) */}
            <span className="text-[10px] font-black text-foreground font-mono bg-muted/80 dark:bg-slate-800/90 px-2 py-0.5 rounded-md border border-border/70 shadow-2xs">
              {house.code.startsWith("TN") ? "StartUP" : house.code}
            </span>

            {/* Category Type Tag (Text-only) */}
            <span className={`text-[9.5px] font-black tracking-wider uppercase px-2.5 py-0.5 rounded-full border shadow-2xs whitespace-nowrap ${typeBg}`}>
              {typeLabel}
            </span>
          </div>
        </div>

        {/* Card Footer: Team Names (Renders multiple team badges if array) */}
        <div className="pt-2.5 border-t border-border/60 mt-3.5 flex items-center justify-between gap-1.5 min-w-0">
          <div className="flex items-center gap-1.5 min-w-0 flex-1 overflow-hidden pr-1 flex-wrap">
            <Users className="size-3 text-primary shrink-0" />
            {teamNamesArray.map((team, idx) => (
              <span
                key={idx}
                className="text-[10px] font-bold text-foreground/80 bg-muted/60 dark:bg-slate-800/80 px-2 py-0.5 rounded-md border border-border/40 truncate max-w-full leading-tight inline-flex items-center gap-1"
                title={team}
              >
                {team}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Full Card Blue Hover Overlay Layer (Swapped: Large Title on Top, Compact Button Below) */}
      <div className="absolute inset-0 z-30 bg-sky-500/40 dark:bg-sky-600/30 backdrop-blur-xs flex flex-col items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none rounded-[24px] p-6 text-center shadow-2xl">
        {hasDeployed ? (
          <>
            {/* 1. Large Bold Demo Title on Top */}
            <h3 className="text-base sm:text-lg font-black text-white tracking-tight leading-snug drop-shadow-md line-clamp-2 max-w-[90%] transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
              {displayName}
            </h3>

            {/* 2. Smaller Compact Launch Demo Button Below */}
            <div className="px-3 py-1.5 rounded-xl bg-white/25 backdrop-blur-md border border-white/40 text-white text-[11px] font-extrabold tracking-wider uppercase flex items-center gap-1.5 shadow-md transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300 delay-75">
              <span>{t('showcase.launch_demo')}</span>
              <ExternalLink className="size-3.5 shrink-0" />
            </div>
          </>
        ) : (
          <>
            <h3 className="text-base sm:text-lg font-black text-white tracking-tight leading-snug drop-shadow-md line-clamp-2 max-w-[90%] transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
              {displayName}
            </h3>
            <div className="px-3 py-1.5 rounded-xl bg-black/40 backdrop-blur-md border border-white/25 text-white/90 text-[11px] font-extrabold tracking-wider uppercase flex items-center gap-1.5">
              <Clock className="size-3.5 shrink-0" />
              <span>{t('showcase.status_pending')}</span>
            </div>
          </>
        )}
      </div>
    </motion.article>
  );

  if (!hasDeployed) {
    return cardInnerContent;
  }

  if (house.deployedUrl.startsWith('/')) {
    return (
      <Link to={house.deployedUrl} className="block h-full group font-sans">
        {cardInnerContent}
      </Link>
    );
  }

  return (
    <a href={house.deployedUrl} target="_blank" rel="noopener noreferrer" className="block h-full group font-sans">
      {cardInnerContent}
    </a>
  );
}

const BUSINESS_TYPE_OPTIONS = [
  { id: "all", label: "All" },
  { id: "manufacturing", label: "Manufacturing" },
  { id: "retail", label: "Retail" },
  { id: "service", label: "Service" },
  { id: "ecommerce", label: "E-commerce" },
  { id: "realestate", label: "Real-estate" },
  { id: "finance", label: "Finance & Investment" },
];

// ─── Page Component ───────────────────────────────────────────────────────────
export default function OrderDemo() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [businessTypeFilter, setBusinessTypeFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"all" | "sandbox" | "startup">("all");
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isStatusOpen, setIsStatusOpen] = useState(false);

  // Dynamically compute available categories based on active demo pool (sortBy / businessTypeFilter)
  const availableCategories = useMemo(() => {
    const allCategories = [
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
    ];

    let pool = projectData;
    if (sortBy === "sandbox") {
      pool = projectData.filter(h => h.code === 'SANDBOX');
    } else if (sortBy === "startup") {
      pool = projectData.filter(h => h.code !== 'SANDBOX');
    }

    if (businessTypeFilter !== "all") {
      pool = pool.filter(h => {
        if (businessTypeFilter === "manufacturing") return h.type === "ac_service" || h.style.toLowerCase().includes("manufacturing");
        if (businessTypeFilter === "retail") return h.type === "skincare" || h.type === "coffee" || h.type === "restaurant";
        if (businessTypeFilter === "service") return h.type === "hospital" || h.type === "education" || h.type === "map" || h.type === "fitness" || h.type === "ac_service" || h.type === "flight";
        if (businessTypeFilter === "ecommerce") return h.type === "ecommerce" || h.id === -2;
        if (businessTypeFilter === "realestate") return h.type === "accommodation" || h.id === -4;
        if (businessTypeFilter === "finance") return h.type === "map" || h.code === "TN06";
        return true;
      });
    }

    const presentTypes = new Set(pool.map(h => h.type));
    return allCategories.filter(cat => cat.id === "all" || presentTypes.has(cat.id as any));
  }, [sortBy, businessTypeFilter]);

  // Reset selected category to "all" if current selection is no longer present in availableCategories
  useEffect(() => {
    if (selectedCategory !== "all") {
      const exists = availableCategories.some(cat => cat.id === selectedCategory);
      if (!exists) {
        setSelectedCategory("all");
      }
    }
  }, [availableCategories, selectedCategory]);

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

      const teamText = Array.isArray(house.teamName) ? house.teamName.join(' ') : (house.teamName || '');

      const matchesSearch =
        house.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        house.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        teamText.toLowerCase().includes(searchQuery.toLowerCase()) ||
        overviewText.toLowerCase().includes(searchQuery.toLowerCase()) ||
        house.style.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = selectedCategory === "all" || house.type === selectedCategory;

      const matchesBusinessType =
        businessTypeFilter === "all" ||
        (businessTypeFilter === "manufacturing" && (house.type === "ac_service" || house.style.toLowerCase().includes("manufacturing"))) ||
        (businessTypeFilter === "retail" && (house.type === "skincare" || house.type === "coffee" || house.type === "restaurant")) ||
        (businessTypeFilter === "service" && (house.type === "hospital" || house.type === "education" || house.type === "map" || house.type === "fitness" || house.type === "ac_service" || house.type === "flight")) ||
        (businessTypeFilter === "ecommerce" && (house.type === "ecommerce" || house.id === -2)) ||
        (businessTypeFilter === "realestate" && (house.type === "accommodation" || house.id === -4)) ||
        (businessTypeFilter === "finance" && (house.type === "map" || house.code === "TN06"));

      return matchesSearch && matchesCategory && matchesBusinessType;
    });

    let sandboxes = allFiltered.filter(h => h.code === 'SANDBOX');
    let projects = allFiltered.filter(h => h.code !== 'SANDBOX');

    // Filter by SortBy selection (Sandbox Demo vs StartUP Demo)
    if (sortBy === "sandbox") {
      projects = [];
    } else if (sortBy === "startup") {
      sandboxes = [];
    } else {
      projects.sort((a, b) => a.id - b.id);
    }

    return {
      sandboxDemos: sandboxes,
      projectDemos: projects,
    };
  }, [searchQuery, selectedCategory, businessTypeFilter, sortBy, t]);

  const totalResults = sandboxDemos.length + projectDemos.length;

  return (
    <div
      className="min-h-[calc(100vh-68px)] w-full flex flex-col pb-10 selection:bg-primary selection:text-primary-foreground relative z-10"
      aria-label="All Demos Showcase Portal"
    >
      {/* Search & Filtering Controls */}
      <section className="max-w-7xl mx-auto w-full px-4 md:px-8 mt-6 relative z-40" aria-label="Search and Filter Demos" id="search-filter-section">
        {/* Main Container: Single container with a two-row layout */}
        <div className="flex flex-col gap-4.5 bg-card/80 dark:bg-slate-950/70 backdrop-blur-xl border border-border/80 p-5 md:p-6 rounded-[24px] shadow-lg shadow-black/5 transition-all relative z-40">
          
          {/* Top Row: Search input, inline dropdowns for 'Sort by' & 'Business Type', OK & Clear buttons */}
          <div className="flex flex-wrap items-center justify-between gap-3 md:gap-4 w-full">
            {/* Search + Dropdowns Group */}
            <div className="flex flex-wrap items-center gap-3 md:gap-4 flex-1 min-w-0">
              
              {/* Search Input */}
              <div className="relative w-full sm:w-72 md:w-80 shrink-0 flex items-center group">
                <label htmlFor="demo-search-input" className="sr-only">
                  {t('showcase.search_placeholder')}
                </label>
                <Search className="absolute left-3.5 size-4 text-muted-foreground group-focus-within:text-primary transition-colors pointer-events-none" />
                <input
                  id="demo-search-input"
                  name="searchQuery"
                  type="text"
                  aria-label={t('showcase.search_placeholder')}
                  placeholder={t('showcase.search_placeholder')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-10 pl-10 pr-9 bg-muted/40 hover:bg-muted/60 dark:bg-slate-900/60 border border-border/80 focus:border-primary/80 focus:bg-background rounded-2xl text-xs font-bold text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-mono shadow-2xs"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 p-0.5 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                    aria-label="Clear search text"
                  >
                    <X className="size-3.5" />
                  </button>
                )}
              </div>

              {/* Custom Styled Dropdown: Sort by */}
              <div className="relative z-50">
                <button
                  type="button"
                  onClick={() => {
                    setIsSortOpen(!isSortOpen);
                    setIsStatusOpen(false);
                  }}
                  className="h-10 px-3.5 bg-muted/40 hover:bg-muted/70 dark:bg-slate-900/60 dark:hover:bg-slate-900 border border-border/80 hover:border-primary/50 rounded-2xl text-xs font-bold text-foreground transition-all cursor-pointer flex items-center gap-2 shadow-2xs active:scale-95"
                >
                  <ArrowUpDown className="size-3.5 text-primary shrink-0" />
                  <span className="text-muted-foreground font-mono text-[11px] uppercase tracking-wider">
                    {t('showcase.sort_heading')}:
                  </span>
                  <span className="font-extrabold text-foreground">
                    {sortBy === "sandbox" ? "Sandbox Demo" : sortBy === "startup" ? "StartUP Demo" : t('showcase.cat_all')}
                  </span>
                  <ChevronDown className={`size-3.5 text-muted-foreground transition-transform duration-200 ${isSortOpen ? "rotate-180 text-primary" : ""}`} />
                </button>

                {isSortOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsSortOpen(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 6, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 6, scale: 0.96 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full left-0 mt-2 w-48 bg-card/95 dark:bg-slate-900/95 backdrop-blur-xl border border-border/80 rounded-2xl shadow-xl shadow-black/10 p-1.5 z-50 flex flex-col gap-1"
                    >
                      {[
                        { id: "all", label: t('showcase.cat_all') },
                        { id: "sandbox", label: "Sandbox Demo" },
                        { id: "startup", label: "StartUP Demo" },
                      ].map((opt) => {
                        const isSelected = sortBy === opt.id;
                        return (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => {
                              setSortBy(opt.id as any);
                              setIsSortOpen(false);
                            }}
                            className={`w-full px-3 py-2 rounded-xl text-xs font-extrabold flex items-center justify-between transition-all cursor-pointer ${
                              isSelected
                                ? "bg-primary/15 text-primary"
                                : "text-foreground/80 hover:bg-muted/60 hover:text-foreground"
                            }`}
                          >
                            <span>{opt.label}</span>
                            {isSelected && <Check className="size-3.5 text-primary shrink-0" />}
                          </button>
                        );
                      })}
                    </motion.div>
                  </>
                )}
              </div>

              {/* Custom Styled Dropdown: Business Type */}
              <div className="relative z-50">
                <button
                  type="button"
                  onClick={() => {
                    setIsStatusOpen(!isStatusOpen);
                    setIsSortOpen(false);
                  }}
                  className="h-10 px-3.5 bg-muted/40 hover:bg-muted/70 dark:bg-slate-900/60 dark:hover:bg-slate-900 border border-border/80 hover:border-primary/50 rounded-2xl text-xs font-bold text-foreground transition-all cursor-pointer flex items-center gap-2 shadow-2xs active:scale-95"
                >
                  <Building2 className="size-3.5 text-primary shrink-0" />
                  <span className="text-muted-foreground font-mono text-[11px] uppercase tracking-wider">
                    BUSINESS TYPE:
                  </span>
                  <span className="font-extrabold text-foreground">
                    {BUSINESS_TYPE_OPTIONS.find(o => o.id === businessTypeFilter)?.label || "All"}
                  </span>
                  <ChevronDown className={`size-3.5 text-muted-foreground transition-transform duration-200 ${isStatusOpen ? "rotate-180 text-primary" : ""}`} />
                </button>

                {isStatusOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsStatusOpen(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 6, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 6, scale: 0.96 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full left-0 mt-2 w-56 bg-card/95 dark:bg-slate-900/95 backdrop-blur-xl border border-border/80 rounded-2xl shadow-xl shadow-black/10 p-1.5 z-50 flex flex-col gap-1"
                    >
                      {BUSINESS_TYPE_OPTIONS.map((opt) => {
                        const isSelected = businessTypeFilter === opt.id;
                        return (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => {
                              setBusinessTypeFilter(opt.id);
                              setIsStatusOpen(false);
                            }}
                            className={`w-full px-3 py-2 rounded-xl text-xs font-extrabold flex items-center justify-between transition-all cursor-pointer ${
                              isSelected
                                ? "bg-primary/15 text-primary"
                                : "text-foreground/80 hover:bg-muted/60 hover:text-foreground"
                            }`}
                          >
                            <span>{opt.label}</span>
                            {isSelected && <Check className="size-3.5 text-primary shrink-0" />}
                          </button>
                        );
                      })}
                    </motion.div>
                  </>
                )}
              </div>
            </div>

            {/* OK & Clear Action Buttons Group (Right-aligned) */}
            <div className="flex items-center gap-2 ml-auto shrink-0">
              {/* OK Button */}
              <button
                type="button"
                className="h-10 px-8 bg-primary hover:bg-primary/95 text-primary-foreground border border-primary/80 rounded-2xl text-xs font-extrabold transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs active:scale-95 shrink-0"
              >
                OK
              </button>

              {/* Clear Button */}
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                  setBusinessTypeFilter("all");
                  setSortBy("all");
                }}
                title="Clear all filters"
                className="h-10 px-3.5 bg-muted/40 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 dark:bg-slate-900/60 dark:hover:bg-slate-900 border border-border/80 rounded-2xl text-xs font-bold text-foreground/80 transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs active:scale-95 shrink-0"
              >
                <RotateCcw className="size-3.5 shrink-0" />
                <span>Clear</span>
              </button>
            </div>
          </div>

          {/* Horizontal Line Divider */}
          <div className="h-px bg-border/60 w-full" />

          {/* Bottom Row: 'PROJECT CATEGORY' text label & category pills flex-wrap */}
          <div className="flex flex-col gap-3 w-full">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] font-black text-muted-foreground uppercase tracking-widest font-mono flex items-center gap-1.5">
                <SlidersHorizontal className="size-3.5 text-primary" />
                PROJECT CATEGORY
              </span>
              {selectedCategory !== "all" && (
                <button
                  onClick={() => setSelectedCategory("all")}
                  className="text-[10.5px] font-bold text-primary hover:underline cursor-pointer font-mono"
                >
                  Show All
                </button>
              )}
            </div>

            <div className="flex flex-nowrap items-center gap-2 overflow-x-auto pb-2.5 pt-0.5 min-w-0 flex-1 scroll-smooth select-none theme-filter-scrollbar">
              {availableCategories.map((cat) => {
                const isActive = selectedCategory === cat.id;
                const Icon = cat.icon;
                const label = t(cat.translationKey as TranslationKey);
                const colorConfig = CATEGORY_COLOR_MAP[cat.id] || CATEGORY_COLOR_MAP.all;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`h-9 px-3.5 rounded-xl text-xs font-extrabold transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer border whitespace-nowrap shrink-0 active:scale-95 ${
                      isActive
                        ? `${colorConfig.active} scale-[1.02]`
                        : `text-foreground/80 bg-muted/30 border-border/80 ${colorConfig.hover}`
                    }`}
                  >
                    <Icon className="size-3.5 shrink-0" />
                    <span>{label}</span>
                  </button>
                );
              })}
            </div>
          </div>

        </div>
      </section>

      <main className="max-w-7xl mx-auto w-full px-4 md:px-8 mt-8 mb-20 flex-1 space-y-12" aria-label="All Demo Projects" id="all-demos-main">
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
      <AppFooter />
    </div>
  );
}