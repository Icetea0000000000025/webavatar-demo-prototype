import React, { useEffect, useRef } from 'react';
import { motion, useInView, useAnimation, useMotionValue, animate } from 'framer-motion';

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
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.1 });
  const controls = useAnimation();
  const count = useMotionValue(0);
  const numberRef = useRef<HTMLSpanElement>(null);
  const animationRef = useRef<{ stop: () => void } | null>(null);

  const targetRatio = Math.min(Math.max(percentage, 0), 100) / 100;
  const transitionConfig = { duration: 2.2, ease: [0.16, 1, 0.3, 1] as const };

  useEffect(() => {
    return count.on('change', (latest) => {
      if (numberRef.current) {
        numberRef.current.textContent = Math.round(latest).toLocaleString();
      }
    });
  }, [count]);

  const triggerAnimation = () => {
    // Start arc progress animation
    controls.start({ pathLength: targetRatio, transition: transitionConfig });

    // Stop any ongoing number animation
    if (animationRef.current) {
      animationRef.current.stop();
    }

    // Reset and animate number
    count.set(0);
    if (numberRef.current) {
      numberRef.current.textContent = '0';
    }
    animationRef.current = animate(count, value, {
      duration: 2.2,
      ease: [0.16, 1, 0.3, 1],
    });
  };

  useEffect(() => {
    if (isInView) {
      triggerAnimation();
    } else {
      const timer = setTimeout(() => {
        triggerAnimation();
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [isInView, targetRatio, value]);

  const handleMouseEnter = () => {
    // Reset instantly, then start animation again
    controls.set({ pathLength: 0 });
    triggerAnimation();
  };

  return (
    <div
      ref={containerRef}
      onMouseEnter={handleMouseEnter}
      className="relative group p-4 flex flex-col items-center justify-between text-center cursor-default bg-transparent border-0 shadow-none transition-all duration-300 hover:-translate-y-1"
    >

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

          {/* Animated Foreground Progress Arc - iOS & macOS WebKit Optimized */}
          <motion.path
            d="M 15 65 A 50 50 0 0 1 115 65"
            fill="none"
            stroke={`url(#${gradientId})`}
            strokeWidth="10"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={controls}
            style={{
              WebkitTransform: 'translateZ(0)',
              transform: 'translateZ(0)',
            }}
          />
        </svg>

        <div className="absolute bottom-1 left-0 right-0 text-center flex flex-col items-center justify-center pointer-events-none">
          <span className="text-2xl sm:text-3xl font-black text-foreground tracking-tight leading-none drop-shadow-xs" style={{ fontVariantNumeric: 'tabular-nums' }}>
            <span ref={numberRef}>{value.toLocaleString()}</span>{suffix}
          </span>
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
