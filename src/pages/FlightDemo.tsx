import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { useTranslation } from "@/lib/LanguageContext";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Luggage, Coffee, Mic, Plane } from "lucide-react";
import { saveBooking } from "@/lib/bookings";
import { toast, Toaster } from "sonner";
import PageSkeleton from "@/components/PageSkeleton";
import SkeletonImage from "@/components/SkeletonImage";
import botnoiAirLogo from "../assets/BOTNOI-AIR-logo.png";
import heroBg from "../assets/hero-bg.jpg";
import promoChiangmai from "../assets/promo-chiangmai.jpg";
import promoPhuket from "../assets/promo-phuket.jpg";
import promoHatyai from "../assets/promo-hatyai.jpg";

const CITIES = [
  "กรุงเทพฯ (DMK)",
  "เชียงใหม่ (CNX)",
  "ภูเก็ต (HKT)",
  "หาดใหญ่ (HDY)",
  "อุดรธานี (UTH)",
  "อุบลราชธานี (UBP)",
  "ขอนแก่น (KKC)",
  "สุราษฎร์ธานี (URT)",
  "นครศรีธรรมราช (NST)",
  "เชียงราย (CEI)",
];

interface BookingForm {
  from: string;
  to: string;
  departDate: string;
  returnDate: string;
  passengers: number;
  promoCode: string;
  passengerName: string;
  email: string;
  phone: string;
  seat: string;
}

export default function FlightDemo() {
  const { t, language } = useTranslation();
  const [isReady, setIsReady] = useState(false);
  const [tripType, setTripType] = useState<"round" | "oneway">("round");
  const [ticketBooking, setTicketBooking] = useState<BookingForm | null>(null);
  const [boardingPassOpen, setBoardingPassOpen] = useState(false);
  const [seatMapOpen, setSeatMapOpen] = useState(false);
  const [form, setForm] = useState<BookingForm>({
    from: "กรุงเทพฯ (DMK)",
    to: "เชียงใหม่ (CNX)",
    departDate: "",
    returnDate: "",
    passengers: 1,
    promoCode: "",
    passengerName: "",
    email: "",
    phone: "",
    seat: "",
  });

  // Show page skeleton until first paint completes
  useEffect(() => {
    const id = requestAnimationFrame(() => setIsReady(true));
    try {
      const saved = window.localStorage.getItem("botnoi-air-last-booking");
      if (saved) {
        setTicketBooking(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Failed to load last booking:", e);
    }
    return () => cancelAnimationFrame(id);
  }, []);

  const { scrollY } = useScroll();
  const heroParallax = useTransform(scrollY, [0, 400], [0, 150]);

  const getCityLabel = (city: string) => {
    if (language !== 'th') {
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

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.departDate || !form.passengerName || !form.email) {
      toast.error(t('flight.booking_error'));
      return;
    }
    const newBooking = { tripType, ...form };
    saveBooking(newBooking);
    toast.success(t('flight.booking_success'));
    setTicketBooking(newBooking);
    try {
      window.localStorage.setItem("botnoi-air-last-booking", JSON.stringify(newBooking));
    } catch (err) {
      console.error("Failed to save booking:", err);
    }
    setBoardingPassOpen(true);
    setForm({ ...form, passengerName: "", email: "", phone: "", promoCode: "", seat: "" });
  }

  return (
    <>
      <AnimatePresence>
        {!isReady && <PageSkeleton variant="flight" />}
      </AnimatePresence>
      <div className="flight-theme min-h-screen bg-background relative text-foreground overflow-x-hidden">
        <Toaster position="top-center" richColors />

        {ticketBooking && (
          <TicketModal
            booking={ticketBooking}
            open={boardingPassOpen}
            onClose={() => setBoardingPassOpen(false)}
          />
        )}

        <SeatMapModal
          open={seatMapOpen}
          onClose={() => setSeatMapOpen(false)}
          selectedSeat={form.seat}
          onSelectSeat={(seat) => setForm({ ...form, seat })}
          fromCity={form.from}
          toCity={form.to}
        />

        {/* HERO with image background & parallax */}
        <section className="relative isolate overflow-hidden text-white min-h-[500px] flex flex-col justify-between">
          <motion.img
            src={heroBg}
            alt="Flight View Thailand"
            className="absolute inset-0 -z-10 h-[120%] w-full object-cover"
            style={{ y: heroParallax }}
          />
          {/* Dark scrim for text readability */}
          <div className="absolute inset-0 -z-[5] bg-gradient-to-b from-slate-900/60 via-slate-900/30 to-slate-900/70" />

          <header className="relative z-20 bg-white/85 backdrop-blur-md border-b border-slate-200/50">
            <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
              <Link to="/flight-demo" className="flex items-center gap-2.5">
                <img src={botnoiAirLogo} alt="BotnoiAir" className="h-10 w-auto object-contain" />
              </Link>
              <nav className="flex items-center gap-4">
                {ticketBooking && (
                  <button
                    onClick={() => setBoardingPassOpen(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-sky-700 hover:text-sky-900 hover:bg-sky-50 rounded-full transition-all"
                    id="nav-flight-boarding-pass"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" /><line x1="12" y1="12" x2="12" y2="16" /><line x1="10" y1="14" x2="14" y2="14" /></svg>
                    {t('flight.nav_receipt') || 'Boarding Pass'}
                  </button>
                )}
                <Link to="/flight-demo/admin" className="px-4 py-1.5 rounded-full bg-sky-50 hover:bg-sky-100 transition-all border border-sky-100 text-sky-700 hover:text-sky-800 text-sm font-semibold" id="nav-flight-admin">{t('flight.nav_admin')}</Link>
              </nav>
            </div>
          </header>

          <div className="mx-auto max-w-7xl px-6 pt-12 md:pt-16 pb-120 md:pb-44 w-full relative z-10">
            {/* Dark scrim behind text for readability */}
            <motion.div
              className="max-w-2xl"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="inline-block rounded-full bg-sky-600/80 backdrop-blur-md px-4 py-1.5 text-xs font-bold tracking-wider text-white border border-sky-400/40 uppercase shadow-sm">
                {t('flight.badge')}
              </span>

              <h1 className="mt-4 font-display text-4xl md:text-6xl leading-tight text-white tracking-tight">
                <span className="[-webkit-text-stroke:1px_#555555] [-webkit-text-fill-color:white] text-white block md:inline">
                  {t('flight.hero_title')}
                </span>
                <br />
                <span className="bg-gradient-to-r from-sky-300 to-cyan-200 bg-clip-text text-transparent drop-shadow-lg">
                  {t('flight.hero_title_sub')}
                </span>
              </h1>

              <p
                className="mt-4 text-base md:text-lg text-white max-w-lg leading-relaxed font-medium"
                style={{ textShadow: '0 1px 6px rgba(0,0,0,0.6)' }}
              >
                {t('flight.hero_desc')}
              </p>
            </motion.div>
          </div>
        </section>

        {/* BOOKING FORM */}
        <section id="booking" className="mx-auto max-w-5xl px-6 -mt-24 relative z-10">
          <motion.div
            className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border border-slate-200/50 p-6 md:p-8 hover:shadow-sky-500/5 transition-shadow duration-300"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
              <h2 className="font-display text-2xl font-extrabold text-slate-900 tracking-tight">{t('flight.form_title')}</h2>
              <div className="flex gap-1.5 bg-slate-100 p-1.5 rounded-full border border-slate-200/50">
                {(["round", "oneway"] as const).map((tType) => (
                  <button
                    key={tType}
                    type="button"
                    onClick={() => setTripType(tType)}
                    className={`px-5 py-2 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer ${tripType === tType
                      ? "bg-white text-sky-700 shadow-sm border border-slate-200/20"
                      : "text-slate-500 hover:text-slate-800"
                      }`}
                  >
                    {tType === "round" ? t('flight.round_trip') : t('flight.one_way')}
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={submit} className="grid md:grid-cols-2 gap-4">
              <Field label={t('flight.from')} htmlFor="fromCity" required>
                <select
                  id="fromCity"
                  name="fromCity"
                  required
                  value={form.from}
                  onChange={(e) => setForm({ ...form, from: e.target.value })}
                  className="w-full bg-transparent outline-none font-bold text-slate-800 text-sm py-1"
                >
                  {CITIES.map((c) => (
                    <option key={c} value={c} className="bg-white">{getCityLabel(c)}</option>
                  ))}
                </select>
              </Field>

              <Field label={t('flight.to')} htmlFor="toCity" required>
                <select
                  id="toCity"
                  name="toCity"
                  required
                  value={form.to}
                  onChange={(e) => setForm({ ...form, to: e.target.value })}
                  className="w-full bg-transparent outline-none font-bold text-slate-800 text-sm py-1"
                >
                  {CITIES.map((c) => (
                    <option key={c} value={c} className="bg-white">{getCityLabel(c)}</option>
                  ))}
                </select>
              </Field>

              <Field label={t('flight.depart')} htmlFor="departDate" required>
                <input
                  type="date"
                  id="departDate"
                  name="departDate"
                  required
                  value={form.departDate}
                  onChange={(e) => setForm({ ...form, departDate: e.target.value })}
                  className="w-full bg-transparent outline-none font-bold text-slate-800 text-sm text-foreground"
                />
              </Field>

              {tripType === "round" ? (
                <Field label={t('flight.return')} htmlFor="returnDate" required>
                  <input
                    type="date"
                    id="returnDate"
                    name="returnDate"
                    required
                    value={form.returnDate}
                    onChange={(e) => setForm({ ...form, returnDate: e.target.value })}
                    className="w-full bg-transparent outline-none font-bold text-slate-800 text-sm text-foreground"
                  />
                </Field>
              ) : (
                <div className="hidden md:block"></div>
              )}

              <Field label={t('flight.passengers')} htmlFor="passengers" required>
                <input
                  type="number"
                  id="passengers"
                  name="passengers"
                  min={1}
                  max={9}
                  value={form.passengers}
                  onChange={(e) => setForm({ ...form, passengers: +e.target.value })}
                  className="w-full bg-transparent outline-none font-bold text-slate-800 text-sm text-foreground"
                />
              </Field>

              <Field label={t('flight.promo')} htmlFor="promoCode">
                <input
                  id="promoCode"
                  name="promoCode"
                  value={form.promoCode}
                  onChange={(e) => setForm({ ...form, promoCode: e.target.value })}
                  className="w-full bg-transparent outline-none font-bold text-slate-800 text-sm text-foreground"
                  placeholder={language === 'en' ? "e.g., PROMO2026" : "เช่น PROMO2026"}
                />
              </Field>

              <div className="md:col-span-2 mt-4 pt-6 border-t border-slate-100">
                <h3 className="font-display text-lg font-bold mb-4 text-slate-800">{t('flight.modal_passenger')}</h3>
                <div className="grid md:grid-cols-4 gap-4">
                  <Field label={t('flight.passenger_name')} htmlFor="passengerName" required>
                    <input
                      id="passengerName"
                      name="passengerName"
                      required
                      value={form.passengerName}
                      onChange={(e) => setForm({ ...form, passengerName: e.target.value })}
                      className="w-full bg-transparent outline-none font-bold text-slate-800 text-sm text-foreground"
                      placeholder={t('flight.passenger_name_placeholder')}
                    />
                  </Field>
                  <Field label={t('flight.email')} htmlFor="email" required>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full bg-transparent outline-none font-bold text-slate-800 text-sm text-foreground"
                      placeholder="you@email.com"
                    />
                  </Field>
                  <Field label={t('flight.phone')} htmlFor="phone">
                    <input
                      id="phone"
                      name="phone"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="w-full bg-transparent outline-none font-bold text-slate-800 text-sm text-foreground"
                      placeholder="08X-XXX-XXXX"
                    />
                  </Field>
                  <Field 
                    label={t('flight.modal_seat') || "Seat"} 
                    onClick={() => setSeatMapOpen(true)}
                  >
                    <div className="py-0.5 select-none">
                      <span className="font-bold text-slate-800 text-sm truncate block">
                        {form.seat || (language === 'en' ? "Not selected" : "ยังไม่ได้เลือก")}
                      </span>
                    </div>
                  </Field>
                </div>
              </div>

              <div className="md:col-span-2 flex justify-end pt-4">
                <button
                  type="submit"
                  id="submit-flight-booking"
                  className="px-10 py-4 rounded-full bg-gradient-to-r from-sky-600 to-indigo-600 text-white font-display font-bold text-sm shadow-md hover:from-sky-500 hover:to-indigo-500 hover:shadow-lg active:scale-98 transition-all cursor-pointer"
                >
                  {t('flight.submit')}
                </button>
              </div>
            </form>
          </motion.div>
        </section>

        {/* PROMOTIONS */}
        <section id="promo" className="mx-auto max-w-5xl px-6 py-24">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-xs font-bold text-sky-600 uppercase tracking-widest">{t('flight.promo_heading')}</p>
              <h2 className="font-display text-3xl font-extrabold mt-1.5 text-slate-900 tracking-tight">{t('flight.promo_subheading')}</h2>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { t: language === 'en' ? "Bangkok → Chiang Mai" : "กรุงเทพฯ → เชียงใหม่", p: "690", img: promoChiangmai, label: t('flight.card_chiangmai'), desc: t('flight.card_chiangmai_desc') },
              { t: language === 'en' ? "Bangkok → Phuket" : "กรุงเทพฯ → ภูเก็ต", p: "890", img: promoPhuket, label: t('flight.card_phuket'), desc: t('flight.card_phuket_desc') },
              { t: language === 'en' ? "Bangkok → Hat Yai" : "กรุงเทพฯ → หาดใหญ่", p: "990", img: promoHatyai, label: t('flight.card_hatyai'), desc: t('flight.card_hatyai_desc') },
            ].map((x, index) => (
              <motion.article
                key={x.t}
                className="group relative overflow-hidden rounded-3xl aspect-[4/5] cursor-pointer border border-slate-200/50 shadow-md"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                whileHover={{ y: -6, scale: 1.05 }}
              >
                <SkeletonImage
                  src={x.img}
                  alt={x.label}
                  wrapperClassName="absolute inset-0"
                  loading="lazy"
                  className="transition duration-700 group-hover:scale-105"
                />
                {/* Full card dark overlay on hover */}
                <div className="absolute inset-0 bg-black/60 opacity-0 transition-opacity duration-500 group-hover:opacity-80 z-10" />

                {/* Expanding gradient overlay rising from the bottom */}
                <div 
                  className="absolute bottom-0 left-0 right-0 h-[40%] opacity-70 transition-all duration-500 ease-out group-hover:h-[85%] group-hover:opacity-80 z-10"
                  style={{
                    background: 'linear-gradient(to top, #000000 0%, rgba(0,0,0,0.98) 45%, rgba(0,0,0,0.8) 75%, rgba(0,0,0,0) 100%)'
                  }}
                />

                <div className="absolute inset-0 p-6 flex flex-col justify-end text-white z-20 text-left">
                  <p className="text-[10px] font-bold tracking-widest uppercase opacity-75">{x.label}</p>
                  <p className="mt-1.5 font-display text-xl font-bold tracking-tight">{x.t}</p>
                  
                  <div className="max-h-0 opacity-0 translate-y-4 group-hover:max-h-48 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 ease-out overflow-hidden">
                    <p className="mt-2 text-xs text-white/70 line-clamp-2 group-hover:line-clamp-none max-h-20 group-hover:overflow-y-auto leading-relaxed pr-1" style={{ scrollbarWidth: 'thin' }}>{x.desc}</p>
                    <div className="mt-4 flex items-end justify-between">
                      <div>
                        <p className="text-[10px] opacity-75">{t('flight.starting_price')}</p>
                        <p className="font-display text-2xl font-black text-white">฿{x.p}</p>
                      </div>
                      <span className="rounded-full bg-white/20 backdrop-blur-md px-4 py-2 text-xs font-bold text-white border border-white/10 group-hover:bg-white/30 transition-colors">
                        {t('flight.details')}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </section>


        {/* SPECIAL SERVICES */}
        <section className="bg-foreground/[0.02] border-y border-foreground/10 py-20 relative z-10 text-left">
          <div className="mx-auto max-w-5xl px-6">
            <div className="text-center max-w-xl mx-auto mb-16">
              <h2 className="font-display text-3xl font-extrabold text-foreground tracking-tight">{t('flight.about_heading')}</h2>
              <p className="text-sm text-foreground/60 mt-3">{t('flight.about_subheading')}</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              
              {/* Card 1 */}
              <div className="group bg-background/60 backdrop-blur-sm rounded-2xl p-6 border border-foreground/10 shadow-sm hover:shadow-md hover:border-sky-500/30 transition-all duration-300">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-sky-500/10 text-sky-500 mb-4 border border-sky-500/20 group-hover:scale-110 group-hover:bg-sky-500 group-hover:text-white transition-all duration-300">
                  <Luggage className="w-6 h-6" />
                </div>
                <h4 className="font-display font-bold text-foreground mb-2">{t('flight.service1_title')}</h4>
                <p className="text-xs text-foreground/60 leading-relaxed">{t('flight.service1_desc')}</p>
              </div>

              {/* Card 2 */}
              <div className="group bg-background/60 backdrop-blur-sm rounded-2xl p-6 border border-foreground/10 shadow-sm hover:shadow-md hover:border-amber-500/30 transition-all duration-300">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-amber-500/10 text-amber-500 mb-4 border border-amber-500/20 group-hover:scale-110 group-hover:bg-amber-500 group-hover:text-white transition-all duration-300">
                  <Coffee className="w-6 h-6" />
                </div>
                <h4 className="font-display font-bold text-foreground mb-2">{t('flight.service2_title')}</h4>
                <p className="text-xs text-foreground/60 leading-relaxed">{t('flight.service2_desc')}</p>
              </div>

              {/* Card 3 */}
              <div className="group bg-background/60 backdrop-blur-sm rounded-2xl p-6 border border-foreground/10 shadow-sm hover:shadow-md hover:border-indigo-500/30 transition-all duration-300">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-indigo-500/10 text-indigo-500 mb-4 border border-indigo-500/20 group-hover:scale-110 group-hover:bg-indigo-500 group-hover:text-white transition-all duration-300">
                  <Mic className="w-6 h-6" />
                </div>
                <h4 className="font-display font-bold text-foreground mb-2">{t('flight.service3_title')}</h4>
                <p className="text-xs text-foreground/60 leading-relaxed">{t('flight.service3_desc')}</p>
              </div>

            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer id="info" className="bg-slate-900 text-slate-400 py-16 border-t border-slate-800">
          <div className="mx-auto max-w-5xl px-6 grid md:grid-cols-3 gap-10 text-left">
            <div>
              <p className="font-display text-xl font-black text-white tracking-tight">BotnoiAir</p>
              <p className="text-xs opacity-75 mt-3 leading-relaxed">
                {t('flight.hero_desc')}
              </p>
            </div>
            <div>
              <p className="font-display font-bold mb-3 text-white text-sm">Services</p>
              <ul className="text-xs opacity-75 space-y-2.5">
                <li>{t('flight.nav_booking')}</li>
                <li>{t('flight.service1_title')}</li>
                <li>{t('flight.service2_title')}</li>
              </ul>
            </div>
            <div>
              <p className="font-display font-bold mb-3 text-white text-sm">Contact Us</p>
              <ul className="text-xs opacity-75 space-y-2.5">
                <li>Tel. 1318 (24 Hours)</li>
                <li>support@botnoiair.example</li>
              </ul>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}

function Field({ label, htmlFor, children, onClick, required }: { label: string; htmlFor?: string; children: React.ReactNode; onClick?: () => void; required?: boolean }) {
  return (
    <div 
      onClick={onClick}
      className={`block rounded-2xl bg-slate-50/60 px-4 py-3.5 border border-slate-200/60 transition-all ${
        onClick 
          ? "cursor-pointer hover:bg-white hover:border-sky-500 hover:shadow-md hover:ring-2 hover:ring-sky-500/10 active:scale-98" 
          : "focus-within:border-sky-500 focus-within:bg-white focus-within:shadow-md focus-within:ring-2 focus-within:ring-sky-500/10"
      }`}
    >
      <label htmlFor={htmlFor} className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block cursor-pointer select-none">
        {label}
        {required && <span className="text-rose-500 ml-1 font-bold">*</span>}
      </label>
      <div className="mt-1">{children}</div>
    </div>
  );
}

function TicketModal({ booking, open, onClose }: { booking: any, open: boolean, onClose: () => void }) {
  const { t, language } = useTranslation();
  if (!booking) return null;

  const getCode = (city: string) => city.match(/\(([A-Z]{3})\)/)?.[1] || "N/A";
  const getCleanCity = (city: string) => {
    if (language === 'en') {
      const mapping: Record<string, string> = {
        "กรุงเทพฯ (DMK)": "Bangkok",
        "เชียงใหม่ (CNX)": "Chiang Mai",
        "ภูเก็ต (HKT)": "Phuket",
        "หาดใหญ่ (HDY)": "Hat Yai",
        "อุดรธานี (UTH)": "Udon Thani",
        "อุบลราชธานี (UBP)": "Ubon Ratchathani",
        "ขอนแก่น (KKC)": "Khon Kaen",
        "สุราษฎร์ธานี (URT)": "Surat Thani",
        "นครศรีธรรมราช (NST)": "Nakhon Si Thammarat",
        "เชียงราย (CEI)": "Chiang Rai",
      };
      return mapping[city] || city.split('(')[0].trim();
    }
    return city.split('(')[0].trim();
  };

  // Generate stable flight number, seat number, and price based on passenger name hash
  const passengerHash = booking.passengerName
    ? booking.passengerName.split('').reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0)
    : 123;
  const flightNumber = `SN${(passengerHash % 899) + 100}`;
  const seatRow = (passengerHash % 30) + 1;
  const seatLetter = ['A', 'B', 'C', 'D', 'E', 'F'][passengerHash % 6];
  const seatNumber = booking.seat || `${seatRow}${seatLetter}`;

  const basePrice = booking.to.includes("เชียงใหม่") || booking.to.includes("ภูเก็ต") ? 890 : 990;
  const totalPrice = basePrice * booking.passengers;

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto overflow-x-hidden rounded-3xl sm:rounded-3xl border-none p-0 sm:max-w-md bg-[#eef6fc] text-slate-800 shadow-2xl">
        <div className="p-8 relative select-none">
          
          {/* Header branding (Top center) */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-1.5">
              <span className="font-display font-black text-lg text-sky-950 tracking-tight">BotnoiAir</span>
            </div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-sky-900/60 bg-sky-200/40 px-2.5 py-1 rounded-full">
              Boarding Pass
            </div>
          </div>

          {/* CDG - FLR Route Display */}
          <div className="flex justify-between items-end mb-1">
            <div>
              <div className="text-4xl font-black font-display text-sky-950 tracking-tight leading-none">{getCode(booking.from)}</div>
              <div className="text-xs text-slate-500 font-medium mt-1.5">{getCleanCity(booking.from)}</div>
            </div>
            <div className="text-right">
              <div className="text-4xl font-black font-display text-sky-950 tracking-tight leading-none">{getCode(booking.to)}</div>
              <div className="text-xs text-slate-500 font-medium mt-1.5">{getCleanCity(booking.to)}</div>
            </div>
          </div>

          {/* Connection line with Plane icon */}
          <div className="flex items-center w-full my-5 relative">
            {/* Left dot */}
            <div className="w-4 h-4 rounded-full bg-sky-200 flex items-center justify-center shrink-0">
              <div className="w-1.5 h-1.5 rounded-full bg-sky-600"></div>
            </div>
            
            {/* Left dashed line */}
            <div className="flex-1 border-t-2 border-dashed border-sky-200/80 mx-2"></div>
            
            {/* Center rotated Plane icon */}
            <div className="px-2 text-sky-950 shrink-0 transform rotate-45">
              <Plane className="w-6 h-6 fill-sky-950 stroke-[1.5]" />
            </div>
            
            {/* Right dashed line */}
            <div className="flex-1 border-t-2 border-dashed border-sky-200/80 mx-2"></div>
            
            {/* Right dot */}
            <div className="w-4 h-4 rounded-full bg-sky-200 flex items-center justify-center shrink-0">
              <div className="w-1.5 h-1.5 rounded-full bg-sky-600"></div>
            </div>
          </div>

          {/* Depart & Arrive details */}
          <div className="grid grid-cols-3 gap-2 mb-6">
            <div className="text-left">
              <div className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">{t('flight.modal_depart')}</div>
              <div className="font-extrabold text-sm text-slate-800 mt-0.5">{booking.departDate}</div>
              <div className="text-[10px] text-slate-500 mt-0.5">10:30 AM</div>
            </div>
            <div className="text-center flex flex-col justify-center">
              <div className="font-extrabold text-xs text-slate-700">{flightNumber}</div>
              <div className="text-[10px] text-slate-400 font-medium mt-0.5">Non-stop</div>
            </div>
            <div className="text-right">
              <div className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">
                {booking.tripType === "round" && booking.returnDate ? t('flight.modal_return') : "Arrive"}
              </div>
              <div className="font-extrabold text-sm text-slate-800 mt-0.5">
                {booking.tripType === "round" && booking.returnDate ? booking.returnDate : booking.departDate}
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">
                12:15 PM
              </div>
            </div>
          </div>

          {/* Dashed separator */}
          <div className="border-t border-dashed border-sky-200/80 my-5"></div>

          {/* Passenger details grid */}
          <div className="grid grid-cols-3 gap-y-4 gap-x-2 text-left mb-6">
            <div className="col-span-2">
              <p className="text-[9px] text-slate-400 uppercase font-bold tracking-wider mb-0.5">{t('flight.modal_passenger')}</p>
              <p className="font-bold text-sm text-slate-800 truncate pr-2">{booking.passengerName}</p>
            </div>
            <div>
              <p className="text-[9px] text-slate-400 uppercase font-bold tracking-wider mb-0.5">{t('flight.modal_seat')}</p>
              <p className="font-bold text-sm text-slate-800">{seatNumber}</p>
            </div>
            
            <div className="col-span-2">
              <p className="text-[9px] text-slate-400 uppercase font-bold tracking-wider mb-0.5">Class / Status</p>
              <p className="font-bold text-sm text-slate-800">Economy / Confirmed</p>
            </div>
            <div>
              <p className="text-[9px] text-slate-400 uppercase font-bold tracking-wider mb-0.5">{t('flight.modal_passengers_num')}</p>
              <p className="font-bold text-sm text-slate-800">{booking.passengers}</p>
            </div>
          </div>

          {/* Barcode and price */}
          <div className="border-t border-dashed border-sky-200/80 pt-5 mt-5 flex justify-between items-center">
            {/* Mock price */}
            <div className="text-left">
              <div className="text-[9px] text-slate-400 uppercase font-bold tracking-wider mb-0.5">Total Fare</div>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-black text-sky-950">฿{totalPrice.toLocaleString()}</span>
                <span className="text-[9px] text-slate-400">/{booking.passengers} pax</span>
              </div>
            </div>
            
            {/* Barcode mockup */}
            <div className="h-9 w-32 opacity-80" style={{ background: "repeating-linear-gradient(95deg, #1e293b, #1e293b 2px, transparent 2px, transparent 4px, #1e293b 4px, #1e293b 6px, transparent 6px, transparent 10px, #1e293b 10px, #1e293b 14px, transparent 14px, transparent 16px)" }}></div>
          </div>

          {/* Close button at the bottom */}
          <div className="mt-8 flex justify-center">
            <button onClick={onClose} id="confirm-ticket-modal" className="w-full py-3 bg-sky-950 text-white font-bold text-xs rounded-2xl shadow-md hover:bg-sky-900 active:scale-98 transition-all cursor-pointer">
              {t('flight.modal_close')}
            </button>
          </div>

        </div>
      </DialogContent>
    </Dialog>
  );
}

interface SeatMapModalProps {
  open: boolean;
  onClose: () => void;
  selectedSeat: string;
  onSelectSeat: (seat: string) => void;
  fromCity: string;
  toCity: string;
}

function SeatMapModal({ open, onClose, selectedSeat, onSelectSeat, fromCity, toCity }: SeatMapModalProps) {
  const { language } = useTranslation();
  const getCode = (city: string) => city.match(/\(([A-Z]{3})\)/)?.[1] || "N/A";
  
  // Static list of occupied seats
  const OCCUPIED_SEATS = ["1B", "2E", "3A", "3F", "5D", "6B", "6C", "7A", "8F", "9C", "9D"];
  
  // Rows 1 to 10
  const rows = Array.from({ length: 10 }, (_, i) => i + 1);
  const leftCols = ["A", "B", "C"];
  const rightCols = ["D", "E", "F"];

  const handleSeatClick = (seatId: string) => {
    if (OCCUPIED_SEATS.includes(seatId)) return;
    onSelectSeat(seatId);
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto overflow-x-hidden rounded-3xl sm:rounded-3xl border-none p-0 sm:max-w-md bg-white text-slate-800 shadow-2xl">
        <div className="p-6 relative select-none">
          {/* Header */}
          <div className="text-center mb-6">
            <h3 className="font-display font-black text-xl text-sky-950 tracking-tight">
              {language === 'en' ? "Select Seat" : "เลือกที่นั่งที่ชอบ"}
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              {getCode(fromCity)} → {getCode(toCity)}
            </p>
          </div>

          {/* Seat Legend */}
          <div className="flex justify-center gap-6 text-xs mb-6 bg-slate-50 py-3 rounded-2xl border border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-[#cbdcf7] border border-[#cbdcf7]"></div>
              <span className="text-[#0f3460] font-medium">{language === 'en' ? "Available" : "ว่าง"}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center"><span className="text-[8px] text-slate-400 line-through">✕</span></div>
              <span className="text-slate-400">{language === 'en' ? "Occupied" : "ไม่ว่าง"}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-[#0f3460] border border-[#0f3460]"></div>
              <span className="text-[#0f3460] font-bold">{language === 'en' ? "Selected" : "เลือกอยู่"}</span>
            </div>
          </div>

          {/* Airplane Seat Map Container */}
          <div className="max-w-[340px] mx-auto bg-slate-50 border border-slate-100 rounded-3xl p-4 pt-8 relative overflow-hidden">
            {/* Mock Cockpit at the top */}
            <div className="w-32 h-10 border-t-2 border-x-2 border-slate-200 rounded-t-full mx-auto mb-6 flex items-center justify-center bg-white relative">
              <div className="w-1.5 h-1.5 rounded-full bg-slate-200 absolute left-4 bottom-2"></div>
              <div className="w-1.5 h-1.5 rounded-full bg-slate-200 absolute right-4 bottom-2"></div>
              <span className="text-[9px] font-bold text-slate-400 tracking-widest uppercase">COCKPIT</span>
            </div>

            {/* Cabin Seats Rows */}
            <div className="space-y-3">
              {rows.map((row) => (
                <div key={row} className="grid grid-cols-7 gap-x-2 items-center text-center px-1">
                  {/* Left seats A, B, C */}
                  {leftCols.map((col) => {
                    const seatId = `${row}${col}`;
                    const isOccupied = OCCUPIED_SEATS.includes(seatId);
                    const isSelected = selectedSeat === seatId;
                    
                    return (
                      <button
                        key={seatId}
                        type="button"
                        disabled={isOccupied}
                        onClick={() => handleSeatClick(seatId)}
                        className={`w-10 h-10 rounded-full text-[10px] font-bold border transition-all cursor-pointer flex items-center justify-center ${
                          isOccupied
                            ? "bg-slate-100 border-slate-200 text-slate-400/60 line-through cursor-not-allowed"
                            : isSelected
                            ? "bg-[#0f3460] border-[#0f3460] text-white font-extrabold shadow-md scale-105 shadow-[#0f3460]/20"
                            : "bg-[#cbdcf7]/70 border-[#cbdcf7] text-[#0f3460] hover:bg-[#cbdcf7] hover:border-[#9abcee]"
                        }`}
                      >
                        {seatId}
                      </button>
                    );
                  })}

                  {/* Aisle spacer */}
                  <div className="w-4"></div>

                  {/* Right seats D, E, F */}
                  {rightCols.map((col) => {
                    const seatId = `${row}${col}`;
                    const isOccupied = OCCUPIED_SEATS.includes(seatId);
                    const isSelected = selectedSeat === seatId;
                    
                    return (
                      <button
                        key={seatId}
                        type="button"
                        disabled={isOccupied}
                        onClick={() => handleSeatClick(seatId)}
                        className={`w-10 h-10 rounded-full text-[10px] font-bold border transition-all cursor-pointer flex items-center justify-center ${
                          isOccupied
                            ? "bg-slate-100 border-slate-200 text-slate-400/60 line-through cursor-not-allowed"
                            : isSelected
                            ? "bg-[#0f3460] border-[#0f3460] text-white font-extrabold shadow-md scale-105 shadow-[#0f3460]/20"
                            : "bg-[#cbdcf7]/70 border-[#cbdcf7] text-[#0f3460] hover:bg-[#cbdcf7] hover:border-[#9abcee]"
                        }`}
                      >
                        {seatId}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>

            {/* Exit indicators at the bottom */}
            <div className="flex justify-between items-center mt-6 text-[9px] font-bold text-slate-400 px-4">
              <span className="flex items-center gap-1">◀ EXIT</span>
              <span className="flex items-center gap-1">EXIT ▶</span>
            </div>
          </div>

          {/* Confirm Button */}
          <div className="mt-8 flex flex-col gap-3">
            {selectedSeat ? (
              <div className="text-center text-xs text-[#0f3460] font-bold bg-[#cbdcf7]/30 border border-[#cbdcf7]/40 py-2.5 rounded-2xl">
                {language === 'en' ? `Selected Seat: ${selectedSeat}` : `ที่นั่งที่เลือก: ${selectedSeat}`}
              </div>
            ) : (
              <div className="text-center text-xs text-rose-600 font-bold bg-rose-50 border border-rose-200/50 py-2.5 rounded-2xl">
                {language === 'en' ? "Please select a seat" : "โปรดเลือกที่นั่งก่อนยืนยัน"}
              </div>
            )}
            
            <button
              type="button"
              disabled={!selectedSeat}
              onClick={onClose}
              className={`w-full py-3.5 font-display font-bold text-xs rounded-2xl shadow-md transition-all cursor-pointer ${
                selectedSeat
                  ? "bg-[#0f3460] hover:bg-[#0c2a50] text-white hover:shadow-lg active:scale-98"
                  : "bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200"
              }`}
            >
              {language === 'en' ? "Confirm Seat" : "ยืนยันการเลือกที่นั่ง"}
            </button>
          </div>

        </div>
      </DialogContent>
    </Dialog>
  );
}