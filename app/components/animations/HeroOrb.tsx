"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useRef } from "react";

export interface HeroOrbProps {
  className?: string;
  style?: React.CSSProperties;
}

export default function HeroOrb({ className, style }: HeroOrbProps) {
  const ref = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, { stiffness: 40, damping: 25 });
  const springY = useSpring(mouseY, { stiffness: 40, damping: 25 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!ref.current) return;
      const parent = ref.current.parentElement;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      mouseX.set(e.clientX - rect.left - 250);
      mouseY.set(e.clientY - rect.top - 250);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{
        position: "absolute",
        width: 500,
        height: 500,
        borderRadius: "50%",
        background:
          "radial-gradient(circle, rgba(200,155,96,0.15) 0%, rgba(200,155,96,0.05) 40%, transparent 70%)",
        pointerEvents: "none",
        zIndex: 1,
        filter: "blur(60px)",
        x: springX,
        y: springY,
        willChange: "transform",
        ...style,
      }}
    />
  );
}
