// src/components/layout/site-header.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/store/auth";
import { useAuthModalStore } from "@/store/auth-modal";
import { useLogout } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const navItems = [{ href: "/", label: "Discover Events" }];

export function SiteHeader() {
  const pathname = usePathname();
  const { open } = useAuthModalStore();
  const logout = useLogout();

  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const rawRole = user?.role?.toString()?.trim()?.toUpperCase() || "";
  const isOrganizer = rawRole === "ORGANIZER";
  const isUser = rawRole === "USER" || rawRole === "CUSTOMER"; // 🔥 Accept both


  const initials =
    user?.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "EH";

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-linear-to-tr from-indigo-600 via-sky-500 to-indigo-400 text-xs font-bold text-white shadow-md">
            EH
          </div>
          <span className="text-lg font-semibold tracking-tight">EventHub</span>
        </Link>

        {/* Navigation (Desktop Only) */}
        <nav className="hidden items-center gap-4 text-sm font-medium text-slate-600 sm:flex">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-full px-3 py-1 ${isActive
                    ? "bg-indigo-50 text-indigo-600"
                    : "hover:bg-slate-100"
                  }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Auth Section */}
        <div className="flex items-center gap-3">
          {!isAuthenticated ? (
            <Button
              size="sm"
              className="rounded-full bg-linear-to-r from-indigo-600 to-sky-500 text-xs font-semibold text-white shadow-sm hover:from-indigo-700 hover:to-sky-600"
              onClick={() => open("login")}
            >
              Login
            </Button>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-2 py-1 text-xs shadow-sm hover:border-indigo-200 hover:bg-indigo-50">
                  <Avatar className="h-7 w-7">
                    <AvatarImage src={undefined} alt={user?.name ?? "User"} />
                    <AvatarFallback className="bg-indigo-600 text-[11px] font-semibold text-white">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden text-xs font-medium text-slate-800 sm:inline">
                    {user?.name ?? "Account"}
                  </span>
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-44 text-xs">
                <DropdownMenuLabel className="text-[11px]">
                  Signed in as
                  <br />
                  <span className="font-semibold text-slate-900">
                    {user?.email}
                  </span>
                </DropdownMenuLabel>

                <DropdownMenuSeparator />

                {/* Organizer Section */}
                {isOrganizer && (
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard">Dashboard</Link>
                  </DropdownMenuItem>
                )}

                {/* Customer Section */}
                {isUser && (
                  <>
                    <DropdownMenuItem asChild>
                      <Link href="/profile">Profile</Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem asChild>
                      <Link href="/my-tickets">My Tickets</Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem asChild>
                      <Link href="/my-transactions">My Transactions</Link>
                    </DropdownMenuItem>
                  </>
                )}

                <DropdownMenuSeparator />

                <DropdownMenuItem onClick={() => logout()}>
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  );
}
