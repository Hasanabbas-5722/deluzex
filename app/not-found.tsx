import React from "react";
import ComingSoon from "./components/ComingSoon";

export const metadata = {
  title: "404 — Page Not Found | Deluzex",
  description: "The page you are looking for is coming soon or does not exist.",
};

export default function NotFound() {
  return <ComingSoon is404={true} />;
}
