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
    <nav className="fixed bottom-4 left-1/2 z-50 grid w-[calc(100%-32px)] max-w-[448px] -translate-x-1/2 grid-cols-4 rounded-[28px] border border-grey-200 bg-white/90 px-2 py-3 shadow-[0_8px_28px_rgba(0,0,0,0.08)] backdrop-blur-md">
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;

        const className = `relative flex flex-col items-center gap-1 font-secondary text-[11px] font-medium transition-colors ${
          isActive ? "text-primary" : "text-grey-400 hover:text-primary/70"
        }`;

        const content = (
          <>
            <div className="relative">
              <Icon
                className={`transition-all duration-300 ${
                  isActive ? "h-6 w-6 scale-110" : "h-5 w-5"
                }`}
              />
              {item.requiresAuth && (
                <span className="absolute -right-2 -top-1 flex h-4 w-4 items-center justify-center rounded-full border-2 border-white bg-grey-900 text-white">
                  <Lock className="h-2 w-2" />
                </span>
              )}
            </div>
            <span className={isActive ? "font-bold" : ""}>{item.label}</span>
          </>
        );

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
