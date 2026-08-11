"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export interface ScrollRevealProps {
  children: React.ReactNode;
  direction?: "up" | "down" | "left" | "right";
  delay?: number;
  duration?: number;
  className?: string;
  once?: boolean;
  style?: React.CSSProperties;
}

export default function ScrollReveal({
  children,
  direction = "up",
  delay = 0,
  duration = 0.7,
  className,
  once = true,
  style,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, margin: "-80px" });

  const getInitialPosition = () => {
    switch (direction) {
      case "up":
        return { x: 0, y: 60 };
      case "down":
        return { x: 0, y: -60 };
      case "left":
        return { x: -60, y: 0 };
      case "right":
        return { x: 60, y: 0 };
      default:
        return { x: 0, y: 60 };
    }
  };

  const initial = getInitialPosition();

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, x: initial.x, y: initial.y }}
      animate={
        isInView
          ? { opacity: 1, x: 0, y: 0 }
          : { opacity: 0, x: initial.x, y: initial.y }
      }
      transition={{
        duration,
        delay,
        ease: [0.22, 1, 0.36, 1] as const,
      }}
      style={{ overflow: "visible", ...style }}
    >
      {children}
    </motion.div>
  );
}
