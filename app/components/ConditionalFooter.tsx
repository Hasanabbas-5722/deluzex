"use client";
import { usePathname } from "next/navigation";
import Footer from "./Footer";

export default function ConditionalFooter() {
  const pathname = usePathname();
  console.log("pathname", pathname);
  if (
    pathname?.includes("/dashboard") ||
    pathname?.includes("/login") ||
    pathname?.includes("/signup") ||
    pathname?.includes("/signin")
  ) {
    return null;
  }
  return <Footer />;
}
