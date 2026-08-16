import React, { useEffect, useRef } from 'react';

interface Box3D {
  gx: number; // Grid X
  gy: number; // Grid Y
  x: number;  // Base World X
  y: number;  // Base World Y
  baseZ: number;
  z: number;
  targetZ: number;
  vz: number;
  rotX: number;
  rotY: number;
  targetRotX: number;
  targetRotY: number;
  glow: number;
  targetGlow: number;
  hueOffset: number;
  idlePhase: number;
  colorTheme: 0 | 1 | 2; // 0: Active Clients (Sky/Indigo), 1: Realistic Voices (Emerald/Cyan), 2: Supported Languages (Purple/Fuchsia)
}

interface Ripple {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  strength: number;
  speed: number;
}

export const InteractiveBoxesBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animId: number;
    let lastTime = performance.now();

    // Canvas size
    let width = window.innerWidth;
    let height = window.innerHeight;

    // Mouse state
    const mouse = {
      x: -9999,
      y: -9999,
      worldX: -9999,
      worldY: -9999,
      isHovered: false,
      lastMoveTime: 0,
      prevX: 0,
      prevY: 0,
      speed: 0,
    };

    // Ripples array
    const ripples: Ripple[] = [];

    // Configuration
    const getGridConfig = (w: number) => {
      const isMobile = w < 768;
      const isTablet = w >= 768 && w < 1100;
      return {
        cols: isMobile ? 12 : isTablet ? 18 : 24,
        rows: isMobile ? 12 : isTablet ? 16 : 20,
        boxSize: isMobile ? 32 : isTablet ? 42 : 50,
        boxHeight: isMobile ? 16 : isTablet ? 22 : 28,
        gap: isMobile ? 10 : isTablet ? 14 : 18,
        influenceRadius: isMobile ? 160 : 260,
        maxLift: isMobile ? 55 : 85,
        maxTilt: 0.38, // radians
        cameraPitch: 58 * (Math.PI / 180), // 58 degrees tilt
        cameraYaw: -18 * (Math.PI / 180),  // -18 degrees isometric rotation
      };
    };

    let config = getGridConfig(width);
    let boxes: Box3D[] = [];

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

          // 3 Distinct Territorial Color Zones:
          // Zone 0 (Left): Active Clients (Sky/Indigo)
          // Zone 1 (Center): Realistic Voices (Emerald/Cyan)
          // Zone 2 (Right): Supported Languages (Purple/Fuchsia)
          const zoneRatio = (c + (rows - 1 - r) * 0.25) / ((cols - 1) + (rows - 1) * 0.25);
          let theme: 0 | 1 | 2;
          if (zoneRatio < 0.36) {
            theme = 0; // Active Clients (Sky Blue -> Indigo)
          } else if (zoneRatio < 0.68) {
            theme = 1; // Realistic Voices (Emerald -> Cyan)
          } else {
            theme = 2; // Supported Languages (Purple -> Fuchsia)
          }

          boxes.push({
            gx: c,
            gy: r,
            x: bx,
            y: by,
            baseZ: 0,
            z: 0,
            targetZ: 0,
            vz: 0,
            rotX: 0,
            rotY: 0,
            targetRotX: 0,
            targetRotY: 0,
            glow: 0,
            targetGlow: 0,
            hueOffset: (c * 7 + r * 11) % 40,
            idlePhase: distFromCenter * 0.015 + (c + r) * 0.2,
            colorTheme: theme,
          });
        }
      }
    };

    const handleResize = () => {
      if (!canvas) return;
      const parent = canvas.parentElement;
      width = parent?.clientWidth || window.innerWidth;
      height = parent?.clientHeight || window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);

      config = getGridConfig(width);
      initBoxes();
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    const resizeObserver = new ResizeObserver(() => handleResize());
    if (canvas.parentElement) {
      resizeObserver.observe(canvas.parentElement);
    }

    // 3D Matrix Projection Helpers
    const project3D = (
      x: number,
      y: number,
      z: number,
      centerX: number,
      centerY: number,
      pitch: number,
      yaw: number,
      focalLength: number,
      camDist: number
    ) => {
      const cosY = Math.cos(yaw);
      const sinY = Math.sin(yaw);
      const x1 = x * cosY - y * sinY;
      const y1 = x * sinY + y * cosY;
      const z1 = z;

      const cosP = Math.cos(pitch);
      const sinP = Math.sin(pitch);
      const x2 = x1;
      const y2 = y1 * cosP - z1 * sinP;
      const z2 = y1 * sinP + z1 * cosP + camDist;

      const scale = focalLength / Math.max(z2, 10);
      const sx = centerX + x2 * scale;
      const sy = centerY + y2 * scale;

      return { sx, sy, depth: z2, scale };
    };

    const unprojectMouseToGround = (
      mx: number,
      my: number,
      centerX: number,
      centerY: number,
      pitch: number,
      yaw: number,
      focalLength: number,
      camDist: number
    ) => {
      const dx = mx - centerX;
      const dy = my - centerY;

      const cosP = Math.cos(pitch);
      const sinP = Math.sin(pitch);
      const cosY = Math.cos(yaw);
      const sinY = Math.sin(yaw);

      const denom = dy * sinP + focalLength * cosP;
      if (Math.abs(denom) < 0.001) return { wx: 0, wy: 0 };

      const worldYCam = (dy * camDist) / denom;
      const scale = focalLength / (worldYCam * sinP + camDist);
      const worldXCam = dx / scale;

      const wx = worldXCam * cosY + worldYCam * sinY;
      const wy = -worldXCam * sinY + worldYCam * cosY;

      return { wx, wy };
    };

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const currentX = e.clientX - rect.left;
      const currentY = e.clientY - rect.top;

      const dx = currentX - mouse.prevX;
      const dy = currentY - mouse.prevY;
      mouse.speed = Math.sqrt(dx * dx + dy * dy);

      mouse.x = currentX;
      mouse.y = currentY;
      mouse.prevX = currentX;
      mouse.prevY = currentY;
      mouse.isHovered = true;
      mouse.lastMoveTime = performance.now();

      if (mouse.speed > 25 && ripples.length < 5) {
        const { wx, wy } = unprojectMouseToGround(
          mouse.x,
          mouse.y,
          width * 0.52,
          height * 0.48,
          config.cameraPitch,
          config.cameraYaw,
          width > 1200 ? 950 : 800,
          950
        );
        ripples.push({
          x: wx,
          y: wy,
          radius: 10,
          maxRadius: config.influenceRadius * 1.8,
          strength: Math.min(mouse.speed * 0.4, 30),
          speed: 12,
        });
      }
    };

    const onMouseLeave = () => {
      mouse.isHovered = false;
      mouse.x = -9999;
      mouse.y = -9999;
    };

    const onClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;

      const { wx, wy } = unprojectMouseToGround(
        clickX,
        clickY,
        width * 0.52,
        height * 0.48,
        config.cameraPitch,
        config.cameraYaw,
        width > 1200 ? 950 : 800,
        950
      );

      ripples.push({
        x: wx,
        y: wy,
        radius: 5,
        maxRadius: config.influenceRadius * 2.8,
        strength: 55,
        speed: 16,
      });
    };

    window.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('mouseleave', onMouseLeave);
    canvas.addEventListener('click', onClick);

    // Main Render Loop
    const render = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;

      const isDark = document.documentElement.classList.contains('dark');

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, width, height);

      const centerX = width * 0.52;
      const centerY = height * 0.48;
      const focalLength = width > 1200 ? 950 : width > 768 ? 850 : 700;
      const camDist = 950;

      let mouseWorldX = -9999;
      let mouseWorldY = -9999;
      if (mouse.isHovered) {
        const unproj = unprojectMouseToGround(
          mouse.x,
          mouse.y,
          centerX,
          centerY,
          config.cameraPitch,
          config.cameraYaw,
          focalLength,
          camDist
        );
        mouseWorldX = unproj.wx;
        mouseWorldY = unproj.wy;
      }

      for (let i = ripples.length - 1; i >= 0; i--) {
        const rip = ripples[i];
        rip.radius += rip.speed;
        rip.strength *= 0.94;
        if (rip.radius > rip.maxRadius || rip.strength < 0.2) {
          ripples.splice(i, 1);
        }
      }

      const timeSec = now * 0.001;

      boxes.forEach((box) => {
        const idleWave = Math.sin(timeSec * 1.8 + box.idlePhase) * 3.5;

        let mouseLift = 0;
        let mouseGlow = 0;
        let tiltX = 0;
        let tiltY = 0;

        if (mouse.isHovered) {
          const dx = box.x - mouseWorldX;
          const dy = box.y - mouseWorldY;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < config.influenceRadius) {
            const factor = Math.cos((dist / config.influenceRadius) * (Math.PI / 2));
            const factorSq = factor * factor;

            mouseLift = factorSq * config.maxLift;
            mouseGlow = factorSq;

            if (dist > 2) {
              const angle = Math.atan2(dy, dx);
              tiltX = -Math.sin(angle) * factor * config.maxTilt;
              tiltY = Math.cos(angle) * factor * config.maxTilt;
            }
          }
        }

        let rippleLift = 0;
        ripples.forEach((rip) => {
          const dx = box.x - rip.x;
          const dy = box.y - rip.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const diff = Math.abs(dist - rip.radius);
          if (diff < 45) {
            const wave = Math.cos((diff / 45) * (Math.PI / 2)) * rip.strength;
            rippleLift += wave;
            mouseGlow = Math.min(mouseGlow + wave * 0.02, 1.0);
          }
        });

        box.targetZ = idleWave + mouseLift + rippleLift;
        box.targetGlow = mouseGlow;
        box.targetRotX = tiltX;
        box.targetRotY = tiltY;

        const springK = 18.0;
        const damping = 0.82;
        const force = (box.targetZ - box.z) * springK;
        box.vz = (box.vz + force * dt) * damping;
        box.z += box.vz * dt;

        box.glow += (box.targetGlow - box.glow) * 0.18;
        box.rotX += (box.targetRotX - box.rotX) * 0.22;
        box.rotY += (box.targetRotY - box.rotY) * 0.22;
      });

      const { boxSize, boxHeight, cameraPitch, cameraYaw } = config;
      const halfS = boxSize / 2;

      interface RenderableBox {
        box: Box3D;
        depth: number;
        topVertices: { sx: number; sy: number }[];
        botVertices: { sx: number; sy: number }[];
        centerScreen: { sx: number; sy: number };
        scale: number;
      }

      const renderList: RenderableBox[] = [];

      for (let i = 0; i < boxes.length; i++) {
        const b = boxes[i];
        const h = boxHeight + Math.max(0, b.z * 0.4);
        const topZ = b.z + h;
        const botZ = 0;

        const cosRx = Math.cos(b.rotX);
        const sinRx = Math.sin(b.rotX);
        const cosRy = Math.cos(b.rotY);
        const sinRy = Math.sin(b.rotY);

        const corners = [
          { lx: -halfS, ly: -halfS },
          { lx: halfS, ly: -halfS },
          { lx: halfS, ly: halfS },
          { lx: -halfS, ly: halfS },
        ];

        const topVertices: { sx: number; sy: number }[] = [];
        const botVertices: { sx: number; sy: number }[] = [];

        for (let c = 0; c < 4; c++) {
          const { lx, ly } = corners[c];
          const tiltedZ = topZ + (lx * sinRy + ly * sinRx);

          const pTop = project3D(
            b.x + lx * cosRy,
            b.y + ly * cosRx,
            tiltedZ,
            centerX,
            centerY,
            cameraPitch,
            cameraYaw,
            focalLength,
            camDist
          );
          topVertices.push({ sx: pTop.sx, sy: pTop.sy });

          const pBot = project3D(
            b.x + lx,
            b.y + ly,
            botZ,
            centerX,
            centerY,
            cameraPitch,
            cameraYaw,
            focalLength,
            camDist
          );
          botVertices.push({ sx: pBot.sx, sy: pBot.sy });
        }

        const centerP = project3D(
          b.x,
          b.y,
          topZ * 0.5,
          centerX,
          centerY,
          cameraPitch,
          cameraYaw,
          focalLength,
          camDist
        );

        const margin = 120;
        if (
          centerP.sx > -margin &&
          centerP.sx < width + margin &&
          centerP.sy > -margin &&
          centerP.sy < height + margin
        ) {
          renderList.push({
            box: b,
            depth: centerP.depth,
            topVertices,
            botVertices,
            centerScreen: { sx: centerP.sx, sy: centerP.sy },
            scale: centerP.scale,
          });
        }
      }

      renderList.sort((a, b) => b.depth - a.depth);

      // Render Each 3D Box
      renderList.forEach((item) => {
        const { box: b, topVertices: tv, botVertices: bv } = item;
        const glow = b.glow;
        const isHoverActive = glow > 0.05;
        const theme = b.colorTheme; // 0: Active Clients, 1: Realistic Voices, 2: Supported Languages

        // Front Face
        ctx.beginPath();
        ctx.moveTo(tv[3].sx, tv[3].sy);
        ctx.lineTo(tv[2].sx, tv[2].sy);
        ctx.lineTo(bv[2].sx, bv[2].sy);
        ctx.lineTo(bv[3].sx, bv[3].sy);
        ctx.closePath();

        const frontGrad = ctx.createLinearGradient(tv[3].sx, tv[3].sy, bv[3].sx, bv[3].sy);
        if (isDark) {
          if (isHoverActive) {
            // Hover: Glows in specific theme color
            if (theme === 0) {
              // Active Clients (Sky Blue -> Indigo)
              frontGrad.addColorStop(0, `rgba(2, 132, 199, ${0.55 + glow * 0.4})`);
              frontGrad.addColorStop(1, `rgba(15, 23, 42, ${0.88 + glow * 0.1})`);
            } else if (theme === 1) {
              // Realistic Voices (Deep Forest Emerald -> Rich Jade)
              frontGrad.addColorStop(0, `rgba(4, 120, 87, ${0.75 + glow * 0.25})`);
              frontGrad.addColorStop(1, `rgba(10, 15, 30, ${0.9 + glow * 0.1})`);
            } else {
              // Supported Languages (Deep Royal Violet -> Rich Magenta)
              frontGrad.addColorStop(0, `rgba(109, 40, 217, ${0.75 + glow * 0.25})`);
              frontGrad.addColorStop(1, `rgba(10, 15, 30, ${0.9 + glow * 0.1})`);
            }
          } else {
            // Rest state: Clean, uniform deep navy glass
            frontGrad.addColorStop(0, 'rgba(30, 41, 59, 0.45)');
            frontGrad.addColorStop(1, 'rgba(15, 23, 42, 0.7)');
          }
        } else {
          // Light mode: Airy frosted glass
          if (isHoverActive) {
            // Active Clients (Sky Blue -> Indigo) exclusively
            frontGrad.addColorStop(0, `rgba(2, 132, 199, ${0.35 + glow * 0.3})`);
            frontGrad.addColorStop(1, `rgba(186, 230, 253, ${0.45 + glow * 0.2})`);
          } else {
            frontGrad.addColorStop(0, 'rgba(224, 231, 255, 0.3)');
            frontGrad.addColorStop(1, 'rgba(199, 210, 254, 0.42)');
          }
        }
        ctx.fillStyle = frontGrad;
        ctx.fill();

        // Right Face
        ctx.beginPath();
        ctx.moveTo(tv[2].sx, tv[2].sy);
        ctx.lineTo(tv[1].sx, tv[1].sy);
        ctx.lineTo(bv[1].sx, bv[1].sy);
        ctx.lineTo(bv[2].sx, bv[2].sy);
        ctx.closePath();

        const rightGrad = ctx.createLinearGradient(tv[2].sx, tv[2].sy, bv[2].sx, bv[2].sy);
        if (isDark) {
          if (isHoverActive) {
            if (theme === 0) {
              rightGrad.addColorStop(0, `rgba(99, 102, 241, ${0.45 + glow * 0.4})`);
              rightGrad.addColorStop(1, `rgba(10, 15, 30, ${0.9 + glow * 0.1})`);
            } else if (theme === 1) {
              rightGrad.addColorStop(0, `rgba(13, 148, 136, ${0.7 + glow * 0.25})`);
              rightGrad.addColorStop(1, `rgba(6, 78, 59, ${0.9 + glow * 0.1})`);
            } else {
              rightGrad.addColorStop(0, `rgba(147, 51, 234, ${0.7 + glow * 0.25})`);
              rightGrad.addColorStop(1, `rgba(112, 26, 117, ${0.9 + glow * 0.1})`);
            }
          } else {
            // Rest state: Clean, uniform deep navy shadow
            rightGrad.addColorStop(0, 'rgba(15, 23, 42, 0.55)');
            rightGrad.addColorStop(1, 'rgba(10, 15, 30, 0.75)');
          }
        } else {
          // Light mode
          if (isHoverActive) {
            rightGrad.addColorStop(0, `rgba(14, 165, 233, ${0.3 + glow * 0.35})`);
            rightGrad.addColorStop(1, `rgba(165, 180, 252, ${0.4 + glow * 0.2})`);
          } else {
            rightGrad.addColorStop(0, 'rgba(224, 242, 254, 0.25)');
            rightGrad.addColorStop(1, 'rgba(186, 230, 253, 0.35)');
          }
        }
        ctx.fillStyle = rightGrad;
        ctx.fill();

        // Top Face
        ctx.beginPath();
        ctx.moveTo(tv[0].sx, tv[0].sy);
        ctx.lineTo(tv[1].sx, tv[1].sy);
        ctx.lineTo(tv[2].sx, tv[2].sy);
        ctx.lineTo(tv[3].sx, tv[3].sy);
        ctx.closePath();

        const topGrad = ctx.createLinearGradient(tv[0].sx, tv[0].sy, tv[2].sx, tv[2].sy);
        if (isDark) {
          if (isHoverActive) {
            if (theme === 0) {
              // Active Clients: Sky Blue -> Indigo
              topGrad.addColorStop(0, `rgba(2, 132, 199, ${0.65 + glow * 0.35})`);
              topGrad.addColorStop(0.5, `rgba(56, 189, 248, ${0.75 + glow * 0.25})`);
              topGrad.addColorStop(1, `rgba(99, 102, 241, ${0.65 + glow * 0.35})`);
              ctx.shadowColor = `rgba(56, 189, 248, ${glow * 0.85})`;
            } else if (theme === 1) {
              // Realistic Voices: Deep Vibrant Forest Emerald -> Jade
              topGrad.addColorStop(0, `rgba(4, 120, 87, ${0.85 + glow * 0.15})`);
              topGrad.addColorStop(0.5, `rgba(5, 150, 105, ${0.9 + glow * 0.1})`);
              topGrad.addColorStop(1, `rgba(16, 185, 129, ${0.85 + glow * 0.15})`);
              ctx.shadowColor = `rgba(16, 185, 129, ${glow * 0.95})`;
            } else {
              // Supported Languages: Deep Royal Violet -> Rich Electric Purple
              topGrad.addColorStop(0, `rgba(109, 40, 217, ${0.85 + glow * 0.15})`);
              topGrad.addColorStop(0.5, `rgba(126, 34, 206, ${0.9 + glow * 0.1})`);
              topGrad.addColorStop(1, `rgba(162, 28, 175, ${0.85 + glow * 0.15})`);
              ctx.shadowColor = `rgba(168, 85, 247, ${glow * 0.95})`;
            }
            ctx.shadowBlur = 16 * glow;
          } else {
            // Dark Rest Mode: Uniform, clean, deep high-tech navy glass
            topGrad.addColorStop(0, 'rgba(30, 41, 59, 0.65)');
            topGrad.addColorStop(0.6, 'rgba(15, 23, 42, 0.75)');
            topGrad.addColorStop(1, 'rgba(15, 23, 42, 0.85)');
            ctx.shadowBlur = 0;
          }
        } else {
          // Light Mode: Exclusively Active Clients (Sky Blue -> Indigo)
          if (isHoverActive) {
            topGrad.addColorStop(0, `rgba(186, 230, 253, ${0.75 + glow * 0.25})`);
            topGrad.addColorStop(0.5, `rgba(224, 231, 255, ${0.85 + glow * 0.15})`);
            topGrad.addColorStop(1, `rgba(199, 210, 254, ${0.75 + glow * 0.25})`);
            ctx.shadowColor = `rgba(14, 165, 233, ${glow * 0.5})`;
            ctx.shadowBlur = 10 * glow;
          } else {
            topGrad.addColorStop(0, 'rgba(255, 255, 255, 0.6)');
            topGrad.addColorStop(0.5, 'rgba(240, 249, 255, 0.55)');
            topGrad.addColorStop(1, 'rgba(238, 242, 255, 0.45)');
            ctx.shadowBlur = 0;
          }
        }
        ctx.fillStyle = topGrad;
        ctx.fill();

        // Top Face Edge Stroke
        ctx.lineWidth = isHoverActive ? 1.6 : 0.85;
        if (isDark) {
          if (isHoverActive) {
            const strokeGrad = ctx.createLinearGradient(tv[0].sx, tv[0].sy, tv[2].sx, tv[2].sy);
            if (theme === 0) {
              strokeGrad.addColorStop(0, `rgba(56, 189, 248, ${0.85 + glow * 0.15})`);
              strokeGrad.addColorStop(1, `rgba(129, 140, 248, ${0.85 + glow * 0.15})`);
            } else if (theme === 1) {
              strokeGrad.addColorStop(0, `rgba(16, 185, 129, 0.95)`);
              strokeGrad.addColorStop(1, `rgba(5, 150, 105, 0.95)`);
            } else {
              strokeGrad.addColorStop(0, `rgba(168, 85, 247, 0.95)`);
              strokeGrad.addColorStop(1, `rgba(217, 70, 239, 0.95)`);
            }
            ctx.strokeStyle = strokeGrad;
          } else {
            // Rest state: Clean, uniform subtle indigo glass stroke
            ctx.strokeStyle = 'rgba(99, 102, 241, 0.22)';
          }
        } else {
          // Light mode: Active Clients Sky-Indigo stroke
          if (isHoverActive) {
            const strokeGrad = ctx.createLinearGradient(tv[0].sx, tv[0].sy, tv[2].sx, tv[2].sy);
            strokeGrad.addColorStop(0, `rgba(2, 132, 199, ${0.85 + glow * 0.15})`);
            strokeGrad.addColorStop(1, `rgba(79, 70, 229, ${0.85 + glow * 0.15})`);
            ctx.strokeStyle = strokeGrad;
          } else {
            ctx.strokeStyle = 'rgba(99, 102, 241, 0.14)';
          }
        }
        ctx.stroke();

        // Center dot / Micro Accent Glyph on top face
        if (isHoverActive && glow > 0.15) {
          const midX = (tv[0].sx + tv[2].sx) / 2;
          const midY = (tv[0].sy + tv[2].sy) / 2;
          ctx.beginPath();
          ctx.arc(midX, midY, 2.4 + glow * 1.6, 0, Math.PI * 2);

          if (isDark) {
            ctx.fillStyle = `rgba(255, 255, 255, ${0.6 + glow * 0.4})`;
            ctx.shadowColor = theme === 0 ? '#38bdf8' : theme === 1 ? '#10b981' : '#a855f7';
          } else {
            ctx.fillStyle = '#0284c7';
            ctx.shadowColor = '#38bdf8';
          }
          ctx.shadowBlur = 10;
          ctx.fill();
        }

        ctx.shadowBlur = 0;
      });

      ctx.restore();
      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', onMouseMove);
      if (canvas) {
        canvas.removeEventListener('mouseleave', onMouseLeave);
        canvas.removeEventListener('click', onClick);
      }
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <div
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

      {/* Subtle bottom fade gradient to seamlessly blend into page sections */}
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
