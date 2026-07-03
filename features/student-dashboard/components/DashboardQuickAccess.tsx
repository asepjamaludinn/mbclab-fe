import Link from "next/link";
import { DASHBOARD_QUICK_ACCESS_ITEMS } from "../constants/student-dashboard.constant";

export function DashboardQuickAccess() {
  return (
    <section>
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
          {DASHBOARD_QUICK_ACCESS_ITEMS.map((item) => {
            const Icon = item.icon;

            const content = (
              <div className="group flex flex-col items-center gap-2">
                <div className="relative flex h-14 w-14 items-center justify-center rounded-full border border-white/25 bg-white/20 text-white shadow-sm backdrop-blur-xl transition-all duration-300 group-hover:-translate-y-1 group-hover:bg-white group-hover:text-primary">
                  <Icon className="h-6 w-6" strokeWidth={1.7} />
                </div>

                <p className="text-center font-secondary text-[11px] font-semibold leading-tight text-white/90">
                  {item.title}
                </p>
              </div>
            );

            if (item.isExternal) {
              return (
                <a
                  key={item.title}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {content}
                </a>
              );
            }

            return (
              <Link key={item.title} href={item.href}>
                {content}
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
