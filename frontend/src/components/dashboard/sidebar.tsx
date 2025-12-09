"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  CalendarDays, 
  Ticket, 
  BarChart3, 
  Tag, 
  User, 
  Settings, 
  ShoppingBag,
  Star 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/auth";

const ORGANIZER_MENU = [
  { label: "Events", href: "/dashboard/events", icon: CalendarDays },
  { label: "Transactions", href: "/dashboard/transactions", icon: Ticket },
  { label: "Statistics", href: "/dashboard/statistics", icon: BarChart3 },
  { label: "Promotions", href: "/dashboard/promotions", icon: Tag },
  { label: "Profile", href: "/dashboard/profile", icon: User },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

const CLIENT_MENU = [
  { label: "My Tickets", href: "/dashboard/tickets", icon: ShoppingBag },
  { label: "Referrals & Points", href: "/dashboard/rewards", icon: Star },
  { label: "Profile", href: "/dashboard/profile", icon: User },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const role = useAuthStore((s) => s.user?.role);

  const menu = role === "ORGANIZER" ? ORGANIZER_MENU : CLIENT_MENU;

  return (
    <aside className="w-60 bg-white border-r border-slate-200 p-4 space-y-1">
      <h2 className="px-3 mb-3 text-xs font-semibold text-slate-500">
        {role === "ORGANIZER" ? "ORGANIZER DASHBOARD" : "MY ACCOUNT"}
      </h2>

      {menu.map((item) => {
        const active = pathname.startsWith(item.href);
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100",
              active && "bg-indigo-50 text-indigo-600 font-semibold"
            )}
          >
            <Icon className="h-4 w-4" />
            {item.label}
          </Link>
        );
      })}
    </aside>
  );
}
