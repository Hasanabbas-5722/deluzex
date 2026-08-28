import type { Metadata, Viewport } from "next";
import { Libre_Caslon_Display, Italianno } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";
import ConditionalFooter from "./components/ConditionalFooter";
import { ReduxProvider } from "./store/ReduxProvider";
import CartSidebar from "./components/CartSidebar";
import MainSidebar from "./components/MainSidebar";

const libre = Libre_Caslon_Display({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-libre",
});

const italianno = Italianno({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-italianno",
});

import { AuthProvider } from "./context/AuthContext";
import { SidebarProvider } from "./context/SidebarContext";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: "deluzex — Where Lights becomes Design",
  description: "Discover lighting crafted with precision and elegance.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${libre.variable} ${italianno.variable}`}>
        <AuthProvider>
          <SidebarProvider>
            <ReduxProvider>
              <Header />
              {children}
              <ConditionalFooter />
              <CartSidebar />
              <MainSidebar />
            </ReduxProvider>
          </SidebarProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
