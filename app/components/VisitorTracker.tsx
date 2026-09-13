"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { recordVisit } from "../services/api";

function getOrCreateVisitorId(): string {
  if (typeof window === "undefined") return "";
  try {
    let vid = localStorage.getItem("deluzex_vid");
    if (!vid) {
      vid = "vid_" + Math.random().toString(36).substring(2, 11) + Date.now().toString(36);
      localStorage.setItem("deluzex_vid", vid);
    }
    return vid;
  } catch {
    return "vid_fallback";
  }
}

function getOrCreateSessionId(): string {
  if (typeof window === "undefined") return "";
  try {
    let sid = sessionStorage.getItem("deluzex_sid");
    if (!sid) {
      sid = "sid_" + Math.random().toString(36).substring(2, 11) + Date.now().toString(36);
      sessionStorage.setItem("deluzex_sid", sid);
    }
    return sid;
  } catch {
    return "sid_fallback";
  }
}

export default function VisitorTracker() {
  const pathname = usePathname();
  const { isAuthenticated, user, loading } = useAuth();
  const lastTrackedKeyRef = useRef<string>("");

  useEffect(() => {
    // Wait until auth initialization finishes to know accurately if user is member
    if (loading) return;

    // Do not track visits to admin panels
    if (!pathname || pathname.startsWith("/admin")) return;

    const visitorId = getOrCreateVisitorId();
    const sessionId = getOrCreateSessionId();

    const u = user as Record<string, any> | null;
    const isMember = Boolean(isAuthenticated && u?.email);
    const userEmail = isMember ? (u?.email as string) : null;
    const userName = isMember
      ? ([u?.first_name, u?.last_name].filter(Boolean).join(" ") || u?.name || u?.email)
      : null;
    const userId = isMember ? (u?.id || u?._id || null) : null;

    // Avoid duplicate pings for the exact same path and auth state
    const trackKey = `${pathname}__${visitorId}__${sessionId}__${userEmail || "guest"}`;
    if (lastTrackedKeyRef.current === trackKey) {
      return;
    }
    lastTrackedKeyRef.current = trackKey;

    const screenWidth = typeof window !== "undefined" ? window.innerWidth : undefined;
    const userAgent = typeof navigator !== "undefined" ? navigator.userAgent : "";
    const referrer = typeof document !== "undefined" ? document.referrer : "";

    recordVisit({
      visitor_id: visitorId,
      session_id: sessionId,
      path: pathname,
      referrer: referrer,
      user_agent: userAgent,
      screen_width: screenWidth,
      is_member: isMember,
      user_email: userEmail,
      user_name: userName,
      user_id: userId,
    });
  }, [pathname, isAuthenticated, user, loading]);

  return null;
}
