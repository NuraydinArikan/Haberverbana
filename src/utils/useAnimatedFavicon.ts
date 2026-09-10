import { useEffect, useRef } from 'react';

/**
 * useAnimatedFavicon:
 * Rotates a crisp radar scanner inside the browser tab favicon dynamically.
 * Features:
 * - 0 CPU when the browser tab is hidden / in background.
 * - Smooth rotating beam and target ping.
 * - Updates the <link rel="icon"> tag smoothly.
 */
export function useAnimatedFavicon(enabled: boolean = true) {
  const angleRef = useRef(0);
  const animFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);

  useEffect(() => {
    if (!enabled || typeof window === 'undefined' || typeof document === 'undefined') return;

    // Create an offscreen canvas for rendering the rotating favicon
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Find or create favicon link tag
    let faviconLink = document.querySelector("link[rel~='icon']") as HTMLLinkElement | null;
    if (!faviconLink) {
      faviconLink = document.createElement('link');
      faviconLink.rel = 'icon';
      document.head.appendChild(faviconLink);
    }

    const drawRadar = (angle: number) => {
      ctx.clearRect(0, 0, 32, 32);

      // 1. Draw rounded squircle background (#DC2626 -> #580d0d gradient)
      const radius = 8;
      ctx.beginPath();
      ctx.moveTo(radius, 0);
      ctx.lineTo(32 - radius, 0);
      ctx.quadraticCurveTo(32, 0, 32, radius);
      ctx.lineTo(32, 32 - radius);
      ctx.quadraticCurveTo(32, 32, 32 - radius, 32);
      ctx.lineTo(radius, 32);
      ctx.quadraticCurveTo(0, 32, 0, 32 - radius);
      ctx.lineTo(0, radius);
      ctx.quadraticCurveTo(0, 0, radius, 0);
      ctx.closePath();

      const bgGrad = ctx.createLinearGradient(0, 0, 32, 32);
      bgGrad.addColorStop(0, '#DC2626');
      bgGrad.addColorStop(0.7, '#991B1B');
      bgGrad.addColorStop(1, '#450A0A');
      ctx.fillStyle = bgGrad;
      ctx.fill();

      // Border highlight
      ctx.strokeStyle = 'rgba(248, 113, 113, 0.45)';
      ctx.lineWidth = 1;
      ctx.stroke();

      const cx = 16;
      const cy = 16;

      // 2. Radar concentric rings
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.28)';
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.arc(cx, cy, 12, 0, Math.PI * 2);
      ctx.stroke();

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
      ctx.beginPath();
      ctx.arc(cx, cy, 7, 0, Math.PI * 2);
      ctx.stroke();

      // 3. Crosshairs
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
      ctx.lineWidth = 0.7;
      ctx.beginPath();
      ctx.moveTo(cx, 4);
      ctx.lineTo(cx, 28);
      ctx.moveTo(4, cy);
      ctx.lineTo(28, cy);
      ctx.stroke();

      // 4. Rotating scanner beam wedge
      const sweepAngle = Math.PI / 3.5; // ~50 degrees
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, 12.5, angle, angle + sweepAngle);
      ctx.closePath();

      const sweepGrad = ctx.createRadialGradient(cx, cy, 2, cx, cy, 12.5);
      sweepGrad.addColorStop(0, 'rgba(255, 255, 255, 0.7)');
      sweepGrad.addColorStop(0.5, 'rgba(248, 113, 113, 0.35)');
      sweepGrad.addColorStop(1, 'rgba(220, 38, 38, 0)');
      ctx.fillStyle = sweepGrad;
      ctx.fill();

      // Leading beam edge
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 1.3;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(angle + sweepAngle) * 12.5, cy + Math.sin(angle + sweepAngle) * 12.5);
      ctx.stroke();
      ctx.restore();

      // 5. Detected Deal blip (emerald green dot)
      ctx.fillStyle = '#10B981';
      ctx.beginPath();
      ctx.arc(22, 10, 1.8, 0, Math.PI * 2);
      ctx.fill();

      // 6. Center hub dot
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(cx, cy, 1.6, 0, Math.PI * 2);
      ctx.fill();

      // Update favicon link
      faviconLink.href = canvas.toDataURL('image/png');
    };

    const animate = (timestamp: number) => {
      if (document.hidden) {
        // Tab is hidden; stop animation to save battery
        animFrameRef.current = requestAnimationFrame(animate);
        return;
      }

      // Throttle to ~12-14 FPS for minimal resource usage
      if (timestamp - lastTimeRef.current > 80) {
        angleRef.current = (angleRef.current + 0.18) % (Math.PI * 2);
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
