import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "@/lib/LanguageContext";
import { getBookings, deleteBooking, clearBookings, type Booking } from "@/lib/bookings";
import { Toaster, toast } from "sonner";

export default function FlightAdmin() {
  const { t, language } = useTranslation();
  const [items, setItems] = useState<Booking[]>([]);
  const [q, setQ] = useState("");

  const refresh = () => setItems(getBookings());
  useEffect(() => { refresh(); }, []);

  const getCityLabel = (city: string) => {
    if (language === 'en') {
      const mapping: Record<string, string> = {
        "กรุงเทพฯ (DMK)": "Bangkok (DMK)",
        "เชียงใหม่ (CNX)": "Chiang Mai (CNX)",
        "ภูเก็ต (HKT)": "Phuket (HKT)",
        "หาดใหญ่ (HDY)": "Hat Yai (HDY)",
        "อุดรธานี (UTH)": "Udon Thani (UTH)",
        "อุบลราชธานี (UBP)": "Ubon Ratchathani (UBP)",
        "ขอนแก่น (KKC)": "Khon Kaen (KKC)",
        "สุราษฎร์ธานี (URT)": "Surat Thani (URT)",
        "นครศรีธรรมราช (NST)": "Nakhon Si Thammarat (NST)",
        "เชียงราย (CEI)": "Chiang Rai (CEI)",
      };
      return mapping[city] || city;
    }
    return city;
  };

  const filtered = items.filter((b) =>
    [b.passengerName, b.email, b.from, b.to, b.phone].join(" ").toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div className="flight-theme min-h-screen bg-background text-foreground pb-20">
      <Toaster position="top-center" richColors />
      
      <header className="bg-slate-900 text-white shadow-md relative z-10">
        <div className="mx-auto max-w-7xl px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <span className="text-lg font-black tracking-tight">{language === 'en' ? "BotnoiAir · Admin Dashboard" : "BotnoiAir · แผงควบคุมผู้ดูแลระบบ"}</span>
          </div>
          <Link to="/flight-demo" className="text-xs font-bold opacity-80 hover:opacity-100 transition-opacity hover:underline">
            {t('nav.back_to_main')}
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-10 relative z-10 text-left">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">{t('flight_admin.title')}</h1>
            <p className="text-slate-500 text-xs mt-1 font-semibold">
              {language === 'en' ? `Total ${items.length} records (from localStorage)` : `รวม ${items.length} รายการ (จาก localStorage)`}
            </p>
          </div>
          <div className="flex gap-2">
            <input 
              value={q} 
              onChange={(e) => setQ(e.target.value)} 
              placeholder={language === 'en' ? "Search name, email..." : "ค้นหาชื่อ, อีเมล..."} 
              className="px-4 py-2 rounded-full border border-slate-200 bg-white text-sm outline-none focus:border-sky-500 transition-colors shadow-sm" 
            />
            <button 
              onClick={refresh} 
              className="px-4 py-2 rounded-full bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold transition-all shadow-sm cursor-pointer"
            >
              {language === 'en' ? "Refresh" : "รีเฟรช"}
            </button>
            <button 
              onClick={() => { 
                if (confirm(t('flight_admin.delete_confirm'))) { 
                  clearBookings(); 
                  refresh(); 
                  toast.success(language === 'en' ? "Bookings cleared" : "ล้างข้อมูลการจองแล้ว"); 
                } 
              }}
              className="px-4 py-2 rounded-full bg-red-600 text-white hover:bg-red-700 text-xs font-bold transition-all shadow-sm cursor-pointer"
            >
              {language === 'en' ? "Clear All" : "ล้างทั้งหมด"}
            </button>
          </div>
        </div>

        {filtered.length === 0 ? (
          <motion.div 
            className="rounded-3xl border border-slate-200 bg-white p-16 text-center shadow-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="font-display text-lg font-bold text-slate-800">{t('flight_admin.no_bookings')}</p>
          </motion.div>
        ) : (
          <motion.div 
            className="overflow-x-auto rounded-2xl border border-slate-200/80 bg-white shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <table className="w-full text-xs">
              <thead className="bg-slate-50 text-slate-600 text-left border-b border-slate-200">
                <tr>
                  <th className="px-5 py-4 font-bold uppercase tracking-wider">{t('flight_admin.th_date')}</th>
                  <th className="px-5 py-4 font-bold uppercase tracking-wider">{t('flight_admin.th_passenger')}</th>
                  <th className="px-5 py-4 font-bold uppercase tracking-wider">{t('flight_admin.th_route')}</th>
                  <th className="px-5 py-4 font-bold uppercase tracking-wider">{t('flight_admin.th_depart')}</th>
                  <th className="px-5 py-4 font-bold uppercase tracking-wider">{t('flight_admin.th_passengers')}</th>
                  <th className="px-5 py-4 font-bold uppercase tracking-wider">{t('flight_admin.th_contact')}</th>
                  <th className="px-5 py-4 font-bold uppercase tracking-wider">{t('flight_admin.th_promo')}</th>
                  <th className="px-5 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                <AnimatePresence initial={false}>
                  {filtered.map((b) => (
                    <motion.tr 
                      key={b.id} 
                      className="hover:bg-slate-50/50 transition-colors"
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <td className="px-5 py-4 text-slate-500 font-mono">
                        {new Date(b.createdAt).toLocaleString(language === 'en' ? "en-US" : "th-TH", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit"
                        })}
                      </td>
                      <td className="px-5 py-4 font-bold text-slate-900">{b.passengerName}</td>
                      <td className="px-5 py-4 font-medium text-slate-800">
                        {getCityLabel(b.from)} → {getCityLabel(b.to)}{" "}
                        <span className="text-[10px] bg-sky-50 text-sky-700 font-semibold px-2 py-0.5 rounded-full ml-1">
                          {b.tripType === "round" ? t('flight.round_trip') : t('flight.one_way')}
                        </span>
                      </td>
                      <td className="px-5 py-4 font-semibold text-slate-800">{b.departDate}{b.returnDate ? ` / ${b.returnDate}` : ""}</td>
                      <td className="px-5 py-4 font-mono font-bold text-slate-900">{b.passengers}</td>
                      <td className="px-5 py-4">
                        <div className="font-semibold text-slate-950">{b.email}</div>
                        <div className="text-[10px] text-slate-500 mt-0.5 font-mono">{b.phone}</div>
                      </td>
                      <td className="px-5 py-4">
                        {b.promoCode ? (
                          <span className="bg-indigo-50 text-indigo-700 border border-indigo-100 font-extrabold px-2.5 py-1 rounded text-[10px] tracking-wide">
                            {b.promoCode}
                          </span>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>
                      <td className="px-5 py-4 text-right">
                        <button 
                          onClick={() => { 
                            if (confirm(t('flight_admin.delete_confirm'))) {
                              deleteBooking(b.id); 
                              refresh(); 
                              toast.success(t('flight_admin.delete_success'));
                            }
                          }} 
                          className="text-red-600 hover:text-red-700 font-bold text-xs cursor-pointer hover:underline"
                        >
                          {t('flight_admin.btn_delete')}
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </motion.div>
        )}
      </main>
    </div>
  );
}