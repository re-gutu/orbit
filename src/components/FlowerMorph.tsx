import React, { useEffect, useRef } from 'react';
import { FRONT_LILY_URL, REVEAL_LILY_URL, TRAIL_CONSTANTS } from '../constants/poster';
import { TrailPoint } from '../types';

interface FlowerMorphProps {
  stageRef: React.RefObject<HTMLElement | null>;
}

export const FlowerMorph: React.FC<FlowerMorphProps> = ({ stageRef }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    const stage = stageRef.current;
    if (!container || !canvas || !stage) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    // Offscreen canvas for masking reveal layer
    const revealCanvas = document.createElement('canvas');
    const revealCtx = revealCanvas.getContext('2d', { alpha: true });
    if (!revealCtx) return;

    // Preload both images
    const frontImg = new Image();
    frontImg.crossOrigin = 'anonymous';
    frontImg.src = FRONT_LILY_URL;

    const revealImg = new Image();
    revealImg.crossOrigin = 'anonymous';
    revealImg.src = REVEAL_LILY_URL;

    let imagesLoaded = 0;
    const onImgLoad = () => {
      imagesLoaded++;
    };
    frontImg.onload = onImgLoad;
    revealImg.onload = onImgLoad;

    // Trail state
    const points: TrailPoint[] = [];
    let hovering = false;
    let headRadius = 0;
    let mouseX = 0;
    let mouseY = 0;
    let lastSampleX = -9999;
    let lastSampleY = -9999;
    let time = 0;
    let animationFrameId: number;

    const updatePointer = (clientX: number, clientY: number) => {
      hovering = true;
      const rect = container.getBoundingClientRect();
      mouseX = clientX - rect.left;
      mouseY = clientY - rect.top;
    };

    const handleMouseMove = (e: MouseEvent) => {
      updatePointer(e.clientX, e.clientY);
    };

    const handleMouseEnter = (e: MouseEvent) => {
      updatePointer(e.clientX, e.clientY);
    };

    const handleMouseLeave = () => {
      hovering = false;
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        updatePointer(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        updatePointer(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    const handleTouchEnd = () => {
      hovering = false;
    };

    stage.addEventListener('mousemove', handleMouseMove);
    stage.addEventListener('mouseenter', handleMouseEnter);
    stage.addEventListener('mouseleave', handleMouseLeave);
    stage.addEventListener('touchstart', handleTouchStart, { passive: true });
    stage.addEventListener('touchmove', handleTouchMove, { passive: true });
    stage.addEventListener('touchend', handleTouchEnd);

    function drawMorphBlob(
      targetCtx: CanvasRenderingContext2D,
      cx: number,
      cy: number,
      r: number,
      t: number,
      seed: number
    ) {
      if (r < 2) return;
      const pts: { x: number; y: number }[] = [];
      for (let i = 0; i < TRAIL_CONSTANTS.TRAIL_BLOB_PTS; i++) {
        const angle = (i / TRAIL_CONSTANTS.TRAIL_BLOB_PTS) * Math.PI * 2;
        const n1 = Math.sin(angle * 3 + t * 1.4 + seed) * 0.45;
        const n2 = Math.sin(angle * 5 - t * 0.9 + seed * 2.3) * 0.3;
        const n3 = Math.cos(angle * 2 + t * 1.8 + seed * 0.7) * 0.25;
        const noise = (n1 + n2 + n3) * TRAIL_CONSTANTS.TRAIL_NOISE_AMP * (r / 140);
        const rad = Math.max(0, r + noise);
        pts.push({
          x: cx + Math.cos(angle) * rad,
          y: cy + Math.sin(angle) * rad,
        });
      }

      targetCtx.beginPath();
      const len = pts.length;
      const firstMid = {
        x: (pts[0].x + pts[len - 1].x) / 2,
        y: (pts[0].y + pts[len - 1].y) / 2,
      };
      targetCtx.moveTo(firstMid.x, firstMid.y);
      for (let i = 0; i < len; i++) {
        const next = pts[(i + 1) % len];
        const mid = {
          x: (pts[i].x + next.x) / 2,
          y: (pts[i].y + next.y) / 2,
        };
        targetCtx.quadraticCurveTo(pts[i].x, pts[i].y, mid.x, mid.y);
      }
      targetCtx.closePath();
      targetCtx.fill();
    }

    const render = () => {
      const rect = container.getBoundingClientRect();
      const w = Math.max(1, Math.round(rect.width));
      const h = Math.max(1, Math.round(rect.height));
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      if (canvas.width !== Math.round(w * dpr) || canvas.height !== Math.round(h * dpr)) {
        canvas.width = Math.round(w * dpr);
        canvas.height = Math.round(h * dpr);
        revealCanvas.width = Math.round(w * dpr);
        revealCanvas.height = Math.round(h * dpr);
      }

      const targetR = hovering ? TRAIL_CONSTANTS.TRAIL_HEAD_R : 0;
      headRadius += (targetR - headRadius) * (hovering ? 0.14 : 0.04);

      if (hovering && headRadius > 5) {
        const dx = mouseX - lastSampleX;
        const dy = mouseY - lastSampleY;
        const dist = Math.hypot(dx, dy);
        if (dist >= TRAIL_CONSTANTS.TRAIL_SAMPLE_DIST) {
          points.push({
            x: mouseX,
            y: mouseY,
            r: headRadius,
            alpha: 1,
            seed: Math.random() * 100,
          });
          if (points.length > TRAIL_CONSTANTS.TRAIL_MAX_POINTS) {
            points.shift();
          }
          lastSampleX = mouseX;
          lastSampleY = mouseY;
        }
      }

      for (let i = points.length - 1; i >= 0; i--) {
        points[i].alpha *= TRAIL_CONSTANTS.TRAIL_FADE_SPEED;
        points[i].r *= 0.995;
        if (points[i].alpha < 0.01) {
          points.splice(i, 1);
        }
      }

      time += 0.016;

      if (frontImg.complete && frontImg.naturalWidth > 0) {
        ctx.save();
        ctx.scale(dpr, dpr);
        ctx.clearRect(0, 0, w, h);

        // 1. Draw base FRONT lily
        ctx.globalCompositeOperation = 'source-over';
        ctx.globalAlpha = 1;
        ctx.drawImage(frontImg, 0, 0, w, h);

        const hasActiveTrail = points.length > 0 || (hovering && headRadius >= 2);

        if (hasActiveTrail && revealImg.complete && revealImg.naturalWidth > 0) {
          // 2. Punch holes in FRONT lily
          ctx.globalCompositeOperation = 'destination-out';
          ctx.fillStyle = '#ffffff';

          for (let i = 0; i < points.length; i++) {
            const pt = points[i];
            ctx.globalAlpha = pt.alpha;
            drawMorphBlob(ctx, pt.x, pt.y, pt.r, time, pt.seed);
          }

          if (hovering && headRadius >= 2) {
            ctx.globalAlpha = 1;
            drawMorphBlob(ctx, mouseX, mouseY, headRadius, time, 0);
          }

          // 3. Render REVEAL lily inside morph trail on offscreen canvas
          revealCtx.save();
          revealCtx.scale(dpr, dpr);
          revealCtx.clearRect(0, 0, w, h);

          revealCtx.globalCompositeOperation = 'source-over';
          revealCtx.fillStyle = '#ffffff';

          for (let i = 0; i < points.length; i++) {
            const pt = points[i];
            revealCtx.globalAlpha = pt.alpha;
            drawMorphBlob(revealCtx, pt.x, pt.y, pt.r, time, pt.seed);
          }

          if (hovering && headRadius >= 2) {
            revealCtx.globalAlpha = 1;
            drawMorphBlob(revealCtx, mouseX, mouseY, headRadius, time, 0);
          }

          // Mask reveal image into the morph blobs
          revealCtx.globalAlpha = 1;
          revealCtx.globalCompositeOperation = 'source-in';
          revealCtx.drawImage(revealImg, 0, 0, w, h);
          revealCtx.restore();

          // 4. Composite the reveal layer on top of punched front layer
          ctx.globalCompositeOperation = 'source-over';
          ctx.globalAlpha = 1;
          ctx.drawImage(revealCanvas, 0, 0, w, h);
        }

        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      stage.removeEventListener('mousemove', handleMouseMove);
      stage.removeEventListener('mouseenter', handleMouseEnter);
      stage.removeEventListener('mouseleave', handleMouseLeave);
      stage.removeEventListener('touchstart', handleTouchStart);
      stage.removeEventListener('touchmove', handleTouchMove);
      stage.removeEventListener('touchend', handleTouchEnd);
    };
  }, [stageRef]);

  return (
    <div className="flower" id="flower-stack" ref={containerRef}>
      {/* Sizer image sets intrinsic responsive width of .flower */}
      <img
        className="flower__sizer"
        src={FRONT_LILY_URL}
        alt=""
        aria-hidden="true"
      />
      {/* Canvas for hardware-accelerated, glitch-free morph trail & punch reveal */}
      <canvas
        ref={canvasRef}
        className="flower__canvas"
        aria-label="Pixel-art pink and violet lily with interactive reveal"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
        }}
      />
    </div>
  );
};
