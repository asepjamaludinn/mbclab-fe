import { TrendingUp, FileCheck2, LockKeyhole } from "lucide-react";
import { ActiveModuleSummary } from "../types/admin-dashboard.type";

type ModuleInsightCardProps = {
  activeModule: ActiveModuleSummary | null;
  totalModulesCount: number;
  activeModulesCount: number;
  averageTpScore: number | null;
  averageTaScore: number | null;
  tpSubmittedTodayCount: number;
};

export function ModuleInsightCard({
  activeModule,
  totalModulesCount,
  activeModulesCount,
  averageTpScore,
  averageTaScore,
  tpSubmittedTodayCount,
}: ModuleInsightCardProps) {
  return (
    <div className="flex h-full min-h-[280px] w-full flex-col overflow-hidden rounded-[32px] border border-white/60 bg-white/60 p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-2xl">
      <h2 className="text-lg font-medium tracking-tighter text-grey-900">
        Ringkasan Akademik
      </h2>

      {/* Active module */}
      <div className="mt-4 rounded-2xl border border-white/50 bg-white/40 p-4 backdrop-blur-md">
        {activeModule ? (
          <>
            <div className="flex items-center justify-between">
              <h3 className="text-base font-medium tracking-tighter text-grey-900">
                Modul {activeModule.order} — {activeModule.title}
              </h3>
              <span className="shrink-0 rounded-full bg-primary/10 px-2.5 py-1 font-secondary text-[11px] font-medium tracking-tight text-primary">
                Aktif
              </span>
            </div>

            {activeModule.tpDeadline && (
              <p className="mt-1.5 font-secondary text-xs tracking-tight text-grey-500">
                Deadline TP{" "}
                {new Date(activeModule.tpDeadline).toLocaleString("id-ID", {
                  day: "numeric",
                  month: "short",
                  hour: "2-digit",
                  minute: "2-digit",
                })}{" "}
                WIB
              </p>
            )}
          </>
        ) : (
          <div className="flex items-center gap-2 text-grey-500">
            <LockKeyhole className="h-4 w-4" strokeWidth={1.5} />
            <p className="font-secondary text-sm font-medium tracking-tight">
              Belum ada modul aktif.
            </p>
          </div>
        )}

        <p className="mt-3 font-secondary text-xs tracking-tight text-grey-500">
          {activeModulesCount} / {totalModulesCount} modul aktif
        </p>
      </div>

      {/* Score averages */}
      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-2xl border border-white/50 bg-white/50 p-4 shadow-[0_4px_20px_rgb(0,0,0,0.03)] backdrop-blur-md">
          <div className="mb-2 flex items-center gap-1.5 text-primary">
            <TrendingUp className="h-4 w-4" strokeWidth={1.5} />
            <span className="font-secondary text-xs font-medium tracking-tight text-grey-500">
              Rata-rata TP
            </span>
          </div>
          <p className="text-2xl font-medium tracking-tighter text-grey-900">
            {averageTpScore ?? "-"}
          </p>
        </div>

        <div className="rounded-2xl border border-white/50 bg-white/50 p-4 shadow-[0_4px_20px_rgb(0,0,0,0.03)] backdrop-blur-md">
          <div className="mb-2 flex items-center gap-1.5 text-primary">
            <TrendingUp className="h-4 w-4" strokeWidth={1.5} />
            <span className="font-secondary text-xs font-medium tracking-tight text-grey-500">
              Rata-rata TA
            </span>
          </div>
          <p className="text-2xl font-medium tracking-tighter text-grey-900">
            {averageTaScore ?? "-"}
          </p>
        </div>
      </div>

      <div className="mt-3 flex items-center gap-2 rounded-2xl border border-success/20 bg-success/5 px-4 py-3 text-success backdrop-blur-md">
        <FileCheck2 className="h-4 w-4 shrink-0" strokeWidth={1.5} />
        <p className="font-secondary text-xs font-medium tracking-tight">
          {tpSubmittedTodayCount} TP masuk hari ini
        </p>
      </div>
    </div>
  );
}
