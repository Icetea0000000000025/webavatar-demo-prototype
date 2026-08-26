import React from 'react';
import { motion } from 'framer-motion';

interface GradientMeshProps {
  mouseX: number;
  mouseY: number;
  scrollY: number;
}

export const GradientMesh: React.FC<GradientMeshProps> = ({ mouseX, mouseY, scrollY }) => {
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
      {/* Glow Blob 1 */}
      <div 
        style={{
          position: 'absolute',
          top: '-10%',
          left: '-10%',
          width: 'clamp(300px, 45vw, 650px)',
          height: 'clamp(300px, 45vw, 650px)',
          transform: `translate3d(${mouseX * 80}px, ${mouseY * 80 - scrollY * 0.15}px, 0)`,
          transition: 'transform 0.3s cubic-bezier(0.25, 1, 0.5, 1)',
          willChange: 'transform',
        }}
      >
        <motion.div
          className="transform-gpu"
          style={{
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            filter: 'blur(70px)',
            opacity: 0.35,
            background: 'radial-gradient(circle, #4F46E5 0%, rgba(79, 70, 229, 0) 70%)',
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

      {/* Glow Blob 2 */}
      <div 
        style={{
          position: 'absolute',
          top: '20%',
          right: '-10%',
          width: 'clamp(280px, 40vw, 600px)',
          height: 'clamp(280px, 40vw, 600px)',
          transform: `translate3d(${mouseX * -60}px, ${mouseY * -60 - scrollY * 0.25}px, 0)`,
          transition: 'transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)',
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
            opacity: 0.30,
            background: 'radial-gradient(circle, #0891B2 0%, rgba(8, 145, 178, 0) 70%)',
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

      {/* Glow Blob 3 */}
      <div 
        style={{
          position: 'absolute',
          bottom: '-10%',
          left: '25%',
          width: 'clamp(260px, 35vw, 550px)',
          height: 'clamp(260px, 35vw, 550px)',
          transform: `translate3d(${mouseX * 40}px, ${mouseY * 40 - scrollY * 0.35}px, 0)`,
          transition: 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)',
          willChange: 'transform',
        }}
      >
        <motion.div
          className="transform-gpu"
          style={{
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            filter: 'blur(70px)',
            opacity: 0.25,
            background: 'radial-gradient(circle, #9333EA 0%, rgba(147, 51, 234, 0) 70%)',
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