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

function wrap(min: number, max: number, v: number) {
  const rangeSize = max - min;
  return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min;
}

interface VelocityImageRowProps {
  images: string[];
  baseVelocity?: number;
}

function VelocityImageRow({ images, baseVelocity = 100 }: VelocityImageRowProps) {
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

  const x = useTransform(baseX, (v) => `${wrap(-25, -50, v)}%`);

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

  // Duplicate images array to ensure seamless infinite looping marquee
  const repeatedImages = [...images, ...images, ...images, ...images];

  return (
    <div className="overflow-hidden w-full max-w-full flex flex-nowrap whitespace-nowrap py-2 select-none pointer-events-none">
      <motion.div
        className="flex flex-nowrap whitespace-nowrap gap-4 sm:gap-6 shrink-0"
        style={{ x }}
      >
        {repeatedImages.map((src, idx) => (
          <div
            key={`${idx}-${src}`}
            className="inline-block shrink-0 overflow-hidden rounded-2xl sm:rounded-3xl border border-stone-200/80 dark:border-stone-800/80 shadow-md hover:shadow-xl transition-all duration-300"
          >
            <img
              src={src}
              alt="Food Showcase"
              className="h-28 w-40 sm:h-36 sm:w-56 md:h-44 md:w-64 object-cover transition-transform duration-500 hover:scale-105"
            />
          </div>
        ))}
      </motion.div>
    </div>
  );
}

export interface ScrollVelocityImageHeaderProps {
  title: React.ReactNode;
  subtitle: React.ReactNode;
  images: string[];
  className?: string;
}

export const ScrollVelocityImageHeader: React.FC<ScrollVelocityImageHeaderProps> = ({
  title,
  subtitle,
  images = [],
  className = '',
}) => {
  // Split images into 2 rows for opposite scrolling directions
  const midPoint = Math.ceil(images.length / 2);
  const row1Images = images.slice(0, midPoint);
  const row2Images = images.slice(midPoint);

  const displayRow1 = row1Images.length > 0 ? row1Images : images;
  const displayRow2 = row2Images.length > 0 ? row2Images : images;

  return (
    <div className={`mb-10 text-center overflow-hidden py-2 ${className}`}>
      {/* Title & Subtitle Header */}
      <div className="mb-6 px-4">
        <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-stone-900 dark:text-white tracking-tight">
          {title}
        </h2>
        <p className="mt-2.5 text-xs sm:text-sm text-stone-500 dark:text-stone-400 max-w-xl mx-auto leading-relaxed font-semibold">
          {subtitle}
        </p>
      </div>

      {/* Row 1: Pure Images scrolling LEFT linked to scroll velocity */}
      {displayRow1.length > 0 && (
        <VelocityImageRow
          images={displayRow1}
          baseVelocity={-2.5}
        />
      )}

      {/* Row 2: Pure Images scrolling RIGHT linked to scroll velocity */}
      {displayRow2.length > 0 && (
        <VelocityImageRow
          images={displayRow2}
          baseVelocity={2.5}
        />
      )}
    </div>
  );
};

export default ScrollVelocityImageHeader;
