"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useRef } from "react";

export interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  strength?: number;
  style?: React.CSSProperties;
}

export default function MagneticButton({
  children,
  className,
  strength = 0.3,
  style,
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springX = useSpring(x, { stiffness: 150, damping: 15, mass: 0.1 });
  const springY = useSpring(y, { stiffness: 150, damping: 15, mass: 0.1 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const offsetX = (e.clientX - centerX) * strength;
    const offsetY = (e.clientY - centerY) * strength;

    x.set(offsetX);
    y.set(offsetY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={className}
      style={{
        display: "inline-block",
        ...style,
        x: springX,
        y: springY,
      }}
    >
      {children}
    </motion.div>
  );
}
