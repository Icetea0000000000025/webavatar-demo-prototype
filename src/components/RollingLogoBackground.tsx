import React, { useEffect, useRef } from 'react';
import logoLightBlue from '../assets/logo-new-light-blue-02.png';

interface SquareCoinParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  rotation: number;
  vRot: number;
  theme: 'indigo' | 'white';
  active: boolean;
}

interface SparkParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  decay: number;
}

export const RollingLogoBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const mouse = { x: -1000, y: -1000, radius: 140 };

    // Load logo-new-light-blue-02 image
    const img = new Image();
    img.src = logoLightBlue;
    let isImageLoaded = false;
    img.onload = () => {
      isImageLoaded = true;
    };

    const resizeCanvas = () => {
      if (!canvas) return;
      const parent = canvas.parentElement;
      const w = parent?.clientWidth || window.innerWidth || 800;
      const h = parent?.clientHeight || window.innerHeight || 600;
      if (w > 0 && h > 0) {
        canvas.width = w;
        canvas.height = h;
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    const resizeObserver = new ResizeObserver(() => resizeCanvas());
    if (canvas.parentElement) {
      resizeObserver.observe(canvas.parentElement);
    }

    const isMobile = window.innerWidth < 768;
    const coinSize = isMobile ? 38 : 52;

    // Create square coins alternating between Indigo (Request Demo color) and White
    const maxCoins = 4;
    const coins: SquareCoinParticle[] = [];
    const themes: SquareCoinParticle['theme'][] = ['indigo', 'white', 'indigo', 'white'];

    for (let i = 0; i < maxCoins; i++) {
      coins.push({
        x: -coinSize * 3 - i * 400,
        y: -coinSize * 2 - i * 200,
        vx: 1.0,
        vy: 0.2,
        size: coinSize,
        rotation: 0,
        vRot: 0.02,
        theme: themes[i % themes.length],
        active: true,
      });
    }

    const sparks: SparkParticle[] = [];

    const addSparks = (x: number, y: number, color: string) => {
      const count = 3 + Math.floor(Math.random() * 3);
      for (let s = 0; s < count; s++) {
        const angle = -Math.PI * (0.2 + Math.random() * 0.6);
        const spd = 0.5 + Math.random() * 1.5;
        sparks.push({
          x,
          y,
          vx: Math.cos(angle) * spd,
          vy: Math.sin(angle) * spd,
          size: 1.2 + Math.random() * 1.8,
          color,
          alpha: 0.85,
          decay: 0.015 + Math.random() * 0.02,
        });
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    window.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const w = canvas.width;
      const h = canvas.height;
      const numSteps = isMobile ? 6 : 9;
      const stepW = w / numSteps;
      const stepH = h / numSteps;

      // 1. Draw Glassmorphic Stairs Line Structure
      ctx.save();
      ctx.lineWidth = 1.8;

      for (let i = 0; i < numSteps; i++) {
        const tx1 = i * stepW;
        const ty1 = i * stepH;
        const tx2 = (i + 1) * stepW;
        const ty2 = i * stepH;
        const ry2 = (i + 1) * stepH;

        // Tread (horizontal step line)
        const treadGrad = ctx.createLinearGradient(tx1, ty1, tx2, ty2);
        treadGrad.addColorStop(0, 'rgba(99, 102, 241, 0.2)');
        treadGrad.addColorStop(0.5, 'rgba(168, 85, 247, 0.3)');
        treadGrad.addColorStop(1, 'rgba(6, 182, 212, 0.2)');

        ctx.strokeStyle = treadGrad;
        ctx.shadowColor = 'rgba(99, 102, 241, 0.3)';
        ctx.shadowBlur = 6;
        ctx.beginPath();
        ctx.moveTo(tx1, ty1);
        ctx.lineTo(tx2, ty2);
        ctx.stroke();

        // Riser (vertical step line)
        const riserGrad = ctx.createLinearGradient(tx2, ty2, tx2, ry2);
        riserGrad.addColorStop(0, 'rgba(168, 85, 247, 0.2)');
        riserGrad.addColorStop(1, 'rgba(99, 102, 241, 0.1)');

        ctx.strokeStyle = riserGrad;
        ctx.beginPath();
        ctx.moveTo(tx2, ty2);
        ctx.lineTo(tx2, ry2);
        ctx.stroke();

        // Step corner dot
        ctx.fillStyle = 'rgba(199, 210, 254, 0.4)';
        ctx.beginPath();
        ctx.arc(tx2, ty2, 2.5, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      // 2. Update & Draw Sparkles
      for (let i = sparks.length - 1; i >= 0; i--) {
        const sp = sparks[i];
        sp.x += sp.vx;
        sp.y += sp.vy;
        sp.vy += 0.06;
        sp.alpha -= sp.decay;

        if (sp.alpha <= 0) {
          sparks.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = Math.max(0, sp.alpha);
        ctx.fillStyle = sp.color;
        ctx.shadowColor = sp.color;
        ctx.shadowBlur = 6;
        ctx.beginPath();
        ctx.arc(sp.x, sp.y, sp.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // 3. Process Square Coins Tumbling Down Stairs
      coins.forEach((c) => {
        const halfS = c.size / 2;
        const effRadius = halfS * 0.95;

        // Slow Physics
        c.vy += 0.08;
        c.x += c.vx;
        c.y += c.vy;

        // Current step index
        const stepIdx = Math.floor(c.x / stepW);
        const treadY = stepIdx * stepH;

        // Tread Collision
        if (c.x >= stepIdx * stepW && c.x < (stepIdx + 1) * stepW) {
          if (c.y + effRadius >= treadY && c.y - c.vy + effRadius <= treadY + 16) {
            c.y = treadY - effRadius;
            if (c.vy > 0.6) {
              c.vy = -c.vy * 0.28; // Soft bounce
              const sparkColor = c.theme === 'indigo' ? '#a5b4fc' : '#ffffff';
              addSparks(c.x, treadY, sparkColor);
            } else {
              c.vy = 0;
              c.vx = Math.min(c.vx + 0.03, 1.25); // Slow steady roll
            }
            c.vRot = c.vx / effRadius;
          }
        }

        // Tumbling rotation
        c.rotation += c.vRot;

        // Mouse Interactivity
        const dx = mouse.x - c.x;
        const dy = mouse.y - c.y;
        const distSq = dx * dx + dy * dy;
        if (distSq < mouse.radius * mouse.radius) {
          const dist = Math.sqrt(distSq);
          if (dist > 0) {
            const force = (mouse.radius - dist) / mouse.radius;
            c.vx -= (dx / dist) * force * 0.6;
            c.vy -= (dy / dist) * force * 0.8;
          }
        }

        // Reset Loop when square coin exits bottom right screen
        if (c.x > w + c.size * 3 || c.y > h + c.size * 3) {
          let minX = c.x;
          coins.forEach((other) => {
            if (other.x < minX) minX = other.x;
          });

          c.x = Math.min(-c.size * 3, minX - (380 + Math.random() * 120));
          c.y = c.x * (h / w) - c.size;
          c.vx = 0.9 + Math.random() * 0.2;
          c.vy = 0.2;
          c.rotation = 0;
        }

        // Render Flat 2D Square Particle
        if (c.x > -c.size * 4 && c.x < w + c.size * 4) {
          ctx.save();
          ctx.translate(c.x, c.y);
          ctx.rotate(c.rotation);

          const cornerRadius = c.size * 0.18;

          // High Contrast Shadow Glow
          ctx.shadowColor = c.theme === 'indigo' ? 'rgba(56, 189, 248, 0.5)' : 'rgba(99, 102, 241, 0.35)';
          ctx.shadowBlur = 10;

          // Clean High-Contrast Background Card
          // Use Deep Midnight Slate (#0f172a) for indigo theme so the light blue logo pops with 100% contrast!
          ctx.fillStyle = c.theme === 'indigo' ? '#0f172a' : '#ffffff';
          ctx.beginPath();
          if (typeof (ctx as any).roundRect === 'function') {
            (ctx as any).roundRect(-halfS, -halfS, c.size, c.size, cornerRadius);
          } else {
            const rx = -halfS, ry = -halfS, rw = c.size, rh = c.size, rr = cornerRadius;
            ctx.moveTo(rx + rr, ry);
            ctx.lineTo(rx + rw - rr, ry);
            ctx.quadraticCurveTo(rx + rw, ry, rx + rw, ry + rr);
            ctx.lineTo(rx + rw, ry + rh - rr);
            ctx.quadraticCurveTo(rx + rw, ry + rh, rx + rw - rr, ry + rh);
            ctx.lineTo(rx + rr, ry + rh);
            ctx.quadraticCurveTo(rx, ry + rh, rx, ry + rh - rr);
            ctx.lineTo(rx, ry + rr);
            ctx.quadraticCurveTo(rx, ry, rx + rr, ry);
          }
          ctx.fill();

          // Clean High-Contrast Border Outline
          ctx.lineWidth = 1.8;
          ctx.strokeStyle = c.theme === 'indigo' ? 'rgba(56, 189, 248, 0.85)' : 'rgba(99, 102, 241, 0.7)';
          ctx.stroke();

          // Draw Logo inside Block with high-contrast drop shadow
          if (isImageLoaded || img.complete) {
            const logoWidth = c.size * 0.68;
            const logoHeight = logoWidth;

            ctx.save();
            ctx.shadowColor = c.theme === 'indigo' ? 'rgba(56, 189, 248, 0.6)' : 'rgba(15, 23, 42, 0.25)';
            ctx.shadowBlur = 6;
            ctx.drawImage(img, -logoWidth / 2, -logoHeight / 2, logoWidth, logoHeight);
            ctx.restore();
          }

          ctx.restore();
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', resizeCanvas);
      if (canvas) {
        canvas.removeEventListener('mouseleave', handleMouseLeave);
      }
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 1,
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />
    </div>
  );
};

export default RollingLogoBackground;
