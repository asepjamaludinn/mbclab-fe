import Link from "next/link";
import {
  ArrowUpRight,
  BookOpen,
  ClipboardList,
  FileText,
  PenLine,
} from "lucide-react";

const QUICK_ACCESS_ITEMS = [
  {
    title: "Akses Modul",
    description: "Materi & panduan",
    href: "/student/modules",
    icon: BookOpen,
    className: "bg-primary text-white shadow-primary/20",
  },
  {
    title: "Kumpulkan TP",
    description: "Upload laporan PDF",
    href: "/student/submissions",
    icon: FileText,
    className: "bg-success text-white shadow-success/20",
  },
  {
    title: "Kerjakan TA",
    description: "Masuk sesi kuis",
    href: "/student/assessment",
    icon: ClipboardList,
    className: "bg-warning text-white shadow-warning/20",
  },
  {
    title: "Catatan",
    description: "Arahan praktikum",
    href: "/student/modules",
    icon: PenLine,
    className: "bg-info text-white shadow-info/20",
  },
];

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
          4 Menu
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {QUICK_ACCESS_ITEMS.map((item) => {
          const Icon = item.icon;

          return (
            <Link key={item.title} href={item.href} className="group block">
              <article className="relative h-full overflow-hidden rounded-[30px] border border-white/70 bg-white/80 p-4 shadow-[0_16px_45px_-28px_rgba(0,0,0,0.35)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:bg-white">
                <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-primary/5 blur-2xl transition group-hover:bg-primary/10" />

                <div className="relative z-10 mb-6 flex items-start justify-between">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-[20px] shadow-lg ${item.className}`}
                  >
                    <Icon className="h-6 w-6" strokeWidth={1.7} />
                  </div>

                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-grey-50 text-grey-400 transition-all duration-300 group-hover:bg-primary group-hover:text-white">
                    <ArrowUpRight className="h-4 w-4" />
                  </div>
                </div>

                <h3 className="relative z-10 text-sm font-extrabold tracking-tight text-grey-900">
                  {item.title}
                </h3>

                <p className="relative z-10 mt-1 font-secondary text-[11px] leading-relaxed text-grey-500">
                  {item.description}
                </p>
              </article>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
