"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth";
import { Sidebar } from "@/components/dashboard/sidebar";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();
  const [hydrated, setHydrated] = useState(false);

  // Wait until Zustand loads from localStorage
  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;

    // If still not authenticated after hydration → redirect
    if (!isAuthenticated) {
      router.replace("/");
      return;
    }

    if (user?.role !== "ORGANIZER") {
      router.replace("/");
      return;
    }
  }, [hydrated, isAuthenticated, user, router]);

  if (!hydrated) {
    return (
      <div className="flex h-screen w-full items-center justify-center text-sm">
        Loading...
      </div>
    );
  }

  // Auth valid → render dashboard
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 px-6 py-8">{children}</main>
    </div>
  );
}
