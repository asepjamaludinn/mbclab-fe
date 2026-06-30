import Link from "next/link";
import { Lock } from "lucide-react";
import { PublicQuickMenu } from "../types/public-home.type";

type HomeQuickMenuProps = {
  menus: PublicQuickMenu[];
};

export function HomeQuickMenu({ menus }: HomeQuickMenuProps) {
  return (
    <section className="px-5 pt-7">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-extrabold tracking-tight text-white">
          Akses Cepat
        </h2>

        <span className="font-secondary text-[11px] font-bold text-white/75">
          Semua
        </span>
      </div>

      <div className="rounded-[30px] border border-white/25 bg-white/15 p-5 text-white shadow-sm backdrop-blur-xl">
        <div className="grid grid-cols-4 gap-3">
          {menus.map((menu) => {
            const Icon = menu.icon;

            const content = (
              <div className="group flex flex-col items-center gap-2">
                <div className="relative flex h-14 w-14 items-center justify-center rounded-full border border-white/25 bg-white/20 text-white shadow-sm backdrop-blur-xl transition-all duration-300 group-hover:-translate-y-1 group-hover:bg-white group-hover:text-primary">
                  <Icon className="h-6 w-6" strokeWidth={1.7} />

                  {menu.requiresAuth && (
                    <span className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white/40 bg-grey-900 text-white shadow-sm">
                      <Lock className="h-2.5 w-2.5" />
                    </span>
                  )}
                </div>

                <p className="text-center font-secondary text-[11px] font-semibold leading-tight text-white/90">
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
      </div>
    </section>
  );
}
