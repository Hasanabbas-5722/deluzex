"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export interface ParallaxImageProps {
  children: React.ReactNode;
  speed?: number;
  className?: string;
  style?: React.CSSProperties;
}

export default function ParallaxImage({
  children,
  speed = 0.15,
  className,
  style,
}: ParallaxImageProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(
    scrollYProgress,
    [0, 1],
    [`${speed * 100}px`, `${-speed * 100}px`]
  );

  return (
    <div
      ref={ref}
      className={className}
      style={{
        overflow: "hidden",
        position: "relative",
        ...style,
      }}
    >
      <motion.div
        style={{
          y,
          position: "relative",
          width: "100%",
          height: "100%",
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}
