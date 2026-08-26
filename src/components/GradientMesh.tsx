import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../lib/ThemeContext';

interface GradientMeshProps {
  mouseX: number;
  mouseY: number;
  scrollY: number;
}

export const GradientMesh: React.FC<GradientMeshProps> = ({ mouseX, mouseY, scrollY }) => {
  const { isDark } = useTheme();
  const clampedScrollY = Math.max(0, scrollY);

  return (
    <div 
      style={{
        position: 'fixed',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 1,
        userSelect: 'none',
      }}
    >
      {/* Glow Blob 1 (Indigo / Purple) */}
      <div 
        style={{
          position: 'absolute',
          top: '-10%',
          left: '-10%',
          width: 'clamp(260px, 45vw, 650px)',
          height: 'clamp(260px, 45vw, 650px)',
          transform: `translate3d(${mouseX * 80}px, ${mouseY * 80 - clampedScrollY * 0.15}px, 0)`,
          willChange: 'transform',
        }}
      >
        <motion.div
          className="transform-gpu"
          style={{
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            filter: 'blur(75px)',
            opacity: isDark ? 0.35 : 0.65,
            background: isDark
              ? 'radial-gradient(circle, #4F46E5 0%, rgba(79, 70, 229, 0) 70%)'
              : 'radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, rgba(99, 102, 241, 0) 70%)',
            WebkitBackfaceVisibility: 'hidden',
            backfaceVisibility: 'hidden',
          }}
          animate={{
            x: [0, 40, -20, 0],
            y: [0, -30, 20, 0],
            scale: [1, 1.1, 0.95, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>

      {/* Glow Blob 2 (Cyan / Sky Blue) */}
      <div 
        style={{
          position: 'absolute',
          top: '20%',
          right: '-10%',
          width: 'clamp(240px, 40vw, 600px)',
          height: 'clamp(240px, 40vw, 600px)',
          transform: `translate3d(${mouseX * -60}px, ${mouseY * -60 - clampedScrollY * 0.25}px, 0)`,
          willChange: 'transform',
        }}
      >
        <motion.div
          className="transform-gpu"
          style={{
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            filter: 'blur(80px)',
            opacity: isDark ? 0.30 : 0.60,
            background: isDark
              ? 'radial-gradient(circle, #0891B2 0%, rgba(8, 145, 178, 0) 70%)'
              : 'radial-gradient(circle, rgba(6, 182, 212, 0.14) 0%, rgba(6, 182, 212, 0) 70%)',
            WebkitBackfaceVisibility: 'hidden',
            backfaceVisibility: 'hidden',
          }}
          animate={{
            x: [0, -50, 30, 0],
            y: [0, 40, -30, 0],
            scale: [1, 0.9, 1.15, 1],
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>

      {/* Glow Blob 3 (Purple / Fuchsia) */}
      <div 
        style={{
          position: 'absolute',
          bottom: '-10%',
          left: '25%',
          width: 'clamp(220px, 35vw, 550px)',
          height: 'clamp(220px, 35vw, 550px)',
          transform: `translate3d(${mouseX * 40}px, ${mouseY * 40 - clampedScrollY * 0.35}px, 0)`,
          willChange: 'transform',
        }}
      >
        <motion.div
          className="transform-gpu"
          style={{
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            filter: 'blur(75px)',
            opacity: isDark ? 0.25 : 0.50,
            background: isDark
              ? 'radial-gradient(circle, #9333EA 0%, rgba(147, 51, 234, 0) 70%)'
              : 'radial-gradient(circle, rgba(168, 85, 247, 0.12) 0%, rgba(168, 85, 247, 0) 70%)',
            WebkitBackfaceVisibility: 'hidden',
            backfaceVisibility: 'hidden',
          }}
          animate={{
            x: [0, 30, -30, 0],
            y: [0, 20, 40, 0],
            scale: [1, 1.1, 0.9, 1],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>
    </div>
  );
};

export default GradientMesh;