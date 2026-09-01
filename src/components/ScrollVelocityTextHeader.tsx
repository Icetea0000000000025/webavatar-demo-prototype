import React, { useRef } from 'react';
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
  useMotionValue,
  useAnimationFrame,
} from 'framer-motion';

// Wrap helper function
function wrap(min: number, max: number, v: number) {
  const rangeSize = max - min;
  return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min;
}

interface ParallaxTextProps {
  children: string;
  baseVelocity?: number;
  className?: string;
}

function ParallaxText({ children, baseVelocity = 100, className = "" }: ParallaxTextProps) {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400,
  });

  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 5], {
    clamp: false,
  });

  const x = useTransform(baseX, (v) => `${wrap(-20, -45, v)}%`);

  const directionFactor = useRef<number>(1);
  useAnimationFrame((_, delta) => {
    let moveBy = directionFactor.current * baseVelocity * (delta / 1000);

    if (velocityFactor.get() < 0) {
      directionFactor.current = -1;
    } else if (velocityFactor.get() > 0) {
      directionFactor.current = 1;
    }

    moveBy += directionFactor.current * moveBy * velocityFactor.get();

    baseX.set(baseX.get() + moveBy);
  });

  return (
    <div className="overflow-hidden w-full max-w-full flex flex-nowrap whitespace-nowrap py-1 select-none pointer-events-none">
      <motion.div
        className={`flex flex-nowrap whitespace-nowrap gap-8 text-center shrink-0 ${className}`}
        style={{ x }}
      >
        <span className="inline-block shrink-0">{children}</span>
        <span className="inline-block shrink-0 opacity-40">•</span>
        <span className="inline-block shrink-0">{children}</span>
        <span className="inline-block shrink-0 opacity-40">•</span>
        <span className="inline-block shrink-0">{children}</span>
        <span className="inline-block shrink-0 opacity-40">•</span>
        <span className="inline-block shrink-0">{children}</span>
        <span className="inline-block shrink-0 opacity-40">•</span>
        <span className="inline-block shrink-0">{children}</span>
        <span className="inline-block shrink-0 opacity-40">•</span>
      </motion.div>
    </div>
  );
}

export interface ScrollVelocityTextHeaderProps {
  title: string;
  subtitle: string;
  className?: string;
}

export const ScrollVelocityTextHeader: React.FC<ScrollVelocityTextHeaderProps> = ({
  title,
  subtitle,
  className = '',
}) => {
  return (
    <div className={`mb-8 text-center overflow-hidden py-2 ${className}`}>
      {/* Row 1: Title moving with Scroll Velocity */}
      <ParallaxText
        baseVelocity={-2}
        className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-stone-900 dark:text-white tracking-tight"
      >
        {title}
      </ParallaxText>

      {/* Row 2: Subtitle moving in opposite direction with Scroll Velocity */}
      <ParallaxText
        baseVelocity={2}
        className="text-xs sm:text-sm text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider mt-2"
      >
        {subtitle}
      </ParallaxText>
    </div>
  );
};

export default ScrollVelocityTextHeader;
