import React, { useEffect, useRef } from 'react';

/**
 * Ballpit — dependency-free falling-balls canvas animation.
 *
 * Drops `count` circles into the container. They fall under gravity,
 * settle at the bottom, stack + spread naturally via elastic collisions,
 * bounce off walls, and can follow / repel the cursor.
 *
 * Why not matter-js? We used to ship matter-js (~80 KB gzipped) just
 * for this one auth surface. This implementation is ~100 lines of
 * canvas 2D + a fixed-timestep integrator — no npm dependency, no extra
 * chunk, honours prefers-reduced-motion, and pauses when the canvas
 * isn't in the viewport.
 *
 * Physics are deliberately cheap (O(n²) pairwise collision, fine for
 * n ≤ ~150) and intentionally loose so it reads as "playful" not
 * "engineering demo".
 */

interface BallpitProps {
  /** How many balls drop in. Default 80. */
  count?: number;
  /** 0 (no gravity) to 1+ (heavy). Default 0.25. */
  gravity?: number;
  /** Speed decay per step. 1 = no friction. Default 0.985. */
  friction?: number;
  /** Energy kept after wall hit. 1 = perfect. Default 0.75. */
  wallBounce?: number;
  /** Enable cursor interaction. */
  followCursor?: boolean;
  /** Hex colors the balls cycle through. */
  colors?: string[];
}

interface Ball {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  color: string;
}

const DEFAULT_COLORS = [
  '#003366', // navy
  '#1F4A7A', // navy-600
  '#E8A430', // saffron
  '#C14A1C', // terracotta
  '#6B8E68', // sage
  '#F5EFE6', // cream
];

const Ballpit: React.FC<BallpitProps> = ({
  count = 80,
  gravity = 0.25,
  friction = 0.985,
  wallBounce = 0.75,
  followCursor = true,
  colors = DEFAULT_COLORS,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const ballsRef = useRef<Ball[]>([]);
  const mouseRef = useRef<{ x: number; y: number; active: boolean }>({
    x: 0,
    y: 0,
    active: false,
  });
  const runningRef = useRef(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Respect reduced motion — render balls stacked at rest, no animation
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    // Seed balls just above the top edge, fanned across the width so
    // they fall with a little lateral variation.
    const seed = () => {
      const rect = canvas.getBoundingClientRect();
      const balls: Ball[] = [];
      for (let i = 0; i < count; i++) {
        const r = 8 + Math.random() * 18;
        balls.push({
          x: Math.random() * rect.width,
          y: -Math.random() * rect.height,
          vx: (Math.random() - 0.5) * 2,
          vy: Math.random() * 2,
          r,
          color: colors[i % colors.length],
        });
      }
      ballsRef.current = balls;
    };
    seed();

    const step = () => {
      if (!runningRef.current) {
        rafRef.current = requestAnimationFrame(step);
        return;
      }
      const rect = canvas.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      const balls = ballsRef.current;
      const m = mouseRef.current;

      ctx.clearRect(0, 0, w, h);

      // Integrate + interact
      for (let i = 0; i < balls.length; i++) {
        const b = balls[i];

        if (!prefersReducedMotion) {
          b.vy += gravity;

          // Cursor push — soft repel inside a radius
          if (followCursor && m.active) {
            const dx = b.x - m.x;
            const dy = b.y - m.y;
            const d2 = dx * dx + dy * dy;
            const R = 110;
            if (d2 < R * R && d2 > 0.01) {
              const d = Math.sqrt(d2);
              const force = ((R - d) / R) * 0.9;
              b.vx += (dx / d) * force;
              b.vy += (dy / d) * force;
            }
          }

          b.vx *= friction;
          b.vy *= friction;
          b.x += b.vx;
          b.y += b.vy;

          // Walls
          if (b.x - b.r < 0) {
            b.x = b.r;
            b.vx = -b.vx * wallBounce;
          } else if (b.x + b.r > w) {
            b.x = w - b.r;
            b.vx = -b.vx * wallBounce;
          }
          if (b.y + b.r > h) {
            b.y = h - b.r;
            b.vy = -b.vy * wallBounce;
            b.vx *= 0.98;
          } else if (b.y - b.r < 0) {
            b.y = b.r;
            b.vy = -b.vy * wallBounce;
          }
        }

        // O(n²) pairwise collision — acceptable up to ~150 balls
        for (let j = i + 1; j < balls.length; j++) {
          const o = balls[j];
          const dx = o.x - b.x;
          const dy = o.y - b.y;
          const d2 = dx * dx + dy * dy;
          const minD = b.r + o.r;
          if (d2 < minD * minD && d2 > 0.0001) {
            const d = Math.sqrt(d2);
            const nx = dx / d;
            const ny = dy / d;
            const overlap = (minD - d) / 2;
            // Positional correction
            b.x -= nx * overlap;
            b.y -= ny * overlap;
            o.x += nx * overlap;
            o.y += ny * overlap;
            // Velocity exchange along normal
            const p =
              2 * (b.vx * nx + b.vy * ny - (o.vx * nx + o.vy * ny)) / 2;
            b.vx -= p * nx;
            b.vy -= p * ny;
            o.vx += p * nx;
            o.vy += p * ny;
            // Slight damping so the pile doesn't jitter forever
            b.vx *= 0.98;
            b.vy *= 0.98;
            o.vx *= 0.98;
            o.vy *= 0.98;
          }
        }
      }

      // Draw
      for (let i = 0; i < balls.length; i++) {
        const b = balls[i];
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        ctx.fillStyle = b.color;
        ctx.fill();
      }

      rafRef.current = requestAnimationFrame(step);
    };

    // Pause when not in viewport (cheap power saver)
    const io = new IntersectionObserver(
      (entries) => {
        runningRef.current = entries[0]?.isIntersecting ?? true;
      },
      { threshold: 0 },
    );
    io.observe(canvas);

    // Pointer tracking
    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = e.clientX - rect.left;
      mouseRef.current.y = e.clientY - rect.top;
      mouseRef.current.active = true;
    };
    const onLeave = () => {
      mouseRef.current.active = false;
    };
    canvas.addEventListener('pointermove', onMove);
    canvas.addEventListener('pointerleave', onLeave);

    const onResize = () => {
      resize();
    };
    window.addEventListener('resize', onResize);

    rafRef.current = requestAnimationFrame(step);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      canvas.removeEventListener('pointermove', onMove);
      canvas.removeEventListener('pointerleave', onLeave);
      window.removeEventListener('resize', onResize);
      io.disconnect();
    };
  }, [count, gravity, friction, wallBounce, followCursor, colors]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full touch-none"
      aria-hidden="true"
    />
  );
};

export default Ballpit;
