import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { Receipt } from "./FoodOrderDemo";
import { formatOrderDate } from "./FoodOrderDemo";
import { RefreshCw, Trash2, UtensilsCrossed, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "@/lib/LanguageContext";

const ORDERS_KEY = "botnoi-restaurant-orders";
const money = new Intl.NumberFormat("th-TH", {
  style: "currency",
  currency: "THB",
  maximumFractionDigits: 0,
});

export default function OrderAdmin() {
  const { t, language } = useTranslation();
  const [orders, setOrders] = useState<Receipt[]>([]);
  const [loading, setLoading] = useState(true);

  const loadOrders = () => {
    setLoading(true);
    try {
      const savedOrders = window.localStorage.getItem(ORDERS_KEY);
      if (savedOrders) {
        setOrders(JSON.parse(savedOrders));
      } else {
        const defaultDemoOrders: Receipt[] = [
          {
            orderId: "AK-1001",
            orderedAt: new Date().toLocaleDateString("th-TH", { day: "numeric", month: "short", year: "numeric" }) + " · " + new Date().toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit" }),
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
    const interval = setInterval(loadOrders, 2000);

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

  return (
    <div className="order-theme min-h-screen bg-background text-foreground pb-20">
      {/* ── Header ─────────────────────────────────────────────────── */}
      <header className="relative z-20 mx-auto mt-4 mb-6 w-[calc(100%-2rem)] max-w-7xl bg-emerald-950/95 text-white backdrop-blur-md border border-emerald-900 rounded-2xl shadow-lg transition-all">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: 9,
                background: "linear-gradient(135deg,#059669,#10b981)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              className="flex items-center justify-center shadow-sm shrink-0"
            >
              <UtensilsCrossed size={18} color="white" />
            </div>
            <div>
              <div className="font-extrabold text-white text-sm leading-tight">
                {language === 'en' ? "Botnoi Restaurant — Kitchen Monitor" : "Botnoi Restaurant — บอร์ดจัดการห้องครัว"}
              </div>
              <div className="text-xs text-emerald-300/80">
                {language === 'en' ? "Monitor and manage live restaurant orders" : "ตรวจสอบคำสั่งซื้ออาหารและจัดการสถานะออเดอร์เรียลไทม์"}
              </div>
            </div>
          </div>
          <Link
            to="/food-demo"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-900/80 hover:bg-emerald-900 text-emerald-100 text-xs font-bold transition-all border border-emerald-800 shrink-0"
            id="order-admin-back"
          >
            <ArrowLeft size={12} /> {language === "en" ? "Back to Restaurant" : "กลับร้านอาหาร"}
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs text-stone-500 font-bold">
              {t("food_admin.total_orders").replace("{count}", String(orders.length))}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="restaurantOutline" onClick={loadOrders} className="cursor-pointer font-bold gap-1.5 hover:bg-stone-50">
              <RefreshCw className="size-4" /> {t("food_admin.btn_refresh")}
            </Button>
            <Button variant="destructive" onClick={clearOrders} disabled={orders.length === 0} className="cursor-pointer font-bold gap-1.5">
              <Trash2 className="size-4" /> {t("food_admin.btn_clear")}
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="py-20 text-center text-stone-500 font-bold">{t("food_admin.loading")}</div>
        ) : orders.length === 0 ? (
          <motion.div 
            className="rounded-3xl border border-stone-200 bg-white py-20 text-center shadow-md"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="font-display text-base font-bold text-stone-700">{t("food_admin.no_orders")}</p>
          </motion.div>
        ) : (
          <motion.div 
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
            layout
          >
            <AnimatePresence>
              {orders.map((order, index) => (
                <motion.div 
                  key={`${order.orderId}-${index}`} 
                  className="rounded-2xl border border-stone-200/80 bg-white p-5 shadow-md flex flex-col justify-between"
                  layout
                  initial={{ opacity: 0, scale: 0.95, y: 15 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3, delay: Math.min(index * 0.05, 0.3) }}
                >
                  <div>
                    <div className="mb-4 flex items-center justify-between border-b border-stone-100 pb-3">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">
                          {t("food_admin.th_id")} {order.orderId}
                        </p>
                        <p className="text-[10px] text-stone-400 font-bold mt-0.5 font-mono">
                          {formatOrderDate(order.timestamp || order.orderedAt, language)}
                        </p>
                      </div>
                      <div className="rounded-full bg-stone-100 border border-stone-200/30 px-3 py-1 text-xs font-bold text-stone-900 font-mono">
                        {money.format(order.total)}
                      </div>
                    </div>
                    <div className="space-y-3 mb-4">
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
                          <div key={item.id} className="flex justify-between gap-3 text-xs font-bold text-stone-700">
                            <span className="flex-1 text-stone-800">
                              <span className="mr-2 font-extrabold text-emerald-600">{item.quantity}x</span>
                              {name}
                            </span>
                            <span className="font-bold text-stone-950 font-mono">{money.format(item.price * item.quantity)}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
}
