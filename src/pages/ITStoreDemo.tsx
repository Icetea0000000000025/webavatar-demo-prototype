import {
  Check,
  ChevronRight,
  ChevronLeft,
  Minus,
  Plus,
  ReceiptText,
  ShoppingCart,
  Trash2,
  Zap,
  Home,
  Search,
  SlidersHorizontal,
  Sparkles,
  Eye,
  Tag,
  X,
  Star,
  CheckCircle2,
  Cpu,
  ShieldCheck,
  Clock,
  LayoutGrid,
  Smartphone,
  Laptop,
  Monitor,
  Headphones,
  Layers,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation, type TranslationKey } from "@/lib/LanguageContext";
import PageSkeleton from "@/components/PageSkeleton";
import SkeletonImage from "@/components/SkeletonImage";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast, Toaster } from "sonner";
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
  specTags?: string[];
  rating?: number;
  salesCount?: number;
}

export interface ITOrder {
  orderId: string;
  orderedAt: string;
  items: Array<ITProduct & { quantity: number }>;
  subtotal: number;
  discount?: number;
  promoCode?: string;
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
// ─── Product Catalogue (Proprietary Non-Infringing Tech Brands) ─────────────
const products: ITProduct[] = [
  // ── Laptops (9 items) ─────────────────────────────────────────────────────
  {
    id: "probook",
    name: "Botnoi ProBook Ultra 16",
    specs: 'Next-Gen AI Core Ultra 9 · 32GB RAM · 1TB NVMe · 16" OLED 120Hz',
    description:
      "The ultimate workhorse laptop for power users and creative professionals. Blazing performance meets all-day battery life with an edge-to-edge 120Hz OLED display.",
    category: "Laptops",
    price: 89900,
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&q=80&auto=format&fit=crop",
    badge: "Best Seller",
    color: "#6366f1",
    specTags: ["Ultra 9 AI", "32GB RAM", "1TB SSD", "16\" OLED"],
    rating: 4.9,
    salesCount: 342,
  },
  {
    id: "laptop2",
    name: "Botnoi LiteBook 14",
    specs: 'Core Performance i5 · 16GB RAM · 512GB SSD · 14" IPS',
    description: "Ultra-portable daily laptop designed for students and remote workspace flexibility with 14-hour battery endurance.",
    category: "Laptops",
    price: 29900,
    image: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600&q=80&auto=format&fit=crop",
    color: "#6366f1",
    specTags: ["Core i5", "16GB RAM", "14\" IPS 100% sRGB"],
    rating: 4.6,
    salesCount: 215,
  },
  {
    id: "laptop3",
    name: "Botnoi WorkStation Pro 17",
    specs: 'Octa-Core Performance 9 · 64GB RAM · 2TB NVMe · Pro Graphics 16GB',
    description: "Mobile computing monster workstation tailored for 3D rendering, machine learning training, and extreme multitasking.",
    category: "Laptops",
    price: 129900,
    image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=600&q=80&auto=format&fit=crop",
    badge: "Workstation",
    color: "#6366f1",
    specTags: ["Octa-Core 9", "64GB RAM", "Pro GPU 16GB", "2TB NVMe"],
    rating: 5.0,
    salesCount: 95,
  },
  {
    id: "laptop4",
    name: "Botnoi Book Flip 13",
    specs: 'AI Core Ultra 7 · 16GB RAM · 512GB · 13.4" Touch 360°',
    description: "Convertible 2-in-1 touchscreen notebook. Flip, fold, sketch, and present with responsive active stylus support.",
    category: "Laptops",
    price: 45900,
    image: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=600&q=80&auto=format&fit=crop",
    color: "#6366f1",
    specTags: ["360° Flip Touch", "AI Ultra 7", "Stylus Pen Included"],
    rating: 4.8,
    salesCount: 175,
  },
  {
    id: "laptop5",
    name: "Botnoi Gaming Titan 15",
    specs: 'Core Performance i9 · 32GB RAM · 1TB SSD · Pro Graphics 8GB · 240Hz screen',
    description: "High-FPS competitive gaming laptop. Dual vapor-chamber thermal system ensures maximum boost clocks in esports lobbies.",
    category: "Laptops",
    price: 79900,
    badge: "Gaming",
    image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=600&q=80&auto=format&fit=crop",
    color: "#6366f1",
    specTags: ["Core i9", "Pro GPU 8GB", "240Hz QHD Display"],
    rating: 4.9,
    salesCount: 195,
  },
  {
    id: "laptop6",
    name: "Botnoi NetBook Cloud",
    specs: 'Energy-Efficient Dual Core · 4GB RAM · 64GB eMMC · 11.6" Screen',
    description: "Featherweight cloud computing notebook. Long 12-hour battery life tailored for browser work, email triage, and reading.",
    category: "Laptops",
    price: 12900,
    image: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600&q=80&auto=format&fit=crop",
    color: "#6366f1",
    specTags: ["11.6\" Compact", "Fanless Silent", "1.1kg Featherweight"],
    rating: 4.4,
    salesCount: 190,
  },
  {
    id: "laptop7",
    name: "Botnoi AeroBook Air 13",
    specs: '13.3" 2.8K OLED · AI Core Ultra 5 · 16GB RAM · 512GB SSD · 960g',
    description: "Featherweight 960g magnesium-lithium alloy chassis with a brilliant 2.8K 100% DCI-P3 OLED panel. Delivers up to 18 hours of battery life for mobile executives.",
    category: "Laptops",
    price: 38900,
    image: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=600&q=80&auto=format&fit=crop",
    badge: "Ultra-Light",
    color: "#6366f1",
    specTags: ["960g Ultralight", "2.8K OLED", "18h Battery"],
    rating: 4.8,
    salesCount: 165,
  },
  {
    id: "laptop8",
    name: "Botnoi CreatorStudio 16 Pro",
    specs: '16" Mini-LED 4K 165Hz · AI Core Ultra 9 · 64GB RAM · 4TB SSD · Pro GPU 16GB',
    description: "Master-tier creative workstation for 8K video colorists and AI developers. Dual vapor chambers with hardware-calibrated 1200-nit Mini-LED display.",
    category: "Laptops",
    price: 115000,
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&q=80&auto=format&fit=crop",
    badge: "Studio Grade",
    color: "#6366f1",
    specTags: ["Mini-LED 4K", "64GB RAM", "4TB SSD", "1200 Nits"],
    rating: 5.0,
    salesCount: 78,
  },
  {
    id: "laptop9",
    name: "Botnoi RuggedBook Tough 14",
    specs: '14" 1200-Nit Glove Touch · AI Core Ultra 7 · 32GB RAM · 1TB SSD · Mil-Std 810H',
    description: "Military-grade drop and water resistant rugged notebook. Sunlight-readable 1200-nit touchscreen with dual hot-swappable batteries for outdoor field work.",
    category: "Laptops",
    price: 54900,
    image: "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=600&q=80&auto=format&fit=crop",
    badge: "Mil-Spec",
    color: "#6366f1",
    specTags: ["Mil-Std 810H", "1200 Nits", "Hot-Swap Battery"],
    rating: 4.7,
    salesCount: 110,
  },

  // ── Monitors (9 items) ────────────────────────────────────────────────────
  {
    id: "curve32",
    name: "Botnoi Curve32 Monitor",
    specs: '32" 4K VA Panel · 144Hz · HDR1000 · USB-C 90W PD',
    description:
      "Stunning curved 4K display with ultra-smooth 144Hz refresh rate. Perfect for gaming, color grading, and dual-window multitasking.",
    category: "Monitors",
    price: 24900,
    image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&q=80&auto=format&fit=crop",
    badge: "New",
    color: "#06b6d4",
    specTags: ["32\" 4K 144Hz", "HDR1000", "90W USB-C PD"],
    rating: 4.8,
    salesCount: 198,
  },
  {
    id: "monitor2",
    name: "Botnoi Flat27 Monitor",
    specs: '27" QHD IPS · 75Hz · borderless bezel',
    description: "Perfect home-office monitor featuring true-color IPS display, low blue light certification, and eye-comfort protection mode.",
    category: "Monitors",
    price: 9900,
    image: "https://images.unsplash.com/photo-1547082299-de196ea013d6?w=600&q=80&auto=format&fit=crop",
    color: "#06b6d4",
    specTags: ["27\" QHD", "IPS Panel", "Eye-Care TUV"],
    rating: 4.7,
    salesCount: 160,
  },
  {
    id: "monitor3",
    name: "Botnoi UltraWide 34",
    specs: '34" Curved WQHD · 165Hz · 21:9 aspect ratio',
    description: "Panoramic ultrawide 1500R curve display. Experience cinematic timeline video editing and immersive simulator gaming.",
    category: "Monitors",
    price: 34900,
    image: "https://images.unsplash.com/photo-1616763355548-1b606f439f86?w=600&q=80&auto=format&fit=crop",
    color: "#06b6d4",
    specTags: ["34\" 21:9 WQHD", "165Hz 1ms", "1500R Curve"],
    rating: 4.9,
    salesCount: 140,
  },
  {
    id: "monitor4",
    name: "Botnoi Studio Display 27",
    specs: '27" 5K Retina · 600 nits · Studio-quality microphone array',
    description: "Elite 5K resolution display tailored for photographers, video colorists, and computational designers with DCI-P3 99%.",
    category: "Monitors",
    price: 59900,
    image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&q=80&auto=format&fit=crop",
    color: "#06b6d4",
    specTags: ["27\" 5K Retina", "600 Nits", "99% DCI-P3"],
    rating: 4.9,
    salesCount: 88,
  },
  {
    id: "monitor5",
    name: "Botnoi Portable Touch 15",
    specs: '15.6" Full HD · USB-C Single-Cable · IPS Touchscreen Panel',
    description: "Ultra-slim portable secondary monitor. Add interactive workspace screen wherever your mobile workstation sets up.",
    category: "Monitors",
    price: 7900,
    image: "https://images.unsplash.com/photo-1547082299-de196ea013d6?w=600&q=80&auto=format&fit=crop",
    color: "#06b6d4",
    specTags: ["15.6\" 1080p Touch", "Single-Cable Type-C", "650g Lightweight"],
    rating: 4.6,
    salesCount: 230,
  },
  {
    id: "monitor6",
    name: "Botnoi Smart TV Monitor 43",
    specs: '43" UHD 4K · Integrated Smart Hub · Remote control',
    description: "Massive multipurpose 4K display. Switch instantly from code editor workspace to media streaming applications with voice remote.",
    category: "Monitors",
    price: 18900,
    image: "https://images.unsplash.com/photo-1616763355548-1b606f439f86?w=600&q=80&auto=format&fit=crop",
    color: "#06b6d4",
    specTags: ["43\" 4K UHD", "Built-in Smart Hub", "Wireless Cast"],
    rating: 4.7,
    salesCount: 105,
  },
  {
    id: "monitor7",
    name: "Botnoi QuantumPro 49 Super UltraWide",
    specs: '49" Dual QHD 32:9 · 240Hz 0.03ms QD-OLED · 1800R · KVM Switch · 100W PD',
    description: "Massive 49-inch curved 32:9 gaming and financial cockpit display. Replaces dual monitors seamlessly with built-in hardware KVM and 240Hz QD-OLED perfection.",
    category: "Monitors",
    price: 49900,
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&q=80&auto=format&fit=crop",
    badge: "Super UltraWide",
    color: "#06b6d4",
    specTags: ["49\" 32:9 DQHD", "240Hz 0.03ms", "Hardware KVM"],
    rating: 4.9,
    salesCount: 92,
  },
  {
    id: "monitor8",
    name: "Botnoi TrueColor 27 Designer Pro",
    specs: '27" 4K IPS Black · Delta E < 1 · 100% sRGB / 98% DCI-P3 · Shading Hood Included',
    description: "Color-critical reference monitor for digital artists and print photographers. Factory calibrated with Delta E < 1 and magnetic anti-glare light hood.",
    category: "Monitors",
    price: 27900,
    image: "https://images.unsplash.com/photo-1547082299-de196ea013d6?w=600&q=80&auto=format&fit=crop",
    badge: "Delta E < 1",
    color: "#06b6d4",
    specTags: ["Delta E < 1", "IPS Black 2000:1", "Magnetic Hood"],
    rating: 4.8,
    salesCount: 135,
  },
  {
    id: "monitor9",
    name: "Botnoi DualView Stack 28",
    specs: '27.6" 16:18 Dual-QHD · Ergonomic Stand · Integrated 4K Webcam & Mic',
    description: "Unique square-format 16:18 aspect ratio stacking two displays vertically. Saves desk footprint while doubling vertical coding and document height.",
    category: "Monitors",
    price: 22900,
    image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&q=80&auto=format&fit=crop",
    badge: "16:18 Stack",
    color: "#06b6d4",
    specTags: ["16:18 Dual-QHD", "Space Saver", "4K Webcam"],
    rating: 4.7,
    salesCount: 118,
  },

  // ── Audio (9 items) ───────────────────────────────────────────────────────
  {
    id: "headset",
    name: "Botnoi SoundSphere ANC",
    specs: "Active Noise Cancelling · Hybrid ANC · 30hr · Hi-Res Audio",
    description:
      "Immerse yourself in studio-quality acoustics with dual-feed hybrid noise cancellation. Features AI beamforming microphones for crystal-clear calls.",
    category: "Audio",
    price: 9990,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80&auto=format&fit=crop",
    badge: "Top Pick",
    color: "#8b5cf6",
    specTags: ["Hybrid ANC", "Hi-Res Wireless", "30h Playback"],
    rating: 4.8,
    salesCount: 280,
  },
  {
    id: "audio2",
    name: "Botnoi SoundPod Mini",
    specs: "Bluetooth 5.3 · IPX7 Waterproof · 10 Hours Playtime",
    description: "Compact wireless speaker delivering surprisingly rich bass and immersive 360-degree soundstage with rugged water resistance.",
    category: "Audio",
    price: 1990,
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&q=80&auto=format&fit=crop",
    color: "#8b5cf6",
    specTags: ["BT 5.3", "IPX7 Waterproof", "360° Audio"],
    rating: 4.8,
    salesCount: 640,
  },
  {
    id: "audio3",
    name: "Botnoi SoundBar Cinema",
    specs: "Spatial Cinema 5.1 Surround · Wireless Subwoofer · 400W Power Output",
    description: "Transform your living room into a high-fidelity home cinema. Immersive surround acoustics with eARC and optical support.",
    category: "Audio",
    price: 14900,
    image: "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=600&q=80&auto=format&fit=crop",
    color: "#8b5cf6",
    specTags: ["Spatial 5.1", "400W Peak", "Wireless Sub"],
    rating: 4.8,
    salesCount: 110,
  },
  {
    id: "audio4",
    name: "Botnoi SoundBuds Active",
    specs: "Hybrid ANC · IPX5 Sweat Resistant · 32 Hours Total Playback",
    description: "True wireless athletic earbuds with secure ear-hook design. Pristine acoustics tuned for high-tempo training and sports.",
    category: "Audio",
    price: 2990,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80&auto=format&fit=crop",
    color: "#8b5cf6",
    specTags: ["Hybrid ANC", "IPX5 Sweatproof", "32h Case Battery"],
    rating: 4.7,
    salesCount: 390,
  },
  {
    id: "audio5",
    name: "Botnoi SoundBox XL Bluetooth",
    specs: "80W Stereo · High-Res Wireless · NFC Pairing · Wooden shell",
    description: "Acoustic handcrafted wooden speaker box. Warm analog resonance paired with modern lossless wireless codecs.",
    category: "Audio",
    price: 5990,
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&q=80&auto=format&fit=crop",
    color: "#8b5cf6",
    specTags: ["80W RMS", "Natural Wood Shell", "NFC One-Touch"],
    rating: 4.8,
    salesCount: 145,
  },
  {
    id: "audio6",
    name: "Botnoi SoundStudio Pro",
    specs: "50mm Drivers · Wired Over-Ear · Studio Monitor acoustics",
    description: "Flat-response acoustic mastering headphones. Ultra-comfortable velour earcups for extended audio engineering sessions.",
    category: "Audio",
    price: 8900,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80&auto=format&fit=crop",
    color: "#8b5cf6",
    specTags: ["50mm Neodymium", "5Hz-40kHz", "Detachable Cable"],
    rating: 4.9,
    salesCount: 115,
  },
  {
    id: "audio7",
    name: "Botnoi SpatialStage Earbuds Pro",
    specs: "True Lossless 24-bit · 3D Spatial Audio Head Tracking · 48dB Smart ANC · 36hr Battery",
    description: "High-resolution acoustic drivers delivering binaural spatial stage audio that rotates with head movement. Adaptive 48dB active noise cancelling for commuting.",
    category: "Audio",
    price: 4590,
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&q=80&auto=format&fit=crop",
    badge: "Spatial 3D",
    color: "#8b5cf6",
    specTags: ["Head Tracking", "48dB Smart ANC", "24-bit Lossless"],
    rating: 4.9,
    salesCount: 380,
  },
  {
    id: "audio8",
    name: "Botnoi SoundDesk HiFi Studio 2.0",
    specs: "Active Bi-Amp Desktop Monitors · Planar Ribbon Tweeters · Lossless BT 5.4 / Optical · 120W",
    description: "Audiophile-grade desktop active speakers featuring planar ribbon tweeters and carbon-fiber composite woofers for breathtaking clarity and deep bass.",
    category: "Audio",
    price: 7990,
    image: "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=600&q=80&auto=format&fit=crop",
    badge: "HiFi Bi-Amp",
    color: "#8b5cf6",
    specTags: ["Ribbon Tweeter", "120W Bi-Amp", "Lossless BT 5.4"],
    rating: 4.8,
    salesCount: 195,
  },
  {
    id: "audio9",
    name: "Botnoi VoicePod AI Conference",
    specs: "360° 8-Mic Beamforming Array · Real-time AI Noise Suppression · Bluetooth / USB-C",
    description: "Professional portable conference speakerphone. Acoustic AI removes air conditioner and keyboard background noise while amplifying voices up to 5 meters.",
    category: "Audio",
    price: 3890,
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&q=80&auto=format&fit=crop",
    badge: "AI Noise Cancel",
    color: "#8b5cf6",
    specTags: ["8-Mic Array", "AI De-Noise", "5m Voice Pickup"],
    rating: 4.7,
    salesCount: 220,
  },

  // ── Accessories (9 items) ─────────────────────────────────────────────────
  {
    id: "mechkey",
    name: "BotnKey Mechanic Pro",
    specs: "Full-size · Precision Linear Red Switches · RGB Backlit · PBT Keycaps",
    description:
      "Satisfying tactile feedback with ultra-responsive linear switches. Built with aircraft-grade aluminum top plate for all-night coding and gaming.",
    category: "Accessories",
    price: 4990,
    image: "https://images.unsplash.com/photo-1595225476474-87563907a212?w=600&q=80&auto=format&fit=crop",
    color: "#f59e0b",
    specTags: ["Linear Red", "RGB Per-Key", "PBT Doubleshot"],
    rating: 4.7,
    salesCount: 520,
  },
  {
    id: "airmouse",
    name: "Botnoi AirTrack Mouse",
    specs: "2.4GHz Wireless · 25,600 DPI · Optical Sensor · 70hr Battery",
    description:
      "Precision engineering in a 58g lightweight ergonomic shell. Near-zero latency, perfect for competitive esports and precision workflow.",
    category: "Accessories",
    price: 3290,
    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600&q=80&auto=format&fit=crop",
    color: "#10b981",
    specTags: ["25.6K DPI", "58g Ultralight", "70h Battery"],
    rating: 4.9,
    salesCount: 415,
  },
  {
    id: "acc2",
    name: "Botnoi Wireless Charger 3-in-1",
    specs: "15W Fast Charge · QI Certified · LED Status Indicator",
    description: "Charge your smartphone, smartwatch, and wireless earbuds concurrently with a single premium aluminum desk stand.",
    category: "Accessories",
    price: 1290,
    image: "https://images.unsplash.com/photo-1622445262465-2481c4574875?w=600&q=80&auto=format&fit=crop",
    color: "#10b981",
    specTags: ["3-in-1 Dock", "15W Qi Fast", "Magnetic Ready"],
    rating: 4.7,
    salesCount: 470,
  },
  {
    id: "acc3",
    name: "Botnoi USB-C Hub 8-in-1",
    specs: "HDMI 4K @60Hz · 100W PD · SD Card Reader · Gigabit Ethernet",
    description: "Expand your thin laptop's port limits. Full aluminum heat dissipation shell with high-speed 10Gbps data lanes.",
    category: "Accessories",
    price: 1890,
    image: "https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=600&q=80&auto=format&fit=crop",
    color: "#10b981",
    specTags: ["8-in-1 Dock", "4K @60Hz HDMI", "100W PD"],
    rating: 4.7,
    salesCount: 380,
  },
  {
    id: "acc4",
    name: "Botnoi Mechanical Keypad",
    specs: "21-Key Numpad · Smooth Yellow Switches · Hot-Swappable",
    description: "Programmable mechanical macro keypad. Essential companion for spreadsheet modeling, finance audits, or video editor hotkeys.",
    category: "Accessories",
    price: 1590,
    image: "https://images.unsplash.com/photo-1595225476474-87563907a212?w=600&q=80&auto=format&fit=crop",
    color: "#10b981",
    specTags: ["Hot-Swap PCB", "Smooth Yellow", "Macro Keys"],
    rating: 4.8,
    salesCount: 260,
  },
  {
    id: "acc5",
    name: "Botnoi Vertical Ergonomic Mouse",
    specs: "57-degree angle · 4000 DPI · Bluetooth/2.4GHz rechargeable",
    description: "Scientifically contoured vertical grip. Relieve forearm strain and carpal tunnel fatigue during long work sessions.",
    category: "Accessories",
    price: 2490,
    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600&q=80&auto=format&fit=crop",
    color: "#10b981",
    specTags: ["57° Natural Grip", "Silent Clicks", "Dual Wireless"],
    rating: 4.8,
    salesCount: 375,
  },
  {
    id: "acc6",
    name: "Botnoi MagDesk Studio Arm",
    specs: "Precision CNC Aluminum · 360° Magnetic Ball Joint · Hidden Channel Cable Routing",
    description: "Counterbalanced aerospace aluminum monitor and tablet desk arm. Effortless one-finger positioning with concealed channel wire management.",
    category: "Accessories",
    price: 2890,
    image: "https://images.unsplash.com/photo-1586775490184-b79f0621891f?w=600&q=80&auto=format&fit=crop",
    color: "#10b981",
    specTags: ["CNC Aluminum", "360° Smooth Arm", "12kg Load"],
    rating: 4.9,
    salesCount: 310,
  },
  {
    id: "acc7",
    name: "Botnoi SmartStream Deck 15",
    specs: "15 Dynamic LCD Keys · Live Visual Feedback · One-Touch Automation & Scene Switching",
    description: "Tactile visual interface controller. Trigger instant macros, audio mixers, lighting scenes, and application shortcuts with customizable animated key icons.",
    category: "Accessories",
    price: 5990,
    image: "https://images.unsplash.com/photo-1595225476474-87563907a212?w=600&q=80&auto=format&fit=crop",
    badge: "Stream Deck",
    color: "#10b981",
    specTags: ["15 LCD Keys", "Custom Macro", "Live Feedback"],
    rating: 4.8,
    salesCount: 245,
  },
  {
    id: "acc8",
    name: "Botnoi GaN UltraPower 140W",
    specs: "GaN V Fast Charger · 3x USB-C + 1x USB-A · PD 3.1 140W SuperFast Protocol · Foldable Plug",
    description: "Ultra-compact GaN fifth-generation desktop and travel charger. Powers a 16-inch performance laptop, tablet, and phone simultaneously with intelligent power allocation.",
    category: "Accessories",
    price: 2290,
    image: "https://images.unsplash.com/photo-1622445262465-2481c4574875?w=600&q=80&auto=format&fit=crop",
    color: "#10b981",
    specTags: ["140W PD 3.1", "GaN V Tech", "Quad Output"],
    rating: 4.9,
    salesCount: 560,
  },

  // ── Phone (9 items) ───────────────────────────────────────────────────────
  {
    id: "matext",
    name: "HUAWEI Mate XT Ultimate Design",
    specs: '10.2" Tri-Fold 3K OLED · Kirin AI · 16GB RAM · 1TB ROM · IPX8',
    description:
      "Pioneering triple-folding 10.2-inch OLED flagship expanding from compact handheld to cinematic tablet. Crafted with aerospace titanium hinges, 16GB RAM, 1TB storage, and ultra-slim 3.6mm profile.",
    category: "Phone",
    price: 109990,
    image: huaweiMateXT,
    badge: "Tri-Fold 10.2\"",
    color: "#b91c1c",
    specTags: ["10.2\" Tri-Fold", "Kirin AI", "16GB+1TB", "3.6mm Slim"],
    rating: 5.0,
    salesCount: 220,
  },
  {
    id: "matex6",
    name: "HUAWEI Mate X6",
    specs: '7.93" Dual-Screen Foldable · Kirin 9020 · 12GB RAM · 512GB ROM',
    description:
      "Ultra-thin dual-screen foldable masterpiece encased in crimson vegan leather. Features quad ultra-lighting camera array, dual satellite connectivity, and 66W SuperCharge.",
    category: "Phone",
    price: 59990,
    image: huaweiMateX6,
    badge: "Falcon Fold",
    color: "#b91c1c",
    specTags: ["7.93\" Foldable", "Kirin 9020", "Crimson Leather"],
    rating: 4.9,
    salesCount: 165,
  },
  {
    id: "mate80pro",
    name: "HUAWEI Mate 80 Pro",
    specs: '6.75" LTPO OLED · 16GB RAM · 512GB ROM · 50MP Master Optics',
    description:
      "Next-gen flagship smartphone engineered with an ultra-responsive 6.75-inch LTPO OLED display, 7.95mm titanium-shield architecture, IP68 protection, 16GB RAM, and 5,750mAh dual-cell battery with 100W HyperCharge.",
    category: "Phone",
    price: 43990,
    image: huaweiMate80Pro,
    badge: "Hot",
    color: "#6366f1",
    specTags: ["6.75\" LTPO OLED", "16GB+512GB", "100W HyperCharge"],
    rating: 5.0,
    salesCount: 310,
  },
  {
    id: "matexs2",
    name: "HUAWEI Mate Xs 2",
    specs: '7.8" Outward Fold OLED · Ultra-Light 255g · 8GB RAM · 512GB ROM',
    description:
      "Ultra-light outward-folding smartphone featuring an expansive 7.8-inch display, dual-rotating Falcon Wing seamless hinge, 8GB RAM + 512GB storage, and True-Chroma camera.",
    category: "Phone",
    price: 39990,
    image: huaweiMateXs2,
    badge: "Outward Fold",
    color: "#8b5cf6",
    specTags: ["7.8\" Outward Fold", "Falcon Hinge", "True-Chroma"],
    rating: 4.8,
    salesCount: 140,
  },
  {
    id: "mate50",
    name: "HUAWEI Mate 50",
    specs: '6.7" OLED (90Hz) · AI Octa-Core · 8GB RAM · 256GB ROM · Crystal Armor Glass',
    description:
      "Luxury flagship smartphone featuring a symmetrical Star Ring camera matrix, Crystal Armor drop-resistant glass, 8GB RAM + 256GB storage, and 66W fast charging.",
    category: "Phone",
    price: 24990,
    image: huaweiMate50,
    badge: "Star Ring",
    color: "#b91c1c",
    specTags: ["6.7\" OLED 90Hz", "AI Octa-Core", "Crystal Armor"],
    rating: 4.7,
    salesCount: 310,
  },
  {
    id: "matex7",
    name: "HUAWEI Mate X7",
    specs: '8.0" Flexible OLED Foldable · 16GB RAM · 512GB ROM · 50MP Studio Camera',
    description:
      "Next-generation inward folding flagship featuring an 8.0-inch 120Hz flexible OLED workspace, 16GB RAM + 512GB high-speed storage, 5,600mAh battery, and studio-grade 50MP triple-sensor imaging.",
    category: "Phone",
    price: 69990,
    image: huaweiMateX7,
    badge: "Flexible 8.0\"",
    color: "#b91c1c",
    specTags: ["8.0\" Fold OLED", "16GB+512GB", "Master Optics"],
    rating: 4.9,
    salesCount: 185,
  },
  {
    id: "phone7",
    name: "HUAWEI Pura 70 Ultra",
    specs: '6.8" 120Hz LTPO OLED · 16GB RAM · 512GB ROM · Ultra Lighting Retractable Camera',
    description: "Groundbreaking photography flagship featuring a retractable 1-inch Ultra Lighting Camera, Kunlun Crystal Armor Glass, and 100W SuperCharge.",
    category: "Phone",
    price: 49990,
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&q=80&auto=format&fit=crop",
    badge: "Pura Ultra",
    color: "#06b6d4",
    specTags: ["6.8\" LTPO OLED", "1-inch Retractable", "100W SuperCharge"],
    rating: 4.9,
    salesCount: 275,
  },
  {
    id: "phone8",
    name: "HUAWEI Pocket 2",
    specs: '6.94" 120Hz LTPO Fold · 1.15" Cover Screen · 12GB RAM · 256GB ROM · XMAGE Quad',
    description: "Ultra-pocketable vertical clamshell folding smartphone. Capture hands-free tripod photos with FlexMode and reply to messages directly from the outer screen.",
    category: "Phone",
    price: 34900,
    image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&q=80&auto=format&fit=crop",
    badge: "Pocket Flip",
    color: "#ec4899",
    specTags: ["Pocket Clamshell", "XMAGE Quad", "120Hz Foldable"],
    rating: 4.8,
    salesCount: 320,
  },
  {
    id: "phone9",
    name: "HUAWEI Mate 60 RS Ultimate Design",
    specs: '6.82" 120Hz LTPO OLED · Ceramic Body · 16GB RAM · 512GB ROM · Satellite Calling',
    description: "Ultra-luxury ceramic master edition smartphone engineered with star diamond design, dual satellite calling, and Kunlun Glass armor.",
    category: "Phone",
    price: 62900,
    image: "https://images.unsplash.com/photo-1580910051074-3eb694886505?w=600&q=80&auto=format&fit=crop",
    badge: "Ultimate RS",
    color: "#f59e0b",
    specTags: ["Ceramic Body", "Star Diamond", "Satellite Calling"],
    rating: 4.9,
    salesCount: 180,
  },
];

const categories: ITCategory[] = ["All Products", "Phone", "Laptops", "Monitors", "Audio", "Accessories"];

const money = new Intl.NumberFormat("th-TH", {
  style: "currency",
  currency: "THB",
  maximumFractionDigits: 0,
});

type SortOption = "featured" | "price_asc" | "price_desc" | "name_asc";

// ─── Component ──────────────────────────────────────────────────────────────
export default function ITStoreDemo() {
  const { t, language } = useTranslation();

  const getProductTranslation = (id: string, field: "name" | "specs" | "desc", fallback: string) => {
    const key = `itstore_item.${id}.${field}` as TranslationKey;
    const translated = t(key);
    return translated === key ? fallback : translated;
  };

  const getCategoryIcon = (cat: ITCategory) => {
    switch (cat) {
      case "All Products":
        return <LayoutGrid className="size-3.5 shrink-0" />;
      case "Phone":
        return <Smartphone className="size-3.5 shrink-0" />;
      case "Laptops":
        return <Laptop className="size-3.5 shrink-0" />;
      case "Monitors":
        return <Monitor className="size-3.5 shrink-0" />;
      case "Audio":
        return <Headphones className="size-3.5 shrink-0" />;
      case "Accessories":
        return <Layers className="size-3.5 shrink-0" />;
      default:
        return <Sparkles className="size-3.5 shrink-0" />;
    }
  };

  const getBadgeTranslation = (badge: string | undefined) => {
    if (!badge) return "";
    const map: Record<string, string> = {
      "Best Seller": t("itstore.badge_bestseller"),
      "Workstation": t("itstore.badge_workstation"),
      "Gaming": t("itstore.badge_gaming"),
      "Ultra-Light": t("itstore.badge_ultralight"),
      "Studio Grade": t("itstore.badge_studiograde"),
      "Mil-Spec": t("itstore.badge_milspec"),
      "New": t("itstore.badge_new"),
      "AI Tri-Fold": t("itstore.badge_trifold"),
      "Foldable": t("itstore.badge_foldable"),
      "Flagship 2026": t("itstore.badge_flagship"),
      "Titanium": t("itstore.badge_titanium"),
      "Crimson Leather": t("itstore.badge_leather"),
    };
    return map[badge] || badge;
  };

  const [activeCategory, setActiveCategory] = useState<ITCategory>("All Products");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("featured");
  const [cart, setCart] = useState<ITCart>({});
  const [order, setOrder] = useState<ITOrder | null>(null);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [reviewCountdown, setReviewCountdown] = useState(3);
  const [invoiceOpen, setInvoiceOpen] = useState(false);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);

  useEffect(() => {
    if (!reviewOpen) {
      setReviewCountdown(3);
      return;
    }
    setReviewCountdown(3);
    const interval = setInterval(() => {
      setReviewCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [reviewOpen]);
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedProducts, setExpandedProducts] = useState<Record<string, boolean>>({});
  const [quickViewProduct, setQuickViewProduct] = useState<ITProduct | null>(null);
  const [quickViewQty, setQuickViewQty] = useState(1);
  const [lastAddedId, setLastAddedId] = useState<string | null>(null);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isHoveringBanner, setIsHoveringBanner] = useState(false);

  // Promo code system
  const [promoCodeInput, setPromoCodeInput] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);

  const [ready, setReady] = useState(false);
  const cartRef = useRef<HTMLElement>(null);
  const categorySliderRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollButtons = useCallback(() => {
    const el = categorySliderRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 6);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 6);
  }, []);

  useEffect(() => {
    const el = categorySliderRef.current;
    if (!el) return;
    updateScrollButtons();
    el.addEventListener("scroll", updateScrollButtons, { passive: true });
    window.addEventListener("resize", updateScrollButtons);
    return () => {
      el.removeEventListener("scroll", updateScrollButtons);
      window.removeEventListener("resize", updateScrollButtons);
    };
  }, [updateScrollButtons]);

  const scrollCategories = (direction: "left" | "right") => {
    if (categorySliderRef.current) {
      const scrollAmount = direction === "left" ? -220 : 220;
      categorySliderRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const handleCategorySelect = (cat: ITCategory, e: React.MouseEvent<HTMLButtonElement>) => {
    setActiveCategory(cat);
    e.currentTarget.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  };

  const toggleExpand = (productId: string) => {
    setExpandedProducts((prev) => ({ ...prev, [productId]: !prev[productId] }));
  };

  // Reset page when category or search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory, searchQuery, sortBy]);

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

  // Filter & sort logic
  const filteredProducts = useMemo(() => {
    let list = activeCategory === "All Products"
      ? products
      : products.filter((p) => p.category === activeCategory);

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter((p) => {
        const transName = getProductTranslation(p.id, "name", p.name).toLowerCase();
        const transSpecs = getProductTranslation(p.id, "specs", p.specs).toLowerCase();
        const rawName = p.name.toLowerCase();
        const rawSpecs = p.specs.toLowerCase();
        const category = p.category.toLowerCase();
        const tags = (p.specTags || []).join(" ").toLowerCase();
        return transName.includes(q) || transSpecs.includes(q) || rawName.includes(q) || rawSpecs.includes(q) || category.includes(q) || tags.includes(q);
      });
    }

    const sorted = [...list];
    if (sortBy === "price_asc") {
      sorted.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price_desc") {
      sorted.sort((a, b) => b.price - a.price);
    } else if (sortBy === "name_asc") {
      sorted.sort((a, b) => a.name.localeCompare(b.name));
    }
    return sorted;
  }, [activeCategory, searchQuery, sortBy, language]);

  const totalPages = Math.ceil(filteredProducts.length / 9);

  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * 9;
    return filteredProducts.slice(start, start + 9);
  }, [filteredProducts, currentPage]);

  const cartItems = useMemo(
    () =>
      products
        .filter((p) => (cart[p.id] ?? 0) > 0)
        .map((p) => ({ ...p, quantity: cart[p.id] ?? 0 })),
    [cart]
  );

  const itemCount = cartItems.reduce((s, i) => s + i.quantity, 0);
  const rawSubtotal = cartItems.reduce((s, i) => s + i.price * i.quantity, 0);
  
  // Promo discount calculation (฿500 off if code BOTNOI2026 or TECHVIP is applied)
  const discountAmount = appliedPromo ? Math.min(rawSubtotal, 500) : 0;
  const subtotal = Math.max(0, rawSubtotal - discountAmount);
  const shipping = 0; // free VIP courier shipping

  const changeQty = (id: string, delta: number) => {
    setCart((prev) => {
      const next = Math.max(0, (prev[id] ?? 0) + delta);
      const updated = { ...prev, [id]: next };
      if (next === 0) delete updated[id];
      return updated;
    });
    if (delta > 0) {
      setLastAddedId(id);
      setTimeout(() => {
        setLastAddedId((current) => (current === id ? null : current));
      }, 1200);
      const prod = products.find(p => p.id === id);
      if (prod) {
        toast.success(`${t("itstore.added_toast")}: ${getProductTranslation(prod.id, "name", prod.name)}`, {
          duration: 2000,
        });
      }
    }
  };

  const removeItem = (id: string) => {
    setCart((prev) => {
      const updated = { ...prev };
      delete updated[id];
      return updated;
    });
  };

  const applyPromoCode = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const code = promoCodeInput.trim().toUpperCase();
    if (!code) return;
    if (code === "BOTNOI2026" || code === "TECHVIP" || code === "AVATAR") {
      setAppliedPromo(code);
      toast.success(t("itstore.promo_applied"));
    } else {
      toast.error(t("itstore.promo_invalid"));
    }
  };

  const checkout = () => {
    if (cartItems.length === 0) return;
    const newOrder: ITOrder = {
      orderId: `IT${Date.now().toString().slice(-7)}`,
      orderedAt: new Date().toISOString(),
      items: cartItems,
      subtotal: rawSubtotal,
      discount: discountAmount,
      promoCode: appliedPromo || undefined,
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
    toast.success(t("itstore.toast_success"));
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

  const bannerSlides = useMemo(() => [
    {
      id: "matext",
      badge: "World's 1st Tri-Fold OLED",
      title: "HUAWEI Mate XT Ultimate",
      subtitle: "10.2\" Expanding 3K OLED · Kirin AI · 16GB + 1TB · Ultra-Slim 3.6mm Titanium Architecture",
      price: 109990,
      image: huaweiMateXT,
      accent: "#ef4444",
      glowColor: "rgba(239, 68, 68, 0.25)",
      productRef: products.find(p => p.id === "matext") || products[0],
    },
    {
      id: "matex6",
      badge: "Ultra-Slim Falcon Fold",
      title: "HUAWEI Mate X6",
      subtitle: "Ultra-Thin Dual-Screen Foldable · Quad Ultra Lighting Camera Array · Dual Satellite Calling",
      price: 59990,
      image: huaweiMateX6,
      accent: "#f43f5e",
      glowColor: "rgba(244, 63, 94, 0.25)",
      productRef: products.find(p => p.id === "matex6") || products[0],
    },
    {
      id: "mate80pro",
      badge: "AI Flagship Titanium",
      title: "HUAWEI Mate 80 Pro",
      subtitle: "Next-Gen AI Core Architecture · 100W HyperCharge · Crystal Armor Glass Shield",
      price: 43990,
      image: huaweiMate80Pro,
      accent: "#6366f1",
      glowColor: "rgba(99, 102, 241, 0.25)",
      productRef: products.find(p => p.id === "mate80pro") || products[0],
    },
    {
      id: "matexs2",
      badge: "Falcon Wing Outward Fold",
      title: "HUAWEI Mate Xs 2",
      subtitle: "7.8\" True-Chroma Flexible Display · Ultra-Light 255g · Double-Rotating Seamless Hinge",
      price: 39990,
      image: huaweiMateXs2,
      accent: "#8b5cf6",
      glowColor: "rgba(139, 92, 246, 0.25)",
      productRef: products.find(p => p.id === "matexs2") || products[0],
    },
  ], []);

  // Auto-advance banner slide every 5 seconds
  useEffect(() => {
    if (isHoveringBanner) return;
    const interval = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % bannerSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isHoveringBanner, bannerSlides.length]);

  const activeSlide = bannerSlides[currentSlideIndex] || bannerSlides[0];

  return (
    <>
      <Toaster position="top-right" richColors />
      <AnimatePresence>
        {!ready && <PageSkeleton variant="order" />}
      </AnimatePresence>

      <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-background text-foreground transition-colors duration-300">

        {/* ── Top Navigation Bar ────────────────────────────────────────── */}
        <header className="relative z-20 mx-auto mt-4 mb-6 w-[calc(100%-2rem)] max-w-7xl bg-background/85 backdrop-blur-md border border-foreground/10 rounded-2xl shadow-lg transition-all">
          <div className="px-6 py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <nav className="flex items-center gap-2 text-xs text-foreground/60 font-bold" aria-label="Breadcrumb">
              <Link to="/" className="hover:text-indigo-500 transition-colors flex items-center gap-1.5">
                <Home className="size-3.5" />
                <span>{t('nav.home')}</span>
              </Link>
              <ChevronRight className="size-3 text-foreground/30" />
              <Link to="/all-demo" className="hover:text-indigo-500 transition-colors">
                <span>{t('showcase.portal')}</span>
              </Link>
              <ChevronRight className="size-3 text-foreground/30" />
              <span className="text-foreground font-extrabold uppercase font-mono tracking-wider flex items-center gap-1.5 text-indigo-500 dark:text-indigo-400">
                <Zap className="size-3.5 fill-current" />
                {t('nav.itstore')}
              </span>
            </nav>

            <nav className="flex items-center gap-2 sm:gap-3 text-sm font-semibold">
              <Link
                to="/it-store-demo/admin"
                className="px-3 sm:px-4 py-1.5 rounded-full bg-foreground/5 hover:bg-foreground/10 transition-all border border-foreground/10 text-foreground text-xs font-bold flex items-center gap-1.5"
                id="nav-itstore-admin"
              >
                <Cpu className="size-3.5 text-indigo-500" />
                <span className="hidden sm:inline">{t("itstore.nav_admin")}</span>
              </Link>
              <button
                className="relative flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-bold text-white transition-all shadow-md hover:shadow-indigo-500/25 active:scale-95 cursor-pointer"
                style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)" }}
                onClick={() => {
                  if (window.innerWidth < 1024) {
                    setCartDrawerOpen(true);
                  } else {
                    cartRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
                  }
                }}
                id="itstore-cart-btn"
              >
                <ShoppingCart className="size-4" />
                <span>{t("itstore.nav_cart")}</span>
                <span className="min-w-5 h-5 rounded-full bg-white text-indigo-600 text-xs font-extrabold flex items-center justify-center shadow px-1">
                  {itemCount}
                </span>
              </button>
            </nav>
          </div>
        </header>

        {/* ── Minimalist Slide Banner (Carousel with Responsive Mobile & Desktop Layout) ── */}
        <section
          className="relative mx-auto w-[calc(100%-1.5rem)] sm:w-[calc(100%-2rem)] max-w-7xl rounded-3xl overflow-hidden mb-6 sm:mb-8 border border-foreground/10 shadow-xl bg-card transition-colors duration-300"
          onMouseEnter={() => setIsHoveringBanner(true)}
          onMouseLeave={() => setIsHoveringBanner(false)}
          id="itstore-slide-banner"
        >
          {/* Animated Slide Content */}
          <div className="relative min-h-[320px] sm:min-h-[380px] lg:min-h-[420px] flex items-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSlide.id}
                initial={{ opacity: 0, x: 25 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -25 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="w-full h-full min-h-[320px] sm:min-h-[380px] lg:min-h-[420px] px-4 sm:px-10 lg:px-16 py-6 sm:py-8 lg:py-10 flex flex-col-reverse lg:flex-row items-center justify-between gap-4 sm:gap-8 bg-card/60 dark:bg-card/85 backdrop-blur-md transition-colors"
                style={{
                  background: `radial-gradient(ellipse at 78% 50%, ${activeSlide.accent}15 0%, transparent 65%)`,
                }}
              >
                {/* Left: Typography & Actions */}
                <div className="flex-1 w-full max-w-xl text-left z-10 flex flex-col justify-between self-stretch py-1 sm:py-2">
                  <div>
                    <div
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black mb-2 sm:mb-3 border shadow-xs"
                      style={{
                        borderColor: `${activeSlide.accent}40`,
                        backgroundColor: `${activeSlide.accent}12`,
                        color: activeSlide.accent,
                      }}
                    >
                      <Sparkles className="size-3.5" />
                      <span>{activeSlide.badge}</span>
                    </div>

                    <h1
                      className="text-2xl sm:text-4xl lg:text-5xl font-black text-foreground tracking-tight leading-[1.15] mb-2 sm:mb-2.5 flex items-center"
                      id="itstore-hero-title"
                    >
                      {getProductTranslation(activeSlide.id, "name", activeSlide.title)}
                    </h1>

                    <p className="text-foreground/75 text-xs sm:text-sm leading-relaxed mb-3 sm:mb-4 font-medium max-w-lg line-clamp-2">
                      {getProductTranslation(activeSlide.id, "desc", activeSlide.subtitle)}
                    </p>
                  </div>

                  {/* Actions Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-3 mt-auto border-t border-foreground/10">
                    <div>
                      <span className="text-[10px] sm:text-[11px] font-bold text-foreground/45 uppercase tracking-wider block">
                        {t("itstore.launch_price")}
                      </span>
                      <span className="text-xl sm:text-3xl font-black font-mono" style={{ color: activeSlide.accent }}>
                        {money.format(activeSlide.price)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-3">
                      <Button
                        onClick={() => {
                          setQuickViewProduct(activeSlide.productRef);
                          setQuickViewQty(1);
                        }}
                        variant="outline"
                        className="rounded-full px-3.5 sm:px-4 py-1.5 sm:py-2 font-bold text-xs border-foreground/20 hover:bg-foreground/10 gap-1.5 cursor-pointer shadow-xs"
                      >
                        <Eye className="size-3.5" />
                        <span>{t("itstore.explore_specs")}</span>
                      </Button>

                      <Button
                        onClick={() => changeQty(activeSlide.id, 1)}
                        className="rounded-full px-4 sm:px-5 py-1.5 sm:py-2 font-black text-xs text-white shadow-lg gap-1.5 hover:scale-105 transition-transform cursor-pointer"
                        style={{ background: activeSlide.accent }}
                      >
                        <Plus className="size-3.5" />
                        <span>{t("itstore.btn_add")}</span>
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Right: Direct Product Visual with Soft Ambient Glow */}
                <div className="relative flex-1 flex items-center justify-center w-full max-w-[200px] sm:max-w-[320px] lg:max-w-[400px] aspect-square z-10">
                  <div
                    className="absolute inset-0 rounded-full blur-3xl opacity-35 pointer-events-none transition-all duration-700"
                    style={{ background: activeSlide.glowColor }}
                  />
                  <motion.img
                    key={activeSlide.id}
                    src={activeSlide.image}
                    alt={activeSlide.title}
                    animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="w-full h-full object-contain filter drop-shadow-2xl z-10"
                  />
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Controls: Previous Arrow (Clean Floating Arrow Only) */}
          <button
            type="button"
            onClick={() => setCurrentSlideIndex((prev) => (prev - 1 + bannerSlides.length) % bannerSlides.length)}
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 text-foreground/45 hover:text-foreground transition-all duration-300 hover:scale-125 cursor-pointer p-1.5 focus:outline-none drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]"
            aria-label="Previous Slide"
          >
            <ChevronLeft className="size-8 sm:size-10 stroke-[2.5]" />
          </button>

          {/* Navigation Controls: Next Arrow (Clean Floating Arrow Only) */}
          <button
            type="button"
            onClick={() => setCurrentSlideIndex((prev) => (prev + 1) % bannerSlides.length)}
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 text-foreground/45 hover:text-foreground transition-all duration-300 hover:scale-125 cursor-pointer p-1.5 focus:outline-none drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]"
            aria-label="Next Slide"
          >
            <ChevronRight className="size-8 sm:size-10 stroke-[2.5]" />
          </button>

          {/* Navigation Controls: Pagination Dots */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 px-3 py-1.5 rounded-full bg-background/60 border border-foreground/10 backdrop-blur-md shadow-md">
            {bannerSlides.map((slide, idx) => {
              const active = currentSlideIndex === idx;
              return (
                <button
                  key={slide.id}
                  type="button"
                  onClick={() => setCurrentSlideIndex(idx)}
                  className={`rounded-full transition-all duration-300 cursor-pointer ${
                    active ? 'w-6 h-2 shadow-xs' : 'w-2 h-2 bg-foreground/30 hover:bg-foreground/60'
                  }`}
                  style={active ? { backgroundColor: slide.accent } : {}}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              );
            })}
          </div>
        </section>

        {/* ── Main Content Layout ───────────────────────────────────────── */}
        <div className="mx-auto w-full max-w-7xl px-4 py-4 pb-32 sm:px-6 lg:grid lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-8 lg:px-8 lg:pb-12">

          {/* ── Products Section ────────────────────────────────────────── */}
          <section aria-labelledby="products-heading" className="min-w-0" id="itstore-products">
            
            {/* Header & Section Title */}
            <div className="mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-indigo-500 flex items-center gap-1.5">
                  <Sparkles className="size-3.5" />
                  {t("itstore.select_products")}
                </p>
                <h2 id="products-heading" className="font-extrabold text-3xl tracking-tight text-foreground mt-1">
                  {t("itstore.all_products_title")}
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-foreground/5 border border-foreground/10 text-foreground/70">
                  {filteredProducts.length} {t("itstore.items_count")}
                </span>
              </div>
            </div>

            {/* Search & Sort Tool Bar */}
            <div className="mb-6 grid grid-cols-1 sm:grid-cols-12 gap-3">
              {/* Search input */}
              <div className="sm:col-span-7 relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-foreground/40" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t("itstore.search_placeholder")}
                  className="w-full pl-10 pr-9 py-2.5 rounded-2xl bg-foreground/5 border border-foreground/10 text-foreground text-xs font-semibold placeholder:text-foreground/40 focus:outline-none focus:border-indigo-500 transition-colors"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/40 hover:text-foreground transition-colors p-1"
                  >
                    <X className="size-3.5" />
                  </button>
                )}
              </div>

              {/* Sort dropdown */}
              <div className="sm:col-span-5 flex items-center gap-2">
                <div className="relative w-full">
                  <SlidersHorizontal className="absolute left-3.5 top-1/2 -translate-y-1/2 size-3.5 text-foreground/40" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortOption)}
                    className="w-full pl-9 pr-8 py-2.5 rounded-2xl bg-foreground/5 border border-foreground/10 text-foreground text-xs font-bold appearance-none cursor-pointer focus:outline-none focus:border-indigo-500 transition-colors"
                  >
                    <option value="featured">{t("itstore.sort_featured")}</option>
                    <option value="price_asc">{t("itstore.sort_price_asc")}</option>
                    <option value="price_desc">{t("itstore.sort_price_desc")}</option>
                    <option value="name_asc">{t("itstore.sort_name_asc")}</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Category Slide Bar - Smooth horizontal slider without outer enclosing frame */}
            <div className="relative mb-6 sm:mb-8 flex items-center gap-1.5">
              {/* Left Slide Button */}
              <button
                type="button"
                onClick={() => scrollCategories("left")}
                aria-label="Slide categories left"
                className={`hidden sm:flex shrink-0 items-center justify-center w-8 h-8 rounded-full border border-foreground/10 bg-card hover:bg-foreground/5 text-foreground/70 hover:text-foreground shadow-xs transition-all duration-200 cursor-pointer active:scale-90 ${
                  canScrollLeft ? "opacity-100" : "opacity-30 hover:opacity-40 cursor-default"
                }`}
                disabled={!canScrollLeft}
              >
                <ChevronLeft className="size-4" />
              </button>

              {/* Scrollable Container with Categories */}
              <div
                ref={categorySliderRef}
                className="flex-1 flex items-center gap-2 overflow-x-auto whitespace-nowrap py-1 px-0.5 scroll-smooth no-scrollbar"
                role="tablist"
                aria-label={t("itstore.categories_label")}
                style={{ WebkitOverflowScrolling: "touch" }}
              >
                {categories.map((cat) => {
                  const active = activeCategory === cat;
                  const catCount =
                    cat === "All Products"
                      ? products.length
                      : products.filter((p) => p.category === cat).length;
                  return (
                    <button
                      key={cat}
                      className={`relative shrink-0 px-3.5 sm:px-4 py-2 rounded-full text-xs font-extrabold transition-all cursor-pointer border flex items-center gap-2 shadow-xs select-none ${
                        active
                          ? "border-transparent text-white shadow-md shadow-indigo-500/25 scale-[1.02]"
                          : "text-foreground/75 border-foreground/10 bg-card hover:text-foreground hover:bg-foreground/5 hover:border-foreground/20"
                      }`}
                      style={active ? { background: "linear-gradient(135deg,#6366f1,#8b5cf6)" } : {}}
                      onClick={(e) => handleCategorySelect(cat, e)}
                      role="tab"
                      aria-selected={active}
                      id={`itstore-cat-${cat.toLowerCase().replace(/\s+/g, "-")}`}
                    >
                      <span className={`transition-transform duration-200 ${active ? "scale-110" : "text-foreground/60"}`}>
                        {getCategoryIcon(cat)}
                      </span>
                      <span>{getCategoryLabel(cat)}</span>
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono font-bold transition-colors ${
                          active ? "bg-white/20 text-white" : "bg-foreground/10 text-foreground/60"
                        }`}
                      >
                        {catCount}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Right Slide Button */}
              <button
                type="button"
                onClick={() => scrollCategories("right")}
                aria-label="Slide categories right"
                className={`hidden sm:flex shrink-0 items-center justify-center w-8 h-8 rounded-full border border-foreground/10 bg-card hover:bg-foreground/5 text-foreground/70 hover:text-foreground shadow-xs transition-all duration-200 cursor-pointer active:scale-90 ${
                  canScrollRight ? "opacity-100" : "opacity-30 hover:opacity-40 cursor-default"
                }`}
                disabled={!canScrollRight}
              >
                <ChevronRight className="size-4" />
              </button>
            </div>

            {/* Product Grid */}
            {filteredProducts.length === 0 ? (
              <div className="py-16 text-center border border-dashed border-foreground/15 rounded-3xl bg-foreground/5">
                <Search className="size-10 mx-auto text-foreground/30 mb-3" />
                <h3 className="text-base font-bold text-foreground mb-1">{t("itstore.filter_no_results")}</h3>
                <p className="text-xs text-foreground/50 mb-4">Try checking for typos or searching by another category.</p>
                <Button
                  onClick={() => {
                    setSearchQuery("");
                    setActiveCategory("All Products");
                  }}
                  variant="outline"
                  size="sm"
                  className="rounded-full font-bold text-xs"
                >
                  {t("itstore.filter_reset")}
                </Button>
              </div>
            ) : (
              <motion.div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <AnimatePresence mode="popLayout">
                  {paginatedProducts.map((product) => {
                    const qty = cart[product.id] ?? 0;
                    const inCart = qty > 0;
                    const isExpanded = expandedProducts[product.id];
                    const desc = getProductTranslation(product.id, "desc", product.description);

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
                          onClick={() => {
                            setQuickViewProduct(product);
                            setQuickViewQty(1);
                          }}
                          className="group relative flex flex-col overflow-hidden rounded-3xl border border-foreground/10 bg-card hover:border-indigo-500/40 shadow-sm transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-xl h-full itstore-glass-card cursor-pointer"
                          id={`itstore-product-${product.id}`}
                        >
                          {/* Image Box with Rounded Frame */}
                          <div
                            className="relative m-3.5 mb-1 overflow-hidden bg-foreground/5 rounded-2xl border border-foreground/10 flex items-center justify-center"
                            style={{ height: 220 }}
                          >
                            {/* Full Image filling the box */}
                            <SkeletonImage
                              src={product.image}
                              alt={product.name}
                              wrapperClassName="w-full h-full"
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />

                            {/* Badge Tag on top of image */}
                            {product.badge && (
                              <span
                                className="absolute top-3 left-3 z-10 px-2.5 py-1 rounded-full text-xs font-black text-white shadow-lg backdrop-blur-xs"
                                style={{ background: product.color }}
                              >
                                {getBadgeTranslation(product.badge)}
                              </span>
                            )}

                            {/* Quick View Button on top of image */}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setQuickViewProduct(product);
                                setQuickViewQty(1);
                              }}
                              className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-background/80 hover:bg-background text-foreground/80 hover:text-foreground backdrop-blur-md flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 shadow-md border border-foreground/10 cursor-pointer"
                              title={t("itstore.quick_view")}
                            >
                              <Eye size={15} />
                            </button>

                            {/* In cart floating indicator on top of image */}
                            {inCart && (
                              <div className="absolute bottom-3 left-3 z-10 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-600 text-white flex items-center gap-1 shadow-md">
                                <Check size={11} /> {qty} {t("itstore.btn_in_cart")}
                              </div>
                            )}
                          </div>

                          {/* Info Area */}
                          <div className="flex flex-col flex-1 px-5 pb-5 pt-3 gap-3">
                            <div>
                              <div className="flex items-center justify-between gap-2 mb-1.5">
                                <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-500">
                                  {getCategoryLabel(product.category)}
                                </span>
                                <div className="flex items-center gap-1 text-[11px] font-bold text-foreground/70">
                                  <Star className="size-3 fill-amber-400 text-amber-400" />
                                  <span>{product.rating || 4.8}</span>
                                </div>
                              </div>

                              <h3 className="font-extrabold text-foreground text-base leading-tight mb-1.5 group-hover:text-indigo-500 transition-colors">
                                {getProductTranslation(product.id, "name", product.name)}
                              </h3>

                              {/* Specs line */}
                              <p
                                className="text-xs font-semibold mb-2"
                                style={{ color: product.color }}
                              >
                                {t("itstore.speci")}: {getProductTranslation(product.id, "specs", product.specs)}
                              </p>

                              {/* Description with Expand */}
                              <p className="text-xs text-foreground/70 leading-relaxed">
                                {desc.length > 100 && !isExpanded ? (
                                  <>
                                    {desc.slice(0, 100)}...{" "}
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        toggleExpand(product.id);
                                      }}
                                      className="text-xs font-bold text-indigo-500 hover:text-indigo-600 transition ml-1 inline cursor-pointer"
                                    >
                                      {t("itstore.read_more")}
                                    </button>
                                  </>
                                ) : (
                                  <>
                                    {desc}{" "}
                                    {desc.length > 100 && (
                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          toggleExpand(product.id);
                                        }}
                                        className="text-xs font-bold text-indigo-500 hover:text-indigo-600 transition ml-1 inline cursor-pointer"
                                      >
                                        {t("itstore.read_less")}
                                      </button>
                                    )}
                                  </>
                                )}
                              </p>
                            </div>

                            {/* Stock Indicator */}
                            <div className="flex items-center gap-2 mt-1">
                              <span className="itstore-pulse-dot" />
                              <span className="text-[11px] font-semibold text-emerald-500">{t("itstore.stock_ready")}</span>
                            </div>

                            {/* Footer / Price & Add Actions */}
                            <div className="mt-auto pt-3 border-t border-foreground/10 flex items-center justify-between gap-3">
                              <div>
                                <div className="font-extrabold text-lg sm:text-xl text-foreground">
                                  {money.format(product.price)}
                                </div>
                              </div>

                              {!inCart ? (
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    changeQty(product.id, 1);
                                  }}
                                  className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-extrabold text-white transition-all shadow hover:shadow-indigo-500/20 hover:scale-105 active:scale-95 cursor-pointer"
                                  style={{ background: product.color }}
                                  id={`itstore-add-${product.id}`}
                                >
                                  <Plus size={14} /> {t("itstore.btn_add")}
                                </button>
                              ) : (
                                <div
                                  className="flex items-center gap-2 px-2.5 py-1 rounded-full font-bold text-white shadow"
                                  style={{ background: product.color }}
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      changeQty(product.id, -1);
                                    }}
                                    className="w-6 h-6 rounded-full bg-white/30 flex items-center justify-center hover:bg-white/50 transition text-white cursor-pointer"
                                    id={`itstore-minus-${product.id}`}
                                    title="Decrease"
                                  >
                                    <Minus size={11} />
                                  </button>
                                  <span className="min-w-[1.2rem] text-center text-xs font-black">{qty}</span>
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      changeQty(product.id, 1);
                                    }}
                                    className="w-6 h-6 rounded-full bg-white/30 flex items-center justify-center hover:bg-white/50 transition text-white cursor-pointer"
                                    id={`itstore-plus-${product.id}`}
                                    title="Increase"
                                  >
                                    <Plus size={11} />
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </motion.div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="mt-12 flex items-center justify-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full w-10 h-10 flex items-center justify-center border border-foreground/10 bg-transparent text-foreground/60 hover:text-foreground hover:bg-foreground/5 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  disabled={currentPage === 1}
                  onClick={() => {
                    setCurrentPage(prev => Math.max(1, prev - 1));
                    document.getElementById('itstore-products')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  <ChevronLeft className="size-4" />
                </Button>
                {Array.from({ length: totalPages }).map((_, idx) => {
                  const pageNum = idx + 1;
                  const active = currentPage === pageNum;
                  return (
                    <button
                      key={pageNum}
                      className={`w-10 h-10 rounded-full text-xs font-extrabold transition-all border cursor-pointer ${
                        active
                          ? "border-transparent text-white shadow-md shadow-indigo-500/20"
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
                  className="rounded-full w-10 h-10 flex items-center justify-center border border-foreground/10 bg-transparent text-foreground/60 hover:text-foreground hover:bg-foreground/5 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  disabled={currentPage === totalPages}
                  onClick={() => {
                    setCurrentPage(prev => Math.min(totalPages, prev + 1));
                    document.getElementById('itstore-products')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  <ChevronRight className="size-4" />
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
              <div className="rounded-3xl border border-foreground/10 bg-card overflow-hidden shadow-lg itstore-glass-card">
                
                {/* Cart header */}
                <div className="px-6 py-4 border-b border-foreground/10 flex items-center justify-between bg-foreground/5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
                      <ShoppingCart size={17} />
                    </div>
                    <span className="font-extrabold text-foreground text-sm">{t("itstore.cart_title")}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {cartItems.length > 0 && (
                      <button
                        type="button"
                        onClick={() => {
                          if (window.confirm(t("itstore.cart_clear_confirm"))) {
                            setCart({});
                            setAppliedPromo(null);
                            toast.info("Cart cleared");
                          }
                        }}
                        className="text-[11px] font-bold text-foreground/40 hover:text-red-500 transition-colors cursor-pointer mr-1"
                      >
                        {language === 'th' ? 'ล้างตะกร้า' : 'Clear'}
                      </button>
                    )}
                    <motion.span
                      key={itemCount}
                      initial={{ scale: 0.75 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 600, damping: 22 }}
                      className="px-2.5 py-0.5 rounded-full text-xs font-black text-white inline-block shadow-xs"
                      style={{ background: "#6366f1" }}
                    >
                      {itemCount}
                    </motion.span>
                  </div>
                </div>

                {/* Cart items */}
                <div className="divide-y divide-foreground/10 max-h-80 overflow-y-auto transition-all scroll-smooth">
                  <AnimatePresence initial={false} mode="popLayout">
                    {cartItems.length === 0 ? (
                      <motion.div
                        key="empty-cart"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.25, ease: "easeOut" }}
                        className="px-6 py-12 text-center text-foreground/50 text-xs"
                      >
                        <ShoppingCart size={36} className="mx-auto mb-3 opacity-30 text-indigo-500" />
                        <div className="font-bold text-foreground/70 mb-1">{t("itstore.cart_empty")}</div>
                        <div>{t("itstore.cart_empty_sub")}</div>
                      </motion.div>
                    ) : (
                      cartItems.map((item) => {
                        const isRecentlyAdded = lastAddedId === item.id;
                        return (
                          <motion.div
                            key={item.id}
                            layout
                            initial={{ opacity: 0, y: 16, scale: 0.94 }}
                            animate={{
                              opacity: 1,
                              y: 0,
                              scale: 1,
                              backgroundColor: isRecentlyAdded ? "rgba(99, 102, 241, 0.12)" : "transparent",
                            }}
                            exit={{ opacity: 0, scale: 0.9, x: -16 }}
                            transition={{
                              layout: { type: "spring", stiffness: 400, damping: 32 },
                              opacity: { duration: 0.22, ease: "easeOut" },
                              y: { type: "spring", stiffness: 450, damping: 28 },
                              scale: { duration: 0.22 },
                              backgroundColor: { duration: 0.7, ease: "easeOut" },
                            }}
                            className="flex items-center gap-3 px-4 py-3 hover:bg-foreground/5 transition-colors"
                          >
                            <motion.img
                              src={item.image}
                              alt={item.name}
                              animate={{ scale: isRecentlyAdded ? [1, 1.14, 1] : 1 }}
                              transition={{ duration: 0.35, ease: "easeOut" }}
                              className="w-12 h-12 rounded-xl object-contain bg-foreground/5 p-1 border border-foreground/10 shrink-0 shadow-xs"
                              loading="lazy"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="font-extrabold text-foreground text-xs leading-tight truncate">
                                {getProductTranslation(item.id, "name", item.name)}
                              </div>
                              <div className="text-xs text-foreground/60 mt-0.5 font-semibold font-mono">{money.format(item.price)}</div>
                            </div>
                            <div className="flex items-center gap-1">
                              <div className="flex items-center gap-0.5 bg-foreground/5 rounded-full p-0.5 border border-foreground/10 shadow-xs">
                                <button
                                  type="button"
                                  onClick={() => changeQty(item.id, -1)}
                                  className="w-5 h-5 rounded-full flex items-center justify-center text-foreground/70 hover:bg-foreground/10 hover:text-foreground cursor-pointer transition-colors"
                                  id={`cart-minus-${item.id}`}
                                  title="Decrease"
                                >
                                  <Minus size={9} />
                                </button>
                                <motion.span
                                  key={item.quantity}
                                  initial={{ scale: 0.7 }}
                                  animate={{ scale: 1 }}
                                  transition={{ type: "spring", stiffness: 500, damping: 20 }}
                                  className="text-xs font-black w-4 text-center text-foreground inline-block font-mono"
                                >
                                  {item.quantity}
                                </motion.span>
                                <button
                                  type="button"
                                  onClick={() => changeQty(item.id, 1)}
                                  className="w-5 h-5 rounded-full flex items-center justify-center text-foreground/70 hover:bg-foreground/10 hover:text-foreground cursor-pointer transition-colors"
                                  id={`cart-plus-${item.id}`}
                                  title="Increase"
                                >
                                  <Plus size={9} />
                                </button>
                              </div>
                              <button
                                type="button"
                                onClick={() => removeItem(item.id)}
                                className="w-7 h-7 rounded-full flex items-center justify-center text-foreground/40 hover:text-red-500 hover:bg-red-500/10 cursor-pointer transition-all ml-0.5"
                                id={`cart-remove-${item.id}`}
                                aria-label={`Remove ${item.name}`}
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </motion.div>
                        );
                      })
                    )}
                  </AnimatePresence>
                </div>

                {/* Promo Code Input */}
                <div className="px-5 py-3 border-t border-foreground/10 bg-foreground/5">
                  <form onSubmit={applyPromoCode} className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-foreground/40" />
                      <input
                        type="text"
                        value={promoCodeInput}
                        onChange={(e) => setPromoCodeInput(e.target.value)}
                        placeholder={t("itstore.promo_placeholder")}
                        disabled={appliedPromo !== null}
                        className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-background border border-foreground/10 text-xs font-mono uppercase text-foreground focus:outline-none focus:border-indigo-500 disabled:opacity-60"
                      />
                    </div>
                    {appliedPromo ? (
                      <button
                        type="button"
                        onClick={() => {
                          setAppliedPromo(null);
                          setPromoCodeInput("");
                        }}
                        className="px-3 py-1.5 rounded-xl bg-red-500/10 text-red-500 text-xs font-bold hover:bg-red-500/20 transition-colors cursor-pointer"
                      >
                        {t("itstore.remove_promo")}
                      </button>
                    ) : (
                      <button
                        type="submit"
                        disabled={!promoCodeInput.trim()}
                        className="px-3 py-1.5 rounded-xl bg-indigo-600 text-white text-xs font-extrabold hover:bg-indigo-700 transition-colors cursor-pointer disabled:opacity-50"
                      >
                        {t("itstore.promo_apply")}
                      </button>
                    )}
                  </form>
                  {appliedPromo && (
                    <div className="mt-2 text-[11px] font-bold text-emerald-500 flex items-center gap-1">
                      <CheckCircle2 className="size-3" />
                      <span>{t("itstore.promo_applied")}</span>
                    </div>
                  )}
                </div>

                {/* Cart summary */}
                <div className="px-6 py-4 border-t border-foreground/10 space-y-2.5">
                  <div className="flex justify-between text-xs text-foreground/70">
                    <span>{t("itstore.cart_subtotal")}</span>
                    <span className="font-semibold text-foreground">{money.format(rawSubtotal)}</span>
                  </div>

                  {appliedPromo && (
                    <div className="flex justify-between text-xs text-emerald-500 font-bold">
                      <span>{t("itstore.promo_discount")} ({appliedPromo})</span>
                      <span>-{money.format(discountAmount)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-xs text-foreground/70">
                    <span>{t("itstore.cart_shipping")}</span>
                    <span className="font-extrabold text-emerald-500">{t("itstore.cart_shipping_free")}</span>
                  </div>

                  <div className="flex justify-between text-base font-black text-foreground pt-3 border-t border-foreground/10">
                    <span>{t("itstore.cart_total")}</span>
                    <span className="text-indigo-500 dark:text-indigo-400">{money.format(subtotal)}</span>
                  </div>

                  <button
                    onClick={() => setReviewOpen(true)}
                    disabled={cartItems.length === 0}
                    className="w-full mt-3 flex items-center justify-center gap-2 py-3 rounded-2xl text-xs font-black text-white transition-all shadow-lg hover:shadow-indigo-500/25 hover:scale-[1.02] active:scale-95 disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
                    style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)" }}
                    id="itstore-checkout-btn"
                  >
                    <ChevronRight size={16} /> {t("itstore.cart_review_checkout")}
                  </button>
                </div>
              </div>
            </div>
          </aside>
        </div>

        {/* ── Quick View Tech Specs & Full Image Dialog (Fixed Sticky Bottom Action Bar) ── */}
        <Dialog open={quickViewProduct !== null} onOpenChange={(open) => !open && setQuickViewProduct(null)}>
          <DialogContent
            className="max-w-3xl lg:max-w-4xl bg-card text-foreground border-foreground/10 rounded-3xl p-4 sm:p-7 shadow-2xl max-h-[88vh] sm:max-h-[90vh] flex flex-col overflow-hidden z-[100]"
            id="itstore-detail-modal"
          >
            {quickViewProduct && (
              <>
                {/* Scrollable Main Area (Image + Specs) */}
                <div className="flex-1 overflow-y-auto pr-1 -mr-1 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-8 items-start">
                    {/* Left Product Image (Full Box Fill) */}
                    <div className="md:col-span-6 flex flex-col h-full">
                      <div
                        className="relative rounded-2xl sm:rounded-3xl bg-foreground/5 border border-foreground/10 overflow-hidden flex items-center justify-center h-[260px] sm:h-[340px] md:h-full md:min-h-[380px] w-full shadow-inner"
                      >
                        <img
                          src={quickViewProduct.image}
                          alt={quickViewProduct.name}
                          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                        />
                        {quickViewProduct.badge && (
                          <span
                            className="absolute top-3.5 left-3.5 z-10 px-3 py-1 rounded-full text-xs font-black text-white shadow-lg backdrop-blur-xs"
                            style={{ background: quickViewProduct.color }}
                          >
                            {getBadgeTranslation(quickViewProduct.badge)}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Right Product Specs Details */}
                    <div className="md:col-span-6 flex flex-col space-y-3">
                      <DialogHeader className="p-0 text-left">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className="text-xs font-black uppercase tracking-wider text-indigo-500">
                            {getCategoryLabel(quickViewProduct.category)}
                          </span>
                          <div className="flex items-center gap-1 text-xs font-bold text-amber-500">
                            <Star className="size-3.5 fill-amber-400 text-amber-400" />
                            <span>{quickViewProduct.rating || 4.8} / 5.0</span>
                            <span className="text-foreground/40 font-normal">
                              ({quickViewProduct.salesCount || 120}+ {t("itstore.sold_count")})
                            </span>
                          </div>
                        </div>

                        <DialogTitle className="font-black text-xl sm:text-2xl text-foreground mt-1 leading-tight">
                          {getProductTranslation(quickViewProduct.id, "name", quickViewProduct.name)}
                        </DialogTitle>
                        <DialogDescription className="text-xs sm:text-sm text-foreground/75 mt-1.5 leading-relaxed">
                          {getProductTranslation(quickViewProduct.id, "desc", quickViewProduct.description)}
                        </DialogDescription>
                      </DialogHeader>

                      {/* Technical Specifications Matrix */}
                      <div className="space-y-2">
                        <div className="text-xs font-black text-foreground/90 uppercase tracking-wider">
                          {t("itstore.tech_specs_title")}
                        </div>
                        <div className="p-3.5 rounded-2xl bg-foreground/5 border border-foreground/10 text-xs font-mono space-y-2 text-foreground/80">
                          <div className="leading-relaxed">
                            <strong className="text-indigo-400 font-sans font-bold">{t("itstore.key_spec")} </strong>
                            <span>{getProductTranslation(quickViewProduct.id, "specs", quickViewProduct.specs)}</span>
                          </div>
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {(quickViewProduct.specTags || ["100% Genuine", "Official Warranty"]).map((t, i) => (
                              <span key={i} className="itstore-spec-badge">{t}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sticky Fixed Bottom Action Footer (Never falls off screen!) */}
                <div className="pt-3 sm:pt-4 border-t border-foreground/10 flex items-center justify-between gap-3 mt-auto bg-card z-20">
                  <div>
                    <div className="text-[10px] sm:text-[11px] text-foreground/50 font-bold uppercase tracking-wider">
                      {t("itstore.official_price")}
                    </div>
                    <div
                      className="text-xl sm:text-2xl font-black font-mono"
                      style={{ color: quickViewProduct.color }}
                    >
                      {money.format(quickViewProduct.price)}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="flex items-center border border-foreground/15 rounded-full p-1 bg-foreground/5">
                      <button
                        type="button"
                        onClick={() => setQuickViewQty((q) => Math.max(1, q - 1))}
                        className="w-7 h-7 rounded-full flex items-center justify-center text-foreground hover:bg-foreground/10 cursor-pointer"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="w-7 text-center text-xs font-extrabold">{quickViewQty}</span>
                      <button
                        type="button"
                        onClick={() => setQuickViewQty((q) => q + 1)}
                        className="w-7 h-7 rounded-full flex items-center justify-center text-foreground hover:bg-foreground/10 cursor-pointer"
                      >
                        <Plus size={12} />
                      </button>
                    </div>

                    <Button
                      type="button"
                      onClick={() => {
                        changeQty(quickViewProduct.id, quickViewQty);
                        setQuickViewProduct(null);
                      }}
                      className="rounded-full px-4 sm:px-6 py-2 sm:py-2.5 font-black text-xs text-white shadow-lg cursor-pointer hover:scale-105 transition-transform"
                      style={{ background: quickViewProduct.color }}
                    >
                      <Plus className="size-3.5 mr-1" />
                      {t("itstore.btn_add")}
                    </Button>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>

        {/* ── Order Review & Pre-Check Dialog (High Z-Index above avatar) ── */}
        <Dialog open={reviewOpen} onOpenChange={setReviewOpen}>
          <DialogContent
            className="max-w-2xl bg-card text-foreground border-foreground/10 rounded-3xl p-5 sm:p-8 overflow-hidden shadow-2xl max-h-[88vh] sm:max-h-[92vh] flex flex-col z-[100]"
            id="itstore-review-dialog"
          >
            <DialogHeader className="p-0 text-left border-b border-foreground/10 pb-3 sm:pb-4">
              <div className="flex items-center justify-between gap-2">
                <DialogTitle className="font-black text-lg sm:text-2xl text-foreground flex items-center gap-2">
                  <ShieldCheck className="size-5 sm:size-6 text-indigo-500" />
                  <span>{t("itstore.review_title")}</span>
                </DialogTitle>
              </div>
              <DialogDescription className="text-xs sm:text-sm text-foreground/70 mt-1">
                {t("itstore.review_subtitle")}
              </DialogDescription>
            </DialogHeader>

            {/* Scrollable Item Review List */}
            <div className="flex-1 overflow-y-auto my-3 sm:my-4 pr-1 space-y-2.5 max-h-[260px]">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 p-2.5 sm:p-3 rounded-2xl bg-foreground/5 border border-foreground/10 hover:border-foreground/20 transition-colors"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl object-cover border border-foreground/10 flex-shrink-0 bg-foreground/5"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://placehold.co/56x56/eef2ff/6366f1?text=IT`;
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="font-extrabold text-xs sm:text-sm text-foreground truncate">
                      {getProductTranslation(item.id, "name", item.name)}
                    </div>
                    <div className="text-[11px] sm:text-xs text-foreground/60 truncate mt-0.5">
                      {getProductTranslation(item.id, "specs", item.specs)}
                    </div>
                    <div className="text-xs font-semibold text-indigo-500 mt-0.5">
                      {money.format(item.price)} × {item.quantity}
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0 font-mono font-black text-sm sm:text-base text-foreground">
                    {money.format(item.price * item.quantity)}
                  </div>
                </div>
              ))}
            </div>

            {/* Cost Breakdown Summary */}
            <div className="rounded-2xl border border-foreground/10 bg-foreground/5 p-3.5 sm:p-4 space-y-1.5 sm:space-y-2 mb-3 sm:mb-4 text-xs sm:text-sm">
              <div className="flex justify-between text-foreground/70">
                <span>{t("itstore.cart_subtotal")}</span>
                <span className="font-semibold text-foreground">{money.format(rawSubtotal)}</span>
              </div>
              {appliedPromo && (
                <div className="flex justify-between text-emerald-500 font-bold">
                  <span>{t("itstore.promo_discount")} ({appliedPromo})</span>
                  <span>-{money.format(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between text-foreground/70">
                <span>{t("itstore.cart_shipping")}</span>
                <span className="font-extrabold text-emerald-500">{t("itstore.cart_shipping_free")}</span>
              </div>
              <div className="flex justify-between text-sm sm:text-base font-black text-foreground pt-2 border-t border-foreground/10">
                <span>{t("itstore.cart_total")}</span>
                <span className="text-lg sm:text-xl font-mono text-indigo-500 dark:text-indigo-400">
                  {money.format(subtotal)}
                </span>
              </div>
            </div>

            {/* Confirmation Button with 3s Countdown */}
            <div className="space-y-2.5 pt-1">
              <button
                type="button"
                onClick={() => {
                  if (reviewCountdown > 0) return;
                  setReviewOpen(false);
                  checkout();
                }}
                disabled={cartItems.length === 0 || reviewCountdown > 0}
                className={`w-full py-3 sm:py-3.5 px-6 rounded-2xl font-black text-xs sm:text-sm transition-all duration-300 flex items-center justify-center gap-2 shadow-lg ${
                  reviewCountdown > 0
                    ? "bg-foreground/10 text-foreground/45 border border-foreground/10 cursor-not-allowed select-none"
                    : "text-white hover:scale-[1.01] active:scale-95 hover:shadow-indigo-500/30 cursor-pointer"
                }`}
                style={
                  reviewCountdown === 0
                    ? { background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%)" }
                    : undefined
                }
                id="itstore-confirm-order-btn"
              >
                {reviewCountdown > 0 ? (
                  <>
                    <Clock className="size-4 animate-spin text-indigo-500" style={{ animationDuration: "3s" }} />
                    <span>
                      {t("itstore.confirm_in_seconds")} ({reviewCountdown}s)
                    </span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="size-4.5 text-white" />
                    <span>{t("itstore.confirm_payment")}</span>
                  </>
                )}
              </button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setReviewOpen(false)}
                  className="text-xs font-bold text-foreground/50 hover:text-foreground transition-colors cursor-pointer"
                >
                  {t("itstore.btn_back_cart")}
                </button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* ── Mobile Cart Drawer Dialog (Opens when clicking floating cart or header on mobile) ── */}
        <Dialog open={cartDrawerOpen} onOpenChange={setCartDrawerOpen}>
          <DialogContent
            className="max-w-lg bg-card text-foreground border-foreground/10 rounded-3xl p-5 sm:p-6 shadow-2xl max-h-[85vh] flex flex-col z-[100]"
            id="itstore-mobile-cart-drawer"
          >
            <DialogHeader className="p-0 text-left border-b border-foreground/10 pb-3 flex flex-row items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingCart className="size-5 text-indigo-500" />
                <DialogTitle className="font-extrabold text-base sm:text-lg text-foreground">
                  {t("itstore.cart_title")} ({itemCount})
                </DialogTitle>
              </div>
              {cartItems.length > 0 && (
                <button
                  onClick={() => setCart({})}
                  className="text-xs font-bold text-red-500 hover:text-red-600 cursor-pointer"
                >
                  {t("itstore.remove_promo")}
                </button>
              )}
            </DialogHeader>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto my-3 pr-1 space-y-2 max-h-[280px]">
              {cartItems.length === 0 ? (
                <div className="text-center py-8 text-foreground/50 text-xs">
                  {t("itstore.cart_empty")}
                </div>
              ) : (
                cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 p-2.5 rounded-2xl bg-foreground/5 border border-foreground/10"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-11 h-11 rounded-xl object-cover border border-foreground/10 flex-shrink-0"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://placehold.co/48x48/eef2ff/6366f1?text=IT`;
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="font-extrabold text-xs text-foreground truncate">
                        {getProductTranslation(item.id, "name", item.name)}
                      </div>
                      <div className="text-xs font-mono font-bold text-indigo-500 mt-0.5">
                        {money.format(item.price)}
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <button
                        onClick={() => changeQty(item.id, -1)}
                        className="w-6 h-6 rounded-full flex items-center justify-center bg-foreground/10 text-foreground hover:bg-foreground/20 text-xs cursor-pointer font-bold"
                      >
                        -
                      </button>
                      <span className="w-5 text-center text-xs font-black">{item.quantity}</span>
                      <button
                        onClick={() => changeQty(item.id, 1)}
                        className="w-6 h-6 rounded-full flex items-center justify-center bg-foreground/10 text-foreground hover:bg-foreground/20 text-xs cursor-pointer font-bold"
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Cart Summary & Checkout */}
            <div className="pt-3 border-t border-foreground/10 space-y-2 bg-card">
              <div className="flex justify-between text-xs text-foreground/70">
                <span>{t("itstore.cart_subtotal")}</span>
                <span className="font-bold text-foreground">{money.format(rawSubtotal)}</span>
              </div>
              {appliedPromo && (
                <div className="flex justify-between text-xs text-emerald-500 font-bold">
                  <span>{t("itstore.promo_discount")} ({appliedPromo})</span>
                  <span>-{money.format(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between text-xs text-foreground/70">
                <span>{t("itstore.cart_shipping")}</span>
                <span className="font-bold text-emerald-500">{t("itstore.cart_shipping_free")}</span>
              </div>
              <div className="flex justify-between text-sm font-black text-foreground pt-2 border-t border-foreground/10">
                <span>{t("itstore.cart_total")}</span>
                <span className="text-indigo-500">{money.format(subtotal)}</span>
              </div>

              <button
                onClick={() => {
                  setCartDrawerOpen(false);
                  setReviewOpen(true);
                }}
                disabled={cartItems.length === 0}
                className="w-full mt-2 py-3 rounded-2xl text-xs font-black text-white flex items-center justify-center gap-1.5 shadow-lg disabled:opacity-40 cursor-pointer"
                style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)" }}
              >
                <ChevronRight size={16} /> {t("itstore.cart_review_checkout")}
              </button>
            </div>
          </DialogContent>
        </Dialog>

        {/* ── Invoice Dialog (High Z-Index above avatar) ─────────────────── */}
        <Dialog open={invoiceOpen} onOpenChange={setInvoiceOpen}>
          <DialogContent className="max-w-md bg-background text-foreground border-foreground/10 z-[100]" id="itstore-invoice-dialog">
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
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            `https://placehold.co/48x48/eef2ff/6366f1?text=IT`;
                        }}
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
                  {order.discount ? (
                    <div className="flex justify-between text-sm text-emerald-500 font-semibold">
                      <span>{t("itstore.promo_discount")}</span>
                      <span>-{money.format(order.discount)}</span>
                    </div>
                  ) : null}
                  <div className="flex justify-between text-sm text-foreground/70">
                    <span>{t("itstore.cart_shipping")}</span>
                    <span className="text-emerald-500 font-semibold">{t("itstore.cart_shipping_free")}</span>
                  </div>
                  <div className="flex justify-between text-base font-extrabold text-foreground border-t border-foreground/10 pt-3">
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
}