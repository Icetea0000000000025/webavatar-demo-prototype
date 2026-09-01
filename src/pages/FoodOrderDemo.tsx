import {
  Check,
  ChefHat,
  ChevronRight,
  Clock,
  Home,
  Minus,
  Plus,
  ReceiptText,
  ShoppingBag,
  Sparkles,
  Trash2,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "@/lib/LanguageContext";
import PageSkeleton from "@/components/PageSkeleton";
import ScrollVelocityImageHeader from "@/components/ScrollVelocityImageHeader";

import greenCurryImage from "@/assets/green-curry.jpg";
import greenCurry2Image from "@/assets/green-curry-2.jpg";
import greenCurry3Image from "@/assets/green-curry-3.jpg";

import mangoStickyRiceImage from "@/assets/mango-sticky-rice.jpg";
import mangoStickyRice2Image from "@/assets/mango-sticky-rice-2.jpg";
import mangoStickyRice3Image from "@/assets/mango-sticky-rice-3.jpg";

import padKrapaoImage from "@/assets/pad-krapao.jpg";
import padKrapao2Image from "@/assets/pad-krapao-2.jpg";
import padKrapao3Image from "@/assets/pad-krapao-3.jpg";

import tomYumImage from "@/assets/tom-yum.jpg";
import tomYum2Image from "@/assets/tom-yum-2.jpg";
import tomYum3Image from "@/assets/tom-yum-3.jpg";

import friedriceImage from "@/assets/fried-rice.jpg";
import friedrice2Image from "@/assets/fried-rice-2.jpg";
import friedrice3Image from "@/assets/fried-rice-3.jpg";

import tomyumnoodleImage from "@/assets/tomyum-noodle.jpg";
import tomyumnoodle2Image from "@/assets/tomyum-noodle-2.jpg";
import tomyumnoodle3Image from "@/assets/tomyum-noodle-3.jpg";

import promoFood1 from "@/assets/promo-food-1.jpg";
import promoFood2 from "@/assets/promo-food-2.jpg";
import promoFood3 from "@/assets/promo-food-3.jpg";
import promoFood4 from "@/assets/promo-food-4.jpg";
import promoFood5 from "@/assets/promo-food-5.jpg";
import promoFood6 from "@/assets/promo-food-6.jpg";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export interface MenuItem {
  id: string;
  name: string;
  englishName: string;
  description: string;
  category: "เมนูยอดนิยม" | "อาหารจานเดียว" | "กับข้าว" | "ของหวาน";
  price: number;
  image: string;
  images?: string[];
  hoverImage?: string;
  spicy?: boolean;
}

export type Cart = Record<string, number>;

export interface Receipt {
  orderId: string;
  orderedAt: string;
  timestamp?: number;
  items: Array<MenuItem & { quantity: number }>;
  subtotal: number;
  serviceFee: number;
  total: number;
}

export function formatOrderDate(dateVal: string | number | undefined, lang: string): string {
  if (!dateVal) return "";
  let date: Date;
  if (typeof dateVal === "number") {
    date = new Date(dateVal);
  } else {
    const parsed = Number(dateVal);
    if (!isNaN(parsed) && parsed > 1000000000000) {
      date = new Date(parsed);
    } else {
      date = new Date(dateVal);
    }
  }
  if (isNaN(date.getTime())) {
    return String(dateVal);
  }
  const localeMap: Record<string, string> = {
    th: 'th-TH',
    en: 'en-US',
    zh: 'zh-CN',
    ja: 'ja-JP',
    ko: 'ko-KR',
    es: 'es-ES',
    fr: 'fr-FR',
  };
  const locale = localeMap[lang] || 'en-US';
  return date.toLocaleString(locale, { dateStyle: "medium", timeStyle: "short" });
}

function FoodItemImage({
  images,
  alt,
}: {
  images: string[];
  alt: string;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Auto slide ONLY when user hovers mouse over this specific menu item
  useEffect(() => {
    if (!isHovered || !images || images.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 1800);

    return () => clearInterval(timer);
  }, [isHovered, images]);

  return (
    <div
      className="relative w-32 sm:w-40 shrink-0 aspect-square overflow-hidden bg-stone-100 dark:bg-stone-950 group/img cursor-pointer select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setCurrentIndex(0);
      }}
    >
      {/* Animated Image Carousel */}
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.img
          key={currentIndex}
          src={images[currentIndex]}
          alt={`${alt} view ${currentIndex + 1}`}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover"
          initial={{ opacity: 0, x: 25, scale: 1.05 }}
          animate={{ opacity: 1, x: 0, scale: isHovered ? 1.08 : 1 }}
          exit={{ opacity: 0, x: -25, scale: 0.95 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        />
      </AnimatePresence>

    </div>
  );
}

const menu: MenuItem[] = [
  {
    id: "krapao",
    name: "ข้าวกะเพราไก่ไข่ดาว",
    englishName: "Chicken Pad Kra Pao",
    description: "กะเพราหอมฉุน ผัดไฟแรง เสิร์ฟพร้อมไข่ดาวกรอบ",
    category: "เมนูยอดนิยม",
    price: 89,
    image: padKrapaoImage,
    images: [padKrapaoImage, padKrapao2Image, padKrapao3Image],
    spicy: true,
  },
  {
    id: "tomyum",
    name: "ต้มยำกุ้งน้ำข้น",
    englishName: "Creamy Tom Yum Goong",
    description: "กุ้งสดตัวโต น้ำซุปเข้มข้น หอมสมุนไพรไทย",
    category: "เมนูยอดนิยม",
    price: 179,
    image: tomYumImage,
    images: [tomYumImage, tomYum2Image, tomYum3Image],
    spicy: true,
  },
  {
    id: "green-curry",
    name: "แกงเขียวหวานไก่",
    englishName: "Green Curry Chicken",
    description: "เครื่องแกงตำสด กะทิหอมมัน พร้อมข้าวสวย",
    category: "กับข้าว",
    price: 149,
    image: greenCurryImage,
    images: [greenCurryImage, greenCurry2Image, greenCurry3Image],
    spicy: true,
  },
  {
    id: "mango-rice",
    name: "ข้าวเหนียวมะม่วง",
    englishName: "Mango Sticky Rice",
    description: "มะม่วงสุกหวาน ข้าวเหนียวมูนราดกะทิสด",
    category: "ของหวาน",
    price: 119,
    image: mangoStickyRiceImage,
    images: [mangoStickyRiceImage, mangoStickyRice2Image, mangoStickyRice3Image],
  },
  {
    id: "fried-rice",
    name: "ข้าวผัดกุ้ง",
    englishName: "Shrimp Fried Rice",
    description: "ข้าวหอมมะลิผัดหอมกระทะ กุ้งสดและผักกรอบ",
    category: "อาหารจานเดียว",
    price: 109,
    image: friedriceImage,
    images: [friedriceImage, friedrice2Image, friedrice3Image],
  },
  {
    id: "tomyum-noodle",
    name: "ก๋วยเตี๋ยวต้มยำ",
    englishName: "Tom Yum Noodles",
    description: "เส้นนุ่ม น้ำต้มยำรสจัดจ้าน ถั่วคั่วหอม",
    category: "อาหารจานเดียว",
    price: 79,
    image: tomyumnoodleImage,
    images: [tomyumnoodleImage, tomyumnoodle2Image, tomyumnoodle3Image],
    spicy: true,
  },
];

const categories = ["ทั้งหมด", "เมนูยอดนิยม", "อาหารจานเดียว", "กับข้าว", "ของหวาน"] as const;
const money = new Intl.NumberFormat("th-TH", {
  style: "currency",
  currency: "THB",
  maximumFractionDigits: 0,
});
const CART_KEY = "botnoi-restaurant-cart";
const RECEIPT_KEY = "botnoi-restaurant-last-receipt";

function getItemCustomizationConfig(item: MenuItem | null, lang: string) {
  if (!item) return { spicinessLabel: undefined, spicinessOptions: [], addonLabel: "Add-ons", addons: [] };

  const isTh = lang === 'th';
  const isZh = lang === 'zh';
  const isJa = lang === 'ja';
  const isKo = lang === 'ko';

  if (item.category === "ของหวาน") {
    return {
      spicinessLabel: isTh ? "ระดับความหวาน" : isZh ? "甜度选择" : isJa ? "甘さの選択" : isKo ? "당도 선택" : "Sweetness Level",
      spicinessOptions: isTh ? ["หวานน้อย", "หวานปกติ", "หวานมาก"] : isZh ? ["微甜", "正常甜", "加甜"] : isJa ? ["控えめ", "普通", "甘め"] : ["Less Sweet", "Normal", "Extra Sweet"],
      defaultOption: isTh ? "หวานปกติ" : isZh ? "正常甜" : isJa ? "普通" : "Normal",
      addonLabel: isTh ? "ท็อปปิ้งเสริม (Add-ons)" : isZh ? "加料 (Add-ons)" : isJa ? "トッピング (Add-ons)" : "Add-ons",
      addons: [
        { id: "coconut", label: isTh ? "เพิ่มกะทิมูนสด" : isZh ? "加鲜椰浆" : isJa ? "ココナッツミルク追加" : "Extra Coconut Milk", price: 10 },
        { id: "mango", label: isTh ? "เพิ่มเนื้อมะม่วงสุก" : isZh ? "加芒果肉" : isJa ? "完熟マンゴー追加" : "Extra Ripe Mango", price: 30 },
      ]
    };
  }

  if (item.id === "tomyum" || item.id === "green-curry") {
    return {
      spicinessLabel: isTh ? "ระดับความเผ็ด" : isZh ? "辣度选择" : isJa ? "辛さの選択" : isKo ? "매운맛 선택" : "Spiciness Level",
      spicinessOptions: isTh ? ["เผ็ดน้อย", "เผ็ดปกติ", "เผ็ดมาก"] : isZh ? ["微辣", "中辣", "特辣"] : isJa ? ["小辛", "中辛", "大辛"] : ["Mild", "Medium", "Spicy"],
      defaultOption: isTh ? "เผ็ดปกติ" : isZh ? "中辣" : isJa ? "中辛" : "Medium",
      addonLabel: isTh ? "ท็อปปิ้งเสริม (Add-ons)" : isZh ? "加料 (Add-ons)" : isJa ? "トッピング (Add-ons)" : "Add-ons",
      addons: [
        { id: "shrimp", label: isTh ? "เพิ่มกุ้งตัวโต" : isZh ? "加鲜大虾" : isJa ? "大エビ追加" : "Extra Jumbo Shrimp", price: 40 },
        { id: "rice", label: isTh ? "เพิ่มข้าวสวยหอมมะลิ" : isZh ? "加香米饭" : isJa ? "ジャスミンライス追加" : "Extra Jasmine Rice", price: 10 },
      ]
    };
  }

  if (item.id === "tomyum-noodle") {
    return {
      spicinessLabel: isTh ? "ระดับความเผ็ด" : isZh ? "辣度选择" : isJa ? "辛さの選択" : isKo ? "매운맛 선택" : "Spiciness Level",
      spicinessOptions: isTh ? ["เผ็ดน้อย", "เผ็ดปกติ", "เผ็ดมาก"] : isZh ? ["微辣", "中辣", "特辣"] : isJa ? ["小辛", "中辛", "大辛"] : ["Mild", "Medium", "Spicy"],
      defaultOption: isTh ? "เผ็ดปกติ" : isZh ? "中辣" : isJa ? "中辛" : "Medium",
      addonLabel: isTh ? "ท็อปปิ้งเสริม (Add-ons)" : isZh ? "加料 (Add-ons)" : isJa ? "トッピング (Add-ons)" : "Add-ons",
      addons: [
        { id: "boiledegg", label: isTh ? "เพิ่มไข่ต้มยางมะตูม" : isZh ? "加温泉蛋" : isJa ? "半熟煮卵追加" : "Extra Boiled Egg", price: 15 },
        { id: "peanuts", label: isTh ? "เพิ่มถั่วคั่วบด" : isZh ? "加花生碎" : isJa ? "ピーナッツ追加" : "Extra Roasted Peanuts", price: 5 },
      ]
    };
  }

  // Default for single dishes (krapao, fried-rice, etc.)
  return {
    spicinessLabel: item.spicy ? (isTh ? "ระดับความเผ็ด" : isZh ? "辣度选择" : isJa ? "辛さの選択" : isKo ? "매운맛 선택" : "Spiciness Level") : undefined,
    spicinessOptions: item.spicy ? (isTh ? ["เผ็ดน้อย", "เผ็ดปกติ", "เผ็ดมาก"] : isZh ? ["微辣", "中辣", "特辣"] : isJa ? ["小辛", "中辛", "大辛"] : ["Mild", "Medium", "Spicy"]) : undefined,
    defaultOption: item.spicy ? (isTh ? "เผ็ดปกติ" : isZh ? "中辣" : isJa ? "中辛" : "Medium") : undefined,
    addonLabel: isTh ? "ท็อปปิ้งเสริม (Add-ons)" : isZh ? "加料 (Add-ons)" : isJa ? "トッピング (Add-ons)" : "Add-ons",
    addons: [
      { id: "egg", label: isTh ? "เพิ่มไข่ดาวกรอบ" : isZh ? "加煎蛋" : isJa ? "目玉焼き追加" : "Extra Crispy Fried Egg", price: 15 },
      { id: "rice", label: isTh ? "เพิ่มข้าวสวยหอมมะลิ" : isZh ? "加香米饭" : isJa ? "ジャスミンライス追加" : "Extra Jasmine Rice", price: 10 },
    ]
  };
}

interface ActiveKitchenOrder {
  orderId: string;
  timestamp: number;
  items: Array<{ id: string; name: string; price: number; quantity: number }>;
  subtotal: number;
  serviceFee: number;
  total: number;
  step: 1 | 2 | 3;
}

export default function FoodOrderDemo() {
  const { t, language } = useTranslation();
  const [category, setCategory] = useState<(typeof categories)[number]>("ทั้งหมด");
  const [cart, setCart] = useState<Cart>({});
  const [receipt, setReceipt] = useState<Receipt | null>(null);
  const [receiptOpen, setReceiptOpen] = useState(false);
  const [cartModalOpen, setCartModalOpen] = useState(false);
  const [trackerOpen, setTrackerOpen] = useState(false);
  const [activeOrders, setActiveOrders] = useState<ActiveKitchenOrder[]>([]);
  const [ready, setReady] = useState(false);
  const [customizeItem, setCustomizeItem] = useState<MenuItem | null>(null);
  const [spiciness, setSpiciness] = useState<string>("เผ็ดปกติ");
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [specialNote, setSpecialNote] = useState<string>("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [chatBubbleExpanded, setChatBubbleExpanded] = useState<boolean>(true);

  const showToast = (msg: string) => {
    setToastMessage(msg);
  };

  useEffect(() => {
    if (!toastMessage) return;
    const timer = setTimeout(() => {
      setToastMessage(null);
    }, 2500);
    return () => clearTimeout(timer);
  }, [toastMessage]);

  useEffect(() => {
    if (activeOrders.length === 0) return;
    const interval = setInterval(() => {
      const now = Date.now();
      setActiveOrders(prev => {
        let changed = false;
        const updated = prev.map(order => {
          const elapsed = now - order.timestamp;
          let step: 1 | 2 | 3 = 1;
          if (elapsed >= 5000) step = 3;
          else if (elapsed >= 2000) step = 2;

          if (step !== order.step) {
            changed = true;
            return { ...order, step };
          }
          return order;
        });

        const active = updated.filter(order => now - order.timestamp < 8000);
        if (active.length !== prev.length) changed = true;

        return changed ? active : prev;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [activeOrders.length]);

  useEffect(() => {
    if (trackerOpen && activeOrders.length === 0) {
      setTrackerOpen(false);
    }
  }, [activeOrders.length, trackerOpen]);

  const getItemName = (item: MenuItem) => {
    if (language === 'th') return item.name;
    const translationKey = `food_item.${item.id.replace("-", "")}.name`;
    const translated = t(translationKey as any);
    return translated && translated !== translationKey ? translated : item.englishName;
  };

  const getItemDescription = (item: MenuItem) => {
    if (language === 'th') return item.description;
    const translationKey = `food_item.${item.id.replace("-", "")}.desc`;
    const translated = t(translationKey as any);
    return translated && translated !== translationKey ? translated : item.description;
  };

  const getCategoryLabel = (cat: string) => {
    switch (cat) {
      case "ทั้งหมด": return t("food.category_all");
      case "เมนูยอดนิยม": return t("food.category_popular");
      case "อาหารจานเดียว": return t("food.category_single");
      case "กับข้าว": return t("food.category_dishes");
      case "ของหวาน": return t("food.category_dessert");
      default: return cat;
    }
  };

  const getDiscoverTitle = (lang: string) => {
    switch (lang) {
      case 'th': return 'ค้นพบเมนูของเรา';
      case 'zh': return '探索我们的精选菜单';
      case 'ja': return 'シェフおすすめメニューのご紹介';
      case 'ko': return '셰프 추천 메뉴 탐색';
      case 'es': return 'Descubra nuestros menús';
      case 'fr': return 'Découvrez nos menus';
      default: return 'Discover Our Menus';
    }
  };

  const getDiscoverSubtitle = (lang: string) => {
    switch (lang) {
      case 'th': return 'สัมผัสรสชาติอาหารไทยต้นตำรับ ปรุงสดใหม่ด้วยวัตถุดิบคุณภาพเยี่ยมจากเชฟของเรา';
      case 'zh': return '品尝我们大厨精心烹制的正宗泰式美味与新鲜食材。';
      case 'ja': return 'シェフが厳選した新鮮な本場の食材で作る絶品タイ料理をお楽しみください。';
      case 'ko': return '셰프가 엄선한 신선하고 정통 재료로 정성껏 요리한 태국 요리를 만나보세요.';
      case 'es': return 'Explore las creaciones culinarias de nuestro chef preparadas con ingredientes frescos y auténticos.';
      case 'fr': return 'Découvrez les créations culinaires de notre chef préparées avec des ingrédients frais et authentiques.';
      default: return 'Explore our chef\'s signature culinary creations prepared with fresh, authentic ingredients.';
    }
  };

  const showcaseImages = useMemo(() => [
    promoFood1,
    promoFood2,
    promoFood3,
    promoFood4,
    promoFood5,
    promoFood6,
  ], []);

  useEffect(() => {
    try {
      const savedCart = window.localStorage.getItem(CART_KEY);
      const savedReceipt = window.localStorage.getItem(RECEIPT_KEY);
      if (savedCart) setCart(JSON.parse(savedCart) as Cart);
      if (savedReceipt) setReceipt(JSON.parse(savedReceipt) as Receipt);
    } catch {
      window.localStorage.removeItem(CART_KEY);
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) window.localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }, [cart, ready]);

  const visibleMenu =
    category === "ทั้งหมด" ? menu : menu.filter((item) => item.category === category);
  const cartItems = useMemo(
    () =>
      menu
        .filter((item) => (cart[item.id] ?? 0) > 0)
        .map((item) => ({ ...item, quantity: cart[item.id] ?? 0 })),
    [cart],
  );
  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const serviceFee = subtotal > 0 ? 10 : 0;

  const changeQuantity = (id: string, amount: number) => {
    const targetItem = menu.find((m) => m.id === id);
    if (amount > 0 && targetItem) {
      const name = getItemName(targetItem);
      showToast(language === 'th' ? `เพิ่ม "${name}" ลงในตะกร้าแล้ว!` : `Added "${name}" to cart!`);
      setChatBubbleExpanded(true);
    }
    setCart((current) => {
      const nextQuantity = Math.max(0, (current[id] ?? 0) + amount);
      const next = { ...current, [id]: nextQuantity };
      if (nextQuantity === 0) delete next[id];
      return next;
    });
  };

  const checkout = () => {
    if (cartItems.length === 0) return;
    const now = Date.now();
    const nextReceipt: Receipt = {
      orderId: `BN${now.toString().slice(-6)}`,
      timestamp: now,
      orderedAt: new Date(now).toISOString(),
      items: cartItems.map(item => ({
        ...item,
        name: getItemName(item),
      })),
      subtotal,
      serviceFee,
      total: subtotal + serviceFee,
    };
    window.localStorage.setItem(RECEIPT_KEY, JSON.stringify(nextReceipt));
    try {
      const savedOrders = window.localStorage.getItem("botnoi-restaurant-orders");
      const orders = savedOrders ? JSON.parse(savedOrders) : [];
      orders.unshift(nextReceipt);
      window.localStorage.setItem("botnoi-restaurant-orders", JSON.stringify(orders));
    } catch (e) {
      console.error(e);
    }
    setReceipt(nextReceipt);
    setCart({});
    const newOrder: ActiveKitchenOrder = {
      orderId: nextReceipt.orderId,
      timestamp: now,
      items: nextReceipt.items,
      subtotal,
      serviceFee,
      total: nextReceipt.total,
      step: 1,
    };
    setActiveOrders(prev => [newOrder, ...prev]);
    setTrackerOpen(true);
  };

  return (
    <>
      <AnimatePresence>
        {!ready && <PageSkeleton variant="order" />}
      </AnimatePresence>

      {/* iOS Chat Bubble Floating Cart Widget on Left Side (Fixed Viewport Window with Open/Close Toggle) */}
      <AnimatePresence>
        {itemCount > 0 && (
          <motion.div
            initial={{ opacity: 0, x: -60, scale: 0.85 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -60, scale: 0.85 }}
            transition={{ type: "spring", stiffness: 350, damping: 26 }}
            className="fixed bottom-6 left-6 z-[9999] flex flex-col pointer-events-auto"
          >
            {chatBubbleExpanded ? (
              /* Expanded iOS Chat Bubble Container */
              <div className="relative group w-72 sm:w-80 p-4 rounded-3xl rounded-bl-sm bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-xl transition-all duration-300 select-none text-left">
                {/* iOS Chat Header */}
                <div className="flex items-center justify-between gap-3 mb-2.5 pb-2 border-b border-stone-100 dark:border-stone-800/80">
                  <div className="flex items-center gap-2.5">
                    {/* ONLY Icon Clickable Toggle */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setChatBubbleExpanded(prev => !prev);
                      }}
                      className="relative size-9 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white flex items-center justify-center shadow-md shrink-0 cursor-pointer hover:scale-105 transition-transform"
                      title={language === 'th' ? 'ย่อกล่องแชท' : 'Minimize Chat'}
                      aria-label="Minimize Chat"
                    >
                      <ShoppingBag className="size-4" />
                      <span className="absolute -top-0.5 -right-0.5 size-3 rounded-full bg-emerald-400 border-2 border-white dark:border-stone-900" />
                    </button>

                    <div className="leading-tight min-w-0">
                      <p className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 tracking-wide uppercase">
                        {language === 'th' ? 'iMessage · ตะกร้าอาหาร' : 'iMessage · Food Cart'}
                      </p>
                      <h4 className="text-xs font-black text-stone-900 dark:text-white truncate">
                        {language === 'th' ? `เลือกไว้ ${itemCount} รายการ` : `${itemCount} items selected`}
                      </h4>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="text-[10px] font-semibold text-stone-400 dark:text-stone-500 bg-stone-100 dark:bg-stone-800 px-2 py-0.5 rounded-full">
                      {language === 'th' ? 'เมื่อครู่' : 'now'}
                    </span>
                  </div>
                </div>

                {/* Chat Bubble Body Message */}
                <div className="space-y-1 mb-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-stone-500 dark:text-stone-400 font-medium">
                      {language === 'th' ? 'ราคารวมสุทธิ' : 'Total Amount'}:
                    </span>
                    <span className="font-mono font-black text-emerald-600 dark:text-emerald-400 text-sm">
                      {money.format(subtotal)}
                    </span>
                  </div>
                </div>

                {/* iOS Chat Bubble Action Button */}
                <div
                  onClick={() => setCartModalOpen(true)}
                  className="flex items-center justify-between bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 px-3.5 py-2 rounded-2xl border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 transition-colors cursor-pointer"
                >
                  <span className="text-xs font-bold">
                    {language === 'th' ? 'ดูรายการและชำระเงิน' : 'View Cart & Checkout'}
                  </span>
                  <ChevronRight className="size-4 group-hover:translate-x-1 transition-transform" />
                </div>

                {/* iOS Chat Bubble Tail */}
                <div className="absolute -bottom-1 -left-2 size-4 bg-white dark:bg-stone-900 [clip-path:polygon(100%_0,0_100%,100%_100%)] pointer-events-none" />
              </div>
            ) : (
              /* Minimized Floating iOS Chat Bubble Icon */
              <button
                type="button"
                onClick={() => setChatBubbleExpanded(true)}
                className="relative group cursor-pointer size-13 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 border-2 border-white dark:border-stone-900"
                title={language === 'th' ? 'เปิดดูตะกร้าอาหาร' : 'Open Food Cart'}
                aria-label="Open Food Cart"
              >
                <ShoppingBag className="size-6" />
                {/* Item Count Badge */}
                <span className="absolute -top-1 -right-1 bg-rose-500 text-white font-extrabold text-[11px] size-5 rounded-full flex items-center justify-center shadow-md border-2 border-white dark:border-stone-900 animate-pulse">
                  {itemCount}
                </span>
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="order-theme min-h-screen w-full max-w-full overflow-x-hidden bg-background text-foreground page-grid relative z-10 flex flex-col justify-between">
        {/* ── Header ─────────────────────────────────────────────────────── */}
        <header className="relative z-20 mx-auto mt-2 mb-4 w-[calc(100%-2rem)] max-w-7xl bg-transparent border-none shadow-none transition-all">
          <div className="px-2 py-2 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <nav className="flex items-center gap-2 text-xs text-foreground/60 font-bold" aria-label="Breadcrumb">
              <Link to="/" className="hover:text-emerald-600 transition-colors flex items-center gap-1">
                <Home className="size-3" />
                <span>{t('nav.home')}</span>
              </Link>
              <ChevronRight className="size-3 text-foreground/30" />
              <Link to="/all-demo" className="hover:text-emerald-600 transition-colors">
                <span>{t('showcase.portal')}</span>
              </Link>
              <ChevronRight className="size-3 text-foreground/30" />
              <span className="text-foreground font-extrabold uppercase font-mono flex items-center gap-1.5">
                {t('nav.restaurant')}
              </span>
            </nav>

            <nav className="flex items-center gap-3 text-sm font-semibold">
              {receipt && (
                <>
                  {activeOrders.length > 0 && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => setTrackerOpen(true)} 
                      className="text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 gap-1.5 font-bold rounded-full px-3 py-1.5 transition-colors border border-emerald-500/20 cursor-pointer"
                      id="order-view-tracker"
                    >
                      <ChefHat className="size-4 animate-bounce text-emerald-600" />
                      <span>
                        {language === 'th' 
                          ? `เชฟกำลังปรุง (${activeOrders.length} ออเดอร์)...` 
                          : `Cooking (${activeOrders.length} orders)...`}
                      </span>
                      <span className="relative flex size-2 ml-0.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full size-2 bg-orange-500"></span>
                      </span>
                    </Button>
                  )}
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setReceiptOpen(true)} 
                    className="text-foreground/70 hover:text-foreground gap-1.5 font-bold hover:bg-foreground/5 rounded-full px-3 py-1.5 transition-colors"
                    id="order-view-receipt"
                  >
                    <ReceiptText className="size-4" /> <span>{t("food.nav_receipt")}</span>
                  </Button>
                </>
              )}
              <Link 
                to="/food-demo/admin" 
                className="px-4 py-1.5 rounded-full bg-foreground/5 hover:bg-foreground/10 transition-all border border-foreground/10 text-foreground text-xs font-bold" 
                id="nav-order-admin"
              >
                {t("food.nav_admin")}
              </Link>
            <Button
              variant="restaurant"
              size="restaurant"
              onClick={() => setCartModalOpen(true)}
              className="gap-2 cursor-pointer font-bold"
              id="order-view-cart-button"
            >
              <ShoppingBag className="size-4" /> {t("food.cart_short")}{" "}
              <span className="rounded-full bg-white dark:bg-emerald-950 px-2 py-0.5 text-xs text-emerald-600 dark:text-emerald-400 font-extrabold ml-1 shadow-sm font-mono">
                {itemCount}
              </span>
            </Button>
          </nav>
        </div>
      </header>

      <div
        className="mx-auto w-full max-w-6xl overflow-hidden px-4 py-4 pb-32 sm:px-6 lg:px-8 lg:pb-12 flex-1"
      >
        <section aria-labelledby="menu-heading" className="min-w-0 overflow-hidden">
          {/* Motion Scroll-Velocity Linked Pure Image Marquee Header */}
          <ScrollVelocityImageHeader
            title={getDiscoverTitle(language)}
            subtitle={getDiscoverSubtitle(language)}
            images={showcaseImages}
          />
          
          {/* Categories select tabs with sliding motion pill */}
          <div
            className="mb-8 flex justify-center gap-2 overflow-x-auto whitespace-nowrap pb-3 -mx-4 px-4 scrollbar-hide snap-x"
            role="tablist"
            aria-label={t("food.categories_label")}
          >
            {categories.map((item) => {
              const active = category === item;
              return (
                <button
                  key={item}
                  className={`relative shrink-0 snap-start px-5 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer border ${
                    active 
                      ? "text-emerald-700 dark:text-emerald-300 border-emerald-500/20 dark:border-emerald-500/40" 
                      : "text-stone-500 dark:text-stone-400 border-stone-200 dark:border-stone-800 hover:text-stone-800 dark:hover:text-stone-200 hover:bg-stone-50 dark:hover:bg-stone-800/50"
                  }`}
                  onClick={() => setCategory(item)}
                  role="tab"
                  aria-selected={active}
                  aria-label={`${t("food.select_category_label")}: ${getCategoryLabel(item)}`}
                >
                  <span className="relative z-10">{getCategoryLabel(item)}</span>
                  {active && (
                    <motion.div
                      layoutId="activeCategoryPill"
                      className="absolute inset-0 bg-emerald-50 dark:bg-emerald-950/70 rounded-full"
                      transition={{ type: 'spring', stiffness: 350, damping: 28 }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Menu items display matching image.png horizontal split card grid */}
          <motion.div 
            className="grid gap-5 sm:gap-6 grid-cols-1 md:grid-cols-2"
          >
            <AnimatePresence>
              {visibleMenu.map((item) => {
                const quantity = cart[item.id] ?? 0;
                const name = getItemName(item);
                const description = getItemDescription(item);

                return (
                  <motion.article
                    key={item.id}
                    className="card-lift group flex w-full min-w-0 overflow-hidden rounded-2xl border border-stone-200/80 dark:border-stone-800 bg-white dark:bg-stone-900 hover:border-emerald-500/40 transition-all duration-300 shadow-sm hover:shadow-md flex-row"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    whileHover={{ y: -3 }}
                    transition={{ duration: 0.2 }}
                  >
                    {/* Left Food Photo (Square 1:1 Aspect Ratio) with Hover Auto-Sliding Carousel */}
                    <FoodItemImage
                      images={item.images || [item.image]}
                      alt={name}
                    />

                    {/* Right Content Panel */}
                    <div className="flex min-w-0 flex-1 flex-col justify-between p-3.5 sm:p-4 text-left bg-white dark:bg-stone-900">
                      <div>
                        <div className="flex items-baseline justify-between gap-2">
                          <h3 className="font-display text-base sm:text-lg font-bold leading-tight text-stone-900 dark:text-white tracking-tight line-clamp-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                            {name}
                          </h3>
                          <span className="font-display font-bold text-emerald-600 dark:text-emerald-400 text-base sm:text-lg shrink-0 ml-1">
                            {money.format(item.price)}
                          </span>
                        </div>
                        <p className="mt-1.5 text-xs text-stone-500 dark:text-stone-400 leading-relaxed line-clamp-2 sm:line-clamp-3 font-normal">
                          {description}
                        </p>
                      </div>

                      <div className="pt-2 flex items-center justify-between gap-2 mt-3 border-t border-stone-100 dark:border-stone-800/60">
                        <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider truncate">
                          {name}
                        </span>
                        {quantity === 0 ? (
                          <div className="flex items-center gap-1.5 shrink-0">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 px-2 text-[11px] font-bold text-stone-500 hover:text-emerald-600 dark:text-stone-400 dark:hover:text-emerald-400 cursor-pointer rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-950/50"
                              onClick={() => {
                                setCustomizeItem(item);
                                setSpiciness(item.spicy ? (language === 'th' ? "เผ็ดปกติ" : "Medium") : "");
                                setSelectedAddons([]);
                                setSpecialNote("");
                              }}
                              aria-label={`Option ${name}`}
                              id={`options-${item.id}`}
                            >
                              {language === 'th' ? 'ปรับแต่ง' : language === 'zh' ? '自定义' : language === 'ja' ? 'カスタマイズ' : language === 'ko' ? '옵션' : language === 'es' ? 'Personalizar' : language === 'fr' ? 'Personnaliser' : 'Customize'}
                            </Button>
                            <button
                              type="button"
                              className="btn-108"
                              onClick={() => changeQuantity(item.id, 1)}
                              aria-label={`${t("food.btn_add")}: ${name}`}
                              id={`add-${item.id}`}
                            >
                              <Plus className="size-3.5 mr-1 relative z-10" />
                              <span className="relative z-10">{language === 'th' ? 'เพิ่ม' : language === 'zh' ? '添加' : language === 'ja' ? '追加' : language === 'ko' ? '추가' : language === 'es' ? 'Añadir' : language === 'fr' ? 'Ajouter' : 'Add'}</span>
                            </button>
                          </div>
                        ) : (
                          <div className="flex shrink-0 items-center gap-1 rounded-full border border-stone-200 dark:border-stone-800 bg-stone-100 dark:bg-stone-800/80 p-0.5 shadow-sm">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="size-6 rounded-full text-stone-600 dark:text-stone-300"
                              onClick={() => changeQuantity(item.id, -1)}
                              aria-label={`${t("food.btn_add")} (-): ${name}`}
                              id={`decrease-${item.id}`}
                            >
                              <Minus className="size-3" />
                            </Button>
                            <span className="w-5 text-center text-xs font-extrabold text-stone-800 dark:text-stone-200" id={`quantity-${item.id}`}>{quantity}</span>
                            <Button
                              variant="restaurant"
                              size="icon"
                              className="size-6 rounded-full cursor-pointer"
                              onClick={() => changeQuantity(item.id, 1)}
                              aria-label={`${t("food.btn_add")} (+): ${name}`}
                              id={`increase-${item.id}`}
                            >
                              <Plus className="size-3" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.article>
                );
              })}
            </AnimatePresence>
          </motion.div>
        </section>
      </div>
      {/* Modal Dialog showing ordered items in cart */}
      <Dialog open={cartModalOpen} onOpenChange={setCartModalOpen}>
        <DialogContent className="max-h-[85vh] overflow-y-auto rounded-3xl border-stone-200 dark:border-stone-800 p-6 sm:max-w-md bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100">
          <DialogHeader>
            <DialogTitle className="font-display text-xl font-bold flex items-center gap-2">
              <ShoppingBag className="size-5 text-emerald-600 dark:text-emerald-400" />
              <span>{language === 'th' ? `รายการอาหารที่สั่ง (${itemCount})` : language === 'zh' ? `已点菜品 (${itemCount})` : language === 'ja' ? `ご注文一覧 (${itemCount})` : language === 'ko' ? `주문 내역 (${itemCount})` : `Order Cart (${itemCount})`}</span>
            </DialogTitle>
          </DialogHeader>

          {cartItems.length === 0 ? (
            <div className="py-8 text-center text-stone-500 dark:text-stone-400 text-sm font-semibold">
              {t("food.cart_empty")}
            </div>
          ) : (
            <>
              <div className="my-4 divide-y divide-stone-100 dark:divide-stone-800 max-h-[320px] overflow-y-auto pr-1">
                {cartItems.map((item) => {
                  const name = getItemName(item);
                  return (
                    <div key={item.id} className="py-3 flex items-center justify-between gap-2.5 sm:gap-3" id={`cart-item-${item.id}`}>
                      <img src={item.image} alt={name} className="size-12 sm:size-14 rounded-xl object-cover shrink-0" />
                      <div className="min-w-0 flex-1">
                        <h4 className="font-bold text-sm text-stone-800 dark:text-stone-100 truncate">{name}</h4>
                        <p className="text-xs text-stone-500 font-semibold">{money.format(item.price)}</p>
                      </div>
                      <div className="flex items-center gap-1 rounded-full border border-stone-200 dark:border-stone-800 bg-stone-100 dark:bg-stone-800 p-0.5 shrink-0">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-6 rounded-full"
                          onClick={() => changeQuantity(item.id, -1)}
                          aria-label={`Decrease ${name}`}
                          id={`decrease-cart-${item.id}`}
                        >
                          <Minus className="size-3" />
                        </Button>
                        <span className="w-5 text-center text-xs font-bold font-mono">{item.quantity}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-6 rounded-full"
                          onClick={() => changeQuantity(item.id, 1)}
                          aria-label={`Increase ${name}`}
                          id={`increase-cart-${item.id}`}
                        >
                          <Plus className="size-3" />
                        </Button>
                      </div>
                      <p className="font-extrabold text-xs sm:text-sm text-emerald-600 dark:text-emerald-400 font-mono shrink-0 text-right">
                        {money.format(item.price * item.quantity)}
                      </p>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-7 text-stone-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-full shrink-0 transition-colors cursor-pointer"
                        onClick={() => changeQuantity(item.id, -item.quantity)}
                        aria-label={`Delete ${name}`}
                        id={`remove-cart-${item.id}`}
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                    </div>
                  );
                })}
              </div>

              <div className="border-t border-dashed border-stone-200 dark:border-stone-800 pt-4 space-y-2 text-xs font-semibold text-stone-500 dark:text-stone-400">
                <div className="flex justify-between">
                  <span>{t("food.cart_subtotal")}</span>
                  <span className="font-mono">{money.format(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>{t("food.cart_service")}</span>
                  <span className="font-mono">{money.format(serviceFee)}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-stone-100 dark:border-stone-800 text-base font-bold text-stone-900 dark:text-white">
                  <span>{t("food.cart_total")}</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-mono text-xl">{money.format(subtotal + serviceFee)}</span>
                </div>
              </div>

              <Button
                variant="restaurant"
                size="restaurant"
                className="mt-5 w-full font-bold justify-center"
                onClick={() => {
                  setCartModalOpen(false);
                  checkout();
                }}
                id="modal-checkout-button"
              >
                {t("food.cart_checkout")} <ChevronRight className="size-4" />
              </Button>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Customization Dialog Modal */}
      <Dialog open={!!customizeItem} onOpenChange={(open) => !open && setCustomizeItem(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto rounded-3xl border-stone-200 dark:border-stone-800 p-5 sm:p-6 sm:max-w-md bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100">
          {customizeItem && (() => {
            const config = getItemCustomizationConfig(customizeItem, language);
            const addonsTotal = config.addons
              .filter(a => selectedAddons.includes(a.id))
              .reduce((sum, a) => sum + a.price, 0);
            const itemPriceTotal = customizeItem.price + addonsTotal;

            return (
              <div>
                <DialogHeader>
                  <DialogTitle className="sr-only">{getItemName(customizeItem)} - {language === 'th' ? 'ตัวเลือกเพิ่มเติม' : 'Customization Options'}</DialogTitle>
                </DialogHeader>

                <div className="flex gap-4 items-center pb-4 border-b border-stone-100 dark:border-stone-800">
                  <img src={customizeItem.image} alt="" className="size-16 rounded-2xl object-cover shadow-sm shrink-0" />
                  <div className="min-w-0 flex-1">
                    <h3 className="font-display font-bold text-lg text-stone-900 dark:text-white truncate">{getItemName(customizeItem)}</h3>
                    <p className="text-xs text-stone-500 dark:text-stone-400 font-semibold line-clamp-1">{customizeItem.description}</p>
                    <p className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400 font-mono mt-0.5">{money.format(customizeItem.price)}</p>
                  </div>
                </div>

                <div className="py-4 space-y-4">
                  {/* Spiciness / Sweetness Level */}
                  {config.spicinessLabel && config.spicinessOptions && (
                    <div>
                      <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-2">
                        {config.spicinessLabel}
                      </label>
                      <div className="flex gap-2">
                        {config.spicinessOptions.map((lvl) => {
                          const active = (spiciness || config.defaultOption) === lvl;
                          return (
                            <button
                              key={lvl}
                              type="button"
                              onClick={() => setSpiciness(lvl)}
                              className={`flex-1 py-2 px-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                                active
                                  ? "bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border-emerald-500/50 shadow-sm"
                                  : "bg-stone-50 dark:bg-stone-800/40 text-stone-600 dark:text-stone-400 border-stone-200 dark:border-stone-800"
                              }`}
                            >
                              {lvl}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Addons */}
                  {config.addons.length > 0 && (
                    <div>
                      <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-2">
                        {config.addonLabel}
                      </label>
                      <div className="space-y-2">
                        {config.addons.map((addon) => {
                          const checked = selectedAddons.includes(addon.id);
                          return (
                            <button
                              key={addon.id}
                              type="button"
                              onClick={() => {
                                setSelectedAddons(prev =>
                                  checked ? prev.filter(i => i !== addon.id) : [...prev, addon.id]
                                );
                              }}
                              className={`w-full flex items-center justify-between p-3 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                                checked
                                  ? "bg-emerald-50/70 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-200 border-emerald-500/40"
                                  : "bg-stone-50 dark:bg-stone-800/40 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-800"
                              }`}
                            >
                              <span>{addon.label}</span>
                              <span className="font-mono text-emerald-600 dark:text-emerald-400 font-extrabold">+฿{addon.price}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Special note */}
                  <div>
                    <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-2">
                      {language === 'th' ? "หมายเหตุถึงเชฟ (Special Request)" : "Special Instructions"}
                    </label>
                    <input
                      type="text"
                      value={specialNote}
                      onChange={(e) => setSpecialNote(e.target.value)}
                      placeholder={language === 'th' ? "เช่น ไม่ใส่ผักชี, แยกน้ำรสจัด..." : "e.g. less sauce, no cilantro..."}
                      className="w-full text-xs p-3 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-800/60 text-stone-900 dark:text-white placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 font-medium"
                    />
                  </div>
                </div>

                <Button
                  variant="restaurant"
                  size="restaurant"
                  className="w-full font-bold justify-center mt-2 cursor-pointer shadow-md"
                  onClick={() => {
                    changeQuantity(customizeItem.id, 1);
                    setCustomizeItem(null);
                    setSpiciness("");
                    setSelectedAddons([]);
                    setSpecialNote("");
                  }}
                  id="confirm-customize-item"
                >
                  {language === 'th' ? 'เพิ่มลงตะกร้า' : 'Add to Cart'} • {money.format(itemPriceTotal)}
                </Button>
              </div>
            );
          })()}
        </DialogContent>
      </Dialog>

      {/* Kitchen Live Order Tracker Modal */}
      <Dialog open={trackerOpen} onOpenChange={setTrackerOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto rounded-3xl border-stone-200 dark:border-stone-800 p-6 sm:max-w-lg bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100">
          <DialogHeader className="text-center items-center">
            <DialogTitle className="font-display text-2xl font-black text-stone-900 dark:text-white">
              {activeOrders.length > 1
                ? (language === 'th' ? `ห้องครัวกำลังดำเนินการ (${activeOrders.length} ออเดอร์)` : `Kitchen Processing (${activeOrders.length} Orders)`)
                : activeOrders[0]?.step === 3
                  ? (language === 'th' ? "อาหารปรุงเสร็จแล้ว!" : "Order Ready!")
                  : (language === 'th' ? "ห้องครัวกำลังดำเนินการ" : "Kitchen Processing")}
            </DialogTitle>
          </DialogHeader>

          {/* List of Active Kitchen Orders */}
          <div className="space-y-6 my-2">
            {activeOrders.map((ord) => (
              <div key={ord.orderId} className="border border-stone-200 dark:border-stone-800 p-4 rounded-2xl bg-stone-50/50 dark:bg-stone-800/40">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs font-bold text-stone-500">
                    {language === 'th' ? "ออเดอร์:" : "Order:"} <span className="font-mono text-stone-900 dark:text-white font-black">{ord.orderId}</span>
                  </span>
                  <span className={`text-[11px] font-extrabold px-2.5 py-0.5 rounded-full ${
                    ord.step === 3 
                      ? "bg-emerald-500 text-white" 
                      : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                  }`}>
                    {ord.step === 1 
                      ? (language === 'th' ? '1. รับออเดอร์แล้ว' : '1. Received') 
                      : ord.step === 2 
                        ? (language === 'th' ? '2. กำลังปรุงสด' : '2. Cooking') 
                        : (language === 'th' ? '3. พร้อมเสิร์ฟ 🎉' : '3. Ready 🎉')}
                  </span>
                </div>

                {/* Steps Timeline Indicator for this order */}
                <div className="my-4 bg-white dark:bg-stone-900 p-3.5 rounded-xl border border-stone-100 dark:border-stone-800">
                  <div className="grid grid-cols-3 gap-2 text-center relative">
                    {/* Progress bar background */}
                    <div className="absolute top-5 left-1/6 right-1/6 h-1 bg-stone-200 dark:bg-stone-700 -z-0">
                      <motion.div 
                        className="h-full bg-emerald-500"
                        initial={{ width: "0%" }}
                        animate={{ width: ord.step === 1 ? "0%" : ord.step === 2 ? "50%" : "100%" }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>

                    {/* Step 1 */}
                    <div className="relative z-10 flex flex-col items-center">
                      <div className={`size-10 rounded-full grid place-items-center transition-all ${
                        ord.step >= 1 ? "bg-emerald-500 text-white shadow-md scale-105" : "bg-stone-200 text-stone-400"
                      }`}>
                        <Clock className="size-5" />
                      </div>
                      <p className="mt-1.5 text-[11px] font-bold text-stone-800 dark:text-stone-200">
                        {language === 'th' ? "รับออเดอร์" : "Received"}
                      </p>
                    </div>

                    {/* Step 2 */}
                    <div className="relative z-10 flex flex-col items-center">
                      <div className={`size-10 rounded-full grid place-items-center transition-all ${
                        ord.step >= 2 ? "bg-emerald-500 text-white shadow-md scale-105" : "bg-stone-200 text-stone-400"
                      }`}>
                        <ChefHat className={`size-5 ${ord.step === 2 ? "animate-bounce" : ""}`} />
                      </div>
                      <p className="mt-1.5 text-[11px] font-bold text-stone-800 dark:text-stone-200">
                        {language === 'th' ? "กำลังปรุงสด" : "Cooking"}
                      </p>
                    </div>

                    {/* Step 3 */}
                    <div className="relative z-10 flex flex-col items-center">
                      <div className={`size-10 rounded-full grid place-items-center transition-all ${
                        ord.step === 3 ? "bg-emerald-500 text-white shadow-md scale-105" : "bg-stone-200 text-stone-400"
                      }`}>
                        <Sparkles className="size-5" />
                      </div>
                      <p className="mt-1.5 text-[11px] font-bold text-stone-800 dark:text-stone-200">
                        {language === 'th' ? "พร้อมเสิร์ฟ" : "Ready"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Items list */}
                <div className="pt-2 border-t border-stone-200 dark:border-stone-700 text-xs font-semibold text-stone-600 dark:text-stone-300 space-y-1">
                  {ord.items.map(item => (
                    <div key={item.id} className="flex justify-between">
                      <span>{item.quantity} × {item.name}</span>
                      <span className="font-mono font-bold text-stone-800 dark:text-stone-100">{money.format(item.price * item.quantity)}</span>
                    </div>
                  ))}
                  <div className="flex justify-between font-bold pt-1.5 text-stone-900 dark:text-white border-t border-dashed border-stone-200 dark:border-stone-700">
                    <span>{t("food.cart_total")}</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-mono text-sm">{money.format(ord.total)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="mt-5 flex gap-3">
            <Button
              variant="outline"
              className="flex-1 font-bold text-xs rounded-xl cursor-pointer"
              onClick={() => {
                setTrackerOpen(false);
                setReceiptOpen(true);
              }}
            >
              {t("food.nav_receipt")}
            </Button>
            <Button
              variant="restaurant"
              className="flex-1 font-bold text-xs rounded-xl cursor-pointer"
              onClick={() => setTrackerOpen(false)}
            >
              {language === 'th' ? "ตกลง" : "Done"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <footer className="border-t border-stone-200/80 dark:border-stone-800 bg-white dark:bg-stone-900 py-8 text-center text-xs text-stone-500 dark:text-stone-400 relative z-10">
        <span className="font-display font-bold text-stone-900 dark:text-white tracking-wide">BOTNOI RESTAURANT</span> ·{' '}
        {t("food.footer_heart")}
      </footer>

      <Dialog open={receiptOpen} onOpenChange={setReceiptOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto rounded-3xl border-stone-200 dark:border-emerald-900/50 p-0 sm:max-w-md bg-white dark:bg-stone-900 text-stone-800 dark:text-stone-100">
          {receipt && (
            <div className="receipt-paper p-6 sm:p-8 relative">
              <DialogHeader className="items-center text-center">
                <div className="mb-3 grid size-14 place-items-center rounded-full bg-emerald-500 text-white shadow-md">
                  <Check className="size-7" />
                </div>
                <DialogTitle className="font-display text-2xl text-stone-900 dark:text-white font-black tracking-tight">
                  {t("food.order_success")}
                </DialogTitle>
                <DialogDescription className="font-semibold text-stone-500 dark:text-stone-400 text-xs">
                  {t("food.kitchen_received")}
                </DialogDescription>
              </DialogHeader>
              <div className="my-6 border-y border-dashed border-stone-200 dark:border-stone-700 py-4 text-center">
                <p className="font-display text-lg font-bold text-stone-900 dark:text-white tracking-wide">BOTNOI RESTAURANT</p>
                <p className="mt-1 text-xs text-stone-500 dark:text-stone-400">
                  {t("food.receipt_title")} · {t("food.receipt_id")} {receipt.orderId}
                </p>
                <p className="text-xs text-stone-500 dark:text-stone-400 font-mono mt-0.5">
                  {formatOrderDate(receipt.timestamp || receipt.orderedAt, language)}
                </p>
              </div>
              <div className="space-y-3">
                {receipt.items.map((item) => {
                  const name = getItemName(item);
                  return (
                    <div key={item.id} className="flex justify-between gap-4 text-xs font-bold text-stone-700 dark:text-stone-200">
                      <span>
                        {item.quantity} × {name}
                      </span>
                      <span className="shrink-0 font-bold text-stone-900 dark:text-white font-mono">
                        {money.format(item.price * item.quantity)}
                      </span>
                    </div>
                  );
                })}
              </div>
              <div className="mt-5 space-y-2 border-t border-dashed border-stone-200 dark:border-stone-700 pt-4 text-xs font-bold">
                <div className="flex justify-between text-stone-500 dark:text-stone-400">
                  <span>{t("food.cart_subtotal")}</span>
                  <span className="font-mono">{money.format(receipt.subtotal)}</span>
                </div>
                <div className="flex justify-between text-stone-500 dark:text-stone-400">
                  <span>{t("food.cart_service")}</span>
                  <span className="font-mono">{money.format(receipt.serviceFee)}</span>
                </div>
                <div className="flex justify-between pt-3 border-t border-stone-100 dark:border-stone-800 font-display text-xl font-bold text-stone-900 dark:text-white">
                  <span>{t("food.cart_total")}</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-mono">{money.format(receipt.total)}</span>
                </div>
              </div>
              <div className="mt-6 rounded-2xl bg-stone-100/70 dark:bg-stone-800/70 border border-stone-200/20 p-4 text-center text-xs text-stone-700 dark:text-stone-200 font-bold">
                {t("food.thank_you")}
              </div>
              <Button
                variant="restaurantOutline"
                size="restaurant"
                className="mt-4 w-full font-bold cursor-pointer hover:bg-stone-100"
                onClick={() => setReceiptOpen(false)}
                id="close-receipt-modal"
              >
                {t("food.receipt_close")}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
    </>
  );
}