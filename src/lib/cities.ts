export interface CityMeta {
  code: string;
  nameEn: string;
  nameTh: string;
  fullNameTh: string;
  fullNameEn: string;
  airportEn: string;
  airportTh: string;
}

export const CITIES_CONFIG: Record<string, CityMeta> = {
  "กรุงเทพฯ (DMK)": {
    code: "DMK",
    nameEn: "Bangkok (Don Mueang)",
    nameTh: "กรุงเทพฯ (ดอนเมือง)",
    fullNameTh: "กรุงเทพมหานคร (ท่าอากาศยานดอนเมือง)",
    fullNameEn: "Bangkok (Don Mueang International Airport)",
    airportEn: "Don Mueang Intl Airport",
    airportTh: "ท่าอากาศยานดอนเมือง",
  },
  "กรุงเทพฯ (BKK)": {
    code: "BKK",
    nameEn: "Bangkok (Suvarnabhumi)",
    nameTh: "กรุงเทพฯ (สุวรรณภูมิ)",
    fullNameTh: "กรุงเทพมหานคร (ท่าอากาศยานสุวรรณภูมิ)",
    fullNameEn: "Bangkok (Suvarnabhumi Airport)",
    airportEn: "Suvarnabhumi Intl Airport",
    airportTh: "ท่าอากาศยานสุวรรณภูมิ",
  },
  "เชียงใหม่ (CNX)": {
    code: "CNX",
    nameEn: "Chiang Mai",
    nameTh: "เชียงใหม่",
    fullNameTh: "จังหวัดเชียงใหม่ (ท่าอากาศยานนานาชาติเชียงใหม่)",
    fullNameEn: "Chiang Mai (Chiang Mai International Airport)",
    airportEn: "Chiang Mai Intl Airport",
    airportTh: "ท่าอากาศยานเชียงใหม่",
  },
  "ภูเก็ต (HKT)": {
    code: "HKT",
    nameEn: "Phuket",
    nameTh: "ภูเก็ต",
    fullNameTh: "จังหวัดภูเก็ต (ท่าอากาศยานนานาชาติภูเก็ต)",
    fullNameEn: "Phuket (Phuket International Airport)",
    airportEn: "Phuket Intl Airport",
    airportTh: "ท่าอากาศยานภูเก็ต",
  },
  "หาดใหญ่ (HDY)": {
    code: "HDY",
    nameEn: "Hat Yai",
    nameTh: "หาดใหญ่",
    fullNameTh: "หาดใหญ่ จังหวัดสงขลา (ท่าอากาศยานนานาชาติหาดใหญ่)",
    fullNameEn: "Hat Yai, Songkhla (Hat Yai International Airport)",
    airportEn: "Hat Yai Intl Airport",
    airportTh: "ท่าอากาศยานหาดใหญ่",
  },
  "กระบี่ (KBV)": {
    code: "KBV",
    nameEn: "Krabi",
    nameTh: "กระบี่",
    fullNameTh: "จังหวัดกระบี่ (ท่าอากาศยานนานาชาติกระบี่)",
    fullNameEn: "Krabi (Krabi International Airport)",
    airportEn: "Krabi Intl Airport",
    airportTh: "ท่าอากาศยานนานาชาติกระบี่",
  },
  "เชียงราย (CEI)": {
    code: "CEI",
    nameEn: "Chiang Rai",
    nameTh: "เชียงราย",
    fullNameTh: "จังหวัดเชียงราย (ท่าอากาศยานแม่ฟ้าหลวง เชียงราย)",
    fullNameEn: "Chiang Rai (Mae Fah Luang Chiang Rai International Airport)",
    airportEn: "Mae Fah Luang Chiang Rai Intl",
    airportTh: "ท่าอากาศยานแม่ฟ้าหลวง เชียงราย",
  },
  "สุราษฎร์ธานี (URT)": {
    code: "URT",
    nameEn: "Surat Thani",
    nameTh: "สุราษฎร์ธานี",
    fullNameTh: "จังหวัดสุราษฎร์ธานี (ท่าอากาศยานสุราษฎร์ธานี)",
    fullNameEn: "Surat Thani (Surat Thani Airport)",
    airportEn: "Surat Thani Airport",
    airportTh: "ท่าอากาศยานสุราษฎร์ธานี",
  },
  "อุดรธานี (UTH)": {
    code: "UTH",
    nameEn: "Udon Thani",
    nameTh: "อุดรธานี",
    fullNameTh: "จังหวัดอุดรธานี (ท่าอากาศยานนานาชาติอุดรธานี)",
    fullNameEn: "Udon Thani (Udon Thani International Airport)",
    airportEn: "Udon Thani Intl Airport",
    airportTh: "ท่าอากาศยานอุดรธานี",
  },
  "อุบลราชธานี (UBP)": {
    code: "UBP",
    nameEn: "Ubon Ratchathani",
    nameTh: "อุบลราชธานี",
    fullNameTh: "จังหวัดอุบลราชธานี (ท่าอากาศยานนานาชาติอุบลราชธานี)",
    fullNameEn: "Ubon Ratchathani (Ubon Ratchathani Airport)",
    airportEn: "Ubon Ratchathani Airport",
    airportTh: "ท่าอากาศยานอุบลราชธานี",
  },
  "ขอนแก่น (KKC)": {
    code: "KKC",
    nameEn: "Khon Kaen",
    nameTh: "ขอนแก่น",
    fullNameTh: "จังหวัดขอนแก่น (ท่าอากาศยานขอนแก่น)",
    fullNameEn: "Khon Kaen (Khon Kaen Airport)",
    airportEn: "Khon Kaen Airport",
    airportTh: "ท่าอากาศยานขอนแก่น",
  },
  "นครศรีธรรมราช (NST)": {
    code: "NST",
    nameEn: "Nakhon Si Thammarat",
    nameTh: "นครศรีธรรมราช",
    fullNameTh: "จังหวัดนครศรีธรรมราช (ท่าอากาศยานนครศรีธรรมราช)",
    fullNameEn: "Nakhon Si Thammarat (Nakhon Si Thammarat Airport)",
    airportEn: "Nakhon Si Thammarat Airport",
    airportTh: "ท่าอากาศยานนครศรีธรรมราช",
  },
};

export const CITIES = Object.keys(CITIES_CONFIG);

export function getCityDetails(cityStr: string, language: string = "en") {
  const meta = CITIES_CONFIG[cityStr];
  if (meta) {
    return {
      code: meta.code,
      cityName: language === "th" ? meta.nameTh : meta.nameEn,
      fullName: language === "th" ? meta.fullNameTh : meta.fullNameEn,
      airportName: language === "th" ? meta.airportTh : meta.airportEn,
    };
  }
  const match = cityStr ? cityStr.match(/(.+?)\s*\(([A-Z]{3})\)/) : null;
  const code = match ? match[2] : "DMK";
  const rawName = match ? match[1].trim() : (cityStr || "กรุงเทพฯ (DMK)");
  return {
    code,
    cityName: rawName,
    fullName: rawName,
    airportName: `${rawName} Airport`,
  };
}

export function getCityFullName(cityStr: string, language: string = "en") {
  if (!cityStr) return "";
  const meta = CITIES_CONFIG[cityStr];
  if (meta) {
    return language === "th" ? meta.fullNameTh : meta.fullNameEn;
  }
  for (const [, val] of Object.entries(CITIES_CONFIG)) {
    if (cityStr.includes(val.code) || cityStr.includes(val.nameTh) || cityStr.includes(val.nameEn)) {
      return language === "th" ? val.fullNameTh : val.fullNameEn;
    }
  }
  const details = getCityDetails(cityStr, language);
  return details.fullName || details.cityName || cityStr;
}

export const getPromoDiscountRate = (code?: string): number => {
  const upper = (code || "").trim().toUpperCase();
  if (["SKYPROMO2026", "SKYPROMO", "SKY15", "BOTNOI15"].includes(upper)) return 0.15;
  if (["PROMO2026", "PROMO", "BOTNOI20"].includes(upper)) return 0.20;
  return 0;
};