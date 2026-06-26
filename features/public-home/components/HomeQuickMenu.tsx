import Link from "next/link";
import { Lock } from "lucide-react";
import { PublicQuickMenu } from "../types/public-home.type";

type HomeQuickMenuProps = {
  menus: PublicQuickMenu[];
};

export function HomeQuickMenu({ menus }: HomeQuickMenuProps) {
  return (
    <section className="px-6 pt-10">
      <h2 className="mb-5 text-sm font-bold uppercase tracking-wider text-grey-900/60">
        Akses Cepat
      </h2>

      <div className="grid grid-cols-4 gap-4">
        {menus.map((menu) => {
          const Icon = menu.icon;

          const content = (
            <div className="group flex flex-col items-center gap-3">
              <div className="relative flex h-16 w-16 items-center justify-center rounded-[20px] border border-grey-200/50 bg-white shadow-sm transition-all duration-300 group-hover:-translate-y-1 group-hover:border-primary/20 group-hover:shadow-md">
                <Icon
                  className={`h-6 w-6 transition-transform duration-300 group-hover:scale-110 ${menu.iconClassName}`}
                  strokeWidth={1.5}
                />

                {menu.requiresAuth && (
                  <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-grey-900 text-white shadow-sm">
                    <Lock className="h-2.5 w-2.5" />
                  </span>
                )}
              </div>
              <p className="font-secondary text-[11px] font-semibold text-grey-700 transition-colors group-hover:text-primary">
                {menu.label}
              </p>
            </div>
          );

          if (menu.isExternal) {
            return (
              <a
                key={menu.label}
                href={menu.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                {content}
              </a>
            );
          }

          if (menu.href.startsWith("/")) {
            return (
              <Link key={menu.label} href={menu.href}>
                {content}
              </Link>
            );
          }

          return (
            <a key={menu.label} href={menu.href}>
              {content}
            </a>
          );
        })}
      </div>
    </section>
  );
}
