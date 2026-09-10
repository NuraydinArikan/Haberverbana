import { useEffect, useRef } from 'react';

/**
 * useAnimatedFavicon:
 * Renders the high-contrast, crisp white-ringed radar logo (the clear top logo chosen by user)
 * with a live rotating scanner beam in the browser tab favicon.
 * 
 * Quality & Performance Guarantees:
 * - 64x64 Hi-DPI rendering for razor-sharp antialiasing at 16x16 and 32x32 tab sizes.
 * - Solid pure-white concentric rings (#FFFFFF, 0.9 opacity) ensuring instant radar legibility.
 * - Vibrant crimson red gradient base (no dark mud/shadows).
 * - Bright emerald green deal blip at 2 o'clock with white core.
 * - 0 CPU usage when the browser tab is hidden/inactive.
 */
export function useAnimatedFavicon(enabled: boolean = true) {
  const angleRef = useRef(0);
  const animFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);

  useEffect(() => {
    if (!enabled || typeof window === 'undefined' || typeof document === 'undefined') return;

    // 64x64 Hi-DPI canvas for pristine sharpness
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let faviconLink = document.querySelector("link[rel~='icon']") as HTMLLinkElement | null;
    if (!faviconLink) {
      faviconLink = document.createElement('link');
      faviconLink.rel = 'icon';
      document.head.appendChild(faviconLink);
    }

    const drawRadar = (angle: number) => {
      ctx.clearRect(0, 0, 64, 64);

      // 1. High-contrast rounded badge background (#EF4444 -> #DC2626 -> #B91C1C)
      const radius = 15;
      ctx.beginPath();
      ctx.moveTo(radius, 2);
      ctx.lineTo(62 - radius, 2);
      ctx.quadraticCurveTo(62, 2, 62, radius);
      ctx.lineTo(62, 62 - radius);
      ctx.quadraticCurveTo(62, 62, 62 - radius, 62);
      ctx.lineTo(radius, 62);
      ctx.quadraticCurveTo(2, 62, 2, 62 - radius);
      ctx.lineTo(2, radius);
      ctx.quadraticCurveTo(2, 2, radius, 2);
      ctx.closePath();

      const bgGrad = ctx.createLinearGradient(0, 0, 64, 64);
      bgGrad.addColorStop(0, '#EF4444');
      bgGrad.addColorStop(0.6, '#DC2626');
      bgGrad.addColorStop(1, '#B91C1C');
      ctx.fillStyle = bgGrad;
      ctx.fill();

      // Subtle light border
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.lineWidth = 1.8;
      ctx.stroke();

      const cx = 32;
      const cy = 32;

      // 2. High-Contrast Pure White Concentric Rings (The distinctive top logo)
      ctx.strokeStyle = '#FFFFFF';
      
      // Outer ring
      ctx.lineWidth = 2.2;
      ctx.globalAlpha = 0.9;
      ctx.beginPath();
      ctx.arc(cx, cy, 23, 0, Math.PI * 2);
      ctx.stroke();

      // Middle ring
      ctx.lineWidth = 2.0;
      ctx.globalAlpha = 0.85;
      ctx.beginPath();
      ctx.arc(cx, cy, 15, 0, Math.PI * 2);
      ctx.stroke();

      // Inner ring
      ctx.lineWidth = 1.8;
      ctx.globalAlpha = 0.85;
      ctx.beginPath();
      ctx.arc(cx, cy, 7.5, 0, Math.PI * 2);
      ctx.stroke();

      // 3. High-Contrast White Crosshairs
      ctx.lineWidth = 1.8;
      ctx.globalAlpha = 0.8;
      ctx.beginPath();
      ctx.moveTo(cx, 7);
      ctx.lineTo(cx, 57);
      ctx.moveTo(7, cy);
      ctx.lineTo(57, cy);
      ctx.stroke();

      // 4. Rotating Scanner Beam Wedge
      ctx.globalAlpha = 1.0;
      const sweepAngle = Math.PI / 4; // 45 degrees
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, 23, angle, angle + sweepAngle);
      ctx.closePath();

      const sweepGrad = ctx.createRadialGradient(cx, cy, 3, cx, cy, 23);
      sweepGrad.addColorStop(0, 'rgba(255, 255, 255, 0.65)');
      sweepGrad.addColorStop(0.6, 'rgba(254, 202, 202, 0.2)');
      sweepGrad.addColorStop(1, 'rgba(239, 68, 68, 0)');
      ctx.fillStyle = sweepGrad;
      ctx.fill();

      // Bright white leading beam edge
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(angle + sweepAngle) * 23, cy + Math.sin(angle + sweepAngle) * 23);
      ctx.stroke();
      ctx.restore();

      // 5. Center Hub Core
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(cx, cy, 3.2, 0, Math.PI * 2);
      ctx.fill();

      // 6. Detected Deal Blip: Glowing Emerald Green Dot at 2 o'clock (x: 44, y: 20)
      ctx.fillStyle = '#10B981';
      ctx.beginPath();
      ctx.arc(44, 20, 4.2, 0, Math.PI * 2);
      ctx.fill();

      // White center of deal blip
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(44, 20, 1.8, 0, Math.PI * 2);
      ctx.fill();

      // Update favicon link href
      faviconLink.href = canvas.toDataURL('image/png');
    };

    const animate = (timestamp: number) => {
      if (document.hidden) {
        // Stop animation when tab is not focused to save battery
        animFrameRef.current = requestAnimationFrame(animate);
        return;
      }

      // Smooth ~12 FPS updates
      if (timestamp - lastTimeRef.current > 80) {
        angleRef.current = (angleRef.current + 0.16) % (Math.PI * 2);
        drawRadar(angleRef.current);
        lastTimeRef.current = timestamp;
      }

      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [enabled]);
}
