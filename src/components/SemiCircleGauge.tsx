import React from 'react';
import { motion } from 'framer-motion';
import AnimatedCounter from './AnimatedCounter';

interface SemiCircleGaugeProps {
  value: number;
  suffix?: string;
  percentage: number; // 0 to 100
  label: string;
  icon: React.ReactNode;
  gradientId: string;
  colorStart: string;
  colorEnd: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
}

export const SemiCircleGauge: React.FC<SemiCircleGaugeProps> = ({
  value,
  suffix = '+',
  percentage,
  label,
  icon,
  gradientId,
  colorStart,
  colorEnd,
  badgeBg,
  badgeText,
  badgeBorder,
}) => {
  // Semi-circle SVG Path Arc length calculations
  // Radius R = 50, Center (65, 65)
  // Arc length = PI * 50 = ~157.08
  const arcLength = 157.08;
  const targetOffset = arcLength * (1 - Math.min(Math.max(percentage, 0), 100) / 100);

  return (
    <div className="relative group p-4 flex flex-col items-center justify-between text-center cursor-default">
      {/* Background Soft Radial Glow */}
      <div
        className="absolute -top-6 left-1/2 -translate-x-1/2 w-32 h-32 rounded-full blur-3xl pointer-events-none opacity-20 group-hover:opacity-40 transition-opacity"
        style={{ background: colorEnd }}
      />

      {/* Header Icon Badge */}
      <div className={`w-10 h-10 rounded-2xl ${badgeBg} ${badgeText} ${badgeBorder} flex items-center justify-center mb-3 shadow-xs group-hover:scale-110 transition-transform duration-300`}>
        {icon}
      </div>

      {/* Semi-Circular Progress Arc SVG */}
      <div className="relative w-full max-w-[210px] aspect-[130/75] flex items-center justify-center my-1">
        <svg viewBox="0 0 130 75" className="w-full h-full overflow-visible">
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={colorStart} />
              <stop offset="100%" stopColor={colorEnd} />
            </linearGradient>
          </defs>

          {/* Background Arc Track */}
          <path
            d="M 15 65 A 50 50 0 0 1 115 65"
            fill="none"
            className="stroke-zinc-200/80 dark:stroke-slate-800"
            strokeWidth="10"
            strokeLinecap="round"
          />

          {/* Animated Foreground Progress Arc */}
          <motion.path
            d="M 15 65 A 50 50 0 0 1 115 65"
            fill="none"
            stroke={`url(#${gradientId})`}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={arcLength}
            initial={{ strokeDashoffset: arcLength }}
            whileInView={{ strokeDashoffset: targetOffset }}
            viewport={{ once: true }}
            transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
          />
        </svg>

        {/* Number Counter in Gauge Center */}
        <div className="absolute bottom-1 left-0 right-0 text-center flex flex-col items-center justify-center pointer-events-none">
          <AnimatedCounter
            value={value}
            suffix={suffix}
            className="text-2xl sm:text-3xl font-black text-foreground tracking-tight leading-none drop-shadow-xs"
          />
        </div>
      </div>

      {/* Label Text below Gauge */}
      <div className="mt-3">
        <span className="text-xs md:text-sm font-bold text-muted-foreground uppercase tracking-wider block">
          {label}
        </span>
      </div>
    </div>
  );
};

export default SemiCircleGauge;
