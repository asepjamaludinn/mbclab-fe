"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { STUDENT_NAV_ITEMS } from "../constants/student-navigation.constant";

export function StudentBottomNavigation() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-4 left-1/2 z-50 flex w-[calc(100%-32px)] max-w-[448px] -translate-x-1/2 items-center justify-between rounded-full border border-white/20 bg-grey-900/80 p-2 shadow-[0_18px_45px_-24px_rgba(0,0,0,0.75)] backdrop-blur-xl">
      {STUDENT_NAV_ITEMS.map((item) => {
        const Icon = item.icon;

        const isActive =
          pathname === item.href ||
          (item.href !== "/student/dashboard" &&
            pathname.startsWith(item.href));

        const content = (
          <>
            <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full">
              <Icon
                className={`transition-all duration-300 ${
                  isActive ? "h-5 w-5 text-primary" : "h-5 w-5 text-white/80"
                }`}
                strokeWidth={isActive ? 2.2 : 2}
              />
            </div>

            {isActive && (
              <span className="mr-4 whitespace-nowrap font-secondary text-xs font-extrabold text-grey-900">
                {item.label}
              </span>
            )}
          </>
        );

        const className = `flex h-14 items-center justify-center rounded-full transition-all duration-300 active:scale-[0.96] ${
          isActive
            ? "min-w-[132px] bg-white text-primary shadow-[0_12px_28px_-18px_rgba(255,255,255,0.85)]"
            : "w-14 bg-white/0 hover:bg-white/10"
        }`;

        return (
          <Link key={item.label} href={item.href} className={className}>
            {content}
          </Link>
        );
      })}
    </nav>
  );
}
