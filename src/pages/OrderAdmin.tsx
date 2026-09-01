import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import type { Receipt } from "./FoodOrderDemo";
import { ArrowLeft, RefreshCw, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "@/lib/LanguageContext";

const ORDERS_KEY = "botnoi-restaurant-orders";
const money = new Intl.NumberFormat("th-TH", {
  style: "currency",
  currency: "THB",
  maximumFractionDigits: 0,
});

export interface AdminReceipt extends Receipt {
  manualStatus?: 'received' | 'cooking' | 'ready' | 'served';
}

function parseTimestamp(order: Receipt): number {
  if (typeof order.timestamp === "number" && !isNaN(order.timestamp)) {
    return order.timestamp;
  }
  if (order.orderedAt) {
    const parsed = Date.parse(order.orderedAt);
    if (!isNaN(parsed)) return parsed;
  }
  return Date.now();
}

function getOrderDateHeader(order: Receipt, lang: string): string {
  const ts = parseTimestamp(order);
  const locale = lang === 'th' ? "th-TH" : lang === 'ja' ? "ja-JP" : lang === 'zh' ? "zh-CN" : "en-US";
  return new Date(ts).toLocaleDateString(locale, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function getOrderTimeOnly(order: Receipt, lang: string): string {
  const ts = parseTimestamp(order);
  const locale = lang === 'th' ? "th-TH" : lang === 'ja' ? "ja-JP" : lang === 'zh' ? "zh-CN" : "en-US";
  return new Date(ts).toLocaleTimeString(locale, {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function OrderAdmin() {
  const { t, language } = useTranslation();
  const [orders, setOrders] = useState<AdminReceipt[]>([]);
  const [loading, setLoading] = useState(true);

  const loadOrders = () => {
    setLoading(true);
    try {
      const savedOrders = window.localStorage.getItem(ORDERS_KEY);
      if (savedOrders) {
        setOrders(JSON.parse(savedOrders));
      } else {
        const defaultDemoOrders: AdminReceipt[] = [
          {
            orderId: "BN-1001",
            orderedAt: new Date().toISOString(),
            timestamp: Date.now(),
            items: [
              {
                id: "krapao",
                name: "ข้าวกะเพราไก่ไข่ดาว",
                englishName: "Chicken Pad Kra Pao",
                description: "กะเพราหอมฉุน ผัดไฟแรง",
                category: "เมนูยอดนิยม",
                price: 89,
                quantity: 2,
                image: ""
              }
            ],
            subtotal: 178,
            serviceFee: 10,
            total: 188
          }
        ];
        window.localStorage.setItem(ORDERS_KEY, JSON.stringify(defaultDemoOrders));
        setOrders(defaultDemoOrders);
      }
    } catch (e) {
      console.error("Failed to load orders", e);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadOrders();

    const handleStorage = (e: StorageEvent) => {
      if (e.key === ORDERS_KEY) {
        loadOrders();
      }
    };

    const handleCustomEvent = () => {
      loadOrders();
    };

    window.addEventListener("storage", handleStorage);
    window.addEventListener("local_order_placed", handleCustomEvent);
    const interval = setInterval(loadOrders, 3000);

    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("local_order_placed", handleCustomEvent);
      clearInterval(interval);
    };
  }, []);

  const clearOrders = () => {
    if (confirm(t("food_admin.clear_confirm"))) {
      window.localStorage.removeItem(ORDERS_KEY);
      setOrders([]);
    }
  };

  // Cycle order status manually when chef clicks
  const cycleOrderStatus = (targetOrderId: string) => {
    setOrders((prevOrders) => {
      const updated = prevOrders.map((order) => {
        if (order.orderId !== targetOrderId) return order;

        const currentStatus = getEffectiveStatus(order);
        let nextStatus: 'received' | 'cooking' | 'ready' | 'served' = 'received';
        if (currentStatus === 'received') nextStatus = 'cooking';
        else if (currentStatus === 'cooking') nextStatus = 'ready';
        else if (currentStatus === 'ready') nextStatus = 'served';
        else nextStatus = 'received';

        return { ...order, manualStatus: nextStatus };
      });

      try {
        window.localStorage.setItem(ORDERS_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error("Failed to save updated status", e);
      }

      return updated;
    });
  };

  // Calculate status: Use chef manual status if set, otherwise auto progress based on timestamp
  const getEffectiveStatus = (order: AdminReceipt): 'received' | 'cooking' | 'ready' | 'served' => {
    if (order.manualStatus) return order.manualStatus;
    const elapsed = Date.now() - parseTimestamp(order);
    if (elapsed >= 5000) return 'ready';
    if (elapsed >= 2000) return 'cooking';
    return 'received';
  };

  // Analytics Stats Summary
  const stats = useMemo(() => {
    const totalRev = orders.reduce((sum, o) => sum + (o.total || 0), 0);
    const totalCount = orders.length;

    const dishCounts: Record<string, { count: number; name: string }> = {};
    orders.forEach((o) => {
      o.items?.forEach((item) => {
        const localizedItem = item as typeof item & { englishName?: string };
        const name = language === 'th' ? item.name : (localizedItem.englishName || item.name);
        if (!dishCounts[item.id]) {
          dishCounts[item.id] = { count: 0, name };
        }
        dishCounts[item.id].count += item.quantity;
      });
    });

    const sortedDishes = Object.values(dishCounts).sort((a, b) => b.count - a.count);
    const topSeller = sortedDishes[0] || null;

    return { totalRev, totalCount, topSeller };
  }, [orders, language]);

  // Group orders by formatted date string
  const groupedOrders = useMemo(() => {
    const map = new Map<string, Receipt[]>();

    orders.forEach((order) => {
      const dateKey = getOrderDateHeader(order, language);
      if (!map.has(dateKey)) {
        map.set(dateKey, []);
      }
      map.get(dateKey)!.push(order);
    });

    return Array.from(map.entries());
  }, [orders, language]);

  return (
    <div className="order-theme min-h-screen bg-background text-foreground pb-20">
      {/* ── Header ─────────────────────────────────────────────────── */}
      <header className="relative z-20 mx-auto mt-4 mb-6 w-[calc(100%-2rem)] max-w-7xl bg-emerald-950/90 text-white backdrop-blur-md rounded-2xl transition-all">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between gap-4">
          <div>
            <div className="font-extrabold text-white text-sm leading-tight">
              {t("food_admin.header")}
            </div>
            <div className="text-xs text-emerald-300/80">
              {t("food_admin.subtitle")}
            </div>
          </div>
          <Link
            to="/food-demo"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-900/80 hover:bg-emerald-900 text-emerald-100 text-xs font-bold transition-all shrink-0"
            id="order-admin-back"
          >
            <ArrowLeft size={12} /> {t("food.title")}
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl font-black font-display text-stone-900 dark:text-white tracking-tight">
              {t("food_admin.title")}
            </h1>
            <p className="text-xs text-stone-500 font-bold mt-0.5">
              {t("food_admin.total_orders").replace("{count}", String(orders.length))}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="restaurantOutline" onClick={loadOrders} className="cursor-pointer font-bold gap-1.5 hover:bg-stone-50 text-xs border-0 bg-stone-100 dark:bg-stone-800">
              <RefreshCw className="size-3.5" /> {t("food_admin.btn_refresh")}
            </Button>
            <Button variant="destructive" onClick={clearOrders} disabled={orders.length === 0} className="cursor-pointer font-bold gap-1.5 text-xs">
              <Trash2 className="size-3.5" /> {t("food_admin.btn_clear")}
            </Button>
          </div>
        </div>

        {/* ── Kitchen Analytics Summary Cards ──────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {/* Revenue Card */}
          <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/40">
            <p className="text-[11px] font-extrabold text-emerald-800 dark:text-emerald-300">
              {language === 'th' ? "ยอดขายรวมทั้งหมด" : "Total Revenue"}
            </p>
            <p className="font-mono text-xl font-black text-stone-900 dark:text-white mt-1">
              {money.format(stats.totalRev)}
            </p>
          </div>

          {/* Total Orders Card */}
          <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/40">
            <p className="text-[11px] font-extrabold text-amber-800 dark:text-amber-300">
              {language === 'th' ? "ออเดอร์ทั้งหมด" : "Total Orders"}
            </p>
            <p className="font-mono text-xl font-black text-stone-900 dark:text-white mt-1">
              {stats.totalCount} {language === 'th' ? "รายการ" : "orders"}
            </p>
          </div>

          {/* Top Seller Card */}
          <div className="p-4 rounded-2xl bg-rose-50/60 dark:bg-rose-950/40 min-w-0">
            <p className="text-[11px] font-extrabold text-rose-800 dark:text-rose-300">
              {language === 'th' ? "เมนูขายดีอันดับ 1" : "Top Seller Dish"}
            </p>
            <p className="font-bold text-sm text-stone-900 dark:text-white truncate mt-1">
              {stats.topSeller ? `${stats.topSeller.name} (${stats.topSeller.count} ${language === 'th' ? 'จาน' : 'dishes'})` : "-"}
            </p>
          </div>
        </div>

        {loading ? (
          <div className="py-20 text-center text-stone-500 font-bold">{t("food_admin.loading")}</div>
        ) : orders.length === 0 ? (
          <motion.div 
            className="rounded-3xl bg-white dark:bg-stone-900 py-20 text-center"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="font-display text-base font-bold text-stone-700 dark:text-stone-300">{t("food_admin.no_orders")}</p>
          </motion.div>
        ) : (
          <div className="space-y-10">
            {groupedOrders.map(([dateHeader, dateOrders]) => {
              const dayTotal = dateOrders.reduce((sum, o) => sum + o.total, 0);

              return (
                <section key={dateHeader} className="space-y-4">
                  {/* Date Section Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-stone-200/50 dark:border-stone-800/50">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <h2 className="font-display font-extrabold text-base sm:text-lg text-stone-900 dark:text-white leading-none my-0">
                        {dateHeader}
                      </h2>
                      <span className="inline-flex items-center rounded-full bg-emerald-100/80 dark:bg-emerald-950/80 px-2.5 py-0.5 text-xs font-bold text-emerald-700 dark:text-emerald-300 font-mono leading-none">
                        {dateOrders.length} {t("food.items_count")}
                      </span>
                    </div>
                    <span className="font-mono text-sm sm:text-base font-extrabold text-emerald-700 dark:text-emerald-400 leading-none">
                      {money.format(dayTotal)}
                    </span>
                  </div>

                  {/* List View Table */}
                  <div className="bg-white dark:bg-stone-900 rounded-2xl divide-y divide-stone-100 dark:divide-stone-800/60 overflow-hidden">
                    <AnimatePresence>
                      {dateOrders.map((order, index) => {
                        const timeStr = getOrderTimeOnly(order, language);
                        const status = getEffectiveStatus(order as AdminReceipt);

                        return (
                          <motion.div 
                            key={`${order.orderId}-${index}`}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-stone-50/70 dark:hover:bg-stone-800/50 transition-colors"
                          >
                            {/* Order Details & Items */}
                            <div className="min-w-0 flex-1 space-y-2">
                              <div className="flex flex-wrap items-center gap-2.5">
                                <span className="font-mono font-extrabold text-xs text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950 px-2.5 py-1 rounded-lg shrink-0">
                                  {t("food_admin.th_id")} {order.orderId}
                                </span>
                                <span className="text-xs font-bold text-stone-400 font-mono">
                                  {timeStr}
                                </span>

                                {/* Clean Status Badge without unnecessary borders */}
                                <button
                                  type="button"
                                  onClick={() => cycleOrderStatus(order.orderId)}
                                  title={language === 'th' ? "คลิกเพื่อเปลี่ยนสถานะออเดอร์" : "Click to cycle status"}
                                  className={`inline-flex items-center text-xs font-extrabold px-3 py-1 rounded-full cursor-pointer transition-all hover:scale-105 ${
                                    status === 'received'
                                      ? "bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300"
                                      : status === 'cooking'
                                        ? "bg-orange-100 text-orange-800 dark:bg-orange-950/80 dark:text-orange-300"
                                        : status === 'ready'
                                          ? "bg-emerald-500 text-white"
                                          : "bg-stone-100 text-stone-600 dark:bg-stone-800 dark:text-stone-400"
                                  }`}
                                >
                                  <span>
                                    {status === 'received'
                                      ? (language === 'th' ? '1. รับออเดอร์แล้ว' : '1. Received')
                                      : status === 'cooking'
                                        ? (language === 'th' ? '2. กำลังปรุงสด' : '2. Cooking')
                                        : status === 'ready'
                                          ? (language === 'th' ? '3. พร้อมเสิร์ฟ' : '3. Ready')
                                          : (language === 'th' ? '4. เสิร์ฟเรียบร้อย' : '4. Served')}
                                  </span>
                                </button>
                              </div>

                              {/* Dishes inline summary */}
                              <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs font-semibold text-stone-800 dark:text-stone-200 pt-1">
                                {order.items.map((item) => {
                                  const localizedItem = item as typeof item & {
                                    englishName?: string;
                                    nameEn?: string;
                                    nameTh?: string;
                                  };
                                  const name = language === 'th'
                                    ? localizedItem.nameTh || item.name
                                    : localizedItem.englishName || localizedItem.nameEn || item.name;

                                  return (
                                    <div key={item.id} className="inline-flex items-center gap-1.5 py-0.5">
                                      <span className="font-extrabold text-emerald-600 dark:text-emerald-400 font-mono text-[11px]">
                                        {item.quantity}x
                                      </span>
                                      <span className="font-bold">{name}</span>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>

                            {/* Order Total Price */}
                            <div className="flex items-center justify-between md:justify-end gap-3 shrink-0 border-t md:border-t-0 border-stone-100 dark:border-stone-800 pt-2 md:pt-0">
                              <span className="font-mono text-base font-extrabold text-stone-900 dark:text-white">
                                {money.format(order.total)}
                              </span>
                            </div>
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>
                  </div>
                </section>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
