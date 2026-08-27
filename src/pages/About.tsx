import { Link } from 'react-router-dom';
import { motion, useScroll, useSpring, AnimatePresence, type Variants } from 'framer-motion';
import { useRef, useState, useEffect, useCallback } from 'react';
import logoNewLightBlue from '../assets/logo-new-light-blue-02.png';
import {
  Brain,
  Lightbulb,
  ArrowRight,
  Compass,
  Coins,
  ShieldCheck,
  Headphones,
  CalendarCheck,
  Stethoscope,
  UtensilsCrossed,
  Hotel,
  CheckCircle2,
  Sparkles,
  Bot,
  PhoneCall,
  Mic,
  Languages,
  UserCheck,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useTranslation } from '../lib/LanguageContext';
import AnimatedSection from '../components/AnimatedSection';
import AppFooter from '../components/AppFooter';
import './Pages.css';

interface ProductItem {
  id: string;
  name: string;
  industry: string;
  tagColor: string;
  icon: React.ReactNode;
  desc: string;
  features: string[];
  link: string;
}

interface TimelineMilestone {
  year: string;
  titleKey: string;
  descKey: string;
}

function About() {
  const timelineRef = useRef<HTMLDivElement>(null);
  const { t, language } = useTranslation();

  // ═══════════════════════════════════════════════════
  // AUTO-ROTATING CLOCKWISE PRESET STATE FOR THE EXPERTISE GAP
  // ═══════════════════════════════════════════════════
  const [activePresetIndex, setActivePresetIndex] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isPurposeHeld, setIsPurposeHeld] = useState<boolean>(false);
  const [activeTeamCard, setActiveTeamCard] = useState<string | null>(null);

  // ═══════════════════════════════════════════════════
  // OUR PRODUCTS CAROUSEL (SMOOTH TRANSFORM + MIDDLE CARD HIGHLIGHT + CLICK-TO-SCROLL)
  // ═══════════════════════════════════════════════════
  const [activeProductIndex, setActiveProductIndex] = useState<number>(0);
  const [visibleProductsCount, setVisibleProductsCount] = useState<number>(3);
  const [isAutoScrolling, setIsAutoScrolling] = useState<boolean>(true);
  const [isProductHovered, setIsProductHovered] = useState<boolean>(false);
  const touchStartX = useRef<number | null>(null);
  const holdTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Responsive visible count
  useEffect(() => {
    const handleResize = () => {
      if (typeof window !== 'undefined') {
        if (window.innerWidth < 680) {
          setVisibleProductsCount(1);
        } else if (window.innerWidth < 1024) {
          setVisibleProductsCount(2);
        } else {
          setVisibleProductsCount(3);
        }
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Stop auto-scrolling permanently on any user or widget interaction
  const stopAutoScroll = useCallback(() => {
    setIsAutoScrolling(false);
  }, []);

  // Auto-slide every 3.8 seconds until user or widget interacts
  useEffect(() => {
    if (!isAutoScrolling || isProductHovered) return;

    const interval = setInterval(() => {
      setActiveProductIndex((prev) => (prev + 1) % 12);
    }, 3800);

    return () => clearInterval(interval);
  }, [isAutoScrolling, isProductHovered]);

  // Calculate the track slide position based on activeProductIndex:
  // - On 3-card view (desktop):
  //   - Card 0: slide 0 (window [0, 1, 2], card 0 highlighted)
  //   - Card 1: slide 0 (window [0, 1, 2], card 1 in middle highlighted)
  //   - Card 2..9: slide 1..8 (card in middle highlighted)
  //   - Card 10: slide 9 (window [9, 10, 11], card 10 in middle highlighted)
  //   - Card 11: slide 9 (window [9, 10, 11], card 11 highlighted)
  const maxSlide = Math.max(0, 12 - visibleProductsCount);
  const currentProductSlide = (() => {
    if (visibleProductsCount >= 3) {
      if (activeProductIndex === 0) return 0;
      if (activeProductIndex >= 11) return maxSlide;
      return Math.min(maxSlide, Math.max(0, activeProductIndex - 1));
    } else {
      return Math.min(maxSlide, activeProductIndex);
    }
  })();

  // Click any card to select & smoothly scroll/center it into view
  const handleCardClick = (idx: number, e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('a')) {
      stopAutoScroll();
      return;
    }
    stopAutoScroll();
    setActiveProductIndex(idx);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;

    if (Math.abs(deltaX) > 40) {
      stopAutoScroll();
      if (deltaX < 0) {
        setActiveProductIndex((prev) => (prev + 1) % 12);
      } else {
        setActiveProductIndex((prev) => (prev - 1 + 12) % 12);
      }
    }
  };

  const handlePurposeHoldStart = () => {
    if (holdTimerRef.current) {
      clearTimeout(holdTimerRef.current);
      holdTimerRef.current = null;
    }
    setIsPurposeHeld(true);
  };

  const handlePurposeHoldEnd = () => {
    if (holdTimerRef.current) {
      clearTimeout(holdTimerRef.current);
    }
    holdTimerRef.current = setTimeout(() => {
      setIsPurposeHeld(false);
      holdTimerRef.current = null;
    }, 3000); // 3-second delay before sliding back
  };

  useEffect(() => {
    return () => {
      if (holdTimerRef.current) {
        clearTimeout(holdTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setActivePresetIndex((prev) => (prev + 1) % 4);
    }, 6800); // 6.8s leisurely interval
    return () => clearInterval(interval);
  }, [isPaused]);

  // Scroll tracking for Journey timeline tube
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ['start center', 'end center'],
  });

  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const renderTimelineDesc = (text: string, dotColor?: string) => {
    if (!text) return null;
    const lines = text
      .split('\n')
      .map((line) => line.replace(/^[•\-\*]\s*/, '').trim())
      .filter(Boolean);

    if (lines.length > 1) {
      return (
        <ul className="timeline-bullet-list">
          {lines.map((item, idx) => (
            <li key={idx}>
              <span
                className="timeline-bullet-dot"
                style={dotColor ? { background: dotColor, boxShadow: `0 0 6px ${dotColor}` } : undefined}
              />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      );
    }

    return <p>{text}</p>;
  };

  // ═══════════════════════════════════════════════════
  // 4 EXPERTISE GAP PILLARS (DYNAMIC REVOLVING ITEMS)
  // Preset 0: Slot A=Knowledge, Slot B=24/7 Service, Slot C=Lower Cost, Slot D=Accelerate
  // ═══════════════════════════════════════════════════
  const pillarKnowledge = {
    id: 'scale',
    title: t('about.pillar1_title'),
    tag: language === 'th' ? 'ขยายความเชี่ยวชาญ' : 'SCALE EXPERTISE',
    icon: <Brain size={21} className="icon-anim-nlp" />,
    color: 'var(--primary)',
    desc: t('about.pillar1_desc'),
  };

  const pillarService = {
    id: 'voice',
    title: t('about.pillar2_title'),
    tag: language === 'th' ? 'บริการ 24/7' : '24/7 SERVICE',
    icon: (
      <svg
        width="21"
        height="21"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="icon-anim-clock"
      >
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" className="clock-rotating-hands" />
      </svg>
    ),
    color: 'var(--cta)',
    desc: t('about.pillar2_desc'),
  };

  const pillarInnovation = {
    id: 'agent',
    title: t('about.pillar3_title'),
    tag: language === 'th' ? 'นวัตกรรม' : 'INNOVATION',
    icon: <Lightbulb size={21} className="icon-anim-lightbulb" />,
    color: '#A855F7',
    desc: t('about.pillar3_desc'),
  };

  const pillarEfficiency = {
    id: 'dom',
    title: t('about.pillar4_title'),
    tag: language === 'th' ? 'ประสิทธิภาพสูง' : 'HIGH EFFICIENCY',
    icon: (
      <svg
        width="21"
        height="21"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="icon-anim-graph-draw"
      >
        <polyline points="22 17 13.5 8.5 8.5 13.5 2 7" className="graph-draw-stroke" />
        <polyline points="16 17 22 17 22 11" className="graph-draw-head" />
      </svg>
    ),
    color: '#10B981',
    desc: t('about.pillar4_desc'),
  };

  const getSlotAItem = (index: number) => {
    switch (index) {
      case 0: return pillarKnowledge;
      case 1: return pillarEfficiency;
      case 2: return pillarInnovation;
      case 3: default: return pillarService;
    }
  };

  const getSlotBItem = (index: number) => {
    switch (index) {
      case 0: return pillarService;
      case 1: return pillarKnowledge;
      case 2: return pillarEfficiency;
      case 3: default: return pillarInnovation;
    }
  };

  const getSlotCItem = (index: number) => {
    switch (index) {
      case 0: return pillarEfficiency;
      case 1: return pillarInnovation;
      case 2: return pillarService;
      case 3: default: return pillarKnowledge;
    }
  };

  const getSlotDItem = (index: number) => {
    switch (index) {
      case 0: return pillarInnovation;
      case 1: return pillarService;
      case 2: return pillarKnowledge;
      case 3: default: return pillarEfficiency;
    }
  };

  const slotAItem = getSlotAItem(activePresetIndex);
  const slotBItem = getSlotBItem(activePresetIndex);
  const slotCItem = getSlotCItem(activePresetIndex);
  const slotDItem = getSlotDItem(activePresetIndex);

  const easeCurve: [number, number, number, number] = [0.16, 1, 0.3, 1];

  const slideVariants: Record<string, Variants> = {
    slotA: {
      initial: { opacity: 0, x: -20 },
      animate: { opacity: 1, x: 0, transition: { duration: 0.3, ease: easeCurve } },
      exit: { opacity: 0, x: 20, transition: { duration: 0.15, ease: 'easeOut' } }
    },
    slotB: {
      initial: { opacity: 0, y: -20 },
      animate: { opacity: 1, y: 0, transition: { duration: 0.3, ease: easeCurve } },
      exit: { opacity: 0, y: 20, transition: { duration: 0.15, ease: 'easeOut' } }
    },
    slotC: {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0, transition: { duration: 0.3, ease: easeCurve } },
      exit: { opacity: 0, y: -20, transition: { duration: 0.15, ease: 'easeOut' } }
    },
    slotD: {
      initial: { opacity: 0, x: 20 },
      animate: { opacity: 1, x: 0, transition: { duration: 0.3, ease: easeCurve } },
      exit: { opacity: 0, x: -20, transition: { duration: 0.15, ease: 'easeOut' } }
    }
  };

  // Enterprise Products (Solution By Industry - Full 12 Products)
  const products: ProductItem[] = [
    {
      id: 'agent-builder',
      name: 'AI Agent Builder Platform',
      industry: language === 'th' ? 'การสร้าง AI Agent & ระบบอัตโนมัติ' : 'AI Agents & Automation',
      tagColor: '#0284C7',
      icon: <Bot size={26} />,
      desc: language === 'th'
        ? 'แพลตฟอร์มสร้าง AI Agent สำหรับงานบริการลูกค้าและระบบอัตโนมัติของธุรกิจ'
        : 'A platform to build AI agents for customer service and business automation.',
      features: language === 'th'
        ? [
            'เชื่อมต่อทุกช่องทางได้ในคลิกเดียว',
            'ได้รับความไว้วางใจจาก 100+ องค์กร & 10,000+ SMEs',
            'รองรับ Private Cloud & On-Premise',
            'เครื่องยนต์ Hybrid AI + Rule-based'
          ]
        : [
            'One-click Channel Integration',
            'Trusted by 100+ Enterprises & 10,000+ SMEs',
            'Private Cloud & On-Premise Deployment',
            'Hybrid AI + Rule-based Engine'
          ],
      link: 'https://botnoi.ai'
    },
    {
      id: 'voicebot',
      name: 'AI Voicebot',
      industry: language === 'th' ? 'โทรศัพท์เสียง AI ระดับองค์กร' : 'Enterprise Voicebot',
      tagColor: '#2563EB',
      icon: <PhoneCall size={26} />,
      desc: language === 'th'
        ? 'แพลตฟอร์มเสียง AI ระดับองค์กรสำหรับการโต้ตอบทางโทรศัพท์อัตโนมัติ'
        : 'Enterprise AI voice platform for automated phone interactions.',
      features: language === 'th'
        ? [
            'สนทนาด้วยเสียง AI เสมือนมนุษย์จริง',
            'เชื่อมต่อระบบโทรศัพท์ระดับองค์กร',
            'รองรับการสื่อสารหลายภาษา',
            'รองรับ Private Cloud & On-Premise'
          ]
        : [
            'Human-like AI Voice Conversations',
            'Enterprise Telephony Integration',
            'Multi-language Support',
            'Private Cloud & On-Premise Deployment'
          ],
      link: 'https://voicebot-stg.botnoigroup.com'
    },
    {
      id: 'botnoi-voice',
      name: 'Botnoi Voice',
      industry: language === 'th' ? 'เสียงสังเคราะห์ AI & การโคลนเสียง' : 'AI Speech & Voice Cloning',
      tagColor: '#38BDF8',
      icon: <Mic size={26} />,
      desc: language === 'th'
        ? 'แพลตฟอร์มเสียง AI สำหรับสร้างเสียงพูดเสมือนจริงและแอปพลิเคชันเสียง'
        : 'AI voice platform for lifelike speech generation and voice applications.',
      features: language === 'th'
        ? [
            'เทคโนโลยีการโคลนนิ่งเสียงสมจริง',
            'รองรับหลากหลายภาษาและเสียงพูด',
            'เชื่อมต่อด้วย API & SDK ยืดหยุ่น',
            'พร้อมสำหรับการติดตั้งระดับองค์กร'
          ]
        : [
            'Voice Cloning Technology',
            'Multi-language & Voice Support',
            'Flexible API & SDK Integration',
            'Enterprise-ready Deployment'
          ],
      link: 'https://voice.botnoi.ai'
    },
    {
      id: 'live-translation',
      name: 'Botnoi Live Translation',
      industry: language === 'th' ? 'การแปลภาษาเรียลไทม์ & การประชุม' : 'Real-time AI Translation',
      tagColor: '#0EA5E9',
      icon: <Languages size={26} />,
      desc: language === 'th'
        ? 'ระบบแปลภาษา AI แบบเรียลไทม์สำหรับการประชุม กิจกรรม และการสื่อสารสากล'
        : 'Real-time AI translation for meetings, events, and global communication.',
      features: language === 'th'
        ? [
            'แปลเสียงพูดสดแบบเรียลไทม์',
            'ล่าม AI แปลภาษาได้หลากหลาย',
            'ประมวลผลความหน่วงต่ำ (Low-latency)',
            'รองรับ Private Cloud & On-Premise'
          ]
        : [
            'Real-time Speech Translation',
            'Multi-language AI Interpretation',
            'Low-latency AI Processing',
            'Private Cloud & On-Premise Deployment'
          ],
      link: 'https://botnoi.live'
    },
    {
      id: 'ai-avatar',
      name: 'AI Avatar',
      industry: language === 'th' ? 'มนุษย์เสมือน 3D & ดิจิทัลอินเตอร์แอคทีฟ' : 'Interactive Digital Humans',
      tagColor: '#6366F1',
      icon: <UserCheck size={26} />,
      desc: language === 'th'
        ? 'สร้างอวตาร AI เสมือนจริงเพื่อประสบการณ์ดิจิทัลที่โต้ตอบได้'
        : 'Create lifelike AI avatars for interactive digital experiences.',
      features: language === 'th'
        ? [
            'การแสดงสีหน้าและอารมณ์เสมือนจริง',
            'แอนิเมชันขยับปากตรงตามเสียง (Lip Sync)',
            'ปรับแต่งมนุษย์ดิจิทัลเฉพาะบุคคล',
            'รองรับเว็บไซต์ คีออสก์ และจอแสดงผล'
          ]
        : [
            'Realistic Facial Expressions',
            'Voice & Lip Sync Animation',
            'Personalized Digital Humans',
            'Website, Kiosk & Digital Display Support'
          ],
      link: 'https://navigation-test-webavatar.vercel.app'
    },
    {
      id: 'collecto',
      name: 'Collecto',
      industry: language === 'th' ? 'การเงิน & การติดตามหนี้' : 'Finance & Debt Recovery',
      tagColor: '#0284C7',
      icon: <Coins size={26} />,
      desc: language === 'th'
        ? 'แพลตฟอร์ม AI อัจฉริยะสำหรับงานบริหารและติดตามทวงถามหนี้แบบครบวงจร'
        : 'AI-powered platform for intelligent debt collection and recovery.',
      features: language === 'th'
        ? [
            'ระบบติดตามหนี้ขับเคลื่อนด้วย AI',
            'เวิร์กโฟลว์การติดตามหนี้อัจฉริยะ',
            'แดชบอร์ดวิเคราะห์ผลแบบเรียลไทม์',
            'ระบบโทรติดต่ออัตโนมัติปริมาณสูง'
          ]
        : [
            'AI-powered Debt Collection',
            'Intelligent Collection Workflows',
            'Real-time Analytics Dashboard',
            'High-volume Call Automation'
          ],
      link: 'https://collexaknock.lovable.app'
    },
    {
      id: 'colinsight',
      name: 'Colinsight',
      industry: language === 'th' ? 'การตรวจสอบคุณภาพ & ความสอดคล้อง' : 'Quality Assurance & Compliance',
      tagColor: '#4F46E5',
      icon: <ShieldCheck size={26} />,
      desc: language === 'th'
        ? 'แพลตฟอร์ม SaaS ระดับสากลสำหรับตรวจสอบคุณภาพและควบคุมมาตรฐานการทำงานด้วย AI'
        : 'Global SaaS platform for AI-powered collection quality assurance.',
      features: language === 'th'
        ? [
            'ถอดเสียงและให้คะแนนการสนทนาด้วย AI',
            'ประเมินคุณภาพตามนโยบายองค์กร',
            'รองรับการทำงานร่วมกันหลายภาษา',
            'รายงานความสอดคล้องพร้อมตรวจสอบ Audit'
          ]
        : [
            'AI Call Transcription & Scoring',
            'Policy-driven Quality Reviews',
            'Multilingual Team Collaboration',
            'Audit-ready Compliance Reports'
          ],
      link: 'https://colinsight.com'
    },
    {
      id: 'gogo-service',
      name: 'Gogo Service',
      industry: language === 'th' ? 'บริการลูกค้าทุกช่องทาง (Omnichannel)' : 'Omnichannel Customer Service',
      tagColor: '#06B6D4',
      icon: <Headphones size={26} />,
      desc: language === 'th'
        ? 'แพลตฟอร์มบริการลูกค้าด้วย AI สำหรับธุรกิจทุกขนาด'
        : 'AI customer service platform for businesses of all sizes.',
      features: language === 'th'
        ? [
            'เทมเพลตบริการลูกค้า AI พร้อมใช้งาน',
            'ดูแลลูกค้าครอบคลุมทุกช่องทาง',
            'เชื่อมต่อระบบคำสั่งซื้อและ CRM',
            'จัดการง่ายโดยไม่ต้องเขียนโค้ด (No-code)'
          ]
        : [
            'Ready-to-use AI Service Templates',
            'Omnichannel Customer Support',
            'Order & CRM Integration',
            'Easy No-code Management'
          ],
      link: 'https://gogoservicegroup.lovable.app'
    },
    {
      id: 'staff-scheduling',
      name: 'Smart Staff Scheduling',
      industry: language === 'th' ? 'การแพทย์ & จัดตารางเวรบุคลากร' : 'Healthcare & Hospital Workforce',
      tagColor: '#0D9488',
      icon: <CalendarCheck size={26} />,
      desc: language === 'th'
        ? 'ระบบจัดตารางเวรและบริหารกำลังคนอัจฉริยะสำหรับโรงพยาบาลและทีมสาธารณสุข'
        : 'AI-powered workforce scheduling for hospitals and healthcare teams.',
      features: language === 'th'
        ? [
            'จัดตารางเวรทำงานอัตโนมัติด้วย AI',
            'ระบบแลกเวรด้วยตนเองผ่านมือถือ',
            'กำหนดกฎการจัดเวรตามแผนก',
            'จัดการตารางงานบุคลากรผ่านสมาร์ทโฟน'
          ]
        : [
            'Intelligent Shift Scheduling',
            'Self-service Shift Exchange',
            'Department-based Scheduling Rules',
            'Mobile Staff Management'
          ],
      link: 'https://hospital-solution.lovable.app/shift-scheduling'
    },
    {
      id: 'vela',
      name: 'Vela',
      industry: language === 'th' ? 'การแพทย์ & บริหารคลินิกอัจฉริยะ' : 'Healthcare & Clinic Management',
      tagColor: '#3B82F6',
      icon: <Stethoscope size={26} />,
      desc: language === 'th'
        ? 'แพลตฟอร์มบริหารจัดการคลินิกอัจฉริยะ พร้อมระบบสื่อสารและดูแลคนไข้แบบอัตโนมัติ'
        : 'AI-powered clinic management platform with automated patient engagement.',
      features: language === 'th'
        ? [
            'บริหารจัดการคลินิกครบวงจร',
            'โทรติดตามคนไข้อัตโนมัติด้วย AI',
            'ระบบนัดหมายและจัดการคิวเข้ารับบริการ',
            'ระบบต้อนรับและเวิร์กโฟลว์อัตโนมัติ'
          ]
        : [
            'End-to-end Clinic Management',
            'AI-powered Patient Calls',
            'Appointment & Queue Management',
            'Reception & Workflow Automation'
          ],
      link: 'https://hospital-solution.lovable.app/vela'
    },
    {
      id: 'botnoikitchen',
      name: 'Botnoikitchen',
      industry: language === 'th' ? 'ร้านอาหาร & ธุรกิจ F&B' : 'F&B & Restaurant Operations',
      tagColor: '#0284C7',
      icon: <UtensilsCrossed size={26} />,
      desc: language === 'th'
        ? 'แพลตฟอร์ม AI สำหรับบริหารจัดการร้านอาหารและบริการลูกค้าหน้าร้าน'
        : 'AI-powered platform for restaurant service and operations.',
      features: language === 'th'
        ? [
            'ระบบสั่งอาหารและผู้ช่วย AI หน้าร้าน',
            'แนะนำเมนูอาหารอัจฉริยะตามความชอบ',
            'จัดการออเดอร์และเชื่อมต่อห้องครัว',
            'ติดตามสถานะออเดอร์แบบเรียลไทม์'
          ]
        : [
            'AI Ordering & Customer Assistance',
            'Smart Menu Recommendations',
            'Kitchen & Order Management',
            'Real-time Order Tracking'
          ],
      link: 'https://botnoikitchen.lovable.app'
    },
    {
      id: 'bokari',
      name: 'Bokari',
      industry: language === 'th' ? 'การโรงแรม & การจองที่พัก' : 'Hospitality & Hotel Bookings',
      tagColor: '#6366F1',
      icon: <Hotel size={26} />,
      desc: language === 'th'
        ? 'แพลตฟอร์ม AI สำหรับธุรกิจโรงแรมและที่พัก ดูแลการสื่อสารและการจองห้องพักอัตโนมัติ'
        : 'AI-powered hospitality platform for automated guest communication and bookings.',
      features: language === 'th'
        ? [
            'Voicebot & Chatbot ต้อนรับแขก 24/7',
            'ระบบจองห้องพักอัตโนมัติครบวงจร',
            'เชื่อมต่อระบบโรงแรม (PMS) เรียลไทม์',
            'รองรับมากกว่า 40 ภาษาทั่วโลก'
          ]
        : [
            '24/7 AI Voicebot & Chatbot',
            'End-to-end Booking Automation',
            'Real-time PMS Integration',
            '40+ Language Support'
          ],
      link: 'https://bokariproject.vercel.app'
    }
  ];

  // Timeline Milestones (2016 - 2027) - Matching AboutOld.tsx format
  const timelineMilestones: TimelineMilestone[] = [
    {
      year: '2016',
      titleKey: 'about.t_2016_title',
      descKey: 'about.t_2016_desc',
    },
    {
      year: '2017',
      titleKey: 'about.t_2017_title',
      descKey: 'about.t_2017_desc',
    },
    {
      year: '2018',
      titleKey: 'about.t_2018_title',
      descKey: 'about.t_2018_desc',
    },
    {
      year: '2023',
      titleKey: 'about.t_2023_title',
      descKey: 'about.t_2023_desc',
    },
    {
      year: '2024',
      titleKey: 'about.t_2024_title',
      descKey: 'about.t_2024_desc',
    },
    {
      year: '2025',
      titleKey: 'about.t_2025_title',
      descKey: 'about.t_2025_desc',
    },
    {
      year: '2026',
      titleKey: 'about.t_2026_title',
      descKey: 'about.t_2026_desc',
    },
    {
      year: '2027',
      titleKey: 'about.t_2027_title',
      descKey: 'about.t_2027_desc',
    }
  ];

  return (
    <div className="about3-page-wrapper">
      <div className="about3-container">

        {/* ══════════════════════════════════════════════════════════
            AI AVATAR WIDGET INTERACTION DIRECTIVES & CONTEXT
            (Hidden assistive context scanned by DomScanner & Gemini Live Tools)
        ══════════════════════════════════════════════════════════ */}
        <div
          id="ai-about-page-guidance"
          role="note"
          aria-hidden="false"
          className="techsauce-ai-context-instructions"
          style={{
            position: 'absolute',
            width: '1px',
            height: '1px',
            padding: 0,
            margin: '-1px',
            overflow: 'hidden',
            clip: 'rect(0, 0, 0, 0)',
            whiteSpace: 'normal',
            border: 0,
            opacity: 0.01,
            pointerEvents: 'none',
          }}
        >
          AI Avatar Assistant Directives:
          1. When discussing Botnoi's products or solutions (AI Agent Builder, AI Voicebot, Botnoi Voice, Botnoi Live Translation, AI Avatar, Collecto, Colinsight, Gogo Service, Smart Staff Scheduling, Vela, Botnoikitchen, Bokari), use scan_section on #products-catalog and smoothly scroll/highlight the specific card (#product-agent-builder, #product-voicebot, #product-botnoi-voice, #product-live-translation, #product-ai-avatar, #product-collecto, #product-colinsight, #product-gogo-service, #product-staff-scheduling, #product-vela, #product-botnoikitchen, #product-bokari).
          2. To navigate the product carousel, target #btn-product-prev, #btn-product-next, or #product-dot-0 through #product-dot-11.
          3. For company history, refer to #company-history with milestones #history-2016 through #history-2027.
          4. For core expertise pillars, inspect #expertise-gap (Slot A: Knowledge, Slot B: 24/7 Service, Slot C: Efficiency, Slot D: Innovation).
        </div>

        {/* ══════════════════════════════════════════════════════════
            1. HERO SECTION: WHO WE ARE & UNIFIED INTRO / VISION / MISSION CARD
        ══════════════════════════════════════════════════════════ */}
        <section className="about3-hero-section" id="who-we-are" aria-label="Who We Are">
          {/* Background Typography Watermark: WHO, WE, ARE with Hold-to-Slide Animation */}
          <div className={`about-hero-bg-text-wrap ${isPurposeHeld ? 'is-active' : ''}`} aria-hidden="true">
            <span className="bg-text-item bg-text-who">WHO</span>
            <span className="bg-text-item bg-text-we">WE</span>
            <span className="bg-text-item bg-text-are">ARE</span>
          </div>

          <AnimatedSection direction="up" duration={0.8} className="about3-hero-centered-box">
            <div className="about-pill-badge">
              <span className="about-pill-dot" />
              <span>{t('about.badge')}</span>
            </div>

            <h1 className="about3-hero-headline">
              {t('about.title')}
            </h1>
          </AnimatedSection>

          {/* Master Unified Container Card (Enclosing Intro text, Vision & Mission like AboutOld) */}
          <AnimatedSection direction="up" duration={0.8} delay={0.075}>
            <div
              className="about3-mission-pill-card about-intro-unified-card"
              onMouseEnter={handlePurposeHoldStart}
              onMouseLeave={handlePurposeHoldEnd}
              onMouseDown={handlePurposeHoldStart}
              onMouseUp={handlePurposeHoldEnd}
              onTouchStart={handlePurposeHoldStart}
              onTouchEnd={handlePurposeHoldEnd}
            >
              {/* Web Logo Header without background box */}
              <div className="about3-section-badge-row">
                <img src={logoNewLightBlue} alt="Botnoi Web Logo" className="about-purpose-logo-img" />
                <h2>{t('about.purpose_title')}</h2>
              </div>

              <div className="about3-mission-body-content">
                <p className="about3-lead-text">{t('about.intro_lead')}</p>
                <p className="about3-sub-text">{t('about.intro_sub')}</p>

                {/* Vision Box Inside Pill Card */}
                <div className="about3-vision-callout-box">
                  <div className="about3-callout-icon">
                    <Sparkles size={18} color="var(--primary)" />
                  </div>
                  <div>
                    <h4>{t('about.vision_title')}</h4>
                    <p>{t('about.vision_desc')}</p>
                  </div>
                </div>

                {/* Mission Box Inside Pill Card with Compass icon */}
                <div className="about3-vision-callout-box" style={{ marginTop: '1rem' }}>
                  <div className="about3-callout-icon">
                    <Compass size={18} color="var(--primary)" />
                  </div>
                  <div>
                    <h4>{t('about.mission_title')}</h4>
                    <p>{t('about.mission_desc')}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Button moved below the Master Card with generous spacing */}
            <div className="about3-hero-cta-wrap" style={{ marginTop: '3.75rem' }}>
              <Link to="/contact" className="about3-hero-cta-btn" id="about-hero-cta">
                <span>{t('about.vision_cta')}</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </AnimatedSection>
        </section>

        {/* ══════════════════════════════════════════════════════════
            2. SECTION: OUR PERFORMANCE (EXACT IMAGE-STYLE CIRCLES - NO OUTER BOX BACKGROUND)
        ══════════════════════════════════════════════════════════ */}
        <section className="about-performance-section" id="performance" aria-label="Our Performance">
          <AnimatedSection direction="up" duration={0.8} className="about3-section-header-center">
            <h2>{t('about.perf_title')}</h2>
            <p>{t('about.perf_desc')}</p>
          </AnimatedSection>

          <AnimatedSection direction="up" duration={0.8} delay={0.15}>
            {/* 4 Circular Nodes Row directly on page background */}
            <div className="about-performance-circles-row">
              {/* 1. 100+ Enterprise Projects */}
              <div className="perf-circle-item">
                <motion.div
                  className="perf-circle-disc unified-glass-circle"
                  whileHover={{ scale: 1.08 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                >
                  <div className="perf-circle-frame-ring" />
                  <div className="perf-circle-pulse-dash" />
                  <span className="perf-circle-value">{t('about.stat1_num')}</span>
                </motion.div>
                <h4 className="perf-circle-title">{t('about.stat1_title')}</h4>
                <p className="perf-circle-desc">{t('about.stat1_desc')}</p>
              </div>

              {/* 2. 10+ AI Products */}
              <div className="perf-circle-item">
                <motion.div
                  className="perf-circle-disc unified-glass-circle"
                  whileHover={{ scale: 1.08 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                >
                  <div className="perf-circle-frame-ring" />
                  <div className="perf-circle-pulse-dash" />
                  <span className="perf-circle-value">{t('about.stat2_num')}</span>
                </motion.div>
                <h4 className="perf-circle-title">{t('about.stat2_title')}</h4>
                <p className="perf-circle-desc">{t('about.stat2_desc')}</p>
              </div>

              {/* 3. 10M+ End Users */}
              <div className="perf-circle-item">
                <motion.div
                  className="perf-circle-disc unified-glass-circle"
                  whileHover={{ scale: 1.08 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                >
                  <div className="perf-circle-frame-ring" />
                  <div className="perf-circle-pulse-dash" />
                  <span className="perf-circle-value">{t('about.stat3_num')}</span>
                </motion.div>
                <h4 className="perf-circle-title">{t('about.stat3_title')}</h4>
                <p className="perf-circle-desc">{t('about.stat3_desc')}</p>
              </div>

              {/* 4. 20M+ Partner MOUs */}
              <div className="perf-circle-item">
                <motion.div
                  className="perf-circle-disc unified-glass-circle"
                  whileHover={{ scale: 1.08 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                >
                  <div className="perf-circle-frame-ring" />
                  <div className="perf-circle-pulse-dash" />
                  <span className="perf-circle-value">{t('about.stat4_num')}</span>
                </motion.div>
                <h4 className="perf-circle-title">{t('about.stat4_title')}</h4>
                <p className="perf-circle-desc">{t('about.stat4_desc')}</p>
              </div>
            </div>
          </AnimatedSection>
        </section>

        {/* ══════════════════════════════════════════════════════════
            3. SECTION: THE EXPERTISE GAP (4-BOX CLOCKWISE REVOLVING BENTO GRID)
            - Compact, Sleek Height (520px)
            - Full Detail Bullet Points on all 4 cards
            - Clean Slot B without redundant dynamic graphics
        ══════════════════════════════════════════════════════════ */}
        <section
          className="about3-revolving-bento-section"
          id="expertise-gap"
          aria-label="The Expertise Gap Revolving Grid"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <AnimatedSection direction="up" duration={0.8} className="about3-section-header-center">
            <h2>{t('about.gap_title')}</h2>
            <p>{t('about.gap_desc')}</p>
          </AnimatedSection>

          <AnimatedSection direction="up" duration={0.8} delay={0.15}>
            <div className="about3-revolve-grid-container">
              <div className="about3-preset-grid-inner">
                {/* ── LEFT COLUMN ── */}
                <div className="about3-bento-col-left">
                  {/* 1. SLOT A (บนซ้าย): SLIDE ขวา */}
                  <div
                    className={`about3-bento-slot slot-a theme-${slotAItem.id}`}
                    style={{ '--slot-accent': slotAItem.color } as React.CSSProperties}
                  >
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={`slotA-${activePresetIndex}-${slotAItem.id}`}
                        className="about3-slot-inner-card"
                        variants={slideVariants.slotA}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                      >
                        <div className="slot-top-row">
                          <div className="slot-item-icon-wrap" style={{ color: slotAItem.color }}>
                            {slotAItem.icon}
                          </div>
                          <span className="slot-tech-name-pill">
                            {slotAItem.tag}
                          </span>
                        </div>
                        <h3 className="slot-title-compact">{slotAItem.title}</h3>
                        <div className="slot-desc-full">
                          {renderTimelineDesc(slotAItem.desc, slotAItem.color)}
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  </div>

                  {/* 2. SLOT C (ซ้ายล่าง): SLIDE บน */}
                  <div
                    className={`about3-bento-slot slot-c theme-${slotCItem.id}`}
                    style={{ '--slot-accent': slotCItem.color } as React.CSSProperties}
                  >
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={`slotC-${activePresetIndex}-${slotCItem.id}`}
                        className="about3-slot-inner-card"
                        variants={slideVariants.slotC}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                      >
                        <div className="slot-top-row">
                          <div className="slot-item-icon-wrap" style={{ color: slotCItem.color }}>
                            {slotCItem.icon}
                          </div>
                          <span className="slot-tech-name-pill">
                            {slotCItem.tag}
                          </span>
                        </div>
                        <h3>{slotCItem.title}</h3>
                        <div className="slot-desc-pillar">
                          {renderTimelineDesc(slotCItem.desc, slotCItem.color)}
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>

                {/* ── RIGHT COLUMN ── */}
                <div className="about3-bento-col-right">
                  {/* 3. SLOT B (ขวาบน): SLIDE ล่าง (Complete Rich Details) */}
                  <div
                    className={`about3-bento-slot slot-b theme-${slotBItem.id}`}
                    style={{ '--slot-accent': slotBItem.color } as React.CSSProperties}
                  >
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={`slotB-${activePresetIndex}-${slotBItem.id}`}
                        className="about3-slot-inner-card slot-b-hero-card"
                        variants={slideVariants.slotB}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                      >
                        <div className="slot-top-row">
                          <div className="slot-item-icon-wrap" style={{ color: slotBItem.color }}>
                            {slotBItem.icon}
                          </div>
                          <span className="slot-tech-name-pill">
                            {slotBItem.tag}
                          </span>
                        </div>
                        <h3 className="slot-hero-title">{slotBItem.title}</h3>
                        <div className="slot-desc-full">
                          {renderTimelineDesc(slotBItem.desc, slotBItem.color)}
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  </div>

                  {/* 4. SLOT D (ขวาล่าง): SLIDE ซ้าย */}
                  <div
                    className={`about3-bento-slot slot-d theme-${slotDItem.id}`}
                    style={{ '--slot-accent': slotDItem.color } as React.CSSProperties}
                  >
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={`slotD-${activePresetIndex}-${slotDItem.id}`}
                        className="about3-slot-inner-card"
                        variants={slideVariants.slotD}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                      >
                        <div className="slot-top-row">
                          <div className="slot-item-icon-wrap" style={{ color: slotDItem.color }}>
                            {slotDItem.icon}
                          </div>
                          <span className="slot-tech-name-pill">
                            {slotDItem.tag}
                          </span>
                        </div>
                        <h3 className="slot-title-d">{slotDItem.title}</h3>
                        <div className="slot-desc-wide">
                          {renderTimelineDesc(slotDItem.desc, slotDItem.color)}
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </section>

        {/* ══════════════════════════════════════════════════════════
            4. SECTION: OUR JOURNEY (EXACT ABOUTOLD.TSX TIMELINE GRAPHICS)
        ══════════════════════════════════════════════════════════ */}
        <section
          className="section-wrapper relative z-10"
          id="company-history"
          style={{ margin: '4rem auto', maxWidth: '1150px', padding: '0 1.5rem' }}
          aria-label="Company History"
        >
          <AnimatedSection direction="up" duration={0.8}>
            <div className="section-header">
              <h2>{t('about.journey_title')}</h2>
              <p>{t('about.journey_subtitle')}</p>
            </div>
          </AnimatedSection>

          <div className="timeline" ref={timelineRef}>
            {/* Animated line drawing as scroll progresses */}
            <motion.div className="timeline-line-progress" style={{ scaleY, transformOrigin: 'top' }} />

            {timelineMilestones.map((milestone, idx) => (
              <div className="timeline-item" key={milestone.year} id={`history-${milestone.year}`}>
                <AnimatedSection direction="left" duration={0.6} delay={idx * 0.08}>
                  <div className="timeline-dot active" />
                  <div className="timeline-year">{milestone.year}</div>
                  <div className="timeline-panel">
                    <h3>{t(milestone.titleKey)}</h3>
                    {renderTimelineDesc(t(milestone.descKey))}
                  </div>
                </AnimatedSection>
              </div>
            ))}
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════
            5. SECTION: OUR PRODUCTS (SOLUTION BY INDUSTRY - 3 CARDS SLIDER)
        ══════════════════════════════════════════════════════════ */}
        <section className="about-products-section" id="products-catalog" aria-label="Our Products">
          <AnimatedSection direction="up" duration={0.8} className="about3-section-header-center">
            <h2>{t('about.products_title')}</h2>
            <p>{t('about.products_desc')}</p>
          </AnimatedSection>

          {/* Product Carousel Slider Container */}
          <AnimatedSection direction="up" duration={0.8} delay={0.15}>
            <div
              className="products-slider-wrapper"
              onMouseEnter={() => setIsProductHovered(true)}
              onMouseLeave={() => setIsProductHovered(false)}
            >
              {/* Viewport with smooth GPU-accelerated transition */}
              <div
                id="products-carousel-viewport"
                className="products-slider-viewport"
                role="region"
                aria-label="Botnoi AI Products Carousel"
                tabIndex={0}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
                onWheel={() => stopAutoScroll()}
              >
                <div
                  className="products-slider-track"
                  style={{
                    transform: `translateX(calc(-${currentProductSlide} * ((100% + 1.5rem) / ${visibleProductsCount})))`,
                  }}
                >
                  {products.map((product, idx) => {
                    const slotThemeColors = ['#38BDF8', '#0284C7', '#2563EB', '#6366F1'];
                    const cardAccent = slotThemeColors[idx % slotThemeColors.length];
                    const isHighlighted = activeProductIndex === idx;

                    return (
                      <article
                        className={`product-card-modern ${isHighlighted ? 'is-highlighted-card' : ''}`}
                        key={product.id}
                        id={`product-${product.id}`}
                        data-index={idx}
                        onClick={(e) => handleCardClick(idx, e)}
                        role="article"
                        aria-label={`${product.name} — ${product.industry}`}
                        style={{
                          '--prod-accent': cardAccent,
                        } as React.CSSProperties}
                      >
                        {/* Top Row: Icon + Industry Badge */}
                        <div className="product-card-top">
                          <div
                            className="product-icon-box"
                            style={{
                              color: cardAccent,
                              background: `${cardAccent}15`,
                              borderColor: `${cardAccent}35`,
                            }}
                          >
                            {product.icon}
                          </div>
                          <span
                            className="product-industry-badge"
                            style={{
                              color: cardAccent,
                              borderColor: `${cardAccent}35`,
                              background: `${cardAccent}0D`,
                            }}
                          >
                            {product.industry}
                          </span>
                        </div>

                        {/* Product Name & Description */}
                        <div className="product-card-info">
                          <h3 className="product-name-modern">{product.name}</h3>
                          <p className="product-desc-modern">{product.desc}</p>
                        </div>

                        {/* Features List with Checks */}
                        <div className="product-features-modern">
                          <span className="features-label">
                            {language === 'th' ? 'คุณสมบัติเด่น:' : 'Key Capabilities:'}
                          </span>
                          <ul className="features-list-items">
                            {product.features.map((feat, fIdx) => (
                              <li key={fIdx}>
                                <CheckCircle2
                                  size={15}
                                  style={{ color: cardAccent, flexShrink: 0 }}
                                />
                                <span>{feat}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Bottom Action Link */}
                        <div className="product-card-footer">
                          <a
                            id={`btn-visit-${product.id}`}
                            href={product.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="product-action-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              stopAutoScroll();
                            }}
                            style={{
                              '--btn-accent': cardAccent,
                            } as React.CSSProperties}
                            aria-label={`Visit ${product.name} official platform`}
                          >
                            <span>{t('about.prod_visit')}</span>
                            <ArrowRight size={15} className="btn-arrow-icon" />
                          </a>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </div>

              {/* Bottom Pagination & Navigation Controls */}
              <div className="products-controls-row">
                <button
                  id="btn-product-prev"
                  type="button"
                  onClick={() => {
                    stopAutoScroll();
                    setActiveProductIndex((prev) => (prev - 1 + 12) % 12);
                  }}
                  aria-label="Previous Products"
                  className="products-arrow-btn"
                >
                  <ChevronLeft size={18} />
                </button>

                {/* Floating Pagination Dots for all 12 products */}
                <div className="products-clean-dots" role="tablist" aria-label="Product navigation dots">
                  {products.map((product, dotIdx) => (
                    <button
                      key={product.id}
                      id={`product-dot-${dotIdx}`}
                      type="button"
                      role="tab"
                      aria-selected={activeProductIndex === dotIdx}
                      aria-label={`Jump to ${product.name} (${dotIdx + 1} of ${products.length})`}
                      className={`clean-dot-btn ${activeProductIndex === dotIdx ? 'is-active' : ''}`}
                      onClick={() => {
                        stopAutoScroll();
                        setActiveProductIndex(dotIdx);
                      }}
                    />
                  ))}
                </div>

                <button
                  id="btn-product-next"
                  type="button"
                  onClick={() => {
                    stopAutoScroll();
                    setActiveProductIndex((prev) => (prev + 1) % 12);
                  }}
                  aria-label="Next Products"
                  className="products-arrow-btn"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </AnimatedSection>
        </section>

        {/* ══════════════════════════════════════════════════════════
            6. SECTION: OUR LEADERSHIP TEAM
        ══════════════════════════════════════════════════════════ */}
        <section className="about3-team-section" id="team-section" aria-label="Our Leadership Team">
          <AnimatedSection direction="up" duration={0.8} className="about3-section-header-center">
            <h2>{t('about.team_title')}</h2>
            <p>{t('about.team_subtitle')}</p>
          </AnimatedSection>

          <AnimatedSection direction="up" duration={0.8} className="team-sliding-stage-wrapper">
            <div
              className="team-sliding-track"
              onMouseLeave={() => setActiveTeamCard(null)}
            >
              {[
                {
                  id: 'winn',
                  name: 'Dr. Winn',
                  fullName: 'Dr. Winn Voramongkol',
                  role: t('about.team1_role'),
                  desc: t('about.team1_desc'),
                  // ══════════════════════════════════════════════════════════
                  // จุดปรับแต่งรูปภาพ 
                  // ══════════════════════════════════════════════════════════
                  imageNormal: logoNewLightBlue,     
                  imageExpanded: logoNewLightBlue, 
                  imageCollapsed: logoNewLightBlue, 

                  scaleNormal: 2.3,    
                  rotateNormal: 16,     
                  posNormalX: 5,         
                  posNormalY: 0,       

                  scaleExpanded: 2.1,
                  rotateExpanded: 16,
                  posExpandedX: 5,
                  posExpandedY: 0,       

                  scaleCollapsed: 3,   
                  rotateCollapsed: -35,   
                  posCollapsedX: 0,      
                  posCollapsedY: 0,       

                  accentColor: '#38BDF8'
                },
                {
                  id: 'panya',
                  name: 'K. Panya',
                  fullName: 'K. Panya',
                  role: t('about.team2_role'),
                  desc: t('about.team2_desc'),
                  imageNormal: logoNewLightBlue,
                  imageExpanded: logoNewLightBlue,
                  imageCollapsed: logoNewLightBlue,

                  scaleNormal: 2.3,     
                  rotateNormal: -16,      
                  posNormalX: -5,         
                  posNormalY: 0,  

                  scaleExpanded: 2.1,
                  rotateExpanded: -16,
                  posExpandedX: -5,
                  posExpandedY: 0,

                  scaleCollapsed: 3,
                  rotateCollapsed: 35,
                  posCollapsedX: 0,
                  posCollapsedY: 0,

                  accentColor: '#38BDF8'
                },
                {
                  id: 'suchada',
                  name: 'K. Suchada',
                  fullName: 'K. Suchada',
                  role: t('about.team3_role'),
                  desc: t('about.team3_desc'),
                  imageNormal: logoNewLightBlue,
                  imageExpanded: logoNewLightBlue,
                  imageCollapsed: logoNewLightBlue,

                  scaleNormal: 2.3,     
                  rotateNormal: 16,      
                  posNormalX: 5,         
                  posNormalY: 0,  

                  scaleExpanded: 2.1,
                  rotateExpanded: 16,
                  posExpandedX: 5,
                  posExpandedY: 0,

                  scaleCollapsed: 3,
                  rotateCollapsed: -35,
                  posCollapsedX: 0,
                  posCollapsedY: 0,

                  accentColor: '#38BDF8'
                },
                {
                  id: 'fern',
                  name: 'K. Fern',
                  fullName: 'K. Fern',
                  role: t('about.team4_role'),
                  desc: t('about.team4_desc'),
                  imageNormal: logoNewLightBlue,
                  imageExpanded: logoNewLightBlue,
                  imageCollapsed: logoNewLightBlue,

                  scaleNormal: 2.3,    
                  rotateNormal: -16,     
                  posNormalX: -5,         
                  posNormalY: 0,  

                  scaleExpanded: 2.1,
                  rotateExpanded: -16,
                  posExpandedX: -5,
                  posExpandedY: 0,

                  scaleCollapsed: 3,
                  rotateCollapsed: 35,
                  posCollapsedX: 0,
                  posCollapsedY: 0,

                  accentColor: '#38BDF8'
                }
              ].map((member) => {
                const isExpanded = activeTeamCard === member.id;
                const isCollapsed = activeTeamCard !== null && !isExpanded;

                // เลือกว่าจะแสดงรูปชุดไหน: รูปตอนกาง, รูปตอนย่อ, หรือรูปขนาดปกติ
                const activePhoto = isExpanded
                  ? (member.imageExpanded || member.imageNormal || logoNewLightBlue)
                  : isCollapsed
                  ? (member.imageCollapsed || member.imageNormal || logoNewLightBlue)
                  : (member.imageNormal || logoNewLightBlue);

                const activeScale = isExpanded
                  ? (member.scaleExpanded ?? 0.88)
                  : isCollapsed
                  ? (member.scaleCollapsed ?? 1.18)
                  : (member.scaleNormal ?? 0.85);

                const activeRotate = isExpanded
                  ? (member.rotateExpanded ?? 0)
                  : isCollapsed
                  ? (member.rotateCollapsed ?? -35)
                  : (member.rotateNormal ?? 0);

                const activePosX = isExpanded
                  ? (member.posExpandedX ?? 0)
                  : isCollapsed
                  ? (member.posCollapsedX ?? 0)
                  : (member.posNormalX ?? 0);

                const activePosY = isExpanded
                  ? (member.posExpandedY ?? 0)
                  : isCollapsed
                  ? (member.posCollapsedY ?? 0)
                  : (member.posNormalY ?? 0);

                return (
                  <div
                    key={member.id}
                    className={`team-sliding-card ${isExpanded ? 'is-expanded' : ''} ${isCollapsed ? 'is-collapsed' : ''}`}
                    id={`team-slide-card-${member.id}`}
                    style={{
                      '--member-accent': member.accentColor
                    } as React.CSSProperties}
                    onMouseEnter={() => setActiveTeamCard(member.id)}
                    onTouchStart={() => setActiveTeamCard(isExpanded ? null : member.id)}
                  >
                    {/* Visual Photo Box with Botnoi Logo Icon */}
                    <div className="team-slide-visual">
                      <div className="team-slide-logo-container">
                        <img
                          src={activePhoto}
                          alt={member.name}
                          className="team-slide-botnoi-logo"
                          style={{
                            transform: `translate(${activePosX}px, ${activePosY}px) rotate(${activeRotate}deg) scale(${activeScale})`,
                            transition: 'transform 0.4s cubic-bezier(0.2, 0.9, 0.3, 1)'
                          }}
                        />
                      </div>
                    </div>

                    {/* Sliding White / Glass Info Sheet */}
                    <div className="team-slide-white-sheet">
                      {/* Name Header */}
                      <div className="sheet-header">
                        <div className="sheet-meta-title">
                          <h3 className="sheet-name">{isExpanded ? member.fullName : member.name}</h3>
                        </div>
                      </div>

                      {/* Extended Details (Directly below name) */}
                      {isExpanded && (
                        <div className="sheet-body-content">
                          <p className="sheet-role-title">{member.role}</p>
                          <p className="sheet-desc-text">{member.desc}</p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </AnimatedSection>
        </section>

      </div>

      <AppFooter />
    </div>
  );
}

export default About;

