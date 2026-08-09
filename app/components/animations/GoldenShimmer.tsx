"use client";

import React from "react";

export interface GoldenShimmerProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  style?: React.CSSProperties;
}

export default function GoldenShimmer({
  children,
  className,
  delay = 0,
  style,
}: GoldenShimmerProps) {
  return (
    <span
      className={className}
      style={{
        position: "relative",
        display: "inline-block",
        ...style,
      }}
    >
      {children}
      <span
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(255,215,140,0.35) 50%, transparent 100%)",
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          backgroundSize: "200% 100%",
          animation: `shimmerSweep 3s ease-in-out ${delay}s infinite`,
          mixBlendMode: "overlay",
        }}
      />
    </span>
  );
}
