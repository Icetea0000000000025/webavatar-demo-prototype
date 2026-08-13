import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import GradientMesh from './GradientMesh';
import ParticleField from './ParticleField';

export const PersistentBackground: React.FC = () => {
  const location = useLocation();
  const showBackground = !location.pathname.includes('/flight-demo');


  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);
  const [isMobileOrTablet, setIsMobileOrTablet] = useState(false);

  useEffect(() => {
    const checkDevice = () => {
      const isSmallMobile = window.innerWidth < 640;
      setIsMobileOrTablet(isSmallMobile);
    };
    checkDevice();
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  useEffect(() => {
    if (!showBackground || isMobileOrTablet) return;

    let mouseRafId: number;
    let scrollRafId: number;

    const handleMouseMove = (e: MouseEvent) => {
      cancelAnimationFrame(mouseRafId);
      mouseRafId = requestAnimationFrame(() => {
        const x = (e.clientX / window.innerWidth) - 0.5;
        const y = (e.clientY / window.innerHeight) - 0.5;
        setMousePos({ x, y });
      });
    };

    const handleScroll = () => {
      cancelAnimationFrame(scrollRafId);
      scrollRafId = requestAnimationFrame(() => {
        setScrollY(window.scrollY);
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Initial check
    setScrollY(window.scrollY);

    return () => {
      cancelAnimationFrame(mouseRafId);
      cancelAnimationFrame(scrollRafId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [showBackground, isMobileOrTablet]);

  if (!showBackground) return null;

  // On mobile/tablet, render a static gradient background that matches the desktop look to keep text legible and free up CPU/GPU resources
  if (isMobileOrTablet) {
    return (
      <div
        style={{
          position: 'fixed',
          inset: 0,
          background: 'radial-gradient(circle at 10% 10%, rgba(99, 102, 241, 0.15) 0%, transparent 50%), radial-gradient(circle at 90% 30%, rgba(8, 145, 178, 0.12) 0%, transparent 50%), radial-gradient(circle at 30% 90%, rgba(147, 51, 234, 0.1) 0%, transparent 50%), var(--background)',
          zIndex: 0,
          pointerEvents: 'none'
        }}
      />
    );
  }

  return (
    <>
      <GradientMesh mouseX={mousePos.x} mouseY={mousePos.y} scrollY={scrollY} />
      <ParticleField scrollY={scrollY} />
    </>
  );
};

export default PersistentBackground;
