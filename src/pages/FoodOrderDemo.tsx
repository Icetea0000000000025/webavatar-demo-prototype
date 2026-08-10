import {
  Check,
  ChevronRight,
  Home,
  Minus,
  Plus,
  ReceiptText,
  ShoppingBag,
  Trash2,
  UtensilsCrossed,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "@/lib/LanguageContext";
import PageSkeleton from "@/components/PageSkeleton";
import SkeletonImage from "@/components/SkeletonImage";

import botnoiLogo from "@/assets/BOTNOI-Restaurant-logo.png";
import greenCurryImage from "@/assets/green-curry.jpg";
import mangoStickyRiceImage from "@/assets/mango-sticky-rice.jpg";
import padKrapaoImage from "@/assets/pad-krapao.jpg";
import tomYumImage from "@/assets/tom-yum.jpg";
import friedriceImage from "@/assets/fried-rice.jpg";
import tomyumnoodleImage from "@/assets/tomyum-noodle.jpg";

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

const menu: MenuItem[] = [
  {
    id: "krapao",
    name: "ข้าวกะเพราไก่ไข่ดาว",
    englishName: "Chicken Pad Kra Pao",
    description: "กะเพราหอมฉุน ผัดไฟแรง เสิร์ฟพร้อมไข่ดาวกรอบ",
    category: "เมนูยอดนิยม",
    price: 89,
    image: padKrapaoImage,
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
  },
  {
    id: "fried-rice",
    name: "ข้าวผัดกุ้ง",
    englishName: "Shrimp Fried Rice",
    description: "ข้าวหอมมะลิผัดหอมกระทะ กุ้งสดและผักกรอบ",
    category: "อาหารจานเดียว",
    price: 109,
    image: friedriceImage,
  },
  {
    id: "tomyum-noodle",
    name: "ก๋วยเตี๋ยวต้มยำ",
    englishName: "Tom Yum Noodles",
    description: "เส้นนุ่ม น้ำต้มยำรสจัดจ้าน ถั่วคั่วหอม",
    category: "อาหารจานเดียว",
    price: 79,
    image: tomyumnoodleImage,
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

export default function FoodOrderDemo() {
  const { t, language } = useTranslation();
  const [category, setCategory] = useState<(typeof categories)[number]>("ทั้งหมด");
  const [cart, setCart] = useState<Cart>({});
  const [receipt, setReceipt] = useState<Receipt | null>(null);
  const [receiptOpen, setReceiptOpen] = useState(false);
  const [ready, setReady] = useState(false);
  const cartRef = useRef<HTMLElement>(null);

  const getItemName = (item: MenuItem) =>
    language === 'th' ? item.name : item.englishName;

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
    setReceiptOpen(true);
  };

  return (
    <>
      <AnimatePresence>
        {!ready && <PageSkeleton variant="order" />}
      </AnimatePresence>
      <div className="order-theme min-h-screen w-full max-w-full overflow-x-hidden bg-background/50 backdrop-blur-sm text-foreground page-grid relative z-10">
        {/* ── Header ─────────────────────────────────────────────────────── */}
        <header className="relative z-20 mx-auto mt-4 mb-6 w-[calc(100%-2rem)] max-w-7xl bg-background/85 backdrop-blur-md border border-foreground/10 rounded-2xl shadow-lg transition-all">
          <div className="px-6 py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-4">
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
                <img src={botnoiLogo} alt="Botnoi Restaurant" className="h-5 w-auto object-contain inline-block" />
                {t('nav.restaurant')}
              </span>
            </nav>

            <nav className="flex items-center gap-3 text-sm font-semibold">
              {receipt && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setReceiptOpen(true)} 
                  className="text-foreground/70 hover:text-foreground gap-1.5 font-bold hover:bg-foreground/5 rounded-full px-3 py-1.5 transition-colors"
                  id="order-view-receipt"
                >
                  <ReceiptText className="size-4" /> <span>{t("food.nav_receipt")}</span>
                </Button>
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
              onClick={() =>
                cartRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
              }
              className="gap-2 cursor-pointer font-bold"
            >
              <ShoppingBag className="size-4" /> {t("food.cart_short")}{" "}
              <span className="rounded-full bg-white dark:bg-emerald-950 px-2 py-0.5 text-xs text-emerald-600 dark:text-emerald-400 font-extrabold ml-1 shadow-sm">
                {itemCount}
              </span>
            </Button>
          </nav>
        </div>
      </header>

      <div
        className="mx-auto w-full max-w-7xl overflow-hidden px-4 py-4 pb-32 sm:px-6 lg:grid lg:grid-cols-[minmax(0,1fr)_370px] lg:gap-8 lg:px-8 lg:pb-12"
      >
        <section aria-labelledby="menu-heading" className="min-w-0 overflow-hidden">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest">
                {t("food.select_delicious")}
              </p>
              <h2 id="menu-heading" className="font-display text-3xl font-extrabold text-stone-900 tracking-tight">
                {t("food.our_menu")}
              </h2>
            </div>
            <p className="text-xs text-stone-500 font-bold">
              {visibleMenu.length} {t("food.items_count")}
            </p>
          </div>
          
          {/* Categories select tabs with sliding motion pill */}
          <div
            className="mb-8 flex gap-2 overflow-x-auto whitespace-nowrap pb-3 -mx-4 px-4 scrollbar-hide snap-x"
            role="tablist"
            aria-label={t("food.categories_label")}
          >
            {categories.map((item) => {
              const active = category === item;
              return (
                <button
                  key={item}
                  className={`relative shrink-0 snap-start px-5 py-2.5 rounded-full text-xs font-bold transition-colors cursor-pointer border ${
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

          {/* Menu items display with staggered entry */}
          <motion.div 
            className="grid gap-6 sm:grid-cols-2"
          >
            <AnimatePresence>
              {visibleMenu.map((item) => {
                const quantity = cart[item.id] ?? 0;
                const translationId = item.id.replace("-", "");
                const name = getItemName(item);
                const description = t(`food_item.${translationId}.desc` as any) || item.description;

                return (
                  <motion.article
                    key={item.id}
                    className="card-lift group flex w-full min-w-0 overflow-hidden rounded-3xl border border-stone-200/80 bg-white flex-row sm:flex-col"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    whileHover={{ y: -4 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="relative w-28 shrink-0 aspect-square overflow-hidden bg-stone-100 sm:w-full sm:aspect-[6/4]">
                      <SkeletonImage
                        src={item.image}
                        alt={name}
                        loading="lazy"
                        wrapperClassName="absolute inset-0"
                        className="transition-transform duration-500 group-hover:scale-102"
                      />
                      {item.spicy && (
                        <span className="absolute left-2 top-2 sm:left-3 sm:top-3 rounded-full bg-white/95 px-2 py-0.5 sm:px-3 sm:py-1 text-[10px] sm:text-xs font-extrabold text-red-600 backdrop-blur shadow-sm border border-red-100">
                          {t("food.spicy_tag")}
                        </span>
                      )}
                    </div>
                    <div className="flex min-w-0 flex-1 flex-col p-4 sm:p-5 overflow-hidden justify-between">
                      <div>
                        <p className="truncate text-[10px] sm:text-xs font-bold uppercase tracking-wider text-emerald-600">
                          {item.englishName}
                        </p>
                        <h3 className="mt-0.5 sm:mt-1 truncate font-display text-lg sm:text-xl font-bold leading-tight text-stone-900 tracking-tight">{name}</h3>
                        <p className="mt-1 sm:mt-2 min-h-0 sm:min-h-11 text-xs sm:text-sm leading-relaxed sm:leading-6 text-stone-500 line-clamp-2">
                          {description}
                        </p>
                      </div>
                      
                      <div className="pt-3 sm:pt-4 flex items-center justify-between gap-2 border-t border-stone-100/50 mt-4">
                        <p className="truncate font-display text-lg sm:text-xl font-bold text-stone-950">
                          {money.format(item.price)}
                        </p>
                        {quantity === 0 ? (
                          <Button
                            variant="restaurant"
                            size="restaurantIcon"
                            className="size-8 sm:size-10 shrink-0 cursor-pointer"
                            onClick={() => changeQuantity(item.id, 1)}
                            aria-label={`${t("food.btn_add")}: ${name}`}
                            id={`add-${item.id}`}
                          >
                            <Plus className="size-4 sm:size-5" />
                          </Button>
                        ) : (
                          <div className="flex shrink-0 items-center gap-1 rounded-full border border-stone-200 bg-stone-100 p-0.5 sm:p-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="size-6 sm:size-8 rounded-full"
                              onClick={() => changeQuantity(item.id, -1)}
                              aria-label={`${t("food.btn_add")} (-): ${name}`}
                              id={`decrease-${item.id}`}
                            >
                              <Minus className="size-3 sm:size-4" />
                            </Button>
                            <span className="w-5 sm:w-6 text-center text-xs sm:text-sm font-extrabold text-stone-800" id={`quantity-${item.id}`}>{quantity}</span>
                            <Button
                              variant="restaurant"
                              size="icon"
                              className="size-6 sm:size-8 rounded-full cursor-pointer"
                              onClick={() => changeQuantity(item.id, 1)}
                              aria-label={`${t("food.btn_add")} (+): ${name}`}
                              id={`increase-${item.id}`}
                            >
                              <Plus className="size-3 sm:size-4" />
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

        {/* Sidebar Shopping Cart overlay */}
        <aside
          ref={cartRef}
          className="mt-12 lg:mt-0 scroll-mt-24 self-start rounded-3xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-5 shadow-lg lg:sticky lg:top-24 w-full"
          aria-labelledby="cart-heading"
        >
          <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                Your order
              </p>
              <h2 id="cart-heading" className="font-display text-2xl font-bold text-stone-900 dark:text-white tracking-tight">
                {t("food.cart_title")}
              </h2>
            </div>
            <div className="grid size-11 place-items-center rounded-full bg-emerald-50 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 shadow-sm">
              <ShoppingBag className="size-5" />
            </div>
          </div>
          
          <div className="overflow-y-auto max-h-[400px] scrollbar-hide">
            {cartItems.length === 0 ? (
              <div className="py-14 text-center">
                <div className="mx-auto grid size-16 place-items-center rounded-full bg-stone-50 text-stone-400 border border-stone-100">
                  <UtensilsCrossed className="size-6" />
                </div>
                <p className="mt-4 text-xs font-semibold text-stone-500 max-w-xs mx-auto leading-relaxed">
                  {t('food.cart_empty')}
                </p>
              </div>
            ) : (
              <div className="divide-y divide-stone-100">
                <AnimatePresence initial={false}>
                  {cartItems.map((item) => {
                    const name = getItemName(item);
                    return (
                      <motion.div 
                        key={item.id} 
                        className="py-4" 
                        id={`cart-item-${item.id}`}
                        layout
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="flex gap-3">
                          <img
                            src={item.image}
                            alt=""
                            width={64}
                            height={64}
                            loading="lazy"
                            className="size-16 rounded-2xl object-cover shadow-sm"
                          />
                          <div className="min-w-0 flex-1">
                            <h3 className="truncate text-sm font-semibold text-stone-800">{name}</h3>
                            <p className="mt-1 text-sm font-extrabold text-stone-950">
                              {money.format(item.price * item.quantity)}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-8 text-stone-400 hover:text-red-600 rounded-full"
                            onClick={() => changeQuantity(item.id, -item.quantity)}
                            aria-label={`Remove ${name}`}
                            id={`remove-cart-${item.id}`}
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </div>
                        <div className="mt-3 ml-[76px] flex w-fit items-center gap-1 rounded-full bg-stone-100 p-0.5">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-7 rounded-full text-stone-600"
                            onClick={() => changeQuantity(item.id, -1)}
                            aria-label={`Decrease quantity of ${name}`}
                            id={`decrease-cart-${item.id}`}
                          >
                            <Minus className="size-3.5" />
                          </Button>
                          <span className="w-6 text-center text-xs font-bold text-stone-800">{item.quantity}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-7 rounded-full text-stone-600"
                            onClick={() => changeQuantity(item.id, 1)}
                            aria-label={`Increase quantity of ${name}`}
                            id={`increase-cart-${item.id}`}
                          >
                            <Plus className="size-3.5" />
                          </Button>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            )}
          </div>
          
          <div className="border-t border-dashed border-stone-200 pt-5 mt-4">
            <div className="flex justify-between text-xs text-stone-500 font-bold">
              <span>{t("food.cart_subtotal")}</span>
              <span>{money.format(subtotal)}</span>
            </div>
            <div className="mt-2.5 flex justify-between text-xs text-stone-500 font-bold">
              <span>{t("food.cart_service")}</span>
              <span>{money.format(serviceFee)}</span>
            </div>
            <div className="mt-4 pt-3 border-t border-stone-100 flex items-end justify-between">
              <span className="font-bold text-stone-800 text-sm">{t("food.cart_total")}</span>
              <span className="font-display text-2xl font-bold text-emerald-600">
                {money.format(subtotal + serviceFee)}
              </span>
            </div>
            <Button
              variant="restaurant"
              size="restaurant"
              className="mt-6 w-full cursor-pointer font-bold justify-center"
              disabled={cartItems.length === 0}
              onClick={checkout}
              aria-label={t("food.cart_checkout")}
              id="restaurant-checkout-button"
            >
              {t("food.cart_checkout")} <ChevronRight className="size-4" />
            </Button>
            <p className="mt-3.5 text-center text-[10px] text-stone-400 font-bold uppercase tracking-wider">
              {t("food.cart_saved")}
            </p>
          </div>
        </aside>
      </div>

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