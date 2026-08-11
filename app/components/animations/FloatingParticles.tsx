"use client";

import { useEffect, useRef, useCallback } from "react";

export interface FloatingParticlesProps {
  count?: number;
  color?: string;
  className?: string;
  style?: React.CSSProperties;
}

interface Particle {
  x: number;
  y: number;
  radius: number;
  speedY: number;
  speedX: number;
  opacity: number;
  phase: number;
}

export default function FloatingParticles({
  count = 40,
  color = "rgba(200, 155, 96, {opacity})",
  className,
  style,
}: FloatingParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const createParticle = useCallback(
    (width: number, height: number): Particle => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: 1 + Math.random() * 2,
      speedY: -0.1 - Math.random() * 0.2, // -0.3 to -0.1
      speedX: -0.15 + Math.random() * 0.3, // -0.15 to 0.15
      opacity: 0.15 + Math.random() * 0.35, // 0.15 to 0.5
      phase: Math.random() * Math.PI * 2,
    }),
    []
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const parent = canvas.parentElement;
    if (!parent) return;

    let width = (canvas.width = parent.clientWidth || window.innerWidth);
    let height = (canvas.height = parent.clientHeight || window.innerHeight);

    const particles: Particle[] = Array.from({ length: count }, () =>
      createParticle(width, height)
    );

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        width = canvas.width = entry.contentRect.width;
        height = canvas.height = entry.contentRect.height;
      }
    });

    resizeObserver.observe(parent);

    let animationFrameId: number;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.y += p.speedY;
        p.x += Math.sin(p.phase) * 0.3 + p.speedX;
        p.phase += 0.01;

        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        const fillStyle = color.replace("{opacity}", p.opacity.toString());
        ctx.fillStyle = fillStyle;
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
    };
  }, [count, color, createParticle]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 1,
        ...style,
      }}
    />
  );
}
