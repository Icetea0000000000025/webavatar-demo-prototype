import React, { useState, useEffect, useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence, useScroll, useTransform, useInView } from "framer-motion";
import { useTranslation } from "@/lib/LanguageContext";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  Plane, ChevronDown, Check,
  ArrowLeft, Ticket, ChevronRight, Home,
  ArrowLeftRight, Search, X
} from "lucide-react";
import { saveBooking, getBookings, getLockedSeats, type Booking } from "@/lib/bookings";
import { toast, Toaster } from "sonner";
import PageSkeleton from "@/components/PageSkeleton";
import botnoiAirLogo from "../assets/BOTNOI-AIR-logo.png";
import flightHeroRunway from "../assets/flight-hero-runway.jpg";
import promoChiangmai from "../assets/promo-chiangmai.jpg";
import promoPhuket from "../assets/promo-phuket.jpg";
import promoHatyai from "../assets/promo-hatyai.jpg";

interface TypewriterHeadingProps {
  text: string;
  className?: string;
}

const TypewriterHeading: React.FC<TypewriterHeadingProps> = ({ text, className }) => {
  const [displayText, setDisplayText] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const containerRef = useRef<HTMLHeadingElement>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.3 });

  useEffect(() => {
    if (!isInView) return;

    let i = 0;
    setDisplayText("");
    setIsTyping(true);
    let doneTimer: ReturnType<typeof setTimeout> | undefined;

    const timer = setInterval(() => {
      if (i < text.length) {
        setDisplayText(text.slice(0, i + 1));
        i++;
      } else {
        clearInterval(timer);
        doneTimer = setTimeout(() => {
          setIsTyping(false);
        }, 1200);
      }
    }, 45);

    return () => {
      clearInterval(timer);
      if (doneTimer) clearTimeout(doneTimer);
    };
  }, [text, isInView]);

  return (
    <h2 ref={containerRef} className={className}>
      <span>{displayText}</span>
      <AnimatePresence>
        {isTyping && (
          <motion.span
            className="inline-block ml-0.5 text-primary font-normal select-none"
            initial={{ opacity: 1 }}
            animate={{ opacity: [1, 0] }}
            exit={{ opacity: 0, transition: { duration: 0.2 } }}
            transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
          >
            |
          </motion.span>
        )}
      </AnimatePresence>
    </h2>
  );
};
import {
  type CityMeta,
  CITIES_CONFIG,
  CITIES,
  getCityDetails,
  getCityFullName,
  getPromoDiscountRate,
} from "@/lib/cities";

export {
  type CityMeta,
  CITIES_CONFIG,
  CITIES,
  getCityDetails,
  getCityFullName,
  getPromoDiscountRate,
};

export function parseDateForCard(dateStr: string, fallbackDays = 0, language: string = 'en') {
  let target = dateStr;
  if (!target) {
    const d = new Date();
    d.setDate(d.getDate() + fallbackDays);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    target = `${y}-${m}-${day}`;
  }
  const d = new Date(target + "T00:00:00");
  if (isNaN(d.getTime())) {
    return {
      day: "02",
      month: language === 'th' ? "มกราคม" : "January",
      weekday: language === 'th' ? "วันศุกร์" : "Friday",
      year: "2026"
    };
  }
  const day = String(d.getDate()).padStart(2, "0");
  const localeMap: Record<string, string> = {
    th: 'th-TH',
    zh: 'zh-CN',
    ja: 'ja-JP',
    ko: 'ko-KR',
    es: 'es-ES',
    fr: 'fr-FR',
  };
  const locale = localeMap[language] || 'en-US';
  const month = d.toLocaleString(locale, { month: "long" });
  const weekday = d.toLocaleString(locale, { weekday: "long" });
  const year = String(d.getFullYear());
  return { day, month, weekday, year };
}

export function getCityLabelForLang(city: string, language: string) {
  if (language === 'th') return city;
  const multiMap: Record<string, Record<string, string>> = {
    "zh": {
      "กรุงเทพฯ (DMK)": "曼谷 (DMK)",
      "กรุงเทพฯ (BKK)": "曼谷 (BKK)",
      "เชียงใหม่ (CNX)": "清迈 (CNX)",
      "ภูเก็ต (HKT)": "普吉岛 (HKT)",
      "หาดใหญ่ (HDY)": "合艾 (HDY)",
      "กระบี่ (KBV)": "甲米 (KBV)",
      "อุดรธานี (UTH)": "乌隆他尼 (UTH)",
      "อุบลราชธานี (UBP)": "乌汶 (UBP)",
      "ขอนแก่น (KKC)": "孔敬 (KKC)",
      "สุราษฎร์ธานี (URT)": "万仑 (URT)",
      "นครศรีธรรมราช (NST)": "洛坤 (NST)",
      "เชียงราย (CEI)": "清莱 (CEI)",
    },
    "ja": {
      "กรุงเทพฯ (DMK)": "バンコク (DMK)",
      "กรุงเทพฯ (BKK)": "バンコク (BKK)",
      "เชียงใหม่ (CNX)": "チェンマイ (CNX)",
      "ภูเก็ต (HKT)": "プーケット (HKT)",
      "หาดใหญ่ (HDY)": "ハートヤイ (HDY)",
      "กระบี่ (KBV)": "クラビ (KBV)",
      "อุดรธานี (UTH)": "ウドーンターニー (UTH)",
      "อุบลราชธานี (UBP)": "ウボンラーチャターニー (UBP)",
      "ขอนแก่น (KKC)": "コンケン (KKC)",
      "สุราษฎร์ธานี (URT)": "スラートターニー (URT)",
      "นครศรีธรรมราช (NST)": "ナコーンシータマラート (NST)",
      "เชียงราย (CEI)": "チェンライ (CEI)",
    },
    "ko": {
      "กรุงเทพฯ (DMK)": "방콕 (DMK)",
      "กรุงเทพฯ (BKK)": "방콕 (BKK)",
      "เชียงใหม่ (CNX)": "치앙마이 (CNX)",
      "ภูเก็ต (HKT)": "푸켓 (HKT)",
      "หาดใหญ่ (HDY)": "핫야이 (HDY)",
      "กระบี่ (KBV)": "끄라비 (KBV)",
      "อุดรธานี (UTH)": "우돈타니 (UTH)",
      "อุบลราชธานี (UBP)": "우본라차타니 (UBP)",
      "ขอนแก่น (KKC)": "콘แก่น (KKC)",
      "สุราษฎร์ธานี (URT)": "수랏타니 (URT)",
      "นครศรีธรรมราช (NST)": "나콘시탐마랏 (NST)",
      "เชียงราย (CEI)": "치앙라이 (CEI)",
    }
  };
  if (multiMap[language] && multiMap[language][city]) {
    return multiMap[language][city];
  }
  const enMap: Record<string, string> = {
    "กรุงเทพฯ (DMK)": "Bangkok (DMK)",
    "กรุงเทพฯ (BKK)": "Bangkok (BKK)",
    "เชียงใหม่ (CNX)": "Chiang Mai (CNX)",
    "ภูเก็ต (HKT)": "Phuket (HKT)",
    "หาดใหญ่ (HDY)": "Hat Yai (HDY)",
    "กระบี่ (KBV)": "Krabi (KBV)",
    "อุดรธานี (UTH)": "Udon Thani (UTH)",
    "อุบลราชธานี (UBP)": "Ubon Ratchathani (UBP)",
    "ขอนแก่น (KKC)": "Khon Kaen (KKC)",
    "สุราษฎร์ธานี (URT)": "Surat Thani (URT)",
    "นครศรีธรรมราช (NST)": "Nakhon Si Thammarat (NST)",
    "เชียงราย (CEI)": "Chiang Rai (CEI)",
  };
  return enMap[city] || city;
}

export function getTodayString() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getNextDayString(dateStr: string) {
  if (!dateStr) return '';
  const date = new Date(dateStr + 'T00:00:00');
  date.setDate(date.getDate() + 1);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}


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
  const today = useMemo(() => getTodayString(), []);
  const { scrollY } = useScroll();
  const heroParallax = useTransform(scrollY, [0, 500], [0, 150]);
  const getCityLabel = (city: string) => getCityLabelForLang(city, language);
  const getSameCityErrorText = (lang: string) => {
    switch (lang) {
      case 'th': return 'กรุณาเลือกเมืองต้นทางและปลายทางที่แตกต่างกัน';
      case 'zh': return '出发地和目的地不能相同';
      case 'ja': return '出発地と目的地は異なる都市を選択してください';
      case 'ko': return '출발지와 도착지는 서로 다른 도시를 선택해주세요';
      case 'es': return 'Por favor seleccione ciudades de origen y destino diferentes';
      case 'fr': return 'Veuillez sélectionner des villes d\'origine et de destination différentes';
      default: return 'Please select different origin and destination cities';
    }
  };
  const [isReady, setIsReady] = useState(false);
  const [tripType, setTripType] = useState<"round" | "oneway" | "multicity">("round");
  const [ticketBooking, setTicketBooking] = useState<any | null>(null);
  const [boardingPassOpen, setBoardingPassOpen] = useState(false);
  const [seatMapOpen, setSeatMapOpen] = useState(false);

  const [fareType, setFareType] = useState<"regular" | "student">("regular");
  const [passengerDropdownOpen, setPassengerDropdownOpen] = useState(false);
  const [cabinDropdownOpen, setCabinDropdownOpen] = useState(false);
  const [fromPickerOpen, setFromPickerOpen] = useState(false);
  const [toPickerOpen, setToPickerOpen] = useState(false);

  // Multi-City States
  const [multiCityLegs, setMultiCityLegs] = useState<Array<{ id: string; from: string; to: string; date: string }>>([
    { id: "leg-1", from: "กรุงเทพฯ (DMK)", to: "เชียงใหม่ (CNX)", date: today },
    { id: "leg-2", from: "เชียงใหม่ (CNX)", to: "ภูเก็ต (HKT)", date: getNextDayString(today) },
  ]);
  const [activeLegIndex, setActiveLegIndex] = useState<number>(0);
  const [selectedMultiCityFlights, setSelectedMultiCityFlights] = useState<any[]>([]);
  const [openMultiCityPicker, setOpenMultiCityPicker] = useState<{ legIndex: number; type: "from" | "to" } | null>(null);

  const handleAddLeg = () => {
    if (multiCityLegs.length >= 4) {
      toast.info(language === "th" ? "เพิ่มเที่ยวบินได้สูงสุด 4 เที่ยวบิน" : "Maximum 4 flights allowed");
      return;
    }
    const lastLeg = multiCityLegs[multiCityLegs.length - 1];
    const newFrom = lastLeg.to;
    const remaining = CITIES.filter(c => c !== newFrom);
    const newTo = remaining.includes("กรุงเทพฯ (DMK)") && newFrom !== "กรุงเทพฯ (DMK)"
      ? "กรุงเทพฯ (DMK)"
      : remaining[0] || "เชียงใหม่ (CNX)";
    const newDate = getNextDayString(lastLeg.date || today);

    setMultiCityLegs(prev => [
      ...prev,
      {
        id: `leg-${Date.now()}`,
        from: newFrom,
        to: newTo,
        date: newDate,
      }
    ]);
  };

  const handleRemoveLeg = (idx: number) => {
    if (multiCityLegs.length <= 2) {
      toast.info(language === "th" ? "การเดินทางหลายเมืองต้องมีอย่างน้อย 2 เที่ยวบิน" : "Multi-City requires at least 2 flights");
      return;
    }
    setMultiCityLegs(prev => prev.filter((_, i) => i !== idx));
    setOpenMultiCityPicker(null);
  };

  const handleUpdateLegCity = (legIndex: number, field: "from" | "to", newCity: string) => {
    setMultiCityLegs(prev => {
      const updated = [...prev];
      const oldTo = updated[legIndex].to;
      updated[legIndex] = { ...updated[legIndex], [field]: newCity };
      if (field === "to" && legIndex + 1 < updated.length && updated[legIndex + 1].from === oldTo) {
        updated[legIndex + 1] = { ...updated[legIndex + 1], from: newCity };
      }
      return updated;
    });
    setOpenMultiCityPicker(null);
  };

  const handleSwapLegCities = (legIndex: number) => {
    setMultiCityLegs(prev => {
      const updated = [...prev];
      const cur = updated[legIndex];
      updated[legIndex] = { ...cur, from: cur.to, to: cur.from };
      return updated;
    });
  };

  const handleUpdateLegDate = (legIndex: number, newDate: string) => {
    setMultiCityLegs(prev => {
      const updated = [...prev];
      updated[legIndex] = { ...updated[legIndex], date: newDate };
      for (let j = legIndex + 1; j < updated.length; j++) {
        if (updated[j].date < updated[j - 1].date) {
          updated[j] = { ...updated[j], date: updated[j - 1].date };
        }
      }
      return updated;
    });
  };

  const departDateInputRef = useRef<HTMLInputElement>(null);
  const returnDateInputRef = useRef<HTMLInputElement>(null);
  const passengerNameInputRef = useRef<HTMLInputElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);
  const phoneInputRef = useRef<HTMLInputElement>(null);
  const seatFieldRef = useRef<HTMLDivElement>(null);
  const [passengerFormSubmitted, setPassengerFormSubmitted] = useState(false);

  const openDatePicker = (ref: React.RefObject<HTMLInputElement | null>) => {
    if (!ref.current) return;
    try {
      if (typeof ref.current.showPicker === "function") {
        ref.current.showPicker();
        return;
      }
    } catch (e) {}
    try {
      ref.current.focus();
      ref.current.click();
    } catch (e) {}
  };

  const [form, setForm] = useState<BookingForm>({
    from: "กรุงเทพฯ (DMK)",
    to: "เชียงใหม่ (CNX)",
    departDate: today,
    returnDate: getNextDayString(today),
    passengers: 1,
    promoCode: "",
    passengerName: "",
    email: "",
    phone: "",
    seat: "",
  });

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

  const mockAirlines = useMemo(() => [
    { name: language === 'th' ? "บอทน้อยแอร์" : "Botnoi Air", code: "BTN", logoBg: "bg-sky-600", rating: 4.8 },
    { name: language === 'th' ? "การบินไทย" : "Thai Airways", code: "THA", logoBg: "bg-purple-800", rating: 4.7 },
    { name: language === 'th' ? "บางกอกแอร์เวย์ส" : "Bangkok Airways", code: "BKP", logoBg: "bg-sky-400", rating: 4.6 }
  ], [language]);

  const getMockFlights = (isReturn: boolean, customFrom?: string, customTo?: string) => {
    const toCity = customTo || (isReturn ? form.from : form.to);
    const fromCity = customFrom || (isReturn ? form.to : form.from);

    const isPremiumRoute = toCity.includes("ภูเก็ต") || toCity.includes("หาดใหญ่");
    const basePrice = isPremiumRoute ? 990 : 890;

    const list = [
      {
        id: isReturn ? "ret-1" : customFrom ? `mc-${fromCity}-${toCity}-1` : "out-1",
        airline: mockAirlines[0],
        flightNo: `${mockAirlines[0].code}${isReturn ? "9" : "2"}01`,
        departTime: isReturn ? "07:00" : "06:15",
        arrivalTime: isReturn ? "08:15" : "07:30",
        duration: "1h 15m",
        price: basePrice,
        class: "economy",
        aircraft: { model: "Airbus A320-200", tailNumber: "HS-BNA", type: "Narrow-body Jet" },
        timeOfDay: "morning",
        type: "cheapest",
        discount: language === 'th' ? 'ลด 15%' : `15% ${t('flight.off_tag')}`
      },
      {
        id: isReturn ? "ret-2" : customFrom ? `mc-${fromCity}-${toCity}-2` : "out-2",
        airline: mockAirlines[1],
        flightNo: `${mockAirlines[1].code}${isReturn ? "8" : "3"}12`,
        departTime: isReturn ? "10:30" : "09:45",
        arrivalTime: isReturn ? "11:45" : "11:00",
        duration: "1h 15m",
        price: Math.round(basePrice * 1.15),
        class: "economy",
        aircraft: { model: "Boeing 777-300ER", tailNumber: "HS-TGA", type: "Wide-body Jet" },
        timeOfDay: "morning",
        type: "best",
        discount: "None"
      },
      {
        id: isReturn ? "ret-3" : customFrom ? `mc-${fromCity}-${toCity}-3` : "out-3",
        airline: mockAirlines[0],
        flightNo: `${mockAirlines[0].code}${isReturn ? "9" : "2"}05`,
        departTime: isReturn ? "13:15" : "13:30",
        arrivalTime: isReturn ? "14:30" : "14:45",
        duration: "1h 15m",
        price: Math.round(basePrice * 0.9), // Promo
        class: "economy",
        aircraft: { model: "Airbus A321neo", tailNumber: "HS-BNB", type: "Narrow-body Jet" },
        timeOfDay: "afternoon",
        type: "cheapest",
        discount: language === 'th' ? 'ลด 20%' : `20% ${t('flight.off_tag')}`
      },
      {
        id: isReturn ? "ret-4" : customFrom ? `mc-${fromCity}-${toCity}-4` : "out-4",
        airline: mockAirlines[2],
        flightNo: `${mockAirlines[2].code}${isReturn ? "7" : "4"}85`,
        departTime: isReturn ? "16:45" : "15:15",
        arrivalTime: isReturn ? "18:00" : "16:30",
        duration: "1h 15m",
        price: Math.round(basePrice * 1.6),
        class: "business",
        aircraft: { model: "Airbus A320", tailNumber: "HS-PGA", type: "Narrow-body Jet" },
        timeOfDay: "afternoon",
        type: "best",
        discount: "None"
      },
      {
        id: isReturn ? "ret-5" : customFrom ? `mc-${fromCity}-${toCity}-5` : "out-5",
        airline: mockAirlines[1],
        flightNo: `${mockAirlines[1].code}${isReturn ? "8" : "3"}25`,
        departTime: isReturn ? "19:30" : "18:45",
        arrivalTime: isReturn ? "20:45" : "20:00",
        duration: "1h 15m",
        price: Math.round(basePrice * 2.2), // Business Premium
        class: "business",
        aircraft: { model: "Boeing 787-9 Dreamliner", tailNumber: "HS-TGB", type: "Wide-body Jet" },
        timeOfDay: "evening",
        type: "quickest",
        discount: "None"
      },
      {
        id: isReturn ? "ret-6" : customFrom ? `mc-${fromCity}-${toCity}-6` : "out-6",
        airline: mockAirlines[2],
        flightNo: `${mockAirlines[2].code}${isReturn ? "7" : "4"}99`,
        departTime: isReturn ? "21:30" : "21:00",
        arrivalTime: isReturn ? "22:45" : "22:15",
        duration: "1h 15m",
        price: Math.round(basePrice * 1.1),
        class: "economy",
        aircraft: { model: "ATR 72-600", tailNumber: "HS-PGB", type: "Regional Turboprop" },
        timeOfDay: "evening",
        type: "quickest",
        discount: language === 'th' ? 'ลด 10%' : `10% ${t('flight.off_tag')}`
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
    const fLabel = getCityLabelForLang(fromCity, language).split('(')[0].trim();
    const tLabel = getCityLabelForLang(toCity, language).split('(')[0].trim();
    toast.success(
      (t('flight.promo_selected') || "Selected route: {from} to {to}")
        .replace('{from}', fLabel)
        .replace('{to}', tLabel)
    );
    setSelectedOutboundFlight(null);
    setSelectedInboundFlight(null);
    setIsReturnSelection(false);
    setBookingStep("search");
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

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.passengers || form.passengers < 1) {
      toast.error(t('flight.err_min_passengers') || 'จำนวนผู้โดยสารต้องมีอย่างน้อย 1 ท่าน');
      setForm((prev) => ({ ...prev, passengers: 1 }));
      return;
    }
    if (form.passengers > 60) {
      toast.error(t('flight.err_max_passengers') || 'จำนวนผู้โดยสารสูงสุดไม่เกิน 60 ท่าน');
      setForm((prev) => ({ ...prev, passengers: 60 }));
      return;
    }

    if (tripType === "multicity") {
      for (let i = 0; i < multiCityLegs.length; i++) {
        const leg = multiCityLegs[i];
        if (leg.from === leg.to) {
          toast.error(`${language === 'th' ? `เที่ยวบินที่ ${i + 1}:` : `Flight ${i + 1}:`} ${getSameCityErrorText(language)}`);
          return;
        }
        if (!leg.date) {
          toast.error(`${language === 'th' ? `เที่ยวบินที่ ${i + 1}:` : `Flight ${i + 1}:`} ${t('flight.err_dep_date')}`);
          return;
        }
        if (leg.date < today) {
          toast.error(`${language === 'th' ? `เที่ยวบินที่ ${i + 1}:` : `Flight ${i + 1}:`} ${t('flight.err_past_date') || 'ไม่สามารถเลือกวันเดินทางย้อนหลังได้'}`);
          return;
        }
        if (i > 0 && leg.date < multiCityLegs[i - 1].date) {
          toast.error(language === 'th' ? `วันเดินทางเที่ยวบินที่ ${i + 1} ต้องไม่ก่อนหน้าเที่ยวบินที่ ${i}` : `Flight ${i + 1} date cannot be earlier than Flight ${i} date`);
          return;
        }
      }
      setSelectedMultiCityFlights([]);
      setActiveLegIndex(0);
      setBookingStep("select_flight");
      const bookingSection = document.getElementById("booking");
      if (bookingSection) {
        bookingSection.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      return;
    }

    if (form.from === form.to) {
      return;
    }
    if (!form.departDate) {
      toast.error(t('flight.err_dep_date'));
      return;
    }
    if (form.departDate < today) {
      toast.error(t('flight.err_past_date') || 'ไม่สามารถเลือกวันเดินทางย้อนหลังได้');
      return;
    }
    if (tripType === "round") {
      if (!form.returnDate) {
        toast.error(t('flight.err_ret_date'));
        return;
      }
      if (form.returnDate <= form.departDate) {
        toast.error(t('flight.err_invalid_return_date') || 'วันเดินทางกลับต้องอยู่หลังวันเดินทางไปอย่างน้อย 1 วัน');
        return;
      }
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
    setPassengerFormSubmitted(true);

    if (!form.passengers || form.passengers < 1) {
      toast.error(t('flight.err_min_passengers') || 'จำนวนผู้โดยสารต้องมีอย่างน้อย 1 ท่าน');
      setForm((prev) => ({ ...prev, passengers: 1 }));
      return;
    }
    if (form.passengers > 60) {
      toast.error(t('flight.err_max_passengers') || 'จำนวนผู้โดยสารสูงสุดไม่เกิน 60 ท่าน');
      setForm((prev) => ({ ...prev, passengers: 60 }));
      return;
    }

    if (tripType === "multicity") {
      for (let i = 0; i < multiCityLegs.length; i++) {
        const leg = multiCityLegs[i];
        if (!leg.date || leg.date < today) {
          toast.error(`${language === 'th' ? `เที่ยวบินที่ ${i + 1}:` : `Flight ${i + 1}:`} ${t('flight.err_past_date') || 'ไม่สามารถเลือกวันเดินทางย้อนหลังได้'}`);
          return;
        }
      }
    } else {
      if (!form.departDate || form.departDate < today) {
        toast.error(t('flight.err_past_date') || 'ไม่สามารถเลือกวันเดินทางย้อนหลังได้');
        return;
      }
      if (tripType === "round" && (!form.returnDate || form.returnDate <= form.departDate)) {
        toast.error(t('flight.err_invalid_return_date') || 'วันเดินทางกลับต้องอยู่หลังวันเดินทางไปอย่างน้อย 1 วัน');
        return;
      }
    }

    if (!form.passengerName || !form.passengerName.trim()) {
      passengerNameInputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      passengerNameInputRef.current?.focus();
      return;
    }

    if (!form.email || !form.email.trim() || !form.email.includes('@')) {
      emailInputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      emailInputRef.current?.focus();
      return;
    }

    const cleanPhone = (form.phone || '').trim();
    if (!cleanPhone || cleanPhone.length !== 10) {
      phoneInputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      phoneInputRef.current?.focus();
      return;
    }

    const mySeats = (form.seat || "").split(",").map(s => s.trim()).filter(Boolean);
    if (mySeats.length === 0) {
      seatFieldRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setSeatMapOpen(true);
      return;
    }
    if (mySeats.length < form.passengers) {
      seatFieldRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setSeatMapOpen(true);
      return;
    }

    const cleanPromo = (form.promoCode || "").trim().toUpperCase();
    if (cleanPromo.length > 0 && getPromoDiscountRate(cleanPromo) === 0) {
      toast.error(language === 'th' ? 'โค้ดส่วนลดไม่ถูกต้อง กรุณาตรวจสอบหรือลบออกก่อนทำการจอง' : 'Invalid promo code. Please verify or clear it to proceed.');
      return;
    }

    // Prevent duplicate seat bookings
    if (mySeats.length > 0) {
      const existingBookings = getBookings();
      const checkFrom = tripType === "multicity" ? multiCityLegs[0].from : form.from;
      const checkTo = tripType === "multicity" ? multiCityLegs[0].to : form.to;
      const checkDate = tripType === "multicity" ? multiCityLegs[0].date : form.departDate;

      const takenSeat = mySeats.find(seat =>
        existingBookings.some(
          (b: Booking) =>
            (b.seat || "").split(",").map(s => s.trim()).includes(seat) &&
            b.from === checkFrom &&
            b.to === checkTo &&
            b.departDate === checkDate
        )
      );

      if (takenSeat) {
        toast.error(
          (t('flight.err_seat_taken') || "Seat {seat} is already booked for this flight. Please select another seat.").replace('{seat}', takenSeat)
        );
        seatFieldRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setSeatMapOpen(true);
        return;
      }
    }

    let pricePerPax = 0;
    let newBooking: any = null;

    if (tripType === "multicity") {
      pricePerPax = selectedMultiCityFlights.reduce((sum, f) => sum + (f?.price || 890), 0);
      const legs = multiCityLegs.map((leg, idx) => {
        const f = selectedMultiCityFlights[idx];
        return {
          from: leg.from,
          to: leg.to,
          departDate: leg.date,
          flightNo: f?.flightNo || `BTN${200 + idx}`,
          departTime: f?.departTime || "08:00",
          arrivalTime: f?.arrivalTime || "09:15",
          airlineName: f?.airline?.name || "Botnoi Air",
          airlineCode: f?.airline?.code || "BTN",
          price: f?.price || 890,
        };
      });

      newBooking = {
        tripType: "multicity",
        ...form,
        from: multiCityLegs[0].from,
        to: multiCityLegs[multiCityLegs.length - 1].to,
        departDate: multiCityLegs[0].date,
        legs,
        pricePerPax,
        class: selectedClass !== "all" ? selectedClass : (selectedMultiCityFlights[0]?.class || "economy"),
        aircraftModel: selectedMultiCityFlights[0]?.aircraft?.model || "Airbus A320-200",
        aircraftTail: selectedMultiCityFlights[0]?.aircraft?.tailNumber || "HS-BNA",
        outboundFlightNo: legs[0]?.flightNo,
        outboundTime: legs[0]?.departTime,
      };
    } else {
      pricePerPax = (selectedOutboundFlight?.price || 890) + (selectedInboundFlight?.price || 0);
      newBooking = {
        tripType,
        ...form,
        pricePerPax,
        class: selectedOutboundFlight?.class || "economy",
        aircraftModel: selectedOutboundFlight?.aircraft?.model || "Airbus A320-200",
        aircraftTail: selectedOutboundFlight?.aircraft?.tailNumber || "HS-BNA",
        outboundFlightNo: selectedOutboundFlight?.flightNo,
        outboundTime: selectedOutboundFlight?.departTime,
        inboundFlightNo: selectedInboundFlight?.flightNo,
        inboundTime: selectedInboundFlight?.departTime,
      };
    }

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
    setPassengerFormSubmitted(false);
    setBookingStep("search");
    setSelectedOutboundFlight(null);
    setSelectedInboundFlight(null);
    setSelectedMultiCityFlights([]);
    setActiveLegIndex(0);
    setIsReturnSelection(false);
    setForm({
      from: "กรุงเทพฯ (DMK)",
      to: "เชียงใหม่ (CNX)",
      departDate: today,
      returnDate: getNextDayString(today),
      passengers: 1,
      promoCode: "",
      passengerName: "",
      email: "",
      phone: "",
      seat: "",
    });

    const bookingSection = document.getElementById("booking");
    if (bookingSection) {
      bookingSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const fromDetails = useMemo(() => getCityDetails(form.from, language), [form.from, language]);
  const toDetails = useMemo(() => getCityDetails(form.to, language), [form.to, language]);
  const departDateParts = useMemo(() => parseDateForCard(form.departDate, 0, language), [form.departDate, language]);
  const returnDateParts = useMemo(() => parseDateForCard(form.returnDate, 2, language), [form.returnDate, language]);

  const handleSwapCities = (e: React.MouseEvent) => {
    e.stopPropagation();
    setForm(prev => ({
      ...prev,
      from: prev.to,
      to: prev.from,
    }));
    toast.success(language === 'th' ? 'สลับเมืองต้นทางและปลายทางแล้ว' : 'Swapped origin and destination!');
  };

  return (
    <>
      <AnimatePresence>
        {!isReady && <PageSkeleton variant="flight" />}
      </AnimatePresence>
      <div className="flight-theme min-h-screen bg-background relative text-foreground overflow-x-hidden">
        <style>{`
          div[data-sonner-toaster],
          section[data-sonner-toaster],
          ol[data-sonner-toaster] {
            position: fixed !important;
            top: 24px !important;
            left: 50% !important;
            transform: translateX(-50%) !important;
            bottom: auto !important;
            right: auto !important;
            z-index: 99999999 !important;
            margin: 0 !important;
            pointer-events: none !important;
            width: auto !important;
            display: flex !important;
            justify-content: center !important;
          }
          [data-sonner-toast] {
            pointer-events: auto !important;
            margin: 0 auto !important;
            box-shadow: 0 20px 45px -10px rgba(0, 0, 0, 0.45), 0 0 0 1px rgba(255, 255, 255, 0.15) !important;
            border-radius: 18px !important;
            font-weight: 800 !important;
            font-size: 0.95rem !important;
            padding: 14px 22px !important;
            min-width: 320px !important;
            max-width: 92vw !important;
            backdrop-filter: blur(12px) !important;
          }
          [data-sonner-toast][data-type="error"] {
            background-color: #fff1f2 !important;
            color: #9f1239 !important;
            border: 2px solid #f43f5e !important;
          }
          .dark [data-sonner-toast][data-type="error"] {
            background-color: #4c0519 !important;
            color: #ffe4e6 !important;
            border: 2px solid #fb7185 !important;
          }
          [data-sonner-toast][data-type="success"] {
            background-color: #f0fdf4 !important;
            color: #14532d !important;
            border: 2px solid #22c55e !important;
          }
          .dark [data-sonner-toast][data-type="success"] {
            background-color: #052e16 !important;
            color: #dcfce7 !important;
            border: 2px solid #4ade80 !important;
          }
          input[type="date"]::-webkit-calendar-picker-indicator {
            position: absolute !important;
            top: 0 !important;
            left: 0 !important;
            width: 100% !important;
            height: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            opacity: 0 !important;
            cursor: pointer !important;
          }
        `}</style>
        <Toaster
          position="bottom-center"
          theme="dark"
          closeButton
          duration={4000}
          toastOptions={{
            className: "!bg-[#0b0f19] !text-white !border !border-slate-800 !shadow-2xl !rounded-2xl !py-3 !px-5 !text-xs !font-medium",
            style: {
              backgroundColor: "#0b0f19",
              color: "#f8fafc",
              border: "1px solid #1e293b",
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.6), 0 8px 10px -6px rgba(0, 0, 0, 0.6)",
            },
          }}
        />


        {/* HERO with runway airplane background matching ref.webp */}
        <section className="relative isolate overflow-hidden text-white min-h-[560px] md:min-h-[620px] flex flex-col justify-between">
          <motion.img
            src={flightHeroRunway}
            alt={language === 'th' ? 'เครื่องบินพาณิชย์บนรันเวย์' : 'Commercial Airplane on Runway'}
            className="absolute inset-0 -z-10 h-full w-full object-cover object-[center_65%] transition-opacity duration-300"
            style={{ y: heroParallax }}
          />

          {/* Top Breadcrumb & Actions Bar */}
          <header className="relative z-30 mx-auto mt-4 mb-2 w-full max-w-7xl bg-transparent text-white border-none shadow-none transition-all">
            <div className="px-6 py-3 flex flex-col md:flex-row md:items-center justify-between gap-4">
              {/* Left: Home > All Demos > BotnoiAir > Flight Demo */}
              <nav className="flex items-center gap-2 text-xs font-bold text-white/85 flex-wrap drop-shadow-[0_1px_4px_rgba(0,0,0,0.6)]" aria-label="Breadcrumb">
                <Link to="/" className="text-white/80 hover:text-white transition-colors flex items-center gap-1.5">
                  <Home className="w-3.5 h-3.5 text-white/80" />
                  <span>{t('nav.home')}</span>
                </Link>
                <ChevronRight className="w-3.5 h-3.5 text-white/40" />
                <Link to="/all-demo" className="text-white/80 hover:text-white transition-colors">
                  <span>{t('nav.all_demos')}</span>
                </Link>
                <ChevronRight className="w-3.5 h-3.5 text-white/40" />
                <span className="font-extrabold uppercase font-mono flex items-center gap-1.5 text-white">
                  <img src={botnoiAirLogo} alt="BotnoiAir" className="h-5 w-auto object-contain inline-block drop-shadow-sm" />
                  <span>BotnoiAir</span>
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-white/40" />
                <span className="text-white font-extrabold">
                  {t('nav.flight')}
                </span>
              </nav>

              {/* Right: Last Boarding Pass & Roster Admin */}
              <div className="flex items-center gap-2.5 sm:gap-3 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => {
                    if (ticketBooking) {
                      setBoardingPassOpen(true);
                    } else {
                      toast.info(language === 'th' ? 'ยังไม่มีข้อมูลการจองล่าสุด กรุณาค้นหาและจองเที่ยวบินก่อนครับ' : 'No previous boarding pass found. Please book a flight first!');
                    }
                  }}
                  className="btn-102 cursor-pointer"
                  id="nav-flight-boarding-pass"
                  title={t('flight.nav_receipt')}
                >
                  <span className="circle_102"></span>
                  <span className="circle_102"></span>
                  <span className="circle_102"></span>
                  <span className="circle_102"></span>
                  <span className="circle_102"></span>
                  <span className="btn-text-102 flex items-center gap-1.5">
                    <Ticket className="w-3.5 h-3.5 text-white" />
                    <span>{t('flight.nav_receipt')}</span>
                  </span>
                </button>

                <Link
                  to="/flight-demo/admin"
                  className="btn-102 cursor-pointer"
                  id="nav-flight-admin"
                  title={t('flight.nav_admin')}
                >
                  <span className="circle_102"></span>
                  <span className="circle_102"></span>
                  <span className="circle_102"></span>
                  <span className="circle_102"></span>
                  <span className="circle_102"></span>
                  <span className="btn-text-102 flex items-center gap-1.5">
                    <span>{t('flight.nav_admin')}</span>
                  </span>
                </Link>
              </div>
            </div>
          </header>

          {/* Hero Left Content */}
          <div className="mx-auto max-w-7xl px-6 pt-10 md:pt-14 pb-36 md:pb-48 w-full relative z-10">
            <motion.div
              className="max-w-xl text-left"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <h1
                className="font-display text-4xl md:text-6xl font-bold leading-tight !text-white text-white tracking-tight drop-shadow-[0_2px_10px_rgba(0,0,0,0.7)] [-webkit-text-fill-color:white!important] [background:none!important]"
                style={{
                  color: '#ffffff',
                  WebkitTextFillColor: '#ffffff',
                  background: 'none',
                  WebkitBackgroundClip: 'unset'
                }}
              >
                {t('flight.hero_title')}<br />
                {t('flight.hero_title_sub')}
              </h1>

              <p
                className="mt-4 text-sm md:text-base text-slate-100/90 max-w-md leading-relaxed font-normal"
                style={{ textShadow: '0 1px 6px rgba(0,0,0,0.6)' }}
              >
                {t('flight.hero_desc')}
              </p>

              <div className="mt-6">
                <button
                  type="button"
                  onClick={() => {
                    const dealsEl = document.getElementById("deals");
                    dealsEl?.scrollIntoView({ behavior: "smooth", block: "start" });
                  }}
                  className="px-7 py-3 rounded-full bg-[#0066FF] hover:bg-blue-600 active:scale-95 text-white font-semibold text-sm shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
                >
                  {t('flight.btn_explore_deals')}
                </button>
              </div>
            </motion.div>
          </div>

          {/* Soft Runway Bottom Gradient Fade into background */}
          <div className="absolute bottom-0 left-0 right-0 h-36 bg-gradient-to-t from-slate-50 dark:from-slate-950 via-slate-50/80 dark:via-slate-950/80 to-transparent pointer-events-none" />
        </section>

        {/* FLOATING BOOKING CARD matching ref.webp */}
        <section id="booking" className="mx-auto max-w-5xl px-4 sm:px-6 -mt-24 md:-mt-32 relative z-20">
          <motion.div
            className="bg-white dark:bg-slate-900 rounded-[28px] md:rounded-[32px] shadow-2xl border border-slate-100/80 dark:border-slate-800 p-6 md:p-8 transition-all duration-300"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Progress Bar (Only visible when selecting flight or entering passenger details) */}
            {bookingStep !== "search" && (
              <div className="flex items-center justify-between mb-8 max-w-lg mx-auto select-none">
                <div className="flex flex-col items-center flex-1 relative">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-colors duration-300 bg-sky-100 text-sky-700`}>
                    <Check className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-bold mt-1 text-slate-500">{language === 'th' ? 'ค้นหาเที่ยวบิน' : (t('flight.nav_booking') || "Search")}</span>
                </div>
                <div className="h-0.5 bg-slate-200 flex-1 -mt-4"></div>
                <div className="flex flex-col items-center flex-1 relative">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-colors duration-300 ${bookingStep === "select_flight" ? "bg-sky-600 text-white" : "bg-sky-100 text-sky-700"}`}>
                    {bookingStep === "passenger_details" ? <Check className="w-4 h-4" /> : "2"}
                  </div>
                  <span className="text-[10px] font-bold mt-1 text-slate-500">{language === 'th' ? 'เลือกเที่ยวบิน' : (t("flight.select_flight") || "Select Flight")}</span>
                </div>
                <div className="h-0.5 bg-slate-200 flex-1 -mt-4"></div>
                <div className="flex flex-col items-center flex-1 relative">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-colors duration-300 ${bookingStep === "passenger_details" ? "bg-sky-600 text-white" : "bg-slate-100 text-slate-400"}`}>
                    3
                  </div>
                  <span className="text-[10px] font-bold mt-1 text-slate-500">{language === 'th' ? 'ข้อมูลผู้โดยสาร' : (t('flight.passenger_info_step') || "Passenger Info")}</span>
                </div>
              </div>
            )}

            {bookingStep === "search" && (
              <>
                {/* Sub-row: Trip Type & Travellers / Cabin Class */}
                <div className="flex items-center justify-between flex-wrap gap-4 mb-4 select-none">
                  {/* Left: Trip Types */}
                  <div className="flex items-center gap-5 text-xs font-semibold text-slate-700 dark:text-slate-300">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        name="tripType"
                        checked={tripType === "oneway"}
                        onChange={() => setTripType("oneway")}
                        className="w-4 h-4 text-blue-600 accent-blue-600 cursor-pointer"
                      />
                      <span>{t('flight.one_way')}</span>
                    </label>

                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        name="tripType"
                        checked={tripType === "round"}
                        onChange={() => setTripType("round")}
                        className="w-4 h-4 text-blue-600 accent-blue-600 cursor-pointer"
                      />
                      <span>{t('flight.round_trip')}</span>
                    </label>

                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        name="tripType"
                        checked={tripType === "multicity"}
                        onChange={() => setTripType("multicity")}
                        className="w-4 h-4 text-blue-600 accent-blue-600 cursor-pointer"
                      />
                      <span>{t('flight.multi_city')}</span>
                    </label>
                  </div>

                  {/* Right: Travellers & Cabin Class dropdowns */}
                  <div className="flex items-center gap-2">
                    {/* Passenger Dropdown */}
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => {
                          setPassengerDropdownOpen(!passengerDropdownOpen);
                          setCabinDropdownOpen(false);
                        }}
                        className="px-3.5 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 text-xs font-bold text-blue-600 dark:text-blue-400 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
                      >
                        <span>
                          {(t('flight.passengers_count') || "ผู้โดยสาร {count} ท่าน")
                            .replace('{count}', String(form.passengers))
                            .replace('{s}', form.passengers > 1 ? 's' : '')}
                        </span>
                        <ChevronDown className="w-3 h-3 text-slate-400" />
                      </button>

                      {passengerDropdownOpen && (
                        <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 p-3.5 z-50 text-xs text-left">
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <span className="font-bold text-slate-700 dark:text-slate-300 block">{t('flight.passengers')}</span>
                              <span className="text-[10px] text-slate-400">{t('flight.max_passengers_hint')}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => setForm(prev => ({ ...prev, passengers: Math.max(1, prev.passengers - 1) }))}
                                className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer transition-colors"
                              >
                                -
                              </button>
                              <input
                                type="number"
                                min={1}
                                max={60}
                                value={form.passengers}
                                onChange={(e) => {
                                  const val = parseInt(e.target.value, 10);
                                  if (isNaN(val)) {
                                    setForm(prev => ({ ...prev, passengers: 1 }));
                                  } else {
                                    setForm(prev => ({ ...prev, passengers: Math.max(1, Math.min(60, val)) }));
                                  }
                                }}
                                className="w-12 py-0.5 text-center font-bold text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                              />
                              <button
                                type="button"
                                onClick={() => setForm(prev => ({ ...prev, passengers: Math.min(60, prev.passengers + 1) }))}
                                className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer transition-colors"
                              >
                                +
                              </button>
                            </div>
                          </div>
                          <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                            <span className="text-[10px] text-slate-400 block mb-1.5 font-medium">{t('flight.quick_select')}</span>
                            <div className="grid grid-cols-5 gap-1.5">
                              {[1, 2, 5, 10, 60].map(num => (
                                <button
                                  key={num}
                                  type="button"
                                  onClick={() => {
                                    setForm(prev => ({ ...prev, passengers: num }));
                                    setPassengerDropdownOpen(false);
                                  }}
                                  className={`py-1 rounded-lg text-center font-bold transition-all text-xs cursor-pointer ${
                                    form.passengers === num
                                      ? 'bg-blue-600 text-white shadow-xs'
                                      : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                                  }`}
                                >
                                  {num}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Cabin Class Dropdown */}
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => {
                          setCabinDropdownOpen(!cabinDropdownOpen);
                          setPassengerDropdownOpen(false);
                        }}
                        className="px-3.5 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 text-xs font-bold text-blue-600 dark:text-blue-400 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
                      >
                        <span>{selectedClass === 'business' ? t('flight.cabin_business') : t('flight.cabin_economy')}</span>
                        <ChevronDown className="w-3 h-3 text-slate-400" />
                      </button>

                      {cabinDropdownOpen && (
                        <div className="absolute right-0 mt-2 w-36 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 py-1.5 z-50 text-xs text-left">
                          {[
                            { id: "all", label: t('flight.cabin_all') },
                            { id: "economy", label: t('flight.cabin_economy') },
                            { id: "business", label: t('flight.cabin_business') },
                          ].map(cls => (
                            <button
                              key={cls.id}
                              type="button"
                              onClick={() => {
                                setSelectedClass(cls.id as any);
                                setCabinDropdownOpen(false);
                              }}
                              className={`w-full px-3 py-2 text-left font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors ${
                                selectedClass === cls.id ? 'text-blue-600 font-bold bg-blue-50/50 dark:bg-blue-900/20' : 'text-slate-700 dark:text-slate-300'
                              }`}
                            >
                              {cls.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Main Segmented Search Inputs Box matching ref.webp */}
                <form onSubmit={handleSearchSubmit} className="relative">
                  {tripType === "multicity" ? (
                    <div className="space-y-3">
                      {multiCityLegs.map((leg, legIndex) => {
                        const legFromDetails = getCityDetails(leg.from, language);
                        const legToDetails = getCityDetails(leg.to, language);
                        const legDateParts = parseDateForCard(leg.date, 0, language);
                        const isFromPickerOpen = openMultiCityPicker?.legIndex === legIndex && openMultiCityPicker?.type === "from";
                        const isToPickerOpen = openMultiCityPicker?.legIndex === legIndex && openMultiCityPicker?.type === "to";
                        const minLegDate = legIndex === 0 ? today : multiCityLegs[legIndex - 1].date;

                        return (
                          <div key={leg.id} className="relative">
                            <div className="flex items-center justify-between mb-1.5 px-1">
                              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 font-display">
                                <span className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 text-[11px] font-black flex items-center justify-center">
                                  {legIndex + 1}
                                </span>
                                <span>{language === 'th' ? `เที่ยวบินที่ ${legIndex + 1}` : `Flight ${legIndex + 1}`}:</span>
                                <span title={legFromDetails.fullName} className="underline decoration-dotted underline-offset-2 cursor-help">{legFromDetails.cityName}</span>
                                <span>→</span>
                                <span title={legToDetails.fullName} className="underline decoration-dotted underline-offset-2 cursor-help">{legToDetails.cityName}</span>
                              </span>
                              {multiCityLegs.length > 2 && (
                                <button
                                  type="button"
                                  onClick={() => handleRemoveLeg(legIndex)}
                                  className="text-xs text-rose-500 hover:text-rose-600 font-semibold flex items-center gap-1 cursor-pointer transition-colors px-2 py-0.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30"
                                >
                                  <X className="w-3.5 h-3.5" />
                                  <span>{t('flight.btn_remove')}</span>
                                </button>
                              )}
                            </div>

                            <div className="border border-slate-200/90 dark:border-slate-700/80 rounded-2xl p-1.5 md:p-2 flex flex-col lg:flex-row items-stretch lg:items-center bg-white dark:bg-slate-900 shadow-sm gap-1 lg:gap-0">
                              {/* Origin & Destination Group */}
                              <div className="flex-1 min-w-0 flex flex-col sm:flex-row items-stretch sm:items-center relative">
                                {/* Origin Segment */}
                                <div
                                  onClick={() => {
                                    setOpenMultiCityPicker(
                                      isFromPickerOpen ? null : { legIndex, type: "from" }
                                    );
                                  }}
                                  title={legFromDetails.fullName}
                                  className={`flex-1 min-w-0 px-3.5 py-2.5 rounded-xl transition-colors cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/60 ${
                                    leg.from === leg.to ? 'bg-rose-50/70 dark:bg-rose-950/30' : ''
                                  }`}
                                >
                                  <div className="flex items-center gap-3 min-w-0" title={legFromDetails.fullName}>
                                    <span className="font-mono font-black text-2xl lg:text-3xl text-slate-900 dark:text-white tracking-tight shrink-0">
                                      {legFromDetails.code}
                                    </span>
                                    <div className="min-w-0 flex-1 text-left">
                                      <div className="font-bold text-xs sm:text-sm text-slate-800 dark:text-slate-200 truncate" title={legFromDetails.fullName}>
                                        {legFromDetails.cityName}
                                      </div>
                                      <div className="text-[10px] sm:text-[11px] text-slate-400 truncate mt-0.5" title={legFromDetails.fullName}>
                                        {legFromDetails.airportName}
                                      </div>
                                    </div>
                                  </div>

                                  {/* From Picker Dropdown */}
                                  {isFromPickerOpen && (
                                    <div className="absolute top-full left-0 mt-2 w-80 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200/80 dark:border-slate-700 p-3 z-50 text-left">
                                      <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100 dark:border-slate-800">
                                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{language === 'th' ? 'เลือกเมืองต้นทาง' : (t('flight.from') || "Select Origin")}</span>
                                        <button onClick={(e) => { e.stopPropagation(); setOpenMultiCityPicker(null); }} className="text-slate-400 hover:text-slate-600 p-1">
                                          <X className="w-3.5 h-3.5" />
                                        </button>
                                      </div>
                                      <div className="max-h-60 overflow-y-auto space-y-1" style={{ scrollbarWidth: 'thin' }}>
                                        {CITIES.map((c) => {
                                          const details = getCityDetails(c, language);
                                          const isSelected = leg.from === c;
                                          return (
                                            <button
                                              key={c}
                                              type="button"
                                              title={details.fullName}
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                handleUpdateLegCity(legIndex, "from", c);
                                              }}
                                              className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition-all ${
                                                isSelected ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 font-bold" : "hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                                              }`}
                                            >
                                              <div className="min-w-0 pr-2">
                                                <div className="text-xs font-bold flex items-center gap-1.5" title={details.fullName}>
                                                  <span className="font-mono text-blue-600 bg-blue-100/60 dark:bg-blue-950/60 px-1.5 py-0.5 rounded text-[10px] font-black">{details.code}</span>
                                                  <span className="truncate">{details.cityName}</span>
                                                </div>
                                                <div className="text-[10px] text-slate-400 truncate mt-0.5" title={details.fullName}>{details.airportName}</div>
                                              </div>
                                              {isSelected && <Check className="w-3.5 h-3.5 text-blue-600 shrink-0" />}
                                            </button>
                                          );
                                        })}
                                      </div>
                                    </div>
                                  )}
                                </div>

                                  {/* Swap Button */}
                                  <div className="flex items-center justify-center px-1 sm:px-2 shrink-0 self-center">
                                    <button
                                      type="button"
                                      onClick={() => handleSwapLegCities(legIndex)}
                                      title={language === 'th' ? 'สลับเมืองต้นทางและปลายทาง' : 'Swap origin and destination'}
                                      className="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center justify-center shadow-2xs transition-all hover:rotate-180 cursor-pointer"
                                    >
                                      <ArrowLeftRight className="w-3.5 h-3.5" />
                                    </button>
                                  </div>

                                {/* Destination Segment */}
                                <div
                                  onClick={() => {
                                    setOpenMultiCityPicker(
                                      isToPickerOpen ? null : { legIndex, type: "to" }
                                    );
                                  }}
                                  title={legToDetails.fullName}
                                  className={`flex-1 min-w-0 px-3.5 py-2.5 rounded-xl transition-colors cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/60 ${
                                    leg.from === leg.to ? 'bg-rose-50/70 dark:bg-rose-950/30' : ''
                                  }`}
                                >
                                  <div className="flex items-center gap-3 min-w-0" title={legToDetails.fullName}>
                                    <span className="font-mono font-black text-2xl lg:text-3xl text-slate-900 dark:text-white tracking-tight shrink-0">
                                      {legToDetails.code}
                                    </span>
                                    <div className="min-w-0 flex-1 text-left">
                                      <div className="font-bold text-xs sm:text-sm text-slate-800 dark:text-slate-200 truncate" title={legToDetails.fullName}>
                                        {legToDetails.cityName}
                                      </div>
                                      <div className="text-[10px] sm:text-[11px] text-slate-400 truncate mt-0.5" title={legToDetails.fullName}>
                                        {legToDetails.airportName}
                                      </div>
                                    </div>
                                  </div>

                                  {/* To Picker Dropdown */}
                                  {isToPickerOpen && (
                                    <div className="absolute top-full right-0 sm:right-auto sm:left-1/3 mt-2 w-80 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200/80 dark:border-slate-700 p-3 z-50 text-left">
                                      <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100 dark:border-slate-800">
                                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{language === 'th' ? 'เลือกเมืองปลายทาง' : (t('flight.to') || "Select Destination")}</span>
                                        <button onClick={(e) => { e.stopPropagation(); setOpenMultiCityPicker(null); }} className="text-slate-400 hover:text-slate-600 p-1">
                                          <X className="w-3.5 h-3.5" />
                                        </button>
                                      </div>
                                      <div className="max-h-60 overflow-y-auto space-y-1" style={{ scrollbarWidth: 'thin' }}>
                                        {CITIES.map((c) => {
                                          const details = getCityDetails(c, language);
                                          const isSelected = leg.to === c;
                                          return (
                                            <button
                                              key={c}
                                              type="button"
                                              title={details.fullName}
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                handleUpdateLegCity(legIndex, "to", c);
                                              }}
                                              className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition-all ${
                                                isSelected ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 font-bold" : "hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                                              }`}
                                            >
                                              <div className="min-w-0 pr-2">
                                                <div className="text-xs font-bold flex items-center gap-1.5" title={details.fullName}>
                                                  <span className="font-mono text-blue-600 bg-blue-100/60 dark:bg-blue-950/60 px-1.5 py-0.5 rounded text-[10px] font-black">{details.code}</span>
                                                  <span className="truncate">{details.cityName}</span>
                                                </div>
                                                <div className="text-[10px] text-slate-400 truncate mt-0.5" title={details.fullName}>{details.airportName}</div>
                                              </div>
                                              {isSelected && <Check className="w-3.5 h-3.5 text-blue-600 shrink-0" />}
                                            </button>
                                          );
                                        })}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* Vertical Divider between Cities and Departure Date */}
                              <div className="hidden lg:block w-px h-9 bg-slate-200 dark:bg-slate-700 mx-1 shrink-0 self-center" />

                              {/* Departure Date Segment */}
                              <div
                                className="relative flex-1 sm:flex-initial sm:w-48 lg:w-56 px-3.5 py-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors cursor-pointer shrink-0 select-none"
                              >
                                <input
                                  type="date"
                                  required
                                  min={minLegDate}
                                  value={leg.date}
                                  onClick={(e) => {
                                    try {
                                      if (typeof (e.currentTarget as any).showPicker === "function") {
                                        (e.currentTarget as any).showPicker();
                                      }
                                    } catch (err) {}
                                  }}
                                  onChange={(e) => handleUpdateLegDate(legIndex, e.target.value)}
                                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                                />
                                <div className="flex items-center gap-3 text-left min-w-0 pointer-events-none">
                                  <span className="font-mono font-black text-2xl lg:text-3xl text-slate-900 dark:text-white leading-none shrink-0">
                                    {legDateParts.day}
                                  </span>
                                  <div className="min-w-0 flex-1">
                                    <div className="font-bold text-xs text-slate-800 dark:text-slate-200 truncate">
                                      {legDateParts.month}
                                    </div>
                                    <div className="text-[10px] sm:text-[11px] text-slate-400 truncate mt-0.5">
                                      {legDateParts.weekday}, {legDateParts.year}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {leg.from === leg.to && (
                              <p className="mt-1.5 text-xs font-bold text-rose-500 text-left flex items-center gap-1 px-1">
                                <span>⚠️ {getSameCityErrorText(language)}</span>
                              </p>
                            )}
                          </div>
                        );
                      })}

                      {/* Bottom multi-city action row */}
                      <div className="flex items-center justify-between pt-2 flex-wrap gap-3">
                        {multiCityLegs.length < 4 ? (
                          <button
                            type="button"
                            onClick={handleAddLeg}
                            className="px-4 py-2.5 rounded-xl border border-dashed border-blue-300 dark:border-blue-700 text-blue-600 dark:text-blue-400 hover:bg-blue-50/50 dark:hover:bg-blue-950/30 font-bold text-xs flex items-center gap-2 cursor-pointer transition-all"
                          >
                            <span className="text-base leading-none font-bold">+</span>
                            <span>{t('flight.add_flight')}</span>
                          </button>
                        ) : (
                          <div />
                        )}

                        <button
                          type="submit"
                          id="submit-flight-search-multicity"
                          className="px-8 py-3.5 rounded-2xl bg-[#0066FF] hover:bg-blue-600 active:scale-95 text-white flex items-center justify-center shadow-md shadow-blue-500/25 transition-all cursor-pointer font-bold text-sm gap-2 ml-auto"
                        >
                          <Search className="w-4 h-4 text-white stroke-[2.5]" />
                          <span>{t('flight.search_flights') || "Search Flights"}</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="border border-slate-200/90 dark:border-slate-700/80 rounded-2xl p-1.5 md:p-2 flex flex-col lg:flex-row items-stretch lg:items-center bg-white dark:bg-slate-900 shadow-sm gap-1 lg:gap-0">
                        {/* Origin & Destination Group */}
                        <div className="flex-1 min-w-0 flex flex-col sm:flex-row items-stretch sm:items-center relative">
                          {/* Origin Segment */}
                          <div
                            onClick={() => {
                              setFromPickerOpen(!fromPickerOpen);
                              setToPickerOpen(false);
                            }}
                            title={fromDetails.fullName}
                            className={`flex-1 min-w-0 px-3.5 py-2.5 rounded-xl transition-colors cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/60 ${
                              form.from === form.to ? 'bg-rose-50/70 dark:bg-rose-950/30' : ''
                            }`}
                          >
                            <div className="flex items-center gap-3 min-w-0" title={fromDetails.fullName}>
                              <span className="font-mono font-black text-2xl lg:text-3xl text-slate-900 dark:text-white tracking-tight shrink-0">
                                {fromDetails.code}
                              </span>
                              <div className="min-w-0 flex-1 text-left">
                                <div className="font-bold text-xs sm:text-sm text-slate-800 dark:text-slate-200 truncate" title={fromDetails.fullName}>
                                  {fromDetails.cityName}
                                </div>
                                <div className="text-[10px] sm:text-[11px] text-slate-400 truncate mt-0.5" title={fromDetails.fullName}>
                                  {fromDetails.airportName}
                                </div>
                              </div>
                            </div>

                            {/* From Picker Dropdown */}
                            {fromPickerOpen && (
                              <div className="absolute top-full left-0 mt-2 w-80 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200/80 dark:border-slate-700 p-3 z-50 text-left">
                                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100 dark:border-slate-800">
                                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{language === 'th' ? 'เลือกเมืองต้นทาง' : (t('flight.from') || "Select Origin")}</span>
                                  <button onClick={(e) => { e.stopPropagation(); setFromPickerOpen(false); }} className="text-slate-400 hover:text-slate-600 p-1">
                                    <X className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                                <div className="max-h-60 overflow-y-auto space-y-1" style={{ scrollbarWidth: 'thin' }}>
                                  {CITIES.map((c) => {
                                    const details = getCityDetails(c, language);
                                    const isSelected = form.from === c;
                                    return (
                                      <button
                                        key={c}
                                        type="button"
                                        title={details.fullName}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setForm(prev => ({ ...prev, from: c }));
                                          setFromPickerOpen(false);
                                        }}
                                        className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition-all ${
                                          isSelected ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 font-bold" : "hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                                        }`}
                                      >
                                        <div className="min-w-0 pr-2">
                                          <div className="text-xs font-bold flex items-center gap-1.5" title={details.fullName}>
                                            <span className="font-mono text-blue-600 bg-blue-100/60 dark:bg-blue-950/60 px-1.5 py-0.5 rounded text-[10px] font-black">{details.code}</span>
                                            <span className="truncate">{details.cityName}</span>
                                          </div>
                                          <div className="text-[10px] text-slate-400 truncate mt-0.5" title={details.fullName}>{details.airportName}</div>
                                        </div>
                                        {isSelected && <Check className="w-3.5 h-3.5 text-blue-600 shrink-0" />}
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Swap Button (Properly spaced, not squeezed) */}
                          <div className="flex items-center justify-center px-1 sm:px-2 shrink-0 self-center">
                            <button
                              type="button"
                              onClick={handleSwapCities}
                              title={language === 'th' ? 'สลับเมืองต้นทางและปลายทาง' : 'Swap origin and destination'}
                              className="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center justify-center shadow-2xs transition-all hover:rotate-180 cursor-pointer"
                            >
                              <ArrowLeftRight className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          {/* Destination Segment */}
                          <div
                            onClick={() => {
                              setToPickerOpen(!toPickerOpen);
                              setFromPickerOpen(false);
                            }}
                            title={toDetails.fullName}
                            className={`flex-1 min-w-0 px-3.5 py-2.5 rounded-xl transition-colors cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/60 ${
                              form.from === form.to ? 'bg-rose-50/70 dark:bg-rose-950/30' : ''
                            }`}
                          >
                            <div className="flex items-center gap-3 min-w-0" title={toDetails.fullName}>
                              <span className="font-mono font-black text-2xl lg:text-3xl text-slate-900 dark:text-white tracking-tight shrink-0">
                                {toDetails.code}
                              </span>
                              <div className="min-w-0 flex-1 text-left">
                                <div className="font-bold text-xs sm:text-sm text-slate-800 dark:text-slate-200 truncate" title={toDetails.fullName}>
                                  {toDetails.cityName}
                                </div>
                                <div className="text-[10px] sm:text-[11px] text-slate-400 truncate mt-0.5" title={toDetails.fullName}>
                                  {toDetails.airportName}
                                </div>
                              </div>
                            </div>

                            {/* To Picker Dropdown */}
                            {toPickerOpen && (
                              <div className="absolute top-full right-0 sm:right-auto sm:left-1/3 mt-2 w-80 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200/80 dark:border-slate-700 p-3 z-50 text-left">
                                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100 dark:border-slate-800">
                                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{language === 'th' ? 'เลือกเมืองปลายทาง' : (t('flight.to') || "Select Destination")}</span>
                                  <button onClick={(e) => { e.stopPropagation(); setToPickerOpen(false); }} className="text-slate-400 hover:text-slate-600 p-1">
                                    <X className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                                <div className="max-h-60 overflow-y-auto space-y-1" style={{ scrollbarWidth: 'thin' }}>
                                  {CITIES.map((c) => {
                                    const details = getCityDetails(c, language);
                                    const isSelected = form.to === c;
                                    return (
                                      <button
                                        key={c}
                                        type="button"
                                        title={details.fullName}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setForm(prev => ({ ...prev, to: c }));
                                          setToPickerOpen(false);
                                        }}
                                        className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition-all ${
                                          isSelected ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 font-bold" : "hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                                        }`}
                                      >
                                        <div className="min-w-0 pr-2">
                                          <div className="text-xs font-bold flex items-center gap-1.5" title={details.fullName}>
                                            <span className="font-mono text-blue-600 bg-blue-100/60 dark:bg-blue-950/60 px-1.5 py-0.5 rounded text-[10px] font-black">{details.code}</span>
                                            <span className="truncate">{details.cityName}</span>
                                          </div>
                                          <div className="text-[10px] text-slate-400 truncate mt-0.5" title={details.fullName}>{details.airportName}</div>
                                        </div>
                                        {isSelected && <Check className="w-3.5 h-3.5 text-blue-600 shrink-0" />}
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Vertical Divider between Cities and Departure Date */}
                        <div className="hidden lg:block w-px h-9 bg-slate-200 dark:bg-slate-700 mx-1 shrink-0 self-center" />

                        {/* Departure & Return Dates Group */}
                        <div className="flex items-center gap-1 lg:gap-0 shrink-0">
                          {/* Departure Date Segment */}
                          <div
                            onClick={() => openDatePicker(departDateInputRef)}
                            className="relative flex-1 sm:flex-initial sm:w-40 lg:w-44 px-3.5 py-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors cursor-pointer shrink-0 select-none"
                          >
                            <input
                              ref={departDateInputRef}
                              type="date"
                              name="departDate"
                              required
                              min={today}
                              value={form.departDate}
                              onClick={(e) => {
                                try {
                                  if (typeof (e.currentTarget as any).showPicker === "function") {
                                    (e.currentTarget as any).showPicker();
                                  }
                                } catch (err) {}
                              }}
                              onChange={(e) => {
                                const newDepart = e.target.value;
                                setForm(prev => ({
                                  ...prev,
                                  departDate: newDepart,
                                  returnDate: prev.returnDate && prev.returnDate <= newDepart ? "" : prev.returnDate,
                                }));
                              }}
                              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                            />
                            <div className="flex items-center gap-3 text-left min-w-0 pointer-events-none">
                              <span className="font-mono font-black text-2xl lg:text-3xl text-slate-900 dark:text-white leading-none shrink-0">
                                {departDateParts.day}
                              </span>
                              <div className="min-w-0 flex-1">
                                <div className="font-bold text-xs text-slate-800 dark:text-slate-200 truncate">
                                  {departDateParts.month}
                                </div>
                                <div className="text-[10px] sm:text-[11px] text-slate-400 truncate mt-0.5">
                                  {departDateParts.weekday}, {departDateParts.year}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Vertical Divider between Departure and Return Date */}
                          <div className="hidden lg:block w-px h-9 bg-slate-200 dark:bg-slate-700 mx-1 shrink-0 self-center" />

                          {/* Return Date Segment */}
                          {tripType === "round" ? (
                            <div
                              onClick={() => openDatePicker(returnDateInputRef)}
                              className="relative flex-1 sm:flex-initial sm:w-40 lg:w-44 px-3.5 py-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors cursor-pointer shrink-0 select-none"
                            >
                              <input
                                ref={returnDateInputRef}
                                type="date"
                                name="returnDate"
                                required
                                min={getNextDayString(form.departDate) || getNextDayString(today)}
                                value={form.returnDate}
                                onClick={(e) => {
                                  try {
                                    if (typeof (e.currentTarget as any).showPicker === "function") {
                                      (e.currentTarget as any).showPicker();
                                    }
                                  } catch (err) {}
                                }}
                                onChange={(e) => setForm(prev => ({ ...prev, returnDate: e.target.value }))}
                                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                              />
                              <div className="flex items-center gap-3 text-left min-w-0 pointer-events-none">
                                <span className="font-mono font-black text-2xl lg:text-3xl text-slate-900 dark:text-white leading-none shrink-0">
                                  {returnDateParts.day}
                                </span>
                                <div className="min-w-0 flex-1">
                                  <div className="font-bold text-xs text-slate-800 dark:text-slate-200 truncate">
                                    {returnDateParts.month}
                                  </div>
                                  <div className="text-[10px] sm:text-[11px] text-slate-400 truncate mt-0.5">
                                    {returnDateParts.weekday}, {returnDateParts.year}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div
                              onClick={() => {
                                setTripType("round");
                                setTimeout(() => openDatePicker(returnDateInputRef), 60);
                              }}
                              className="flex-1 sm:flex-initial sm:w-40 lg:w-44 px-3.5 py-2.5 rounded-xl border border-dashed border-slate-200 dark:border-slate-700 hover:border-blue-400 hover:bg-blue-50/40 dark:hover:bg-blue-950/20 transition-all cursor-pointer flex items-center justify-center text-slate-400 hover:text-blue-600 text-xs font-semibold shrink-0 select-none"
                            >
                              {language === 'th' ? '+ เพิ่มวันเดินทางกลับ' : '+ Add Return'}
                            </div>
                          )}
                        </div>

                        {/* Blue Search Button */}
                        <div className="p-1 shrink-0 self-center">
                          <button
                            type="submit"
                            id="submit-flight-search"
                            className="w-full lg:w-14 h-12 lg:h-14 rounded-2xl bg-[#0066FF] hover:bg-blue-600 active:scale-95 text-white flex items-center justify-center shadow-md shadow-blue-500/25 transition-all cursor-pointer shrink-0 font-bold text-sm gap-2"
                            title={t('flight.search_flights') || "Search Flights"}
                          >
                            <Search className="w-5 h-5 text-white stroke-[2.5]" />
                            <span className="lg:hidden">{t('flight.search_flights') || "Search Flights"}</span>
                          </button>
                        </div>
                      </div>

                      {/* Error text if same city */}
                      {form.from === form.to && (
                        <p className="mt-2 text-xs font-bold text-rose-500 text-left flex items-center gap-1">
                          <span>⚠️ {getSameCityErrorText(language)}</span>
                        </p>
                      )}
                    </>
                  )}

                  {/* Fare Types Row below inputs */}
                  <div className="flex items-center justify-between flex-wrap gap-4 mt-4 select-none">
                    <div className="flex items-center gap-5 text-xs font-semibold text-slate-700 dark:text-slate-300">
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="radio"
                          name="fareType"
                          checked={fareType === "regular"}
                          onChange={() => setFareType("regular")}
                          className="w-3.5 h-3.5 text-blue-600 accent-blue-600 cursor-pointer"
                        />
                        <span>{t('flight.fare_regular')}</span>
                      </label>

                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="radio"
                          name="fareType"
                          checked={fareType === "student"}
                          onChange={() => {
                            setFareType("student");
                            toast.success(
                              language === 'th'
                                ? 'ราคานักศึกษา: รวมสัมภาระเพิ่มฟรี 10 กก.!'
                                : 'Student Fare: 10kg extra baggage allowance included!'
                            );
                          }}
                          className="w-3.5 h-3.5 text-blue-600 accent-blue-600 cursor-pointer"
                        />
                        <span>{t('flight.fare_student')}</span>
                      </label>
                    </div>
                  </div>
                </form>
              </>
            )}

            {bookingStep === "select_flight" && (
              <div className="text-slate-800 dark:text-slate-200 text-left">
                {/* Back button */}
                <button
                  onClick={() => {
                    if (tripType === "multicity") {
                      if (activeLegIndex > 0) {
                        setActiveLegIndex(activeLegIndex - 1);
                      } else {
                        setBookingStep("search");
                      }
                    } else if (isReturnSelection) {
                      setIsReturnSelection(false);
                    } else {
                      setBookingStep("search");
                    }
                  }}
                  className="flex items-center gap-1.5 text-base font-bold text-slate-900 dark:text-white hover:!text-slate-500 dark:hover:!text-slate-400 transition-colors mb-4 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  {t('flight.step_back')}
                </button>

                {/* Multi-City Leg Switcher Tabs */}
                {tripType === "multicity" && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6">
                    {multiCityLegs.map((leg, idx) => {
                      const isSelected = !!selectedMultiCityFlights[idx];
                      const isActive = activeLegIndex === idx;
                      const legFlight = selectedMultiCityFlights[idx];
                      const fromC = leg.from.match(/\(([A-Z]{3})\)/)?.[1] || "DMK";
                      const toC = leg.to.match(/\(([A-Z]{3})\)/)?.[1] || "CNX";
                      return (
                        <button
                          key={leg.id}
                          type="button"
                          onClick={() => {
                            setActiveLegIndex(idx);
                            setExpandedDetailsIndex(null);
                          }}
                          className={`p-3 rounded-xl text-left transition-all cursor-pointer ${
                            isActive
                              ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm"
                              : isSelected
                              ? "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-300"
                              : "bg-slate-100/70 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 hover:bg-slate-200/70"
                          }`}
                        >
                          <div className="flex items-center justify-between mb-0.5">
                            <span className="text-[10px] font-bold opacity-75">
                              {language === 'th' ? `เที่ยวบิน ${idx + 1}/${multiCityLegs.length}` : `Leg ${idx + 1}/${multiCityLegs.length}`}
                            </span>
                            {isSelected && <span className="text-[10px] font-bold text-emerald-600">✓</span>}
                          </div>
                          <div className="font-bold text-xs sm:text-sm font-mono">
                            {fromC} → {toC}
                          </div>
                          <div className="text-[10px] opacity-75 truncate">
                            {legFlight ? `${legFlight.airline.code} · ฿${legFlight.price.toLocaleString()}` : leg.date}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Step Title */}
                {(() => {
                  const currentFlightList = tripType === "multicity"
                    ? getMockFlights(false, multiCityLegs[activeLegIndex]?.from, multiCityLegs[activeLegIndex]?.to)
                    : getMockFlights(isReturnSelection);

                  const originCityStr = tripType === "multicity"
                    ? multiCityLegs[activeLegIndex]?.from
                    : (isReturnSelection ? form.to : form.from);
                  const destCityStr = tripType === "multicity"
                    ? multiCityLegs[activeLegIndex]?.to
                    : (isReturnSelection ? form.from : form.to);

                  const fromCode = tripType === "multicity"
                    ? (multiCityLegs[activeLegIndex]?.from.match(/\(([A-Z]{3})\)/)?.[1] || "DMK")
                    : ((isReturnSelection ? form.to : form.from).match(/\(([A-Z]{3})\)/)?.[1] || "DMK");

                  const toCode = tripType === "multicity"
                    ? (multiCityLegs[activeLegIndex]?.to.match(/\(([A-Z]{3})\)/)?.[1] || "CNX")
                    : ((isReturnSelection ? form.from : form.to).match(/\(([A-Z]{3})\)/)?.[1] || "CNX");

                  const fromCityFull = getCityFullName(originCityStr, language);
                  const toCityFull = getCityFullName(destCityStr, language);

                  return (
                    <>
                      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 pb-4 border-b border-foreground/10 mb-6">
                        <div>
                          <h3 className="font-display text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                            {tripType === "multicity"
                              ? (language === 'th'
                                  ? `เที่ยวบินที่ ${activeLegIndex + 1}: ${getCityLabel(multiCityLegs[activeLegIndex]?.from || "")} → ${getCityLabel(multiCityLegs[activeLegIndex]?.to || "")}`
                                  : `Select Flight ${activeLegIndex + 1}: ${getCityLabel(multiCityLegs[activeLegIndex]?.from || "")} → ${getCityLabel(multiCityLegs[activeLegIndex]?.to || "")}`)
                              : isReturnSelection
                              ? t('flight.step_select_ret')
                              : t('flight.step_select_dep')
                            }
                          </h3>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                            {tripType === "multicity"
                              ? `${getCityLabel(multiCityLegs[activeLegIndex]?.from || "")} → ${getCityLabel(multiCityLegs[activeLegIndex]?.to || "")} · ${multiCityLegs[activeLegIndex]?.date}`
                              : isReturnSelection
                              ? `${getCityLabel(form.to)} → ${getCityLabel(form.from)} · ${form.returnDate}`
                              : `${getCityLabel(form.from)} → ${getCityLabel(form.to)} · ${form.departDate}`
                            }
                          </p>
                        </div>
                        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                          {language === 'th' ? `${currentFlightList.length} เที่ยวบินพร้อมให้บริการ` : `${currentFlightList.length} available flights`}
                        </span>
                      </div>

                      {/* Filters / Sorting tabs */}
                      <div className="flex items-center justify-between gap-3 mb-5 select-none flex-wrap">
                        <div className="inline-flex p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl text-xs font-display">
                          {(["cheapest", "best", "quickest"] as const).map((filter) => (
                            <button
                              key={filter}
                              type="button"
                              onClick={() => setActiveFilter(filter)}
                              className={`px-3.5 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                                activeFilter === filter
                                  ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs"
                                  : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                              }`}
                            >
                              {filter === "cheapest" ? t('flight.filter_cheapest') :
                                filter === "quickest" ? t('flight.filter_quickest') :
                                  t('flight.filter_best')}
                            </button>
                          ))}
                        </div>

                        <button
                          type="button"
                          onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                          className="text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer py-1.5 px-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/60"
                        >
                          {showAdvancedFilters ? (language === 'th' ? "ซ่อนตัวกรอง" : "Hide Filters") : t('flight.detailed_filters')}
                        </button>
                      </div>

                      {/* Collapsible Advanced Filters Panel */}
                      <AnimatePresence>
                        {showAdvancedFilters && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden mb-6 p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 space-y-4 text-xs"
                          >
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                              {/* 1. Cabin Class */}
                              <div>
                                <span className="font-bold text-slate-700 dark:text-slate-300 block mb-2">{t('flight.cabin_class')}</span>
                                <div className="flex gap-1">
                                  {(["all", "economy", "business"] as const).map((cls) => (
                                    <button
                                      key={cls}
                                      type="button"
                                      onClick={() => setSelectedClass(cls)}
                                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer capitalize ${
                                        selectedClass === cls
                                          ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900"
                                          : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                                      }`}
                                    >
                                      {cls === "all" ? t('flight.cabin_all') : cls === "economy" ? t('flight.cabin_economy') : t('flight.cabin_business')}
                                    </button>
                                  ))}
                                </div>
                              </div>

                              {/* 2. Time of Day */}
                              <div>
                                <span className="font-bold text-slate-700 dark:text-slate-300 block mb-2">{t('flight.depart_time')}</span>
                                <div className="flex gap-1 flex-wrap">
                                  {[
                                    { id: "morning", label: t('flight.time_morning') },
                                    { id: "afternoon", label: t('flight.time_afternoon') },
                                    { id: "evening", label: t('flight.time_evening') }
                                  ].map((tItem) => {
                                    const isChecked = selectedTimeOfDay.includes(tItem.id);
                                    return (
                                      <button
                                        key={tItem.id}
                                        type="button"
                                        onClick={() => {
                                          if (isChecked) {
                                            setSelectedTimeOfDay(selectedTimeOfDay.filter(x => x !== tItem.id));
                                          } else {
                                            setSelectedTimeOfDay([...selectedTimeOfDay, tItem.id]);
                                          }
                                        }}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                          isChecked
                                            ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900"
                                            : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                                        }`}
                                      >
                                        {tItem.label}
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>

                              {/* 3. Airlines */}
                              <div>
                                <span className="font-bold text-slate-700 dark:text-slate-300 block mb-2">{language === 'th' ? 'สายการบิน' : 'Airline'}</span>
                                <div className="flex gap-1 flex-wrap">
                                  {mockAirlines.map((al) => {
                                    const isChecked = selectedAirlines.includes(al.code);
                                    return (
                                      <button
                                        key={al.code}
                                        type="button"
                                        onClick={() => {
                                          if (isChecked) {
                                            setSelectedAirlines(selectedAirlines.filter(x => x !== al.code));
                                          } else {
                                            setSelectedAirlines([...selectedAirlines, al.code]);
                                          }
                                        }}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                          isChecked
                                            ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900"
                                            : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                                        }`}
                                      >
                                        {al.name}
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>

                              {/* 4. Max Price */}
                              <div>
                                <div className="flex justify-between items-center mb-1.5">
                                  <span className="font-bold text-slate-700 dark:text-slate-300">{t('flight.max_price')}</span>
                                  <span className="font-mono font-bold text-slate-900 dark:text-white">฿{maxPrice.toLocaleString()}</span>
                                </div>
                                <input
                                  type="range"
                                  min={700}
                                  max={2500}
                                  step={50}
                                  value={maxPrice}
                                  onChange={(e) => setMaxPrice(+e.target.value)}
                                  className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-slate-900 dark:accent-white"
                                />
                              </div>
                            </div>

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
                                  className="text-[11px] font-bold text-slate-500 hover:text-rose-600 cursor-pointer underline"
                                >
                                  {t('flight.clear_filters')}
                                </button>
                              </div>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Flight List */}
                      <div className="space-y-3">
                        {currentFlightList.length === 0 ? (
                          <div className="text-center py-12 px-6 rounded-2xl bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800">
                            <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm font-display">{t('flight.no_flights')}</h4>
                            <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                              {t('flight.no_flights_desc')}
                            </p>
                            <button
                              type="button"
                              onClick={() => {
                                setMaxPrice(2500);
                                setSelectedClass("all");
                                setSelectedTimeOfDay([]);
                              }}
                              className="mt-4 px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs rounded-xl shadow-xs cursor-pointer font-display"
                            >
                              {t('flight.clear_filters')}
                            </button>
                          </div>
                        ) : (
                          currentFlightList.map((flight, idx) => {
                            const isExpanded = expandedDetailsIndex === idx;

                            return (
                              <div
                                key={flight.id}
                                className="bg-white dark:bg-slate-900 rounded-2xl p-5 md:p-6 transition-all duration-200 border border-slate-200/60 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700 shadow-xs hover:shadow-md"
                              >
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 md:gap-6">
                                  {/* 1. Airline Logo & Flight Code */}
                                  <div className="flex items-center gap-3.5 min-w-[180px]">
                                    {flight.airline.code === 'BTN' ? (
                                      <div className="w-11 h-11 rounded-xl bg-sky-50 dark:bg-sky-950/60 border border-sky-200/60 dark:border-sky-800/60 p-1.5 flex items-center justify-center shrink-0 shadow-2xs">
                                        <img src={botnoiAirLogo} alt={flight.airline.name} className="w-full h-full object-contain" />
                                      </div>
                                    ) : flight.airline.code === 'THA' ? (
                                      <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#3b0764] via-[#581c87] to-[#7e22ce] text-white flex flex-col items-center justify-center shrink-0 shadow-2xs border border-purple-900/40">
                                        <span className="font-mono font-black text-xs leading-none text-amber-300">TG</span>
                                        <span className="text-[8px] font-bold text-white/90 uppercase tracking-tight mt-0.5">THAI</span>
                                      </div>
                                    ) : (
                                      <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#0369a1] via-[#0284c7] to-[#0ea5e9] text-white flex flex-col items-center justify-center shrink-0 shadow-2xs border border-sky-800/40">
                                        <span className="font-mono font-black text-xs leading-none text-white">PG</span>
                                        <span className="text-[7.5px] font-bold text-white/90 uppercase tracking-tight mt-0.5">BANGKOK</span>
                                      </div>
                                    )}

                                    <div className="min-w-0">
                                      <span className="font-display font-black text-sm text-slate-900 dark:text-white block leading-tight truncate">
                                        {flight.airline.name}
                                      </span>
                                      <span className="text-[11px] font-mono text-slate-400 mt-0.5 block truncate">
                                        {flight.flightNo} · {flight.aircraft.model} · {flight.class === "business" ? (language === 'th' ? 'ชั้นธุรกิจ' : 'Business') : (language === 'th' ? 'ชั้นประหยัด' : 'Economy')}
                                      </span>
                                    </div>
                                  </div>

                                  {/* 2. Schedule: Depart — Duration — Arrive */}
                                  <div className="flex items-center gap-4 sm:gap-6 flex-1 max-w-md">
                                    <div className="text-left">
                                      <span className="font-mono font-black text-xl text-slate-900 dark:text-white block leading-none">
                                        {flight.departTime}
                                      </span>
                                      <span className="text-[11px] font-bold text-slate-500 uppercase mt-1 block">
                                        {fromCode}
                                      </span>
                                    </div>

                                    <div className="flex-1 flex flex-col items-center">
                                      <span className="text-[11px] text-slate-500 font-medium mb-1.5">
                                        {language === 'th' ? flight.duration.replace('h', ' ชม.').replace('m', ' นาที') : flight.duration}
                                      </span>
                                      <div className="w-full flex items-center gap-1.5">
                                        <div className="h-[2px] flex-1 bg-slate-200 dark:bg-slate-700 rounded-full" />
                                        <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                                          {language === 'th' ? 'บินตรง' : 'Direct'}
                                        </span>
                                        <div className="h-[2px] flex-1 bg-slate-200 dark:bg-slate-700 rounded-full" />
                                      </div>
                                    </div>

                                    <div className="text-right">
                                      <span className="font-mono font-black text-xl text-slate-900 dark:text-white block leading-none">
                                        {flight.arrivalTime}
                                      </span>
                                      <span className="text-[11px] font-bold text-slate-500 uppercase mt-1 block">
                                        {toCode}
                                      </span>
                                    </div>
                                  </div>

                                  {/* 3. Price & Action */}
                                  <div className="flex items-center justify-between md:justify-end gap-5 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-slate-800">
                                    <div className="text-left md:text-right">
                                      {flight.discount !== "None" && (
                                        <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400 block">
                                          {flight.discount}
                                        </span>
                                      )}
                                      <span className="font-display font-black text-2xl text-slate-900 dark:text-white block leading-none">
                                        ฿{flight.price.toLocaleString()}
                                      </span>
                                      <span className="text-[10px] text-slate-400 block mt-0.5">
                                        {language === 'th' ? 'ต่อท่าน' : 'per person'}
                                      </span>
                                    </div>

                                    <button
                                      type="button"
                                      onClick={() => {
                                        if (tripType === "multicity") {
                                          const updated = [...selectedMultiCityFlights];
                                          updated[activeLegIndex] = flight;
                                          setSelectedMultiCityFlights(updated);
                                          if (activeLegIndex < multiCityLegs.length - 1) {
                                            setActiveLegIndex(activeLegIndex + 1);
                                            setExpandedDetailsIndex(null);
                                            document.getElementById("booking")?.scrollIntoView({ behavior: "smooth", block: "start" });
                                          } else {
                                            const allSelected = multiCityLegs.every((_, i) => updated[i]);
                                            if (allSelected) {
                                              setBookingStep("passenger_details");
                                              document.getElementById("booking")?.scrollIntoView({ behavior: "smooth", block: "start" });
                                            } else {
                                              const unselected = multiCityLegs.findIndex((_, i) => !updated[i]);
                                              if (unselected !== -1) {
                                                setActiveLegIndex(unselected);
                                                setExpandedDetailsIndex(null);
                                                document.getElementById("booking")?.scrollIntoView({ behavior: "smooth", block: "start" });
                                              }
                                            }
                                          }
                                        } else if (isReturnSelection) {
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
                                      className="px-5 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-display font-bold text-xs hover:bg-sky-600 dark:hover:bg-sky-400 dark:hover:text-white transition-all cursor-pointer active:scale-95 shadow-2xs shrink-0 whitespace-nowrap min-w-[70px] text-center"
                                    >
                                      {t('flight.select_this') || (language === 'th' ? 'เลือก' : 'Select')}
                                    </button>
                                  </div>
                                </div>

                                {/* Minimalist Details Trigger & Drawer */}
                                <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                                  <button
                                    type="button"
                                    onClick={() => setExpandedDetailsIndex(isExpanded ? null : idx)}
                                    className="text-[11px] font-medium text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer flex items-center gap-1"
                                  >
                                    <span>{isExpanded ? (language === 'th' ? 'ซ่อนรายละเอียด' : 'Hide details') : (language === 'th' ? 'ดูรายละเอียดเที่ยวบินและสัมภาระ' : 'Flight details & baggage')}</span>
                                    <span className="text-[9px]">{isExpanded ? '▲' : '▼'}</span>
                                  </button>
                                  <span className="text-[10px] text-slate-400 font-mono">
                                    {fromCityFull.split('(')[0].trim()} → {toCityFull.split('(')[0].trim()}
                                  </span>
                                </div>

                                {isExpanded && (
                                  <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs animate-fadeIn">
                                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40">
                                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                                        {language === 'th' ? 'สัมภาระฟรี' : 'Baggage'}
                                      </span>
                                      <span className="font-semibold text-slate-800 dark:text-slate-200 block">
                                        {language === 'th' ? 'กระเป๋าถือขึ้นเครื่อง 7 กก. + โหลด 20 กก.' : 'Carry-on 7kg + Checked 20kg'}
                                      </span>
                                    </div>
                                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40">
                                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                                        {language === 'th' ? 'อากาศยาน & ห้องโดยสาร' : 'Aircraft & Cabin'}
                                      </span>
                                      <span className="font-semibold text-slate-800 dark:text-slate-200 block">
                                        {flight.aircraft.model} ({flight.aircraft.tailNumber})
                                      </span>
                                      <span className="text-[10px] text-slate-400 block mt-0.5">
                                        {language === 'th' ? `ความจุ 60 ที่นั่ง · ${flight.aircraft.type}` : `60 Seats · ${flight.aircraft.type}`}
                                      </span>
                                    </div>
                                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40">
                                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                                        {language === 'th' ? 'บริการบนเครื่อง' : 'In-flight Inclusions'}
                                      </span>
                                      <span className="font-semibold text-slate-800 dark:text-slate-200 block">
                                        {language === 'th' ? 'ของว่าง เครื่องดื่ม และ Wi-Fi ฟรี' : 'Complimentary snack, drinks & Wi-Fi'}
                                      </span>
                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                          })
                        )}
                      </div>
                    </>
                  );
                })()}
              </div>
            )}

            {bookingStep === "passenger_details" && (
              <div className="text-slate-800 dark:text-slate-200 text-left">
                {/* Back button */}
                <button
                  onClick={() => {
                    if (tripType === "multicity") {
                      setActiveLegIndex(multiCityLegs.length - 1);
                      setBookingStep("select_flight");
                    } else if (tripType === "round") {
                      setIsReturnSelection(true);
                      setBookingStep("select_flight");
                    } else {
                      setBookingStep("select_flight");
                    }
                  }}
                  className="flex items-center gap-1.5 text-base font-bold text-slate-900 dark:text-white hover:!text-slate-500 dark:hover:!text-slate-400 transition-colors mb-4 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  {t('flight.back_to_selection')}
                </button>

                {/* Selected flights summary */}
                <div className="bg-sky-50/50 dark:bg-sky-900/20 border border-sky-100 dark:border-sky-800 rounded-3xl p-5 mb-6">
                  <h4 className="font-display font-black text-sm text-sky-950 dark:text-sky-200 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <Ticket className="w-4 h-4" />
                    {t('flight.summary_title')} {tripType === "multicity" ? (language === 'th' ? `(${multiCityLegs.length} เที่ยวบิน)` : `(${multiCityLegs.length} Flights)`) : ""}
                  </h4>
                  <div className="space-y-2 text-xs">
                    {tripType === "multicity" ? (
                      multiCityLegs.map((leg, idx) => {
                        const flight = selectedMultiCityFlights[idx];
                        const fromC = leg.from.match(/\(([A-Z]{3})\)/)?.[1] || "DMK";
                        const toC = leg.to.match(/\(([A-Z]{3})\)/)?.[1] || "CNX";
                        return (
                          <div key={leg.id} className="flex justify-between items-center py-1.5 border-b border-sky-100/50 dark:border-sky-800/50">
                            <span className="text-slate-500 dark:text-slate-400 font-display font-medium">
                              {language === 'th' ? `เที่ยวบินที่ ${idx + 1}` : `Flight ${idx + 1}`} ({fromC} → {toC} | {leg.date}):
                            </span>
                            <span className="font-bold text-sky-950 dark:text-white font-display flex items-center gap-1.5">
                              {flight?.airline.code === 'BTN' && <img src={botnoiAirLogo} alt="" className="w-4 h-4 object-contain inline" />}
                              {flight?.airline.name} ({flight?.flightNo}) · {flight?.departTime} (฿{(flight?.price || 0).toLocaleString()})
                            </span>
                          </div>
                        );
                      })
                    ) : (
                      <>
                        <div className="flex justify-between items-center py-1.5 border-b border-sky-100/50 dark:border-sky-800/50">
                          <span className="text-slate-500 dark:text-slate-400 font-display">{t('flight.summary_outbound')}:</span>
                          <span className="font-bold text-sky-950 dark:text-white font-display flex items-center gap-1.5">
                            {selectedOutboundFlight?.airline.code === 'BTN' && <img src={botnoiAirLogo} alt="" className="w-4 h-4 object-contain inline" />}
                            {selectedOutboundFlight?.airline.name} ({selectedOutboundFlight?.flightNo}) · {selectedOutboundFlight?.departTime}
                          </span>
                        </div>
                        {tripType === "round" && selectedInboundFlight && (
                          <div className="flex justify-between items-center py-1.5 border-b border-sky-100/50 dark:border-sky-800/50 font-display">
                            <span className="text-slate-500 dark:text-slate-400">{t('flight.summary_inbound')}:</span>
                            <span className="font-bold text-sky-950 dark:text-white flex items-center gap-1.5">
                              {selectedInboundFlight?.airline.code === 'BTN' && <img src={botnoiAirLogo} alt="" className="w-4 h-4 object-contain inline" />}
                              {selectedInboundFlight?.airline.name} ({selectedInboundFlight?.flightNo}) · {selectedInboundFlight?.departTime}
                            </span>
                          </div>
                        )}
                      </>
                    )}
                    {(() => {
                      const promoRate = getPromoDiscountRate(form.promoCode);
                      const baseTotal = (tripType === "multicity"
                        ? selectedMultiCityFlights.reduce((sum, f) => sum + (f?.price || 0), 0) * form.passengers
                        : ((selectedOutboundFlight?.price || 0) + (selectedInboundFlight?.price || 0)) * form.passengers
                      );
                      const promoName = (form.promoCode || "").trim().toUpperCase();

                      return (
                        <>
                          <div className="flex justify-between items-center pt-2 text-sm font-display">
                            <span className="text-slate-500 dark:text-slate-400 font-medium">{t('flight.summary_fare_per_person')} × {form.passengers}:</span>
                            <span className={`font-extrabold ${promoRate > 0 ? "line-through text-slate-400 text-xs" : "text-sky-950 dark:text-white"}`}>
                              ฿{baseTotal.toLocaleString()}
                            </span>
                          </div>
                          {promoRate > 0 && (
                            <div className="flex justify-between items-center pt-1 text-sm font-display text-emerald-600 dark:text-emerald-400 font-bold">
                              <span className="text-xs">{promoName} (-{Math.round(promoRate * 100)}%):</span>
                              <span>
                                ฿{Math.round(baseTotal * (1 - promoRate)).toLocaleString()}
                              </span>
                            </div>
                          )}
                        </>
                      );
                    })()}
                  </div>
                </div>

                <h3 className="font-display text-xl font-bold mb-4 text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
                  {t('flight.modal_passenger')}
                </h3>

                <form onSubmit={handlePassengerSubmit} className="grid md:grid-cols-2 gap-4">
                  {(() => {
                    const isNameInvalid = Boolean(passengerFormSubmitted && (!form.passengerName || !form.passengerName.trim()));
                    const isEmailInvalid = Boolean(passengerFormSubmitted && (!form.email || !form.email.trim() || !form.email.includes('@')));
                    const isPhoneInvalid = Boolean(
                      passengerFormSubmitted &&
                      (!form.phone || form.phone.trim().length !== 10)
                    );
                    const mySeats = (form.seat || "").split(",").map(s => s.trim()).filter(Boolean);
                    const isSeatInvalid = Boolean(passengerFormSubmitted && (mySeats.length === 0 || mySeats.length < form.passengers));

                    return (
                      <>
                        <Field
                          label={t('flight.passenger_name')}
                          htmlFor="passengerName"
                          required
                          isError={isNameInvalid}
                          errorText={isNameInvalid ? (language === 'th' ? 'กรุณากรอกชื่อ-นามสกุลผู้โดยสาร (ภาษาอังกฤษ)' : (t('flight.booking_error') || 'Please enter passenger full name')) : undefined}
                        >
                          <input
                            ref={passengerNameInputRef}
                            id="passengerName"
                            name="passengerName"
                            required
                            value={form.passengerName || ''}

                            // 1. ล้างตัวอักษรไทยออกทันทีหลังจากพิมพ์/ผสมคำเสร็จ
                            onCompositionEnd={(e) => {
                              const cleanValue = e.currentTarget.value.replace(/[^a-zA-Z\s]/g, '');
                              setForm((prev) => ({ ...prev, passengerName: cleanValue }));
                            }}

                            // 2. รับค่าและกรองภาษาไทยออก (ใช้ Cast Type แก้ปัญหา TypeScript เรียบร้อย)
                            onChange={(e) => {
                              if (!(e.nativeEvent as InputEvent).isComposing) {
                                const cleanValue = e.target.value.replace(/[^a-zA-Z\s]/g, '');
                                setForm((prev) => ({ ...prev, passengerName: cleanValue }));
                              } else {
                                setForm((prev) => ({ ...prev, passengerName: e.target.value }));
                              }
                            }}

                            // 3. ป้องกันตอนหลุดโฟกัส (Blur) และตอน ก๊อปปี้วาง (Paste)
                            onBlur={(e) => {
                              const cleanValue = e.target.value.replace(/[^a-zA-Z\s]/g, '');
                              setForm((prev) => ({ ...prev, passengerName: cleanValue }));
                            }}
                            onPaste={(e) => {
                              e.preventDefault();
                              const pastedText = e.clipboardData.getData('text');
                              const cleanValue = pastedText.replace(/[^a-zA-Z\s]/g, '');
                              setForm((prev) => ({ ...prev, passengerName: (prev.passengerName || '') + cleanValue }));
                            }}

                            className="w-full bg-transparent outline-none font-bold text-slate-800 dark:text-slate-100 text-sm font-display placeholder:text-slate-400 dark:placeholder:text-slate-500 placeholder:font-normal"
                            placeholder={t('flight.passenger_name_placeholder')}
                          />
                        </Field>

                        <Field
                          label={t('flight.email')}
                          htmlFor="email"
                          required
                          isError={isEmailInvalid}
                          errorText={isEmailInvalid ? (language === 'th' ? 'กรุณากรอกอีเมลให้ถูกต้อง (เช่น you@email.com)' : 'Please enter a valid email address') : undefined}
                        >
                          <input
                            ref={emailInputRef}
                            type="email"
                            id="email"
                            name="email"
                            required
                            value={form.email}
                            onChange={(e) => {
                              setForm({ ...form, email: e.target.value });
                            }}
                            className="w-full bg-transparent outline-none font-bold text-slate-800 dark:text-slate-100 text-sm font-display placeholder:text-slate-400 dark:placeholder:text-slate-500"
                            placeholder="you@email.com"
                          />
                        </Field>

                        <Field
                          label={t('flight.phone')}
                          htmlFor="phone"
                          required
                          isError={isPhoneInvalid}
                          errorText={isPhoneInvalid ? (t('flight.err_phone_length') || 'กรุณากรอกเบอร์โทรศัพท์ให้ครบ 10 หลัก') : undefined}
                        >
                          <input
                            ref={phoneInputRef}
                            id="phone"
                            name="phone"
                            type="tel"
                            inputMode="numeric"
                            maxLength={10}
                            required
                            value={form.phone || ''}
                            onChange={(e) => {
                              // คัดเอาเฉพาะตัวเลข (0-9) เท่านั้น และจำกัดไม่เกิน 10 หลัก
                              const cleanValue = e.target.value.replace(/[^0-9]/g, '').slice(0, 10);
                              setForm((prev) => ({ ...prev, phone: cleanValue }));
                            }}
                            onPaste={(e) => {
                              // ป้องกันกรณีก๊อปปี้ข้อความที่มีตัวอักษรติดมาวาง
                              e.preventDefault();
                              const pastedText = e.clipboardData.getData('text');
                              const cleanValue = pastedText.replace(/[^0-9]/g, '');
                              setForm((prev) => ({ ...prev, phone: ((prev.phone || '') + cleanValue).slice(0, 10) }));
                            }}
                            className="w-full bg-transparent outline-none font-bold text-slate-800 dark:text-slate-100 text-sm font-display placeholder:text-slate-400 dark:placeholder:text-slate-500"
                            placeholder="08XXXXXXXX"
                          />
                        </Field>

                        <Field
                          containerRef={seatFieldRef}
                          label={
                            <div className="flex items-center justify-between w-full">
                              <span>{t('flight.modal_seat') || "Seat"} ({form.passengers} {language === 'th' ? 'ที่นั่ง' : 'Seats'})</span>
                              {form.seat && (
                                <span className="text-[10px] text-sky-600 dark:text-sky-400 font-bold px-1.5 py-0.5 rounded bg-sky-500/10 dark:bg-sky-950/40">
                                  {mySeats.length}/{form.passengers} {language === 'th' ? 'ที่นั่ง' : 'Seats'}
                                </span>
                              )}
                            </div>
                          }
                          onClick={() => {
                            setSeatMapOpen(true);
                          }}
                          required
                          isError={isSeatInvalid}
                          errorText={
                            isSeatInvalid
                              ? (language === 'th'
                                  ? (mySeats.length === 0
                                      ? 'กรุณาเลือกที่นั่ง'
                                      : `กรุณาเลือกที่นั่งให้ครบ ${form.passengers} ที่นั่ง (เลือกแล้ว ${mySeats.length} ที่นั่ง)`)
                                  : (t('flight.seat_please_select') || `Please select ${form.passengers} seat(s)`))
                              : undefined
                          }
                        >
                          <div className="py-0.5 select-none font-display">
                            <span className={`font-bold text-sm truncate block ${form.seat ? "text-sky-600 dark:text-sky-400 font-extrabold" : "text-slate-500 dark:text-slate-400"}`}>
                              {form.seat || (language === 'th' ? `ยังไม่ได้เลือก (ต้องเลือก ${form.passengers} ที่นั่ง)` : `Not selected (${form.passengers} seats)`)}
                            </span>
                          </div>
                        </Field>
                      </>
                    );
                  })()}

                  {/* Promo Code Field */}
                  {(() => {
                    const cleanPromo = (form.promoCode || '').trim().toUpperCase();
                    const promoRate = getPromoDiscountRate(cleanPromo);
                    const isValidPromo = promoRate > 0;
                    const isInvalidPromo = cleanPromo.length > 0 && !isValidPromo;

                    return (
                      <Field
                        label={
                          <div className="flex items-center justify-between w-full">
                            <span>{t('flight.modal_promo') || "Promo Code"}</span>
                            {isValidPromo && (
                              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 dark:bg-emerald-950/40">
                                {language === 'th' ? `✓ ลด ${Math.round(promoRate * 100)}%` : `✓ ${Math.round(promoRate * 100)}% OFF`}
                              </span>
                            )}
                          </div>
                        }
                        htmlFor="promoCode"
                        isError={isInvalidPromo}
                        errorText={isInvalidPromo ? (language === 'th' ? 'โค้ดส่วนลดไม่ถูกต้อง หรือไม่สามารถใช้ได้ (สามารถเว้นว่างได้หากไม่มีโค้ด)' : 'Invalid or expired promo code') : undefined}
                        className="md:col-span-2"
                      >
                        <input
                          id="promoCode"
                          name="promoCode"
                          type="text"
                          value={form.promoCode || ''}
                          onChange={(e) => {
                            setForm((prev) => ({ ...prev, promoCode: e.target.value.toUpperCase() }));
                          }}
                          className="w-full bg-transparent outline-none font-bold text-slate-800 dark:text-slate-100 text-sm font-display placeholder:text-slate-400 dark:placeholder:text-slate-500 uppercase"
                          placeholder={language === 'th' ? "เช่น SKYPROMO2026, PROMO2026" : "e.g., SKYPROMO2026, PROMO2026"}
                        />
                      </Field>
                    );
                  })()}

                  <div className="md:col-span-2 flex justify-end pt-4 border-t border-slate-100 dark:border-slate-800 mt-4">
                    <button
                      type="submit"
                      id="submit-flight-booking"
                      className="px-10 py-4 rounded-full bg-gradient-to-r from-sky-600 to-indigo-600 text-white font-display font-bold text-sm shadow-md hover:from-sky-500 hover:to-indigo-500 hover:shadow-lg active:scale-98 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      {t('flight.submit')}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </motion.div>
        </section>

        {/* TOP DEALS SECTION matching ref.webp */}
        <section id="deals" className="mx-auto max-w-5xl px-4 sm:px-6 pt-16 pb-24 text-left">
          <div className="mb-8">
            <h2 className="font-display text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {t('flight.deals_title')}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
              {t('flight.deals_subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Deal Card 1: Your next adventure begins */}
            <motion.article
              whileHover={{ y: -6, scale: 1.02 }}
              transition={{ duration: 0.3 }}
              className="relative overflow-hidden rounded-[26px] aspect-[16/11] md:aspect-[4/3] shadow-lg border border-slate-200/60 dark:border-slate-800 group cursor-pointer"
              onClick={() => handleSelectPromo("กรุงเทพฯ (DMK)", "เชียงใหม่ (CNX)")}
            >
              <img
                src={promoChiangmai}
                alt={getCityDetails("เชียงใหม่ (CNX)", language).cityName}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/40 to-transparent group-hover:from-slate-950/95 group-hover:via-slate-900/50 transition-all duration-500" />
              <div className="absolute inset-0 p-6 flex flex-col justify-end text-white z-10">
                <div className="max-w-[85%]">
                  <h3 className="font-display font-black text-xl md:text-2xl leading-tight text-white drop-shadow-md">
                    {t('flight.deal1_title')}
                  </h3>
                </div>
                <div className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-all duration-300 ease-out opacity-0 group-hover:opacity-100">
                  <div className="overflow-hidden">
                    <div className="pt-3 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300 ease-out">
                      <div className="text-xs text-white/90 font-medium cursor-help" title={`${getCityFullName("กรุงเทพฯ (DMK)", language)} → ${getCityFullName("เชียงใหม่ (CNX)", language)}`}>
                        {getCityLabelForLang("กรุงเทพฯ (DMK)", language)} → {getCityLabelForLang("เชียงใหม่ (CNX)", language)}
                      </div>
                      <div className="flex items-end justify-between mt-2">
                        <div>
                          <span className="text-[10px] text-white/70 block uppercase font-bold tracking-wider">{t('flight.starting_price')}</span>
                          <span className="font-display font-black text-2xl text-white">฿690</span>
                        </div>
                        <button
                          type="button"
                          className="px-4 py-1.5 rounded-full bg-white/20 hover:bg-white/35 backdrop-blur-md border border-white/30 text-white text-xs font-bold transition-all cursor-pointer shadow-xs"
                        >
                          {t('flight.btn_book_now')}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.article>

            {/* Deal Card 2: Up to 50% Savings on Flights */}
            <motion.article
              whileHover={{ y: -6, scale: 1.02 }}
              transition={{ duration: 0.3 }}
              className="relative overflow-hidden rounded-[26px] aspect-[16/11] md:aspect-[4/3] shadow-lg border border-slate-200/60 dark:border-slate-800 group cursor-pointer"
              onClick={() => handleSelectPromo("กรุงเทพฯ (DMK)", "ภูเก็ต (HKT)")}
            >
              <img
                src={promoPhuket}
                alt={getCityDetails("ภูเก็ต (HKT)", language).cityName}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/40 to-transparent group-hover:from-slate-950/95 group-hover:via-slate-900/50 transition-all duration-500" />
              <div className="absolute inset-0 p-6 flex flex-col justify-end text-white z-10">
                <div className="max-w-[85%]">
                  <h3 className="font-display font-black text-xl md:text-2xl leading-tight text-white drop-shadow-md">
                    {t('flight.deal2_title')}
                  </h3>
                </div>
                <div className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-all duration-300 ease-out opacity-0 group-hover:opacity-100">
                  <div className="overflow-hidden">
                    <div className="pt-3 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300 ease-out">
                      <div className="text-xs text-white/90 font-medium cursor-help" title={`${getCityFullName("กรุงเทพฯ (DMK)", language)} → ${getCityFullName("ภูเก็ต (HKT)", language)}`}>
                        {getCityLabelForLang("กรุงเทพฯ (DMK)", language)} → {getCityLabelForLang("ภูเก็ต (HKT)", language)}
                      </div>
                      <div className="flex items-end justify-between mt-2">
                        <div>
                          <span className="text-[10px] text-white/70 block uppercase font-bold tracking-wider">{t('flight.starting_price')}</span>
                          <span className="font-display font-black text-2xl text-white">฿890</span>
                        </div>
                        <button
                          type="button"
                          className="px-4 py-1.5 rounded-full bg-white/20 hover:bg-white/35 backdrop-blur-md border border-white/30 text-white text-xs font-bold transition-all cursor-pointer shadow-xs"
                        >
                          {t('flight.btn_book_now')}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.article>

            {/* Deal Card 3: Start your next journey */}
            <motion.article
              whileHover={{ y: -6, scale: 1.02 }}
              transition={{ duration: 0.3 }}
              className="relative overflow-hidden rounded-[26px] aspect-[16/11] md:aspect-[4/3] shadow-lg border border-slate-200/60 dark:border-slate-800 group cursor-pointer"
              onClick={() => handleSelectPromo("กรุงเทพฯ (DMK)", "หาดใหญ่ (HDY)")}
            >
              <img
                src={promoHatyai}
                alt={getCityDetails("หาดใหญ่ (HDY)", language).cityName}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/40 to-transparent group-hover:from-slate-950/95 group-hover:via-slate-900/50 transition-all duration-500" />
              <div className="absolute inset-0 p-6 flex flex-col justify-end text-white z-10">
                <div className="max-w-[85%]">
                  <h3 className="font-display font-black text-xl md:text-2xl leading-tight text-white drop-shadow-md">
                    {t('flight.deal3_title')}
                  </h3>
                </div>
                <div className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-all duration-300 ease-out opacity-0 group-hover:opacity-100">
                  <div className="overflow-hidden">
                    <div className="pt-3 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300 ease-out">
                      <div className="text-xs text-white/90 font-medium cursor-help" title={`${getCityFullName("กรุงเทพฯ (DMK)", language)} → ${getCityFullName("หาดใหญ่ (HDY)", language)}`}>
                        {getCityLabelForLang("กรุงเทพฯ (DMK)", language)} → {getCityLabelForLang("หาดใหญ่ (HDY)", language)}
                      </div>
                      <div className="flex items-end justify-between mt-2">
                        <div>
                          <span className="text-[10px] text-white/70 block uppercase font-bold tracking-wider">{t('flight.starting_price')}</span>
                          <span className="font-display font-black text-2xl text-white">฿990</span>
                        </div>
                        <button
                          type="button"
                          className="px-4 py-1.5 rounded-full bg-white/20 hover:bg-white/35 backdrop-blur-md border border-white/30 text-white text-xs font-bold transition-all cursor-pointer shadow-xs"
                        >
                          {t('flight.btn_book_now')}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.article>
          </div>
        </section>


        {/* SPECIAL SERVICES */}
        <section className="border-t border-foreground/10 py-16 relative z-10 text-left">
          <div className="mx-auto max-w-5xl px-6">
            <div className="mb-10 pb-6 border-b border-foreground/10">
              <p className="text-[11px] font-bold uppercase tracking-widest text-primary">
                {language === 'th' ? 'สิทธิประโยชน์มาตรฐานทุกที่นั่ง' : 'Standard Fare Inclusions'}
              </p>
              <TypewriterHeading
                text={t('flight.about_heading')}
                className="font-display text-2xl lg:text-3xl font-extrabold text-foreground tracking-tight mt-1 min-h-[36px]"
              />
              <p className="text-xs lg:text-sm text-foreground/60 max-w-xl mt-2 leading-relaxed">
                {t('flight.about_subheading')}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-foreground/10">
              {/* Service 1: Baggage */}
              <div className="py-6 md:py-0 md:pr-8 lg:pr-10 first:pt-0 md:first:pt-0">
                <span className="inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-primary/10 text-primary mb-3">
                  {language === 'th' ? 'รวมในตั๋วฟรี' : 'Included · Free'}
                </span>
                <h3 className="font-display font-bold text-base text-foreground mb-2">
                  {t('flight.service1_title')}
                </h3>
                <p className="text-xs text-foreground/60 leading-relaxed">
                  {t('flight.service1_desc')}
                </p>
              </div>

              {/* Service 2: Snack */}
              <div className="py-6 md:py-0 md:px-8 lg:px-10">
                <span className="inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mb-3">
                  {language === 'th' ? 'บริการเสิร์ฟฟรี' : 'Complimentary'}
                </span>
                <h3 className="font-display font-bold text-base text-foreground mb-2">
                  {t('flight.service2_title')}
                </h3>
                <p className="text-xs text-foreground/60 leading-relaxed">
                  {t('flight.service2_desc')}
                </p>
              </div>

              {/* Service 3: WebAvatar */}
              <div className="py-6 md:py-0 md:pl-8 lg:pl-10 last:pb-0 md:last:pb-0">
                <span className="inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-sky-500/10 text-sky-600 dark:text-sky-400 mb-3">
                  {language === 'th' ? 'ผู้ช่วยอัจฉริยะ' : 'Interactive Concierge'}
                </span>
                <h3 className="font-display font-bold text-base text-foreground mb-2">
                  {t('flight.service3_title')}
                </h3>
                <p className="text-xs text-foreground/60 leading-relaxed">
                  {t('flight.service3_desc')}
                </p>
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
              <p className="font-display font-bold mb-3 text-white text-sm">{t('flight.footer_services')}</p>
              <ul className="text-xs opacity-75 space-y-2.5">
                <li>{t('flight.nav_booking')}</li>
                <li>{t('flight.service1_title')}</li>
                <li>{t('flight.service2_title')}</li>
              </ul>
            </div>
            <div>
              <p className="font-display font-bold mb-3 text-white text-sm">{t('flight.nav_contact')}</p>
              <ul className="text-xs opacity-75 space-y-2.5">
                <li>{language === 'th' ? 'โทร. 1318 (ตลอด 24 ชั่วโมง)' : 'Tel. 1318 (24 Hours)'}</li>
                <li>support@botnoiair.example</li>
              </ul>
            </div>
          </div>
        </footer>
      </div>

      {/* TICKET MODAL */}
      <TicketModal
        booking={ticketBooking}
        open={boardingPassOpen}
        onClose={() => {
          setBoardingPassOpen(false);
          const bookingSection = document.getElementById("booking");
          if (bookingSection) {
            bookingSection.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        }}
      />

      {/* SEAT MAP MODAL */}
      <SeatMapModal
        open={seatMapOpen}
        onClose={() => setSeatMapOpen(false)}
        selectedSeat={form.seat}
        onSelectSeat={(seat) => setForm((prev) => ({ ...prev, seat }))}
        fromCity={tripType === "multicity" ? multiCityLegs[0]?.from || form.from : form.from}
        toCity={tripType === "multicity" ? multiCityLegs[0]?.to || form.to : form.to}
        flightNo={selectedOutboundFlight?.flightNo || (tripType === "multicity" ? selectedMultiCityFlights[0]?.flightNo : "BTN201")}
        aircraftModel={selectedOutboundFlight?.aircraft?.model || (tripType === "multicity" ? selectedMultiCityFlights[0]?.aircraft?.model : "Airbus A320-200")}
        aircraftTail={selectedOutboundFlight?.aircraft?.tailNumber || (tripType === "multicity" ? selectedMultiCityFlights[0]?.aircraft?.tailNumber : "HS-BNA")}
        maxSeats={form.passengers}
      />
    </>
  );
}

function Field({ label, htmlFor, children, onClick, required, isError, errorText, className = "", containerRef }: { label: React.ReactNode; htmlFor?: string; children: React.ReactNode; onClick?: () => void; required?: boolean; isError?: boolean; errorText?: string; className?: string; containerRef?: React.Ref<HTMLDivElement> }) {
  const { language } = useTranslation();
  return (
    <div
      ref={containerRef}
      onClick={onClick}
      className={`block rounded-2xl px-4 py-3.5 border shadow-xs transition-all relative ${className} ${
        isError
          ? "border-2 border-rose-500 dark:border-rose-500 ring-4 ring-rose-500/20 bg-rose-50/60 dark:bg-rose-950/40"
          : "bg-[var(--input)] border-[var(--border)] " + (onClick
          ? "cursor-pointer hover:bg-slate-100/70 dark:hover:bg-slate-800/80 hover:border-sky-500 dark:hover:border-sky-400 hover:shadow-md hover:ring-2 hover:ring-sky-500/20 active:scale-98"
          : "focus-within:border-[var(--primary)] focus-within:shadow-md focus-within:ring-2 focus-within:ring-[var(--primary)]/10")
      }`}
    >
      <div className="flex items-center justify-between gap-1">
        <label htmlFor={htmlFor} className={`text-[10px] font-bold uppercase tracking-wider block cursor-pointer select-none ${isError ? 'text-rose-600 dark:text-rose-400 font-black' : 'text-[var(--muted-foreground)]'}`}>
          {label}
          {required && <span className="text-rose-500 ml-1 font-bold">*</span>}
        </label>
        {isError && (
          <span className="text-[10px] font-extrabold text-rose-700 dark:text-rose-300 bg-rose-200/80 dark:bg-rose-900/80 px-2 py-0.5 rounded-full uppercase tracking-wider animate-pulse">
            {errorText ? (language === 'th' ? 'ไม่ถูกต้อง' : 'Invalid') : (language === 'th' ? 'เลือกเมืองซ้ำกันไม่ได้' : 'Cannot select same city')}
          </span>
        )}
      </div>
      <div className="mt-1">{children}</div>
      {isError && errorText && (
        <p className="mt-1.5 text-xs font-bold text-rose-600 dark:text-rose-400 flex items-center gap-1">
          <span>⚠️ {errorText}</span>
        </p>
      )}
    </div>
  );
}

function TicketModal({ booking, open, onClose }: { booking: any, open: boolean, onClose: () => void }) {
  const { t, language } = useTranslation();
  const [activeLeg, setActiveLeg] = useState(0);

  useEffect(() => {
    setActiveLeg(0);
  }, [open, booking]);

  if (!booking) return null;

  const isMultiCity = booking.tripType === "multicity" && Array.isArray(booking.legs) && booking.legs.length > 0;
  const currentLeg = isMultiCity ? booking.legs[activeLeg] || booking.legs[0] : null;

  const getCode = (city: string) => (city || "").match(/\(([A-Z]{3})\)/)?.[1] || "N/A";
  const getCleanCity = (city: string) => {
    return getCityLabelForLang(city || "", language).split('(')[0].trim();
  };

  const originCity = currentLeg ? currentLeg.from : booking.from;
  const destCity = currentLeg ? currentLeg.to : booking.to;

  // Generate stable flight number, seat number, and price based on passenger name hash
  const passengerHash = booking.passengerName
    ? booking.passengerName.split('').reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0)
    : 123;
  const flightNumber = currentLeg?.flightNo || booking.outboundFlightNo || `BTN${(passengerHash % 899) + 100}`;
  const seatRow = (passengerHash % 30) + 1;
  const seatLetter = ['A', 'B', 'C', 'D', 'E', 'F'][passengerHash % 6];
  const seatNumber = booking.seat || `${seatRow}${seatLetter}`;
  const flightClass = booking.class === "business" ? t('flight.cabin_business') : t('flight.cabin_economy');

  const basePrice = booking.pricePerPax || (booking.to?.includes("เชียงใหม่") || booking.to?.includes("ภูเก็ต") ? 890 : 990);
  const totalPrice = basePrice * booking.passengers;

  // Calculate discount from promo codes (e.g. SKYPROMO2026, PROMO2026)
  const promoUpper = (booking.promoCode || "").trim().toUpperCase();
  const discountPercent = getPromoDiscountRate(promoUpper);
  const discountAmount = totalPrice * discountPercent;
  const finalPrice = totalPrice - discountAmount;

  const getArrivalTime = (departTime: string) => {
    if (!departTime) return language === 'th' ? "11:45 น." : "11:45 AM";
    const [h, m] = departTime.split(':').map(Number);
    let newH = h + 1;
    let newM = m + 15;
    if (newM >= 60) {
      newH += 1;
      newM -= 60;
    }
    const h24 = newH.toString().padStart(2, '0');
    const mStr = newM.toString().padStart(2, '0');
    if (language === 'th') {
      return `${h24}:${mStr} น.`;
    }
    const suffix = newH >= 12 ? 'PM' : 'AM';
    const displayH = newH > 12 ? newH - 12 : newH;
    return `${displayH.toString().padStart(2, '0')}:${mStr} ${suffix}`;
  };

  const legDepartDate = currentLeg ? currentLeg.departDate : booking.departDate;
  const outboundDepart = currentLeg ? (currentLeg.departTime || "07:30") : (booking.outboundTime || "07:30");
  const outboundArrive = currentLeg?.arrivalTime || getArrivalTime(outboundDepart);
  const inboundDepart = booking.inboundTime || "09:00";

  return (
    <Dialog open={open} onOpenChange={(isOpen) => { if (!isOpen) onClose(); }}>
      <DialogContent
        onPointerDownOutside={() => onClose()}
        onInteractOutside={() => onClose()}
        className="max-h-[92vh] overflow-y-auto overflow-x-hidden rounded-3xl border border-slate-200 dark:border-slate-800 p-0 max-w-[calc(100vw-1.5rem)] sm:max-w-md bg-[#eef6fc] dark:bg-slate-900 text-slate-800 dark:text-slate-100 shadow-2xl font-display"
      >
        <div className="p-4 sm:p-7 relative select-none">

          {/* Header branding (Top center) */}
          <div className="flex justify-between items-center mb-4 sm:mb-6 pr-8">
            <div className="flex items-center gap-1.5">
              <span className="font-display font-black text-lg text-sky-950 dark:text-sky-100 tracking-tight">BotnoiAir</span>
            </div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-sky-900/60 dark:text-sky-200 bg-sky-200/40 dark:bg-sky-900/40 px-2.5 py-1 rounded-full">
              {t('flight.boarding_pass_tag')}
            </div>
          </div>

          {/* Multi-City Leg Switcher */}
          {isMultiCity && (
            <div className="mb-4">
              <div className="flex items-center gap-1.5 p-1 rounded-xl bg-sky-100/70 dark:bg-slate-800/80 border border-sky-200/60 dark:border-slate-700/60 overflow-x-auto no-scrollbar">
                {booking.legs.map((leg: any, idx: number) => {
                  const isSelected = activeLeg === idx;
                  const fromCode = getCode(leg.from);
                  const toCode = getCode(leg.to);
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveLeg(idx)}
                      className={`flex-1 min-w-[90px] py-1.5 px-2.5 rounded-lg text-[10px] font-black tracking-tight transition-all cursor-pointer truncate ${
                        isSelected
                          ? "bg-white dark:bg-sky-600 text-sky-950 dark:text-white shadow-xs"
                          : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                      }`}
                    >
                      {language === 'th' ? `เที่ยวที่ ${idx + 1}` : `Flight ${idx + 1}`}: {fromCode} → {toCode}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Route Display */}
          <div className="flex justify-between items-end mb-1">
            <div title={getCityFullName(originCity, language)}>
              <div className="text-3xl sm:text-4xl font-black font-display text-sky-950 dark:text-sky-100 tracking-tight leading-none cursor-help" title={getCityFullName(originCity, language)}>{getCode(originCity)}</div>
              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1 cursor-help underline decoration-dotted underline-offset-2" title={getCityFullName(originCity, language)}>{getCleanCity(originCity)}</div>
            </div>
            <div className="text-right" title={getCityFullName(destCity, language)}>
              <div className="text-3xl sm:text-4xl font-black font-display text-sky-950 dark:text-sky-100 tracking-tight leading-none cursor-help" title={getCityFullName(destCity, language)}>{getCode(destCity)}</div>
              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1 cursor-help underline decoration-dotted underline-offset-2" title={getCityFullName(destCity, language)}>{getCleanCity(destCity)}</div>
            </div>
          </div>

          {/* Connection line with Plane icon */}
          <div className="flex items-center w-full my-3 sm:my-5 relative">
            {/* Left dot */}
            <div className="w-4 h-4 rounded-full bg-sky-200 dark:bg-sky-900/60 flex items-center justify-center shrink-0">
              <div className="w-1.5 h-1.5 rounded-full bg-sky-600 dark:bg-sky-400"></div>
            </div>

            {/* Left dashed line */}
            <div className="flex-1 border-t-2 border-dashed border-sky-200/80 dark:border-sky-800/80 mx-2"></div>

            {/* Center rotated Plane icon */}
            <div className="px-2 text-sky-950 dark:text-sky-200 shrink-0 transform rotate-45">
              <Plane className="w-5 h-5 sm:w-6 sm:h-6 fill-current stroke-[1.5]" />
            </div>

            {/* Right dashed line */}
            <div className="flex-1 border-t-2 border-dashed border-sky-200/80 dark:border-sky-800/80 mx-2"></div>

            {/* Right dot */}
            <div className="w-4 h-4 rounded-full bg-sky-200 dark:bg-sky-900/60 flex items-center justify-center shrink-0">
              <div className="w-1.5 h-1.5 rounded-full bg-sky-600 dark:bg-sky-400"></div>
            </div>
          </div>

          {/* Depart & Arrive details */}
          <div className="grid grid-cols-3 gap-2 mb-4 sm:mb-6">
            <div className="text-left">
              <div className="text-[9px] text-slate-400 dark:text-slate-400 font-bold uppercase tracking-wider">{t('flight.modal_depart')}</div>
              <div className="font-extrabold text-xs sm:text-sm text-slate-800 dark:text-slate-200 mt-0.5">
                {(() => {
                  const p = parseDateForCard(legDepartDate, 0, language);
                  return `${p.day} ${p.month} ${p.year}`;
                })()}
              </div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                {language === 'th' ? `${outboundDepart} น.` : outboundDepart}
              </div>
            </div>
            <div className="text-center flex flex-col justify-center">
              <div className="font-extrabold text-xs text-slate-700 dark:text-slate-300">{flightNumber}</div>
              <div className="text-[10px] text-slate-400 dark:text-slate-400 font-medium mt-0.5">{t('flight.non_stop')}</div>
            </div>
            <div className="text-right">
              <div className="text-[9px] text-slate-400 dark:text-slate-400 font-bold uppercase tracking-wider">
                {booking.tripType === "round" && booking.returnDate ? t('flight.modal_return') : t('flight.modal_arrive')}
              </div>
              <div className="font-extrabold text-xs sm:text-sm text-slate-800 dark:text-slate-200 mt-0.5">
                {(() => {
                  const targetDate = booking.tripType === "round" && booking.returnDate ? booking.returnDate : legDepartDate;
                  const p = parseDateForCard(targetDate, 0, language);
                  return `${p.day} ${p.month} ${p.year}`;
                })()}
              </div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                {booking.tripType === "round" && booking.returnDate ? (language === 'th' ? `${inboundDepart} น.` : inboundDepart) : outboundArrive}
              </div>
            </div>
          </div>

          {/* Dashed separator */}
          <div className="border-t border-dashed border-sky-200/80 dark:border-sky-800/80 my-3 sm:my-5"></div>

          {/* Passenger details grid */}
          <div className="grid grid-cols-3 gap-y-3 sm:gap-y-4 gap-x-2 text-left mb-4 sm:mb-6">
            <div className="col-span-2">
              <p className="text-[9px] text-slate-400 dark:text-slate-400 uppercase font-bold tracking-wider mb-0.5">{t('flight.modal_passenger')}</p>
              <p className="font-bold text-xs sm:text-sm text-slate-800 dark:text-slate-200 truncate pr-2">{booking.passengerName}</p>
            </div>
            <div>
              <p className="text-[9px] text-slate-400 dark:text-slate-400 uppercase font-bold tracking-wider mb-0.5">{t('flight.modal_seat')}</p>
              <p className="font-bold text-xs sm:text-sm text-slate-800 dark:text-slate-200">{seatNumber}</p>
            </div>

            <div className="col-span-2">
              <p className="text-[9px] text-slate-400 dark:text-slate-400 uppercase font-bold tracking-wider mb-0.5">{t('flight.modal_class_status')}</p>
              <p className="font-bold text-xs sm:text-sm text-slate-800 dark:text-slate-200">{flightClass} / {t('flight.status_confirmed')}</p>
            </div>
            <div>
              <p className="text-[9px] text-slate-400 dark:text-slate-400 uppercase font-bold tracking-wider mb-0.5">{t('flight.modal_passengers_num')}</p>
              <p className="font-bold text-xs sm:text-sm text-slate-800 dark:text-slate-200">{booking.passengers}</p>
            </div>
          </div>

          {/* Barcode and price */}
          <div className="border-t border-dashed border-sky-200/80 dark:border-sky-800/80 pt-3 sm:pt-5 mt-3 sm:mt-5 flex justify-between items-center">
            {/* Mock price */}
            <div className="text-left">
              <div className="text-[9px] text-slate-400 dark:text-slate-400 uppercase font-bold tracking-wider mb-0.5">{t('flight.total_fare')}</div>
              <div className="flex flex-col">
                <div className="flex items-baseline gap-1">
                  <span className="text-lg sm:text-xl font-black text-sky-950 dark:text-sky-100">฿{finalPrice.toLocaleString()}</span>
                  <span className="text-[9px] text-slate-400 dark:text-slate-400">/{booking.passengers} {t('flight.pax_suffix')}</span>
                </div>
                {discountAmount > 0 && (
                  <span className="text-[9px] text-emerald-600 dark:text-emerald-400 font-bold block mt-0.5">
                    ({t('flight.saved_amount')} ฿{discountAmount.toLocaleString()} via {promoUpper})
                  </span>
                )}
              </div>
            </div>

            {/* Barcode mockup */}
            <div className="h-8 sm:h-9 w-24 sm:w-32 opacity-80 dark:invert" style={{ background: "repeating-linear-gradient(95deg, #1e293b, #1e293b 2px, transparent 2px, transparent 4px, #1e293b 4px, #1e293b 6px, transparent 6px, transparent 10px, #1e293b 10px, #1e293b 14px, transparent 14px, transparent 16px)" }}></div>
          </div>

          {/* Close button at the bottom */}
          <div className="mt-5 sm:mt-8 flex justify-center">
            <button
              type="button"
              onClick={onClose}
              id="confirm-ticket-modal"
              className="w-full py-2.5 sm:py-3 bg-sky-950 dark:bg-sky-600 text-white font-bold text-xs rounded-2xl shadow-md hover:bg-sky-900 dark:hover:bg-sky-500 active:scale-98 transition-all cursor-pointer"
            >
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
  flightNo?: string;
  aircraftModel?: string;
  aircraftTail?: string;
  maxSeats?: number;
}

function SeatMapModal({
  open,
  onClose,
  selectedSeat,
  onSelectSeat,
  fromCity,
  toCity,
  flightNo = "BTN201",
  aircraftModel = "Airbus A320-200",
  aircraftTail = "HS-BNA",
  maxSeats = 1
}: SeatMapModalProps) {
  const { t, language } = useTranslation();
  const getCode = (city: string) => city.match(/\(([A-Z]{3})\)/)?.[1] || "N/A";

  const [currentSeats, setCurrentSeats] = useState<string[]>([]);

  useEffect(() => {
    if (open) {
      const parsed = (selectedSeat || "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      setCurrentSeats(parsed);
    }
  }, [open, selectedSeat]);

  // Dynamic list of occupied seats combining admin locked seats & bookings from storage
  const OCCUPIED_SEATS = useMemo(() => {
    const adminLocked = getLockedSeats(flightNo);
    const existing = getBookings();
    const booked = existing
      .filter((b: Booking) => {
        if (flightNo && (b.outboundFlightNo === flightNo || b.inboundFlightNo === flightNo || b.legs?.some(l => l.flightNo === flightNo))) {
          return Boolean(b.seat);
        }
        return b.from === fromCity && b.to === toCity && Boolean(b.seat);
      })
      .flatMap((b: Booking) => (b.seat as string).split(',').map(s => s.trim()).filter(Boolean));
    return Array.from(new Set([...adminLocked, ...booked]));
  }, [fromCity, toCity, flightNo, open]);

  // Rows 1 to 10
  const rows = Array.from({ length: 10 }, (_, i) => i + 1);
  const leftCols = ["A", "B", "C"];
  const rightCols = ["D", "E", "F"];

  const handleSeatClick = (seatId: string) => {
    if (OCCUPIED_SEATS.includes(seatId)) return;

    if (currentSeats.includes(seatId)) {
      // Toggle off
      setCurrentSeats((prev) => prev.filter((s) => s !== seatId));
    } else {
      // Select
      if (maxSeats === 1) {
        setCurrentSeats([seatId]);
      } else if (currentSeats.length < maxSeats) {
        setCurrentSeats((prev) => [...prev, seatId]);
      } else {
        // Reached maxSeats -> replace the oldest selected seat (FIFO)
        setCurrentSeats((prev) => [...prev.slice(1), seatId]);
      }
    }
  };

  const saveAndClose = () => {
    if (currentSeats.length > 0) {
      const sorted = [...currentSeats].sort((a, b) => {
        const numA = parseInt(a, 10);
        const numB = parseInt(b, 10);
        if (numA !== numB) return numA - numB;
        return a.localeCompare(b);
      });
      onSelectSeat(sorted.join(", "));
    } else {
      onSelectSeat("");
    }
    onClose();
  };

  const handleConfirm = () => {
    saveAndClose();
  };

  const isComplete = currentSeats.length === maxSeats;
  const remainingSeats = maxSeats - currentSeats.length;

  return (
    <Dialog open={open} onOpenChange={(isOpen) => { if (!isOpen) saveAndClose(); }}>
      <DialogContent
        onPointerDownOutside={() => saveAndClose()}
        onInteractOutside={() => saveAndClose()}
        className="max-h-[90vh] overflow-y-auto overflow-x-hidden rounded-3xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 p-0 sm:max-w-md bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 shadow-2xl"
      >
        <div className="p-6 relative select-none">
          {/* Header */}
          <div className="text-center mb-5">
            <h3 className="font-display font-black text-xl text-sky-950 dark:text-white tracking-tight">
              {t('flight.seat_picker_title')}
            </h3>
            <div className="flex items-center justify-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mt-1 font-mono">
              <span className="font-bold text-slate-800 dark:text-slate-200">{flightNo}</span>
              <span>·</span>
              <span>{aircraftModel} ({aircraftTail})</span>
            </div>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
              <span title={getCityFullName(fromCity, language)} className="cursor-help underline decoration-dotted underline-offset-2">{getCode(fromCity)}</span>
              {" → "}
              <span title={getCityFullName(toCity, language)} className="cursor-help underline decoration-dotted underline-offset-2">{getCode(toCity)}</span>
            </p>
            {/* Passenger Count Badge */}
            <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800 text-sky-700 dark:text-sky-300">
              <span>{language === 'th' ? `ผู้โดยสาร ${maxSeats} ท่าน` : `${maxSeats} Passenger${maxSeats > 1 ? 's' : ''}`}</span>
              <span>•</span>
              <span>{language === 'th' ? `เลือกแล้ว ${currentSeats.length}/${maxSeats} ที่นั่ง` : `Selected ${currentSeats.length}/${maxSeats}`}</span>
            </div>
          </div>

          {/* Seat Legend */}
          <div className="flex justify-center gap-5 text-xs mb-5 bg-slate-50 dark:bg-slate-800/60 py-2.5 rounded-2xl border border-slate-100 dark:border-slate-700/60">
            <div className="flex items-center gap-1.5">
              <div className="w-3.5 h-3.5 rounded-full bg-[#cbdcf7] dark:bg-sky-900/60 border border-[#cbdcf7] dark:border-sky-700"></div>
              <span className="text-[#0f3460] dark:text-sky-300 font-medium text-[11px]">{t('flight.seat_available')}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3.5 h-3.5 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center"><span className="text-[7px] text-slate-400 dark:text-slate-500 line-through">✕</span></div>
              <span className="text-slate-400 dark:text-slate-400 text-[11px]">{t('flight.seat_occupied')}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3.5 h-3.5 rounded-full bg-[#0f3460] dark:bg-sky-600 border border-[#0f3460] dark:border-sky-500"></div>
              <span className="text-[#0f3460] dark:text-sky-300 font-bold text-[11px]">{t('flight.seat_selected')}</span>
            </div>
          </div>

          {/* Airplane Seat Map Container */}
          <div className="max-w-[340px] mx-auto bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/60 rounded-3xl p-4 pt-8 relative overflow-hidden">
            {/* Mock Cockpit at the top */}
            <div className="w-32 h-10 border-t-2 border-x-2 border-slate-200 dark:border-slate-700 rounded-t-full mx-auto mb-6 flex items-center justify-center bg-white dark:bg-slate-800 relative">
              <div className="w-1.5 h-1.5 rounded-full bg-slate-200 dark:bg-slate-600 absolute left-4 bottom-2"></div>
              <div className="w-1.5 h-1.5 rounded-full bg-slate-200 dark:bg-slate-600 absolute right-4 bottom-2"></div>
              <span className="text-[9px] font-bold text-slate-400 dark:text-slate-400 tracking-widest uppercase">{t('flight.cockpit')}</span>
            </div>

            {/* Cabin Seats Rows */}
            <div className="space-y-2.5">
              {rows.map((row) => (
                <div key={row} className="flex items-center justify-between gap-1.5 px-1">
                  {/* Left seats A, B, C */}
                  <div className="flex items-center gap-1.5">
                    {leftCols.map((col) => {
                      const seatId = `${row}${col}`;
                      const isOccupied = OCCUPIED_SEATS.includes(seatId);
                      const isSelected = currentSeats.includes(seatId);

                      return (
                        <button
                          key={seatId}
                          type="button"
                          disabled={isOccupied}
                          onClick={() => handleSeatClick(seatId)}
                          className={`w-9 h-9 min-w-[36px] min-h-[36px] max-w-[36px] max-h-[36px] aspect-square rounded-full text-[10px] font-bold border transition-colors cursor-pointer flex items-center justify-center shrink-0 ${isOccupied
                            ? "bg-slate-100 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-400/60 dark:text-slate-500 line-through cursor-not-allowed"
                            : isSelected
                              ? "bg-[#0066FF] dark:bg-sky-500 border-[#0066FF] dark:border-sky-400 text-white font-extrabold shadow-sm ring-2 ring-sky-400/50"
                              : "bg-[#cbdcf7]/70 dark:bg-sky-950/60 border-[#cbdcf7] dark:border-sky-800 text-[#0f3460] dark:text-sky-200 hover:bg-[#cbdcf7] dark:hover:bg-sky-900/80 hover:border-[#9abcee] dark:hover:border-sky-600"
                            }`}
                        >
                          {seatId}
                        </button>
                      );
                    })}
                  </div>

                  {/* Aisle spacer with row number indicator */}
                  <div className="w-5 text-center text-[10px] font-bold text-slate-400 dark:text-slate-500 select-none">
                    {row}
                  </div>

                  {/* Right seats D, E, F */}
                  <div className="flex items-center gap-1.5">
                    {rightCols.map((col) => {
                      const seatId = `${row}${col}`;
                      const isOccupied = OCCUPIED_SEATS.includes(seatId);
                      const isSelected = currentSeats.includes(seatId);

                      return (
                        <button
                          key={seatId}
                          type="button"
                          disabled={isOccupied}
                          onClick={() => handleSeatClick(seatId)}
                          className={`w-9 h-9 min-w-[36px] min-h-[36px] max-w-[36px] max-h-[36px] aspect-square rounded-full text-[10px] font-bold border transition-colors cursor-pointer flex items-center justify-center shrink-0 ${isOccupied
                            ? "bg-slate-100 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-400/60 dark:text-slate-500 line-through cursor-not-allowed"
                            : isSelected
                              ? "bg-[#0066FF] dark:bg-sky-500 border-[#0066FF] dark:border-sky-400 text-white font-extrabold shadow-sm ring-2 ring-sky-400/50"
                              : "bg-[#cbdcf7]/70 dark:bg-sky-950/60 border-[#cbdcf7] dark:border-sky-800 text-[#0f3460] dark:text-sky-200 hover:bg-[#cbdcf7] dark:hover:bg-sky-900/80 hover:border-[#9abcee] dark:hover:border-sky-600"
                            }`}
                        >
                          {seatId}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Exit indicators at the bottom */}
            <div className="flex justify-between items-center mt-6 text-[9px] font-bold text-slate-400 dark:text-slate-500 px-4">
              <span className="flex items-center gap-1">{language === 'th' ? '◀ ทางออก' : '◀ EXIT'}</span>
              <span className="flex items-center gap-1">{language === 'th' ? 'ทางออก ▶' : 'EXIT ▶'}</span>
            </div>
          </div>

          {/* Selection Status & Confirm Button */}
          <div className="mt-6 flex flex-col gap-3">
            {currentSeats.length > 0 ? (
              <div className={`text-center text-xs font-bold py-2.5 px-3 rounded-2xl border ${
                isComplete
                  ? "text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-800/60"
                  : "text-[#0f3460] dark:text-sky-300 bg-[#cbdcf7]/30 dark:bg-sky-950/50 border-[#cbdcf7]/40 dark:border-sky-800/60"
              }`}>
                {isComplete ? (
                  <span>
                    ✓ {language === 'th' ? `เลือกครบ ${maxSeats} ที่นั่งแล้ว:` : `Selected all ${maxSeats} seat(s):`} <strong>{currentSeats.join(", ")}</strong>
                  </span>
                ) : (
                  <span>
                    {language === 'th'
                      ? `เลือกแล้ว: ${currentSeats.join(", ")} (กรุณาเลือกเพิ่มอีก ${remainingSeats} ที่นั่ง)`
                      : `Selected: ${currentSeats.join(", ")} (Please select ${remainingSeats} more)`}
                  </span>
                )}
              </div>
            ) : (
              <div className="text-center text-xs text-rose-600 dark:text-rose-400 font-bold bg-rose-50 dark:bg-rose-950/40 border border-rose-200/50 dark:border-rose-900/60 py-2.5 rounded-2xl">
                {language === 'th' ? `กรุณาเลือกที่นั่งสำหรับผู้โดยสาร ${maxSeats} ท่าน` : `Please select seats for ${maxSeats} passenger(s)`}
              </div>
            )}

            <button
              type="button"
              disabled={currentSeats.length === 0}
              onClick={handleConfirm}
              className={`w-full py-3.5 font-display font-bold text-xs rounded-2xl shadow-md transition-all cursor-pointer ${
                currentSeats.length > 0
                  ? "bg-[#0f3460] dark:bg-sky-600 hover:bg-[#0c2a50] dark:hover:bg-sky-500 text-white hover:shadow-lg active:scale-98"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed border border-slate-200 dark:border-slate-700"
              }`}
            >
              {language === 'th'
                ? `ยืนยันที่นั่ง (${currentSeats.length}/${maxSeats})`
                : `Confirm Seats (${currentSeats.length}/${maxSeats})`}
            </button>
          </div>

        </div>
      </DialogContent>
    </Dialog>
  );
}