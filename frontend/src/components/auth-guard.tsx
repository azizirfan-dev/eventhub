"use client";

import { useAuthStore } from "@/store/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AuthGuard({
  children,
  roles,
}: {
  children: React.ReactNode;
  roles?: string[];
}) {
  const router = useRouter();
  const { user, token } = useAuthStore();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // Tunggu Zustand sync dengan localStorage dulu
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;

    if (!token) {
      router.replace("/auth/login");
      return;
    }

    if (roles && user && !roles.includes(user.role)) {
      router.replace("/");
      return;
    }
  }, [hydrated, token, router, user, roles]);

  if (!hydrated) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </main>
    );
  }

  return <>{children}</>;
}
