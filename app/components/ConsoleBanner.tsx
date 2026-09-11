"use client";

import { useEffect, useRef } from "react";
import { logger } from "@/lib/logger";

export default function ConsoleBanner() {
  const printed = useRef(false);

  useEffect(() => {
    if (!printed.current) {
      printed.current = true;
      logger.banner();
      logger.info("SYSTEM", "Deluzex Luxury Frontend Client initialized.");
    }
  }, []);

  return null;
}
