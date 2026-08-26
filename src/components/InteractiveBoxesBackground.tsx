import React, { useEffect, useRef } from 'react';

interface Point2D {
  sx: number;
  sy: number;
}

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
  // Pre-projected static base vertices (zero math calculation during render loop)
  bv: [Point2D, Point2D, Point2D, Point2D];
  // Pre-calculated continuous smooth chromatic gradient lookups for this exact box
  frontColorsDark: string[];
  rightColorsDark: string[];
  topColorsDark: string[];
  outlineColorsDark: string[];
  dotColorsDark: string[];
}

interface Ripple {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  strength: number;
  speed: number;
}

const GLOW_STEPS = 10;

// Color math helpers
function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function lerpColor(c1: [number, number, number], c2: [number, number, number], t: number): [number, number, number] {
  return [
    Math.round(lerp(c1[0], c2[0], t)),
    Math.round(lerp(c1[1], c2[1], t)),
    Math.round(lerp(c1[2], c2[2], t)),
  ];
}

// Global static idle palette lookups
const COLOR_TABLE_DARK = {
  frontIdle: 'rgba(15, 23, 42, 0.65)',
  rightIdle: 'rgba(10, 15, 30, 0.75)',
  topIdle: 'rgba(30, 41, 59, 0.6)',
  outlineIdle: 'rgba(99, 102, 241, 0.18)',
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
    let slowFrameCount = 0;
    let throttleRate = 1; // 1 = 60fps, 2 = 30fps if device struggles

    // Device tier & reduced motion detection
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const isTouchDevice =
      typeof window !== 'undefined' &&
      (('ontouchstart' in window) || (navigator.maxTouchPoints > 0));

    const isLowPowerDevice =
      isTouchDevice ||
      (typeof navigator !== 'undefined' && (navigator.hardwareConcurrency || 4) <= 4) ||
      (typeof navigator !== 'undefined' && (navigator as any).deviceMemory && (navigator as any).deviceMemory < 4);

    // Viewport dimensions
    let width = container.clientWidth || window.innerWidth;
    let height = container.clientHeight || window.innerHeight;
    let cachedRect = canvas.getBoundingClientRect();

    // Mouse & touch coordinates (decoupled from event handlers)
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

    // Grid layout configuration (densified with high-efficiency 60+ FPS zero-GC renderer)
    const getGridConfig = (w: number) => {
      const isMobile = w < 640;
      const isTablet = w >= 640 && w < 1024;
      const isDesktop = w >= 1024 && w < 1440;

      if (isMobile) {
        return {
          cols: 10,
          rows: 12,
          boxSize: 34,
          boxHeight: 16,
          gap: 8,
          influenceRadius: 170,
          maxLift: 38,
          maxTilt: 0.25,
          cameraPitch: 56 * (Math.PI / 180),
          cameraYaw: -18 * (Math.PI / 180),
        };
      }

      if (isTablet || isLowPowerDevice) {
        return {
          cols: isTablet ? 11 : 14,
          rows: isTablet ? 9 : 11,
          boxSize: isTablet ? 44 : 48,
          boxHeight: isTablet ? 20 : 22,
          gap: isTablet ? 11 : 13,
          influenceRadius: isTablet ? 210 : 250,
          maxLift: isTablet ? 48 : 55,
          maxTilt: 0.26,
          cameraPitch: 58 * (Math.PI / 180),
          cameraYaw: -18 * (Math.PI / 180),
        };
      }

      return {
        cols: isDesktop ? 18 : 22,
        rows: isDesktop ? 14 : 16,
        boxSize: isDesktop ? 46 : 50,
        boxHeight: isDesktop ? 24 : 26,
        gap: isDesktop ? 13 : 15,
        influenceRadius: isDesktop ? 280 : 320,
        maxLift: 65,
        maxTilt: 0.3,
        cameraPitch: 58 * (Math.PI / 180),
        cameraYaw: -18 * (Math.PI / 180),
      };
    };

    let config = getGridConfig(width);
    let boxes: Box3D[] = [];
    let sortedIndices: number[] = [];

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
      out: Point2D
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

    const initBoxes = () => {
      boxes = [];
      const { cols, rows, boxSize, gap } = config;
      const spacing = boxSize + gap;
      const startX = -((cols - 1) * spacing) / 2;
      const startY = -((rows - 1) * spacing) / 2;

      const centerX = width < 640 ? width * 0.5 : width * 0.52;
      const centerY = width < 640 ? height * 0.5 : height * 0.48;
      const focalLength = width > 1200 ? 920 : width > 768 ? 820 : 640;
      const camDist = 950;

      const halfS = boxSize * 0.5;
      const cLx = [-halfS, halfS, halfS, -halfS];
      const cLy = [-halfS, -halfS, halfS, halfS];

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const bx = startX + c * spacing;
          const by = startY + r * spacing;
          const distFromCenter = Math.sqrt(bx * bx + by * by);

          // Pre-project static base vertices for this box (botZ = 0)
          const bv: [Point2D, Point2D, Point2D, Point2D] = [
            { sx: 0, sy: 0 },
            { sx: 0, sy: 0 },
            { sx: 0, sy: 0 },
            { sx: 0, sy: 0 },
          ];
          for (let k = 0; k < 4; k++) {
            projectPoint(
              bx + cLx[k],
              by + cLy[k],
              0,
              centerX,
              centerY,
              focalLength,
              camDist,
              bv[k]
            );
          }

          // ── Smooth 3-Color Diagonal Chromatic Spectrum ──
          // Smooth blend: Color 1 (Sky Blue) ──> Color 2 (Emerald/Cyan) ──> Color 3 (Purple/Fuchsia)
          const ratio = Math.min(1.0, Math.max(0.0, (c + r * 0.45) / ((cols - 1) + (rows - 1) * 0.45)));

          let topRGB: [number, number, number];
          let frontRGB: [number, number, number];
          let rightRGB: [number, number, number];
          let outlineRGB: [number, number, number];

          if (ratio <= 0.5) {
            // First Half: Sky Blue (#0ea5e9 / #38bdf8) -> Emerald (#10b981 / #34d399)
            const u = ratio / 0.5;
            topRGB = lerpColor([56, 189, 248], [16, 185, 129], u);
            frontRGB = lerpColor([2, 132, 199], [5, 150, 105], u);
            rightRGB = lerpColor([79, 70, 229], [13, 148, 136], u);
            outlineRGB = lerpColor([125, 211, 252], [52, 211, 153], u);
          } else {
            // Second Half: Emerald (#10b981 / #34d399) -> Purple/Fuchsia (#a855f7 / #e879f9)
            const u = (ratio - 0.5) / 0.5;
            topRGB = lerpColor([16, 185, 129], [168, 85, 247], u);
            frontRGB = lerpColor([5, 150, 105], [126, 34, 206], u);
            rightRGB = lerpColor([13, 148, 136], [192, 38, 211], u);
            outlineRGB = lerpColor([52, 211, 153], [216, 180, 254], u);
          }

          // Pre-generate quantized glow steps for this specific box (zero runtime memory allocation)
          const frontColorsDark = Array.from({ length: GLOW_STEPS + 1 }, (_, i) => {
            const alpha = 0.45 + (i / GLOW_STEPS) * 0.35;
            return `rgba(${frontRGB[0]}, ${frontRGB[1]}, ${frontRGB[2]}, ${alpha.toFixed(3)})`;
          });
          const rightColorsDark = Array.from({ length: GLOW_STEPS + 1 }, (_, i) => {
            const alpha = 0.35 + (i / GLOW_STEPS) * 0.35;
            return `rgba(${rightRGB[0]}, ${rightRGB[1]}, ${rightRGB[2]}, ${alpha.toFixed(3)})`;
          });
          const topColorsDark = Array.from({ length: GLOW_STEPS + 1 }, (_, i) => {
            const alpha = 0.60 + (i / GLOW_STEPS) * 0.35;
            return `rgba(${topRGB[0]}, ${topRGB[1]}, ${topRGB[2]}, ${alpha.toFixed(3)})`;
          });
          const outlineColorsDark = Array.from({ length: GLOW_STEPS + 1 }, (_, i) => {
            const alpha = 0.85 + (i / GLOW_STEPS) * 0.15;
            return `rgba(${outlineRGB[0]}, ${outlineRGB[1]}, ${outlineRGB[2]}, ${alpha.toFixed(3)})`;
          });
          const dotColorsDark = Array.from({ length: GLOW_STEPS + 1 }, (_, i) => {
            const alpha = (i / GLOW_STEPS) * 0.35;
            return `rgba(${topRGB[0]}, ${topRGB[1]}, ${topRGB[2]}, ${alpha.toFixed(3)})`;
          });

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
            bv,
            frontColorsDark,
            rightColorsDark,
            topColorsDark,
            outlineColorsDark,
            dotColorsDark,
          });
        }
      }

      // Pre-compute isometric render order (Back-to-Front)
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

      const dpr = isLowPowerDevice ? 1.0 : Math.min(window.devicePixelRatio || 1, 1.25);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);

      config = getGridConfig(width);
      initBoxes();
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    // Throttled scroll listener avoiding forced reflow / layout thrashing
    let scrollTicking = false;
    const handleScroll = () => {
      if (!scrollTicking) {
        scrollTicking = true;
        requestAnimationFrame(() => {
          if (canvas) cachedRect = canvas.getBoundingClientRect();
          scrollTicking = false;
        });
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Reusable vertex cache for top face
    const tv: [Point2D, Point2D, Point2D, Point2D] = [
      { sx: 0, sy: 0 },
      { sx: 0, sy: 0 },
      { sx: 0, sy: 0 },
      { sx: 0, sy: 0 },
    ];

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

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        cachedRect = canvas.getBoundingClientRect();
        mouse.rawX = e.touches[0].clientX - cachedRect.left;
        mouse.rawY = e.touches[0].clientY - cachedRect.top;
        mouse.isHovered = true;
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        mouse.rawX = e.touches[0].clientX - cachedRect.left;
        mouse.rawY = e.touches[0].clientY - cachedRect.top;
        mouse.isHovered = true;
      }
    };

    const onTouchEnd = () => {
      mouse.isHovered = false;
      mouse.rawX = -9999;
      mouse.rawY = -9999;
      mouse.x = -9999;
      mouse.y = -9999;
    };

    const onClick = (e: MouseEvent | TouchEvent) => {
      const clientX = 'touches' in e && e.touches.length > 0 ? e.touches[0].clientX : (e as MouseEvent).clientX;
      const clientY = 'touches' in e && e.touches.length > 0 ? e.touches[0].clientY : (e as MouseEvent).clientY;
      const clickX = clientX - cachedRect.left;
      const clickY = clientY - cachedRect.top;

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
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd, { passive: true });

    // IntersectionObserver to pause when hero is offscreen
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

    // Frame counter for dynamic frame-rate adaptation
    let frameCount = 0;

    // Main 60+ FPS Render Loop
    const render = (now: number) => {
      if (!isVisible) {
        animId = 0;
        return;
      }

      frameCount++;
      const rawDt = (now - lastTime) * 0.001;
      const dt = Math.min(rawDt, 0.033);
      lastTime = now;

      // Adaptive performance detection: if frames take > 28ms consistently, throttle physics
      if (rawDt > 0.028) {
        slowFrameCount++;
        if (slowFrameCount > 60) {
          throttleRate = 2; // Throttle to 30fps update
        }
      } else {
        if (slowFrameCount > 0) slowFrameCount--;
        if (slowFrameCount === 0) throttleRate = 1;
      }

      if (throttleRate > 1 && frameCount % throttleRate !== 0) {
        animId = requestAnimationFrame(render);
        return;
      }

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
      const dpr = isLowPowerDevice ? 1.0 : Math.min(window.devicePixelRatio || 1, 1.25);

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, width, height);

      const centerX = width < 640 ? width * 0.5 : width * 0.52;
      const centerY = width < 640 ? height * 0.5 : height * 0.48;
      const focalLength = width > 1200 ? 920 : width > 768 ? 820 : 640;
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

      const timeSec = prefersReducedMotion ? 0 : now * 0.001;
      const { boxSize, boxHeight, maxLift, maxTilt, influenceRadius } = config;
      const inflSq = influenceRadius * influenceRadius;
      const halfS = boxSize * 0.5;
      const cLx = [-halfS, halfS, halfS, -halfS];
      const cLy = [-halfS, -halfS, halfS, halfS];

      // Update Physics with fast AABB distance pruning
      for (let i = 0; i < boxes.length; i++) {
        const b = boxes[i];
        const idleWave = prefersReducedMotion ? 0 : Math.sin(timeSec * 1.5 + b.idlePhase) * 2.5;

        let mouseLift = 0;
        let mouseGlow = 0;
        let tiltX = 0;
        let tiltY = 0;

        if (mouse.isHovered) {
          const dx = b.x - mouseWorldX;
          const dy = b.y - mouseWorldY;
          const absDx = dx < 0 ? -dx : dx;
          const absDy = dy < 0 ? -dy : dy;

          // Fast AABB pre-check before expensive multiplication/sqrt
          if (absDx < influenceRadius && absDy < influenceRadius) {
            const distSq = dx * dx + dy * dy;
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
        }

        let rippleLift = 0;
        for (let r = 0; r < ripples.length; r++) {
          const rip = ripples[r];
          const dx = b.x - rip.x;
          const dy = b.y - rip.y;
          const absDx = dx < 0 ? -dx : dx;
          const absDy = dy < 0 ? -dy : dy;
          const maxCheck = rip.radius + 35;

          if (absDx < maxCheck && absDy < maxCheck) {
            const dist = Math.sqrt(dx * dx + dy * dy);
            const diff = Math.abs(dist - rip.radius);
            if (diff < 35) {
              const wave = Math.cos((diff / 35) * (Math.PI / 2)) * rip.strength;
              rippleLift += wave;
              mouseGlow = Math.min(mouseGlow + wave * 0.025, 1.0);
            }
          }
        }

        b.targetZ = idleWave + mouseLift + rippleLift;
        b.targetGlow = mouseGlow;
        b.targetRotX = tiltX;
        b.targetRotY = tiltY;

        // Spring physics
        const force = (b.targetZ - b.z) * 18.0;
        b.vz = (b.vz + force * dt) * 0.82;
        b.z += b.vz * dt;

        b.glow += (b.targetGlow - b.glow) * 0.22;
        b.rotX += (b.targetRotX - b.rotX) * 0.25;
        b.rotY += (b.targetRotY - b.rotY) * 0.25;
      }

      // Draw all 3D boxes in pre-sorted depth order
      for (let s = 0; s < sortedIndices.length; s++) {
        const b = boxes[sortedIndices[s]];
        const h = boxHeight + (b.z > 0 ? b.z * 0.35 : 0);
        const topZ = b.z + h;

        // Fast-path projection for non-tilted boxes (skips trigonometric calls & matrix math)
        const isTilted = Math.abs(b.rotX) > 0.002 || Math.abs(b.rotY) > 0.002;

        if (isTilted) {
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
          }
        } else {
          // Fast un-tilted calculation
          for (let c = 0; c < 4; c++) {
            projectPoint(
              b.x + cLx[c],
              b.y + cLy[c],
              topZ,
              centerX,
              centerY,
              focalLength,
              camDist,
              tv[c]
            );
          }
        }

        // View frustum culling using pre-projected base vertices and current top vertices
        if (
          tv[2].sx < -140 ||
          tv[0].sx > width + 140 ||
          tv[2].sy < -140 ||
          b.bv[2].sy > height + 140
        ) {
          continue;
        }

        const glow = b.glow;
        const isHover = glow > 0.03;
        const glowStep = Math.min(GLOW_STEPS, Math.max(0, Math.round(glow * GLOW_STEPS)));
        const baseVerts = b.bv;

        // ── 1. Front Face (South Face) ──
        ctx.beginPath();
        ctx.moveTo(tv[3].sx, tv[3].sy);
        ctx.lineTo(tv[2].sx, tv[2].sy);
        ctx.lineTo(baseVerts[2].sx, baseVerts[2].sy);
        ctx.lineTo(baseVerts[3].sx, baseVerts[3].sy);
        ctx.closePath();

        if (isDark) {
          ctx.fillStyle = isHover ? b.frontColorsDark[glowStep] : COLOR_TABLE_DARK.frontIdle;
        } else {
          ctx.fillStyle = isHover ? COLOR_TABLE_LIGHT.front[glowStep] : COLOR_TABLE_LIGHT.frontIdle;
        }
        ctx.fill();

        // ── 2. Right Face (East Face) ──
        ctx.beginPath();
        ctx.moveTo(tv[2].sx, tv[2].sy);
        ctx.lineTo(tv[1].sx, tv[1].sy);
        ctx.lineTo(baseVerts[1].sx, baseVerts[1].sy);
        ctx.lineTo(baseVerts[2].sx, baseVerts[2].sy);
        ctx.closePath();

        if (isDark) {
          ctx.fillStyle = isHover ? b.rightColorsDark[glowStep] : COLOR_TABLE_DARK.rightIdle;
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
          ctx.fillStyle = isHover ? b.topColorsDark[glowStep] : COLOR_TABLE_DARK.topIdle;
        } else {
          ctx.fillStyle = isHover ? COLOR_TABLE_LIGHT.top[glowStep] : COLOR_TABLE_LIGHT.topIdle;
        }
        ctx.fill();

        // ── 4. Crisp Top Face Edge Outline ──
        ctx.lineWidth = isHover ? 1.3 : 0.8;
        if (isDark) {
          ctx.strokeStyle = isHover ? b.outlineColorsDark[glowStep] : COLOR_TABLE_DARK.outlineIdle;
        } else {
          ctx.strokeStyle = isHover ? COLOR_TABLE_LIGHT.outline[glowStep] : COLOR_TABLE_LIGHT.outlineIdle;
        }
        ctx.stroke();

        // ── 5. Center Accent Micro Glow Dot ──
        if (isHover && glow > 0.15) {
          const midX = (tv[0].sx + tv[2].sx) * 0.5;
          const midY = (tv[0].sy + tv[2].sy) * 0.5;
          const dotRadius = 2.0 + glow * 1.4;

          // Outer luminous ring
          ctx.beginPath();
          ctx.arc(midX, midY, dotRadius * 2.0, 0, Math.PI * 2);
          ctx.fillStyle = isDark
            ? b.dotColorsDark[glowStep]
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
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
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
