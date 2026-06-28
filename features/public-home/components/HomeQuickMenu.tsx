import Link from "next/link";
import { Lock } from "lucide-react";
import { PublicQuickMenu } from "../types/public-home.type";

type HomeQuickMenuProps = {
  menus: PublicQuickMenu[];
};

export function HomeQuickMenu({ menus }: HomeQuickMenuProps) {
  return (
    <section className="px-5 pt-10">
      <div className="mb-4">
        <p className="font-secondary text-[11px] font-bold uppercase tracking-[0.18em] text-primary/70">
          Shortcut
        </p>
        <h2 className="mt-1 text-xl font-extrabold tracking-tight text-grey-900">
          Akses Cepat
        </h2>
      </div>

      <div className="grid grid-cols-4 gap-3">
        {menus.map((menu) => {
          const Icon = menu.icon;

          const content = (
            <div className="group flex flex-col items-center gap-2">
              <div className="relative flex h-16 w-16 items-center justify-center rounded-[24px] border border-white/70 bg-white/65 text-primary shadow-sm backdrop-blur-xl transition-all duration-300 group-hover:-translate-y-1 group-hover:bg-primary group-hover:text-white">
                <Icon
                  className={`h-6 w-6 transition-transform duration-300 group-hover:scale-110 ${menu.iconClassName}`}
                  strokeWidth={1.6}
                />

                {menu.requiresAuth && (
                  <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-grey-900 text-white shadow-sm">
                    <Lock className="h-2.5 w-2.5" />
                  </span>
                )}
              </div>

              <p className="text-center font-secondary text-[11px] font-bold leading-tight text-grey-700 transition-colors group-hover:text-primary">
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
