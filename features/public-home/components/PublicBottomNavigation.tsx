"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Lock } from "lucide-react";
import { PublicBottomNavItem } from "../types/public-home.type";
import { publicBottomNavItems as defaultNavItems } from "../constants/public-home.constant";

type PublicBottomNavigationProps = {
  items?: PublicBottomNavItem[];
};

export function PublicBottomNavigation({
  items = defaultNavItems,
}: PublicBottomNavigationProps) {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-4 left-1/2 z-50 flex w-[calc(100%-32px)] max-w-[448px] -translate-x-1/2 items-center justify-between rounded-full border border-white/20 bg-grey-900/80 p-2 shadow-[0_18px_45px_-24px_rgba(0,0,0,0.75)] backdrop-blur-xl">
      {items.map((item) => {
        const Icon = item.icon;
        const isActive =
          pathname === item.href ||
          (item.href !== "/" && pathname.startsWith(item.href));

        const content = (
          <>
            <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full">
              <Icon
                className={`transition-all duration-300 ${
                  isActive ? "h-5 w-5 text-primary" : "h-5 w-5 text-white/80"
                }`}
                strokeWidth={isActive ? 2.2 : 2}
              />

              {item.requiresAuth && (
                <span
                  className={`absolute -right-1 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full border-2 shadow-sm ${
                    isActive
                      ? "border-white bg-grey-900 text-white"
                      : "border-grey-900 bg-white text-grey-900"
                  }`}
                >
                  <Lock className="h-2 w-2" />
                </span>
              )}
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

        if (item.isLink) {
          return (
            <Link key={item.label} href={item.href} className={className}>
              {content}
            </Link>
          );
        }

        return (
          <a key={item.label} href={item.href} className={className}>
            {content}
          </a>
        );
      })}
    </nav>
  );
}
