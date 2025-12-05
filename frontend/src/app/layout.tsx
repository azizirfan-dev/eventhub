// src/app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";
import { ReactNode } from "react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { QueryProvider } from "@/components/providers/query-provider";
import { AuthModal } from "@/components/auth/auth-modal";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "EventHub",
  description: "Discover and manage your favorite events with EventHub.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} min-h-screen bg-slate-50 text-slate-900 antialiased`}
      >
        <QueryProvider>
          <div className="flex min-h-screen flex-col">
            <SiteHeader />
            <main className="flex-1">{children}</main>
            <SiteFooter />
          </div>
          <AuthModal />
        </QueryProvider>
      </body>
    </html>
  );
}
