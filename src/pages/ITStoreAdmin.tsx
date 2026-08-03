import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Cpu, Package, Trash2, ArrowLeft } from "lucide-react";
import { useTranslation } from "@/lib/LanguageContext";
import type { ITOrder } from "./ITStoreDemo";
import "./Pages.css";

const ORDERS_KEY = "botnoi-itstore-orders";

const money = new Intl.NumberFormat("th-TH", {
  style: "currency",
  currency: "THB",
  maximumFractionDigits: 0,
});

export default function ITStoreAdmin() {
  const { t, language } = useTranslation();
  const [orders, setOrders] = useState<ITOrder[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(ORDERS_KEY);
      if (stored) setOrders(JSON.parse(stored) as ITOrder[]);
    } catch { /* */ }
    setLoaded(true);
  }, []);

  const deleteOrder = (orderId: string) => {
    const updated = orders.filter((o) => o.orderId !== orderId);
    setOrders(updated);
    window.localStorage.setItem(ORDERS_KEY, JSON.stringify(updated));
  };

  const clearAll = () => {
    if (!window.confirm(language === "en" ? "Clear all orders? This cannot be undone." : "ล้างออเดอร์ทั้งหมด? ไม่สามารถย้อนกลับได้")) return;
    setOrders([]);
    window.localStorage.setItem(ORDERS_KEY, JSON.stringify([]));
  };

  const totalRevenue = orders.reduce((s, o) => s + o.total, 0);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-foreground transition-colors pt-7">
      {/* ── Header ─────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-20 border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: 9,
                background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Cpu size={18} color="white" />
            </div>
            <div>
              <div className="font-extrabold text-slate-900 dark:text-white text-sm leading-tight">
                {t("itstore_admin.title")}
              </div>
              <div className="text-xs text-slate-400 dark:text-slate-500">{t("itstore_admin.subtitle")}</div>
            </div>
          </div>
          <Link
            to="/it-store-demo"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all border border-slate-200 dark:border-slate-700"
            id="itstore-admin-back"
          >
            <ArrowLeft size={12} /> {language === "en" ? "Back to Store" : "กลับร้าน"}
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">

        {/* ── Stats Bar ───────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {[
            {
              label: language === "en" ? "Total Orders" : "ออเดอร์ทั้งหมด",
              value: orders.length,
              color: "#6366f1",
            },
            {
              label: language === "en" ? "Items Sold" : "สินค้าที่ขายได้",
              value: orders.reduce(
                (s, o) => s + o.items.reduce((si, i) => si + i.quantity, 0),
                0
              ),
              color: "#8b5cf6",
            },
            {
              label: language === "en" ? "Total Revenue" : "รายได้รวม",
              value: money.format(totalRevenue),
              color: "#10b981",
            },
          ].map((stat, i) => (
            <div
              key={i}
              className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-6 py-5 shadow-sm"
            >
              <div className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">
                {stat.label}
              </div>
              <div
                className="text-2xl font-extrabold"
                style={{ color: stat.color }}
              >
                {stat.value}
              </div>
            </div>
          ))}
        </div>

        {/* ── Orders Table ────────────────────────────────────────── */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
          {/* Table header row */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
            <h2 className="font-extrabold text-slate-900 dark:text-white text-base flex items-center gap-2">
              <Package size={18} style={{ color: "#6366f1" }} />
              {language === "en" ? "Order Log" : "บันทึกออเดอร์"}
            </h2>
            {orders.length > 0 && (
              <button
                onClick={clearAll}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/50 hover:bg-red-50 dark:hover:bg-red-950/40 transition"
                id="itstore-admin-clear"
              >
                <Trash2 size={11} /> {t("itstore_admin.btn_clear")}
              </button>
            )}
          </div>

          {/* Responsive table */}
          {!loaded ? (
            <div className="px-6 py-12 text-center text-slate-400 dark:text-slate-500 text-sm animate-pulse">
              {language === "en" ? "Loading orders..." : "กำลังโหลด..."}
            </div>
          ) : orders.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <Package size={48} className="mx-auto mb-4 text-slate-200 dark:text-slate-700" />
              <p className="text-slate-400 dark:text-slate-500 text-sm max-w-sm mx-auto">{t("itstore_admin.no_orders")}</p>
              <Link
                to="/it-store-demo"
                className="inline-flex items-center gap-1.5 mt-5 px-5 py-2 rounded-full text-sm font-bold text-white transition-all hover:scale-105"
                style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)" }}
              >
                {language === "en" ? "Go to Store →" : "ไปที่ร้านค้า →"}
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/60 text-slate-400 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">
                    <th className="px-6 py-3 text-left">{t("itstore_admin.th_id")}</th>
                    <th className="px-6 py-3 text-left">{t("itstore_admin.th_time")}</th>
                    <th className="px-6 py-3 text-right">{t("itstore_admin.th_total")}</th>
                    <th className="px-6 py-3 text-left">{t("itstore_admin.th_items")}</th>
                    <th className="px-6 py-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {orders.map((order, idx) => (
                      <motion.tr
                        key={order.orderId}
                        layout
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ delay: idx * 0.04 }}
                        className="border-t border-slate-100 dark:border-slate-800/80 hover:bg-slate-50/80 dark:hover:bg-slate-800/70 transition-colors"
                      >
                        {/* Order ID */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className="px-2.5 py-1 rounded-full text-xs font-bold"
                            style={{
                              background: "rgba(99,102,241,0.1)",
                              color: "#6366f1",
                              fontFamily: "monospace",
                            }}
                          >
                            {order.orderId}
                          </span>
                        </td>
                        {/* Time */}
                        <td className="px-6 py-4 whitespace-nowrap text-slate-500 dark:text-slate-400 text-xs">
                          {order.orderedAt}
                        </td>
                        {/* Total */}
                        <td className="px-6 py-4 text-right whitespace-nowrap font-extrabold" style={{ color: "#6366f1" }}>
                          {money.format(order.total)}
                        </td>
                        {/* Items */}
                        <td className="px-6 py-4">
                          <div className="flex flex-col gap-1">
                            {order.items.map((item) => (
                              <div key={item.id} className="flex items-center gap-2">
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="w-7 h-7 rounded-lg object-cover border border-slate-100 dark:border-slate-700 flex-shrink-0"
                                  loading="lazy"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src =
                                      `https://placehold.co/28x28/eef2ff/6366f1?text=IT`;
                                  }}
                                />
                                <span className="text-xs text-slate-700 dark:text-slate-200 truncate max-w-[160px]">
                                  {item.name}
                                </span>
                                <span className="text-xs font-bold text-slate-400 dark:text-slate-500 flex-shrink-0">
                                  {t("itstore_admin.qty")}{item.quantity}
                                </span>
                              </div>
                            ))}
                          </div>
                        </td>
                        {/* Actions */}
                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={() => deleteOrder(order.orderId)}
                            className="p-1.5 rounded-full text-slate-400 dark:text-slate-400 hover:bg-red-50 dark:hover:bg-red-950/50 hover:text-red-500 dark:hover:text-red-400 transition"
                            aria-label="Delete order"
                            id={`itstore-admin-delete-${order.orderId}`}
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
