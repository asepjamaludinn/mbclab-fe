import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { DASHBOARD_QUICK_ACCESS_ITEMS } from "../constants/student-dashboard.constant";

export function DashboardQuickAccess() {
  return (
    <section>
      <div className="mb-4 flex items-end justify-between">
        <div>
          <p className="font-secondary text-[11px] font-bold uppercase tracking-[0.18em] text-primary/70">
            Shortcut
          </p>

          <h2 className="mt-1 text-xl font-extrabold tracking-tight text-grey-900">
            Akses Cepat
          </h2>
        </div>

        <span className="rounded-full bg-white/70 px-3 py-1 font-secondary text-[10px] font-bold text-grey-500 shadow-sm backdrop-blur">
          3 Menu
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {DASHBOARD_QUICK_ACCESS_ITEMS.map((item) => {
          const Icon = item.icon;
          const isLarge = item.variant === "large";

          return (
            <Link
              key={item.title}
              href={item.href}
              className={`group block ${
                isLarge
                  ? "col-span-2 row-span-2 min-h-[190px]"
                  : "min-h-[135px]"
              }`}
            >
              <article className="relative flex h-full flex-col justify-between overflow-hidden rounded-[30px] border border-white/70 bg-white/80 p-4 shadow-[0_16px_45px_-28px_rgba(0,0,0,0.35)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:bg-white">
                <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-primary/5 blur-2xl transition group-hover:bg-primary/10" />
                <div className="pointer-events-none absolute -bottom-12 -left-12 h-32 w-32 rounded-full bg-secondary/5 blur-2xl" />

                <div className="relative z-10 flex items-start justify-between gap-3">
                  <div
                    className={`flex shrink-0 items-center justify-center shadow-lg ${
                      isLarge
                        ? "h-14 w-14 rounded-[22px]"
                        : "h-11 w-11 rounded-[18px]"
                    } ${item.className}`}
                  >
                    <Icon
                      className={isLarge ? "h-6 w-6" : "h-5 w-5"}
                      strokeWidth={1.8}
                    />
                  </div>

                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-grey-50 text-grey-400 transition-all duration-300 group-hover:bg-primary group-hover:text-white">
                    <ArrowUpRight className="h-4 w-4" />
                  </div>
                </div>

                <div className="relative z-10 mt-6">
                  <h3
                    className={`font-extrabold leading-snug tracking-tight text-grey-900 ${
                      isLarge ? "text-lg" : "text-sm"
                    }`}
                  >
                    {item.title}
                  </h3>

                  <p
                    className={`mt-1 font-secondary leading-relaxed text-grey-500 ${
                      isLarge
                        ? "line-clamp-2 max-w-[280px] text-xs"
                        : "line-clamp-2 text-[11px]"
                    }`}
                  >
                    {item.description}
                  </p>
                </div>
              </article>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
