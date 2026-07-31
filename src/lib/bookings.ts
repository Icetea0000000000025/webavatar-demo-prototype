export type Booking = {
  id: string;
  createdAt: string;
  tripType: "round" | "oneway";
  from: string;
  to: string;
  departDate: string;
  returnDate?: string;
  passengers: number;
  promoCode?: string;
  passengerName: string;
  email: string;
  phone: string;
  seat?: string;
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
