"use client";

import { motion, useInView } from "framer-motion";
import React, { useRef } from "react";

export interface StaggeredGridProps {
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
  style?: React.CSSProperties;
}

export default function StaggeredGrid({
  children,
  className,
  staggerDelay = 0.12,
  style,
}: StaggeredGridProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariant = {
    hidden: { opacity: 0, y: 40, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1] as const,
      },
    },
  };

  return (
    <motion.div
      ref={ref}
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      className={className}
      style={style}
    >
      {React.Children.map(children, (child) =>
        child ? <motion.div variants={itemVariant}>{child}</motion.div> : null
      )}
    </motion.div>
  );
}
