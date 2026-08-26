import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import GradientMesh from './GradientMesh';
import ParticleField from './ParticleField';

export const PersistentBackground: React.FC = () => {
  const location = useLocation();
  const showBackground = !location.pathname.includes('/flight-demo');

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    if (!showBackground) return;

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

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        cancelAnimationFrame(mouseRafId);
        mouseRafId = requestAnimationFrame(() => {
          const touch = e.touches[0];
          const x = (touch.clientX / window.innerWidth) - 0.5;
          const y = (touch.clientY / window.innerHeight) - 0.5;
          setMousePos({ x, y });
        });
      }
    };

    const handleScroll = () => {
      cancelAnimationFrame(scrollRafId);
      scrollRafId = requestAnimationFrame(() => {
        setScrollY(window.scrollY);
      });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Initial check
    setScrollY(window.scrollY);

    return () => {
      cancelAnimationFrame(mouseRafId);
      cancelAnimationFrame(scrollRafId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [showBackground]);

  if (!showBackground) return null;

  return (
    <>
      <GradientMesh mouseX={mousePos.x} mouseY={mousePos.y} scrollY={scrollY} />
      <ParticleField scrollY={scrollY} />
    </>
  );
};

export default PersistentBackground;
