"use client";
import { useAuthStore } from "@/store/auth";

export default function LogoutButton() {
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    logout();
    window.location.href = "/auth/login";
  };

  return (
    <button onClick={handleLogout} className="text-red-500 hover:underline">
      Logout
    </button>
  );
}
