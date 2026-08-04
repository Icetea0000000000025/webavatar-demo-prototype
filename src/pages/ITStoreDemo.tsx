import {
  Check,
  ChevronRight,
  Minus,
  Plus,
  ReceiptText,
  ShoppingCart,
  Trash2,
  Zap,
  Home,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation, type TranslationKey } from "@/lib/LanguageContext";
import PageSkeleton from "@/components/PageSkeleton";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import "./Pages.css";

import huaweiMate80Pro from "../assets/huawei-mate80-pro.png";
import huaweiMateX7 from "../assets/huawei-mate-x7.png";
import huaweiMateXT from "../assets/huawei-mate-xt.png";
import huaweiMateX6 from "../assets/huawei-mate-x6.png";
import huaweiMate50 from "../assets/huawei-mate50.png";
import huaweiMateXs2 from "../assets/huawei-mate-xs2.png";

// ─── Types ─────────────────────────────────────────────────────────────────

export type ITCategory = "All Products" | "Laptops" | "Monitors" | "Audio" | "Accessories" | "Phone";
export type ITCart = Record<string, number>;

export interface ITProduct {
  id: string;
  name: string;
  specs: string;
  description: string;
  category: ITCategory;
  price: number;
  image: string;
  badge?: string;
  color: string; // accent color
}

export interface ITOrder {
  orderId: string;
  orderedAt: string;
  items: Array<ITProduct & { quantity: number }>;
  subtotal: number;
  shipping: number;
  total: number;
}

export const formatOrderDate = (orderedAt: string, lang: string) => {
  if (!orderedAt) return "";
  const d = new Date(orderedAt);
  if (!isNaN(d.getTime())) {
    const localeMap: Record<string, string> = {
      th: "th-TH",
      en: "en-US",
      zh: "zh-CN",
      ja: "ja-JP",
      ko: "ko-KR",
      es: "es-ES",
      fr: "fr-FR",
    };
    return d.toLocaleString(localeMap[lang] || "en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  }
  return orderedAt;
};

// ─── Storage Keys ───────────────────────────────────────────────────────────
const CART_KEY = "botnoi-itstore-cart";
const ORDER_KEY = "botnoi-itstore-last-order";
const ORDERS_KEY = "botnoi-itstore-orders";

// ─── Product Catalogue ──────────────────────────────────────────────────────
// Using freely available Unsplash CDN images
const products: ITProduct[] = [
  {
    id: "probook",
    name: "Botnoi ProBook Ultra 16",
    specs: 'Intel Core Ultra 9 · 32GB RAM · 1TB NVMe · 16" OLED 120Hz',
    description:
      "The ultimate workhorse laptop for power users and creative professionals. Blazing performance meets all-day battery life.",
    category: "Laptops",
    price: 89900,
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&q=80&auto=format&fit=crop",
    badge: "Best Seller",
    color: "#6366f1",
  },
  {
    id: "curve32",
    name: "Botnoi Curve32 Monitor",
    specs: '32" 4K VA Panel · 144Hz · HDR1000 · USB-C 90W PD',
    description:
      "Stunning curved 4K display with ultra-smooth refresh rate. Perfect for gaming and productivity side-by-side.",
    category: "Monitors",
    price: 24900,
    image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&q=80&auto=format&fit=crop",
    badge: "New",
    color: "#06b6d4",
  },
  {
    id: "mechkey",
    name: "BotnKey Mechanic Pro",
    specs: "Full-size · Cherry MX Red · RGB Backlit · PBT Keycaps",
    description:
      "Satisfying tactile feedback with ultra-responsive linear switches. Built for all-night coding and gaming sessions.",
    category: "Accessories",
    price: 4990,
    image: "https://images.unsplash.com/photo-1595225476474-87563907a212?w=600&q=80&auto=format&fit=crop",
    color: "#f59e0b",
  },
  {
    id: "airmouse",
    name: "Botnoi AirTrack Mouse",
    specs: "2.4GHz Wireless · 25,600 DPI · Optical Sensor · 70hr Battery",
    description:
      "Precision engineering in a lightweight, ergonomic shell. Near-zero latency, perfect for both office and competitive gaming.",
    category: "Accessories",
    price: 3290,
    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600&q=80&auto=format&fit=crop",
    color: "#10b981",
  },
  {
    id: "headset",
    name: "Botnoi SoundSphere ANC",
    specs: "Active Noise Cancelling · Hybrid ANC · 30hr · Hi-Res Audio",
    description:
      "Immerse yourself in studio-quality sound with industry-leading noise cancellation. Crystal-clear mic for calls and meetings.",
    category: "Audio",
    price: 9990,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80&auto=format&fit=crop",
    badge: "Top Pick",
    color: "#8b5cf6",
  },
  {
    id: "mate80pro",
    name: "HUAWEI Mate 80 Pro",
    specs: '6.75" LTPO OLED · 16GB RAM · 512GB ROM · 50MP Triple Camera',
    description:
      "HUAWEI Mate 80 Pro comes with a 6.75-inch LTPO OLED display (2832×1280, 1-120Hz), 7.95mm slim body, IP68/IP69 rating, RAM 16 GB + ROM 512 GB, and a 5,750 mAh battery with 100W fast charging.",
    category: "Phone",
    price: 43990,
    image: huaweiMate80Pro,
    badge: "Hot",
    color: "#b91c1c",
  },
  // Page 2 Placeholders
  {
    id: "laptop2",
    name: "Botnoi LiteBook 14",
    specs: 'Intel Core i5 · 16GB RAM · 512GB SSD · 14" IPS',
    description: "Ultra-portable daily laptop designed for students and remote workspace flexibility.",
    category: "Laptops",
    price: 29900,
    image: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600&q=80&auto=format&fit=crop",
    color: "#6366f1",
  },
  {
    id: "monitor2",
    name: "Botnoi Flat27 Monitor",
    specs: '27" QHD IPS · 75Hz · borderless bezel',
    description: "Perfect home-office monitor featuring true-color IPS display and eye-comfort protection mode.",
    category: "Monitors",
    price: 9900,
    image: "https://images.unsplash.com/photo-1547082299-de196ea013d6?w=600&q=80&auto=format&fit=crop",
    color: "#06b6d4",
  },
  {
    id: "matex7",
    name: "HUAWEI Mate X7",
    specs: '8.0" OLED Foldable · 16GB RAM · 512GB ROM · 50MP Camera',
    description:
      "HUAWEI Mate X7 is a foldable smartphone with an 8-inch main OLED screen, 16 GB RAM + 512 GB ROM, 5,600 mAh battery supporting 66W wired charging, and a 50 MP Ultra Lighting camera.",
    category: "Phone",
    price: 69990,
    image: huaweiMateX7,
    badge: "Premium Fold",
    color: "#b91c1c",
  },
  {
    id: "audio2",
    name: "Botnoi SoundPod Mini",
    specs: "Bluetooth 5.3 · IPX7 Waterproof · 10 Hours Playtime",
    description: "Compact wireless speaker delivering surprisingly rich bass and immersive 360-degree soundstage.",
    category: "Audio",
    price: 1990,
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&q=80&auto=format&fit=crop",
    color: "#8b5cf6",
  },
  {
    id: "acc2",
    name: "Botnoi Wireless Charger 3-in-1",
    specs: "15W Fast Charge · QI Certified · LED Status Indicator",
    description: "Charge your smartphone, smartwatch, and wireless earbuds concurrently with a single premium desk stand.",
    category: "Accessories",
    price: 1290,
    image: "https://images.unsplash.com/photo-1622445262465-2481c4574875?w=600&q=80&auto=format&fit=crop",
    color: "#10b981",
  },
  {
    id: "laptop3",
    name: "Botnoi WorkStation Pro 17",
    specs: 'Ryzen 9 · 64GB RAM · 2TB NVMe · RTX 4080 16GB',
    description: "Mobile computing workstation tailored for 3D rendering, machine learning models, and extreme multitasking.",
    category: "Laptops",
    price: 129900,
    image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=600&q=80&auto=format&fit=crop",
    badge: "Workstation",
    color: "#6366f1",
  },
  // Page 3 Placeholders
  {
    id: "monitor3",
    name: "Botnoi UltraWide 34",
    specs: '34" Curved WQHD · 165Hz · 21:9 aspect ratio',
    description: "Panoramic ultrawide curve display. Experience next-tier timeline editing and immersive simulator gaming.",
    category: "Monitors",
    price: 34900,
    image: "https://images.unsplash.com/photo-1616763355548-1b606f439f86?w=600&q=80&auto=format&fit=crop",
    color: "#06b6d4",
  },
  {
    id: "matext",
    name: "HUAWEI Mate XT ULTIMATE DESIGN",
    specs: '10.2" Tri-Fold OLED · Kirin 9010 · 16GB RAM · 1TB ROM · IPX8',
    description:
      "HUAWEI Mate XT ULTIMATE DESIGN features a triple-folding (Tri-fold) OLED screen expandable to 10.2 inches, Kirin 9010 chip, RAM 16 GB + ROM 1 TB, and 3.6mm ultra-slim body.",
    category: "Phone",
    price: 109990,
    image: huaweiMateXT,
    badge: "Ultimate Tri-Fold",
    color: "#b91c1c",
  },
  {
    id: "audio3",
    name: "Botnoi SoundBar Cinema",
    specs: "Dolby Atmos 5.1 · Wireless Subwoofer · 400W Power Output",
    description: "Transform your living room into a high-fidelity home cinema. Immersive surround acoustics with optical support.",
    category: "Audio",
    price: 14900,
    image: "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=600&q=80&auto=format&fit=crop",
    color: "#8b5cf6",
  },
  {
    id: "acc3",
    name: "Botnoi USB-C Hub 8-in-1",
    specs: "HDMI 4K @60Hz · 100W PD · SD Card Reader · Gigabit Ethernet",
    description: "Expand your thin laptop's port limits. Full aluminum heat dissipation shell with high-speed data lanes.",
    category: "Accessories",
    price: 1890,
    image: "https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=600&q=80&auto=format&fit=crop",
    color: "#10b981",
  },
  {
    id: "laptop4",
    name: "Botnoi Book Flip 13",
    specs: 'Intel Ultra 7 · 16GB RAM · 512GB · 13.4" Touch 360°',
    description: "Convertible 2-in-1 touchscreen notebook. Flip, fold, sketch, and present with responsive active stylus support.",
    category: "Laptops",
    price: 45900,
    image: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=600&q=80&auto=format&fit=crop",
    color: "#6366f1",
  },
  {
    id: "monitor4",
    name: "Botnoi Studio Display 27",
    specs: '27" 5K Retina · 600 nits · Studio-quality microphone array',
    description: "Elite 5K resolution display tailored for photographers, video colorists, and computational designers.",
    category: "Monitors",
    price: 59900,
    image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&q=80&auto=format&fit=crop",
    color: "#06b6d4",
  },
  // Page 4 Placeholders
  {
    id: "matex6",
    name: "HUAWEI Mate X6",
    specs: '7.93" OLED Foldable · Kirin 9020 · 12GB RAM · 512GB ROM',
    description:
      "HUAWEI Mate X6 features a 7.93-inch internal foldable OLED display, Kirin 9020 processor, 12 GB RAM + 512 GB ROM on EMUI 15.0, and 5,110 mAh battery supporting 66W fast charging.",
    category: "Phone",
    price: 59990,
    image: huaweiMateX6,
    color: "#b91c1c",
  },
  {
    id: "audio4",
    name: "Botnoi SoundBuds Active",
    specs: "Hybrid ANC · IPX5 Sweat Resistant · 32 Hours Total Playback",
    description: "True wireless athletic earbuds with secure ear-hook design. Pristine acoustics tuned for high-tempo training.",
    category: "Audio",
    price: 2990,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80&auto=format&fit=crop",
    color: "#8b5cf6",
  },
  {
    id: "acc4",
    name: "Botnoi Mechanical Keypad",
    specs: "21-Key Numpad · Gateron Yellow Switches · Hot-Swappable",
    description: "Programmable mechanical macro keypad. Essential side-companion for accounting audits or video layout hotkeys.",
    category: "Accessories",
    price: 1590,
    image: "https://images.unsplash.com/photo-1595225476474-87563907a212?w=600&q=80&auto=format&fit=crop",
    color: "#10b981",
  },
  {
    id: "laptop5",
    name: "Botnoi Gaming Titan 15",
    specs: 'Intel i9 · 32GB RAM · 1TB SSD · RTX 4070 · 240Hz screen',
    description: "High-FPS gaming laptop. Desktop-class thermal pipes ensure maximum clock performance on competitive lobbies.",
    category: "Laptops",
    price: 79900,
    badge: "Gaming",
    image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=600&q=80&auto=format&fit=crop",
    color: "#6366f1",
  },
  {
    id: "monitor5",
    name: "Botnoi Portable Touch 15",
    specs: '15.6" Full HD · USB-C Single-Cable · IPS Touchscreen Panel',
    description: "Ultra-slim portable secondary monitor. Add interactive workspace screen wherever your travel office calls.",
    category: "Monitors",
    price: 7900,
    image: "https://images.unsplash.com/photo-1547082299-de196ea013d6?w=600&q=80&auto=format&fit=crop",
    color: "#06b6d4",
  },
  {
    id: "mate50",
    name: "HUAWEI Mate 50",
    specs: '6.7" OLED (90Hz) · Snapdragon 8+ Gen 1 · 8GB RAM · 256GB ROM',
    description:
      "HUAWEI Mate 50 features a 6.7-inch OLED screen, Snapdragon 8+ Gen 1 4G chipset, 8 GB RAM + 256 GB ROM, and a 4,460 mAh battery with 66W SuperCharge.",
    category: "Phone",
    price: 24990,
    image: huaweiMate50,
    color: "#b91c1c",
  },
  // Page 5 Placeholders
  {
    id: "audio5",
    name: "Botnoi SoundBox XL Bluetooth",
    specs: "80W Stereo · High-Res Wireless · NFC Pairing · Wooden shell",
    description: "Acoustic wooden speaker box. Premium room aesthetics paired with warm audio resonance and long battery charge.",
    category: "Audio",
    price: 5990,
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&q=80&auto=format&fit=crop",
    color: "#8b5cf6",
  },
  {
    id: "acc5",
    name: "Botnoi Vertical Ergonomic Mouse",
    specs: "57-degree angle · 4000 DPI · Bluetooth/2.4GHz rechargeable",
    description: "Scientifically tested vertical grip. Relieve forearm stress and wrist muscle fatigue during long office sessions.",
    category: "Accessories",
    price: 2490,
    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600&q=80&auto=format&fit=crop",
    color: "#10b981",
  },
  {
    id: "laptop6",
    name: "Botnoi NetBook Cloud",
    specs: 'Celeron N4020 · 4GB RAM · 64GB eMMC · 11.6" Screen',
    description: "Featherweight cloud computing notebook. Long battery life tailored for browser work, email check, and reading.",
    category: "Laptops",
    price: 12900,
    image: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600&q=80&auto=format&fit=crop",
    color: "#6366f1",
  },
  {
    id: "monitor6",
    name: "Botnoi Smart TV Monitor 43",
    specs: '43" UHD 4K · Integrated Tizen Smart Hub · Remote control',
    description: "Huge multipurpose smart screen. Switch instantly from workstation monitor to media streaming applications.",
    category: "Monitors",
    price: 18900,
    image: "https://images.unsplash.com/photo-1616763355548-1b606f439f86?w=600&q=80&auto=format&fit=crop",
    color: "#06b6d4",
  },
  {
    id: "matexs2",
    name: "HUAWEI Mate Xs 2",
    specs: '7.8" Outward Fold OLED · Snapdragon 888 4G · 8GB RAM · 512GB ROM',
    description:
      "HUAWEI Mate Xs 2 is an outward-folding smartphone featuring a 7.8-inch OLED screen, Snapdragon 888 4G chipset, 8 GB RAM + 512 GB ROM, and 50 MP True-Chroma camera.",
    category: "Phone",
    price: 39990,
    image: huaweiMateXs2,
    color: "#b91c1c",
  },
  {
    id: "audio6",
    name: "Botnoi SoundStudio Pro",
    specs: "50mm Drivers · Wired Over-Ear · Studio Monitor acoustics",
    description: "Flat-response acoustic mixing headphones. Ultra-comfortable velour pads for studio engineering sessions.",
    category: "Audio",
    price: 8900,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80&auto=format&fit=crop",
    color: "#8b5cf6",
  },
];

const categories: ITCategory[] = ["All Products", "Laptops", "Monitors", "Audio", "Accessories", "Phone"];

const money = new Intl.NumberFormat("th-TH", {
  style: "currency",
  currency: "THB",
  maximumFractionDigits: 0,
});

// ─── Component ──────────────────────────────────────────────────────────────
export default function ITStoreDemo() {
  const { t, language } = useTranslation();

  const getProductTranslation = (id: string, field: "name" | "specs" | "desc", fallback: string) => {
    const key = `itstore_item.${id}.${field}` as TranslationKey;
    const translated = t(key);
    return translated === key ? fallback : translated;
  };

  const [activeCategory, setActiveCategory] = useState<ITCategory>("All Products");
  const [cart, setCart] = useState<ITCart>({});
  const [order, setOrder] = useState<ITOrder | null>(null);
  const [invoiceOpen, setInvoiceOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedProducts, setExpandedProducts] = useState<Record<string, boolean>>({});

  const toggleExpand = (productId: string) => {
    setExpandedProducts((prev) => ({ ...prev, [productId]: !prev[productId] }));
  };

  // Reset page when category changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory]);
  const [ready, setReady] = useState(false);
  const cartRef = useRef<HTMLElement>(null);

  // Load from localStorage
  useEffect(() => {
    try {
      const savedCart = window.localStorage.getItem(CART_KEY);
      const savedOrder = window.localStorage.getItem(ORDER_KEY);
      if (savedCart) setCart(JSON.parse(savedCart) as ITCart);
      if (savedOrder) setOrder(JSON.parse(savedOrder) as ITOrder);
    } catch {
      window.localStorage.removeItem(CART_KEY);
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) window.localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }, [cart, ready]);

  const visibleProducts =
    activeCategory === "All Products"
      ? products
      : products.filter((p) => p.category === activeCategory);

  const totalPages = Math.ceil(visibleProducts.length / 6);

  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * 6;
    return visibleProducts.slice(start, start + 6);
  }, [visibleProducts, currentPage]);

  const cartItems = useMemo(
    () =>
      products
        .filter((p) => (cart[p.id] ?? 0) > 0)
        .map((p) => ({ ...p, quantity: cart[p.id] ?? 0 })),
    [cart]
  );

  const itemCount = cartItems.reduce((s, i) => s + i.quantity, 0);
  const subtotal = cartItems.reduce((s, i) => s + i.price * i.quantity, 0);
  const shipping = 0; // free shipping

  const changeQty = (id: string, delta: number) => {
    setCart((prev) => {
      const next = Math.max(0, (prev[id] ?? 0) + delta);
      const updated = { ...prev, [id]: next };
      if (next === 0) delete updated[id];
      return updated;
    });
  };

  const checkout = () => {
    if (cartItems.length === 0) return;
    const newOrder: ITOrder = {
      orderId: `IT${Date.now().toString().slice(-7)}`,
      orderedAt: new Date().toISOString(),
      items: cartItems,
      subtotal,
      shipping,
      total: subtotal + shipping,
    };
    window.localStorage.setItem(ORDER_KEY, JSON.stringify(newOrder));
    try {
      const prev = window.localStorage.getItem(ORDERS_KEY);
      const list: ITOrder[] = prev ? JSON.parse(prev) : [];
      list.unshift(newOrder);
      window.localStorage.setItem(ORDERS_KEY, JSON.stringify(list));
    } catch { /* */ }
    setOrder(newOrder);
    setCart({});
    setInvoiceOpen(true);
  };

  const getCategoryLabel = (cat: ITCategory) => {
    switch (cat) {
      case "All Products": return t("itstore.category_all");
      case "Laptops": return t("itstore.category_laptops");
      case "Monitors": return t("itstore.category_monitors");
      case "Audio": return t("itstore.category_audio");
      case "Accessories": return t("itstore.category_accessories");
      case "Phone": return t("itstore.category_phone");
    }
  };

 return (
    <>
      <AnimatePresence>
        {!ready && <PageSkeleton variant="order" />}
      </AnimatePresence>

      <div className="itstore-theme min-h-screen w-full max-w-full overflow-x-hidden bg-background text-foreground page-grid">

        {/* ── Header ─────────────────────────────────────────────────────── */}
        <header className="sticky top-4 z-20 mx-auto my-4 w-[calc(100%-2rem)] max-w-7xl bg-background/80 backdrop-blur-md border border-foreground/10 rounded-2xl shadow-lg transition-all">
          <div className="px-6 py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <nav className="flex items-center gap-2 text-xs text-foreground/60 font-bold" aria-label="Breadcrumb">
              <Link to="/" className="hover:text-indigo-500 transition-colors flex items-center gap-1">
                <Home className="size-3" />
                <span>{t('nav.home')}</span>
              </Link>
              <ChevronRight className="size-3 text-foreground/30" />
              <Link to="/all-demo" className="hover:text-indigo-500 transition-colors">
                <span>{t('showcase.portal')}</span>
              </Link>
              <ChevronRight className="size-3 text-foreground/30" />
              <span className="text-foreground font-extrabold uppercase font-mono">
                {t("nav.itstore") || 'IT Store'}
              </span>
            </nav>

            <nav className="flex items-center gap-3 text-sm font-semibold">
              {order && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setInvoiceOpen(true)}
                  className="text-foreground/70 hover:text-foreground gap-1.5 font-bold hover:bg-foreground/5 rounded-full px-3 py-1.5 transition-colors"
                  id="itstore-view-invoice"
                >
                  <ReceiptText className="size-4" />
                  <span>{t("itstore.nav_receipt")}</span>
                </Button>
              )}
              <Link
                to="/it-store-demo/admin"
                className="px-4 py-1.5 rounded-full bg-foreground/5 hover:bg-foreground/10 transition-all border border-foreground/10 text-foreground text-xs font-bold"
                id="nav-itstore-admin"
              >
                {t("itstore.nav_admin")}
              </Link>
              <button
                className="relative flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold text-white transition-all"
                style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)" }}
                onClick={() => cartRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })}
                id="itstore-cart-btn"
              >
                <ShoppingCart className="size-4" />
                {language === "en" ? "Cart" : t("itstore.nav_cart")}
                <span className="absolute -top-1.5 -right-1.5 min-w-5 h-5 rounded-full bg-white text-indigo-600 text-xs font-extrabold flex items-center justify-center shadow px-1">
                  {itemCount}
                </span>
              </button>
            </nav>
          </div>
        </header>

        {/* ── Hero Banner ─────────────────────────────────────────────────── */}
        <section
          className="relative overflow-hidden bg-gradient-to-br from-indigo-500/10 via-background to-emerald-500/10"
          style={{
            padding: "4rem 1.5rem 3rem",
          }}
        >
          {/* Decorative blobs */}
          <div
            style={{
              position: "absolute", top: "-60px", right: "-60px",
              width: 320, height: 320, borderRadius: "50%",
              background: "radial-gradient(circle,rgba(99,102,241,0.12) 0%,transparent 70%)",
              pointerEvents: "none",
            }}
          />
          <div
            style={{
              position: "absolute", bottom: "-40px", left: "-40px",
              width: 220, height: 220, borderRadius: "50%",
              background: "radial-gradient(circle,rgba(139,92,246,0.10) 0%,transparent 70%)",
              pointerEvents: "none",
            }}
          />
          <div className="mx-auto max-w-7xl relative z-10 flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1 text-center md:text-left">
              <span
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold mb-4"
                style={{ background: "rgba(99,102,241,0.1)", color: "#6366f1", border: "1px solid rgba(99,102,241,0.2)" }}
              >
                <Zap size={12} />
                {t("itstore.badge")}
              </span>
              <h1
                className="font-extrabold tracking-tight mb-3 text-foreground"
                style={{ fontSize: "clamp(2rem,5vw,3rem)", lineHeight: 1.15, background: 'none', WebkitTextFillColor: 'initial' }}
                id="itstore-hero-title"
              >
                {t("itstore.hero_title")}
              </h1>
              <p className="text-foreground/70 text-base max-w-lg" style={{ lineHeight: 1.65 }}>
                {t("itstore.hero_desc")}
              </p>
            </div>

            
          </div>
        </section>

        {/* ── Main Content ─────────────────────────────────────────────────── */}
        <div className="mx-auto w-full max-w-7xl px-4 py-8 pb-32 sm:px-6 lg:grid lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-8 lg:px-8 lg:pb-12">

          {/* ── Products Section ────────────────────────────────────────── */}
          <section aria-labelledby="products-heading" className="min-w-0 overflow-hidden" id="itstore-products">
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "#6366f1" }}>
                  {t("itstore.select_products")}
                </p>
                <h2 id="products-heading" className="font-extrabold text-3xl tracking-tight text-foreground">
                  {t("itstore.all_products_title")}
                </h2>
              </div>
              <p className="text-xs text-foreground/50 font-bold">
                {visibleProducts.length} {t("itstore.items_count")}
              </p>
            </div>

            {/* Category Pills */}
            <div
              className="mb-8 flex gap-2 overflow-x-auto whitespace-nowrap pb-3 -mx-4 px-4 scrollbar-hide snap-x"
              role="tablist"
              aria-label={t("itstore.categories_label")}
            >
              {categories.map((cat) => {
                const active = activeCategory === cat;
                return (
                  <button
                    key={cat}
                    className={`relative shrink-0 snap-start px-5 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer border ${active
                        ? "border-transparent text-white"
                        : "text-foreground/60 border-foreground/10 hover:text-foreground hover:bg-foreground/5"
                      }`}
                    style={active ? { background: "linear-gradient(135deg,#6366f1,#8b5cf6)" } : {}}
                    onClick={() => setActiveCategory(cat)}
                    role="tab"
                    aria-selected={active}
                    id={`itstore-cat-${cat.toLowerCase().replace(/\s+/g, "-")}`}
                  >
                    {getCategoryLabel(cat)}
                  </button>
                );
              })}
            </div>

            {/* Product Grid */}
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 gap-5"
            >
              <AnimatePresence mode="popLayout">
                {paginatedProducts.map((product) => {
                  const qty = cart[product.id] ?? 0;
                  const inCart = qty > 0;
                  return (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.96 }}
                      transition={{ duration: 0.2 }}
                      className="w-full"
                    >
                      <div
                        className="group relative flex flex-col overflow-hidden rounded-2xl border border-foreground/10 bg-background shadow-sm transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-xl h-full"
                        id={`itstore-product-${product.id}`}
                      >
                        {/* Image */}
                        <div
                          className="relative overflow-hidden p-4 bg-foreground/5"
                          style={{ height: 200 }}
                        >
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                            loading="lazy"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                `https://placehold.co/600x400/eef2ff/6366f1?text=${encodeURIComponent(product.name)}`;
                            }}
                          />
                          {/* Badge */}
                          {product.badge && (
                            <span
                              className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-bold text-white"
                              style={{ background: product.color }}
                            >
                              {product.badge}
                            </span>
                          )}
                          {/* In cart overlay */}
                          {inCart && (
                            <div
                              className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-xs"
                            >
                              <div
                                className="flex items-center gap-3 px-4 py-2.5 rounded-full font-bold text-white shadow-lg"
                                style={{ background: product.color }}
                              >
                                <button
                                  onClick={() => changeQty(product.id, -1)}
                                  className="w-6 h-6 rounded-full bg-white/30 flex items-center justify-center hover:bg-white/50 transition text-white"
                                  id={`itstore-minus-${product.id}`}
                                >
                                  <Minus size={12} />
                                </button>
                                <span className="min-w-[1.5rem] text-center text-sm">{qty}</span>
                                <button
                                  onClick={() => changeQty(product.id, 1)}
                                  className="w-6 h-6 rounded-full bg-white/30 flex items-center justify-center hover:bg-white/50 transition text-white"
                                  id={`itstore-plus-${product.id}`}
                                >
                                  <Plus size={12} />
                                </button>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Info */}
                        <div className="flex flex-col flex-1 p-5 gap-3">
                          <div>
                            <h3 className="font-extrabold text-foreground text-base leading-tight mb-1">
                              {getProductTranslation(product.id, "name", product.name)}
                            </h3>
                            <p
                              className="text-xs font-semibold mb-2"
                              style={{ color: product.color }}
                            >
                              {t("itstore.speci")}: {getProductTranslation(product.id, "specs", product.specs)}
                            </p>
                             <div>
                              <p className="text-sm text-foreground/70 leading-relaxed inline">
                                {(() => {
                                  const desc = getProductTranslation(product.id, "desc", product.description);
                                  const isExpanded = expandedProducts[product.id];
                                  if (desc.length > 110 && !isExpanded) {
                                    return (
                                      <>
                                        {desc.slice(0, 110)}...{" "}
                                        <button
                                          onClick={() => toggleExpand(product.id)}
                                          className="text-xs font-bold text-indigo-500 hover:text-indigo-600 transition ml-1 inline cursor-pointer"
                                        >
                                          {t("itstore.read_more" as TranslationKey)}
                                        </button>
                                      </>
                                    );
                                  }
                                  return (
                                    <>
                                      {desc}{" "}
                                      {desc.length > 110 && (
                                        <button
                                          onClick={() => toggleExpand(product.id)}
                                          className="text-xs font-bold text-indigo-500 hover:text-indigo-600 transition ml-1 inline cursor-pointer"
                                        >
                                          {t("itstore.read_less" as TranslationKey)}
                                        </button>
                                      )}
                                    </>
                                  );
                                })()}
                              </p>
                            </div>
                          </div>

                          <div className="mt-auto flex items-center justify-between gap-3">
                            <div className="font-extrabold text-xl text-foreground">
                              {money.format(product.price)}
                            </div>
                            {!inCart ? (
                              <button
                                onClick={() => changeQty(product.id, 1)}
                                className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold text-white transition-all hover:scale-105 active:scale-95"
                                style={{ background: product.color }}
                                id={`itstore-add-${product.id}`}
                              >
                                <Plus size={14} /> {t("itstore.btn_add")}
                              </button>
                            ) : (
                              <span
                                className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold text-white"
                                style={{ background: product.color, opacity: 0.85 }}
                              >
                                <Check size={14} /> {t("itstore.btn_in_cart")}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </motion.div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="mt-12 flex items-center justify-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full w-10 h-10 flex items-center justify-center border border-foreground/10 bg-transparent text-foreground/60 hover:text-foreground hover:bg-foreground/5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  disabled={currentPage === 1}
                  onClick={() => {
                    setCurrentPage(prev => Math.max(1, prev - 1));
                    document.getElementById('itstore-products')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  &larr;
                </Button>
                {Array.from({ length: totalPages }).map((_, idx) => {
                  const pageNum = idx + 1;
                  const active = currentPage === pageNum;
                  return (
                    <button
                      key={pageNum}
                      className={`w-10 h-10 rounded-full text-sm font-bold transition-all border cursor-pointer ${
                        active
                          ? "border-transparent text-white"
                          : "text-foreground/60 border-foreground/10 bg-transparent hover:text-foreground hover:bg-foreground/5"
                      }`}
                      style={active ? { background: "linear-gradient(135deg,#6366f1,#8b5cf6)" } : {}}
                      onClick={() => {
                        setCurrentPage(pageNum);
                        document.getElementById('itstore-products')?.scrollIntoView({ behavior: 'smooth' });
                      }}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full w-10 h-10 flex items-center justify-center border border-foreground/10 bg-transparent text-foreground/60 hover:text-foreground hover:bg-foreground/5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  disabled={currentPage === totalPages}
                  onClick={() => {
                    setCurrentPage(prev => Math.min(totalPages, prev + 1));
                    document.getElementById('itstore-products')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  &rarr;
                </Button>
              </div>
            )}
          </section>

          {/* ── Cart Sidebar ─────────────────────────────────────────────── */}
          <aside
            ref={cartRef as React.RefObject<HTMLDivElement>}
            className="itstore-cart-sidebar"
            aria-label="Shopping Cart"
            id="itstore-cart"
          >
            <div className="sticky top-24">
              <div
                className="rounded-2xl border border-foreground/10 bg-background overflow-hidden shadow-sm"
              >
                {/* Cart header */}
                <div
                  className="px-6 py-4 border-b border-foreground/10 flex items-center justify-between bg-foreground/5"
                >
                  <div className="flex items-center gap-2">
                    <ShoppingCart size={18} style={{ color: "#6366f1" }} />
                    <span className="font-extrabold text-foreground text-sm">{t("itstore.cart_title")}</span>
                  </div>
                  <span
                    className="px-2 py-0.5 rounded-full text-xs font-extrabold text-white"
                    style={{ background: "#6366f1", minWidth: 22, textAlign: "center" }}
                  >
                    {itemCount}
                  </span>
                </div>

                {/* Cart items */}
                <div className="divide-y divide-foreground/10 max-h-80 overflow-y-auto">
                  <AnimatePresence>
                    {cartItems.length === 0 ? (
                      <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="px-6 py-10 text-center text-foreground/50 text-sm"
                      >
                        <ShoppingCart size={36} className="mx-auto mb-3 opacity-30" />
                        {t("itstore.cart_empty")}
                      </motion.div>
                    ) : (
                      cartItems.map((item) => (
                        <motion.div
                          key={item.id}
                          layout
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          className="flex items-center gap-3 px-4 py-3"
                        >
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-12 h-12 rounded-xl object-cover border border-foreground/10 flex-shrink-0"
                            loading="lazy"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                `https://placehold.co/48x48/eef2ff/6366f1?text=IT`;
                            }}
                          />
                          <div className="flex-1 min-w-0">
                            <div className="font-bold text-foreground text-xs leading-tight truncate">
                              {getProductTranslation(item.id, "name", item.name)}
                            </div>
                            <div className="text-xs text-foreground/60 mt-0.5">{money.format(item.price)}</div>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => changeQty(item.id, -1)}
                              className="w-6 h-6 rounded-full border border-foreground/10 flex items-center justify-center text-foreground/60 hover:border-red-400 hover:text-red-500 transition-colors"
                              id={`cart-minus-${item.id}`}
                            >
                              {item.quantity === 1 ? <Trash2 size={10} /> : <Minus size={10} />}
                            </button>
                            <span className="text-xs font-bold w-4 text-center text-foreground">{item.quantity}</span>
                            <button
                              onClick={() => changeQty(item.id, 1)}
                              className="w-6 h-6 rounded-full border border-foreground/10 flex items-center justify-center text-foreground/60 hover:border-indigo-400 hover:text-indigo-500 transition-colors"
                              id={`cart-plus-${item.id}`}
                            >
                              <Plus size={10} />
                            </button>
                          </div>
                        </motion.div>
                      ))
                    )}
                  </AnimatePresence>
                </div>

                {/* Cart summary */}
                <div className="px-6 py-4 border-t border-foreground/10 space-y-2">
                  <div className="flex justify-between text-sm text-foreground/70">
                    <span>{t("itstore.cart_subtotal")}</span>
                    <span className="font-semibold text-foreground">{money.format(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-foreground/70">
                    <span>{t("itstore.cart_shipping")}</span>
                    <span className="font-semibold text-emerald-500">{t("itstore.cart_shipping_free")}</span>
                  </div>
                  <div className="flex justify-between text-base font-extrabold text-foreground pt-10 border-t border-foreground/10">
                    <span>{t("itstore.cart_total")}</span>
                    <span style={{ color: "#6366f1" }}>{money.format(subtotal)}</span>
                  </div>
                  <button
                    onClick={checkout}
                    disabled={cartItems.length === 0}
                    className="w-full mt-3 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-extrabold text-white transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-40 disabled:pointer-events-none"
                    style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)" }}
                    id="itstore-checkout-btn"
                  >
                    <ChevronRight size={16} /> {t("itstore.cart_checkout")}
                  </button>
                </div>
              </div>
            </div>
          </aside>
        </div>

        {/* ── Invoice Dialog ─────────────────────────────────────────────── */}
        <Dialog open={invoiceOpen} onOpenChange={setInvoiceOpen}>
          <DialogContent className="max-w-md bg-background text-foreground border-foreground/10" id="itstore-invoice-dialog">
            <DialogHeader>
              <DialogTitle className="font-extrabold text-xl flex items-center gap-2 text-foreground">
                <ReceiptText size={20} style={{ color: "#6366f1" }} />
                {t("itstore.receipt_title")}
              </DialogTitle>
              <DialogDescription className="text-foreground/70">
                {t("itstore.receipt_id")}: <strong className="text-foreground">{order?.orderId}</strong>
                <br />
                {t("itstore.receipt_time")}: {order?.orderedAt ? formatOrderDate(order.orderedAt, language) : ""}
              </DialogDescription>
            </DialogHeader>
            {order && (
              <div className="space-y-3 mt-2">
                <div className="divide-y divide-foreground/10 rounded-xl border border-foreground/10 overflow-hidden">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 px-4 py-3 bg-foreground/5">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-10 h-10 rounded-lg object-cover border border-foreground/10 flex-shrink-0"
                        loading="lazy"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-bold text-foreground leading-tight truncate">
                          {getProductTranslation(item.id, "name", item.name)}
                        </div>
                        <div className="text-xs text-foreground/60">{money.format(item.price)} × {item.quantity}</div>
                      </div>
                      <div className="text-xs font-extrabold" style={{ color: "#6366f1" }}>
                        {money.format(item.price * item.quantity)}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="rounded-xl border border-foreground/10 px-4 py-3 space-y-1.5 bg-background">
                  <div className="flex justify-between text-sm text-foreground/70">
                    <span>{t("itstore.cart_subtotal")}</span>
                    <span className="text-foreground font-semibold">{money.format(order.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-foreground/70">
                    <span>{t("itstore.cart_shipping")}</span>
                    <span className="text-emerald-500 font-semibold">{t("itstore.cart_shipping_free")}</span>
                  </div>
                  <div className="flex justify-between text-base font-extrabold text-foreground border-t border-foreground/10 pt-10">
                    <span>{t("itstore.cart_total")}</span>
                    <span style={{ color: "#6366f1" }}>{money.format(order.total)}</span>
                  </div>
                </div>
                <Button
                  variant="outline"
                  className="w-full font-bold border-foreground/10 text-foreground hover:bg-foreground/5 transition-colors"
                  onClick={() => setInvoiceOpen(false)}
                  id="itstore-close-invoice"
                >
                  {t("itstore.receipt_close")}
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>

      </div>
    </>
  );
}//