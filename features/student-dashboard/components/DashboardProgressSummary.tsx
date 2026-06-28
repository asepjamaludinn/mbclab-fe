import {
  BookOpenCheck,
  ClipboardCheck,
  FileCheck2,
  TrendingUp,
} from "lucide-react";
import { PracticumModule } from "@/features/student-modules";
import { Submission } from "@/features/student-submissions";

type DashboardProgressSummaryProps = {
  modules: PracticumModule[];
  submissions: Submission[];
};

export function DashboardProgressSummary({
  modules,
  submissions,
}: DashboardProgressSummaryProps) {
  const activeModulesCount = modules.filter((m) => m.isActive).length;
  const totalSubmissions = submissions.length;
  const totalTa = 0;

  const summaryItems = [
    {
      label: "Modul Aktif",
      value: activeModulesCount.toString(),
      description: "Tersedia",
      icon: BookOpenCheck,
      className: "bg-primary/10 text-primary",
    },
    {
      label: "TP Selesai",
      value: `${totalSubmissions}/${activeModulesCount || "-"}`,
      description: "Sudah dikumpulkan",
      icon: FileCheck2,
      className: "bg-success/10 text-success",
    },
    {
      label: "TA Selesai",
      value: `${totalTa}/${activeModulesCount || "-"}`,
      description: "Belum dikerjakan",
      icon: ClipboardCheck,
      className: "bg-warning/10 text-warning",
    },
  ];

  return (
    <section className="relative overflow-hidden rounded-[34px] border border-white/70 bg-white/80 p-5 shadow-[0_18px_50px_-30px_rgba(0,101,176,0.4)] backdrop-blur-xl">
      <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-14 -left-12 h-36 w-36 rounded-full bg-secondary/10 blur-3xl" />

      <div className="relative z-10 mb-5 flex items-start justify-between gap-4">
        <div>
          <p className="font-secondary text-[11px] font-bold uppercase tracking-[0.18em] text-primary/70">
            Ringkasan
          </p>

          <h2 className="mt-1 text-xl font-extrabold tracking-tight text-grey-900">
            Progres Praktikum
          </h2>

          <p className="mt-1 font-secondary text-xs leading-relaxed text-grey-500">
            Status pengerjaan modul, TP, dan TA kamu saat ini.
          </p>
        </div>

        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <TrendingUp className="h-5 w-5" />
        </div>
      </div>

      <div className="relative z-10 grid grid-cols-3 gap-2">
        {summaryItems.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.label}
              className="rounded-[24px] bg-grey-50/90 p-3 text-center"
            >
              <div
                className={`mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-[16px] ${item.className}`}
              >
                <Icon className="h-5 w-5" strokeWidth={1.6} />
              </div>

              <p className="text-xl font-extrabold leading-none text-grey-900">
                {item.value}
              </p>

              <p className="mt-2 font-secondary text-[10px] font-bold leading-tight text-grey-900">
                {item.label}
              </p>

              <p className="mt-0.5 font-secondary text-[10px] leading-relaxed text-grey-500">
                {item.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
