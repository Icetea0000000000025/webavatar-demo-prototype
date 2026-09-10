import React from "react";

export type CabinType = "turboprop" | "narrowbody" | "widebody";

interface AirlinerFuselageSVGProps {
  cabinType: CabinType;
  model?: string;
  airlineCode?: string;
  className?: string;
}

export const AirlinerFuselageSVG: React.FC<AirlinerFuselageSVGProps> = ({
  cabinType,
  model = "Airbus A320",
  airlineCode = "BTN",
  className = "absolute inset-0 w-full h-full drop-shadow-lg z-0 pointer-events-none",
}) => {
  const isTurboprop = cabinType === "turboprop";
  const isWidebody = cabinType === "widebody";

  // Livery Accent Color
  const wingletColor =
    airlineCode === "THA"
      ? "#7e22ce" // Thai Airways Royal Purple
      : airlineCode === "BKP"
      ? "#0284c7" // Bangkok Airways Sky Blue
      : "#0369a1"; // Botnoi Air Deep Cyan

  return (
    <svg
      className={className}
      viewBox="0 0 860 360"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Fuselage White Pearl Shading */}
        <linearGradient id="fuselageBodyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="25%" stopColor="#f8faff" />
          <stop offset="80%" stopColor="#eef4fb" />
          <stop offset="100%" stopColor="#dce8f7" />
        </linearGradient>

        {/* Wing Metallic Shading */}
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

        {/* Turboprop Engine Pod Gradient */}
        <linearGradient id="turbopropPodGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#e2e8f0" />
          <stop offset="50%" stopColor="#cbd5e1" />
          <stop offset="100%" stopColor="#94a3b8" />
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

      {/* ═══════════════════════════════════════════════════════════════════════
          1. REAR TAIL & HORIZONTAL STABILIZERS
      ═══════════════════════════════════════════════════════════════════════ */}
      {isTurboprop ? (
        /* ATR 72-600 T-TAIL STABILIZER (High Horizontal Tail Fin at top) */
        <g id="atr-t-tail">
          <path d="M 720 180 L 800 160 L 825 145 L 810 180 Z" fill="url(#wingBodyGrad)" stroke="#b0cbe8" strokeWidth="1.5" />
          <polygon points="760,145 845,95 860,95 805,145" fill="url(#wingBodyGrad)" stroke="#b0cbe8" strokeWidth="1.5" />
          <polygon points="760,155 845,205 860,205 805,155" fill="url(#wingBodyGrad)" stroke="#b0cbe8" strokeWidth="1.5" />
          <rect x="800" y="145" width="40" height="10" rx="3" fill={wingletColor} opacity="0.85" />
        </g>
      ) : isWidebody ? (
        /* WIDEBODY EXPANDED SWEPT HORIZONTAL ELEVATORS */
        <g id="widebody-tail">
          <polygon points="720,165 835,75 865,75 780,165" fill="url(#wingBodyGrad)" stroke="#b0cbe8" strokeWidth="1.8" />
          <polygon points="720,195 835,285 865,285 780,195" fill="url(#wingBodyGrad)" stroke="#b0cbe8" strokeWidth="1.8" />
          <line x1="740" y1="160" x2="825" y2="85" stroke="#ffffff" strokeWidth="1.5" opacity="0.8" />
          <line x1="740" y1="200" x2="825" y2="275" stroke="#ffffff" strokeWidth="1.5" opacity="0.8" />
        </g>
      ) : (
        /* NARROWBODY STANDARD SWEPT ELEVATORS */
        <g id="narrowbody-tail">
          <polygon points="730,170 825,90 855,90 785,170" fill="url(#wingBodyGrad)" stroke="#b0cbe8" strokeWidth="1.5" />
          <polygon points="730,190 825,270 855,270 785,190" fill="url(#wingBodyGrad)" stroke="#b0cbe8" strokeWidth="1.5" />
        </g>
      )}

      {/* ═══════════════════════════════════════════════════════════════════════
          2. MAIN WINGS & ENGINES (TOP & BOTTOM)
      ═══════════════════════════════════════════════════════════════════════ */}
      {isTurboprop ? (
        /* ── ATR 72-600 HIGH-WING TURBOPROP (Straight Wings + 6-Blade Propellers) ── */
        <g id="turboprop-wings-engines">
          {/* Top Straight High Wing */}
          <polygon points="340,95 490,15 545,15 450,95" fill="url(#wingBodyGrad)" stroke="#b0cbe8" strokeWidth="1.5" />
          <line x1="355" y1="90" x2="495" y2="20" stroke="#ffffff" strokeWidth="1.5" opacity="0.8" />
          <polygon points="535,15 550,13 548,22 535,20" fill={wingletColor} />

          {/* Top Turboprop Engine Nacelle Pod */}
          <rect x="400" y="30" width="58" height="24" rx="10" fill="url(#turbopropPodGrad)" stroke="#94a3b8" strokeWidth="1.5" />
          <polygon points="398,34 378,42 398,50" fill="#0f172a" />
          <ellipse cx="396" cy="42" rx="4" ry="32" fill="#38bdf8" fillOpacity="0.25" stroke="#0284c7" strokeWidth="1" strokeDasharray="3 2" />
          <line x1="396" y1="42" x2="396" y2="12" stroke="#1e293b" strokeWidth="3" strokeLinecap="round" />
          <line x1="396" y1="42" x2="396" y2="72" stroke="#1e293b" strokeWidth="3" strokeLinecap="round" />
          <line x1="396" y1="42" x2="372" y2="24" stroke="#1e293b" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="396" y1="42" x2="420" y2="60" stroke="#1e293b" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="396" y1="42" x2="420" y2="24" stroke="#1e293b" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="396" y1="42" x2="372" y2="60" stroke="#1e293b" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="396" cy="14" r="2" fill="#eab308" />
          <circle cx="396" cy="70" r="2" fill="#eab308" />

          {/* Bottom Straight High Wing */}
          <polygon points="340,265 490,345 545,345 450,265" fill="url(#wingBodyGrad)" stroke="#b0cbe8" strokeWidth="1.5" />
          <line x1="355" y1="270" x2="495" y2="340" stroke="#ffffff" strokeWidth="1.5" opacity="0.8" />
          <polygon points="535,345 550,347 548,338 535,340" fill={wingletColor} />

          {/* Bottom Turboprop Engine Nacelle Pod */}
          <rect x="400" y="306" width="58" height="24" rx="10" fill="url(#turbopropPodGrad)" stroke="#94a3b8" strokeWidth="1.5" />
          <polygon points="398,310 378,318 398,326" fill="#0f172a" />
          <ellipse cx="396" cy="318" rx="4" ry="32" fill="#38bdf8" fillOpacity="0.25" stroke="#0284c7" strokeWidth="1" strokeDasharray="3 2" />
          <line x1="396" y1="318" x2="396" y2="288" stroke="#1e293b" strokeWidth="3" strokeLinecap="round" />
          <line x1="396" y1="318" x2="396" y2="348" stroke="#1e293b" strokeWidth="3" strokeLinecap="round" />
          <line x1="396" y1="318" x2="372" y2="300" stroke="#1e293b" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="396" y1="318" x2="420" y2="336" stroke="#1e293b" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="396" y1="318" x2="420" y2="300" stroke="#1e293b" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="396" y1="318" x2="372" y2="336" stroke="#1e293b" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="396" cy="290" r="2" fill="#eab308" />
          <circle cx="396" cy="346" r="2" fill="#eab308" />
        </g>
      ) : isWidebody ? (
        /* ── WIDE-BODY HEAVY JET (Extended Swept Wings + Giant GE90/Trent XWB Turbofans) ── */
        <g id="widebody-wings-engines">
          {/* Top Massive Swept Wing */}
          <polygon points="260,85 580,-15 670,-15 500,85" fill="url(#wingBodyGrad)" stroke="#b0cbe8" strokeWidth="1.8" />
          <line x1="280" y1="80" x2="570" y2="-10" stroke="#ffffff" strokeWidth="2" opacity="0.9" />
          <path d="M 430 55 L 452 48 L 448 58 Z" fill="#92b2d8" stroke="#7b9fc9" strokeWidth="1" />
          <path d="M 490 35 L 512 28 L 508 38 Z" fill="#92b2d8" stroke="#7b9fc9" strokeWidth="1" />
          <path d="M 550 15 L 572 8 L 568 18 Z" fill="#92b2d8" stroke="#7b9fc9" strokeWidth="1" />
          <path d="M 610 -5 L 632 -12 L 628 -2 Z" fill="#92b2d8" stroke="#7b9fc9" strokeWidth="1" />
          <path d="M 655,-15 Q 680,-25 675,-5 L 660,-5 Z" fill={wingletColor} />

          {/* Top Giant GE90 Turbofan Engine */}
          <rect x="395" y="42" width="28" height="46" rx="4" fill="#cbdcf5" stroke="#9bbfe3" strokeWidth="1.2" />
          <rect x="355" y="20" width="82" height="36" rx="18" fill="url(#engineNacelleGrad)" stroke="#7fa8d5" strokeWidth="2" />
          <ellipse cx="360" cy="38" rx="7" ry="16" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="1.5" />
          <ellipse cx="359" cy="38" rx="5" ry="13" fill="#0f172a" />
          <circle cx="359" cy="38" r="3.5" fill="#38bdf8" />
          <polygon points="436,28 450,38 436,48" fill="#334155" />

          {/* Bottom Massive Swept Wing */}
          <polygon points="260,275 580,375 670,375 500,275" fill="url(#wingBodyGrad)" stroke="#b0cbe8" strokeWidth="1.8" />
          <line x1="280" y1="280" x2="570" y2="370" stroke="#ffffff" strokeWidth="2" opacity="0.9" />
          <path d="M 430 305 L 452 312 L 448 302 Z" fill="#92b2d8" stroke="#7b9fc9" strokeWidth="1" />
          <path d="M 490 325 L 512 332 L 508 322 Z" fill="#92b2d8" stroke="#7b9fc9" strokeWidth="1" />
          <path d="M 550 345 L 572 352 L 568 342 Z" fill="#92b2d8" stroke="#7b9fc9" strokeWidth="1" />
          <path d="M 610 365 L 632 372 L 628 362 Z" fill="#92b2d8" stroke="#7b9fc9" strokeWidth="1" />
          <path d="M 655,375 Q 680,385 675,365 L 660,365 Z" fill={wingletColor} />

          {/* Bottom Giant GE90 Turbofan Engine */}
          <rect x="395" y="272" width="28" height="46" rx="4" fill="#cbdcf5" stroke="#9bbfe3" strokeWidth="1.2" />
          <rect x="355" y="304" width="82" height="36" rx="18" fill="url(#engineNacelleGrad)" stroke="#7fa8d5" strokeWidth="2" />
          <ellipse cx="360" cy="322" rx="7" ry="16" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="1.5" />
          <ellipse cx="359" cy="322" rx="5" ry="13" fill="#0f172a" />
          <circle cx="359" cy="322" r="3.5" fill="#38bdf8" />
          <polygon points="436,312 450,322 436,332" fill="#334155" />
        </g>
      ) : (
        /* ── NARROW-BODY JET (A320/B737 Standard Swept Wings + Dual Turbofans) ── */
        <g id="narrowbody-wings-engines">
          {/* Top Main Wing */}
          <polygon points="290,90 560,0 635,0 490,90" fill="url(#wingBodyGrad)" stroke="#b0cbe8" strokeWidth="1.5" />
          <line x1="310" y1="84" x2="550" y2="4" stroke="#ffffff" strokeWidth="1.5" opacity="0.8" />
          <path d="M 430 62 L 448 56 L 444 64 Z" fill="#92b2d8" stroke="#7b9fc9" strokeWidth="0.8" />
          <path d="M 480 44 L 498 38 L 494 46 Z" fill="#92b2d8" stroke="#7b9fc9" strokeWidth="0.8" />
          <path d="M 530 26 L 548 20 L 544 28 Z" fill="#92b2d8" stroke="#7b9fc9" strokeWidth="0.8" />
          <path d="M 580 8 L 598 2 L 594 10 Z" fill="#92b2d8" stroke="#7b9fc9" strokeWidth="0.8" />
          <polygon points="625,0 640,-2 638,8 625,6" fill={wingletColor} />

          {/* Top Engine Pylon & Turbofan */}
          <rect x="410" y="52" width="22" height="38" rx="3" fill="#cbdcf5" stroke="#9bbfe3" strokeWidth="1" />
          <rect x="375" y="32" width="68" height="28" rx="14" fill="url(#engineNacelleGrad)" stroke="#7fa8d5" strokeWidth="1.5" />
          <ellipse cx="380" cy="46" rx="5.5" ry="12.5" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="1" />
          <ellipse cx="379" cy="46" rx="4" ry="10" fill="#1e293b" />
          <circle cx="379" cy="46" r="2.5" fill="#0f172a" />
          <polygon points="443,38 454,46 443,54" fill="#475569" />

          {/* Bottom Main Wing */}
          <polygon points="290,270 560,360 635,360 490,270" fill="url(#wingBodyGrad)" stroke="#b0cbe8" strokeWidth="1.5" />
          <line x1="310" y1="276" x2="550" y2="356" stroke="#ffffff" strokeWidth="1.5" opacity="0.8" />
          <path d="M 430 298 L 448 304 L 444 296 Z" fill="#92b2d8" stroke="#7b9fc9" strokeWidth="0.8" />
          <path d="M 480 316 L 498 322 L 494 314 Z" fill="#92b2d8" stroke="#7b9fc9" strokeWidth="0.8" />
          <path d="M 530 334 L 548 340 L 544 332 Z" fill="#92b2d8" stroke="#7b9fc9" strokeWidth="0.8" />
          <path d="M 580 352 L 598 358 L 594 350 Z" fill="#92b2d8" stroke="#7b9fc9" strokeWidth="0.8" />
          <polygon points="625,360 640,362 638,352 625,354" fill={wingletColor} />

          {/* Bottom Engine Pylon & Turbofan */}
          <rect x="410" y="270" width="22" height="38" rx="3" fill="#cbdcf5" stroke="#9bbfe3" strokeWidth="1" />
          <rect x="375" y="300" width="68" height="28" rx="14" fill="url(#engineNacelleGrad)" stroke="#7fa8d5" strokeWidth="1.5" />
          <ellipse cx="380" cy="314" rx="5.5" ry="12.5" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="1" />
          <ellipse cx="379" cy="314" rx="4" ry="10" fill="#1e293b" />
          <circle cx="379" cy="314" r="2.5" fill="#0f172a" />
          <polygon points="443,306 454,314 443,322" fill="#475569" />
        </g>
      )}

      {/* ═══════════════════════════════════════════════════════════════════════
          3. FUSELAGE HULL (PROFILE CONTOUR BY MODEL)
      ═══════════════════════════════════════════════════════════════════════ */}
      {isTurboprop ? (
        /* ATR 72 SLENDER REGIONAL FUSELAGE */
        <path
          d="M 35 180 C 48 154, 85 104, 145 96 C 165 94, 185 94, 205 94 L 750 94 C 785 94, 825 152, 842 180 C 825 208, 785 266, 750 266 L 205 266 C 185 266, 165 266, 145 264 C 85 256, 48 206, 35 180 Z"
          fill="url(#fuselageBodyGrad)"
          stroke="#b0cbe8"
          strokeWidth="2.4"
        />
      ) : isWidebody ? (
        /* WIDEBODY EXPANDED DIAMETER HULL */
        <path
          d="M 20 180 C 35 142, 75 80, 135 78 C 158 76, 180 76, 200 76 L 765 76 C 798 76, 835 146, 855 180 C 835 214, 798 284, 765 284 L 200 284 C 180 284, 158 284, 135 282 C 75 280, 35 218, 20 180 Z"
          fill="url(#fuselageBodyGrad)"
          stroke="#b0cbe8"
          strokeWidth="2.8"
        />
      ) : (
        /* NARROWBODY STANDARD HULL */
        <path
          d="M 25 180 C 40 148, 80 106, 140 92 C 160 90, 180 90, 200 90 L 760 90 C 790 90, 830 150, 850 180 C 830 210, 790 270, 760 270 L 200 270 C 180 270, 160 270, 140 268 C 80 254, 40 212, 25 180 Z"
          fill="url(#fuselageBodyGrad)"
          stroke="#b0cbe8"
          strokeWidth="2.5"
        />
      )}

      {/* Nose Cone Radome Weather Radar */}
      <path
        d="M 25 180 C 34 162, 50 148, 66 148 C 56 168, 56 192, 66 212 C 50 212, 34 198, 25 180 Z"
        fill="url(#radomeNoseGrad)"
        stroke="#cbdcf3"
        strokeWidth="1.2"
      />
      <path d="M 66 148 C 56 168, 56 192, 66 212" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="3 2" fill="none" />

      {/* Pitot Tube Sensors */}
      <line x1="48" y1="156" x2="36" y2="152" stroke="#64748b" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="48" y1="204" x2="36" y2="208" stroke="#64748b" strokeWidth="1.5" strokeLinecap="round" />

      {/* Cockpit Windows & Pilot Flight Deck */}
      <polygon points="76,177 98,162 98,177" fill="url(#cockpitGlassGrad)" stroke="#cbd5e1" strokeWidth="0.8" />
      <line x1="80" y1="174" x2="94" y2="165" stroke="#ffffff" strokeWidth="1" strokeLinecap="round" opacity="0.85" />
      <polygon points="76,183 98,198 98,183" fill="url(#cockpitGlassGrad)" stroke="#cbd5e1" strokeWidth="0.8" />
      <line x1="80" y1="186" x2="94" y2="195" stroke="#ffffff" strokeWidth="1" strokeLinecap="round" opacity="0.85" />
      <polygon points="102,160 128,144 128,175 102,175" fill="url(#cockpitGlassGrad)" stroke="#cbd5e1" strokeWidth="0.8" />
      <polygon points="102,200 128,216 128,185 102,185" fill="url(#cockpitGlassGrad)" stroke="#cbd5e1" strokeWidth="0.8" />
      <polygon points="132,142 154,130 154,172 132,172" fill="url(#cockpitGlassGrad)" stroke="#cbd5e1" strokeWidth="0.8" />
      <polygon points="132,218 154,230 154,188 132,188" fill="url(#cockpitGlassGrad)" stroke="#cbd5e1" strokeWidth="0.8" />

      {/* Pilot Seats */}
      <rect x="132" y="152" width="14" height="12" rx="3" fill="#475569" stroke="#64748b" strokeWidth="0.8" />
      <rect x="132" y="196" width="14" height="12" rx="3" fill="#475569" stroke="#64748b" strokeWidth="0.8" />
      <rect x="134" y="174" width="18" height="12" rx="2" fill="#334155" />
      <circle cx="143" cy="180" r="2" fill="#7dd3fc" />

      {/* Cockpit Wall Divider */}
      <line x1="158" y1={isWidebody ? "88" : "102"} x2="158" y2={isWidebody ? "272" : "258"} stroke="#cbdcf5" strokeWidth="2" strokeDasharray="4 2" />

      {/* Passenger Cabin Cutout Frame */}
      <rect
        x="164"
        y={isWidebody ? "86" : "102"}
        width="594"
        height={isWidebody ? "188" : "156"}
        rx="16"
        fill="#f8fafc"
        stroke="#cbdcf5"
        strokeWidth="2"
        className="dark:fill-slate-900 dark:stroke-slate-700"
      />

      {/* Tail Model Stamp */}
      <text
        x="770"
        y="183"
        textAnchor="start"
        fontSize="7.5"
        fontWeight="800"
        fontFamily="monospace"
        fill="#94a3b8"
        letterSpacing="0.5"
      >
        {model}
      </text>
    </svg>
  );
};
