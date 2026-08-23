import React, { useEffect, useRef } from 'react';

interface Box3D {
  gx: number;
  gy: number;
  x: number;
  y: number;
  z: number;
  targetZ: number;
  vz: number;
  rotX: number;
  rotY: number;
  targetRotX: number;
  targetRotY: number;
  glow: number;
  targetGlow: number;
  idlePhase: number;
  colorTheme: 0 | 1 | 2; // 0: Sky/Indigo, 1: Emerald/Cyan, 2: Purple/Fuchsia
}

interface Ripple {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  strength: number;
  speed: number;
}

// ═══════════════════════════════════════════════════════════
// PRE-COMPUTED COLOR PALETTES (ZERO STRING ALLOCATIONS IN RAF)
// ═══════════════════════════════════════════════════════════
const GLOW_STEPS = 10;

// Pre-generated color lookup arrays to eliminate GC pressure
const COLOR_TABLE_DARK = {
  front: [
    Array.from({ length: GLOW_STEPS + 1 }, (_, i) => `rgba(2, 132, 199, ${(0.45 + (i / GLOW_STEPS) * 0.35).toFixed(3)})`),
    Array.from({ length: GLOW_STEPS + 1 }, (_, i) => `rgba(4, 120, 87, ${(0.45 + (i / GLOW_STEPS) * 0.35).toFixed(3)})`),
    Array.from({ length: GLOW_STEPS + 1 }, (_, i) => `rgba(109, 40, 217, ${(0.45 + (i / GLOW_STEPS) * 0.35).toFixed(3)})`),
  ],
  frontIdle: 'rgba(15, 23, 42, 0.65)',
  right: [
    Array.from({ length: GLOW_STEPS + 1 }, (_, i) => `rgba(99, 102, 241, ${(0.35 + (i / GLOW_STEPS) * 0.35).toFixed(3)})`),
    Array.from({ length: GLOW_STEPS + 1 }, (_, i) => `rgba(13, 148, 136, ${(0.35 + (i / GLOW_STEPS) * 0.35).toFixed(3)})`),
    Array.from({ length: GLOW_STEPS + 1 }, (_, i) => `rgba(147, 51, 234, ${(0.35 + (i / GLOW_STEPS) * 0.35).toFixed(3)})`),
  ],
  rightIdle: 'rgba(10, 15, 30, 0.75)',
  top: [
    Array.from({ length: GLOW_STEPS + 1 }, (_, i) => `rgba(56, 189, 248, ${(0.6 + (i / GLOW_STEPS) * 0.35).toFixed(3)})`),
    Array.from({ length: GLOW_STEPS + 1 }, (_, i) => `rgba(16, 185, 129, ${(0.65 + (i / GLOW_STEPS) * 0.3).toFixed(3)})`),
    Array.from({ length: GLOW_STEPS + 1 }, (_, i) => `rgba(168, 85, 247, ${(0.65 + (i / GLOW_STEPS) * 0.3).toFixed(3)})`),
  ],
  topIdle: 'rgba(30, 41, 59, 0.6)',
  outline: [
    Array.from({ length: GLOW_STEPS + 1 }, (_, i) => `rgba(56, 189, 248, ${(0.85 + (i / GLOW_STEPS) * 0.15).toFixed(3)})`),
    Array.from({ length: GLOW_STEPS + 1 }, (_, i) => `rgba(52, 211, 153, ${(0.85 + (i / GLOW_STEPS) * 0.15).toFixed(3)})`),
    Array.from({ length: GLOW_STEPS + 1 }, (_, i) => `rgba(216, 180, 254, ${(0.85 + (i / GLOW_STEPS) * 0.15).toFixed(3)})`),
  ],
  outlineIdle: 'rgba(99, 102, 241, 0.18)',
  dotRing: [
    Array.from({ length: GLOW_STEPS + 1 }, (_, i) => `rgba(56, 189, 248, ${((i / GLOW_STEPS) * 0.35).toFixed(3)})`),
    Array.from({ length: GLOW_STEPS + 1 }, (_, i) => `rgba(16, 185, 129, ${((i / GLOW_STEPS) * 0.35).toFixed(3)})`),
    Array.from({ length: GLOW_STEPS + 1 }, (_, i) => `rgba(168, 85, 247, ${((i / GLOW_STEPS) * 0.35).toFixed(3)})`),
  ],
};

const COLOR_TABLE_LIGHT = {
  front: Array.from({ length: GLOW_STEPS + 1 }, (_, i) => `rgba(2, 132, 199, ${(0.25 + (i / GLOW_STEPS) * 0.3).toFixed(3)})`),
  frontIdle: 'rgba(219, 234, 254, 0.45)',
  right: Array.from({ length: GLOW_STEPS + 1 }, (_, i) => `rgba(14, 165, 233, ${(0.22 + (i / GLOW_STEPS) * 0.3).toFixed(3)})`),
  rightIdle: 'rgba(191, 219, 254, 0.35)',
  top: Array.from({ length: GLOW_STEPS + 1 }, (_, i) => `rgba(186, 230, 253, ${(0.65 + (i / GLOW_STEPS) * 0.3).toFixed(3)})`),
  topIdle: 'rgba(255, 255, 255, 0.65)',
  outline: Array.from({ length: GLOW_STEPS + 1 }, (_, i) => `rgba(2, 132, 199, ${(0.75 + (i / GLOW_STEPS) * 0.25).toFixed(3)})`),
  outlineIdle: 'rgba(99, 102, 241, 0.15)',
  dotRing: Array.from({ length: GLOW_STEPS + 1 }, (_, i) => `rgba(2, 132, 199, ${((i / GLOW_STEPS) * 0.3).toFixed(3)})`),
};

export const InteractiveBoxesBackground: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d', { alpha: true, desynchronized: true });
    if (!ctx) return;

    let animId: number = 0;
    let lastTime = performance.now();
    let isVisible = true;

    // Viewport dimensions
    let width = container.clientWidth || window.innerWidth;
    let height = container.clientHeight || window.innerHeight;
    let cachedRect = canvas.getBoundingClientRect();

    // Mouse coordinates (decoupled to eliminate mouse event lag)
    const mouse = {
      rawX: -9999,
      rawY: -9999,
      x: -9999,
      y: -9999,
      prevX: 0,
      prevY: 0,
      speed: 0,
      isHovered: false,
    };

    const ripples: Ripple[] = [];

    // Highly optimized grid layout with reduced count for smooth 60+ FPS on all devices
    const getGridConfig = (w: number) => {
      const isMobile = w < 640;
      const isTablet = w >= 640 && w < 1024;
      return {
        cols: isMobile ? 6 : isTablet ? 8 : 10,
        rows: isMobile ? 7 : isTablet ? 8 : 9,
        boxSize: isMobile ? 46 : isTablet ? 56 : 66,
        boxHeight: isMobile ? 20 : isTablet ? 26 : 32,
        gap: isMobile ? 12 : isTablet ? 16 : 20,
        influenceRadius: isMobile ? 160 : isTablet ? 220 : 270,
        maxLift: isMobile ? 45 : 65,
        maxTilt: 0.3,
        cameraPitch: 58 * (Math.PI / 180),
        cameraYaw: -18 * (Math.PI / 180),
      };
    };

    let config = getGridConfig(width);
    let boxes: Box3D[] = [];
    let sortedIndices: number[] = [];

    const initBoxes = () => {
      boxes = [];
      const { cols, rows, boxSize, gap } = config;
      const spacing = boxSize + gap;
      const startX = -((cols - 1) * spacing) / 2;
      const startY = -((rows - 1) * spacing) / 2;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const bx = startX + c * spacing;
          const by = startY + r * spacing;
          const distFromCenter = Math.sqrt(bx * bx + by * by);

          const zoneRatio = (c + (rows - 1 - r) * 0.25) / ((cols - 1) + (rows - 1) * 0.25);
          let theme: 0 | 1 | 2;
          if (zoneRatio < 0.36) {
            theme = 0; // Sky Blue -> Indigo
          } else if (zoneRatio < 0.68) {
            theme = 1; // Emerald -> Cyan
          } else {
            theme = 2; // Purple -> Fuchsia
          }

          boxes.push({
            gx: c,
            gy: r,
            x: bx,
            y: by,
            z: 0,
            targetZ: 0,
            vz: 0,
            rotX: 0,
            rotY: 0,
            targetRotX: 0,
            targetRotY: 0,
            glow: 0,
            targetGlow: 0,
            idlePhase: distFromCenter * 0.015 + (c + r) * 0.22,
            colorTheme: theme,
          });
        }
      }

      // Pre-compute isometric render order (Back-to-Front: lowest row first, highest col first)
      sortedIndices = boxes
        .map((_, idx) => idx)
        .sort((a, b) => {
          const ba = boxes[a];
          const bb = boxes[b];
          const depthA = ba.gy - ba.gx * 0.32;
          const depthB = bb.gy - bb.gx * 0.32;
          return depthA - depthB;
        });
    };

    const handleResize = () => {
      if (!container || !canvas) return;
      width = container.clientWidth || window.innerWidth;
      height = container.clientHeight || window.innerHeight;
      cachedRect = canvas.getBoundingClientRect();

      // Cap DPR to 1.25 max to drastically eliminate fillrate bottleneck on laptops & 4K displays
      const dpr = Math.min(window.devicePixelRatio || 1, 1.25);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);

      config = getGridConfig(width);
      initBoxes();
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', () => {
      if (canvas) cachedRect = canvas.getBoundingClientRect();
    }, { passive: true });

    // 3D projection trigonometry
    const cosPitch = Math.cos(config.cameraPitch);
    const sinPitch = Math.sin(config.cameraPitch);
    const cosYaw = Math.cos(config.cameraYaw);
    const sinYaw = Math.sin(config.cameraYaw);

    const projectPoint = (
      px: number,
      py: number,
      pz: number,
      cx: number,
      cy: number,
      focal: number,
      camDist: number,
      out: { sx: number; sy: number }
    ) => {
      const x1 = px * cosYaw - py * sinYaw;
      const y1 = px * sinYaw + py * cosYaw;
      const y2 = y1 * cosPitch - pz * sinPitch;
      const z2 = y1 * sinPitch + pz * cosPitch + camDist;
      const scale = focal / (z2 < 10 ? 10 : z2);
      out.sx = cx + x1 * scale;
      out.sy = cy + y2 * scale;
    };

    const unprojectMouseToGround = (
      mx: number,
      my: number,
      cx: number,
      cy: number,
      focal: number,
      camDist: number
    ) => {
      const dx = mx - cx;
      const dy = my - cy;
      const denom = dy * sinPitch + focal * cosPitch;
      if (Math.abs(denom) < 0.001) return { wx: 0, wy: 0 };

      const worldYCam = (dy * camDist) / denom;
      const scale = focal / (worldYCam * sinPitch + camDist);
      const worldXCam = dx / scale;

      const wx = worldXCam * cosYaw + worldYCam * sinYaw;
      const wy = -worldXCam * sinYaw + worldYCam * cosYaw;
      return { wx, wy };
    };

    // Reusable vertex cache (zero GC allocation in render loop)
    const tv = [
      { sx: 0, sy: 0 },
      { sx: 0, sy: 0 },
      { sx: 0, sy: 0 },
      { sx: 0, sy: 0 },
    ];
    const bv = [
      { sx: 0, sy: 0 },
      { sx: 0, sy: 0 },
      { sx: 0, sy: 0 },
      { sx: 0, sy: 0 },
    ];

    // High performance mouse tracking using cached rect
    const onMouseMove = (e: MouseEvent) => {
      mouse.rawX = e.clientX - cachedRect.left;
      mouse.rawY = e.clientY - cachedRect.top;
      mouse.isHovered = true;
    };

    const onMouseLeave = () => {
      mouse.isHovered = false;
      mouse.rawX = -9999;
      mouse.rawY = -9999;
      mouse.x = -9999;
      mouse.y = -9999;
    };

    const onClick = (e: MouseEvent) => {
      const clickX = e.clientX - cachedRect.left;
      const clickY = e.clientY - cachedRect.top;

      const centerX = width * 0.52;
      const centerY = height * 0.48;
      const focalLength = width > 1200 ? 920 : width > 768 ? 820 : 680;
      const camDist = 950;

      const { wx, wy } = unprojectMouseToGround(clickX, clickY, centerX, centerY, focalLength, camDist);

      if (ripples.length < 3) {
        ripples.push({
          x: wx,
          y: wy,
          radius: 5,
          maxRadius: config.influenceRadius * 2.0,
          strength: 40,
          speed: 16,
        });
      }
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    canvas.addEventListener('mouseleave', onMouseLeave, { passive: true });
    canvas.addEventListener('click', onClick, { passive: true });

    // IntersectionObserver to pause 100% of calculations when scrolled away
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        if (isVisible && !animId) {
          lastTime = performance.now();
          animId = requestAnimationFrame(render);
        }
      },
      { threshold: 0.05 }
    );
    observer.observe(container);

    const onVisibilityChange = () => {
      isVisible = !document.hidden;
      if (isVisible && !animId) {
        lastTime = performance.now();
        animId = requestAnimationFrame(render);
      }
    };
    document.addEventListener('visibilitychange', onVisibilityChange);

    // Main 60+ FPS Render Loop
    const render = (now: number) => {
      if (!isVisible) {
        animId = 0;
        return;
      }

      const dt = Math.min((now - lastTime) * 0.001, 0.033);
      lastTime = now;

      // Mouse smoothing
      if (mouse.isHovered) {
        const dx = mouse.rawX - mouse.prevX;
        const dy = mouse.rawY - mouse.prevY;
        mouse.speed = Math.sqrt(dx * dx + dy * dy);
        mouse.x = mouse.rawX;
        mouse.y = mouse.rawY;
        mouse.prevX = mouse.rawX;
        mouse.prevY = mouse.rawY;
      }

      const isDark = document.documentElement.classList.contains('dark');
      const dpr = Math.min(window.devicePixelRatio || 1, 1.25);

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, width, height);

      const centerX = width * 0.52;
      const centerY = height * 0.48;
      const focalLength = width > 1200 ? 920 : width > 768 ? 820 : 680;
      const camDist = 950;

      let mouseWorldX = -9999;
      let mouseWorldY = -9999;
      if (mouse.isHovered) {
        const unproj = unprojectMouseToGround(mouse.x, mouse.y, centerX, centerY, focalLength, camDist);
        mouseWorldX = unproj.wx;
        mouseWorldY = unproj.wy;

        if (mouse.speed > 45 && ripples.length < 2) {
          ripples.push({
            x: mouseWorldX,
            y: mouseWorldY,
            radius: 8,
            maxRadius: config.influenceRadius * 1.4,
            strength: Math.min(mouse.speed * 0.25, 20),
            speed: 14,
          });
        }
      }

      // Update ripples
      for (let i = ripples.length - 1; i >= 0; i--) {
        const rip = ripples[i];
        rip.radius += rip.speed;
        rip.strength *= 0.92;
        if (rip.radius > rip.maxRadius || rip.strength < 0.3) {
          ripples.splice(i, 1);
        }
      }

      const timeSec = now * 0.001;
      const { boxSize, boxHeight, maxLift, maxTilt, influenceRadius } = config;
      const halfS = boxSize * 0.5;

      // Update Physics
      for (let i = 0; i < boxes.length; i++) {
        const b = boxes[i];
        const idleWave = Math.sin(timeSec * 1.5 + b.idlePhase) * 2.5;

        let mouseLift = 0;
        let mouseGlow = 0;
        let tiltX = 0;
        let tiltY = 0;

        if (mouse.isHovered) {
          const dx = b.x - mouseWorldX;
          const dy = b.y - mouseWorldY;
          const distSq = dx * dx + dy * dy;
          const inflSq = influenceRadius * influenceRadius;

          if (distSq < inflSq) {
            const dist = Math.sqrt(distSq);
            const factor = Math.cos((dist / influenceRadius) * (Math.PI / 2));
            const factorSq = factor * factor;

            mouseLift = factorSq * maxLift;
            mouseGlow = factorSq;

            if (dist > 3) {
              const angle = Math.atan2(dy, dx);
              tiltX = -Math.sin(angle) * factor * maxTilt;
              tiltY = Math.cos(angle) * factor * maxTilt;
            }
          }
        }

        let rippleLift = 0;
        for (let r = 0; r < ripples.length; r++) {
          const rip = ripples[r];
          const dx = b.x - rip.x;
          const dy = b.y - rip.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const diff = Math.abs(dist - rip.radius);
          if (diff < 35) {
            const wave = Math.cos((diff / 35) * (Math.PI / 2)) * rip.strength;
            rippleLift += wave;
            mouseGlow = Math.min(mouseGlow + wave * 0.025, 1.0);
          }
        }

        b.targetZ = idleWave + mouseLift + rippleLift;
        b.targetGlow = mouseGlow;
        b.targetRotX = tiltX;
        b.targetRotY = tiltY;

        // Smooth spring physics
        const force = (b.targetZ - b.z) * 18.0;
        b.vz = (b.vz + force * dt) * 0.82;
        b.z += b.vz * dt;

        b.glow += (b.targetGlow - b.glow) * 0.22;
        b.rotX += (b.targetRotX - b.rotX) * 0.25;
        b.rotY += (b.targetRotY - b.rotY) * 0.25;
      }

      // Base Corner Offsets
      const cLx = [-halfS, halfS, halfS, -halfS];
      const cLy = [-halfS, -halfS, halfS, halfS];

      // Draw all 3D boxes in pre-sorted depth order
      for (let s = 0; s < sortedIndices.length; s++) {
        const b = boxes[sortedIndices[s]];
        const h = boxHeight + Math.max(0, b.z * 0.35);
        const topZ = b.z + h;
        const botZ = 0;

        const cosRx = Math.cos(b.rotX);
        const sinRx = Math.sin(b.rotX);
        const cosRy = Math.cos(b.rotY);
        const sinRy = Math.sin(b.rotY);

        for (let c = 0; c < 4; c++) {
          const lx = cLx[c];
          const ly = cLy[c];
          const tiltedZ = topZ + (lx * sinRy + ly * sinRx);

          projectPoint(
            b.x + lx * cosRy,
            b.y + ly * cosRx,
            tiltedZ,
            centerX,
            centerY,
            focalLength,
            camDist,
            tv[c]
          );

          projectPoint(
            b.x + lx,
            b.y + ly,
            botZ,
            centerX,
            centerY,
            focalLength,
            camDist,
            bv[c]
          );
        }

        // View frustum culling
        if (
          tv[2].sx < -80 ||
          tv[0].sx > width + 80 ||
          tv[2].sy < -80 ||
          bv[2].sy > height + 80
        ) {
          continue;
        }

        const glow = b.glow;
        const isHover = glow > 0.03;
        const glowStep = Math.min(GLOW_STEPS, Math.max(0, Math.round(glow * GLOW_STEPS)));
        const theme = b.colorTheme;

        // ── 1. Front Face (South Face) ──
        ctx.beginPath();
        ctx.moveTo(tv[3].sx, tv[3].sy);
        ctx.lineTo(tv[2].sx, tv[2].sy);
        ctx.lineTo(bv[2].sx, bv[2].sy);
        ctx.lineTo(bv[3].sx, bv[3].sy);
        ctx.closePath();

        if (isDark) {
          ctx.fillStyle = isHover ? COLOR_TABLE_DARK.front[theme][glowStep] : COLOR_TABLE_DARK.frontIdle;
        } else {
          ctx.fillStyle = isHover ? COLOR_TABLE_LIGHT.front[glowStep] : COLOR_TABLE_LIGHT.frontIdle;
        }
        ctx.fill();

        // ── 2. Right Face (East Face) ──
        ctx.beginPath();
        ctx.moveTo(tv[2].sx, tv[2].sy);
        ctx.lineTo(tv[1].sx, tv[1].sy);
        ctx.lineTo(bv[1].sx, bv[1].sy);
        ctx.lineTo(bv[2].sx, bv[2].sy);
        ctx.closePath();

        if (isDark) {
          ctx.fillStyle = isHover ? COLOR_TABLE_DARK.right[theme][glowStep] : COLOR_TABLE_DARK.rightIdle;
        } else {
          ctx.fillStyle = isHover ? COLOR_TABLE_LIGHT.right[glowStep] : COLOR_TABLE_LIGHT.rightIdle;
        }
        ctx.fill();

        // ── 3. Top Face (Main Illuminated Surface) ──
        ctx.beginPath();
        ctx.moveTo(tv[0].sx, tv[0].sy);
        ctx.lineTo(tv[1].sx, tv[1].sy);
        ctx.lineTo(tv[2].sx, tv[2].sy);
        ctx.lineTo(tv[3].sx, tv[3].sy);
        ctx.closePath();

        if (isDark) {
          ctx.fillStyle = isHover ? COLOR_TABLE_DARK.top[theme][glowStep] : COLOR_TABLE_DARK.topIdle;
        } else {
          ctx.fillStyle = isHover ? COLOR_TABLE_LIGHT.top[glowStep] : COLOR_TABLE_LIGHT.topIdle;
        }
        ctx.fill();

        // ── 4. Crisp Top Face Edge Outline ──
        ctx.lineWidth = isHover ? 1.3 : 0.8;
        if (isDark) {
          ctx.strokeStyle = isHover ? COLOR_TABLE_DARK.outline[theme][glowStep] : COLOR_TABLE_DARK.outlineIdle;
        } else {
          ctx.strokeStyle = isHover ? COLOR_TABLE_LIGHT.outline[glowStep] : COLOR_TABLE_LIGHT.outlineIdle;
        }
        ctx.stroke();

        // ── 5. Center Accent Micro Glow Dot (Rendered cleanly without shadowBlur) ──
        if (isHover && glow > 0.15) {
          const midX = (tv[0].sx + tv[2].sx) * 0.5;
          const midY = (tv[0].sy + tv[2].sy) * 0.5;
          const dotRadius = 2.0 + glow * 1.4;

          // Outer luminous ring
          ctx.beginPath();
          ctx.arc(midX, midY, dotRadius * 2.0, 0, Math.PI * 2);
          ctx.fillStyle = isDark
            ? COLOR_TABLE_DARK.dotRing[theme][glowStep]
            : COLOR_TABLE_LIGHT.dotRing[glowStep];
          ctx.fill();

          // Inner solid core
          ctx.beginPath();
          ctx.arc(midX, midY, dotRadius, 0, Math.PI * 2);
          ctx.fillStyle = isDark ? '#ffffff' : '#0284c7';
          ctx.fill();
        }
      }

      ctx.restore();
      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      if (animId) cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      if (canvas) {
        canvas.removeEventListener('mouseleave', onMouseLeave);
        canvas.removeEventListener('click', onClick);
      }
      observer.disconnect();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        zIndex: 1,
        pointerEvents: 'auto',
      }}
      aria-hidden="true"
    >
      <canvas
        ref={canvasRef}
        style={{
          width: '100%',
          height: '100%',
          display: 'block',
          position: 'absolute',
          inset: 0,
          pointerEvents: 'auto',
          cursor: 'default',
        }}
      />

      {/* Smooth bottom blend overlay */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '140px',
          background: 'linear-gradient(to bottom, transparent, var(--background))',
          pointerEvents: 'none',
        }}
      />
    </div>
  );
};

export default InteractiveBoxesBackground;
