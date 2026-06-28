"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { STUDENT_NAV_ITEMS } from "../constants/student-navigation.constant";

export function StudentBottomNavigation() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-1/2 z-50 grid w-full max-w-[480px] -translate-x-1/2 grid-cols-4 border-t border-grey-200 bg-white/90 px-2 py-3 pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.05)] backdrop-blur-md">
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
