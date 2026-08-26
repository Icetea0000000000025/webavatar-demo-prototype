import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

interface ParticleFieldProps {
  scrollY: number;
}

export const ParticleField: React.FC<ParticleFieldProps> = ({ scrollY }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scrollYRef = useRef(scrollY);
  const location = useLocation();
  const rgbColorsRef = useRef('79, 70, 229');

  // Sync scroll offset ref so canvas draw animation uses fresh offset without rebuilding canvas
  useEffect(() => {
    scrollYRef.current = scrollY;
  }, [scrollY]);

  // Update dynamic colors once when route/location changes, avoiding expensive frame-by-frame getComputedStyle queries
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const updateColors = () => {
      const primaryVal = getComputedStyle(canvas).getPropertyValue('--primary').trim();
      if (primaryVal && primaryVal.startsWith('#')) {
        const r = parseInt(primaryVal.slice(1, 3), 16);
        const g = parseInt(primaryVal.slice(3, 5), 16);
        const b = parseInt(primaryVal.slice(5, 7), 16);
        if (!isNaN(r) && !isNaN(g) && !isNaN(b)) {
          rgbColorsRef.current = `${r}, ${g}, ${b}`;
          return;
        }
      }
      rgbColorsRef.current = '79, 70, 229'; // Default indigo
    };

    updateColors();
    
    // Also schedule update a tiny bit later to ensure DOM has painted the styles on route change
    const timer = setTimeout(updateColors, 100);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    const isMobile = window.innerWidth < 768;
    const dpr = isMobile ? 1.0 : Math.min(window.devicePixelRatio || 1, 1.5);
    let width = (canvas.width = Math.floor(window.innerWidth * dpr));
    let height = (canvas.height = Math.floor(window.innerHeight * dpr));

    const particles: Particle[] = [];
    const particleCount = isMobile
      ? Math.min(Math.floor((window.innerWidth * window.innerHeight) / 22000), 24)
      : Math.min(Math.floor((window.innerWidth * window.innerHeight) / 9000), 75);

    const mouse = {
      x: -1000,
      y: -1000,
      radius: 140,
    };

    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      baseOpacity: number;
      opacity: number;

      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.2 * dpr;
        this.vy = ((Math.random() - 0.5) * 0.2 - 0.05) * dpr;
        this.radius = (Math.random() * 2.5 + 2.5) * dpr;
        this.baseOpacity = Math.random() * 0.25 + 0.22;
        this.opacity = this.baseOpacity;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        // Wrap around boundaries
        if (this.x < 0) this.x = width;
        if (this.x > width) this.x = 0;
        if (this.y < 0) this.y = height;
        if (this.y > height) this.y = 0;

        // Interaction with mouse - use squared distance first to avoid expensive Math.sqrt for non-interacting particles
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const distSq = dx * dx + dy * dy;
        const radiusSq = (mouse.radius * dpr) * (mouse.radius * dpr);

        if (distSq < radiusSq) {
          const dist = Math.sqrt(distSq);
          if (dist > 0) {
            const force = (mouse.radius * dpr - dist) / (mouse.radius * dpr);
            this.x -= (dx / dist) * force * 3.5;
            this.y -= (dy / dist) * force * 3.5;
          }
          this.opacity = Math.min(this.baseOpacity * 2.2, 0.7);
        } else {
          if (this.opacity > this.baseOpacity) {
            this.opacity -= 0.01;
          }
        }
      }

      draw(c: CanvasRenderingContext2D, currentScrollY: number) {
        // Draw with scroll parallax offset
        let drawY = this.y - (currentScrollY * 0.12 * dpr);
        
        // Wrap drawY inside screen height bounds
        drawY = ((drawY % height) + height) % height;

        // Read color from cached ref to avoid layout thrashing
        const rgbColors = rgbColorsRef.current;

        c.beginPath();
        c.arc(this.x, drawY, this.radius, 0, Math.PI * 2);
        c.fillStyle = `rgba(${rgbColors}, ${this.opacity})`;
        c.fill();
      }
    }

    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX * dpr;
      mouse.y = e.clientY * dpr;
    };

    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        mouse.x = e.touches[0].clientX * dpr;
        mouse.y = e.touches[0].clientY * dpr;
      }
    };

    const handleTouchEnd = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    canvas.addEventListener('mouseleave', handleMouseLeave, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchstart', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = Math.floor(window.innerWidth * dpr);
      height = canvas.height = Math.floor(window.innerHeight * dpr);
    };

    window.addEventListener('resize', handleResize, { passive: true });

    let isRunning = true;
    const onVisibilityChange = () => {
      if (document.hidden) {
        isRunning = false;
        cancelAnimationFrame(animationFrameId);
      } else {
        if (!isRunning) {
          isRunning = true;
          animationFrameId = requestAnimationFrame(animate);
        }
      }
    };
    document.addEventListener('visibilitychange', onVisibilityChange);

    const animate = () => {
      if (!isRunning) return;
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.update();
        p.draw(ctx, scrollYRef.current);
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      window.removeEventListener('mousemove', handleMouseMove);
      if (canvas) {
        canvas.removeEventListener('mouseleave', handleMouseLeave);
      }
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchstart', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 1,
        opacity: 0.8,
      }}
    />
  );
};

export default ParticleField;
