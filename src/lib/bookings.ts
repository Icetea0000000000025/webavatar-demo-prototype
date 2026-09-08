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
  },
  {
    id: "THA-01",
    flightNo: "THA312",
    airlineCode: "THA",
    airlineName: "Thai Airways",
    model: "Boeing 777-300ER",
    tailNumber: "HS-TGA",
    type: "Wide-body Jet",
    route: "DMK → CNX",
    depTime: "09:45",
    arrTime: "11:00",
    capacity: 60,
    businessSeats: 12,
    economySeats: 48,
  },
  {
    id: "BTN-02",
    flightNo: "BTN205",
    airlineCode: "BTN",
    airlineName: "Botnoi Air",
    model: "Airbus A321neo",
    tailNumber: "HS-BNB",
    type: "Narrow-body Jet",
    route: "DMK → CNX",
    depTime: "13:30",
    arrTime: "14:45",
    capacity: 60,
    businessSeats: 12,
    economySeats: 48,
  },
  {
    id: "BKP-01",
    flightNo: "BKP485",
    airlineCode: "BKP",
    airlineName: "Bangkok Airways",
    model: "Airbus A320",
    tailNumber: "HS-PGA",
    type: "Narrow-body Jet",
    route: "DMK → CNX",
    depTime: "15:15",
    arrTime: "16:30",
    capacity: 60,
    businessSeats: 12,
    economySeats: 48,
  },
  {
    id: "THA-02",
    flightNo: "THA325",
    airlineCode: "THA",
    airlineName: "Thai Airways",
    model: "Boeing 787-9 Dreamliner",
    tailNumber: "HS-TGB",
    type: "Wide-body Jet",
    route: "DMK → CNX",
    depTime: "18:45",
    arrTime: "20:00",
    capacity: 60,
    businessSeats: 12,
    economySeats: 48,
  },
  {
    id: "BKP-02",
    flightNo: "BKP499",
    airlineCode: "BKP",
    airlineName: "Bangkok Airways",
    model: "ATR 72-600",
    tailNumber: "HS-PGB",
    type: "Regional Turboprop",
    route: "DMK → CNX",
    depTime: "21:00",
    arrTime: "22:15",
    capacity: 60,
    businessSeats: 12,
    economySeats: 48,
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
  BKP485: ["1A", "1B", "3C", "5A", "8D", "9F"],
  THA325: ["1C", "2F", "4A", "5B", "7D", "8E", "10C"],
  BKP499: ["1D", "2C", "3E", "6A", "7B", "9A"],
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
