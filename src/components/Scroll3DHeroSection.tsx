import React from 'react';
import { motion, useScroll, useVelocity, useTransform, useSpring } from 'framer-motion';

export interface CardItem {
  id: string;
  title: string;
  subtitle?: string;
  price?: string | number;
  image: string;
  badge?: string;
}

export interface Scroll3DHeroSectionProps {
  title: React.ReactNode;
  subtitle: React.ReactNode;
  cards?: CardItem[];
  className?: string;
  onCardClick?: (id: string) => void;
}

export const Scroll3DHeroSection: React.FC<Scroll3DHeroSectionProps> = ({
  title,
  subtitle,
  cards = [],
  className = '',
  onCardClick,
}) => {
  // 1. Capture viewport scroll position & scroll velocity
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);

  // 2. Smooth out velocity fluctuations using spring physics for inertia effect
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 35,
    stiffness: 250,
    mass: 0.8,
  });

  // 3. Map scroll velocity to 3D rotation, skew, scale, and Z-depth transforms
  // Rotate X: Tilt forward when scrolling down, tilt backward when scrolling up
  const rotateX = useTransform(smoothVelocity, [-3000, 0, 3000], [22, 0, -22]);
  
  // Skew Y: Create dynamic speed distortion effect
  const skewY = useTransform(smoothVelocity, [-3000, 0, 3000], [-6, 0, 6]);

  // Scale: Compress slightly when moving at high speeds for realistic physics momentum
  const scale = useTransform(smoothVelocity, [-3000, -1000, 0, 1000, 3000], [0.93, 0.97, 1, 0.97, 0.93]);

  // Translate Z: Pull cards slightly back when scrolling rapidly
  const translateZ = useTransform(smoothVelocity, [-3000, 0, 3000], [-60, 0, -60]);

  // Individual card subtle variation multipliers for rich depth field
  const leftCardRotateY = useTransform(smoothVelocity, [-3000, 0, 3000], [-12, 0, 12]);
  const rightCardRotateY = useTransform(smoothVelocity, [-3000, 0, 3000], [12, 0, -12]);
  const centerCardTranslateZ = useTransform(smoothVelocity, [-3000, 0, 3000], [40, 0, 40]);

  return (
    <div className={`relative mb-12 text-center select-none overflow-visible ${className}`}>
      {/* Text Header */}
      <div className="mb-8 relative z-10 px-4">
        <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-stone-900 dark:text-white tracking-tight">
          {title}
        </h2>
        <p className="mt-2.5 text-xs sm:text-sm text-stone-500 dark:text-stone-400 max-w-xl mx-auto leading-relaxed font-semibold">
          {subtitle}
        </p>
      </div>

      {/* 3D Scroll-Velocity Animated Container */}
      {cards.length > 0 && (
        <div 
          className="relative mx-auto max-w-5xl px-4 pt-2 pb-6"
          style={{ perspective: '1200px' }}
        >
          <motion.div
            style={{
              rotateX,
              skewY,
              scale,
              translateZ,
              transformStyle: 'preserve-3d',
            }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-center items-center max-w-4xl mx-auto"
          >
            {cards.slice(0, 3).map((card, idx) => {
              // Custom depth shift for left/center/right card layout
              const cardY = idx === 0 ? leftCardRotateY : idx === 2 ? rightCardRotateY : 0;
              const extraZ = idx === 1 ? centerCardTranslateZ : 0;

              return (
                <motion.div
                  key={card.id || idx}
                  style={{
                    rotateY: cardY,
                    translateZ: extraZ,
                    transformStyle: 'preserve-3d',
                  }}
                  whileHover={{ scale: 1.05, translateZ: 30, rotateX: 0, rotateY: 0 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  onClick={() => onCardClick?.(card.id)}
                  className="group relative cursor-pointer overflow-hidden rounded-2xl border border-stone-200/80 dark:border-stone-800 bg-white/90 dark:bg-stone-900/90 shadow-xl hover:shadow-2xl backdrop-blur-sm transition-all duration-300 text-left"
                >
                  {/* Image container */}
                  <div className="relative aspect-4/3 w-full overflow-hidden bg-stone-100 dark:bg-stone-800">
                    <img
                      src={card.image}
                      alt={card.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 via-stone-900/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                    
                    {card.badge && (
                      <span className="absolute top-3 left-3 bg-emerald-500/90 backdrop-blur-md text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-md">
                        {card.badge}
                      </span>
                    )}

                    {card.price && (
                      <span className="absolute bottom-3 right-3 bg-white/90 dark:bg-stone-900/90 backdrop-blur-md text-emerald-600 dark:text-emerald-400 text-xs font-black px-2.5 py-1 rounded-xl shadow-md font-mono">
                        {card.price}
                      </span>
                    )}
                  </div>

                  {/* Card Content */}
                  <div className="p-4">
                    <h3 className="font-display font-bold text-sm sm:text-base text-stone-900 dark:text-white truncate group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                      {card.title}
                    </h3>
                    {card.subtitle && (
                      <p className="mt-1 text-xs text-stone-500 dark:text-stone-400 line-clamp-1 font-medium">
                        {card.subtitle}
                      </p>
                    )}
                  </div>

                  {/* 3D Glass Surface Glow Overlay */}
                  <div className="pointer-events-none absolute -inset-full top-0 block h-full w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-shine opacity-0 group-hover:opacity-100 transition-opacity" />
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Scroll3DHeroSection;
