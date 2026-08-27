import rawKnowledgeBase from '../../techsauce_2026_knowledge_base.json';

export interface Speaker {
  name: string;
  role: string;
  company: string;
}

export interface Workshop {
  date: string;
  time: string;
  title: string;
  speakers: Speaker[];
  room: string;
  access: string;
}

export interface Exhibitor {
  company: string;
  booth: string | null;
}

export interface TechsauceAwards {
  title: string;
  theme: string;
  nomination_period: string;
  announcement_date: string;
  venue: string;
  categories: Record<string, string[]>;
}

export interface RawSourceItem {
  source_image: string;
  extraction_method: string;
  verification_status: 'needs_review' | 'verified' | string;
  text: string;
}

export interface TechsauceKnowledgeBase {
  schema_version: string;
  event: {
    name: string;
    dates: string[];
  };
  usage_note: string;
  workshops: Workshop[];
  techsauce_awards: TechsauceAwards;
  exhibitors: Exhibitor[];
  raw_source_text: RawSourceItem[];
}

// 215 Curated Exhibitors synced from sheet/Techsauce_2026_Vibe_Knowledge_Sheet.xlsx - Exhibitors.csv
export const EXHIBITORS_FROM_SHEET: Exhibitor[] = [
  { company: "SORASO Hospitality Native", booth: "A34" },
  { company: "SOTI", booth: "B3-04" },
  { company: "SourceCode Co., Ltd.", booth: "15" },
  { company: "Sunsara AI", booth: "A69" },
  { company: "SUPER", booth: "C6" },
  { company: "Superteam Thailand", booth: "A3" },
  { company: "Synology", booth: "26" },
  { company: "SYSTRONICS CO.,LTD.", booth: "13" },
  { company: "Taiwan Startup Terrace", booth: "C2-12" },
  { company: "TechGALA / Central Japan", booth: "A71" },
  { company: "TED FUND", booth: "3" },
  { company: "Teknologi ASV Sdn Bhd", booth: "C3-04" },
  { company: "Thailand Convention and...", booth: "C5" },
  { company: "Thailand Post", booth: "Not shown" },
  { company: "ThaiLLM", booth: "A77" },
  { company: "Thimphu TechPark Limited", booth: "Not shown" },
  { company: "TIGERSOFT", booth: "A75" },
  { company: "TMES Company Limited", booth: "6" },
  { company: "Tomazz", booth: "A6" },
  { company: "Tonagena", booth: "B8-03" },
  { company: "Treasure AI", booth: "33" },
  { company: "TREEGAL", booth: "A61" },
  { company: "TRUE DIGITAL PARK", booth: "7" },
  { company: "TRUSTBOX FULFILLMENT", booth: "A24" },
  { company: "TurfSat", booth: "B8-02" },
  { company: "upGrad", booth: "A2" },
  { company: "Vaxion Korea Inc.", booth: "A23" },
  { company: "VectorFlux One by GitHouse", booth: "C2-10" },
  { company: "Vela Software", booth: "B3-05" },
  { company: "VOICERACX", booth: "12" },
  { company: "Whale AI", booth: "A69" },
  { company: "Wineworld", booth: "B9-04" },
  { company: "WIZ AI (THAILAND)_...", booth: "11" },
  { company: "X-DIGITAL @THAILAND", booth: "C3" },
  { company: "Xelware Pte Ltd", booth: "A60" },
  { company: "YDM", booth: "A53" },
  { company: "YenProtek AIOT", booth: "C2-11" },
  { company: "Yindii", booth: "B9-05" },
  { company: "Zanroo Thailand", booth: "A27" },
  { company: "Zipevent", booth: "38" },
  { company: "ZPS CORPORATION CO.,...", booth: "D3-04" },
  { company: "100X CO., LTD.", booth: "28" },
  { company: "2CS MANAGEMENT CO.,...", booth: "D3-09" },
  { company: "ActiveMedia Thailand", booth: "C1" },
  { company: "Advanced Genetics &...", booth: "B8-06" },
  { company: "Advanced iService", booth: "A42" },
  { company: "Advmeds Co., Ltd.", booth: "C2-01" },
  { company: "AgentID", booth: "B8-06" },
  { company: "AI & Intelligent Banking", booth: "31" },
  { company: "AI Rudder", booth: "A44" },
  { company: "AiStyle", booth: "C2-02" },
  { company: "AIVEN", booth: "A70" },
  { company: "AIYA", booth: "A17" },
  { company: "Alpha Reality", booth: "B9-03" },
  { company: "Altotech", booth: "A29" },
  { company: "Amity", booth: "C4" },
  { company: "ANOSUPO AI", booth: "A20" },
  { company: "Apollo Power", booth: "C2-03" },
  { company: "Apposter Inc.", booth: "C8-03" },
  { company: "Avision", booth: "A37" },
  { company: "B CUBE SOLUTION CO., LTD.", booth: "D3-03" },
  { company: "BAMBOO MEDICAL...", booth: "D3-07" },
  { company: "BBOX Limited", booth: "C2-04" },
  { company: "BDI", booth: "Not shown" },
  { company: "BILLION PRIMA Sdn Bhd", booth: "C3-06" },
  { company: "BIPO", booth: "16" },
  { company: "BNV Solutions Co., Ltd", booth: "C8-06" },
  { company: "Bold Group Thailand", booth: "A79" },
  { company: "Boomi", booth: "B12" },
  { company: "BOTNOI GROUP", booth: "A63" },
  { company: "Braze", booth: "25" },
  { company: "BUZZEBEES", booth: "6" },
  { company: "Canadian Embassy", booth: "B3" },
  { company: "CANS CX CLOUD (Cloud...", booth: "A16" },
  { company: "CarbonClean Energy", booth: "C2-05" },
  { company: "CARBONMICE", booth: "C5-06" },
  { company: "Chess Money", booth: "A57" },
  { company: "ChillPay", booth: "A22" },
  { company: "Chon Works", booth: "A50" },
  { company: "Classiq Technologies", booth: "B7" },
  { company: "Cloud-TA", booth: "A35" },
  { company: "Cloud9Care4Kids", booth: "Not shown" },
  { company: "Coastal Link", booth: "A19" },
  { company: "Convert Cake", booth: "A25" },
  { company: "Couchbase", booth: "24" },
  { company: "CRADLE", booth: "C3-07" },
  { company: "CU Innovation Hub", booth: "Not shown" },
  { company: "Czech Republic", booth: "B8" },
  { company: "DataArc", booth: "A81" },
  { company: "Dawn", booth: "39" },
  { company: "DeeMoney", booth: "B2" },
  { company: "DEMETER ICT", booth: "9" },
  { company: "Dentsu FUTURE MANDALA", booth: "30" },
  { company: "Digital Economy Promotio...", booth: "D3" },
  { company: "DMolution Co., Ltd.", booth: "A7" },
  { company: "Doppio Tech", booth: "A45" },
  { company: "Dunita International Sdn...", booth: "C3-05" },
  { company: "Earthology Studio", booth: "30" },
  { company: "ECOTEN urban comfort", booth: "B8-01" },
  { company: "ENVIOSODY TECH CO., LTD.", booth: "D3-10" },
  { company: "ekoXense Enterprise Ltd.", booth: "C2-06" },
  { company: "EventTech.ai", booth: "C5-02" },
  { company: "EXPOPASS", booth: "C5-09" },
  { company: "FACTORIUM", booth: "A30" },
  { company: "Farben Information", booth: "A56" },
  { company: "FastShip", booth: "A18" },
  { company: "FASTWORK", booth: "A84" },
  { company: "Finnomena", booth: "B13" },
  { company: "FITSLOTH CO., LTD.", booth: "D3-06" },
  { company: "FOO-D CO., LTD.", booth: "D3-11" },
  { company: "Forward Insight", booth: "A11" },
  { company: "FOSTERBRIDGE", booth: "B5" },
  { company: "FUJIFILM Business...", booth: "8" },
  { company: "Galenio", booth: "B8-04" },
  { company: "General Magick", booth: "A68" },
  { company: "Godspeed IT Service Ltd.", booth: "C2-07" },
  { company: "Gowajee Co., Ltd", booth: "A5" },
  { company: "H LAB", booth: "A32" },
  { company: "HAPPY THREE CREATION_...", booth: "A48" },
  { company: "Healcerion Co., Ltd.", booth: "C8-06" },
  { company: "Hong Kong Cyberport", booth: "B9" },
  { company: "Hong Kong Trade_...", booth: "2" },
  { company: "HONG KONG TRADE_...", booth: "2" },
  { company: "HR Monster", booth: "A39" },
  { company: "HUAKUN AI COMPUTING...", booth: "A82" },
  { company: "HUMANICA", booth: "17" },
  { company: "Humansoft", booth: "A31" },
  { company: "HUMMIX", booth: "23" },
  { company: "Hyred Recruitment", booth: "A40" },
  { company: "ICONEXT Co., Ltd.", booth: "A38" },
  { company: "IDEVA CORPORATION CO.,...", booth: "A10" },
  { company: "IDYLLIAS CORPORATION_...", booth: "A9" },
  { company: "iFLYTEK Co., Ltd.", booth: "D1" },
  { company: "IN2IT Company Limited", booth: "A54" },
  { company: "Inflight co., ltd.", booth: "C5-04" },
  { company: "International Network...", booth: "A36" },
  { company: "Ipintra Networks Sdn Bhd", booth: "C3-05" },
  { company: "Japan Zone", booth: "Not shown" },
  { company: "Jetder", booth: "A58" },
  { company: "Jetro (Japan Zone)", booth: "Not shown" },
  { company: "JUBILANT TECH", booth: "A4" },
  { company: "KA Imaging - Represented...", booth: "B8-01" },
  { company: "Kalguroo", booth: "A8" },
  { company: "KO-EXPERIENCE", booth: "A72" },
  { company: "Kollective", booth: "C5-08" },
  { company: "Lango", booth: "B9-01" },
  { company: "Liberator Securities Co., Ltd.", booth: "B6" },
  { company: "Lightwork AI", booth: "A41" },
  { company: "Limitless Club", booth: "A73" },
  { company: "Lisa AI | by Brandface", booth: "A83" },
  { company: "LOBBYIST", booth: "A74" },
  { company: "LOOLOO TECHNOLOGY CO....", booth: "D3-01" },
  { company: "Loxley Orbit PCL.", booth: "4" },
  { company: "Magic Box Solutions", booth: "A52" },
  { company: "MALAYSIA", booth: "C3" },
  { company: "Manao Software Co., Ltd", booth: "A78" },
  { company: "MarkAny Inc", booth: "C8-01" },
  { company: "MarketingGuru", booth: "A26" },
  { company: "MATCHDAY HUB CO., LTD.", booth: "D3-12" },
  { company: "MEDIS HEALTH ACT CO.,...", booth: "D3-02" },
  { company: "Mek", booth: "C5-07" },
  { company: "Melaka Corp", booth: "C8-08" },
  { company: "Metro Systems Corporation", booth: "B4" },
  { company: "MIND INTERVIEW", booth: "C2-08" },
  { company: "Monti AI Voice Agent", booth: "A46" },
  { company: "My Mooban Co.,Ltd", booth: "C5-10" },
  { company: "NamoWebiz, Inc", booth: "C8-07" },
  { company: "National Telecom Public...", booth: "B1" },
  { company: "NECTEC", booth: "20" },
  { company: "Neversitup Co.,Ltd", booth: "A14" },
  { company: "Newbase Inc.", booth: "C8-02" },
  { company: "NEXTINFRA", booth: "A21" },
  { company: "NextT Asia Accelerator", booth: "1" },
  { company: "NIA", booth: "35" },
  { company: "Norrin Asia Ltd.", booth: "A62" },
  { company: "NPR Digital Partner", booth: "A13" },
  { company: "OLDK Health Delivery", booth: "A16" },
  { company: "Omega Grit x Twilio", booth: "22" },
  { company: "OpenIQ", booth: "Not shown" },
  { company: "OpenText", booth: "B5-02" },
  { company: "Optiqb AI Technology Ltd.", booth: "C2-09" },
  { company: "Osome", booth: "18" },
  { company: "PACKWORKS CO., LTD.", booth: "D3-05" },
  { company: "PEOPLESIDER", booth: "A80" },
  { company: "PERCEPTRА", booth: "A47" },
  { company: "Placid (Thailand) Ltd.", booth: "A56" },
  { company: "PlayCurio Co., Ltd", booth: "C8-04" },
  { company: "Playtorium Solutions Publi...", booth: "10" },
  { company: "PLOOK", booth: "A65" },
  { company: "Pontosense – Represented...", booth: "B8-03" },
  { company: "Portonics Ltd", booth: "A51" },
  { company: "PRIMO", booth: "C5-01" },
  { company: "Prior Solution Co., Ltd.", booth: "A67" },
  { company: "Prosci", booth: "34" },
  { company: "Quick Transformation", booth: "32" },
  { company: "READY IDC", booth: "29" },
  { company: "RealSmart", booth: "37" },
  { company: "Rich Trees Consultancy Sd...", booth: "C3-02" },
  { company: "rudi (Datability)", booth: "C5-05" },
  { company: "SABLE: WIN WITH AI", booth: "C5-03" },
  { company: "Safira AI", booth: "A66" },
  { company: "SALES TOOLS", booth: "A33" },
  { company: "Sasin School of...", booth: "A1" },
  { company: "SCBX", booth: "D4" },
  { company: "Setsail", booth: "B9-02" },
  { company: "SEVEN PEAKS", booth: "36" },
  { company: "SFETNIC.AI", booth: "A64" },
  { company: "SHIPNITY", booth: "A12" },
  { company: "SIRISOFT", booth: "19" },
  { company: "Six Network", booth: "14" },
  { company: "SM Tech Global", booth: "21" },
  { company: "SMART FINDER CO., LTD.", booth: "D3-08" },
  { company: "SmartOptz Technology Sdn...", booth: "C3-01" },
  { company: "SMRJ (Japan Zone)", booth: "Not shown" },
  { company: "So Idea", booth: "Not shown" }
];

// Curated scope and criteria descriptions for all 18 Techsauce Awards
export const AWARD_DESCRIPTIONS: Record<string, { en: string; th: string }> = {
  "The Saucest Brand for Talent": {
    en: "Recognizes the leading employer brand that champions top tech and business talent acquisition, culture, and employee advocacy.",
    th: "ยกย่ององค์กรที่มีการสร้างแบรนด์นายจ้างยอดเยี่ยม ดึงดูดและพัฒนาบุคลากรชั้นนำในสายเทคโนโลยีและธุรกิจอย่างโดดเด่น",
  },
  "The Saucest Workplace & Culture": {
    en: "Honors organizations fostering progressive workplace culture, diversity, mental well-being, and modern collaboration.",
    th: "มอบให้กับองค์กรที่มีวัฒนธรรมการทำงานและสภาพแวดล้อมยอดเยี่ยม ส่งเสริมความหลากหลาย สุขภาวะที่ดี และการทำงานร่วมกัน",
  },
  "The Saucest Chief People Officer of the Year": {
    en: "Celebrates exceptional People and HR leaders pioneering transformative workforce strategies and organizational agility.",
    th: "ยกย่องผู้นำด้านทรัพยากรบุคคล (CPO/HR Leader) ยอดเยี่ยมแห่งปี ผู้ขับเคลื่อนกลยุทธ์การพัฒนาคนและปฏิรูปองค์กรสู่ความสำเร็จ",
  },
  "The Saucest Tech Solution": {
    en: "Recognizes breakthrough technical products or platforms delivering high impact, scalability, and measurable value.",
    th: "มอบให้กับโซลูชันหรือแพลตฟอร์มเทคโนโลยีที่โดดเด่น แก้ปัญหาสำคัญและสร้างคุณค่าที่วัดผลได้อย่างเป็นรูปธรรม",
  },
  "The Saucest Process Transformation": {
    en: "Honors enterprises that successfully transformed legacy processes into automated, agile digital operations.",
    th: "ยกย่ององค์กรที่ปฏิรูปกระบวนการทำงานสู่ระบบดิจิทัลและอัตโนมัติได้อย่างมีประสิทธิภาพ รวดเร็ว และแม่นยำ",
  },
  "The Saucest Tech Collab": {
    en: "Celebrates impactful cross-sector tech partnerships that co-create innovative products and foster ecosystem synergy.",
    th: "มอบให้กับความร่วมมือทางเทคโนโลยีระหว่างองค์กรหรือพันธมิตรที่ร่วมสร้างสรรค์นวัตกรรมใหม่และขับเคลื่อนระบบนิเวศ",
  },
  "The Saucest Tech Scaleup": {
    en: "Recognizes fast-growing scaleups showing exponential market adoption, revenue acceleration, and regional expansion.",
    th: "ยกย่องสตาร์ทอัพ/สเกลอัปที่มีการเติบโตแบบก้าวกระโดด ขยายฐานลูกค้าและรายได้ทั้งในระดับประเทศและภูมิภาค",
  },
  "The Saucest Infrastructure Enabler": {
    en: "Honors foundational infrastructure, cloud, telecom, and cybersecurity providers enabling digital transformation.",
    th: "มอบให้กับผู้ให้บริการโครงสร้างพื้นฐานดิจิทัล คลาวด์ และความมั่นคงปลอดภัยไซเบอร์ที่เป็นรากฐานสำคัญของการเปลี่ยนผ่าน",
  },
  "The Saucest Tech Visionary of the Year": {
    en: "Celebrates forward-thinking pioneers shaping the future landscape of technology and business in Southeast Asia.",
    th: "ยกย่องผู้นำวิสัยทัศน์กว้างไกลผู้มีบทบาทสำคัญในการกำหนดทิศทางเทคโนโลยีและธุรกิจแห่งอนาคตในภูมิภาค",
  },
  "The Saucest Woman in Tech": {
    en: "Honors inspiring female leaders, founders, and technologists breaking boundaries and elevating diversity in tech.",
    th: "ยกย่องผู้นำหญิงในวงการเทคโนโลยี ผู้สร้างแรงบันดาลใจ ทลายข้อจำกัด และส่งเสริมความหลากหลายในแวดวงนวัตกรรม",
  },
  "The Saucest Chief Technology Officer": {
    en: "Celebrates outstanding CTOs demonstrating architectural vision, engineering excellence, and tech leadership.",
    th: "มอบให้กับประธานเจ้าหน้าที่ฝ่ายเทคโนโลยี (CTO) แห่งปี ผู้เป็นเลิศด้านวิสัยทัศน์ทางสถาปัตยกรรมและการนำทีมวิศวกรรม",
  },
  "The Saucest AI-Driven Company": {
    en: "Honors companies integrating AI deeply into core business workflows, decision-making, and customer touchpoints.",
    th: "ยกย่ององค์กรที่ขับเคลื่อนธุรกิจด้วย AI ในระดับแกนหลัก เพิ่มขีดความสามารถการแข่งขันและสร้างประสบการณ์ใหม่อย่างแท้จริง",
  },
  "The Saucest AI Governance Leadership Award by ETDA": {
    en: "Presented in partnership with ETDA to recognize organizations championing ethical, transparent, and secure AI governance.",
    th: "รางวัลความร่วมมือกับ ETDA มอบให้กับองค์กรที่เป็นแบบอย่างในการกำกับดูแลการใช้งาน AI อย่างมีธรรมาภิบาล จริยธรรม และปลอดภัย",
  },
  "The Saucest Brand for a Better Planet": {
    en: "Celebrates sustainable and green tech initiatives driving meaningful climate action, circularity, and ESG impact.",
    th: "ยกย่ององค์กรหรือแบรนด์ที่ใช้เทคโนโลยีขับเคลื่อนความยั่งยืน สิ่งแวดล้อม (ESG) และสร้างการเปลี่ยนแปลงเชิงบวกให้กับโลก",
  },
  "The Saucest Venture": {
    en: "Honors high-impact venture capital firms and funds actively fueling innovation, capital, and regional venture success.",
    th: "มอบให้กับกองทุนหรือ Venture Capital ที่มีบทบาทโดดเด่นในการสนับสนุนเงินทุนและบ่มเพาะการเติบโตของสตาร์ทอัพ",
  },
  "The Saucest Rising Star Entrepreneur": {
    en: "Recognizes emerging early-stage founders demonstrating exceptional agility, grit, and disruptive potential.",
    th: "ยกย่องผู้ประกอบการดาวรุ่งรุ่นใหม่ที่มีความมุ่งมั่น คล่องตัว และมีศักยภาพในการสร้างสรรค์โมเดลธุรกิจที่พลิกโฉมอุตสาหกรรม",
  },
  "The Saucest Founder of the Year": {
    en: "Celebrates an extraordinary founder who demonstrated stellar leadership, resilience, and groundbreaking milestones.",
    th: "ยกย่องสุดยอดผู้ก่อตั้ง (Founder) แห่งปี ผู้นำพาองค์กรสร้างหมุดหมายความสำเร็จอันยิ่งใหญ่และเป็นแบบอย่างให้ผู้ประกอบการ",
  },
  "The Saucest Ecosystem Catalyst": {
    en: "Honors accelerators, hubs, incubators, and enablers dedicated to uplifting community builders and startups.",
    th: "มอบให้กับหน่วยงาน ตัวเร่งการเติบโต หรือ Hub ผู้มีบทบาทสำคัญในการผลักดันและเสริมสร้างความแข็งแกร่งให้คอมมูนิตี้สตาร์ทอัพ",
  },
};

export const techsauceData: TechsauceKnowledgeBase = {
  ...(rawKnowledgeBase as TechsauceKnowledgeBase),
  exhibitors: EXHIBITORS_FROM_SHEET,
};

/**
 * Intelligent Knowledge Base query engine
 * Prioritizes curated structured collections (workshops, exhibitors, awards)
 * over raw OCR source text.
 */
export function queryKnowledgeBase(query: string) {
  if (!query || !query.trim()) {
    return {
      workshops: [],
      exhibitors: [],
      awards: [],
      rawOcrMatches: [],
    };
  }

  const q = query.toLowerCase().trim();

  // 1. Search Workshops
  const matchedWorkshops = techsauceData.workshops.filter((w) => {
    return (
      w.title.toLowerCase().includes(q) ||
      w.room.toLowerCase().includes(q) ||
      w.access.toLowerCase().includes(q) ||
      w.date.toLowerCase().includes(q) ||
      w.speakers.some(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.company.toLowerCase().includes(q) ||
          s.role.toLowerCase().includes(q)
      )
    );
  });

  // 2. Search Exhibitors
  const matchedExhibitors = techsauceData.exhibitors.filter((e) => {
    return (
      e.company.toLowerCase().includes(q) ||
      (e.booth && e.booth.toLowerCase().includes(q))
    );
  });

  // 3. Search Awards
  const matchedAwards: { category: string; award: string }[] = [];
  Object.entries(techsauceData.techsauce_awards.categories).forEach(([category, awardsList]) => {
    awardsList.forEach((award) => {
      if (
        award.toLowerCase().includes(q) ||
        category.toLowerCase().includes(q)
      ) {
        matchedAwards.push({ category, award });
      }
    });
  });

  // 4. Search Raw OCR (lower priority, marked needs_review)
  const matchedOcr = techsauceData.raw_source_text.filter((ocr) =>
    ocr.text.toLowerCase().includes(q)
  );

  return {
    workshops: matchedWorkshops,
    exhibitors: matchedExhibitors,
    awards: matchedAwards,
    rawOcrMatches: matchedOcr,
  };
}

export type SupportedLanguage = 'en' | 'th' | 'zh' | 'ja' | 'ko' | 'es' | 'fr';

export interface LocalizedAIContent {
  headline: string;
  answer: string;
  categoryTag: string;
  keyBadges: { label: string; value: string; color: string }[];
  suggestedQuestions: string[];
}

export interface EventAIAnswer {
  headlineTh: string;
  headlineEn: string;
  answerTh: string;
  answerEn: string;
  categoryTag: string;
  sourceConfidence: '100% Verified Structured Data' | 'Curated Knowledge Base';
  matchedWorkshops: Workshop[];
  matchedExhibitors: Exhibitor[];
  matchedAwards: { category: string; award: string }[];
  keyBadges: { label: string; value: string; color: string }[];
  suggestedQuestions: string[];
  localized: Record<SupportedLanguage, LocalizedAIContent>;
}

function createAnswer(
  localized: Record<SupportedLanguage, LocalizedAIContent>,
  meta: {
    sourceConfidence: '100% Verified Structured Data' | 'Curated Knowledge Base';
    matchedWorkshops?: Workshop[];
    matchedExhibitors?: Exhibitor[];
    matchedAwards?: { category: string; award: string }[];
  },
  lang: string = 'en'
): EventAIAnswer {
  const currentLang = (['en', 'th', 'zh', 'ja', 'ko', 'es', 'fr'].includes(lang) ? lang : 'en') as SupportedLanguage;
  const currentContent = localized[currentLang] || localized.en;

  return {
    headlineTh: localized.th.headline,
    headlineEn: localized.en.headline,
    answerTh: localized.th.answer,
    answerEn: localized.en.answer,
    categoryTag: currentContent.categoryTag,
    sourceConfidence: meta.sourceConfidence,
    matchedWorkshops: meta.matchedWorkshops || [],
    matchedExhibitors: meta.matchedExhibitors || [],
    matchedAwards: meta.matchedAwards || [],
    keyBadges: currentContent.keyBadges,
    suggestedQuestions: currentContent.suggestedQuestions,
    localized,
  };
}

/**
 * Intelligent Event Q&A Synthesis Engine
 * Built specifically for live event showcase booth demos to answer attendee questions.
 */
export function answerEventQuestion(question: string, lang: string = 'en'): EventAIAnswer {
  const q = question.toLowerCase().trim();
  const search = queryKnowledgeBase(q);

  // 1. BOTNOI / Botnoi booth question
  if (
    q.includes('botnoi') ||
    q.includes('บอทน้อย') ||
    q.includes('a63') ||
    q.includes('booth') ||
    q.includes('บูธ') ||
    q.includes('展位') ||
    q.includes('ブース') ||
    q.includes('부스') ||
    q.includes('stand')
  ) {
    const botnoi = techsauceData.exhibitors.find(e => e.company.toLowerCase().includes('botnoi'));
    return createAnswer(
      {
        en: {
          headline: "Where is the BOTNOI GROUP booth located?",
          answer: "BOTNOI GROUP is located at Booth A63 (Zone A), showcasing leading Voice AI, Digital Avatar, and enterprise conversational AI solutions with interactive live demos.",
          categoryTag: "Exhibitor & Booth Navigation",
          keyBadges: [
            { label: "Booth Number", value: "Booth A63", color: "indigo" },
            { label: "Zone", value: "Zone A (AI & Tech)", color: "cyan" },
            { label: "Status", value: "Featured AI Showcase", color: "emerald" },
          ],
          suggestedQuestions: [
            "What AI workshops are available?",
            "When and where is the event?",
            "What are the AI Transformation awards?"
          ]
        },
        th: {
          headline: "บูธ BOTNOI GROUP อยู่ที่ไหน?",
          answer: "บูธของ BOTNOI GROUP ตั้งอยู่ที่ Booth A63 (Zone A) เป็นพื้นที่จัดแสดงเทคโนโลยี Voice AI, Digital Avatar และ Conversational AI Solutions สำหรับองค์กร พร้อมการสาธิตระบบ Interactive AI ผู้ช่วยเสมือนจริงแบบเรียลไทม์ครับ",
          categoryTag: "การนำทางบูธและผู้จัดแสดง",
          keyBadges: [
            { label: "หมายเลขบูธ", value: "บูธ A63", color: "indigo" },
            { label: "โซน", value: "โซน A (AI & Tech)", color: "cyan" },
            { label: "สถานะ", value: "AI เด่นประจำงาน", color: "emerald" },
          ],
          suggestedQuestions: [
            "มีเวิร์กช็อปอะไรที่เกี่ยวกับ AI บ้าง?",
            "งานจัดวันที่เท่าไหร่และที่ไหน?",
            "รางวัล AI Transformation มีอะไรบ้าง?"
          ]
        },
        zh: {
          headline: "BOTNOI GROUP 展位在哪里？",
          answer: "BOTNOI GROUP 展位位于 A63 展位（A 区），重点展示领先的语音 AI (Voice AI)、数字人 (Digital Avatar) 及企业级对话式 AI 解决方案，现场提供实时互动体验演示。",
          categoryTag: "参展商与展位导航",
          keyBadges: [
            { label: "展位编号", value: "展位 A63", color: "indigo" },
            { label: "所属区域", value: "A 区 (AI 与科技)", color: "cyan" },
            { label: "展示状态", value: "特色 AI 展区", color: "emerald" },
          ],
          suggestedQuestions: [
            "有哪些相关的 AI 研讨会？",
            "活动时间和地点是什么？",
            "AI Transformation 奖项有哪些？"
          ]
        },
        ja: {
          headline: "BOTNOI GROUP のブースはどこにありますか？",
          answer: "BOTNOI GROUP のブースはブース A63（ゾーン A）に位置しており、最先端の音声 AI、デジタルアバター、エンタープライズ向け対話型 AI ソリューションをリアルタイムの体験デモとともに出展しています。",
          categoryTag: "出展者＆ブース案内",
          keyBadges: [
            { label: "ブース番号", value: "ブース A63", color: "indigo" },
            { label: "ゾーン", value: "ゾーン A (AI & Tech)", color: "cyan" },
            { label: "ステータス", value: "注目 AI 出展", color: "emerald" },
          ],
          suggestedQuestions: [
            "関連する AI ワークショップは？",
            "開催日時と会場はどこですか？",
            "AI Transformation アワードには何がありますか？"
          ]
        },
        ko: {
          headline: "BOTNOI GROUP 부스는 어디에 있나요?",
          answer: "BOTNOI GROUP 부스는 부스 A63(구역 A)에 위치하고 있으며, 실시간 인터랙티브 라이브 데모와 함께 최첨단 음성 AI, 디지털 아바타 및 엔터프라이즈 대화형 AI 솔루션을 선보이고 있습니다.",
          categoryTag: "전시사 및 부스 안내",
          keyBadges: [
            { label: "부스 번호", value: "부스 A63", color: "indigo" },
            { label: "구역", value: "구역 A (AI & Tech)", color: "cyan" },
            { label: "상태", value: "주목할 AI 전시", color: "emerald" },
          ],
          suggestedQuestions: [
            "어떤 AI 워크숍이 있나요?",
            "행사 일시와 장소는 어디인가요?",
            "AI Transformation 어워드에는 무엇이 있나요?"
          ]
        },
        es: {
          headline: "¿Dónde está ubicado el stand de BOTNOI GROUP?",
          answer: "BOTNOI GROUP está ubicado en el Stand A63 (Zona A), presentando soluciones líderes de Voice AI, Avatares Digitales e IA conversacional para empresas con demostraciones interactivas en vivo.",
          categoryTag: "Navegación de Expositores y Stands",
          keyBadges: [
            { label: "Número de Stand", value: "Stand A63", color: "indigo" },
            { label: "Zona", value: "Zona A (IA y Tecnología)", color: "cyan" },
            { label: "Estado", value: "Muestra Destacada de IA", color: "emerald" },
          ],
          suggestedQuestions: [
            "¿Qué talleres de IA están disponibles?",
            "¿Cuándo y dónde es el evento?",
            "¿Cuáles son los premios de AI Transformation?"
          ]
        },
        fr: {
          headline: "Où se trouve le stand de BOTNOI GROUP ?",
          answer: "BOTNOI GROUP est situé au Stand A63 (Zone A), présentant des solutions innovantes d'IA Vocale, d'Avatar Numérique et d'IA conversationnelle pour entreprises avec des démonstrations interactives en direct.",
          categoryTag: "Navigation Exposants et Stands",
          keyBadges: [
            { label: "Numéro de Stand", value: "Stand A63", color: "indigo" },
            { label: "Zone", value: "Zone A (IA et Tech)", color: "cyan" },
            { label: "Statut", value: "Vitrine IA en Vedette", color: "emerald" },
          ],
          suggestedQuestions: [
            "Quels ateliers d'IA sont disponibles ?",
            "Quand et où a lieu l'événement ?",
            "Quels sont les prix AI Transformation ?"
          ]
        }
      },
      {
        sourceConfidence: "100% Verified Structured Data",
        matchedExhibitors: botnoi ? [botnoi] : []
      },
      lang
    );
  }

  // 2. OpenAI / Tyler Ryu / ChatGPT questions
  if (q.includes('openai') || q.includes('tyler') || q.includes('chatgpt') || q.includes('agent in action') || q.includes('reporters')) {
    const openAiWorkshops = techsauceData.workshops.filter(w =>
      w.title.toLowerCase().includes('chatgpt') || w.speakers.some(s => s.company.toLowerCase().includes('openai'))
    );
    return createAnswer(
      {
        en: {
          headline: "OpenAI Workshops & Tyler Ryu Sessions",
          answer: "OpenAI is presenting 2 exclusive hands-on sessions led by Tyler Ryu (Applied AI Engineer @ OpenAI) on August 26, 2026 in Workshop Room B:\n1) ChatGPT Work: AI Agents in Action (10:00 - 12:00 | Access: Reserve)\n2) ChatGPT Work for Reporters (13:00 - 14:30 | Access: Invitation only)",
          categoryTag: "Workshops & Speakers",
          keyBadges: [
            { label: "Speaker", value: "Tyler Ryu (OpenAI)", color: "emerald" },
            { label: "Date", value: "26 August 2026", color: "indigo" },
            { label: "Room", value: "Workshop Room B", color: "cyan" }
          ],
          suggestedQuestions: [
            "When is the Google Cloud Gemini workshop?",
            "Which workshops require reservation?",
            "Where is the BOTNOI booth?"
          ]
        },
        th: {
          headline: "เวิร์กช็อปของ OpenAI และ Tyler Ryu",
          answer: "OpenAI มี 2 เวิร์กช็อปสุดพิเศษโดยคุณ Tyler Ryu (Applied AI Engineer @ OpenAI) ในวันที่ 26 ส.ค. 2026 ณ Workshop Room B:\n1) ChatGPT Work: AI Agents in Action (10:00 - 12:00 น. | สิทธิ์เข้าฟัง: Reserve)\n2) ChatGPT Work for Reporters (13:00 - 14:30 น. | สิทธิ์เข้าฟัง: Invitation only)",
          categoryTag: "เวิร์กช็อปและวิทยากร",
          keyBadges: [
            { label: "วิทยากร", value: "Tyler Ryu (OpenAI)", color: "emerald" },
            { label: "วันที่", value: "26 สิงหาคม 2026", color: "indigo" },
            { label: "ห้อง", value: "Workshop Room B", color: "cyan" }
          ],
          suggestedQuestions: [
            "เวิร์กช็อป Google Cloud Gemini จัดวันไหน?",
            "เวิร์กช็อปไหนต้องจองล่วงหน้า (Reserve)?",
            "บูธ BOTNOI อยู่ที่ไหน?"
          ]
        },
        zh: {
          headline: "OpenAI 研讨会与 Tyler Ryu 专场",
          answer: "OpenAI 将于 2026 年 8 月 26 日在研讨厅 B 举办由 Tyler Ryu（OpenAI 应用 AI 工程师）主讲的 2 场专属实操专场：\n1) ChatGPT Work: AI Agents in Action (10:00 - 12:00 | 权限: 需预约)\n2) ChatGPT Work for Reporters (13:00 - 14:30 | 权限: 仅限受邀)",
          categoryTag: "研讨会与演讲嘉宾",
          keyBadges: [
            { label: "主讲人", value: "Tyler Ryu (OpenAI)", color: "emerald" },
            { label: "日期", value: "2026年8月26日", color: "indigo" },
            { label: "研讨厅", value: "研讨厅 B", color: "cyan" }
          ],
          suggestedQuestions: [
            "Google Cloud Gemini 研讨会何时举行？",
            "哪些研讨会需要提前预约？",
            "BOTNOI 展位在哪里？"
          ]
        },
        ja: {
          headline: "OpenAI ワークショップ＆ Tyler Ryu セッション",
          answer: "OpenAI は 2026 年 8 月 26 日にワークショップルーム B にて Tyler Ryu 氏（OpenAI アプライド AI エンジニア）による 2 つの特別セッションを開催します：\n1) ChatGPT Work: AI Agents in Action (10:00 - 12:00 | 区分: 事前予約)\n2) ChatGPT Work for Reporters (13:00 - 14:30 | 区分: 招待制)",
          categoryTag: "ワークショップ＆登壇者",
          keyBadges: [
            { label: "登壇者", value: "Tyler Ryu (OpenAI)", color: "emerald" },
            { label: "日程", value: "2026年8月26日", color: "indigo" },
            { label: "会場", value: "ワークショップルーム B", color: "cyan" }
          ],
          suggestedQuestions: [
            "Google Cloud Gemini ワークショップはいつですか？",
            "事前予約が必要なワークショップは？",
            "BOTNOI ブースはどこですか？"
          ]
        },
        ko: {
          headline: "OpenAI 워크숍 및 Tyler Ryu 세션",
          answer: "OpenAI는 2026년 8월 26일 워크숍 룸 B에서 Tyler Ryu(OpenAI Applied AI Engineer)가 진행하는 2개의 독점 실습 세션을 선보입니다:\n1) ChatGPT Work: AI Agents in Action (10:00 - 12:00 | 참가: 예약 필요)\n2) ChatGPT Work for Reporters (13:00 - 14:30 | 참가: 초대 전용)",
          categoryTag: "워크숍 및 연사",
          keyBadges: [
            { label: "연사", value: "Tyler Ryu (OpenAI)", color: "emerald" },
            { label: "날짜", value: "2026년 8월 26일", color: "indigo" },
            { label: "회의실", value: "워크숍 룸 B", color: "cyan" }
          ],
          suggestedQuestions: [
            "Google Cloud Gemini 워크숍은 언제 열리나요?",
            "사전 예약이 필요한 워크숍은 무엇인가요?",
            "BOTNOI 부스는 어디인가요?"
          ]
        },
        es: {
          headline: "Talleres de OpenAI y Sesiones de Tyler Ryu",
          answer: "OpenAI presentará 2 sesiones prácticas exclusivas dirigidas por Tyler Ryu (Ingeniero de IA Aplicada en OpenAI) el 26 de agosto de 2026 en la Sala de Taller B:\n1) ChatGPT Work: AI Agents in Action (10:00 - 12:00 | Acceso: Reserva)\n2) ChatGPT Work for Reporters (13:00 - 14:30 | Acceso: Solo Invitación)",
          categoryTag: "Talleres y Ponentes",
          keyBadges: [
            { label: "Ponente", value: "Tyler Ryu (OpenAI)", color: "emerald" },
            { label: "Fecha", value: "26 de agosto de 2026", color: "indigo" },
            { label: "Sala", value: "Sala de Taller B", color: "cyan" }
          ],
          suggestedQuestions: [
            "¿Cuándo es el taller de Google Cloud Gemini?",
            "¿Qué talleres requieren reserva?",
            "¿Dónde está el stand de BOTNOI?"
          ]
        },
        fr: {
          headline: "Ateliers OpenAI et Sessions de Tyler Ryu",
          answer: "OpenAI présentera 2 sessions pratiques exclusives animées par Tyler Ryu (Ingénieur IA Appliquée chez OpenAI) le 26 août 2026 dans la Salle d'Atelier B :\n1) ChatGPT Work: AI Agents in Action (10:00 - 12:00 | Accès : Réservation)\n2) ChatGPT Work for Reporters (13:00 - 14:30 | Accès : Sur Invitation)",
          categoryTag: "Ateliers et Intervenants",
          keyBadges: [
            { label: "Intervenant", value: "Tyler Ryu (OpenAI)", color: "emerald" },
            { label: "Date", value: "26 août 2026", color: "indigo" },
            { label: "Salle", value: "Salle d'Atelier B", color: "cyan" }
          ],
          suggestedQuestions: [
            "Quand a lieu l'atelier Google Cloud Gemini ?",
            "Quels ateliers nécessitent une réservation ?",
            "Où se trouve le stand de BOTNOI ?"
          ]
        }
      },
      {
        sourceConfidence: "100% Verified Structured Data",
        matchedWorkshops: openAiWorkshops
      },
      lang
    );
  }

  // 3. Google Cloud / Gemini Enterprise questions
  if (q.includes('gemini') || q.includes('google') || q.includes('wittawin') || q.includes('agentic transformation')) {
    const geminiSession = techsauceData.workshops.filter(w => w.title.toLowerCase().includes('gemini') || w.speakers.some(s => s.company.toLowerCase().includes('google')));
    return createAnswer(
      {
        en: {
          headline: "Google Cloud Gemini Enterprise Workshop",
          answer: "Agentic Transformation: Building Your Intelligent Workplace with Gemini Enterprise presented by Wittawin Waiyaporn (Google Cloud) will take place on August 28, 2026, 13:00 - 14:30 at Workshop Room B (Access: Reserve Required).",
          categoryTag: "Workshops & Speakers",
          keyBadges: [
            { label: "Session", value: "Gemini Enterprise", color: "cyan" },
            { label: "Date & Time", value: "28 Aug 13:00-14:30", color: "indigo" },
            { label: "Access", value: "Reserve Required", color: "emerald" }
          ],
          suggestedQuestions: [
            "Are there Canva or Microsoft Copilot workshops?",
            "How many total workshops are there?",
            "Where is the BOTNOI booth?"
          ]
        },
        th: {
          headline: "เวิร์กช็อป Google Cloud: Gemini Enterprise",
          answer: "เวิร์กช็อป Agentic Transformation: Building Your Intelligent Workplace with Gemini Enterprise บรรยายโดยคุณ Wittawin Waiyaporn (Google Cloud) จะจัดขึ้นในวันที่ 28 สิงหาคม 2026 เวลา 13:00 - 14:30 น. ณ Workshop Room B (สิทธิ์การเข้าฟัง: ต้องจองล่วงหน้า / Reserve)",
          categoryTag: "เวิร์กช็อปและวิทยากร",
          keyBadges: [
            { label: "เซสชัน", value: "Gemini Enterprise", color: "cyan" },
            { label: "วันและเวลา", value: "28 ส.ค. 13:00-14:30", color: "indigo" },
            { label: "สิทธิ์การเข้าฟัง", value: "ต้องจองล่วงหน้า", color: "emerald" }
          ],
          suggestedQuestions: [
            "มีเวิร์กช็อป Canva หรือ Microsoft Copilot ไหม?",
            "เวิร์กช็อปทั้งหมดมีกี่รายการ?",
            "บูธ BOTNOI อยู่ที่ไหน?"
          ]
        },
        zh: {
          headline: "Google Cloud Gemini Enterprise 研讨会",
          answer: "由 Wittawin Waiyaporn（Google Cloud）主讲的《Agentic Transformation: Building Your Intelligent Workplace with Gemini Enterprise》研讨会将于 2026 年 8 月 28 日 13:00 - 14:30 在研讨厅 B 举行（入场权限: 需提前预约）。",
          categoryTag: "研讨会与演讲嘉宾",
          keyBadges: [
            { label: "专场主题", value: "Gemini Enterprise", color: "cyan" },
            { label: "日期与时间", value: "8月28日 13:00-14:30", color: "indigo" },
            { label: "权限", value: "需提前预约", color: "emerald" }
          ],
          suggestedQuestions: [
            "有 Canva 或 Microsoft Copilot 研讨会吗？",
            "研讨会总共有多少场？",
            "BOTNOI 展位在哪里？"
          ]
        },
        ja: {
          headline: "Google Cloud Gemini Enterprise ワークショップ",
          answer: "Wittawin Waiyaporn 氏（Google Cloud）による「Agentic Transformation: Building Your Intelligent Workplace with Gemini Enterprise」ワークショップは、2026 年 8 月 28 日 13:00 - 14:30 にワークショップルーム B で開催されます（参加区分: 事前予約制）。",
          categoryTag: "ワークショップ＆登壇者",
          keyBadges: [
            { label: "セッション", value: "Gemini Enterprise", color: "cyan" },
            { label: "日時", value: "8月28日 13:00-14:30", color: "indigo" },
            { label: "参加区分", value: "事前予約制", color: "emerald" }
          ],
          suggestedQuestions: [
            "Canva や Microsoft Copilot のワークショップはありますか？",
            "ワークショップは合計いくつありますか？",
            "BOTNOI ブースはどこですか？"
          ]
        },
        ko: {
          headline: "Google Cloud Gemini Enterprise 워크숍",
          answer: "Wittawin Waiyaporn(Google Cloud)이 진행하는 'Agentic Transformation: Building Your Intelligent Workplace with Gemini Enterprise' 워크숍은 2026년 8월 28일 13:00 - 14:30 워크숍 룸 B에서 열립니다 (참가 구분: 사전 예약 필요).",
          categoryTag: "워크숍 및 연사",
          keyBadges: [
            { label: "세션", value: "Gemini Enterprise", color: "cyan" },
            { label: "일시", value: "8월 28일 13:00-14:30", color: "indigo" },
            { label: "참가 구분", value: "사전 예약 필요", color: "emerald" }
          ],
          suggestedQuestions: [
            "Canva 또는 Microsoft Copilot 워크숍이 있나요?",
            "총 몇 개의 워크숍이 있나요?",
            "BOTNOI 부스는 어디인가요?"
          ]
        },
        es: {
          headline: "Taller de Google Cloud Gemini Enterprise",
          answer: "El taller 'Agentic Transformation: Building Your Intelligent Workplace with Gemini Enterprise' presentado por Wittawin Waiyaporn (Google Cloud) se llevará a cabo el 28 de agosto de 2026 de 13:00 a 14:30 en la Sala de Taller B (Acceso: Requiere Reserva).",
          categoryTag: "Talleres y Ponentes",
          keyBadges: [
            { label: "Sesión", value: "Gemini Enterprise", color: "cyan" },
            { label: "Fecha y Hora", value: "28 Ago 13:00-14:30", color: "indigo" },
            { label: "Acceso", value: "Requiere Reserva", color: "emerald" }
          ],
          suggestedQuestions: [
            "¿Hay talleres de Canva o Microsoft Copilot?",
            "¿Cuántos talleres hay en total?",
            "¿Dónde está el stand de BOTNOI?"
          ]
        },
        fr: {
          headline: "Atelier Google Cloud Gemini Enterprise",
          answer: "L'atelier « Agentic Transformation : Building Your Intelligent Workplace with Gemini Enterprise » animé par Wittawin Waiyaporn (Google Cloud) aura lieu le 28 août 2026 de 13h00 à 14h30 dans la Salle d'Atelier B (Accès : Réservation Requise).",
          categoryTag: "Ateliers et Intervenants",
          keyBadges: [
            { label: "Session", value: "Gemini Enterprise", color: "cyan" },
            { label: "Date et Heure", value: "28 Août 13:00-14:30", color: "indigo" },
            { label: "Accès", value: "Réservation Requise", color: "emerald" }
          ],
          suggestedQuestions: [
            "Y a-t-il des ateliers Canva ou Microsoft Copilot ?",
            "Combien d'ateliers y a-t-il au total ?",
            "Où se trouve le stand de BOTNOI ?"
          ]
        }
      },
      {
        sourceConfidence: "100% Verified Structured Data",
        matchedWorkshops: geminiSession
      },
      lang
    );
  }

  // 4. Techsauce Awards questions
  if (q.includes('award') || q.includes('รางวัล') || q.includes('saucest') || q.includes('etda') || q.includes('governance') || q.includes('奖项') || q.includes('アワード') || q.includes('어워드') || q.includes('premio') || q.includes('prix')) {
    return createAnswer(
      {
        en: {
          headline: "Techsauce Awards 2026 Details & Categories",
          answer: "Techsauce Awards 2026 honors standard-setting pioneers under the theme “Set New Standards in The Race to The Next” across 6 major categories on August 27, 2026 at Main Stadium (QSNCC), including AI Transformation (with ETDA), People, Technology, ESG Impact, Entrepreneur, and Ecosystem Catalyst.",
          categoryTag: "Techsauce Awards 2026",
          keyBadges: [
            { label: "Ceremony Date", value: "27 August 2026", color: "amber" },
            { label: "Venue", value: "Main Stadium (QSNCC)", color: "indigo" },
            { label: "Categories", value: "6 Categories / 18 Honors", color: "emerald" }
          ],
          suggestedQuestions: [
            "What awards are in the Technology category?",
            "When and where is the event?",
            "Where is the BOTNOI booth?"
          ]
        },
        th: {
          headline: "ข้อมูลงานประกาศรางวัล Techsauce Awards 2026",
          answer: "งานประกาศรางวัล Techsauce Awards 2026 จัดขึ้นภายใต้ธีม “Set New Standards in The Race to The Next” มีทั้งหมด 6 หมวดรางวัลใหญ่ รวม 18 รางวัล โดยจะมีพิธีมอบรางวัลในวันที่ 27 สิงหาคม 2026 ณ Main Stadium ศูนย์การประชุมแห่งชาติสิริกิติ์ (QSNCC) โดยมีหมวดสำคัญอย่าง AI Transformation (ร่วมกับ ETDA), People, Technology, ESG Impact, Entrepreneur และ Ecosystem Catalyst ครับ",
          categoryTag: "งานประกาศรางวัล Techsauce Awards 2026",
          keyBadges: [
            { label: "วันประกาศรางวัล", value: "27 สิงหาคม 2026", color: "amber" },
            { label: "สถานที่", value: "Main Stadium (QSNCC)", color: "indigo" },
            { label: "หมวดหมู่", value: "6 หมวด / 18 รางวัล", color: "emerald" }
          ],
          suggestedQuestions: [
            "หมวดรางวัล Technology มีรางวัลอะไรบ้าง?",
            "งานจัดวันที่เท่าไหร่?",
            "บูธ BOTNOI อยู่ที่ไหน?"
          ]
        },
        zh: {
          headline: "Techsauce Awards 2026 详情与奖项类别",
          answer: "Techsauce Awards 2026 以“Set New Standards in The Race to The Next”为主题，将于 2026 年 8 月 27 日在诗丽吉王后国家会议中心 (QSNCC) 主体育场举行，涵盖 AI 转型 (与 ETDA 联合)、人才、技术、ESG 影响力、创业者及生态赋能者 6 大类别共 18 项荣誉。",
          categoryTag: "2026 年 Techsauce 奖项",
          keyBadges: [
            { label: "颁奖日期", value: "2026年8月27日", color: "amber" },
            { label: "地点", value: "主体育场 (QSNCC)", color: "indigo" },
            { label: "奖项类别", value: "6 大类别 / 18 项荣誉", color: "emerald" }
          ],
          suggestedQuestions: [
            "Technology 类别有哪些奖项？",
            "活动举办时间和地点是什么？",
            "BOTNOI 展位在哪里？"
          ]
        },
        ja: {
          headline: "Techsauce Awards 2026 詳細＆カテゴリー",
          answer: "Techsauce Awards 2026 は「Set New Standards in The Race to The Next」をテーマに、2026 年 8 月 27 日に QSNCC メインスタジアムにて開催されます。AI 変革（ETDA 提携）、ピープル、テクノロジー、ESG インパクト、アントレプレナー、エコシステム触媒の 6 分野 18 の栄誉が表彰されます。",
          categoryTag: "Techsauce アワード 2026",
          keyBadges: [
            { label: "授賞式日程", value: "2026年8月27日", color: "amber" },
            { label: "会場", value: "Main Stadium (QSNCC)", color: "indigo" },
            { label: "カテゴリー", value: "6 部門 / 18 栄誉", color: "emerald" }
          ],
          suggestedQuestions: [
            "Technology 部門にはどんな賞がありますか？",
            "開催日程はいつですか？",
            "BOTNOI ブースはどこですか？"
          ]
        },
        ko: {
          headline: "Techsauce Awards 2026 상세 정보 및 부문",
          answer: "Techsauce Awards 2026은 'Set New Standards in The Race to The Next'를 주제로 2026년 8월 27일 QSNCC 메인 스타디움에서 열립니다. AI Transformation(ETDA 협력), People, Technology, ESG Impact, Entrepreneur, Ecosystem Catalyst 등 6개 부문 총 18개 상을 수여합니다.",
          categoryTag: "Techsauce 어워드 2026",
          keyBadges: [
            { label: "시상식 일자", value: "2026년 8월 27일", color: "amber" },
            { label: "장소", value: "메인 스타디움 (QSNCC)", color: "indigo" },
            { label: "부문", value: "6개 부문 / 18개 영예", color: "emerald" }
          ],
          suggestedQuestions: [
            "Technology 부문에는 어떤 상이 있나요?",
            "행사 일정은 어떻게 되나요?",
            "BOTNOI 부스는 어디인가요?"
          ]
        },
        es: {
          headline: "Detalles y Categorías de Techsauce Awards 2026",
          answer: "Techsauce Awards 2026 rinde homenaje a los pioneros bajo el lema 'Set New Standards in The Race to The Next' en 6 categorías principales el 27 de agosto de 2026 en el Main Stadium (QSNCC), incluyendo Transformación IA (con ETDA), Talento, Tecnología, Impacto ESG, Emprendedores y Catalizadores.",
          categoryTag: "Premios Techsauce 2026",
          keyBadges: [
            { label: "Fecha de Premiación", value: "27 de agosto de 2026", color: "amber" },
            { label: "Lugar", value: "Main Stadium (QSNCC)", color: "indigo" },
            { label: "Categorías", value: "6 Categorías / 18 Honores", color: "emerald" }
          ],
          suggestedQuestions: [
            "¿Qué premios hay en la categoría Technology?",
            "¿Cuándo y dónde es el evento?",
            "¿Dónde está el stand de BOTNOI?"
          ]
        },
        fr: {
          headline: "Détails et Catégories des Techsauce Awards 2026",
          answer: "Les Techsauce Awards 2026 récompensent les pionniers sous le thème « Set New Standards in The Race to The Next » dans 6 catégories majeures le 27 août 2026 au Main Stadium (QSNCC), dont Transformation IA (avec ETDA), Talents, Technologie, Impact ESG, Entrepreneurs et Catalyseurs.",
          categoryTag: "Prix Techsauce 2026",
          keyBadges: [
            { label: "Date de Cérémonie", value: "27 août 2026", color: "amber" },
            { label: "Lieu", value: "Main Stadium (QSNCC)", color: "indigo" },
            { label: "Catégories", value: "6 Catégories / 18 Honneurs", color: "emerald" }
          ],
          suggestedQuestions: [
            "Quels prix sont dans la catégorie Technology ?",
            "Quand et où a lieu l'événement ?",
            "Où se trouve le stand de BOTNOI ?"
          ]
        }
      },
      {
        sourceConfidence: "100% Verified Structured Data",
        matchedAwards: [
          { category: "AI Transformation", award: "The Saucest AI-Driven Company" },
          { category: "AI Transformation", award: "The Saucest AI Governance Leadership Award by ETDA" }
        ]
      },
      lang
    );
  }

  // 5. Date / Venue / Location questions
  if (
    q.includes('วันไหน') ||
    q.includes('เมื่อไหร่') ||
    q.includes('ที่ไหน') ||
    q.includes('date') ||
    q.includes('venue') ||
    q.includes('location') ||
    q.includes('qsncc') ||
    q.includes('สิริกิติ์') ||
    q.includes('时间') ||
    q.includes('地点') ||
    q.includes('日程') ||
    q.includes('会場') ||
    q.includes('일정') ||
    q.includes('장소') ||
    q.includes('fecha') ||
    q.includes('lugar')
  ) {
    return createAnswer(
      {
        en: {
          headline: "Techsauce Global Summit 2026 Dates & Venue",
          answer: "Techsauce Global Summit 2026 takes place from 26 to 28 August 2026 at the Queen Sirikit National Convention Center (QSNCC) in Bangkok, Thailand, featuring Main Stages, 215+ Exhibitor Booths, 15 Workshops, and Techsauce Awards on August 27.",
          categoryTag: "Event Dates & Venue Logistics",
          keyBadges: [
            { label: "Dates", value: "26 - 28 August 2026", color: "indigo" },
            { label: "Venue", value: "QSNCC Bangkok", color: "cyan" },
            { label: "Scale", value: "215 Exhibitors & 15 Workshops", color: "emerald" }
          ],
          suggestedQuestions: [
            "Where is the BOTNOI GROUP booth located?",
            "What workshops are available?",
            "When is the OpenAI workshop?"
          ]
        },
        th: {
          headline: "วันเวลาและสถานที่จัดงาน Techsauce Global Summit 2026",
          answer: "งาน Techsauce Global Summit 2026 จัดขึ้นระหว่างวันที่ 26 – 28 สิงหาคม 2026 ณ ศูนย์การประชุมแห่งชาติสิริกิติ์ (QSNCC) กรุงเทพฯ โดยมีทั้ง Main Stage, Exhibition Zone (215+ บูธ), Workshop Room A & B (15 เวิร์กช็อป) และเวที Techsauce Awards 2026 ในวันที่ 27 ส.ค.",
          categoryTag: "วันเวลาและสถานที่จัดงาน",
          keyBadges: [
            { label: "วันที่จัดงาน", value: "26 - 28 สิงหาคม 2026", color: "indigo" },
            { label: "สถานที่", value: "QSNCC กรุงเทพฯ", color: "cyan" },
            { label: "ขนาดงาน", value: "215 บูธ & 15 เวิร์กช็อป", color: "emerald" }
          ],
          suggestedQuestions: [
            "บูธ BOTNOI GROUP อยู่ตรงไหน?",
            "มีเวิร์กช็อปอะไรน่าสนใจบ้าง?",
            "เวิร์กช็อปของ OpenAI จัดวันไหน?"
          ]
        },
        zh: {
          headline: "Techsauce Global Summit 2026 举办时间与地点",
          answer: "Techsauce Global Summit 2026 将于 2026 年 8 月 26 日至 28 日在泰国曼谷诗丽吉王后国家会议中心 (QSNCC) 举行，设有主舞台、215+ 参展展位、15 场精选研讨会以及 8 月 27 日的 Techsauce Awards 颁奖礼。",
          categoryTag: "活动日期与场地指南",
          keyBadges: [
            { label: "活动日期", value: "2026年8月26日 - 28日", color: "indigo" },
            { label: "举办场地", value: "曼谷 QSNCC", color: "cyan" },
            { label: "活动规模", value: "215 参展商 & 15 研讨会", color: "emerald" }
          ],
          suggestedQuestions: [
            "BOTNOI GROUP 展位在哪里？",
            "有哪些精选研讨会？",
            "OpenAI 研讨会何时举行？"
          ]
        },
        ja: {
          headline: "Techsauce Global Summit 2026 開催日程＆会場",
          answer: "Techsauce Global Summit 2026 は、2026 年 8 月 26 日〜28 日にタイ・バンコクのクイーン・シリキット・ナショナル・コンベンション・センター（QSNCC）にて開催されます。メインステージ、215 以上の出展ブース、15 のワークショップ、8 月 27 日のアワード授賞式が行われます。",
          categoryTag: "開催日程＆会場案内",
          keyBadges: [
            { label: "開催日程", value: "2026年8月26日 - 28日", color: "indigo" },
            { label: "会場", value: "バンコク QSNCC", color: "cyan" },
            { label: "規模", value: "215出展ブース & 15ワークショップ", color: "emerald" }
          ],
          suggestedQuestions: [
            "BOTNOI GROUP のブースはどこですか？",
            "どんなワークショップがありますか？",
            "OpenAI ワークショップはいつですか？"
          ]
        },
        ko: {
          headline: "Techsauce Global Summit 2026 개최 일시 및 장소",
          answer: "Techsauce Global Summit 2026은 2026년 8월 26일부터 28일까지 태국 방콕의 퀸 시리킷 국립 컨벤션 센터(QSNCC)에서 개최됩니다. 메인 스테이지, 215개 이상의 전시 부스, 15개 워크숍 및 8월 27일 어워드 시상식이 진행됩니다.",
          categoryTag: "행사 일정 및 장소 안내",
          keyBadges: [
            { label: "행사 일정", value: "2026년 8월 26일 - 28일", color: "indigo" },
            { label: "행사 장소", value: "방콕 QSNCC", color: "cyan" },
            { label: "규모", value: "215개 부스 & 15개 워크숍", color: "emerald" }
          ],
          suggestedQuestions: [
            "BOTNOI GROUP 부스는 어디인가요?",
            "어떤 워크숍들이 있나요?",
            "OpenAI 워크숍은 언제 열리나요?"
          ]
        },
        es: {
          headline: "Fechas y Lugar de Techsauce Global Summit 2026",
          answer: "Techsauce Global Summit 2026 se llevará a cabo del 26 al 28 de agosto de 2026 en el Centro Nacional de Convenciones Queen Sirikit (QSNCC) en Bangkok, con escenarios principales, más de 215 stands, 15 talleres y los Premios Techsauce el 27 de agosto.",
          categoryTag: "Fechas del Evento y Ubicación",
          keyBadges: [
            { label: "Fechas", value: "26 - 28 de agosto de 2026", color: "indigo" },
            { label: "Lugar", value: "QSNCC Bangkok", color: "cyan" },
            { label: "Escala", value: "215 Expositores y 15 Talleres", color: "emerald" }
          ],
          suggestedQuestions: [
            "¿Dónde está ubicado el stand de BOTNOI GROUP?",
            "¿Qué talleres están disponibles?",
            "¿Cuándo es el taller de OpenAI?"
          ]
        },
        fr: {
          headline: "Dates et Lieu du Techsauce Global Summit 2026",
          answer: "Le Techsauce Global Summit 2026 se déroulera du 26 au 28 août 2026 au Queen Sirikit National Convention Center (QSNCC) à Bangkok, comprenant des scènes principales, plus de 215 stands d'exposition, 15 ateliers et les Techsauce Awards le 27 août.",
          categoryTag: "Dates de l'Événement et Lieu",
          keyBadges: [
            { label: "Dates", value: "26 - 28 août 2026", color: "indigo" },
            { label: "Lieu", value: "QSNCC Bangkok", color: "cyan" },
            { label: "Échelle", value: "215 Exposants & 15 Ateliers", color: "emerald" }
          ],
          suggestedQuestions: [
            "Où se trouve le stand de BOTNOI GROUP ?",
            "Quels ateliers sont proposés ?",
            "Quand a lieu l'atelier OpenAI ?"
          ]
        }
      },
      {
        sourceConfidence: "100% Verified Structured Data"
      },
      lang
    );
  }

  // 6. Generic search matching exhibitors, workshops, awards
  if (search.exhibitors.length > 0 || search.workshops.length > 0 || search.awards.length > 0) {
    const exhibitorNames = search.exhibitors.slice(0, 3).map(e => `${e.company} (${e.booth ? `Booth ${e.booth}` : 'Booth Not shown'})`).join(', ');
    const workshopTitles = search.workshops.slice(0, 2).map(w => `“${w.title}” (${w.date} ${w.time})`).join(', ');

    let summaryTh = `พบข้อมูลที่เกี่ยวข้องกับ "${question}" ในระบบฐานข้อมูลของงาน:`;
    if (search.exhibitors.length > 0) summaryTh += `\n• บูธผู้จัดแสดง: ${exhibitorNames}`;
    if (search.workshops.length > 0) summaryTh += `\n• เวิร์กช็อป: ${workshopTitles}`;
    if (search.awards.length > 0) summaryTh += `\n• รางวัล: ${search.awards.slice(0, 2).map(a => a.award).join(', ')}`;

    let summaryEn = `Found matching items for "${question}" in the official event knowledge base:`;
    if (search.exhibitors.length > 0) summaryEn += `\n• Exhibitors: ${exhibitorNames}`;
    if (search.workshops.length > 0) summaryEn += `\n• Workshops: ${workshopTitles}`;
    if (search.awards.length > 0) summaryEn += `\n• Awards: ${search.awards.slice(0, 2).map(a => a.award).join(', ')}`;

    let summaryZh = `在官方活动知识库中找到与 "${question}" 相关的内容:`;
    if (search.exhibitors.length > 0) summaryZh += `\n• 展位: ${exhibitorNames}`;
    if (search.workshops.length > 0) summaryZh += `\n• 研讨会: ${workshopTitles}`;

    let summaryJa = `公式ナレッジベースから "${question}" に一致する情報が見つかりました:`;
    if (search.exhibitors.length > 0) summaryJa += `\n• 出展ブース: ${exhibitorNames}`;
    if (search.workshops.length > 0) summaryJa += `\n• ワークショップ: ${workshopTitles}`;

    let summaryKo = `공식 행사 지식 베이스에서 "${question}" 와(과) 일치하는 항목을 찾았습니다:`;
    if (search.exhibitors.length > 0) summaryKo += `\n• 부스: ${exhibitorNames}`;
    if (search.workshops.length > 0) summaryKo += `\n• 워크숍: ${workshopTitles}`;

    let summaryEs = `Se encontraron elementos coincidentes con "${question}" en la base de conocimiento:`;
    if (search.exhibitors.length > 0) summaryEs += `\n• Stands: ${exhibitorNames}`;
    if (search.workshops.length > 0) summaryEs += `\n• Talleres: ${workshopTitles}`;

    let summaryFr = `Résultats correspondants à « ${question} » trouvés dans la base de connaissances :`;
    if (search.exhibitors.length > 0) summaryFr += `\n• Stands : ${exhibitorNames}`;
    if (search.workshops.length > 0) summaryFr += `\n• Ateliers : ${workshopTitles}`;

    return createAnswer(
      {
        en: {
          headline: `Knowledge Base Match for: "${question}"`,
          answer: summaryEn,
          categoryTag: "Live Knowledge Base Search",
          keyBadges: [
            { label: "Workshops Matched", value: `${search.workshops.length} sessions`, color: "indigo" },
            { label: "Exhibitors Matched", value: `${search.exhibitors.length} booths`, color: "cyan" },
          ],
          suggestedQuestions: [
            "Where is the BOTNOI booth?",
            "When is the OpenAI workshop?",
            "View all workshops"
          ]
        },
        th: {
          headline: `ผลการค้นหาข้อมูล: "${question}"`,
          answer: summaryTh,
          categoryTag: "ค้นหาฐานข้อมูลความรู้งาน",
          keyBadges: [
            { label: "เวิร์กช็อปที่พบ", value: `${search.workshops.length} เซสชัน`, color: "indigo" },
            { label: "บูธที่พบ", value: `${search.exhibitors.length} บูธ`, color: "cyan" },
          ],
          suggestedQuestions: [
            "บูธ BOTNOI อยู่ที่ไหน?",
            "เวิร์กช็อป OpenAI จัดวันไหน?",
            "ดูรายการเวิร์กช็อปทั้งหมด"
          ]
        },
        zh: {
          headline: `知识库匹配结果: "${question}"`,
          answer: summaryZh,
          categoryTag: "知识库实时检索",
          keyBadges: [
            { label: "匹配研讨会", value: `${search.workshops.length} 场`, color: "indigo" },
            { label: "匹配展位", value: `${search.exhibitors.length} 家`, color: "cyan" },
          ],
          suggestedQuestions: [
            "BOTNOI 展位在哪里？",
            "OpenAI 研讨会何时举行？",
            "查看所有研讨会"
          ]
        },
        ja: {
          headline: `"${question}" の検索結果`,
          answer: summaryJa,
          categoryTag: "ナレッジベース検索結果",
          keyBadges: [
            { label: "該当ワークショップ", value: `${search.workshops.length} 件`, color: "indigo" },
            { label: "該当出展ブース", value: `${search.exhibitors.length} 件`, color: "cyan" },
          ],
          suggestedQuestions: [
            "BOTNOI ブースはどこ？",
            "OpenAI ワークショップはいつ？",
            "すべてのワークショップを見る"
          ]
        },
        ko: {
          headline: `"${question}" 검색 결과`,
          answer: summaryKo,
          categoryTag: "지식 베이스 실시간 검색",
          keyBadges: [
            { label: "매칭 워크숍", value: `${search.workshops.length}개`, color: "indigo" },
            { label: "매칭 부스", value: `${search.exhibitors.length}개`, color: "cyan" },
          ],
          suggestedQuestions: [
            "BOTNOI 부스는 어디에 있나요?",
            "OpenAI 워크숍은 언제인가요?",
            "전체 워크숍 보기"
          ]
        },
        es: {
          headline: `Resultado de búsqueda para: "${question}"`,
          answer: summaryEs,
          categoryTag: "Búsqueda en Base de Conocimiento",
          keyBadges: [
            { label: "Talleres Encontrados", value: `${search.workshops.length} sesiones`, color: "indigo" },
            { label: "Stands Encontrados", value: `${search.exhibitors.length} stands`, color: "cyan" },
          ],
          suggestedQuestions: [
            "¿Dónde está el stand de BOTNOI?",
            "¿Cuándo es el taller de OpenAI?",
            "Ver todos los talleres"
          ]
        },
        fr: {
          headline: `Résultats de recherche pour : "${question}"`,
          answer: summaryFr,
          categoryTag: "Recherche Base de Connaissances",
          keyBadges: [
            { label: "Ateliers Trouvés", value: `${search.workshops.length} sessions`, color: "indigo" },
            { label: "Stands Trouvés", value: `${search.exhibitors.length} stands`, color: "cyan" },
          ],
          suggestedQuestions: [
            "Où se trouve le stand de BOTNOI ?",
            "Quand a lieu l'atelier OpenAI ?",
            "Voir tous les ateliers"
          ]
        }
      },
      {
        sourceConfidence: "100% Verified Structured Data",
        matchedWorkshops: search.workshops,
        matchedExhibitors: search.exhibitors,
        matchedAwards: search.awards
      },
      lang
    );
  }

  // 7. Fallback for un-matched question
  return createAnswer(
    {
      en: {
        headline: `Event AI Answer: "${question}"`,
        answer: `Techsauce Global Summit 2026 (26-28 August 2026 at QSNCC) features 15 workshops, 215 exhibitors, and 18 awards. You can search any booth number, speaker name, or topic.`,
        categoryTag: "Event AI Concierge",
        keyBadges: [
          { label: "Event", value: "Techsauce 2026", color: "indigo" },
          { label: "Total Exhibitors", value: "215 Booths", color: "cyan" },
        ],
        suggestedQuestions: [
          "Where is the BOTNOI GROUP booth located?",
          "When is the OpenAI workshop?",
          "What are the AI Transformation awards?"
        ]
      },
      th: {
        headline: `คำตอบสำหรับ: "${question}"`,
        answer: `งาน Techsauce Global Summit 2026 (26-28 ส.ค. 2026 ณ QSNCC) ประกอบด้วย 15 เวิร์กช็อปชั้นนำ, 215 ผู้จัดแสดงเทคโนโลยี และ 18 รางวัลเกียรติยศ คุณสามารถค้นหาเลขบูธ, ชื่อวิทยากร หรือหัวข้อสัมมนาได้โดยตรงครับ`,
        categoryTag: "AI ผู้ช่วยเสมือนจริงประจำงาน",
        keyBadges: [
          { label: "ชื่องาน", value: "Techsauce 2026", color: "indigo" },
          { label: "ผู้จัดแสดงทั้งหมด", value: "215 บูธ", color: "cyan" },
        ],
        suggestedQuestions: [
          "บูธ BOTNOI GROUP อยู่ตรงไหน?",
          "เวิร์กช็อปของ OpenAI จัดวันไหน?",
          "รางวัล AI Transformation มีอะไรบ้าง?"
        ]
      },
      zh: {
        headline: `关于 "${question}" 的解答`,
        answer: `Techsauce Global Summit 2026（2026 年 8 月 26 - 28 日在诗丽吉王后国家会议中心 QSNCC 举行）包含 15 场精选研讨会、215 个前沿展位和 18 项荣誉大奖。您可以直接搜索展位号、演讲嘉宾或主题。`,
        categoryTag: "活动 AI 礼宾助手",
        keyBadges: [
          { label: "活动名称", value: "Techsauce 2026", color: "indigo" },
          { label: "参展商总数", value: "215 个展位", color: "cyan" },
        ],
        suggestedQuestions: [
          "BOTNOI GROUP 展位在哪里？",
          "OpenAI 研讨会何时举行？",
          "AI Transformation 奖项有哪些？"
        ]
      },
      ja: {
        headline: `"${question}" に関する回答`,
        answer: `Techsauce Global Summit 2026（2026 年 8 月 26 日〜28 日、QSNCC 開催）では、15 の厳選ワークショップ、215 の出展ブース、18 のアワードをご案内しています。ブース番号、登壇者名、テーマなどを直接ご質問いただけます。`,
        categoryTag: "イベント AI コンシェルジュ",
        keyBadges: [
          { label: "イベント名", value: "Techsauce 2026", color: "indigo" },
          { label: "総出展ブース", value: "215 ブース", color: "cyan" },
        ],
        suggestedQuestions: [
          "BOTNOI GROUP のブースはどこにありますか？",
          "OpenAI のワークショップはいつですか？",
          "AI Transformation アワードにはどんな賞がありますか？"
        ]
      },
      ko: {
        headline: `"${question}" 에 대한 AI 답변`,
        answer: `Techsauce Global Summit 2026(2026년 8월 26일~28일, QSNCC)은 15개 전문 워크숍, 215개 전시 부스 및 18개 어워드를 선보입니다. 부스 번호, 연사 이름 또는 주제를 자유롭게 검색해 보세요.`,
        categoryTag: "이벤트 AI 컨시어지",
        keyBadges: [
          { label: "행사명", value: "Techsauce 2026", color: "indigo" },
          { label: "총 참가 기업", value: "215개 부스", color: "cyan" },
        ],
        suggestedQuestions: [
          "BOTNOI GROUP 부스는 어디에 있나요?",
          "OpenAI 워크숍은 언제 열리나요?",
          "AI Transformation 어워드에는 어떤 상이 있나요?"
        ]
      },
      es: {
        headline: `Respuesta de IA para: "${question}"`,
        answer: `Techsauce Global Summit 2026 (del 26 al 28 de agosto de 2026 en QSNCC) cuenta con 15 talleres destacados, 215 expositores y 18 premios. Puede buscar directamente por número de stand, ponente o tema.`,
        categoryTag: "Conserje de IA para Eventos",
        keyBadges: [
          { label: "Evento", value: "Techsauce 2026", color: "indigo" },
          { label: "Total Expositores", value: "215 Stands", color: "cyan" },
        ],
        suggestedQuestions: [
          "¿Dónde está ubicado el stand de BOTNOI GROUP?",
          "¿Cuándo es el taller de OpenAI?",
          "¿Cuáles son los premios de AI Transformation?"
        ]
      },
      fr: {
        headline: `Réponse IA pour : « ${question} »`,
        answer: `Le Techsauce Global Summit 2026 (du 26 au 28 août 2026 au QSNCC) propose 15 ateliers, 215 exposants et 18 prix d'honneur. Vous pouvez rechercher directement un numéro de stand, un nom d'intervenant ou un sujet.`,
        categoryTag: "Concierge IA de l'Événement",
        keyBadges: [
          { label: "Événement", value: "Techsauce 2026", color: "indigo" },
          { label: "Total Exposants", value: "215 Stands", color: "cyan" },
        ],
        suggestedQuestions: [
          "Où se trouve le stand de BOTNOI GROUP ?",
          "Quand a lieu l'atelier OpenAI ?",
          "Quelles sont les catégories de prix AI Transformation ?"
        ]
      }
    },
    {
      sourceConfidence: "Curated Knowledge Base",
      matchedWorkshops: techsauceData.workshops.slice(0, 2),
      matchedExhibitors: techsauceData.exhibitors.slice(0, 2)
    },
    lang
  );
}

/**
 * CSV Generation Utilities for easy data export matching the Vibe Knowledge Sheet
 */
export function generateWorkshopsCSV(): string {
  const headers = ['Date', 'Time', 'Workshop Title', 'Speaker', 'Role / Position', 'Company', 'Room', 'Access'];
  const rows: string[] = [headers.join(',')];

  techsauceData.workshops.forEach((w) => {
    if (w.speakers.length === 0) {
      rows.push(`"${w.date}","${w.time}","${w.title.replace(/"/g, '""')}","","","","${w.room}","${w.access}"`);
    } else {
      w.speakers.forEach((s) => {
        rows.push(
          `"${w.date}","${w.time}","${w.title.replace(/"/g, '""')}","${s.name.replace(/"/g, '""')}","${s.role.replace(/"/g, '""')}","${s.company.replace(/"/g, '""')}","${w.room}","${w.access}"`
        );
      });
    }
  });

  return rows.join('\n');
}

export function generateExhibitorsCSV(): string {
  const headers = ['Company / Exhibitor', 'Booth'];
  const rows: string[] = [headers.join(',')];

  techsauceData.exhibitors.forEach((e) => {
    rows.push(`"${e.company.replace(/"/g, '""')}","${e.booth || 'Not shown'}"`);
  });

  return rows.join('\n');
}

export function generateAwardsCSV(): string {
  const headers = ['Category', 'Award Name', 'Nomination Period', 'Announcement Date', 'Venue'];
  const rows: string[] = [headers.join(',')];

  Object.entries(techsauceData.techsauce_awards.categories).forEach(([category, awardsList]) => {
    awardsList.forEach((award) => {
      rows.push(
        `"${category}","${award.replace(/"/g, '""')}","${techsauceData.techsauce_awards.nomination_period}","${techsauceData.techsauce_awards.announcement_date}","${techsauceData.techsauce_awards.venue.replace(/"/g, '""')}"`
      );
    });
  });

  return rows.join('\n');
}
