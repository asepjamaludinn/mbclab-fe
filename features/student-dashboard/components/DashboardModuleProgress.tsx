import {
  CheckCircle2,
  ChevronRight,
  Clock3,
  LockKeyhole,
  PlayCircle,
} from "lucide-react";
import { PracticumModule } from "@/features/student-modules";
import { Submission } from "@/features/student-submissions";

type DashboardModuleProgressProps = {
  modules: PracticumModule[];
  submissions: Submission[];
};

function getStatusConfig(isActive: boolean, isTpSubmitted: boolean) {
  if (!isActive) {
    return {
      icon: LockKeyhole,
      label: "Terkunci",
      className: "bg-grey-200 text-grey-700",
      dotClassName: "bg-grey-400",
    };
  }

  if (isTpSubmitted) {
    return {
      icon: CheckCircle2,
      label: "TP Selesai",
      className: "bg-success/10 text-success",
      dotClassName: "bg-success",
    };
  }

  return {
    icon: PlayCircle,
    label: "Aktif",
    className: "bg-primary/10 text-primary",
    dotClassName: "bg-primary",
  };
}

export function DashboardModuleProgress({
  modules,
  submissions,
}: DashboardModuleProgressProps) {
  const timelineModules = modules.slice(0, 3).map((mod) => {
    const isTpSubmitted = submissions.some((sub) => sub.moduleId === mod.id);
    return { ...mod, isTpSubmitted };
  });

  return (
    <section>
      <div className="mb-4 flex items-end justify-between">
        <div>
          <p className="font-secondary text-[11px] font-bold uppercase tracking-[0.18em] text-primary/70">
            Timeline
          </p>
          <h2 className="mt-1 text-xl font-extrabold tracking-tight text-grey-900">
            Progres Modul
          </h2>
        </div>

        <button className="rounded-full bg-white/70 px-3 py-1 font-secondary text-[10px] font-bold text-primary shadow-sm backdrop-blur">
          Lihat Semua
        </button>
      </div>

      <div className="space-y-3">
        {timelineModules.length === 0 ? (
          <div className="rounded-[30px] border border-white/70 bg-white/80 p-5 text-center shadow-sm">
            <p className="font-secondary text-sm font-semibold text-grey-500">
              Belum ada modul praktikum.
            </p>
          </div>
        ) : (
          timelineModules.map((item) => {
            const config = getStatusConfig(item.isActive, item.isTpSubmitted);
            const Icon = config.icon;

            return (
              <article
                key={item.id}
                className="group relative overflow-hidden rounded-[30px] border border-white/70 bg-white/80 p-4 shadow-[0_16px_45px_-30px_rgba(0,0,0,0.35)] backdrop-blur-xl transition hover:bg-white"
              >
                <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-primary/5 blur-2xl" />

                <div className="relative z-10 flex items-start gap-4">
                  <div className="flex flex-col items-center">
                    <div
                      className={`flex h-11 w-11 items-center justify-center rounded-2xl text-white shadow-sm ${config.dotClassName}`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    {/* Hapus garis timeline vertikal jika item terakhir untuk estetika bisa ditambahkan logika, tapi kita biarkan default */}
                    <div className="mt-2 h-12 w-px bg-grey-200" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-secondary text-[11px] font-bold uppercase tracking-[0.18em] text-primary">
                          Modul {item.order}
                        </p>

                        <h3 className="mt-1 text-base font-extrabold leading-tight text-grey-900">
                          {item.title}
                        </h3>
                      </div>

                      <div
                        className={`flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1 font-secondary text-[10px] font-bold ${config.className}`}
                      >
                        {config.label}
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-3">
                      <div className="rounded-[20px] bg-grey-50/90 p-3">
                        <div className="mb-2 flex items-center gap-2">
                          <Clock3 className="h-4 w-4 text-primary" />
                          <p className="font-secondary text-[10px] font-bold uppercase tracking-wide text-grey-500">
                            TP
                          </p>
                        </div>

                        <p className="text-xs font-bold text-grey-900">
                          {item.isTpSubmitted ? "Selesai" : "Belum dikumpulkan"}
                        </p>
                      </div>

                      <div className="rounded-[20px] bg-grey-50/90 p-3">
                        <div className="mb-2 flex items-center gap-2">
                          <Clock3 className="h-4 w-4 text-warning" />
                          <p className="font-secondary text-[10px] font-bold uppercase tracking-wide text-grey-500">
                            TA
                          </p>
                        </div>

                        <p className="text-xs font-bold text-grey-900">
                          Belum dikerjakan
                        </p>
                      </div>
                    </div>
                  </div>

                  <ChevronRight className="mt-3 h-5 w-5 shrink-0 text-grey-300 transition group-hover:translate-x-1 group-hover:text-primary" />
                </div>
              </article>
            );
          })
        )}
      </div>
    </section>
  );
}
