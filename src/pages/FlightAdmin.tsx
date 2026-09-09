import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "@/lib/LanguageContext";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  getBookings,
  deleteBooking,
  clearBookings,
  getLockedSeats,
  toggleSeatLock,
  unlockAllSeats,
  resetLockedSeatsToDefault,
  releaseSeatBooking,
  MOCK_FLEET,
  type Booking,
} from "@/lib/bookings";
import { getCityFullName } from "@/lib/cities";
import { Toaster, toast } from "sonner";
import { ThailandFlightMap } from "@/components/ThailandFlightMap";
import {
  fetchLiveDestinationWeather,
  type DestinationWeather,
} from "@/lib/weather";
import {
  Lock,
  User,
  RefreshCw,
  Plane,
  Search,
  Layers,
  Wifi,
  Luggage,
  Zap,
  Tv,
  ArrowUpRight,
  Plus,
  Minus,
  CloudRain,
  CloudSun,
  Sun,
  Cloud,
  CloudDrizzle,
  CloudLightning,
  CloudFog,
  Loader2,
  Armchair,
  Check,
} from "lucide-react";

export default function FlightAdmin() {
  const { t, language } = useTranslation();
  const [activeTab, setActiveTab] = useState<"dashboard" | "bookings">("dashboard");
  const [items, setItems] = useState<Booking[]>([]);
  const [selectedFlightNo, setSelectedFlightNo] = useState<string>("BTN201");
  const [lockedSeats, setLockedSeatsState] = useState<string[]>([]);
  const [q, setQ] = useState("");
  const [activeSubTab, setActiveSubTab] = useState<"details" | "price" | "refund" | "reschedule" | "offers">("details");
  const [selectedDeck, setSelectedDeck] = useState<number>(1);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [activeBookedSeatModal, setActiveBookedSeatModal] = useState<{ seatId: string; booking: Booking } | null>(null);
  const [flightFilterQuery, setFlightFilterQuery] = useState("");

  const currentAircraft = useMemo(() => {
    return MOCK_FLEET.find((f) => f.flightNo === selectedFlightNo) || MOCK_FLEET[0];
  }, [selectedFlightNo]);

  const refreshData = () => {
    setItems(getBookings());
    setLockedSeatsState(getLockedSeats(selectedFlightNo));
  };

  useEffect(() => {
    refreshData();
  }, []);

  useEffect(() => {
    setLockedSeatsState(getLockedSeats(selectedFlightNo));
  }, [selectedFlightNo]);

  const getCityLabel = (city: string) => {
    if (language !== "th") {
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

  // Filtered bookings for manifest
  const filteredBookings = items.filter((b) =>
    [b.passengerName, b.email, b.from, b.to, b.phone, b.seat || "", b.outboundFlightNo || "", b.aircraftModel || ""].join(" ").toLowerCase().includes(q.toLowerCase())
  );

  // Seat matrix (10 rows x 6 cols)
  const rows = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const topRows = ["F", "E", "D"];
  const bottomRows = ["C", "B", "A"];
  const allCols = ["A", "B", "C", "D", "E", "F"];

  // Map seat status
  const seatStatusMap = useMemo(() => {
    const map = new Map<string, { status: "available" | "locked" | "booked"; booking?: Booking }>();

    rows.forEach((r) => {
      allCols.forEach((c) => {
        const seatId = `${r}${c}`;
        const booking = items.find((b) => {
          if (!b.seat) return false;
          const seats = b.seat.split(",").map((s) => s.trim());
          if (!seats.includes(seatId)) return false;
          if (b.outboundFlightNo === selectedFlightNo || b.inboundFlightNo === selectedFlightNo || b.legs?.some((l) => l.flightNo === selectedFlightNo)) {
            return true;
          }
          return !b.outboundFlightNo;
        });

        if (booking) {
          map.set(seatId, { status: "booked", booking });
        } else if (lockedSeats.includes(seatId)) {
          map.set(seatId, { status: "locked" });
        } else {
          map.set(seatId, { status: "available" });
        }
      });
    });

    return map;
  }, [items, lockedSeats, selectedFlightNo, rows, allCols]);

  // Seat Counts
  const totalSeats = 60;
  const bookedCount = useMemo(() => {
    let count = 0;
    seatStatusMap.forEach((v) => {
      if (v.status === "booked") count++;
    });
    return count;
  }, [seatStatusMap]);

  const lockedCount = useMemo(() => {
    let count = 0;
    seatStatusMap.forEach((v) => {
      if (v.status === "locked") count++;
    });
    return count;
  }, [seatStatusMap]);

  const availableCount = totalSeats - bookedCount - lockedCount;

  // Actions
  const handleToggleLock = (seatId: string) => {
    const seatInfo = seatStatusMap.get(seatId);
    const status = seatInfo?.status;

    if (status === "booked") {
      if (seatInfo?.booking) {
        setActiveBookedSeatModal({ seatId, booking: seatInfo.booking });
      } else {
        // Fallback if booking object is somehow detached
        const result = releaseSeatBooking(seatId, selectedFlightNo);
        setItems(result.updatedBookings);
        setLockedSeatsState(result.updatedLockedSeats);
        toast.success(
          language === "th"
            ? `🔓 ปลดล็อคที่นั่ง ${seatId} เรียบร้อยแล้ว (ที่นั่งว่าง)`
            : `🔓 Unlocked seat ${seatId} (Now available)`
        );
      }
      return;
    }

    const updated = toggleSeatLock(seatId, selectedFlightNo);
    setLockedSeatsState(updated);
    if (updated.includes(seatId)) {
      toast.success(
        language === "th"
          ? `🔒 ล็อคที่นั่ง ${seatId} บนเที่ยวบิน ${selectedFlightNo} สำเร็จ`
          : `🔒 Locked seat ${seatId} on ${selectedFlightNo}`
      );
    } else {
      toast.success(
        language === "th"
          ? `🔓 ปลดล็อคที่นั่ง ${seatId} บนเที่ยวบิน ${selectedFlightNo} สำเร็จ`
          : `🔓 Unlocked seat ${seatId} on ${selectedFlightNo}`
      );
    }
  };

  const handleReleaseBookedSeat = (seatId: string) => {
    const result = releaseSeatBooking(seatId, selectedFlightNo);
    setItems(result.updatedBookings);
    setLockedSeatsState(result.updatedLockedSeats);
    setActiveBookedSeatModal(null);
    toast.success(
      language === "th"
        ? `🔓 ปลดล็อคและยกเลิกการจองที่นั่ง ${seatId} สำเร็จแล้ว (ที่นั่งกลับมาว่าง)`
        : `🔓 Released & unlocked seat ${seatId}. Seat is now available.`
    );
  };

  const handleUnlockAll = () => {
    const updated = unlockAllSeats(selectedFlightNo);
    setLockedSeatsState(updated);
    toast.success(language === "th" ? `🔓 ปลดล็อคที่นั่งทั้งหมดของ ${selectedFlightNo} แล้ว` : `🔓 All locked seats unlocked on ${selectedFlightNo}`);
  };

  const handleResetDefaults = () => {
    const updated = resetLockedSeatsToDefault(selectedFlightNo);
    setLockedSeatsState(updated);
    toast.success(language === "th" ? `🔄 รีเซ็ตค่าเริ่มต้นของ ${selectedFlightNo} แล้ว` : `🔄 Reset to default seats for ${selectedFlightNo}`);
  };

  const handleChooseSeatsClick = () => {
    const seatSection = document.getElementById("cabin-seat-map");
    if (seatSection) {
      seatSection.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    toast.info(
      language === "th"
        ? "✈️ คลิกเลือก/ล็อคที่นั่งได้โดยตรงบนแผนผังเครื่องบินด้านบน"
        : "✈️ Click to select or lock seats directly on the aircraft cabin map above."
    );
  };

  // Fleet metadata enrichment for realistic card display with Thai domestic provinces
  const fleetCards = useMemo(() => {
    return MOCK_FLEET.map((plane) => {
      const priceStr = plane.priceStr || (plane.price ? `฿${plane.price.toLocaleString()}` : "฿890");
      const depDate = plane.depTime ? `${plane.depTime} น.` : "06:15 น.";
      const arrDate = plane.arrTime ? `${plane.arrTime} น.` : "07:30 น.";
      const durationStr = plane.durationStr || "1 ชม. 15 นาที";
      const originCity = plane.originCity || "กรุงเทพฯ (DMK)";
      const originCode = plane.originCode || "DMK";
      const destCity = plane.destCity || "เชียงใหม่ (CNX)";
      const destCode = plane.destCode || "CNX";
      const terminalInfo = plane.terminalInfo || "อาคาร 2 (ดอนเมือง)";

      return {
        ...plane,
        priceStr,
        depDate,
        arrDate,
        durationStr,
        originCity,
        originCode,
        destCity,
        destCode,
        terminalInfo,
      };
    });
  }, []);

  const filteredFleetCards = useMemo(() => {
    if (!flightFilterQuery.trim()) return fleetCards;
    const qLower = flightFilterQuery.toLowerCase().trim();
    return fleetCards.filter((p) => {
      const text = `${p.flightNo} ${p.airlineName} ${p.originCity} ${p.originCode} ${p.destCity} ${p.destCode} ${p.route}`.toLowerCase();
      return text.includes(qLower);
    });
  }, [fleetCards, flightFilterQuery]);

  const activeFlightData = fleetCards.find((f) => f.flightNo === selectedFlightNo) || fleetCards[0];

  const [weather, setWeather] = useState<DestinationWeather | null>(null);
  const [weatherLoading, setWeatherLoading] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;
    const destCode = activeFlightData.destCode || "CNX";
    setWeatherLoading(true);
    fetchLiveDestinationWeather(destCode)
      .then((data) => {
        if (isMounted) {
          setWeather(data);
          setWeatherLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) setWeatherLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, [activeFlightData.destCode]);

  const renderWeatherIcon = (iconType?: string) => {
    switch (iconType) {
      case "sun":
        return <Sun className="w-5 h-5 text-amber-500 shrink-0" />;
      case "cloud-sun":
        return <CloudSun className="w-5 h-5 text-amber-500 shrink-0" />;
      case "cloud":
        return <Cloud className="w-5 h-5 text-slate-400 shrink-0" />;
      case "drizzle":
        return <CloudDrizzle className="w-5 h-5 text-sky-400 shrink-0" />;
      case "thunder":
        return <CloudLightning className="w-5 h-5 text-purple-500 shrink-0" />;
      case "fog":
        return <CloudFog className="w-5 h-5 text-slate-400 shrink-0" />;
      case "rain":
      default:
        return <CloudRain className="w-5 h-5 text-sky-500 shrink-0" />;
    }
  };

  return (
    <div className="min-h-screen bg-[#f0f4f9] dark:bg-[#0b0d13] text-slate-900 dark:text-slate-100 antialiased font-sans pb-16">
      <Toaster
        position="bottom-center"
        theme="dark"
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

      {/* Top Header Bar */}
      <header className="px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Flight Operations
          </h1>
          <div className="flex items-center bg-white/80 dark:bg-slate-900/80 p-1 rounded-2xl shadow-xs border border-slate-200/80 dark:border-slate-800">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === "dashboard"
                  ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
              }`}
            >
              Operations & Seats
            </button>
            <button
              onClick={() => setActiveTab("bookings")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === "bookings"
                  ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
              }`}
            >
              <span>Manifest Bookings</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 font-bold">
                {items.length}
              </span>
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={refreshData}
            className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-2xs cursor-pointer"
            title="Refresh Data"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <Link
            to="/flight-demo"
            className="text-xs font-bold px-4 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:opacity-90 transition-all shadow-xs flex items-center gap-1.5"
          >
            <span>{t("nav.back_to_main")}</span>
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <main className="px-4 md:px-6">
        {activeTab === "dashboard" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            {/* ══════════════════════════════════════════════════════════════
                LEFT COLUMN (3 cols): ACTIVE FLIGHTS LIST
            ══════════════════════════════════════════════════════════════ */}
            <div className="lg:col-span-3 space-y-3">
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200 tracking-tight">
                  Active Flights
                </span>
                <span className="text-[10px] font-bold text-slate-400 bg-slate-200/60 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                  {filteredFleetCards.length} / {fleetCards.length}
                </span>
              </div>

              {/* Route Search & Filter */}
              <div className="relative px-0.5">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={flightFilterQuery}
                  onChange={(e) => setFlightFilterQuery(e.target.value)}
                  placeholder={language === "th" ? "ค้นหาคู่จังหวัด, รหัสสนามบิน..." : "Search route, airport..."}
                  className="w-full pl-8 pr-7 py-2 text-xs rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 focus:outline-none focus:border-sky-500 placeholder:text-slate-400 shadow-2xs transition-all"
                />
                {flightFilterQuery && (
                  <button
                    type="button"
                    onClick={() => setFlightFilterQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs font-bold cursor-pointer"
                  >
                    ✕
                  </button>
                )}
              </div>

              <div className="space-y-3 max-h-[860px] overflow-y-auto pr-1">
                {filteredFleetCards.map((plane) => {
                  const isSelected = selectedFlightNo === plane.flightNo;

                  if (isSelected) {
                    return (
                      <motion.div
                        key={plane.flightNo}
                        layout
                        onClick={() => setSelectedFlightNo(plane.flightNo)}
                        className="bg-[#18191f] text-white rounded-3xl p-4 shadow-xl border border-slate-800 cursor-pointer space-y-3.5 transition-all relative overflow-hidden"
                      >
                        {/* Top Pill / Airline Badge */}
                        <div className="bg-[#24262f] rounded-2xl p-2.5 flex items-center justify-between border border-slate-700/60 shadow-inner">
                          <div className="flex items-center gap-2.5">
                            <div className="w-6 h-6 rounded-lg bg-red-600 flex items-center justify-center text-white font-bold text-xs shadow-xs">
                              ✈
                            </div>
                            <div>
                              <div className="text-xs font-bold leading-tight text-white">{plane.airlineName}</div>
                              <div className="text-[10px] text-slate-400 font-medium">
                                {language === "th" ? "เริ่มต้น" : "from"} {plane.priceStr}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Timeline route */}
                        <div className="space-y-3 relative pl-4 text-xs">
                          {/* Vertical Connector Line */}
                          <div className="absolute left-1.5 top-2.5 bottom-2.5 w-0.5 bg-slate-700" />

                          {/* Origin */}
                          <div className="relative">
                            <div className="w-2.5 h-2.5 rounded-full bg-slate-300 absolute -left-4 top-1 border-2 border-[#18191f]" />
                            <div className="flex items-baseline gap-1.5">
                              <span className="font-bold text-slate-100">{plane.originCode}</span>
                              <span className="text-[11px] text-slate-400">{plane.originCity.split(" ")[0]}</span>
                            </div>
                            <div className="text-[10px] text-slate-400 font-mono mt-0.5">{plane.depDate}</div>
                          </div>

                          {/* Destination */}
                          <div className="relative pt-1">
                            <div className="w-2.5 h-2.5 rounded-full bg-sky-400 absolute -left-4 top-2 border-2 border-[#18191f]" />
                            <div className="flex items-baseline gap-1.5">
                              <span className="font-bold text-slate-100">{plane.destCode}</span>
                              <span className="text-[11px] text-slate-400">{plane.destCity.split(" ")[0]}</span>
                            </div>
                            <div className="text-[10px] text-slate-400 font-mono mt-0.5">{plane.arrDate}</div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  }

                  return (
                    <motion.div
                      key={plane.flightNo}
                      layout
                      onClick={() => setSelectedFlightNo(plane.flightNo)}
                      className="bg-white/90 dark:bg-slate-900/90 hover:bg-white rounded-3xl p-4 shadow-2xs border border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-md cursor-pointer space-y-3.5 transition-all"
                    >
                      {/* Top Pill / Airline Badge */}
                      <div className="bg-[#e8f1fd] dark:bg-slate-800/80 rounded-2xl p-2.5 flex items-center justify-between border border-sky-100/60 dark:border-slate-700/60">
                        <div className="flex items-center gap-2.5">
                          <div className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-700 dark:text-amber-300 flex items-center justify-center font-bold text-xs">
                            🦅
                          </div>
                          <div>
                            <div className="text-xs font-bold leading-tight text-slate-800 dark:text-slate-200">{plane.airlineName}</div>
                            <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                              {language === "th" ? "เริ่มต้น" : "from"} {plane.priceStr}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Timeline route */}
                      <div className="space-y-3 relative pl-4 text-xs">
                        {/* Vertical Connector Line */}
                        <div className="absolute left-1.5 top-2.5 bottom-2.5 w-0.5 bg-slate-200 dark:bg-slate-700" />

                        {/* Origin */}
                        <div className="relative">
                          <div className="w-2.5 h-2.5 rounded-full bg-slate-400 absolute -left-4 top-1 border-2 border-white dark:border-slate-900" />
                          <div className="flex items-baseline gap-1.5">
                            <span className="font-bold text-slate-800 dark:text-slate-200">{plane.originCode}</span>
                            <span className="text-[11px] text-slate-500 dark:text-slate-400">{plane.originCity.split(" ")[0]}</span>
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono mt-0.5">{plane.depDate}</div>
                        </div>

                        {/* Destination */}
                        <div className="relative pt-1">
                          <div className="w-2.5 h-2.5 rounded-full bg-slate-400 absolute -left-4 top-2 border-2 border-white dark:border-slate-900" />
                          <div className="flex items-baseline gap-1.5">
                            <span className="font-bold text-slate-800 dark:text-slate-200">{plane.destCode}</span>
                            <span className="text-[11px] text-slate-500 dark:text-slate-400">{plane.destCity.split(" ")[0]}</span>
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono mt-0.5">{plane.arrDate}</div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* ══════════════════════════════════════════════════════════════
                CENTER COLUMN (6 cols): 3D AIRPLANE CABIN & FLIGHT DETAILS
            ══════════════════════════════════════════════════════════════ */}
            <div className="lg:col-span-6 space-y-5">
              {/* Upper Section: Zoomed 3D Airplane Fuselage & Cabin Cutaway */}
              <div id="cabin-seat-map" className="bg-gradient-to-b from-[#eaf2fc] via-[#dfeaf8] to-[#e4eefb] dark:from-slate-900 dark:via-slate-950 dark:to-slate-900 rounded-[36px] p-5 shadow-xs border border-white/80 dark:border-slate-800 relative overflow-hidden min-h-[380px] flex flex-col justify-between scroll-mt-6">
                
                {/* Floating Top Control Bar */}
                <div className="flex items-center justify-between relative z-20 mb-1">
                  {/* Left: Deck / Zone switchers */}
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center shadow-xs border border-slate-200/80 dark:border-slate-700">
                      <Layers className="w-4 h-4" />
                    </div>
                    <div className="flex items-center gap-1.5">
                      {[
                        { id: 1, label: language === "th" ? "ทั้งลำ" : "All", title: language === "th" ? "ผังทั้งลำ ทุกชั้นโดยสาร (แถว 1-10)" : "Full Aircraft Cabin (Rows 1-10)" },
                        { id: 2, label: language === "th" ? "โซนหน้า" : "Front", title: language === "th" ? "โซนหน้า / ชั้นธุรกิจ & พรีเมียม (แถว 1-4)" : "Front Zone / Business & Premium (Rows 1-4)" },
                        { id: 3, label: language === "th" ? "โซนหลัง" : "Aft", title: language === "th" ? "โซนหลัง / ชั้นประหยัด (แถว 5-10)" : "Aft Zone / Economy (Rows 5-10)" },
                      ].map((deck) => (
                        <button
                          key={deck.id}
                          type="button"
                          onClick={() => setSelectedDeck(deck.id)}
                          className={`h-8 px-2.5 rounded-full font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-xs ${
                            selectedDeck === deck.id
                              ? "bg-slate-950 text-white dark:bg-white dark:text-slate-950 shadow-sm"
                              : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700 hover:bg-slate-50"
                          }`}
                          title={deck.title}
                        >
                          <span>{deck.id}</span>
                          <span className="text-[10px] font-medium opacity-85 hidden sm:inline">{deck.label}</span>
                        </button>
                      ))}
                    </div>

                    {/* Active Zone Badge */}
                    <span className="hidden xl:inline-flex items-center text-[10px] font-semibold text-slate-600 dark:text-slate-300 bg-white/80 dark:bg-slate-800/80 px-2.5 py-1 rounded-full border border-slate-200/60 dark:border-slate-700 shadow-2xs">
                      {selectedDeck === 1
                        ? (language === "th" ? "ผังทั้งลำ (แถว 1-10)" : "Full Cabin (Rows 1-10)")
                        : selectedDeck === 2
                        ? (language === "th" ? "โซนหน้า: ชั้นธุรกิจ (แถว 1-4)" : "Front Zone: Business (Rows 1-4)")
                        : (language === "th" ? "โซนหลัง: ชั้นประหยัด (แถว 5-10)" : "Aft Zone: Economy (Rows 5-10)")}
                    </span>
                  </div>

                  {/* Right: Live Weather widget badge */}
                  <div
                    className="flex items-center gap-2.5 bg-white/95 dark:bg-slate-800/95 backdrop-blur-md px-3.5 py-1.5 rounded-2xl border border-slate-200/80 dark:border-slate-700 shadow-2xs shrink-0 select-none whitespace-nowrap transition-all hover:shadow-xs"
                    title={`${language === "th" ? "สภาพอากาศจริง ณ สนามบินปลายทาง" : "Real-time Destination Weather"}: ${weather?.cityName || activeFlightData.destCity} (${weather?.temperature}°C)`}
                  >
                    {weatherLoading ? (
                      <Loader2 className="w-5 h-5 text-sky-500 animate-spin shrink-0" />
                    ) : (
                      renderWeatherIcon(weather?.iconType)
                    )}
                    <div className="flex flex-col text-left shrink-0">
                      <div className="flex items-baseline gap-1.5 leading-none">
                        <span className="text-sm font-black text-slate-800 dark:text-slate-100">
                          {weather ? `${weather.temperature}°` : "28°"}
                        </span>
                        <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wide">
                          {weather?.cityCode || activeFlightData.destCode}
                        </span>
                        {weather && (
                          <span className="text-[10px] text-slate-400 dark:text-slate-400 font-medium">
                            • {language === "th" ? weather.conditionTextTh : weather.conditionTextEn}
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] font-medium text-slate-400 dark:text-slate-500 mt-0.5 whitespace-nowrap leading-none">
                        {language === "th" ? "รู้สึกเหมือน" : "Feels like"} {weather ? `${weather.apparentTemperature}°` : "31°"}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Center: AUTHENTIC COMMERCIAL AIRLINER WITH FULL SWEPT WINGS & ZERO-OVERFLOW SEAT GRID */}
                <div
                  className="relative my-auto overflow-hidden flex items-center justify-center py-2 transition-transform duration-200 select-none"
                  style={{ transform: `scale(${zoomLevel})`, transformOrigin: "center center" }}
                >
                  <div className="relative w-[860px] h-[360px] flex items-center justify-center shrink-0">
                    
                    {/* SVG 3D Airliner Fuselage, Long Swept Wings, Turbofans, Stabilizers & Cabin Cutout */}
                    <svg className="absolute inset-0 w-full h-full drop-shadow-lg z-0" viewBox="0 0 860 360" fill="none">
                      <defs>
                        {/* Fuselage White Pearl Shading */}
                        <linearGradient id="fuselageBodyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#ffffff" />
                          <stop offset="25%" stopColor="#f8faff" />
                          <stop offset="80%" stopColor="#eef4fb" />
                          <stop offset="100%" stopColor="#dce8f7" />
                        </linearGradient>
                        {/* Swept Wing Metallic Shading */}
                        <linearGradient id="wingBodyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#f1f6fc" />
                          <stop offset="45%" stopColor="#e2edf8" />
                          <stop offset="100%" stopColor="#cbdcf2" />
                        </linearGradient>
                        {/* Turbofan Jet Engine Nacelle */}
                        <linearGradient id="engineNacelleGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#c5daf5" />
                          <stop offset="55%" stopColor="#eaf2fc" />
                          <stop offset="100%" stopColor="#87add7" />
                        </linearGradient>
                        {/* Cockpit Canopy Clear / Transparent Glass Tint */}
                        <linearGradient id="cockpitGlassGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.85" />
                          <stop offset="30%" stopColor="#f8fafc" stopOpacity="0.5" />
                          <stop offset="70%" stopColor="#e2e8f0" stopOpacity="0.35" />
                          <stop offset="100%" stopColor="#cbd5e1" stopOpacity="0.25" />
                        </linearGradient>
                        {/* Radome Nose Cone */}
                        <linearGradient id="radomeNoseGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#f1f5f9" />
                          <stop offset="100%" stopColor="#ffffff" />
                        </linearGradient>
                      </defs>

                      {/* ── REAR HORIZONTAL STABILIZERS (TAIL ELEVATORS) ── */}
                      {/* Top Horizontal Stabilizer */}
                      <polygon points="730,170 825,90 855,90 785,170" fill="url(#wingBodyGrad)" stroke="#b0cbe8" strokeWidth="1.5" />
                      {/* Bottom Horizontal Stabilizer */}
                      <polygon points="730,190 825,270 855,270 785,190" fill="url(#wingBodyGrad)" stroke="#b0cbe8" strokeWidth="1.5" />

                      {/* ── TOP LONG SWEPT WING & ENGINE (AIRBUS/BOEING STYLE) ── */}
                      {/* Wing Root Fairing & Main Wing */}
                      <polygon points="290,90 560,0 635,0 490,90" fill="url(#wingBodyGrad)" stroke="#b0cbe8" strokeWidth="1.5" />
                      {/* Wing Leading Edge Slat Seam */}
                      <line x1="310" y1="84" x2="550" y2="4" stroke="#ffffff" strokeWidth="1.5" opacity="0.8" />
                      {/* Top Wing Flap Track Fairings (Canoes) */}
                      <path d="M 430 62 L 448 56 L 444 64 Z" fill="#92b2d8" stroke="#7b9fc9" strokeWidth="0.8" />
                      <path d="M 480 44 L 498 38 L 494 46 Z" fill="#92b2d8" stroke="#7b9fc9" strokeWidth="0.8" />
                      <path d="M 530 26 L 548 20 L 544 28 Z" fill="#92b2d8" stroke="#7b9fc9" strokeWidth="0.8" />
                      <path d="M 580 8 L 598 2 L 594 10 Z" fill="#92b2d8" stroke="#7b9fc9" strokeWidth="0.8" />
                      {/* Top Winglet / Sharklet */}
                      <polygon points="625,0 640,-2 638,8 625,6" fill="#38bdf8" />

                      {/* Top Engine Pylon */}
                      <rect x="410" y="52" width="22" height="38" rx="3" fill="#cbdcf5" stroke="#9bbfe3" strokeWidth="1" />
                      {/* Top Turbofan High-Bypass Jet Engine */}
                      <rect x="375" y="32" width="68" height="28" rx="14" fill="url(#engineNacelleGrad)" stroke="#7fa8d5" strokeWidth="1.5" />
                      {/* Chrome Intake Lip */}
                      <ellipse cx="380" cy="46" rx="5.5" ry="12.5" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="1" />
                      {/* Black Fan Spinner / Blades */}
                      <ellipse cx="379" cy="46" rx="4" ry="10" fill="#1e293b" />
                      <circle cx="379" cy="46" r="2.5" fill="#0f172a" />
                      {/* Engine Exhaust Nozzle Cone */}
                      <polygon points="443,38 454,46 443,54" fill="#475569" />

                      {/* ── BOTTOM LONG SWEPT WING & ENGINE ── */}
                      {/* Wing Root Fairing & Main Wing */}
                      <polygon points="290,270 560,360 635,360 490,270" fill="url(#wingBodyGrad)" stroke="#b0cbe8" strokeWidth="1.5" />
                      {/* Wing Leading Edge Slat Seam */}
                      <line x1="310" y1="276" x2="550" y2="356" stroke="#ffffff" strokeWidth="1.5" opacity="0.8" />
                      {/* Bottom Wing Flap Track Fairings (Canoes) */}
                      <path d="M 430 298 L 448 304 L 444 296 Z" fill="#92b2d8" stroke="#7b9fc9" strokeWidth="0.8" />
                      <path d="M 480 316 L 498 322 L 494 314 Z" fill="#92b2d8" stroke="#7b9fc9" strokeWidth="0.8" />
                      <path d="M 530 334 L 548 340 L 544 332 Z" fill="#92b2d8" stroke="#7b9fc9" strokeWidth="0.8" />
                      <path d="M 580 352 L 598 358 L 594 350 Z" fill="#92b2d8" stroke="#7b9fc9" strokeWidth="0.8" />
                      {/* Bottom Winglet / Sharklet */}
                      <polygon points="625,360 640,362 638,352 625,354" fill="#38bdf8" />

                      {/* Bottom Engine Pylon */}
                      <rect x="410" y="270" width="22" height="38" rx="3" fill="#cbdcf5" stroke="#9bbfe3" strokeWidth="1" />
                      {/* Bottom Turbofan High-Bypass Jet Engine */}
                      <rect x="375" y="300" width="68" height="28" rx="14" fill="url(#engineNacelleGrad)" stroke="#7fa8d5" strokeWidth="1.5" />
                      {/* Chrome Intake Lip */}
                      <ellipse cx="380" cy="314" rx="5.5" ry="12.5" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="1" />
                      {/* Black Fan Spinner / Blades */}
                      <ellipse cx="379" cy="314" rx="4" ry="10" fill="#1e293b" />
                      <circle cx="379" cy="314" r="2.5" fill="#0f172a" />
                      {/* Engine Exhaust Nozzle Cone */}
                      <polygon points="443,306 454,314 443,322" fill="#475569" />

                      {/* ── AUTHENTIC AIRLINER FUSELAGE HULL WITH PARABOLIC NOSE & TAIL ── */}
                      <path
                        d="M 25 180 C 40 148, 80 106, 140 92 C 160 90, 180 90, 200 90 L 760 90 C 790 90, 830 150, 850 180 C 830 210, 790 270, 760 270 L 200 270 C 180 270, 160 270, 140 268 C 80 254, 40 212, 25 180 Z"
                        fill="url(#fuselageBodyGrad)"
                        stroke="#b0cbe8"
                        strokeWidth="2.5"
                      />

                      {/* Nose Radome Weather Radar Cap (Front Nose Tip) */}
                      <path
                        d="M 25 180 C 34 162, 50 148, 66 148 C 56 168, 56 192, 66 212 C 50 212, 34 198, 25 180 Z"
                        fill="url(#radomeNoseGrad)"
                        stroke="#cbdcf3"
                        strokeWidth="1.2"
                      />
                      {/* Nose Radome Seam Arc */}
                      <path d="M 66 148 C 56 168, 56 192, 66 212" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="3 2" fill="none" />

                      {/* Pitot Tube Sensor Needles */}
                      <line x1="48" y1="156" x2="36" y2="152" stroke="#64748b" strokeWidth="1.5" strokeLinecap="round" />
                      <line x1="48" y1="204" x2="36" y2="208" stroke="#64748b" strokeWidth="1.5" strokeLinecap="round" />

                      {/* ── AUTHENTIC SWEPT 6-PANE AIRLINER COCKPIT WINDSHIELD (SOFT SEAMLESS FRAMING) ── */}
                      {/* Left Front Windshield */}
                      <polygon points="76,177 98,162 98,177" fill="url(#cockpitGlassGrad)" stroke="#cbd5e1" strokeWidth="0.8" />
                      <line x1="80" y1="174" x2="94" y2="165" stroke="#ffffff" strokeWidth="1" strokeLinecap="round" opacity="0.85" />

                      {/* Right Front Windshield */}
                      <polygon points="76,183 98,198 98,183" fill="url(#cockpitGlassGrad)" stroke="#cbd5e1" strokeWidth="0.8" />
                      <line x1="80" y1="186" x2="94" y2="195" stroke="#ffffff" strokeWidth="1" strokeLinecap="round" opacity="0.85" />

                      {/* Left Center Windshield Pane */}
                      <polygon points="102,160 128,144 128,175 102,175" fill="url(#cockpitGlassGrad)" stroke="#cbd5e1" strokeWidth="0.8" />
                      <line x1="106" y1="166" x2="124" y2="152" stroke="#ffffff" strokeWidth="1" strokeLinecap="round" opacity="0.8" />

                      {/* Right Center Windshield Pane */}
                      <polygon points="102,200 128,216 128,185 102,185" fill="url(#cockpitGlassGrad)" stroke="#cbd5e1" strokeWidth="0.8" />
                      <line x1="106" y1="194" x2="124" y2="208" stroke="#ffffff" strokeWidth="1" strokeLinecap="round" opacity="0.8" />

                      {/* Left Swept Side Eyebrow Window */}
                      <polygon points="132,142 154,130 154,172 132,172" fill="url(#cockpitGlassGrad)" stroke="#cbd5e1" strokeWidth="0.8" />

                      {/* Right Swept Side Eyebrow Window */}
                      <polygon points="132,218 154,230 154,188 132,188" fill="url(#cockpitGlassGrad)" stroke="#cbd5e1" strokeWidth="0.8" />

                      {/* Pilot Cockpit Seats & Flight Deck */}
                      <rect x="132" y="152" width="14" height="12" rx="3" fill="#475569" stroke="#64748b" strokeWidth="0.8" />
                      <rect x="132" y="196" width="14" height="12" rx="3" fill="#475569" stroke="#64748b" strokeWidth="0.8" />
                      <rect x="134" y="174" width="18" height="12" rx="2" fill="#334155" />
                      <circle cx="143" cy="180" r="2" fill="#7dd3fc" />

                      {/* Cockpit Divider Bulkhead Wall */}
                      <line x1="158" y1="102" x2="158" y2="258" stroke="#cbdcf5" strokeWidth="2" strokeDasharray="4 2" />

                      {/* Top Passenger Windows along Upper Fuselage Wall */}
                      {[200, 240, 280, 320, 360, 400, 440, 480, 520, 560, 600, 640, 680, 720].map((wx) => (
                        <rect key={`win-top-${wx}`} x={wx} y="94" width="5" height="3.5" rx="1.5" fill="#ffffff" fillOpacity="0.85" stroke="#cbd5e1" strokeWidth="0.6" />
                      ))}

                      {/* Bottom Passenger Windows along Lower Fuselage Wall */}
                      {[200, 240, 280, 320, 360, 400, 440, 480, 520, 560, 600, 640, 680, 720].map((wx) => (
                        <rect key={`win-bot-${wx}`} x={wx} y="262.5" width="5" height="3.5" rx="1.5" fill="#ffffff" fillOpacity="0.85" stroke="#cbd5e1" strokeWidth="0.6" />
                      ))}

                      {/* ── HOLLOW CABIN FLOOR CUTOUT (RECESSED INTERIOR) ── */}
                      <rect
                        x="164"
                        y="102"
                        width="594"
                        height="156"
                        rx="16"
                        fill="#f8fafc"
                        stroke="#cbdcf5"
                        strokeWidth="2"
                        className="dark:fill-slate-900 dark:stroke-slate-700"
                      />
                    </svg>

                    {/* ── Interactive Seating Cabin Overlay (100% Enclosed within Cabin Floor Cutout) ── */}
                    <div
                      className="absolute z-10 flex items-center justify-between"
                      style={{
                        left: "172px",
                        top: "108px",
                        width: "576px",
                        height: "144px",
                      }}
                    >
                      {/* Galley Bulkhead Badges 01 / 05 on left */}
                      <div className="flex flex-col justify-between h-full py-1 pr-2 text-[9px] font-mono font-black text-slate-500 dark:text-slate-400 select-none shrink-0">
                        <span className="w-5.5 h-5.5 rounded-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 flex items-center justify-center shadow-xs leading-none">
                          01
                        </span>
                        <span className="w-5.5 h-5.5 rounded-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 flex items-center justify-center shadow-xs leading-none">
                          05
                        </span>
                      </div>

                      {/* Seating Grid (Rows 1 to 10 x Columns F, E, D, 1..10, C, B, A) */}
                      <div className="flex-1 h-full flex flex-col justify-between py-0.5 min-w-0 pr-1">
                        
                        {/* TOP ROWS: F, E, D */}
                        <div className="flex flex-col justify-between gap-[3px]">
                          {topRows.map((col) => (
                            <div key={col} className="grid grid-cols-10 gap-1.5 items-center">
                              {rows.map((row) => {
                                const seatId = `${row}${col}`;
                                const seatInfo = seatStatusMap.get(seatId);
                                const status = seatInfo?.status || "available";
                                const isLocked = status === "locked";
                                const isBooked = status === "booked";
                                const isDimmed = (selectedDeck === 2 && row > 4) || (selectedDeck === 3 && row <= 4);

                                return (
                                  <button
                                    key={seatId}
                                    type="button"
                                    onClick={() => handleToggleLock(seatId)}
                                    className={`relative w-full h-[16px] rounded-[4px] border flex items-center justify-center cursor-pointer select-none transition-all duration-200 box-border shrink-0 ${
                                      isDimmed ? "opacity-20 scale-95 pointer-events-none" : "opacity-100 scale-100"
                                    } ${
                                      isLocked
                                        ? "bg-[#181a20] text-white border-slate-700 shadow-xs"
                                        : isBooked
                                        ? "bg-amber-600 text-white border-amber-700 shadow-xs"
                                        : "bg-[#e8f1fc] dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-[#cadbf2] dark:border-slate-700 hover:bg-rose-50 dark:hover:bg-rose-950 hover:border-rose-400 hover:text-rose-600"
                                    }`}
                                    title={
                                      isBooked
                                        ? `Seat ${seatId} (${language === 'th' ? `จองแล้วโดย ${seatInfo?.booking?.passengerName || "ผู้โดยสาร"}` : `Booked by ${seatInfo?.booking?.passengerName || "Passenger"}`}) - ${language === 'th' ? 'คลิกเพื่อจัดการ/ปลดล็อค' : 'Click to manage/unlock'}`
                                        : isLocked
                                        ? `Seat ${seatId} (${language === 'th' ? 'แอดมินล็อคไว้' : 'Admin Locked'}) - ${language === 'th' ? 'คลิกเพื่อปลดล็อค' : 'Click to unlock'}`
                                        : `Seat ${seatId} (${language === 'th' ? 'ที่นั่งว่าง' : 'Available'}) - ${language === 'th' ? 'คลิกเพื่อล็อค' : 'Click to lock'}`
                                    }
                                  >
                                    {/* Realistic Headrest Cushion (Right side) */}
                                    <span
                                      className={`absolute right-0 top-[1.5px] bottom-[1.5px] w-[2.5px] rounded-r-[2px] pointer-events-none ${
                                        isLocked ? "bg-slate-600" : isBooked ? "bg-amber-400" : "bg-[#c4d8f2] dark:bg-slate-700"
                                      }`}
                                    />
                                    {/* Armrests (Top & Bottom) */}
                                    <span
                                      className={`absolute left-[2px] right-[4px] top-0 h-[1px] rounded-full pointer-events-none ${
                                        isLocked ? "bg-slate-600" : isBooked ? "bg-amber-500" : "bg-[#b8cff2] dark:bg-slate-700"
                                      }`}
                                    />
                                    <span
                                      className={`absolute left-[2px] right-[4px] bottom-0 h-[1px] rounded-full pointer-events-none ${
                                        isLocked ? "bg-slate-600" : isBooked ? "bg-amber-500" : "bg-[#b8cff2] dark:bg-slate-700"
                                      }`}
                                    />

                                    {/* Seat Column Letter */}
                                    <span className="font-mono font-black text-[9px] pr-0.5 leading-none pointer-events-none">
                                      {col}
                                    </span>

                                    {/* Status Badge */}
                                    {isLocked && (
                                      <Lock className="w-2 h-2 text-rose-400 absolute -top-1 -right-1 bg-[#181a20] rounded-full p-[0.5px] pointer-events-none" />
                                    )}
                                    {isBooked && (
                                      <User className="w-2 h-2 text-amber-200 absolute -top-1 -right-1 bg-amber-700 rounded-full p-[0.5px] pointer-events-none" />
                                    )}
                                  </button>
                                );
                              })}
                            </div>
                          ))}
                        </div>

                        {/* ── AISLE WALKWAY WITH ROW NUMBERS (1 to 10) ── */}
                        <div className="grid grid-cols-10 gap-1.5 items-center bg-slate-200/90 dark:bg-slate-800/90 rounded-[3px] my-[1px] py-[2px]">
                          {rows.map((row) => {
                            const isDimmed = (selectedDeck === 2 && row > 4) || (selectedDeck === 3 && row <= 4);
                            return (
                              <div
                                key={row}
                                className={`text-center font-mono font-black text-[9px] select-none leading-none transition-all duration-200 ${
                                  isDimmed ? "opacity-25 text-slate-400" : "opacity-100 text-slate-700 dark:text-slate-300 font-extrabold"
                                }`}
                              >
                                {row}
                              </div>
                            );
                          })}
                        </div>

                        {/* BOTTOM ROWS: C, B, A */}
                        <div className="flex flex-col justify-between gap-[3px]">
                          {bottomRows.map((col) => (
                            <div key={col} className="grid grid-cols-10 gap-1.5 items-center">
                              {rows.map((row) => {
                                const seatId = `${row}${col}`;
                                const seatInfo = seatStatusMap.get(seatId);
                                const status = seatInfo?.status || "available";
                                const isLocked = status === "locked";
                                const isBooked = status === "booked";
                                const isDimmed = (selectedDeck === 2 && row > 4) || (selectedDeck === 3 && row <= 4);

                                return (
                                  <button
                                    key={seatId}
                                    type="button"
                                    onClick={() => handleToggleLock(seatId)}
                                    className={`relative w-full h-[16px] rounded-[4px] border flex items-center justify-center cursor-pointer select-none transition-all duration-200 box-border shrink-0 ${
                                      isDimmed ? "opacity-20 scale-95 pointer-events-none" : "opacity-100 scale-100"
                                    } ${
                                      isLocked
                                        ? "bg-[#181a20] text-white border-slate-700 shadow-xs"
                                        : isBooked
                                        ? "bg-amber-600 text-white border-amber-700 shadow-xs"
                                        : "bg-[#e8f1fc] dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-[#cadbf2] dark:border-slate-700 hover:bg-rose-50 dark:hover:bg-rose-950 hover:border-rose-400 hover:text-rose-600"
                                    }`}
                                    title={
                                      isBooked
                                        ? `Seat ${seatId} (${language === 'th' ? `จองแล้วโดย ${seatInfo?.booking?.passengerName || "ผู้โดยสาร"}` : `Booked by ${seatInfo?.booking?.passengerName || "Passenger"}`}) - ${language === 'th' ? 'คลิกเพื่อจัดการ/ปลดล็อค' : 'Click to manage/unlock'}`
                                        : isLocked
                                        ? `Seat ${seatId} (${language === 'th' ? 'แอดมินล็อคไว้' : 'Admin Locked'}) - ${language === 'th' ? 'คลิกเพื่อปลดล็อค' : 'Click to unlock'}`
                                        : `Seat ${seatId} (${language === 'th' ? 'ที่นั่งว่าง' : 'Available'}) - ${language === 'th' ? 'คลิกเพื่อล็อค' : 'Click to lock'}`
                                    }
                                  >
                                    {/* Realistic Headrest Cushion (Right side) */}
                                    <span
                                      className={`absolute right-0 top-[1.5px] bottom-[1.5px] w-[2.5px] rounded-r-[2px] pointer-events-none ${
                                        isLocked ? "bg-slate-600" : isBooked ? "bg-amber-400" : "bg-[#c4d8f2] dark:bg-slate-700"
                                      }`}
                                    />
                                    {/* Armrests (Top & Bottom) */}
                                    <span
                                      className={`absolute left-[2px] right-[4px] top-0 h-[1px] rounded-full pointer-events-none ${
                                        isLocked ? "bg-slate-600" : isBooked ? "bg-amber-500" : "bg-[#b8cff2] dark:bg-slate-700"
                                      }`}
                                    />
                                    <span
                                      className={`absolute left-[2px] right-[4px] bottom-0 h-[1px] rounded-full pointer-events-none ${
                                        isLocked ? "bg-slate-600" : isBooked ? "bg-amber-500" : "bg-[#b8cff2] dark:bg-slate-700"
                                      }`}
                                    />

                                    {/* Seat Column Letter */}
                                    <span className="font-mono font-black text-[9px] pr-0.5 leading-none pointer-events-none">
                                      {col}
                                    </span>

                                    {/* Status Badge */}
                                    {isLocked && (
                                      <Lock className="w-2 h-2 text-rose-400 absolute -top-1 -right-1 bg-[#181a20] rounded-full p-[0.5px] pointer-events-none" />
                                    )}
                                    {isBooked && (
                                      <User className="w-2 h-2 text-amber-200 absolute -top-1 -right-1 bg-amber-700 rounded-full p-[0.5px] pointer-events-none" />
                                    )}
                                  </button>
                                );
                              })}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating Bottom-Left: Zoom buttons */}
                <div className="relative z-20 flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setZoomLevel((z) => Math.min(z + 0.1, 1.3))}
                    className="w-8 h-8 rounded-full bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 shadow-xs border border-slate-200/80 dark:border-slate-700 flex items-center justify-center font-bold hover:bg-slate-50 cursor-pointer"
                    title="Zoom In"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setZoomLevel((z) => Math.max(z - 0.1, 0.85))}
                    className="w-8 h-8 rounded-full bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 shadow-xs border border-slate-200/80 dark:border-slate-700 flex items-center justify-center font-bold hover:bg-slate-50 cursor-pointer"
                    title="Zoom Out"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Lower Section: Flight Details & Map Card */}
              <div className="bg-white dark:bg-slate-900 rounded-[36px] p-6 shadow-xs border border-slate-200/80 dark:border-slate-800 space-y-6">
                {/* Header Summary Row */}
                <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                  {/* Airline & Price */}
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-xl bg-red-600 flex items-center justify-center text-white text-xs font-bold shadow-2xs">
                      ✈
                    </div>
                    <div>
                      <div className="text-sm font-extrabold text-slate-900 dark:text-white leading-tight">
                        {activeFlightData.airlineName}
                      </div>
                      <div className="text-[11px] text-slate-400 font-medium">
                        {language === "th" ? "เริ่มต้น" : "from"} {activeFlightData.priceStr}
                      </div>
                    </div>
                  </div>

                  {/* Flight Route & Duration */}
                  <div className="flex items-center gap-6 text-center">
                    <div>
                      <div className="text-xs font-black text-slate-900 dark:text-white">{activeFlightData.originCode}</div>
                      <div className="text-[10px] text-slate-400">{activeFlightData.originCity.split(" ")[0]}</div>
                    </div>

                    <div className="space-y-1">
                      <div className="text-[10px] font-bold text-slate-500">{activeFlightData.durationStr}</div>
                      <div className="flex items-center gap-1 w-28">
                        <div className="h-0.5 flex-1 border-t-2 border-dashed border-slate-300 dark:border-slate-700" />
                        <span className="text-[9px] font-semibold text-slate-400 px-1 bg-slate-100 dark:bg-slate-800 rounded">Direct</span>
                        <div className="h-0.5 flex-1 border-t-2 border-dashed border-slate-300 dark:border-slate-700" />
                      </div>
                    </div>

                    <div>
                      <div className="text-xs font-black text-slate-900 dark:text-white">{activeFlightData.destCode}</div>
                      <div className="text-[10px] text-slate-400">{activeFlightData.destCity.split(" ")[0]}</div>
                    </div>
                  </div>

                  {/* Price Tag */}
                  <div className="text-right">
                    <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Price</div>
                    <div className="text-lg font-black text-slate-900 dark:text-white leading-tight">
                      {activeFlightData.priceStr}
                    </div>
                  </div>
                </div>

                {/* Sub Navigation Tabs */}
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2 sm:gap-4 text-xs font-bold text-slate-400 overflow-x-auto pb-1 max-w-full">
                    {[
                      { key: "details", label: language === "th" ? "Flight Details" : "Flight Details" },
                      { key: "price", label: language === "th" ? "Price Details" : "Price Details" },
                      { key: "refund", label: language === "th" ? "Refund Policy" : "Refund Policy" },
                      { key: "reschedule", label: language === "th" ? "Reschedule" : "Reschedule" },
                      { key: "offers", label: language === "th" ? "Offers" : "Offers" },
                    ].map((tab) => (
                      <button
                        key={tab.key}
                        type="button"
                        onClick={() => setActiveSubTab(tab.key as any)}
                        className={`cursor-pointer transition-colors pb-1.5 relative whitespace-nowrap ${
                          activeSubTab === tab.key
                            ? "text-slate-900 dark:text-white font-extrabold"
                            : "hover:text-slate-700 dark:hover:text-slate-300"
                        }`}
                      >
                        {tab.label}
                        {activeSubTab === tab.key && (
                          <motion.div layoutId="subTabLine" className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-900 dark:bg-white rounded-full" />
                        )}
                      </button>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={handleChooseSeatsClick}
                    className="px-5 py-2 rounded-full bg-slate-950 dark:bg-white text-white dark:text-slate-950 text-xs font-bold shadow-xs hover:opacity-90 transition-all cursor-pointer flex items-center gap-1.5 shrink-0"
                  >
                    <span>{language === "th" ? "Choose Seats" : "Choose Seats"}</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Sub Tab Content Switcher */}
                <AnimatePresence mode="wait">
                  {/* TAB 1: FLIGHT DETAILS */}
                  {activeSubTab === "details" && (
                    <motion.div
                      key="details"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.15 }}
                      className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center pt-1"
                    >
                      {/* Left Specs & Timeline (7 cols) */}
                      <div className="md:col-span-7 space-y-4 text-xs">
                        {/* Departure Node */}
                        <div className="flex items-start gap-4">
                          <div className="w-16 shrink-0 font-mono text-[11px] text-slate-500 dark:text-slate-400 font-semibold leading-tight">
                            <div>{activeFlightData.depDate}</div>
                            <div className="text-[10px] text-slate-400">วันนี้</div>
                          </div>
                          <div>
                            <div className="font-extrabold text-slate-900 dark:text-white text-xs">
                              ({activeFlightData.originCode}) {activeFlightData.originCity.split(" ")[0]}
                            </div>
                            <div className="text-[10px] text-slate-400 mt-0.5">
                              {activeFlightData.terminalInfo}
                            </div>
                          </div>
                        </div>

                        {/* Flight Mid details */}
                        <div className="flex items-center gap-4 pl-1">
                          <div className="w-16 shrink-0 text-[10px] text-slate-400 font-mono">{activeFlightData.durationStr}</div>
                          <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                            <span className="font-bold text-slate-900 dark:text-white">{activeFlightData.airlineName}</span>
                            <span className="text-slate-300 dark:text-slate-600">·</span>
                            <span className="text-slate-500 dark:text-slate-400 text-[10px]">{currentAircraft.flightNo} • {language === "th" ? "ชั้นประหยัด / ธุรกิจ" : "Economy / Business"}</span>
                          </div>
                        </div>

                        {/* Amenities 2-col grid */}
                        <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 pt-1">
                          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 text-[11px]">
                            <Luggage className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span>Baggage 20kg</span>
                          </div>
                          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 text-[11px]">
                            <Wifi className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span>Wifi available</span>
                          </div>
                          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 text-[11px]">
                            <Plane className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span>{currentAircraft.model}</span>
                          </div>
                          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 text-[11px]">
                            <Armchair className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span>32inches Seat pitch</span>
                          </div>
                          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 text-[11px]">
                            <Zap className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span>Free power/usb port</span>
                          </div>
                          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 text-[11px]">
                            <Tv className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span>Free in-flight entertainment</span>
                          </div>
                        </div>

                        {/* Arrival Node */}
                        <div className="flex items-start gap-4 pt-1">
                          <div className="w-16 shrink-0 font-mono text-[11px] text-slate-500 dark:text-slate-400 font-semibold">
                            {activeFlightData.arrDate}
                          </div>
                          <div>
                            <div className="font-extrabold text-slate-900 dark:text-white text-xs">
                              ({activeFlightData.destCode}) {activeFlightData.destCity.split(" ")[0]}
                            </div>
                            <div className="text-[10px] text-slate-400 mt-0.5">
                              {getCityFullName(activeFlightData.destCity, language)}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Right Map Canvas with Thailand Route Map (5 cols) */}
                      <div className="md:col-span-5 flex items-center justify-center">
                        <ThailandFlightMap
                          originCode={activeFlightData.originCode || "DMK"}
                          destCode={activeFlightData.destCode || "UTH"}
                          originCity={activeFlightData.originCity}
                          destCity={activeFlightData.destCity}
                          flightNo={currentAircraft.flightNo}
                          durationStr={activeFlightData.durationStr}
                        />
                      </div>
                    </motion.div>
                  )}

                  {/* TAB 2: PRICE DETAILS */}
                  {activeSubTab === "price" && (
                    <motion.div
                      key="price"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.15 }}
                      className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch pt-1"
                    >
                      {/* Left: Price Breakdown Table (7 cols) */}
                      <div className="md:col-span-7 space-y-3">
                        <div className="font-extrabold text-xs text-slate-900 dark:text-white pb-1">
                          {language === "th" ? "สรุปแจกแจงค่าโดยสารและภาษี" : "Fare & Tax Breakdown"}
                        </div>

                        <div className="space-y-2 text-xs">
                          {(() => {
                            const rawPrice = activeFlightData.price || 2190;
                            const baseVal = Math.round(rawPrice * 0.76);
                            const airportVal = 100;
                            const fuelVal = Math.round(rawPrice * 0.14);
                            const vatVal = rawPrice - baseVal - airportVal - fuelVal;

                            return (
                              <>
                                <div className="flex justify-between items-center py-0.5">
                                  <span className="text-slate-600 dark:text-slate-400">
                                    {language === "th" ? "ค่าโดยสารพื้นฐาน (Base Fare)" : "Base Airfare"}
                                  </span>
                                  <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                                    ฿{baseVal.toLocaleString()}
                                  </span>
                                </div>
                                <div className="flex justify-between items-center py-0.5">
                                  <span className="text-slate-600 dark:text-slate-400">
                                    {language === "th" ? "ภาษีสนามบินและค่าบริการ (Airport Tax)" : "Airport & Service Tax"}
                                  </span>
                                  <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                                    ฿{airportVal.toLocaleString()}
                                  </span>
                                </div>
                                <div className="flex justify-between items-center py-0.5">
                                  <span className="text-slate-600 dark:text-slate-400">
                                    {language === "th" ? "ค่าธรรมเนียมน้ำมัน (Fuel Surcharge)" : "Fuel Surcharge"}
                                  </span>
                                  <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                                    ฿{fuelVal.toLocaleString()}
                                  </span>
                                </div>
                                <div className="flex justify-between items-center py-0.5">
                                  <span className="text-slate-600 dark:text-slate-400">
                                    {language === "th" ? "ภาษีมูลค่าเพิ่ม 7% (VAT 7%)" : "Value Added Tax (7%)"}
                                  </span>
                                  <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                                    ฿{Math.max(0, vatVal).toLocaleString()}
                                  </span>
                                </div>
                                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
                                  <span className="font-black text-slate-900 dark:text-white text-xs">
                                    {language === "th" ? "ยอดรวมสุทธิ" : "Total Net Amount"}
                                  </span>
                                  <span className="font-mono font-black text-base text-slate-900 dark:text-white">
                                    {activeFlightData.priceStr}
                                  </span>
                                </div>
                              </>
                            );
                          })()}
                        </div>

                        {/* Supported Payment Badges */}
                        <div className="pt-2 flex flex-wrap items-center gap-1.5 text-[10px]">
                          <span className="text-slate-400 font-medium mr-1">
                            {language === "th" ? "ช่องทางชำระ:" : "Payment:"}
                          </span>
                          {["PromptPay", "Visa / Mastercard", "JCB", "TrueMoney", "SkyPoints"].map((method) => (
                            <span
                              key={method}
                              className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium"
                            >
                              {method}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Right: Inclusions Box (5 cols) */}
                      <div className="md:col-span-5 bg-slate-50/70 dark:bg-slate-800/40 rounded-2xl p-4 flex flex-col justify-between text-xs">
                        <div>
                          <div className="font-extrabold text-slate-900 dark:text-white mb-2.5">
                            {language === "th" ? "สิทธิประโยชน์รวมในราคานี้" : "Fare Inclusions"}
                          </div>
                          <ul className="space-y-2 text-[11px] text-slate-600 dark:text-slate-400">
                            <li className="flex items-center gap-2">
                              <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                              <span>{language === "th" ? "กระเป๋าถือขึ้นเครื่อง 7 กิโลกรัม" : "Cabin baggage 7 kg"}</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                              <span>{language === "th" ? "โหลดสัมภาระใต้ท้องเครื่องฟรี 20 กก." : "Checked baggage 20 kg"}</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                              <span>{language === "th" ? "เลือกที่นั่งมาตรฐานฟรี" : "Free standard seat selection"}</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                              <span>{language === "th" ? "ของว่างและเครื่องดื่มบนเที่ยวบิน" : "In-flight snack & beverage"}</span>
                            </li>
                          </ul>
                        </div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400 pt-3 border-t border-slate-200/60 dark:border-slate-700/60">
                          {language === "th" ? "สะสมไมล์ SkyMiles ได้ 100% เต็ม" : "Earns 100% SkyMiles points"}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* TAB 3: REFUND POLICY */}
                  {activeSubTab === "refund" && (
                    <motion.div
                      key="refund"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.15 }}
                      className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch pt-1"
                    >
                      {/* Left: Policy Tiers (7 cols) */}
                      <div className="md:col-span-7 space-y-3">
                        <div className="font-extrabold text-xs text-slate-900 dark:text-white pb-1">
                          {language === "th" ? "เงื่อนไขการขอคืนเงิน" : "Refund Policy"}
                        </div>

                        <div className="space-y-3 text-xs">
                          {/* Tier 1 */}
                          <div className="space-y-0.5">
                            <div className="flex items-center justify-between">
                              <span className="font-extrabold text-slate-900 dark:text-white">
                                {language === "th" ? "ยกเลิกล่วงหน้ามากกว่า 24 ชั่วโมง" : "Cancelled > 24h before"}
                              </span>
                              <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full">
                                {language === "th" ? "คืนเงิน 100%" : "100% Refund"}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                              {language === "th"
                                ? "รับเงินคืน 100% เป็น SkyCredits ทันที หรือ คืนเงินสดโอนกลับบัญชี (หักค่าบริการธุรกรรม ฿100)"
                                : "100% refund as SkyCredits, or cash refund (฿100 processing fee)."}
                            </p>
                          </div>

                          {/* Tier 2 */}
                          <div className="space-y-0.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                            <div className="flex items-center justify-between">
                              <span className="font-extrabold text-slate-900 dark:text-white">
                                {language === "th" ? "ยกเลิกระหว่าง 4 - 24 ชั่วโมงก่อนบิน" : "Cancelled within 4 - 24h"}
                              </span>
                              <span className="text-[10px] font-bold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded-full">
                                {language === "th" ? "คืนเงิน 70%" : "70% Refund"}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                              {language === "th"
                                ? "รับเงินคืน 70% ของค่าโดยสาร (หักค่าธรรมเนียมยกเลิก ฿300)"
                                : "70% refund of base fare (deducts ฿300 cancellation fee)."}
                            </p>
                          </div>

                          {/* Tier 3 */}
                          <div className="space-y-0.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                            <div className="flex items-center justify-between">
                              <span className="font-extrabold text-slate-900 dark:text-white">
                                {language === "th" ? "น้อยกว่า 4 ชม. หรือ ไม่มาแสดงตัว" : "Less than 4h / No-Show"}
                              </span>
                              <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                                {language === "th" ? "คืนเฉพาะภาษีสนามบิน" : "Airport Tax only"}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                              {language === "th"
                                ? "ไม่สามารถขอคืนเงินค่าโดยสารได้ (สามารถยื่นขอคืนเฉพาะค่าภาษีสนามบินได้เต็มจำนวน)"
                                : "Airfare non-refundable. Airport tax (PSC) remains refundable upon request."}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Right: Refund Help Box (5 cols) */}
                      <div className="md:col-span-5 bg-slate-50/70 dark:bg-slate-800/40 rounded-2xl p-4 flex flex-col justify-between text-xs">
                        <div>
                          <div className="font-extrabold text-slate-900 dark:text-white mb-2">
                            {language === "th" ? "ระยะเวลาดำเนินการคืนเงิน" : "Refund Processing"}
                          </div>
                          <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                            {language === "th"
                              ? "ระบบจะประมวลผลการคืนเงินอัตโนมัติภายใน 3-7 วันทำการ โอนคืนเข้าสู่บัญชีหรือบัตรเดิมที่ใช้ชำระเงิน"
                              : "Refunds are processed back to the original payment method within 3-7 business days."}
                          </p>
                        </div>
                        <div className="text-[10px] text-slate-400 pt-3 border-t border-slate-200/60 dark:border-slate-700/60">
                          {language === "th"
                            ? "แอดมินสามารถคลิกที่นั่งที่มีผู้โดยสารจองบนแผนผังเครื่องบินเพื่อปลดล็อคและยกเลิกตั๋วได้ทันที"
                            : "Admins can click booked seats on the cabin map to release and cancel bookings instantly."}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* TAB 4: RESCHEDULE */}
                  {activeSubTab === "reschedule" && (
                    <motion.div
                      key="reschedule"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.15 }}
                      className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch pt-1"
                    >
                      {/* Left: Reschedule Conditions (7 cols) */}
                      <div className="md:col-span-7 space-y-3">
                        <div className="font-extrabold text-xs text-slate-900 dark:text-white pb-1">
                          {language === "th" ? "เงื่อนไขการเลื่อนและเปลี่ยนแปลงเที่ยวบิน" : "Flight Reschedule Rules"}
                        </div>

                        <div className="space-y-3 text-xs">
                          {/* Item 1 */}
                          <div className="space-y-0.5">
                            <div className="flex items-center justify-between">
                              <span className="font-extrabold text-slate-900 dark:text-white">
                                {language === "th" ? "เลื่อนวัน/เวลา ล่วงหน้า > 24 ชั่วโมง" : "Change Date/Time > 24h before"}
                              </span>
                              <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full">
                                {language === "th" ? "ฟรี 1 ครั้ง" : "1x Free"}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                              {language === "th"
                                ? "ฟรีค่าธรรมเนียมเปลี่ยนเที่ยวบิน 1 ครั้ง (ชำระเฉพาะส่วนต่างราคาตั๋ว หากเที่ยวบินใหม่ราคาสูงกว่า)"
                                : "No change fee for 1st reschedule (pay fare difference only if new flight is higher)."}
                            </p>
                          </div>

                          {/* Item 2 */}
                          <div className="space-y-0.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                            <div className="flex items-center justify-between">
                              <span className="font-extrabold text-slate-900 dark:text-white">
                                {language === "th" ? "เลื่อนเที่ยวบิน 4 - 24 ชั่วโมงก่อนบิน" : "Change within 4 - 24h"}
                              </span>
                              <span className="text-[10px] font-bold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded-full">
                                ฿500 / ที่นั่ง
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                              {language === "th"
                                ? "ค่าธรรมเนียมเปลี่ยนแปลงเที่ยวบิน ฿500 ต่อผู้โดยสาร + ส่วนต่างค่าโดยสาร"
                                : "฿500 change fee per passenger + fare difference applies."}
                            </p>
                          </div>

                          {/* Item 3 */}
                          <div className="space-y-0.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                            <div className="flex items-center justify-between">
                              <span className="font-extrabold text-slate-900 dark:text-white">
                                {language === "th" ? "แก้ไขตัวสะกดชื่อ-นามสกุล" : "Name Correction"}
                              </span>
                              <span className="text-[10px] font-bold text-sky-700 dark:text-sky-300 bg-sky-50 dark:bg-sky-950/60 px-2 py-0.5 rounded-full">
                                {language === "th" ? "ฟรีสูงสุด 3 ตัว" : "Free ≤ 3 chars"}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                              {language === "th"
                                ? "แก้ไขตัวสะกดผิดเล็กน้อยได้ฟรีสูงสุด 3 ตัวอักษรโดยไม่ต้องออกบัตรโดยสารใหม่"
                                : "Free typographical name corrections up to 3 letters without ticket reissue fee."}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Right: Quick Reschedule Info (5 cols) */}
                      <div className="md:col-span-5 bg-slate-50/70 dark:bg-slate-800/40 rounded-2xl p-4 flex flex-col justify-between text-xs">
                        <div>
                          <div className="font-extrabold text-slate-900 dark:text-white mb-2">
                            {language === "th" ? "ขั้นตอนการขอเปลี่ยนเที่ยวบิน" : "How to Reschedule"}
                          </div>
                          <ol className="space-y-1.5 text-[11px] text-slate-600 dark:text-slate-400">
                            <li>1. {language === "th" ? "เลือกเที่ยวบินและที่นั่งใหม่ที่ต้องการ" : "Select new flight & seat"}</li>
                            <li>2. {language === "th" ? "ระบบคำนวณส่วนต่างราคาอัตโนมัติ" : "Calculate fare difference"}</li>
                            <li>3. {language === "th" ? "รับ E-ticket และ Boarding Pass ใหม่ทันที" : "Instant updated E-ticket"}</li>
                          </ol>
                        </div>
                        <div className="text-[10px] text-slate-400 pt-3 border-t border-slate-200/60 dark:border-slate-700/60">
                          {language === "th"
                            ? "รองรับการเลื่อนวันเดินทางและออก Boarding Pass ใหม่ผ่านระบบ Admin โดยตรง"
                            : "Direct rescheduling supported for active fleet via Admin panel."}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* TAB 5: OFFERS & PRIVILEGES */}
                  {activeSubTab === "offers" && (
                    <motion.div
                      key="offers"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.15 }}
                      className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch pt-1"
                    >
                      {/* Left: Offers Grid (7 cols) */}
                      <div className="md:col-span-7 space-y-3">
                        <div className="font-extrabold text-xs text-slate-900 dark:text-white pb-1">
                          {language === "th" ? "สิทธิพิเศษและโปรโมชั่นประจำเที่ยวบิน" : "Flight Offers & Perks"}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3 text-xs">
                          {/* Offer 1 */}
                          <div>
                            <div className="font-extrabold text-slate-900 dark:text-white text-xs">
                              {language === "th" ? "สิทธิ์นักเรียน/นักศึกษา" : "Student Privilege"}
                            </div>
                            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                              {language === "th" ? "เพิ่มน้ำหนักกระเป๋าฟรี +5 kg (รวมเป็น 25 kg)" : "Free extra +5kg baggage allowance"}
                            </div>
                          </div>

                          {/* Offer 2 */}
                          <div>
                            <div className="font-extrabold text-slate-900 dark:text-white text-xs">
                              {language === "th" ? "บัตรเครดิตพาร์ทเนอร์" : "Partner Credit Cards"}
                            </div>
                            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                              {language === "th" ? "SCB / KBANK / BBL ลดเพิ่ม 10% หรือรับพอยต์ x5" : "10% instant rebate or 5x reward points"}
                            </div>
                          </div>

                          {/* Offer 3 */}
                          <div>
                            <div className="font-extrabold text-slate-900 dark:text-white text-xs">
                              {language === "th" ? "สมาชิก SkyLoyalty" : "SkyLoyalty Elite"}
                            </div>
                            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                              {language === "th" ? "สิทธิ์ขึ้นเครื่องก่อน (Priority) & ฟรีเลานจ์" : "Priority boarding & lounge pass"}
                            </div>
                          </div>

                          {/* Offer 4 */}
                          <div>
                            <div className="font-extrabold text-slate-900 dark:text-white text-xs">
                              {language === "th" ? "สั่งอาหารล่วงหน้า" : "Pre-order In-flight Cafe"}
                            </div>
                            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                              {language === "th" ? "รับส่วนลด 20% สำหรับเมนูเครื่องดื่มและอาหารร้อน" : "20% off hot meals & craft drinks"}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Right: Voucher / Promo Box (5 cols) */}
                      <div className="md:col-span-5 bg-slate-50/70 dark:bg-slate-800/40 rounded-2xl p-4 flex flex-col justify-between text-xs">
                        <div>
                          <div className="font-extrabold text-slate-900 dark:text-white mb-2">
                            {language === "th" ? "โค้ดส่วนลดพิเศษ" : "Special Promo Code"}
                          </div>
                          <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-center my-1.5">
                            <div className="font-mono font-black text-sm text-slate-900 dark:text-white tracking-wider">
                              SKYPROMO2026
                            </div>
                            <div className="text-[10px] text-slate-400 mt-0.5">
                              {language === "th" ? "ลดเพิ่ม 15% เมื่อจองผ่านระบบ" : "15% off direct reservations"}
                            </div>
                          </div>
                        </div>
                        <div className="text-[10px] text-slate-400 pt-2 border-t border-slate-200/60 dark:border-slate-700/60">
                          {language === "th" ? "ใช้งานได้กับทุก 14 เส้นทางบิน" : "Applicable to all 14 active routes"}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* ══════════════════════════════════════════════════════════════
                RIGHT COLUMN (3 cols): LIVE STATUS & SKYAI ASSISTANT
            ══════════════════════════════════════════════════════════════ */}
            <div className="lg:col-span-3 space-y-5">
              {/* Top Card: Live Status Donut Chart */}
              <div className="bg-white dark:bg-slate-900 rounded-[36px] p-5 shadow-xs border border-slate-200/80 dark:border-slate-800 space-y-5">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-extrabold text-slate-900 dark:text-white">
                    Live Status
                  </span>
                  <button
                    type="button"
                    onClick={refreshData}
                    className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                  >
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                </div>

                {/* SVG Multi-Segment Donut Chart */}
                <div className="flex justify-center py-2">
                  <svg width="170" height="170" viewBox="0 0 170 170" className="transform -rotate-90">
                    <defs>
                      <pattern id="striped" width="6" height="6" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
                        <line x1="0" y1="0" x2="0" y2="6" stroke="#94a3b8" strokeWidth="2.5" />
                      </pattern>
                      <pattern id="dots" width="6" height="6" patternUnits="userSpaceOnUse">
                        <circle cx="2" cy="2" r="1.5" fill="#64748b" />
                      </pattern>
                      <pattern id="hatched" width="6" height="6" patternTransform="rotate(-45 0 0)" patternUnits="userSpaceOnUse">
                        <line x1="0" y1="0" x2="0" y2="6" stroke="#cbd5e1" strokeWidth="2.5" />
                      </pattern>
                    </defs>

                    {/* Background Track */}
                    <circle cx="85" cy="85" r="62" stroke="#f1f5f9" strokeWidth="20" fill="none" />

                    {/* Segment 1: Solid Orange (Active Flights / Capacity) */}
                    <circle
                      cx="85"
                      cy="85"
                      r="62"
                      stroke="#fb923c"
                      strokeWidth="20"
                      strokeDasharray="160 230"
                      strokeDashoffset="0"
                      strokeLinecap="round"
                      fill="none"
                    />

                    {/* Segment 2: Hatched Pattern (Booked Passengers) */}
                    <circle
                      cx="85"
                      cy="85"
                      r="62"
                      stroke="url(#hatched)"
                      strokeWidth="20"
                      strokeDasharray="90 300"
                      strokeDashoffset="-170"
                      strokeLinecap="round"
                      fill="none"
                    />

                    {/* Segment 3: Dotted Pattern (Locked Seats) */}
                    <circle
                      cx="85"
                      cy="85"
                      r="62"
                      stroke="url(#dots)"
                      strokeWidth="20"
                      strokeDasharray="55 335"
                      strokeDashoffset="-270"
                      strokeLinecap="round"
                      fill="none"
                    />

                    {/* Segment 4: Striped Pattern (Available) */}
                    <circle
                      cx="85"
                      cy="85"
                      r="62"
                      stroke="url(#striped)"
                      strokeWidth="20"
                      strokeDasharray="50 340"
                      strokeDashoffset="-330"
                      strokeLinecap="round"
                      fill="none"
                    />
                  </svg>
                </div>

                {/* Metrics Breakdown */}
                <div className="space-y-2.5 text-xs font-medium text-slate-600 dark:text-slate-300">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
                      <span>Active Flights</span>
                    </div>
                    <span className="font-mono font-bold text-slate-900 dark:text-white">{fleetCards.length}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-slate-400 opacity-80" />
                      <span>Available Seats</span>
                    </div>
                    <span className="font-mono font-bold text-slate-900 dark:text-white">{availableCount}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-slate-500 opacity-80" />
                      <span>Admin Locked</span>
                    </div>
                    <span className="font-mono font-bold text-slate-900 dark:text-white">{lockedCount}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-600" />
                      <span>Booked Seats</span>
                    </div>
                    <span className="font-mono font-bold text-slate-900 dark:text-white">{bookedCount}</span>
                  </div>

                  {/* Admin Quick Action Controls */}
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleUnlockAll}
                      className="flex-1 py-2 px-3 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-[11px] font-bold transition-all cursor-pointer text-center"
                    >
                      Unlock All
                    </button>
                    <button
                      type="button"
                      onClick={handleResetDefaults}
                      className="flex-1 py-2 px-3 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-[11px] font-bold transition-all cursor-pointer text-center"
                    >
                      Reset Defaults
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════
            TAB 2: PASSENGER BOOKINGS MANIFEST
        ══════════════════════════════════════════════════════════════ */}
        {activeTab === "bookings" && (
          <div className="space-y-6 pt-2">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-extrabold text-foreground tracking-tight">
                  {t("flight_admin.title")}
                </h2>
                <p className="text-muted-foreground text-xs mt-0.5 font-semibold">
                  {t("flight_admin.records_count").replace("{count}", String(items.length))}
                </p>
              </div>
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder={t("flight_admin.search_placeholder")}
                    className="pl-9 pr-4 py-2 rounded-full border border-slate-200 bg-white dark:bg-slate-900 dark:border-slate-800 text-sm outline-none focus:border-sky-500 transition-colors shadow-xs"
                  />
                </div>
                <button
                  onClick={() => {
                    if (confirm(t("flight_admin.delete_confirm"))) {
                      clearBookings();
                      refreshData();
                      toast.success(t("flight_admin.cleared_toast"));
                    }
                  }}
                  className="px-4 py-2 rounded-full bg-red-600 text-white hover:bg-red-700 text-xs font-bold transition-all shadow-xs cursor-pointer"
                >
                  {t("flight_admin.btn_clear")}
                </button>
              </div>
            </div>

            {filteredBookings.length === 0 ? (
              <motion.div
                className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-12 text-center shadow-xs"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <p className="font-display text-base font-bold text-slate-600 dark:text-slate-400">
                  {t("flight_admin.no_bookings")}
                </p>
              </motion.div>
            ) : (
              <motion.div
                className="overflow-x-auto bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <table className="w-full text-xs border-collapse">
                  <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-left border-b border-slate-200 dark:border-slate-700">
                    <tr>
                      <th className="px-4 py-3 font-bold uppercase tracking-wider text-[11px]">{t("flight_admin.th_date")}</th>
                      <th className="px-4 py-3 font-bold uppercase tracking-wider text-[11px]">{t("flight_admin.th_passenger")}</th>
                      <th className="px-4 py-3 font-bold uppercase tracking-wider text-[11px]">{language === "th" ? "เที่ยวบิน / เครื่องบิน" : "Flight / Aircraft"}</th>
                      <th className="px-4 py-3 font-bold uppercase tracking-wider text-[11px]">{language === "th" ? "ที่นั่ง (SEAT)" : "SEAT"}</th>
                      <th className="px-4 py-3 font-bold uppercase tracking-wider text-[11px]">{t("flight_admin.th_route")}</th>
                      <th className="px-4 py-3 font-bold uppercase tracking-wider text-[11px]">{t("flight_admin.th_depart")}</th>
                      <th className="px-4 py-3 font-bold uppercase tracking-wider text-[11px]">{t("flight_admin.th_passengers")}</th>
                      <th className="px-4 py-3 font-bold uppercase tracking-wider text-[11px]">{t("flight_admin.th_contact")}</th>
                      <th className="px-4 py-3 font-bold uppercase tracking-wider text-[11px]">{t("flight_admin.th_promo")}</th>
                      <th className="px-4 py-3"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-slate-700 dark:text-slate-300">
                    <AnimatePresence initial={false}>
                      {filteredBookings.map((b) => (
                        <motion.tr
                          key={b.id}
                          className="hover:bg-slate-50/50 dark:hover:bg-slate-900/40 transition-colors"
                          layout
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <td className="px-4 py-3.5 text-slate-500 dark:text-slate-400 font-mono text-[11px]">
                            {new Date(b.createdAt).toLocaleString(language === "th" ? "th-TH" : "en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </td>
                          <td className="px-4 py-3.5 font-bold text-slate-900 dark:text-slate-100">
                            {b.passengerName}
                          </td>
                          <td className="px-4 py-3.5 font-mono">
                            <div className="font-bold text-sky-600 dark:text-sky-400">
                              {b.outboundFlightNo || "BTN201"}
                            </div>
                            <div className="text-[10px] text-slate-400 truncate mt-0.5">
                              {b.aircraftModel || "Airbus A320"} {b.aircraftTail ? `(${b.aircraftTail})` : ""}
                            </div>
                          </td>
                          <td className="px-4 py-3.5 font-mono font-bold text-sky-600 dark:text-sky-400">
                            {b.seat || <span className="text-slate-400 font-normal italic">{language === "th" ? "ไม่ได้ระบุ" : "Not chosen"}</span>}
                          </td>
                          <td className="px-4 py-3.5 font-medium text-slate-800 dark:text-slate-200">
                            {b.tripType === "multicity" && b.legs && b.legs.length > 0 ? (
                              <span>
                                {b.legs.map((leg, i) => (
                                  <span key={i}>
                                    {i > 0 && " → "}
                                    <span
                                      title={getCityFullName(leg.from, language)}
                                      className="cursor-help underline decoration-dotted underline-offset-2"
                                    >
                                      {getCityLabel(leg.from).split(" ")[0]}
                                    </span>
                                  </span>
                                ))}
                                {" → "}
                                <span
                                  title={getCityFullName(b.legs[b.legs.length - 1].to, language)}
                                  className="cursor-help underline decoration-dotted underline-offset-2"
                                >
                                  {getCityLabel(b.legs[b.legs.length - 1].to).split(" ")[0]}
                                </span>
                              </span>
                            ) : (
                              <>
                                <span
                                  title={getCityFullName(b.from, language)}
                                  className="cursor-help underline decoration-dotted underline-offset-2"
                                >
                                  {getCityLabel(b.from)}
                                </span>
                                {" → "}
                                <span
                                  title={getCityFullName(b.to, language)}
                                  className="cursor-help underline decoration-dotted underline-offset-2"
                                >
                                  {getCityLabel(b.to)}
                                </span>
                              </>
                            )}{" "}
                            <span className="text-[11px] text-slate-400 font-normal ml-1">
                              ({b.tripType === "round"
                                ? t("flight.round_trip")
                                : b.tripType === "multicity"
                                ? language === "th"
                                  ? "หลายเมือง"
                                  : "Multi-City"
                                : t("flight.one_way")})
                            </span>
                          </td>
                          <td className="px-4 py-3.5 font-medium text-slate-700 dark:text-slate-300">
                            {b.departDate}
                            {b.returnDate ? ` / ${b.returnDate}` : ""}
                          </td>
                          <td className="px-4 py-3.5 font-mono font-bold text-slate-800 dark:text-slate-200">
                            {b.passengers}
                          </td>
                          <td className="px-4 py-3.5">
                            <div className="font-medium text-slate-900 dark:text-slate-100">{b.email}</div>
                            <div className="text-[10px] text-slate-400 mt-0.5 font-mono">
                              {b.phone}
                            </div>
                          </td>
                          <td className="px-4 py-3.5 font-mono font-semibold text-indigo-600 dark:text-indigo-400 text-xs">
                            {b.promoCode || <span className="text-slate-400 font-normal">—</span>}
                          </td>
                          <td className="px-4 py-3.5 text-right">
                            <button
                              onClick={() => {
                                if (confirm(t("flight_admin.delete_confirm"))) {
                                  deleteBooking(b.id);
                                  refreshData();
                                  toast.success(t("flight_admin.delete_success"));
                                }
                              }}
                              className="text-red-500 hover:text-red-700 font-medium text-xs cursor-pointer hover:underline"
                            >
                              {t("flight_admin.btn_delete")}
                            </button>
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </tbody>
                </table>
              </motion.div>
            )}
          </div>
        )}
        {/* Booked Seat Management Modal */}
        <Dialog
          open={Boolean(activeBookedSeatModal)}
          onOpenChange={(open) => {
            if (!open) setActiveBookedSeatModal(null);
          }}
        >
          <DialogContent
            className="max-w-md w-[92vw] p-0 overflow-hidden rounded-[28px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl"
            onPointerDownOutside={() => setActiveBookedSeatModal(null)}
            onInteractOutside={() => setActiveBookedSeatModal(null)}
          >
            {activeBookedSeatModal && (
              <div className="p-6 space-y-5">
                {/* Header */}
                <div className="flex items-start justify-between gap-3 pr-8">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold text-base shadow-xs shrink-0">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-base text-slate-900 dark:text-white leading-tight">
                        {language === "th" ? "จัดการที่นั่งที่มีผู้โดยสารจอง" : "Manage Booked Seat"}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        {language === "th"
                          ? `ที่นั่ง ${activeBookedSeatModal.seatId} บนเที่ยวบิน ${selectedFlightNo}`
                          : `Seat ${activeBookedSeatModal.seatId} on flight ${selectedFlightNo}`}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Passenger Info Card */}
                <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-700/80 space-y-2.5 text-xs">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-700">
                    <span className="text-slate-500 dark:text-slate-400">{language === "th" ? "ชื่อผู้โดยสาร" : "Passenger"}</span>
                    <span className="font-bold text-slate-900 dark:text-white text-sm">{activeBookedSeatModal.booking.passengerName}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 dark:text-slate-400">{language === "th" ? "เส้นทางบิน" : "Route"}</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {activeBookedSeatModal.booking.from.split(" ")[0]} → {activeBookedSeatModal.booking.to.split(" ")[0]}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 dark:text-slate-400">{language === "th" ? "วันที่เดินทาง" : "Departure Date"}</span>
                    <span className="font-mono text-slate-800 dark:text-slate-200">{activeBookedSeatModal.booking.departDate}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 dark:text-slate-400">{language === "th" ? "เบอร์ติดต่อ" : "Phone"}</span>
                    <span className="font-mono text-slate-800 dark:text-slate-200">{activeBookedSeatModal.booking.phone || "-"}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 dark:text-slate-400">{language === "th" ? "อีเมล" : "Email"}</span>
                    <span className="font-mono text-slate-800 dark:text-slate-200 truncate max-w-[200px]">{activeBookedSeatModal.booking.email || "-"}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={() => handleReleaseBookedSeat(activeBookedSeatModal.seatId)}
                    className="w-full py-2.5 px-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 font-semibold text-xs text-center transition-colors cursor-pointer"
                  >
                    {language === "th"
                      ? `ปลดล็อคที่นั่ง ${activeBookedSeatModal.seatId} ให้กลับมาว่าง (ยกเลิกการจอง)`
                      : `Release & Unlock Seat ${activeBookedSeatModal.seatId} (Make Available)`}
                  </button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}