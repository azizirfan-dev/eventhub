"use client";
import AuthGuard from "@/components/auth-guard";

export default function OrganizerDashboard() {
  return (
    <AuthGuard roles={["ORGANIZER"]}>
      <main className="min-h-screen flex items-center justify-center">
        <h1 className="text-3xl font-bold text-turquoise">Organizer Dashboard</h1>
      </main>
    </AuthGuard>
  );
}
