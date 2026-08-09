"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef, useState } from "react";

export interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  tiltAmount?: number;
  glareOpacity?: number;
  style?: React.CSSProperties;
}

export default function TiltCard({
  children,
  className,
  tiltAmount = 12,
  glareOpacity = 0.25,
  style,
}: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);

  const springX = useSpring(x, { stiffness: 300, damping: 30 });
  const springY = useSpring(y, { stiffness: 300, damping: 30 });

  const rotateX = useTransform(springY, [0, 1], [tiltAmount, -tiltAmount]);
  const rotateY = useTransform(springX, [0, 1], [-tiltAmount, tiltAmount]);

  const [glarePos, setGlarePos] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const normalizedX = (e.clientX - rect.left) / rect.width;
    const normalizedY = (e.clientY - rect.top) / rect.height;

    x.set(normalizedX);
    y.set(normalizedY);

    setGlarePos({
      x: normalizedX * 100,
      y: normalizedY * 100,
    });
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    x.set(0.5);
    y.set(0.5);
    setIsHovered(false);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={className}
      style={{
        transformStyle: "preserve-3d",
        perspective: 1000,
        rotateX,
        rotateY,
        ...style,
      }}
    >
      {children}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background: `radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, rgba(255,230,180,${glareOpacity}) 0%, transparent 60%)`,
          opacity: isHovered ? 1 : 0,
          transition: "opacity 0.3s",
          borderRadius: "inherit",
        }}
      />
    </motion.div>
  );
}
