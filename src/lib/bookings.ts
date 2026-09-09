export type FlightLeg = {
  from: string;
  to: string;
  departDate: string;
  flightNo?: string;
  departTime?: string;
  arrivalTime?: string;
  airlineName?: string;
  airlineCode?: string;
  price?: number;
};

export type Aircraft = {
  id: string;
  flightNo: string;
  airlineCode: string;
  airlineName: string;
  model: string;
  tailNumber: string;
  type: string;
  route: string;
  depTime: string;
  arrTime: string;
  capacity: number;
  businessSeats: number;
  economySeats: number;
  price?: number;
  priceStr?: string;
  originCity?: string;
  originCode?: string;
  destCity?: string;
  destCode?: string;
  terminalInfo?: string;
  durationStr?: string;
};

export const MOCK_FLEET: Aircraft[] = [
  {
    id: "BTN-01",
    flightNo: "BTN201",
    airlineCode: "BTN",
    airlineName: "Botnoi Air",
    model: "Airbus A320-200",
    tailNumber: "HS-BNA",
    type: "Narrow-body Jet",
    route: "DMK → CNX",
    depTime: "06:15",
    arrTime: "07:30",
    capacity: 60,
    businessSeats: 12,
    economySeats: 48,
    price: 890,
    priceStr: "฿890",
    originCity: "กรุงเทพฯ (DMK)",
    originCode: "DMK",
    destCity: "เชียงใหม่ (CNX)",
    destCode: "CNX",
    durationStr: "1 ชม. 15 นาที",
    terminalInfo: "อาคาร 2 (ดอนเมือง)",
  },
  {
    id: "THA-01",
    flightNo: "THA312",
    airlineCode: "THA",
    airlineName: "Thai Airways",
    model: "Boeing 777-300ER",
    tailNumber: "HS-TGA",
    type: "Wide-body Jet",
    route: "BKK → CNX",
    depTime: "08:30",
    arrTime: "09:45",
    capacity: 60,
    businessSeats: 12,
    economySeats: 48,
    price: 1450,
    priceStr: "฿1,450",
    originCity: "กรุงเทพฯ (BKK)",
    originCode: "BKK",
    destCity: "เชียงใหม่ (CNX)",
    destCode: "CNX",
    durationStr: "1 ชม. 15 นาที",
    terminalInfo: "อาคารผู้โดยสารหลัก (สุวรรณภูมิ)",
  },
  {
    id: "BTN-02",
    flightNo: "BTN205",
    airlineCode: "BTN",
    airlineName: "Botnoi Air",
    model: "Airbus A321neo",
    tailNumber: "HS-BNB",
    type: "Narrow-body Jet",
    route: "DMK → HKT",
    depTime: "10:15",
    arrTime: "11:40",
    capacity: 60,
    businessSeats: 12,
    economySeats: 48,
    price: 1250,
    priceStr: "฿1,250",
    originCity: "กรุงเทพฯ (DMK)",
    originCode: "DMK",
    destCity: "ภูเก็ต (HKT)",
    destCode: "HKT",
    durationStr: "1 ชม. 25 นาที",
    terminalInfo: "อาคาร 2 (ดอนเมือง)",
  },
  {
    id: "THA-02",
    flightNo: "THA325",
    airlineCode: "THA",
    airlineName: "Thai Airways",
    model: "Boeing 787-9 Dreamliner",
    tailNumber: "HS-TGB",
    type: "Wide-body Jet",
    route: "BKK → HKT",
    depTime: "11:50",
    arrTime: "13:15",
    capacity: 60,
    businessSeats: 12,
    economySeats: 48,
    price: 1890,
    priceStr: "฿1,890",
    originCity: "กรุงเทพฯ (BKK)",
    originCode: "BKK",
    destCity: "ภูเก็ต (HKT)",
    destCode: "HKT",
    durationStr: "1 ชม. 25 นาที",
    terminalInfo: "อาคารผู้โดยสารหลัก (สุวรรณภูมิ)",
  },
  {
    id: "BTN-03",
    flightNo: "BTN209",
    airlineCode: "BTN",
    airlineName: "Botnoi Air",
    model: "Airbus A320neo",
    tailNumber: "HS-BNC",
    type: "Narrow-body Jet",
    route: "DMK → HDY",
    depTime: "13:00",
    arrTime: "14:30",
    capacity: 60,
    businessSeats: 12,
    economySeats: 48,
    price: 1190,
    priceStr: "฿1,190",
    originCity: "กรุงเทพฯ (DMK)",
    originCode: "DMK",
    destCity: "หาดใหญ่ (HDY)",
    destCode: "HDY",
    durationStr: "1 ชม. 30 นาที",
    terminalInfo: "อาคาร 2 (ดอนเมือง)",
  },
  {
    id: "BKP-01",
    flightNo: "BKP485",
    airlineCode: "BKP",
    airlineName: "Bangkok Airways",
    model: "Airbus A320",
    tailNumber: "HS-PGA",
    type: "Narrow-body Jet",
    route: "BKK → KBV",
    depTime: "14:20",
    arrTime: "15:40",
    capacity: 60,
    businessSeats: 12,
    economySeats: 48,
    price: 1650,
    priceStr: "฿1,650",
    originCity: "กรุงเทพฯ (BKK)",
    originCode: "BKK",
    destCity: "กระบี่ (KBV)",
    destCode: "KBV",
    durationStr: "1 ชม. 20 นาที",
    terminalInfo: "อาคารผู้โดยสารหลัก (สุวรรณภูมิ)",
  },
  {
    id: "BTN-04",
    flightNo: "BTN215",
    airlineCode: "BTN",
    airlineName: "Botnoi Air",
    model: "Airbus A320-200",
    tailNumber: "HS-BND",
    type: "Narrow-body Jet",
    route: "DMK → CEI",
    depTime: "15:45",
    arrTime: "17:10",
    capacity: 60,
    businessSeats: 12,
    economySeats: 48,
    price: 1050,
    priceStr: "฿1,050",
    originCity: "กรุงเทพฯ (DMK)",
    originCode: "DMK",
    destCity: "เชียงราย (CEI)",
    destCode: "CEI",
    durationStr: "1 ชม. 25 นาที",
    terminalInfo: "อาคาร 2 (ดอนเมือง)",
  },
  {
    id: "THA-03",
    flightNo: "THA331",
    airlineCode: "THA",
    airlineName: "Thai Airways",
    model: "Boeing 777-200",
    tailNumber: "HS-TGC",
    type: "Wide-body Jet",
    route: "BKK → URT",
    depTime: "17:00",
    arrTime: "18:15",
    capacity: 60,
    businessSeats: 12,
    economySeats: 48,
    price: 1390,
    priceStr: "฿1,390",
    originCity: "กรุงเทพฯ (BKK)",
    originCode: "BKK",
    destCity: "สุราษฎร์ธานี (URT)",
    destCode: "URT",
    durationStr: "1 ชม. 15 นาที",
    terminalInfo: "อาคารผู้โดยสารหลัก (สุวรรณภูมิ)",
  },
  {
    id: "BTN-05",
    flightNo: "BTN221",
    airlineCode: "BTN",
    airlineName: "Botnoi Air",
    model: "Airbus A320neo",
    tailNumber: "HS-BNE",
    type: "Narrow-body Jet",
    route: "DMK → UTH",
    depTime: "18:10",
    arrTime: "19:15",
    capacity: 60,
    businessSeats: 12,
    economySeats: 48,
    price: 950,
    priceStr: "฿950",
    originCity: "กรุงเทพฯ (DMK)",
    originCode: "DMK",
    destCity: "อุดรธานี (UTH)",
    destCode: "UTH",
    durationStr: "1 ชม. 05 นาที",
    terminalInfo: "อาคาร 2 (ดอนเมือง)",
  },
  {
    id: "THA-04",
    flightNo: "THA345",
    airlineCode: "THA",
    airlineName: "Thai Airways",
    model: "Airbus A320-200",
    tailNumber: "HS-TGD",
    type: "Narrow-body Jet",
    route: "BKK → UBP",
    depTime: "19:20",
    arrTime: "20:30",
    capacity: 60,
    businessSeats: 12,
    economySeats: 48,
    price: 1290,
    priceStr: "฿1,290",
    originCity: "กรุงเทพฯ (BKK)",
    originCode: "BKK",
    destCity: "อุบลราชธานี (UBP)",
    destCode: "UBP",
    durationStr: "1 ชม. 10 นาที",
    terminalInfo: "อาคารผู้โดยสารหลัก (สุวรรณภูมิ)",
  },
  {
    id: "BTN-06",
    flightNo: "BTN235",
    airlineCode: "BTN",
    airlineName: "Botnoi Air",
    model: "Airbus A321neo",
    tailNumber: "HS-BNF",
    type: "Narrow-body Jet",
    route: "DMK → KKC",
    depTime: "20:15",
    arrTime: "21:15",
    capacity: 60,
    businessSeats: 12,
    economySeats: 48,
    price: 890,
    priceStr: "฿890",
    originCity: "กรุงเทพฯ (DMK)",
    originCode: "DMK",
    destCity: "ขอนแก่น (KKC)",
    destCode: "KKC",
    durationStr: "1 ชม. 00 นาที",
    terminalInfo: "อาคาร 2 (ดอนเมือง)",
  },
  {
    id: "BKP-02",
    flightNo: "BKP499",
    airlineCode: "BKP",
    airlineName: "Bangkok Airways",
    model: "ATR 72-600",
    tailNumber: "HS-PGB",
    type: "Regional Turboprop",
    route: "BKK → NST",
    depTime: "21:10",
    arrTime: "22:25",
    capacity: 60,
    businessSeats: 12,
    economySeats: 48,
    price: 1550,
    priceStr: "฿1,550",
    originCity: "กรุงเทพฯ (BKK)",
    originCode: "BKK",
    destCity: "นครศรีธรรมราช (NST)",
    destCode: "NST",
    durationStr: "1 ชม. 15 นาที",
    terminalInfo: "อาคารผู้โดยสารหลัก (สุวรรณภูมิ)",
  },
  {
    id: "BTN-07",
    flightNo: "BTN207",
    airlineCode: "BTN",
    airlineName: "Botnoi Air",
    model: "Airbus A320neo",
    tailNumber: "HS-BNG",
    type: "Narrow-body Jet",
    route: "HKT → UTH",
    depTime: "11:30",
    arrTime: "13:15",
    capacity: 60,
    businessSeats: 12,
    economySeats: 48,
    price: 1890,
    priceStr: "฿1,890",
    originCity: "ภูเก็ต (HKT)",
    originCode: "HKT",
    destCity: "อุดรธานี (UTH)",
    destCode: "UTH",
    durationStr: "1 ชม. 45 นาที",
    terminalInfo: "อาคารผู้โดยสารภายในประเทศ (ภูเก็ต)",
  },
  {
    id: "BKP-03",
    flightNo: "BKP490",
    airlineCode: "BKP",
    airlineName: "Bangkok Airways",
    model: "Airbus A320",
    tailNumber: "HS-PGC",
    type: "Narrow-body Jet",
    route: "CNX → HKT",
    depTime: "16:00",
    arrTime: "18:00",
    capacity: 60,
    businessSeats: 12,
    economySeats: 48,
    price: 2190,
    priceStr: "฿2,190",
    originCity: "เชียงใหม่ (CNX)",
    originCode: "CNX",
    destCity: "ภูเก็ต (HKT)",
    destCode: "HKT",
    durationStr: "2 ชม. 00 นาที",
    terminalInfo: "อาคารผู้โดยสารภายในประเทศ (เชียงใหม่)",
  },
];

export type Booking = {
  id: string;
  createdAt: string;
  tripType: "round" | "oneway" | "multicity";
  from: string;
  to: string;
  departDate: string;
  returnDate?: string;
  legs?: FlightLeg[];
  passengers: number;
  promoCode?: string;
  passengerName: string;
  email: string;
  phone: string;
  seat?: string;
  pricePerPax?: number;
  class?: string;
  aircraftModel?: string;
  aircraftTail?: string;
  outboundFlightNo?: string;
  outboundTime?: string;
  inboundFlightNo?: string;
  inboundTime?: string;
};

const KEY = "nok_bookings";

export function getBookings(): Booking[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}

export function saveBooking(b: Omit<Booking, "id" | "createdAt">): Booking {
  const booking: Booking = {
    ...b,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
  const all = getBookings();
  all.unshift(booking);
  localStorage.setItem(KEY, JSON.stringify(all));
  return booking;
}

export function deleteBooking(id: string) {
  const all = getBookings().filter((b) => b.id !== id);
  localStorage.setItem(KEY, JSON.stringify(all));
}

export function clearBookings() {
  localStorage.removeItem(KEY);
}

export const DEFAULT_FLIGHT_LOCKED_SEATS: Record<string, string[]> = {
  BTN201: ["1A", "2E", "3F", "5D", "6B", "9C"],
  THA312: ["1B", "2A", "4C", "4D", "7F", "8A", "9E"],
  BTN205: ["1F", "2B", "3A", "6D", "7E", "10A"],
  THA325: ["1C", "2F", "4A", "5B", "7D", "8E", "10C"],
  BTN209: ["1A", "3B", "5F", "7C", "8D", "10E"],
  BKP485: ["1A", "1B", "3C", "5A", "8D", "9F"],
  BTN215: ["2C", "3E", "5A", "7B", "8F", "10D"],
  THA331: ["1E", "2B", "4F", "6A", "7D", "9C"],
  BTN221: ["1D", "2F", "4B", "5E", "8A", "9C"],
  THA345: ["1A", "3D", "4E", "6F", "7A", "10C"],
  BTN235: ["2A", "3C", "5B", "6E", "8D", "9F"],
  BKP499: ["1D", "2C", "3E", "6A", "7B", "9A"],
  BTN207: ["1A", "2B", "4C", "6D", "8E", "10F"],
  BKP490: ["1F", "2D", "3B", "5E", "7A", "9C"],
};

export const DEFAULT_LOCKED_SEATS = ["1B", "2E", "3A", "3F", "5D", "6B", "6C", "7A", "8F", "9C", "9D"];
export const LOCKED_SEATS_KEY = "botnoi_flight_locked_seats";

export function getLockedSeats(flightNo?: string): string[] {
  if (typeof window === "undefined") {
    return flightNo && DEFAULT_FLIGHT_LOCKED_SEATS[flightNo]
      ? DEFAULT_FLIGHT_LOCKED_SEATS[flightNo]
      : DEFAULT_LOCKED_SEATS;
  }
  try {
    const key = flightNo ? `${LOCKED_SEATS_KEY}_${flightNo}` : LOCKED_SEATS_KEY;
    const data = localStorage.getItem(key);
    if (data) return JSON.parse(data);

    if (flightNo && DEFAULT_FLIGHT_LOCKED_SEATS[flightNo]) {
      return DEFAULT_FLIGHT_LOCKED_SEATS[flightNo];
    }
    return DEFAULT_LOCKED_SEATS;
  } catch {
    return DEFAULT_LOCKED_SEATS;
  }
}

export function saveLockedSeats(seats: string[], flightNo?: string): void {
  if (typeof window === "undefined") return;
  const key = flightNo ? `${LOCKED_SEATS_KEY}_${flightNo}` : LOCKED_SEATS_KEY;
  localStorage.setItem(key, JSON.stringify(seats));
}

export function toggleSeatLock(seatId: string, flightNo?: string): string[] {
  const current = getLockedSeats(flightNo);
  let updated: string[];
  if (current.includes(seatId)) {
    updated = current.filter((s) => s !== seatId);
  } else {
    updated = [...current, seatId];
  }
  saveLockedSeats(updated, flightNo);
  return updated;
}

export function lockSeats(seatIds: string[], flightNo?: string): string[] {
  const current = getLockedSeats(flightNo);
  const updated = Array.from(new Set([...current, ...seatIds]));
  saveLockedSeats(updated, flightNo);
  return updated;
}

export function unlockSeats(seatIds: string[], flightNo?: string): string[] {
  const current = getLockedSeats(flightNo);
  const updated = current.filter((s) => !seatIds.includes(s));
  saveLockedSeats(updated, flightNo);
  return updated;
}

export function unlockAllSeats(flightNo?: string): string[] {
  saveLockedSeats([], flightNo);
  return [];
}

export function resetLockedSeatsToDefault(flightNo?: string): string[] {
  const defaultList = flightNo && DEFAULT_FLIGHT_LOCKED_SEATS[flightNo]
    ? DEFAULT_FLIGHT_LOCKED_SEATS[flightNo]
    : DEFAULT_LOCKED_SEATS;
  saveLockedSeats(defaultList, flightNo);
  return defaultList;
}

export function releaseSeatBooking(
  seatId: string,
  flightNo?: string
): { updatedBookings: Booking[]; updatedLockedSeats: string[]; releasedBooking?: Booking } {
  const allBookings = getBookings();
  let releasedBooking: Booking | undefined;
  const updatedBookings: Booking[] = [];

  for (const b of allBookings) {
    if (!b.seat) {
      updatedBookings.push(b);
      continue;
    }
    const seats = b.seat.split(",").map((s) => s.trim());
    const matchesFlight =
      !flightNo ||
      b.outboundFlightNo === flightNo ||
      b.inboundFlightNo === flightNo ||
      b.legs?.some((l) => l.flightNo === flightNo) ||
      !b.outboundFlightNo;

    if (seats.includes(seatId) && matchesFlight) {
      releasedBooking = b;
      const remainingSeats = seats.filter((s) => s !== seatId);
      if (remainingSeats.length > 0) {
        updatedBookings.push({
          ...b,
          seat: remainingSeats.join(", "),
          passengers: Math.max(1, remainingSeats.length),
        });
      }
    } else {
      updatedBookings.push(b);
    }
  }

  if (typeof window !== "undefined") {
    localStorage.setItem(KEY, JSON.stringify(updatedBookings));
  }

  // Also remove from lockedSeats if present
  const currentLocked = getLockedSeats(flightNo);
  const updatedLocked = currentLocked.filter((s) => s !== seatId);
  saveLockedSeats(updatedLocked, flightNo);

  return {
    updatedBookings,
    updatedLockedSeats: updatedLocked,
    releasedBooking,
  };
}

export function forceLockBookedSeat(seatId: string, flightNo?: string): string[] {
  releaseSeatBooking(seatId, flightNo);
  const currentLocked = getLockedSeats(flightNo);
  const updatedLocked = Array.from(new Set([...currentLocked, seatId]));
  saveLockedSeats(updatedLocked, flightNo);
  return updatedLocked;
}

