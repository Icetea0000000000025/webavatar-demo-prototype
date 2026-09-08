import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "@/lib/LanguageContext";
import {
  getBookings,
  deleteBooking,
  clearBookings,
  getLockedSeats,
  toggleSeatLock,
  lockSeats,
  unlockSeats,
  unlockAllSeats,
  resetLockedSeatsToDefault,
  MOCK_FLEET,
  type Booking,
} from "@/lib/bookings";
import { getCityFullName } from "./FlightDemo";
import { Toaster, toast } from "sonner";
import {
  Lock,
  Unlock,
  User,
  RefreshCw,
  Plane,
  RotateCcw,
  Search,
  CheckCircle2,
  Armchair,
  Layers
} from "lucide-react";

export default function FlightAdmin() {
  const { t, language } = useTranslation();
  const [activeTab, setActiveTab] = useState<"bookings" | "seats">("seats");
  const [items, setItems] = useState<Booking[]>([]);
  const [selectedFlightNo, setSelectedFlightNo] = useState<string>("BTN201");
  const [lockedSeats, setLockedSeatsState] = useState<string[]>([]);
  const [q, setQ] = useState("");
  const [selectedRoute, setSelectedRoute] = useState<string>("ALL");
  const [selectedSeatDetail, setSelectedSeatDetail] = useState<string | null>("1A");
  const [seatFilter, setSeatFilter] = useState<"ALL" | "AVAILABLE" | "LOCKED" | "BOOKED">("ALL");

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

  // Filtered bookings
  const filteredBookings = items.filter((b) =>
    [b.passengerName, b.email, b.from, b.to, b.phone, b.seat || "", b.outboundFlightNo || "", b.aircraftModel || ""].join(" ").toLowerCase().includes(q.toLowerCase())
  );

  // Seat matrix (10 rows x 6 cols)
  const rows = Array.from({ length: 10 }, (_, i) => i + 1);
  const leftCols = ["A", "B", "C"];
  const rightCols = ["D", "E", "F"];
  const allCols = ["A", "B", "C", "D", "E", "F"];

  // Map seat status
  const seatStatusMap = useMemo(() => {
    const map = new Map<string, { status: "available" | "locked" | "booked"; booking?: Booking }>();

    rows.forEach((r) => {
      allCols.forEach((c) => {
        const seatId = `${r}${c}`;
        // Check if booked on this aircraft/flight
        const booking = items.find((b) => {
          if (!b.seat) return false;
          const seats = b.seat.split(",").map((s) => s.trim());
          if (!seats.includes(seatId)) return false;
          if (b.outboundFlightNo === selectedFlightNo || b.inboundFlightNo === selectedFlightNo || b.legs?.some((l) => l.flightNo === selectedFlightNo)) {
            return true;
          }
          if (!b.outboundFlightNo && selectedRoute !== "ALL") {
            const [from, to] = selectedRoute.split("→").map((s) => s.trim());
            return b.from === from && b.to === to;
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
  }, [items, lockedSeats, selectedFlightNo, selectedRoute]);

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
    const status = seatStatusMap.get(seatId)?.status;
    if (status === "booked") {
      toast.info(
        language === "th"
          ? `ที่นั่ง ${seatId} มีผู้โดยสารจองแล้ว กรุณายกเลิกการจองก่อนเพื่อล็อค/ปลดล็อค`
          : `Seat ${seatId} is already booked. Cancel the booking first to lock/unlock.`
      );
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

  const handleLockRow = (rowNum: number) => {
    const rowSeats = allCols.map((c) => `${rowNum}${c}`);
    // Filter out already booked
    const toLock = rowSeats.filter((s) => seatStatusMap.get(s)?.status !== "booked");
    const updated = lockSeats(toLock, selectedFlightNo);
    setLockedSeatsState(updated);
    toast.success(
      language === "th" ? `🔒 ล็อคที่นั่งแถว ${rowNum} ทั้งหมดบนเที่ยวบิน ${selectedFlightNo} เรียบร้อยแล้ว` : `🔒 Locked all seats in row ${rowNum} on ${selectedFlightNo}`
    );
  };

  const handleUnlockRow = (rowNum: number) => {
    const rowSeats = allCols.map((c) => `${rowNum}${c}`);
    const updated = unlockSeats(rowSeats, selectedFlightNo);
    setLockedSeatsState(updated);
    toast.success(
      language === "th" ? `🔓 ปลดล็อคที่นั่งแถว ${rowNum} บนเที่ยวบิน ${selectedFlightNo} เรียบร้อยแล้ว` : `🔓 Unlocked all seats in row ${rowNum} on ${selectedFlightNo}`
    );
  };

  const handleUnlockAll = () => {
    if (confirm(language === "th" ? `คุณแน่ใจหรือไม่ที่จะปลดล็อคที่นั่งทั้งหมดของเที่ยวบิน ${selectedFlightNo}?` : `Are you sure to unlock all seats on ${selectedFlightNo}?`)) {
      const updated = unlockAllSeats(selectedFlightNo);
      setLockedSeatsState(updated);
      toast.success(language === "th" ? `🔓 ปลดล็อคที่นั่งทั้งหมดของ ${selectedFlightNo} แล้ว` : `🔓 All locked seats unlocked on ${selectedFlightNo}`);
    }
  };

  const handleResetDefaults = () => {
    if (confirm(language === "th" ? `รีเซ็ตสถานะการล็อคที่นั่งของเที่ยวบิน ${selectedFlightNo} กลับเป็นค่าเริ่มต้นหรือไม่?` : `Reset locked seats of ${selectedFlightNo} to default?`)) {
      const updated = resetLockedSeatsToDefault(selectedFlightNo);
      setLockedSeatsState(updated);
      toast.success(language === "th" ? `🔄 รีเซ็ตค่าเริ่มต้นของ ${selectedFlightNo} แล้ว` : `🔄 Reset to default seats for ${selectedFlightNo}`);
    }
  };


  return (
    <div className="flight-theme min-h-screen bg-slate-50 dark:bg-slate-950 text-foreground pb-24">
      <Toaster position="top-center" richColors />

      {/* Header */}
      <header className="bg-white/90 dark:bg-slate-900/90 border-b border-border/80 text-foreground shadow-xs sticky top-0 z-30 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-6 py-3.5 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-sky-600 text-white flex items-center justify-center font-black shadow-sm">
              <Plane className="w-4 h-4" />
            </div>
            <div>
              <span className="text-base font-black tracking-tight block leading-none text-slate-900 dark:text-white">
                {t("flight_admin.header")}
              </span>
              <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                {language === "th" ? "ระบบจัดการเที่ยวบินและผังที่นั่ง" : "Flight Operations & Seat Console"}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={refreshData}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
              title={t("flight_admin.btn_refresh")}
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <Link
              to="/flight-demo"
              className="text-xs font-bold px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white transition-all shadow-xs flex items-center gap-1.5"
            >
              <span>{t("nav.back_to_main")}</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 py-8 relative z-10 text-left">
        {/* Navigation Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-2 bg-slate-200/70 dark:bg-slate-800/80 p-1.5 rounded-2xl w-fit">
            <button
              onClick={() => setActiveTab("seats")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-display font-bold text-xs transition-all cursor-pointer ${
                activeTab === "seats"
                  ? "bg-white dark:bg-slate-900 text-sky-600 dark:text-sky-400 shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <Armchair className="w-4 h-4" />
              <span>{language === "th" ? "ผังและจัดการล็อคที่นั่ง" : "Seat Map & Lock Manager"}</span>
              <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 font-bold">
                {totalSeats}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("bookings")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-display font-bold text-xs transition-all cursor-pointer ${
                activeTab === "bookings"
                  ? "bg-white dark:bg-slate-900 text-sky-600 dark:text-sky-400 shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>{language === "th" ? "รายการจองตั๋วทั้งหมด" : "Passenger Bookings"}</span>
              <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold">
                {items.length}
              </span>
            </button>
          </div>

          {/* Quick Actions / Helpers */}
          {activeTab === "seats" && (
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={handleUnlockAll}
                className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer"
              >
                <Unlock className="w-3.5 h-3.5 text-emerald-600" />
                <span>{language === "th" ? "ปลดล็อคทั้งหมด" : "Unlock All"}</span>
              </button>

              <button
                onClick={handleResetDefaults}
                className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5 text-amber-600" />
                <span>{language === "th" ? "คืนค่าเริ่มต้น (11 ที่นั่ง)" : "Reset Defaults"}</span>
              </button>
            </div>
          )}
        </div>

        {/* ══════════════════════════════════════════════════════════════
            TAB 1: SEAT MAP & LOCK MANAGEMENT
        ══════════════════════════════════════════════════════════════ */}
        {activeTab === "seats" && (
          <div className="space-y-6">
            {/* ── ULTRA-COMPACT UNIFIED FLEET & STATS TOOLBAR ── */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-2.5 shadow-2xs space-y-2">
              {/* Row 1: Fleet Selector Pills */}
              <div className="flex flex-wrap items-center gap-1.5">
                <div className="flex items-center gap-1.5 mr-1 shrink-0">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="font-display font-bold text-[11px] text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                    {language === "th" ? "ฝูงบิน (6)" : "Fleet (6)"}
                  </span>
                </div>

                {MOCK_FLEET.map((plane) => {
                  const isSelected = selectedFlightNo === plane.flightNo;
                  return (
                    <button
                      key={plane.id}
                      type="button"
                      onClick={() => {
                        setSelectedFlightNo(plane.flightNo);
                        setSelectedSeatDetail("1A");
                      }}
                      className={`h-7 px-2 rounded-lg text-xs font-medium transition-all cursor-pointer inline-flex items-center gap-1.5 border shrink-0 ${
                        isSelected
                          ? "bg-sky-600 text-white border-sky-600 shadow-2xs font-bold"
                          : "bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border-slate-200/80 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
                      }`}
                    >
                      <span className="font-mono font-black text-xs">{plane.flightNo}</span>
                      <span className={`text-[11px] max-w-[95px] truncate ${isSelected ? "text-sky-100" : "text-slate-500 dark:text-slate-400"}`}>
                        {plane.model}
                      </span>
                      <span className={`text-[9px] font-mono px-1 py-0.5 rounded leading-none ${
                        isSelected
                          ? "bg-sky-700 text-sky-100"
                          : "bg-slate-200/70 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
                      }`}>
                        {plane.tailNumber}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Row 2: Slim Aircraft Specs & Live Stats Strip */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-col lg:flex-row lg:items-center justify-between gap-2 text-xs">
                {/* Left: Aircraft Meta */}
                <div className="flex items-center gap-1.5 flex-wrap text-slate-600 dark:text-slate-300">
                  <div className="w-4.5 h-4.5 rounded-md bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0">
                    <Plane className="w-3 h-3" />
                  </div>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {currentAircraft.model}
                  </span>
                  <span className="font-mono text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-1.5 py-0.5 rounded border border-slate-200/70 dark:border-slate-700 leading-none">
                    {currentAircraft.tailNumber}
                  </span>
                  <span className="text-slate-300 dark:text-slate-600">·</span>
                  <span>{currentAircraft.airlineName} ({currentAircraft.flightNo})</span>
                  <span className="text-slate-300 dark:text-slate-600">·</span>
                  <span className="font-mono text-slate-500 dark:text-slate-400">{currentAircraft.route} ({currentAircraft.depTime})</span>
                  <span className="text-slate-300 dark:text-slate-600">·</span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    <strong className="text-amber-500">{currentAircraft.businessSeats}</strong> {language === "th" ? "ธุรกิจ" : "Biz"} / <strong className="text-sky-500">{currentAircraft.economySeats}</strong> {language === "th" ? "ประหยัด" : "Eco"}
                  </span>
                </div>

                {/* Right: Compact Live Stat Filters */}
                <div className="flex items-center gap-1.5 shrink-0">
                  {/* Total */}
                  <button
                    type="button"
                    onClick={() => setSeatFilter("ALL")}
                    className={`h-7 px-2 rounded-lg border text-[11px] font-bold inline-flex items-center gap-1 cursor-pointer transition-all ${
                      seatFilter === "ALL"
                        ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-transparent shadow-2xs"
                        : "bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    <Armchair className="w-3 h-3" />
                    <span>{language === "th" ? "ทั้งหมด" : "All"}: {totalSeats}</span>
                  </button>

                  {/* Available */}
                  <button
                    type="button"
                    onClick={() => setSeatFilter(seatFilter === "AVAILABLE" ? "ALL" : "AVAILABLE")}
                    className={`h-7 px-2 rounded-lg border text-[11px] font-bold inline-flex items-center gap-1 cursor-pointer transition-all ${
                      seatFilter === "AVAILABLE"
                        ? "bg-emerald-600 text-white border-emerald-600 shadow-2xs"
                        : "bg-emerald-50/60 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100/70"
                    }`}
                  >
                    <CheckCircle2 className="w-3 h-3" />
                    <span>{language === "th" ? "ว่าง" : "Open"}: {availableCount}</span>
                  </button>

                  {/* Locked */}
                  <button
                    type="button"
                    onClick={() => setSeatFilter(seatFilter === "LOCKED" ? "ALL" : "LOCKED")}
                    className={`h-7 px-2 rounded-lg border text-[11px] font-bold inline-flex items-center gap-1 cursor-pointer transition-all ${
                      seatFilter === "LOCKED"
                        ? "bg-rose-600 text-white border-rose-600 shadow-2xs"
                        : "bg-rose-50/60 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-800 hover:bg-rose-100/70"
                    }`}
                  >
                    <Lock className="w-3 h-3" />
                    <span>{language === "th" ? "ล็อค" : "Lock"}: {lockedCount}</span>
                  </button>

                  {/* Booked */}
                  <button
                    type="button"
                    onClick={() => setSeatFilter(seatFilter === "BOOKED" ? "ALL" : "BOOKED")}
                    className={`h-7 px-2 rounded-lg border text-[11px] font-bold inline-flex items-center gap-1 cursor-pointer transition-all ${
                      seatFilter === "BOOKED"
                        ? "bg-sky-600 text-white border-sky-600 shadow-2xs"
                        : "bg-sky-50/60 dark:bg-sky-950/40 text-sky-700 dark:text-sky-400 border-sky-200 dark:border-sky-800 hover:bg-sky-100/70"
                    }`}
                  >
                    <User className="w-3 h-3" />
                    <span>{language === "th" ? "จองแล้ว" : "Booked"}: {bookedCount}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Interactive Cabin Map (Centered & Focused) */}
            <div className="max-w-3xl mx-auto bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 md:p-8 shadow-sm space-y-6">
              {/* Header & Controls */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h2 className="font-display text-base md:text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                    <span>{language === "th" ? `ผังห้องโดยสาร ${currentAircraft.model}` : `${currentAircraft.model} Seat Plan`}</span>
                    <span className="font-mono text-xs text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/60 px-2 py-0.5 rounded-full border border-sky-200 dark:border-sky-800">
                      {currentAircraft.flightNo}
                    </span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {language === "th"
                      ? `คลิกที่ที่นั่งเพื่อ 🔒 สลับสถานะล็อค / ปลดล็อค สำหรับเที่ยวบิน ${currentAircraft.flightNo}`
                      : `Click any seat to toggle 🔒 Lock / Unlock for ${currentAircraft.flightNo}.`}
                  </p>
                </div>

                {/* Actions: Route Filter & Reset */}
                <div className="flex items-center gap-2 flex-wrap">
                  <select
                    value={selectedRoute}
                    onChange={(e) => setSelectedRoute(e.target.value)}
                    className="text-xs font-bold px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 outline-none cursor-pointer"
                  >
                    <option value="ALL">{language === "th" ? "ทุกเส้นทาง (Global / All)" : "All Routes"}</option>
                    <option value="กรุงเทพฯ (DMK) → เชียงใหม่ (CNX)">DMK → CNX (เชียงใหม่)</option>
                    <option value="กรุงเทพฯ (DMK) → ภูเก็ต (HKT)">DMK → HKT (ภูเก็ต)</option>
                    <option value="กรุงเทพฯ (DMK) → หาดใหญ่ (HDY)">DMK → HDY (หาดใหญ่)</option>
                  </select>

                  <button
                    type="button"
                    onClick={handleResetDefaults}
                    className="px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                    title={language === "th" ? "รีเซ็ตสถานะการล็อคกลับเป็นค่าเริ่มต้น" : "Reset locks to defaults"}
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">{language === "th" ? "รีเซ็ตค่าเริ่มต้น" : "Reset Defaults"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleUnlockAll}
                    className="px-2.5 py-1.5 rounded-xl border border-rose-200 dark:border-rose-900 bg-rose-50 dark:bg-rose-950/50 hover:bg-rose-100 text-rose-600 dark:text-rose-400 text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                    title={language === "th" ? "ปลดล็อคที่นั่งทั้งหมดของเครื่องบินนี้" : "Unlock all seats"}
                  >
                    <Unlock className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">{language === "th" ? "ปลดล็อคทั้งหมด" : "Unlock All"}</span>
                  </button>
                </div>
              </div>

              {/* Seat Map Legend */}
              <div className="flex flex-wrap justify-center gap-4 text-xs bg-slate-50 dark:bg-slate-800/50 py-2.5 px-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-3.5 h-3.5 rounded-full bg-[#cbdcf7] dark:bg-sky-900/60 border border-[#cbdcf7] dark:border-sky-700" />
                  <span className="text-[11px] font-medium text-slate-700 dark:text-slate-300">
                    {language === "th" ? "ว่าง (คลิกเพื่อล็อค)" : "Available (Click to Lock)"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3.5 h-3.5 rounded-full bg-rose-500 text-white flex items-center justify-center text-[8px] font-bold">
                    <Lock className="w-2 h-2" />
                  </div>
                  <span className="text-[11px] font-bold text-rose-600 dark:text-rose-400">
                    {language === "th" ? "ล็อคโดยแอดมิน (คลิกเพื่อปลด)" : "Admin Locked (Click to Unlock)"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3.5 h-3.5 rounded-full bg-sky-900 dark:bg-sky-700 text-white flex items-center justify-center text-[8px] font-bold">
                    <User className="w-2 h-2" />
                  </div>
                  <span className="text-[11px] font-bold text-sky-800 dark:text-sky-300">
                    {language === "th" ? "มีผู้โดยสารจองแล้ว" : "Booked by Passenger"}
                  </span>
                </div>
              </div>

              {/* Airplane Cabin Map Container */}
              <div className="max-w-[380px] mx-auto bg-slate-50/80 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 pt-7 relative overflow-hidden shadow-inner">
                {/* Mock Cockpit */}
                <div className="w-36 h-10 border-t-2 border-x-2 border-slate-300 dark:border-slate-700 rounded-t-full mx-auto mb-5 flex items-center justify-center bg-white dark:bg-slate-900 relative shadow-2xs">
                  <div className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-600 absolute left-4 bottom-2" />
                  <div className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-600 absolute right-4 bottom-2" />
                  <span className="text-[10px] font-black text-slate-400 dark:text-slate-400 tracking-widest uppercase">
                    {t("flight.cockpit")}
                  </span>
                </div>

                {/* Seat Grid Rows with Class Section Headers */}
                <div className="space-y-3">
                  {rows.map((row) => (
                    <div key={row}>
                      {row === 1 && (
                        <div className="text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800/60 py-1 px-3 rounded-lg text-center mb-2.5 font-display">
                          👑 {language === "th" ? "ชั้นธุรกิจ (Business Class · แถว 1 - 2)" : "Business Class (Rows 1 - 2)"}
                        </div>
                      )}
                      {row === 3 && (
                        <div className="text-[10px] font-bold text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/50 border border-sky-200 dark:border-sky-800/60 py-1 px-3 rounded-lg text-center mt-3 mb-2.5 font-display">
                          ✈️ {language === "th" ? "ชั้นประหยัด (Economy Class · แถว 3 - 10)" : "Economy Class (Rows 3 - 10)"}
                        </div>
                      )}
                      <div className="flex items-center justify-between gap-2 px-1 group/row">
                        {/* Left seats A, B, C */}
                        <div className="flex items-center gap-1.5">
                          {leftCols.map((col) => {
                            const seatId = `${row}${col}`;
                            const seatInfo = seatStatusMap.get(seatId);
                            const status = seatInfo?.status || "available";
                            const isSelected = selectedSeatDetail === seatId;
                            const isFaded =
                              seatFilter !== "ALL" &&
                              ((seatFilter === "AVAILABLE" && status !== "available") ||
                                (seatFilter === "LOCKED" && status !== "locked") ||
                                (seatFilter === "BOOKED" && status !== "booked"));

                            return (
                              <button
                                key={seatId}
                                type="button"
                                onClick={() => {
                                  setSelectedSeatDetail(seatId);
                                  handleToggleLock(seatId);
                                }}
                                className={`w-9 h-9 min-w-[36px] min-h-[36px] max-w-[36px] max-h-[36px] rounded-xl text-[10px] font-extrabold border transition-all cursor-pointer flex flex-col items-center justify-center shrink-0 relative ${
                                  isFaded ? "opacity-20 scale-90" : ""
                                } ${
                                  isSelected ? "ring-2 ring-sky-500 scale-105 shadow-md z-10" : ""
                                } ${
                                  status === "locked"
                                    ? "bg-rose-500 text-white border-rose-600 hover:bg-rose-600 shadow-xs"
                                    : status === "booked"
                                    ? "bg-sky-950 dark:bg-sky-700 text-white border-sky-900 hover:bg-sky-900 shadow-xs"
                                    : "bg-[#cbdcf7]/70 dark:bg-sky-950/60 border-[#cbdcf7] dark:border-sky-800 text-[#0f3460] dark:text-sky-200 hover:bg-rose-100 dark:hover:bg-rose-950 hover:border-rose-400 hover:text-rose-600"
                                }`}
                                title={`ที่นั่ง ${seatId} (${currentAircraft.flightNo}) - ${status === "locked" ? "ล็อคแล้ว (คลิกเพื่อปลด)" : status === "booked" ? "จองแล้ว" : "ว่าง (คลิกเพื่อล็อค)"}`}
                              >
                                <span>{seatId}</span>
                                {status === "locked" && <Lock className="w-2.5 h-2.5 absolute -top-1 -right-1 bg-white text-rose-600 rounded-full p-0.5 shadow-xs" />}
                                {status === "booked" && <User className="w-2.5 h-2.5 absolute -top-1 -right-1 bg-white text-sky-800 rounded-full p-0.5 shadow-xs" />}
                              </button>
                            );
                          })}
                        </div>

                        {/* Aisle spacer with row number & Row Lock/Unlock hover button */}
                        <div className="flex flex-col items-center justify-center w-7 select-none relative group/btn">
                          <span className="text-[10px] font-black text-slate-400 dark:text-slate-500">{row}</span>
                          {/* Row Action Tooltip on hover */}
                          <div className="opacity-0 group-hover/row:opacity-100 transition-opacity flex items-center gap-1 mt-0.5">
                            <button
                              type="button"
                              onClick={() => handleLockRow(row)}
                              title={`ล็อคทั้งแถว ${row} (${currentAircraft.flightNo})`}
                              className="text-[9px] text-rose-500 hover:text-rose-700 font-bold cursor-pointer"
                            >
                              🔒
                            </button>
                            <button
                              type="button"
                              onClick={() => handleUnlockRow(row)}
                              title={`ปลดล็อคทั้งแถว ${row} (${currentAircraft.flightNo})`}
                              className="text-[9px] text-emerald-500 hover:text-emerald-700 font-bold cursor-pointer"
                            >
                              🔓
                            </button>
                          </div>
                        </div>

                        {/* Right seats D, E, F */}
                        <div className="flex items-center gap-1.5">
                          {rightCols.map((col) => {
                            const seatId = `${row}${col}`;
                            const seatInfo = seatStatusMap.get(seatId);
                            const status = seatInfo?.status || "available";
                            const isSelected = selectedSeatDetail === seatId;
                            const isFaded =
                              seatFilter !== "ALL" &&
                              ((seatFilter === "AVAILABLE" && status !== "available") ||
                                (seatFilter === "LOCKED" && status !== "locked") ||
                                (seatFilter === "BOOKED" && status !== "booked"));

                            return (
                              <button
                                key={seatId}
                                type="button"
                                onClick={() => {
                                  setSelectedSeatDetail(seatId);
                                  handleToggleLock(seatId);
                                }}
                                className={`w-9 h-9 min-w-[36px] min-h-[36px] max-w-[36px] max-h-[36px] rounded-xl text-[10px] font-extrabold border transition-all cursor-pointer flex flex-col items-center justify-center shrink-0 relative ${
                                  isFaded ? "opacity-20 scale-90" : ""
                                } ${
                                  isSelected ? "ring-2 ring-sky-500 scale-105 shadow-md z-10" : ""
                                } ${
                                  status === "locked"
                                    ? "bg-rose-500 text-white border-rose-600 hover:bg-rose-600 shadow-xs"
                                    : status === "booked"
                                    ? "bg-sky-950 dark:bg-sky-700 text-white border-sky-900 hover:bg-sky-900 shadow-xs"
                                    : "bg-[#cbdcf7]/70 dark:bg-sky-950/60 border-[#cbdcf7] dark:border-sky-800 text-[#0f3460] dark:text-sky-200 hover:bg-rose-100 dark:hover:bg-rose-950 hover:border-rose-400 hover:text-rose-600"
                                }`}
                                title={`ที่นั่ง ${seatId} (${currentAircraft.flightNo}) - ${status === "locked" ? "ล็อคแล้ว (คลิกเพื่อปลด)" : status === "booked" ? "จองแล้ว" : "ว่าง (คลิกเพื่อล็อค)"}`}
                              >
                                <span>{seatId}</span>
                                {status === "locked" && <Lock className="w-2.5 h-2.5 absolute -top-1 -right-1 bg-white text-rose-600 rounded-full p-0.5 shadow-xs" />}
                                {status === "booked" && <User className="w-2.5 h-2.5 absolute -top-1 -right-1 bg-white text-sky-800 rounded-full p-0.5 shadow-xs" />}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Exit Indicators */}
                <div className="flex justify-between items-center mt-6 text-[9px] font-black text-slate-400 px-3">
                  <span>{language === "th" ? "◀ ประตูทางออก" : "◀ EXIT"}</span>
                  <span>{language === "th" ? "ประตูทางออก ▶" : "EXIT ▶"}</span>
                </div>
              </div>

              {/* Batch Row Locking Quick Bar (Compact) */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    {language === "th" ? "ควบคุมล็อค/ปลดล็อคแบบทั้งแถว (Batch Rows)" : "Batch Row Controls"}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {language === "th" ? "คลิก 🔒 / 🔓 ประจำแถว" : "Click 🔒 / 🔓 per row"}
                  </span>
                </div>
                <div className="grid grid-cols-5 sm:grid-cols-10 gap-1.5">
                  {rows.map((r) => (
                    <div key={r} className="p-1.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 text-center">
                      <span className="text-[10px] font-black text-slate-600 dark:text-slate-400 block mb-1">
                        {r}
                      </span>
                      <div className="flex justify-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleLockRow(r)}
                          className="w-5 h-5 rounded bg-rose-100 dark:bg-rose-950 text-rose-600 hover:bg-rose-200 text-[10px] font-bold flex items-center justify-center cursor-pointer"
                          title={`ล็อคแถว ${r}`}
                        >
                          <Lock className="w-2.5 h-2.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleUnlockRow(r)}
                          className="w-5 h-5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-600 hover:bg-emerald-200 text-[10px] font-bold flex items-center justify-center cursor-pointer"
                          title={`ปลดล็อคแถว ${r}`}
                        >
                          <Unlock className="w-2.5 h-2.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════
            TAB 2: PASSENGER BOOKINGS MANIFEST
        ══════════════════════════════════════════════════════════════ */}
        {activeTab === "bookings" && (
          <div>
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
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
                className="rounded-2xl border border-slate-200 dark:border-slate-800 p-12 text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <p className="font-display text-base font-bold text-slate-600 dark:text-slate-400">
                  {t("flight_admin.no_bookings")}
                </p>
              </motion.div>
            ) : (
              <motion.div
                className="overflow-x-auto border-t border-b border-slate-200/80 dark:border-slate-800"
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
      </main>
    </div>
  );
}