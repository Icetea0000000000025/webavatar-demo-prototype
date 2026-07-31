import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { useTranslation } from "@/lib/LanguageContext";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Luggage, Coffee, Mic, Plane, Wifi, Zap, ChevronDown, ChevronUp, Check, ArrowLeft, Sparkles, Clock, Ticket } from "lucide-react";
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
  const [activePromoIndex, setActivePromoIndex] = useState<number | null>(null);

  // Flight Selection States
  const [bookingStep, setBookingStep] = useState<"search" | "select_flight" | "passenger_details">("search");
  const [isReturnSelection, setIsReturnSelection] = useState(false);
  const [selectedOutboundFlight, setSelectedOutboundFlight] = useState<any | null>(null);
  const [selectedInboundFlight, setSelectedInboundFlight] = useState<any | null>(null);
  const [expandedDetailsIndex, setExpandedDetailsIndex] = useState<number | null>(null);
  const [activeFilter, setActiveFilter] = useState<"cheapest" | "best" | "quickest">("cheapest");

  // Advanced Filters States
  const [maxPrice, setMaxPrice] = useState<number>(2500);
  const [selectedClass, setSelectedClass] = useState<"all" | "economy" | "business">("all");
  const [selectedTimeOfDay, setSelectedTimeOfDay] = useState<string[]>([]);
  const [selectedAirlines, setSelectedAirlines] = useState<string[]>([]);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const mockAirlines = [
    { name: "Botnoi Air", code: "BTN", logoBg: "bg-sky-600", rating: 4.8 },
    { name: "Thai Airways", code: "THA", logoBg: "bg-purple-800", rating: 4.7 },
    { name: "Bangkok Airways", code: "BKP", logoBg: "bg-sky-400", rating: 4.6 }
  ];

  const getMockFlights = (isReturn: boolean) => {
    const fromCity = isReturn ? form.to : form.from;
    const toCity = isReturn ? form.from : form.to;
    
    const isPremiumRoute = toCity.includes("ภูเก็ต") || toCity.includes("หาดใหญ่");
    const basePrice = isPremiumRoute ? 990 : 890;

    const list = [
      {
        id: isReturn ? "ret-1" : "out-1",
        airline: mockAirlines[0],
        flightNo: `${mockAirlines[0].code}${isReturn ? "9" : "2"}01`,
        departTime: isReturn ? "07:00" : "06:15",
        arrivalTime: isReturn ? "08:15" : "07:30",
        duration: "1h 15m",
        price: basePrice,
        class: "economy",
        timeOfDay: "morning",
        type: "cheapest",
        discount: "15% OFF"
      },
      {
        id: isReturn ? "ret-2" : "out-2",
        airline: mockAirlines[1],
        flightNo: `${mockAirlines[1].code}${isReturn ? "8" : "3"}12`,
        departTime: isReturn ? "10:30" : "09:45",
        arrivalTime: isReturn ? "11:45" : "11:00",
        duration: "1h 15m",
        price: Math.round(basePrice * 1.15),
        class: "economy",
        timeOfDay: "morning",
        type: "best",
        discount: "None"
      },
      {
        id: isReturn ? "ret-3" : "out-3",
        airline: mockAirlines[0],
        flightNo: `${mockAirlines[0].code}${isReturn ? "9" : "2"}05`,
        departTime: isReturn ? "13:15" : "13:30",
        arrivalTime: isReturn ? "14:30" : "14:45",
        duration: "1h 15m",
        price: Math.round(basePrice * 0.9), // Promo
        class: "economy",
        timeOfDay: "afternoon",
        type: "cheapest",
        discount: "20% OFF"
      },
      {
        id: isReturn ? "ret-4" : "out-4",
        airline: mockAirlines[2],
        flightNo: `${mockAirlines[2].code}${isReturn ? "7" : "4"}85`,
        departTime: isReturn ? "16:45" : "15:15",
        arrivalTime: isReturn ? "18:00" : "16:30",
        duration: "1h 15m",
        price: Math.round(basePrice * 1.6),
        class: "business",
        timeOfDay: "afternoon",
        type: "best",
        discount: "None"
      },
      {
        id: isReturn ? "ret-5" : "out-5",
        airline: mockAirlines[1],
        flightNo: `${mockAirlines[1].code}${isReturn ? "8" : "3"}25`,
        departTime: isReturn ? "19:30" : "18:45",
        arrivalTime: isReturn ? "20:45" : "20:00",
        duration: "1h 15m",
        price: Math.round(basePrice * 2.2), // Business Premium
        class: "business",
        timeOfDay: "evening",
        type: "quickest",
        discount: "None"
      },
      {
        id: isReturn ? "ret-6" : "out-6",
        airline: mockAirlines[2],
        flightNo: `${mockAirlines[2].code}${isReturn ? "7" : "4"}99`,
        departTime: isReturn ? "21:30" : "21:00",
        arrivalTime: isReturn ? "22:45" : "22:15",
        duration: "1h 15m",
        price: Math.round(basePrice * 1.1),
        class: "economy",
        timeOfDay: "evening",
        type: "quickest",
        discount: "10% OFF"
      }
    ];

    let filtered = list;

    // Apply Price Filter
    filtered = filtered.filter(f => f.price <= maxPrice);

    // Apply Class Filter
    if (selectedClass !== "all") {
      filtered = filtered.filter(f => f.class === selectedClass);
    }

    // Apply Time of Day Filter
    if (selectedTimeOfDay.length > 0) {
      filtered = filtered.filter(f => selectedTimeOfDay.includes(f.timeOfDay));
    }

    // Apply Airline Filter
    if (selectedAirlines.length > 0) {
      filtered = filtered.filter(f => selectedAirlines.includes(f.airline.code));
    }

    if (activeFilter === "cheapest") {
      return [...filtered].sort((a, b) => a.price - b.price);
    } else if (activeFilter === "quickest") {
      return filtered;
    } else {
      return [...filtered].sort((a, b) => b.airline.rating - a.airline.rating);
    }
  };

  const handleSelectPromo = (fromCity: string, toCity: string) => {
    setForm((prev) => ({
      ...prev,
      from: fromCity,
      to: toCity,
    }));
    toast.success(
      language === 'en' 
        ? `Selected route: ${fromCity.split('(')[0].trim()} to ${toCity.split('(')[0].trim()}` 
        : `เลือกเส้นทาง: ${fromCity.split('(')[0].trim()} ไปยัง ${toCity.split('(')[0].trim()} เรียบร้อยแล้ว`
    );
    setSelectedOutboundFlight(null);
    setSelectedInboundFlight(null);
    setIsReturnSelection(false);
    setBookingStep("select_flight");
    const bookingSection = document.getElementById("booking");
    if (bookingSection) {
      bookingSection.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

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

  // Collapse active promo card if clicked outside
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      const promoGrid = document.querySelector("#promo-grid");
      if (promoGrid && !promoGrid.contains(e.target as Node)) {
        setActivePromoIndex(null);
      }
    };
    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
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

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.departDate) {
      toast.error(language === 'en' ? "Please select departure date" : "กรุณาเลือกวันเดินทางขาไป");
      return;
    }
    if (tripType === "round" && !form.returnDate) {
      toast.error(language === 'en' ? "Please select return date" : "กรุณาเลือกวันเดินทางขากลับ");
      return;
    }
    setSelectedOutboundFlight(null);
    setSelectedInboundFlight(null);
    setIsReturnSelection(false);
    setBookingStep("select_flight");
    const bookingSection = document.getElementById("booking");
    if (bookingSection) {
      bookingSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handlePassengerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.passengerName || !form.email) {
      toast.error(t('flight.booking_error'));
      return;
    }

    const pricePerPax = (selectedOutboundFlight?.price || 890) + (selectedInboundFlight?.price || 0);

    const newBooking = {
      tripType,
      ...form,
      pricePerPax,
      class: selectedOutboundFlight?.class || "economy",
      outboundFlightNo: selectedOutboundFlight?.flightNo,
      outboundTime: selectedOutboundFlight?.departTime,
      inboundFlightNo: selectedInboundFlight?.flightNo,
      inboundTime: selectedInboundFlight?.departTime,
    };

    saveBooking(newBooking);
    toast.success(t('flight.booking_success'));
    setTicketBooking(newBooking);
    try {
      window.localStorage.setItem("botnoi-air-last-booking", JSON.stringify(newBooking));
    } catch (err) {
      console.error("Failed to save booking:", err);
    }
    setBoardingPassOpen(true);
    
    // Reset steps
    setBookingStep("search");
    setSelectedOutboundFlight(null);
    setSelectedInboundFlight(null);
    setIsReturnSelection(false);
    setForm({
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
  };

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

          <div className="mx-auto max-w-7xl px-6 pt-12 md:pt-16 pb-40 md:pb-44 w-full relative z-10">
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
                <span className="text-white [-webkit-text-fill-color:white] drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)] block md:inline">
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
            className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border border-slate-200/50 p-6 md:p-8 hover:shadow-sky-500/5 transition-all duration-300"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Progress Bar */}
            <div className="flex items-center justify-between mb-8 max-w-lg mx-auto select-none">
              <div className="flex flex-col items-center flex-1 relative">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-colors duration-300 ${
                  bookingStep === "search" ? "bg-sky-600 text-white" : "bg-sky-100 text-sky-700"
                }`}>
                  {bookingStep !== "search" ? <Check className="w-4 h-4" /> : "1"}
                </div>
                <span className="text-[10px] font-bold mt-1 text-slate-500">{t('flight.nav_booking') || "ค้นหา"}</span>
              </div>
              <div className="h-0.5 bg-slate-200 flex-1 -mt-4"></div>
              <div className="flex flex-col items-center flex-1 relative">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-colors duration-300 ${
                  bookingStep === "select_flight" ? "bg-sky-600 text-white" : 
                  (bookingStep === "passenger_details" ? "bg-sky-100 text-sky-700" : "bg-slate-100 text-slate-400")
                }`}>
                  {bookingStep === "passenger_details" ? <Check className="w-4 h-4" /> : "2"}
                </div>
                <span className="text-[10px] font-bold mt-1 text-slate-500">{t("flight.select_flight")}</span>
              </div>
              <div className="h-0.5 bg-slate-200 flex-1 -mt-4"></div>
              <div className="flex flex-col items-center flex-1 relative">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-colors duration-300 ${
                  bookingStep === "passenger_details" ? "bg-sky-600 text-white" : "bg-slate-100 text-slate-400"
                }`}>
                  3
                </div>
                <span className="text-[10px] font-bold mt-1 text-slate-500">{t('flight.modal_passenger') || "กรอกข้อมูล"}</span>
              </div>
            </div>

            {bookingStep === "search" && (
              <>
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

                <form onSubmit={handleSearchSubmit} className="grid md:grid-cols-2 gap-4">
                  <Field label={t('flight.from')} htmlFor="fromCity" required>
                    <select
                      id="fromCity"
                      name="fromCity"
                      required
                      value={form.from}
                      onChange={(e) => setForm({ ...form, from: e.target.value })}
                      className="w-full bg-transparent outline-none font-bold text-slate-800 text-sm py-1 font-display"
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
                      className="w-full bg-transparent outline-none font-bold text-slate-800 text-sm py-1 font-display"
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
                      className="w-full bg-transparent outline-none font-bold text-slate-800 text-sm text-foreground font-display"
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
                        className="w-full bg-transparent outline-none font-bold text-slate-800 text-sm text-foreground font-display"
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
                      className="w-full bg-transparent outline-none font-bold text-slate-800 text-sm text-foreground font-display"
                    />
                  </Field>

                  <Field label={t('flight.promo')} htmlFor="promoCode">
                    <input
                      id="promoCode"
                      name="promoCode"
                      value={form.promoCode}
                      onChange={(e) => setForm({ ...form, promoCode: e.target.value })}
                      className="w-full bg-transparent outline-none font-bold text-slate-800 text-sm text-foreground font-display"
                      placeholder={language === 'en' ? "e.g., PROMO2026" : "เช่น PROMO2026"}
                    />
                  </Field>

                  <div className="md:col-span-2 flex justify-end pt-4">
                    <button
                      type="submit"
                      id="submit-flight-search"
                      className="px-10 py-4 rounded-full bg-gradient-to-r from-sky-600 to-indigo-600 text-white font-display font-bold text-sm shadow-md hover:from-sky-500 hover:to-indigo-500 hover:shadow-lg active:scale-98 transition-all cursor-pointer flex items-center gap-2"
                    >
                      <Plane className="w-4 h-4" />
                      {language === 'en' ? "Search Flights" : "ค้นหาเที่ยวบิน"}
                    </button>
                  </div>
                </form>
              </>
            )}

            {bookingStep === "select_flight" && (
              <div className="text-slate-800 text-left">
                {/* Back button */}
                <button
                  onClick={() => {
                    if (isReturnSelection) {
                      setIsReturnSelection(false);
                    } else {
                      setBookingStep("search");
                    }
                  }}
                  className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-sky-700 transition-colors mb-4 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  {language === 'en' ? "Back" : "ย้อนกลับ"}
                </button>

                {/* Step Title */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
                  <div>
                    <h3 className="font-display text-xl font-bold text-slate-900">
                      {isReturnSelection 
                        ? (language === 'en' ? "Select Return Flight" : "เลือกเที่ยวบินขากลับ") 
                        : (language === 'en' ? "Select Departure Flight" : "เลือกเที่ยวบินขาไป")
                      }
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 font-display">
                      {isReturnSelection 
                        ? `${getCityLabel(form.to)} → ${getCityLabel(form.from)} | ${form.returnDate}` 
                        : `${getCityLabel(form.from)} → ${getCityLabel(form.to)} | ${form.departDate}`
                      }
                    </p>
                  </div>
                  <span className="text-xs font-bold text-sky-700 bg-sky-50 px-3 py-1.5 rounded-full font-display">
                    {language === 'en' ? "Flights | Total 3 result" : "เที่ยวบิน | มีบริการ 3 รอบ"}
                  </span>
                </div>

                 {/* Filters / Sorting tabs */}
                <div className="flex items-center gap-2 mb-4 select-none flex-wrap">
                  <div className="flex flex-1 gap-1.5 bg-slate-100 p-1.5 rounded-full border border-slate-200/50">
                    {(["cheapest", "best", "quickest"] as const).map((filter) => (
                      <button
                        key={filter}
                        type="button"
                        onClick={() => setActiveFilter(filter)}
                        className={`flex-1 py-2 text-center rounded-full text-xs font-bold transition-all cursor-pointer capitalize font-display ${
                          activeFilter === filter 
                            ? "bg-white text-sky-700 shadow-sm border border-slate-200/10" 
                            : "text-slate-500 hover:text-slate-800"
                        }`}
                      >
                        {filter === "cheapest" ? (language === 'en' ? "Cheapest" : "ถูกที่สุด") :
                         filter === "quickest" ? (language === 'en' ? "Quickest" : "เร็วที่สุด") :
                         (language === 'en' ? "Best" : "ดีที่สุด")}
                      </button>
                    ))}
                  </div>
                  
                  <button
                    type="button"
                    onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                    className={`px-4 py-2.5 rounded-full border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer font-display ${
                      showAdvancedFilters 
                        ? "bg-sky-50 text-sky-700 border-sky-200" 
                        : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="4" y1="21" x2="4" y2="14" /><line x1="4" y1="10" x2="4" y2="3" /><line x1="12" y1="21" x2="12" y2="12" /><line x1="12" y1="8" x2="12" y2="3" /><line x1="20" y1="21" x2="20" y2="16" /><line x1="20" y1="12" x2="20" y2="3" /><line x1="1" y1="14" x2="7" y2="14" /><line x1="9" y1="8" x2="15" y2="8" /><line x1="17" y1="16" x2="23" y2="16" /></svg>
                    {language === 'en' ? "Detailed Filters" : "ตัวกรองละเอียด"}
                  </button>
                </div>

                {/* Collapsible Advanced Filters Panel */}
                <AnimatePresence>
                  {showAdvancedFilters && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden border border-slate-200/60 rounded-3xl p-5 mb-6 bg-slate-50/50 space-y-4 text-xs font-display"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* 1. Cabin Class */}
                        <div>
                          <label className="font-bold text-slate-700 block mb-2">{language === 'en' ? "Cabin Class" : "ระดับชั้นเที่ยวบิน"}</label>
                          <div className="flex gap-1 bg-white p-1 rounded-2xl border border-slate-200/50">
                            {(["all", "economy", "business"] as const).map((cls) => (
                              <button
                                key={cls}
                                type="button"
                                onClick={() => setSelectedClass(cls)}
                                className={`flex-1 py-1.5 text-[10px] font-bold rounded-xl transition-all cursor-pointer capitalize ${
                                  selectedClass === cls 
                                    ? "bg-sky-600 text-white" 
                                    : "text-slate-500 hover:text-slate-800"
                                }`}
                              >
                                {cls === "all" ? (language === 'en' ? "All" : "ทั้งหมด") :
                                 cls === "economy" ? (language === 'en' ? "Economy" : "ประหยัด") :
                                 (language === 'en' ? "Business" : "ธุรกิจ")}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* 2. Time of Day */}
                        <div>
                          <label className="font-bold text-slate-700 block mb-2">{language === 'en' ? "Departure Time" : "เวลาออกเดินทาง"}</label>
                          <div className="flex gap-1.5 flex-wrap">
                            {[
                              { id: "morning", label: language === 'en' ? "🌅 Morning" : "🌅 เช้า" },
                              { id: "afternoon", label: language === 'en' ? "☀️ Afternoon" : "☀️ บ่าย" },
                              { id: "evening", label: language === 'en' ? "🌙 Evening" : "🌙 เย็น" }
                            ].map((t) => {
                              const isChecked = selectedTimeOfDay.includes(t.id);
                              return (
                                <button
                                  key={t.id}
                                  type="button"
                                  onClick={() => {
                                    if (isChecked) {
                                      setSelectedTimeOfDay(selectedTimeOfDay.filter(x => x !== t.id));
                                    } else {
                                      setSelectedTimeOfDay([...selectedTimeOfDay, t.id]);
                                    }
                                  }}
                                  className={`px-3 py-1.5 rounded-full font-bold text-[10px] border transition-all cursor-pointer ${
                                    isChecked 
                                      ? "bg-sky-50 text-sky-700 border-sky-200" 
                                      : "bg-white text-slate-500 border-slate-200/50 hover:bg-slate-50"
                                  }`}
                                >
                                  {t.label}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* 3. Airlines */}
                        <div>
                          <label className="font-bold text-slate-700 block mb-2">{language === 'en' ? "Airlines" : "สายการบิน"}</label>
                          <div className="flex gap-1.5 flex-wrap">
                            {mockAirlines.map((airline) => {
                              const isChecked = selectedAirlines.includes(airline.code);
                              return (
                                <button
                                  key={airline.code}
                                  type="button"
                                  onClick={() => {
                                    if (isChecked) {
                                      setSelectedAirlines(selectedAirlines.filter(x => x !== airline.code));
                                    } else {
                                      setSelectedAirlines([...selectedAirlines, airline.code]);
                                    }
                                  }}
                                  className={`px-3 py-1.5 rounded-full font-bold text-[10px] border transition-all cursor-pointer ${
                                    isChecked 
                                      ? "bg-sky-50 text-sky-700 border-sky-200" 
                                      : "bg-white text-slate-500 border-slate-200/50 hover:bg-slate-50"
                                  }`}
                                >
                                  {airline.name}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>

                      {/* 4. Price Slider */}
                      <div className="pt-3 border-t border-slate-200/50">
                        <div className="flex justify-between items-center mb-1 text-xs">
                          <label className="font-bold text-slate-700">{language === 'en' ? "Max Price per person" : "ราคาต่อคนสูงสุด"}</label>
                          <span className="font-black text-sky-700">฿{maxPrice.toLocaleString()}</span>
                        </div>
                        <input
                          type="range"
                          min={700}
                          max={2500}
                          step={50}
                          value={maxPrice}
                          onChange={(e) => setMaxPrice(+e.target.value)}
                          className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-sky-600 focus:outline-none"
                        />
                        <div className="flex justify-between text-[9px] text-slate-400 font-bold mt-1 font-display">
                          <span>฿700</span>
                          <span>฿1,600</span>
                          <span>฿2,500</span>
                        </div>
                      </div>

                      {/* Clear Button */}
                      {(selectedClass !== "all" || selectedTimeOfDay.length > 0 || selectedAirlines.length > 0 || maxPrice < 2500) && (
                        <div className="flex justify-end pt-1">
                          <button
                            type="button"
                            onClick={() => {
                              setMaxPrice(2500);
                              setSelectedClass("all");
                              setSelectedTimeOfDay([]);
                              setSelectedAirlines([]);
                            }}
                            className="text-[10px] font-bold text-rose-500 hover:text-rose-700 underline cursor-pointer"
                          >
                            {language === 'en' ? "Clear All Filters" : "ล้างตัวกรองทั้งหมด"}
                          </button>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Flight List */}
                <div className="space-y-4">
                  {getMockFlights(isReturnSelection).length === 0 ? (
                    <div className="text-center py-12 px-6 border border-dashed border-slate-200 rounded-3xl bg-slate-50/50 animate-fadeIn select-none">
                      <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400 mb-3">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="8" y1="12" x2="16" y2="12" /></svg>
                      </div>
                      <h4 className="font-bold text-slate-700 text-sm font-display">{language === 'en' ? "No Flights Found" : "ไม่พบเที่ยวบินที่ระบุ"}</h4>
                      <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto font-display">
                        {language === 'en' 
                          ? "Try expanding your budget, changing cabin class, or clearing all filters." 
                          : "ลองขยายงบประมาณ เปลี่ยนระดับเที่ยวบิน หรือล้างค่าตัวกรองของคุณ"}
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          setMaxPrice(2500);
                          setSelectedClass("all");
                          setSelectedTimeOfDay([]);
                          setSelectedAirlines([]);
                        }}
                        className="mt-4 px-4 py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs rounded-full shadow-sm cursor-pointer font-display"
                      >
                        {language === 'en' ? "Clear All Filters" : "ล้างตัวกรองทั้งหมด"}
                      </button>
                    </div>
                  ) : (
                    getMockFlights(isReturnSelection).map((flight, idx) => {
                      const isExpanded = expandedDetailsIndex === idx;
                      const fromCode = (isReturnSelection ? form.to : form.from).match(/\(([A-Z]{3})\)/)?.[1] || "DMK";
                      const toCode = (isReturnSelection ? form.from : form.to).match(/\(([A-Z]{3})\)/)?.[1] || "CNX";

                      return (
                        <div key={flight.id} className="border border-slate-200/60 rounded-3xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
                          <div className="grid md:grid-cols-4 items-center">
                            
                            {/* Flight main details */}
                            <div className="md:col-span-3 p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                              {/* Airline info */}
                              <div className="flex items-center gap-3 min-w-[150px]">
                                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-white font-extrabold text-xs shadow-sm ${flight.airline.logoBg}`}>
                                  {flight.airline.code}
                                </div>
                                <div>
                                  <h4 className="font-bold text-slate-800 text-sm leading-tight font-display">{flight.airline.name}</h4>
                                  <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                                    <span className="text-[10px] text-amber-500 font-bold font-display">★ {flight.airline.rating}</span>
                                    <span className="text-[10px] text-slate-400 font-display">· {flight.flightNo}</span>
                                    {flight.class === "business" ? (
                                      <span className="inline-block bg-purple-50 text-purple-700 font-bold text-[8px] px-1.5 py-0.5 rounded border border-purple-100 select-none uppercase tracking-wider font-display">
                                        Business
                                      </span>
                                    ) : (
                                      <span className="inline-block bg-slate-50 text-slate-500 font-bold text-[8px] px-1.5 py-0.5 rounded border border-slate-100 select-none uppercase tracking-wider font-display">
                                        Economy
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>

                              {/* Timeline */}
                              <div className="flex items-center gap-4 flex-1 w-full md:w-auto md:justify-center">
                                <div className="text-left">
                                  <span className="font-black text-slate-800 text-base block font-display">{flight.departTime}</span>
                                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-display">{fromCode}</span>
                                </div>
                                
                                <div className="flex-1 max-w-[120px] flex flex-col items-center relative my-2">
                                  <span className="text-[9px] text-slate-400 font-bold block mb-1 font-display">{flight.duration}</span>
                                  <div className="w-full flex items-center relative">
                                    <div className="w-1.5 h-1.5 rounded-full bg-slate-200 border border-slate-300"></div>
                                    <div className="flex-1 border-t border-slate-200 border-dashed"></div>
                                    <Plane className="w-3.5 h-3.5 text-sky-600/70 rotate-45 transform shrink-0" />
                                    <div className="flex-1 border-t border-slate-200 border-dashed"></div>
                                    <div className="w-1.5 h-1.5 rounded-full bg-slate-200 border border-slate-300"></div>
                                  </div>
                                  <span className="text-[9px] text-slate-400 font-bold block mt-1 uppercase tracking-widest font-display">Non-stop</span>
                                </div>

                                <div className="text-right">
                                  <span className="font-black text-slate-800 text-base block font-display">{flight.arrivalTime}</span>
                                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-display">{toCode}</span>
                                </div>
                              </div>

                              {/* Details toggle */}
                              <button
                                type="button"
                                onClick={() => setExpandedDetailsIndex(isExpanded ? null : idx)}
                                className="flex items-center gap-1 text-[11px] font-extrabold text-sky-700 hover:text-sky-800 py-1 px-3 bg-sky-50 rounded-full cursor-pointer hover:bg-sky-100 transition-colors font-display"
                              >
                                {language === 'en' ? "View Details" : "ดูรายละเอียด"}
                                {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                              </button>
                            </div>

                            {/* Pricing & select action box */}
                            <div className="p-6 border-t md:border-t-0 md:border-l border-slate-100 bg-slate-50/50 flex flex-col items-center justify-center text-center self-stretch min-h-[140px]">
                              {flight.discount !== "None" && (
                                <span className="inline-block bg-rose-50 text-rose-600 font-bold text-[9px] px-2 py-0.5 rounded-full border border-rose-100 mb-1 animate-pulse font-display">
                                  {flight.discount}
                                </span>
                              )}
                              <div className="mb-3">
                                <span className="text-[10px] text-slate-400 uppercase font-bold block font-display">per passenger</span>
                                <span className="font-display font-black text-2xl text-slate-800">฿{flight.price.toLocaleString()}</span>
                              </div>
                              <button
                                type="button"
                                onClick={() => {
                                  if (isReturnSelection) {
                                    setSelectedInboundFlight(flight);
                                    setBookingStep("passenger_details");
                                  } else {
                                    setSelectedOutboundFlight(flight);
                                    if (tripType === "round") {
                                      setIsReturnSelection(true);
                                      setExpandedDetailsIndex(null);
                                      document.getElementById("booking")?.scrollIntoView({ behavior: "smooth", block: "start" });
                                    } else {
                                      setBookingStep("passenger_details");
                                    }
                                  }
                                }}
                                className="w-full max-w-[130px] py-2.5 rounded-full bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-sm active:scale-95 transition-all cursor-pointer font-display"
                              >
                                {language === 'en' ? "Select Flight" : "เลือกไฟลท์นี้"}
                              </button>
                            </div>
                          </div>

                          {/* Expandable amenities section */}
                          {isExpanded && (
                            <div className="border-t border-slate-100 p-6 bg-slate-50/30 text-left text-xs text-slate-600 space-y-4 animate-fadeIn">
                              <div className="flex gap-4 border-b border-slate-100 pb-3 mb-2 font-bold text-slate-800 font-display">
                                <span className="border-b-2 border-sky-600 pb-3 -mb-3.5">DETAILS</span>
                                <span className="text-slate-400">FARES (ECONOMY)</span>
                              </div>
                              
                              <div className="grid md:grid-cols-2 gap-4">
                                <div className="flex items-start gap-2.5">
                                  <Luggage className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                                  <div>
                                    <h5 className="font-bold text-slate-800 font-display">Baggage Allowance</h5>
                                    <p className="text-[11px] text-slate-400 mt-0.5 font-display">Checked bag: 20 kgs / Cabin bag: 7 kgs</p>
                                  </div>
                                </div>
                                
                                <div className="flex items-start gap-2.5">
                                  <Clock className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                                  <div>
                                    <h5 className="font-bold text-slate-800 font-display">Flight Status</h5>
                                    <p className="text-[11px] text-slate-400 mt-0.5 font-display">Operates on time. Non-refundable ticket reservation.</p>
                                  </div>
                                </div>
                              </div>

                              {/* Amenities row */}
                              <div className="border-t border-slate-100 pt-4 flex flex-wrap gap-x-6 gap-y-2 text-slate-500 text-[11px] font-medium select-none font-display">
                                <div className="flex items-center gap-1.5">
                                  <div className="w-4 h-4 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center text-[9px]"><Check className="w-3 h-3 stroke-[2.5]" /></div>
                                  <span>31 in (80 cm) Seat Pitch</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                  <div className="w-4 h-4 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center text-[9px]"><Check className="w-3 h-3 stroke-[2.5]" /></div>
                                  <div className="flex items-center gap-1"><Wifi className="w-3.5 h-3.5" /> <span>Wifi Available</span></div>
                                </div>
                                <div className="flex items-center gap-1.5">
                                  <div className="w-4 h-4 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center text-[9px]"><Check className="w-3 h-3 stroke-[2.5]" /></div>
                                  <div className="flex items-center gap-1"><Coffee className="w-3.5 h-3.5" /> <span>In-flight Food</span></div>
                                </div>
                                <div className="flex items-center gap-1.5">
                                  <div className="w-4 h-4 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center text-[9px]"><Check className="w-3 h-3 stroke-[2.5]" /></div>
                                  <div className="flex items-center gap-1"><Zap className="w-3.5 h-3.5" /> <span>USB Power Port</span></div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}

            {bookingStep === "passenger_details" && (
              <div className="text-slate-800 text-left">
                {/* Back button */}
                <button
                  onClick={() => {
                    if (tripType === "round") {
                      setIsReturnSelection(true);
                      setBookingStep("select_flight");
                    } else {
                      setBookingStep("select_flight");
                    }
                  }}
                  className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-sky-700 transition-colors mb-6 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  {language === 'en' ? "Back to Flight Selection" : "ย้อนกลับไปหน้าเลือกเที่ยวบิน"}
                </button>

                {/* Selected flights summary */}
                <div className="bg-sky-50/50 border border-sky-100 rounded-3xl p-5 mb-6">
                  <h4 className="font-display font-black text-sm text-sky-950 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <Ticket className="w-4 h-4" />
                    {language === 'en' ? "Flight Selection Summary" : "สรุปเที่ยวบินที่เลือก"}
                  </h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between items-center py-1.5 border-b border-sky-100/50">
                      <span className="text-slate-500 font-display">{language === 'en' ? "Outbound Flight" : "เที่ยวบินขาไป"}:</span>
                      <span className="font-bold text-sky-950 font-display">{selectedOutboundFlight?.airline.name} ({selectedOutboundFlight?.flightNo}) · {selectedOutboundFlight?.departTime}</span>
                    </div>
                    {tripType === "round" && selectedInboundFlight && (
                      <div className="flex justify-between items-center py-1.5 border-b border-sky-100/50 font-display">
                        <span className="text-slate-500">{language === 'en' ? "Inbound Flight" : "เที่ยวบินขากลับ"}:</span>
                        <span className="font-bold text-sky-950">{selectedInboundFlight?.airline.name} ({selectedInboundFlight?.flightNo}) · {selectedInboundFlight?.departTime}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center pt-2 text-sm font-display">
                      <span className="text-slate-500 font-medium">{language === 'en' ? "Fare per person" : "ราคาต่อท่าน"}:</span>
                      <span className="font-extrabold text-sky-950">฿{((selectedOutboundFlight?.price || 0) + (selectedInboundFlight?.price || 0)).toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <h3 className="font-display text-xl font-bold mb-4 text-slate-900 border-b border-slate-100 pb-3">
                  {t('flight.modal_passenger')}
                </h3>
                
                <form onSubmit={handlePassengerSubmit} className="grid md:grid-cols-2 gap-4">
                  <Field label={t('flight.passenger_name')} htmlFor="passengerName" required>
                    <input
                      id="passengerName"
                      name="passengerName"
                      required
                      value={form.passengerName}
                      onChange={(e) => setForm({ ...form, passengerName: e.target.value })}
                      className="w-full bg-transparent outline-none font-bold text-slate-800 text-sm text-foreground font-display"
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
                      className="w-full bg-transparent outline-none font-bold text-slate-800 text-sm text-foreground font-display"
                      placeholder="you@email.com"
                    />
                  </Field>
                  <Field label={t('flight.phone')} htmlFor="phone">
                    <input
                      id="phone"
                      name="phone"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="w-full bg-transparent outline-none font-bold text-slate-800 text-sm text-foreground font-display"
                      placeholder="08X-XXX-XXXX"
                    />
                  </Field>
                  <Field 
                    label={t('flight.modal_seat') || "Seat"} 
                    onClick={() => setSeatMapOpen(true)}
                  >
                    <div className="py-0.5 select-none font-display">
                      <span className="font-bold text-slate-800 text-sm truncate block">
                        {form.seat || (language === 'en' ? "Not selected" : "ยังไม่ได้เลือก")}
                      </span>
                    </div>
                  </Field>

                  <div className="md:col-span-2 flex justify-end pt-4 border-t border-slate-100 mt-4">
                    <button
                      type="submit"
                      id="submit-flight-booking"
                      className="px-10 py-4 rounded-full bg-gradient-to-r from-sky-600 to-indigo-600 text-white font-display font-bold text-sm shadow-md hover:from-sky-500 hover:to-indigo-500 hover:shadow-lg active:scale-98 transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <Sparkles className="w-4 h-4 text-sky-200" />
                      {t('flight.submit')}
                    </button>
                  </div>
                </form>
              </div>
            )}
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
          <div id="promo-grid" className="grid md:grid-cols-3 gap-6">
            {[
              { t: `${t("flight.city_bangkok")} → ${t("flight.card_chiangmai")}`, from: "กรุงเทพฯ (DMK)", to: "เชียงใหม่ (CNX)", p: "690", img: promoChiangmai, label: t('flight.card_chiangmai'), desc: t('flight.card_chiangmai_desc') },
              { t: `${t("flight.city_bangkok")} → ${t("flight.card_phuket")}`, from: "กรุงเทพฯ (DMK)", to: "ภูเก็ต (HKT)", p: "890", img: promoPhuket, label: t('flight.card_phuket'), desc: t('flight.card_phuket_desc') },
              { t: `${t("flight.city_bangkok")} → ${t("flight.card_hatyai")}`, from: "กรุงเทพฯ (DMK)", to: "หาดใหญ่ (HDY)", p: "990", img: promoHatyai, label: t('flight.card_hatyai'), desc: t('flight.card_hatyai_desc') },
            ].map((x, index) => {
              const isActive = activePromoIndex === index;
              return (
                <motion.article
                  key={x.t}
                  className="group relative overflow-hidden rounded-3xl aspect-[4/5] cursor-pointer border border-slate-200/50 shadow-md"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  whileHover={{ y: -6, scale: 1.05 }}
                  animate={isActive ? { y: -6, scale: 1.05 } : { y: 0, scale: 1 }}
                  onClick={() => {
                    if (isActive) {
                      handleSelectPromo(x.from, x.to);
                    } else {
                      setActivePromoIndex(index);
                    }
                  }}
                >
                  <SkeletonImage
                    src={x.img}
                    alt={x.label}
                    wrapperClassName="absolute inset-0"
                    loading="lazy"
                    className={`transition duration-700 ${isActive ? "scale-105" : "group-hover:scale-105"}`}
                  />
                  {/* Full card dark overlay on hover / active */}
                  <div className={`absolute inset-0 bg-black/60 transition-opacity duration-500 z-10 ${
                    isActive ? "opacity-80" : "opacity-0 group-hover:opacity-80"
                  }`} />
 
                  {/* Expanding gradient overlay rising from the bottom */}
                  <div 
                    className={`absolute bottom-0 left-0 right-0 transition-all duration-500 ease-out z-10 ${
                      isActive ? "h-[85%] opacity-80" : "h-[40%] opacity-70 group-hover:h-[85%] group-hover:opacity-80"
                    }`}
                    style={{
                      background: 'linear-gradient(to top, #000000 0%, rgba(0,0,0,0.98) 45%, rgba(0,0,0,0.8) 75%, rgba(0,0,0,0) 100%)'
                    }}
                  />
 
                  <div className="absolute inset-0 p-6 flex flex-col justify-end text-white z-20 text-left">
                    <p className="text-[10px] font-bold tracking-widest uppercase opacity-75">{x.label}</p>
                    <p className="mt-1.5 font-display text-xl font-bold tracking-tight">{x.t}</p>
                    
                    <div className={`transition-all duration-500 ease-out overflow-hidden ${
                      isActive 
                        ? "max-h-48 opacity-100 translate-y-0" 
                        : "max-h-0 opacity-0 translate-y-4 group-hover:max-h-48 group-hover:opacity-100 group-hover:translate-y-0"
                    }`}>
                      <p className={`mt-2 text-xs text-white/70 leading-relaxed pr-1 ${
                        isActive ? "line-clamp-none overflow-y-auto max-h-20" : "line-clamp-2 group-hover:line-clamp-none max-h-20 group-hover:overflow-y-auto"
                      }`} style={{ scrollbarWidth: 'thin' }}>{x.desc}</p>
                      <div className="mt-4 flex items-end justify-between">
                        <div>
                          <p className="text-[10px] opacity-75">{t('flight.starting_price')}</p>
                          <p className="font-display text-2xl font-black text-white">฿{x.p}</p>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelectPromo(x.from, x.to);
                          }}
                          className={`rounded-full bg-white/20 backdrop-blur-md px-4 py-2 text-xs font-bold text-white border border-white/10 transition-colors cursor-pointer ${
                            isActive ? "bg-white/30 hover:bg-white/45" : "group-hover:bg-white/30 group-hover:hover:bg-white/45"
                          }`}
                        >
                          {t('flight.details') || "Book Now"}
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>
        </section>


        {/* SPECIAL SERVICES */}
        <section className="bg-gradient-to-b from-sky-50/40 to-indigo-50/40 border-y border-slate-100 py-20 relative z-10 text-left">
          <div className="mx-auto max-w-5xl px-6">
            <div className="text-center max-w-xl mx-auto mb-16">
              <h2 className="font-display text-3xl font-extrabold text-slate-900 tracking-tight">{t('flight.about_heading')}</h2>
              <p className="text-sm text-slate-500 mt-3">{t('flight.about_subheading')}</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="group bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/40 shadow-sm hover:shadow-md hover:border-sky-500/20 transition-all duration-300">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-sky-50 text-sky-600 mb-4 border border-sky-100/50 group-hover:scale-110 group-hover:bg-sky-500 group-hover:text-white transition-all duration-300">
                  <Luggage className="w-6 h-6" />
                </div>
                <h4 className="font-display font-bold text-slate-900 mb-2">{t('flight.service1_title')}</h4>
                <p className="text-xs text-slate-500 leading-relaxed">{t('flight.service1_desc')}</p>
              </div>
              <div className="group bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/40 shadow-sm hover:shadow-md hover:border-sky-500/20 transition-all duration-300">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-amber-50 text-amber-600 mb-4 border border-amber-100/50 group-hover:scale-110 group-hover:bg-amber-500 group-hover:text-white transition-all duration-300">
                  <Coffee className="w-6 h-6" />
                </div>
                <h4 className="font-display font-bold text-slate-900 mb-2">{t('flight.service2_title')}</h4>
                <p className="text-xs text-slate-500 leading-relaxed">{t('flight.service2_desc')}</p>
              </div>
              <div className="group bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/40 shadow-sm hover:shadow-md hover:border-sky-500/20 transition-all duration-300">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-indigo-50 text-indigo-600 mb-4 border border-indigo-100/50 group-hover:scale-110 group-hover:bg-indigo-500 group-hover:text-white transition-all duration-300">
                  <Mic className="w-6 h-6" />
                </div>
                <h4 className="font-display font-bold text-slate-900 mb-2">{t('flight.service3_title')}</h4>
                <p className="text-xs text-slate-500 leading-relaxed">{t('flight.service3_desc')}</p>
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
  const flightNumber = booking.outboundFlightNo || `BTN${(passengerHash % 899) + 100}`;
  const seatRow = (passengerHash % 30) + 1;
  const seatLetter = ['A', 'B', 'C', 'D', 'E', 'F'][passengerHash % 6];
  const seatNumber = booking.seat || `${seatRow}${seatLetter}`;
  const flightClass = booking.class === "business" ? "Business" : "Economy";

  const basePrice = booking.pricePerPax || (booking.to.includes("เชียงใหม่") || booking.to.includes("ภูเก็ต") ? 890 : 990);
  const totalPrice = basePrice * booking.passengers;
  
  // Calculate discount from promo codes
  const promoUpper = (booking.promoCode || "").toUpperCase();
  const discountPercent = promoUpper === "PROMO2026" ? 0.2 : promoUpper === "BOTNOI" ? 0.15 : 0;
  const discountAmount = totalPrice * discountPercent;
  const finalPrice = totalPrice - discountAmount;

  const getArrivalTime = (departTime: string) => {
    if (!departTime) return "11:45 AM";
    const [h, m] = departTime.split(':').map(Number);
    let newH = h + 1;
    let newM = m + 15;
    if (newM >= 60) {
      newH += 1;
      newM -= 60;
    }
    const suffix = newH >= 12 ? 'PM' : 'AM';
    const displayH = newH > 12 ? newH - 12 : newH;
    return `${displayH.toString().padStart(2, '0')}:${newM.toString().padStart(2, '0')} ${suffix}`;
  };

  const outboundDepart = booking.outboundTime || "07:30";
  const outboundArrive = getArrivalTime(outboundDepart);
  const inboundDepart = booking.inboundTime || "09:00";
  const inboundArrive = getArrivalTime(inboundDepart);

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto overflow-x-hidden rounded-3xl sm:rounded-3xl border-none p-0 sm:max-w-md bg-[#eef6fc] text-slate-800 shadow-2xl font-display">
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

          {/* Route Display */}
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
              <div className="text-[10px] text-slate-500 mt-0.5">{outboundDepart}</div>
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
                {booking.tripType === "round" && booking.returnDate ? inboundDepart : outboundArrive}
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
              <p className="font-bold text-sm text-slate-800">{flightClass} / Confirmed</p>
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
              <div className="flex flex-col">
                <div className="flex items-baseline gap-1">
                  <span className="text-xl font-black text-sky-950">฿{finalPrice.toLocaleString()}</span>
                  <span className="text-[9px] text-slate-400">/{booking.passengers} pax</span>
                </div>
                {discountAmount > 0 && (
                  <span className="text-[9px] text-emerald-600 font-bold block mt-0.5">
                    (Saved ฿{discountAmount.toLocaleString()} via {promoUpper})
                  </span>
                )}
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