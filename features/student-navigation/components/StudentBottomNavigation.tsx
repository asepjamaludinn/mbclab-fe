"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { STUDENT_NAV_ITEMS } from "../constants/student-navigation.constant";

export function StudentBottomNavigation() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-4 left-1/2 z-50 grid w-[calc(100%-32px)] max-w-[448px] -translate-x-1/2 grid-cols-4 rounded-[28px] border border-grey-200 bg-white/90 px-2 py-3 shadow-[0_8px_28px_rgba(0,0,0,0.08)] backdrop-blur-md">
      {STUDENT_NAV_ITEMS.map((item) => {
        const Icon = item.icon;

        const isActive =
          pathname === item.href || pathname.startsWith(item.href);

        return (
          <Link
            key={item.label}
            href={item.href}
            className={`relative flex flex-col items-center gap-1 font-secondary text-[11px] font-medium transition-colors ${
              isActive ? "text-primary" : "text-grey-400 hover:text-primary/70"
            }`}
          >
            <Icon
              className={`transition-all duration-300 ${
                isActive ? "h-6 w-6 scale-110" : "h-5 w-5"
              }`}
            />
            <span className={isActive ? "font-bold" : ""}>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
