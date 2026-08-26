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
}

/**
 * Intelligent Event Q&A Synthesis Engine
 * Built specifically for live event showcase booth demos to answer attendee questions.
 */
export function answerEventQuestion(question: string): EventAIAnswer {
  const q = question.toLowerCase().trim();
  const search = queryKnowledgeBase(q);

  // 1. BOTNOI / Botnoi booth question
  if (q.includes('botnoi') || q.includes('บอทน้อย') || q.includes('a63')) {
    const botnoi = techsauceData.exhibitors.find(e => e.company.toLowerCase().includes('botnoi'));
    return {
      headlineTh: "บูธ BOTNOI GROUP อยู่ที่ไหน?",
      headlineEn: "Where is the BOTNOI GROUP booth located?",
      answerTh: "บูธของ BOTNOI GROUP ตั้งอยู่ที่ **Booth A63 (Zone A)** เป็นพื้นที่จัดแสดงเทคโนโลยี Voice AI, Digital Avatar และ Conversational AI Solutions สำหรับองค์กร พร้อมการสาธิตระบบ Interactive AI ผู้ช่วยเสมือนจริงแบบเรียลไทม์ครับ",
      answerEn: "BOTNOI GROUP is located at **Booth A63 (Zone A)**, showcasing leading Voice AI, Digital Avatar, and enterprise conversational AI solutions with interactive live demos.",
      categoryTag: "Exhibitor & Booth Navigation",
      sourceConfidence: "100% Verified Structured Data",
      matchedWorkshops: [],
      matchedExhibitors: botnoi ? [botnoi] : [],
      matchedAwards: [],
      keyBadges: [
        { label: "Booth Number", value: "Booth A63", color: "indigo" },
        { label: "Zone", value: "Zone A (AI & Tech)", color: "cyan" },
        { label: "Status", value: "Featured AI Showcase", color: "emerald" },
      ],
      suggestedQuestions: [
        "มีเวิร์กช็อปอะไรที่เกี่ยวกับ AI บ้าง?",
        "งานจัดวันที่เท่าไหร่และที่ไหน?",
        "รางวัล AI Transformation มีอะไรบ้าง?"
      ]
    };
  }

  // 2. OpenAI / Tyler Ryu / ChatGPT questions
  if (q.includes('openai') || q.includes('tyler') || q.includes('chatgpt') || q.includes('agent in action') || q.includes('reporters')) {
    const openAiWorkshops = techsauceData.workshops.filter(w =>
      w.title.toLowerCase().includes('chatgpt') || w.speakers.some(s => s.company.toLowerCase().includes('openai'))
    );
    return {
      headlineTh: "เวิร์กช็อปของ OpenAI และ Tyler Ryu",
      headlineEn: "OpenAI Workshops & Tyler Ryu Sessions",
      answerTh: "OpenAI มี 2 เวิร์กช็อปสุดพิเศษโดยคุณ **Tyler Ryu (Applied AI Engineer @ OpenAI)** ในวันที่ 26 ส.ค. 2026 ณ Workshop Room B:\n1) **ChatGPT Work: AI Agents in Action** (10:00 - 12:00 น. | สิทธิ์เข้าฟัง: Reserve)\n2) **ChatGPT Work for Reporters** (13:00 - 14:30 น. | สิทธิ์เข้าฟัง: Invitation only)",
      answerEn: "OpenAI is presenting 2 exclusive hands-on sessions led by **Tyler Ryu (Applied AI Engineer @ OpenAI)** on August 26, 2026 in Workshop Room B.",
      categoryTag: "Workshops & Speakers",
      sourceConfidence: "100% Verified Structured Data",
      matchedWorkshops: openAiWorkshops,
      matchedExhibitors: [],
      matchedAwards: [],
      keyBadges: [
        { label: "Speaker", value: "Tyler Ryu (OpenAI)", color: "emerald" },
        { label: "Date", value: "26 August 2026", color: "indigo" },
        { label: "Room", value: "Workshop Room B", color: "cyan" }
      ],
      suggestedQuestions: [
        "เวิร์กช็อป Google Cloud Gemini จัดวันไหน?",
        "เวิร์กช็อปไหนต้องจองล่วงหน้า (Reserve)?",
        "บูธ BOTNOI อยู่ที่ไหน?"
      ]
    };
  }

  // 3. Google Cloud / Gemini Enterprise questions
  if (q.includes('gemini') || q.includes('google') || q.includes('wittawin') || q.includes('agentic transformation')) {
    const geminiSession = techsauceData.workshops.filter(w => w.title.toLowerCase().includes('gemini') || w.speakers.some(s => s.company.toLowerCase().includes('google')));
    return {
      headlineTh: "เวิร์กช็อป Google Cloud: Gemini Enterprise",
      headlineEn: "Google Cloud Gemini Enterprise Workshop",
      answerTh: "เวิร์กช็อป **Agentic Transformation: Building Your Intelligent Workplace with Gemini Enterprise** บรรยายโดยคุณ **Wittawin Waiyaporn (Customer Solution Consultant @ Google Cloud)** จะจัดขึ้นในวันที่ **28 สิงหาคม 2026 เวลา 13:00 - 14:30 น. ณ Workshop Room B** (ประเภทการเข้าฟัง: ต้องจองล่วงหน้า / Reserve)",
      answerEn: "**Agentic Transformation: Building Your Intelligent Workplace with Gemini Enterprise** presented by **Wittawin Waiyaporn (Google Cloud)** will take place on **August 28, 2026, 13:00 - 14:30 at Workshop Room B** (Access: Reserve).",
      categoryTag: "Workshops & Speakers",
      sourceConfidence: "100% Verified Structured Data",
      matchedWorkshops: geminiSession,
      matchedExhibitors: [],
      matchedAwards: [],
      keyBadges: [
        { label: "Session", value: "Gemini Enterprise", color: "cyan" },
        { label: "Date & Time", value: "28 Aug 13:00-14:30", color: "indigo" },
        { label: "Access", value: "Reserve Required", color: "emerald" }
      ],
      suggestedQuestions: [
        "มีเวิร์กช็อป Canva หรือ Microsoft Copilot ไหม?",
        "เวิร์กช็อปทั้งหมดมีกี่รายการ?",
        "งานจัดที่ศูนย์การประชุมแห่งชาติสิริกิติ์ห้องไหนบ้าง?"
      ]
    };
  }

  // 4. Techsauce Awards questions
  if (q.includes('award') || q.includes('รางวัล') || q.includes('saucest') || q.includes('etda') || q.includes('governance')) {
    return {
      headlineTh: "ข้อมูลงานประกาศรางวัล Techsauce Awards 2026",
      headlineEn: "Techsauce Awards 2026 Details & Categories",
      answerTh: "งานประกาศรางวัล **Techsauce Awards 2026** จัดขึ้นภายใต้ธีม *“Set New Standards in The Race to The Next”* มีทั้งหมด 6 หมวดรางวัลใหญ่ รวม 18 รางวัล โดยจะมีพิธีมอบรางวัลในวันที่ **27 สิงหาคม 2026 ณ Main Stadium ศูนย์การประชุมแห่งชาติสิริกิติ์ (QSNCC)** โดยมีหมวดสำคัญอย่าง **AI Transformation** (ร่วมกับ ETDA), People, Technology, ESG Impact, Entrepreneur และ Ecosystem Catalyst ครับ",
      answerEn: "**Techsauce Awards 2026** honors standard-setting pioneers under the theme *“Set New Standards in The Race to The Next”* across 6 major categories on **August 27, 2026 at the Main Stadium (QSNCC)**.",
      categoryTag: "Techsauce Awards 2026",
      sourceConfidence: "100% Verified Structured Data",
      matchedWorkshops: [],
      matchedExhibitors: [],
      matchedAwards: [
        { category: "AI Transformation", award: "The Saucest AI-Driven Company" },
        { category: "AI Transformation", award: "The Saucest AI Governance Leadership Award by ETDA" }
      ],
      keyBadges: [
        { label: "Ceremony Date", value: "27 August 2026", color: "amber" },
        { label: "Venue", value: "Main Stadium (QSNCC)", color: "indigo" },
        { label: "Categories", value: "6 Categories / 18 Honors", color: "emerald" }
      ],
      suggestedQuestions: [
        "หมวดรางวัล Technology มีรางวัลอะไรบ้าง?",
        "งานจัดวันที่เท่าไหร่?",
        "บูธ BOTNOI อยู่ที่ไหน?"
      ]
    };
  }

  // 5. Date / Venue / Location questions
  if (q.includes('วันไหน') || q.includes('เมื่อไหร่') || q.includes('ที่ไหน') || q.includes('date') || q.includes('venue') || q.includes('location') || q.includes('qsncc') || q.includes('สิริกิติ์')) {
    return {
      headlineTh: "วันเวลาและสถานที่จัดงาน Techsauce Global Summit 2026",
      headlineEn: "Techsauce Global Summit 2026 Dates & Venue",
      answerTh: "งาน **Techsauce Global Summit 2026** จัดขึ้นระหว่างวันที่ **26 – 28 สิงหาคม 2026** ณ **ศูนย์การประชุมแห่งชาติสิริกิติ์ (QSNCC)** กรุงเทพฯ โดยมีทั้ง Main Stage, Exhibition Zone (215+ บูธ), Workshop Room A & B (15 เวิร์กช็อป) และเวที Techsauce Awards 2026 ในวันที่ 27 ส.ค.",
      answerEn: "**Techsauce Global Summit 2026** takes place from **26 to 28 August 2026** at the **Queen Sirikit National Convention Center (QSNCC)** in Bangkok, Thailand.",
      categoryTag: "Event Dates & Venue Logistics",
      sourceConfidence: "100% Verified Structured Data",
      matchedWorkshops: [],
      matchedExhibitors: [],
      matchedAwards: [],
      keyBadges: [
        { label: "Dates", value: "26 - 28 August 2026", color: "indigo" },
        { label: "Venue", value: "QSNCC Bangkok", color: "cyan" },
        { label: "Scale", value: "215 Exhibitors & 15 Workshops", color: "emerald" }
      ],
      suggestedQuestions: [
        "บูธ BOTNOI GROUP อยู่ตรงไหน?",
        "มีเวิร์กช็อปอะไรน่าสนใจบ้าง?",
        "เวิร์กช็อปของ OpenAI จัดวันไหน?"
      ]
    };
  }

  // 6. Generic search matching exhibitors, workshops, awards
  if (search.exhibitors.length > 0 || search.workshops.length > 0 || search.awards.length > 0) {
    const exhibitorNames = search.exhibitors.slice(0, 3).map(e => `${e.company} (${e.booth ? `Booth ${e.booth}` : 'Booth Not shown'})`).join(', ');
    const workshopTitles = search.workshops.slice(0, 2).map(w => `“${w.title}” (${w.date} ${w.time})`).join(', ');

    let summaryTh = `พบข้อมูลที่เกี่ยวข้องกับ **"${question}"** ในระบบฐานข้อมูลของงาน:`;
    if (search.exhibitors.length > 0) {
      summaryTh += `\n• **บูธผู้จัดแสดง:** ${exhibitorNames}`;
    }
    if (search.workshops.length > 0) {
      summaryTh += `\n• **เวิร์กช็อป:** ${workshopTitles}`;
    }
    if (search.awards.length > 0) {
      summaryTh += `\n• **รางวัล:** ${search.awards.slice(0, 2).map(a => a.award).join(', ')}`;
    }

    return {
      headlineTh: `ผลการค้นหาข้อมูล: "${question}"`,
      headlineEn: `Knowledge Base Match for: "${question}"`,
      answerTh: summaryTh,
      answerEn: `Found ${search.workshops.length} workshops, ${search.exhibitors.length} exhibitors, and ${search.awards.length} awards matching your query.`,
      categoryTag: "Live Knowledge Base Search",
      sourceConfidence: "100% Verified Structured Data",
      matchedWorkshops: search.workshops,
      matchedExhibitors: search.exhibitors,
      matchedAwards: search.awards,
      keyBadges: [
        { label: "Workshops Matched", value: `${search.workshops.length} sessions`, color: "indigo" },
        { label: "Exhibitors Matched", value: `${search.exhibitors.length} booths`, color: "cyan" },
      ],
      suggestedQuestions: [
        "บูธ BOTNOI อยู่ที่ไหน?",
        "เวิร์กช็อป OpenAI จัดวันไหน?",
        "ดูรายการเวิร์กช็อปทั้งหมด"
      ]
    };
  }

  // 7. Fallback for un-matched question
  return {
    headlineTh: `คำตอบสำหรับ: "${question}"`,
    headlineEn: `Event AI Answer: "${question}"`,
    answerTh: `งาน Techsauce Global Summit 2026 (26-28 ส.ค. 2026 ณ QSNCC) ประกอบด้วย 15 เวิร์กช็อปชั้นนำ, 215 ผู้จัดแสดงเทคโนโลยี และ 18 รางวัลเกียรติยศ คุณสามารถค้นหาเลขบูธ, ชื่อวิทยากร หรือหัวข้อสัมมนาได้โดยตรงครับ`,
    answerEn: `Techsauce Global Summit 2026 (26-28 August 2026 at QSNCC) features 15 workshops, 215 exhibitors, and 18 awards. You can search any booth number, speaker name, or topic.`,
    categoryTag: "Event AI Concierge",
    sourceConfidence: "Curated Knowledge Base",
    matchedWorkshops: techsauceData.workshops.slice(0, 2),
    matchedExhibitors: techsauceData.exhibitors.slice(0, 2),
    matchedAwards: [],
    keyBadges: [
      { label: "Event", value: "Techsauce 2026", color: "indigo" },
      { label: "Total Exhibitors", value: "215 Booths", color: "cyan" },
    ],
    suggestedQuestions: [
      "บูธ BOTNOI GROUP อยู่ตรงไหน?",
      "เวิร์กช็อปของ OpenAI จัดวันไหน?",
      "รางวัล AI Transformation มีอะไรบ้าง?"
    ]
  };
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
