import {
  CalendarClock,
  Download,
  Pencil,
  Trash2,
  Lock,
  Clock,
} from "lucide-react";
import { AdminModule } from "../types/admin-module.type";
import {
  isDeadlinePassed,
  isDeadlineNear,
  getDeadlineCountdownLabel,
  formatDeadline,
} from "@/shared/utils/deadline";

type ModuleCardProps = {
  module: AdminModule;
  onEdit: () => void;
  onDelete: () => void;
};

export function ModuleCard({ module, onEdit, onDelete }: ModuleCardProps) {
  const deadlinePassed = isDeadlinePassed(module.tpDeadline);
  const deadlineNear = module.tpDeadline
    ? isDeadlineNear(module.tpDeadline)
    : false;

  return (
    <article className="group relative overflow-hidden rounded-[32px] border border-white/60 bg-white/60 p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-2xl transition-all duration-500 hover:-translate-y-1 hover:bg-white/70 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
      <div
        className={`absolute inset-y-0 left-0 w-1 transition-colors duration-300 ${
          !module.isActive
            ? "bg-grey-300/50"
            : deadlinePassed
              ? "bg-error/80"
              : "bg-primary/80"
        }`}
      />

      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/50 border border-white/60 backdrop-blur-md shadow-sm font-primary text-xl font-medium tracking-tighter text-primary">
            {module.order}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-1.5">
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-0.5 font-secondary text-[10px] font-medium tracking-tight backdrop-blur-md ${
                  module.isActive
                    ? "bg-success/10 text-success border border-success/10"
                    : "bg-grey-100/50 text-grey-500 border border-grey-200/50"
                }`}
              >
                {module.isActive ? "Aktif" : "Nonaktif"}
              </span>

              {module.tpDeadline && (
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 font-secondary text-[10px] font-medium tracking-tight backdrop-blur-md ${
                    deadlinePassed
                      ? "bg-error/10 text-error border border-error/10"
                      : deadlineNear
                        ? "bg-warning/10 text-warning-700 border border-warning/10"
                        : "bg-info/10 text-info-700 border border-info/10"
                  }`}
                >
                  {deadlinePassed ? (
                    <>
                      <Lock className="h-2.5 w-2.5" strokeWidth={1.5} />
                      TP Ditutup
                    </>
                  ) : (
                    <>
                      <Clock className="h-2.5 w-2.5" strokeWidth={1.5} />
                      TP Terbuka
                    </>
                  )}
                </span>
              )}
            </div>
            <h3 className="mt-1.5 text-lg font-medium tracking-tighter text-grey-900">
              {module.title}
            </h3>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-1.5 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <button
            onClick={onEdit}
            className="flex h-9 w-9 items-center justify-center rounded-full text-grey-500 transition hover:bg-white hover:text-primary hover:shadow-sm"
            aria-label="Edit modul"
          >
            <Pencil className="h-4 w-4" strokeWidth={1.5} />
          </button>
          <button
            onClick={onDelete}
            className="flex h-9 w-9 items-center justify-center rounded-full text-grey-500 transition hover:bg-white hover:text-error hover:shadow-sm"
            aria-label="Hapus modul"
          >
            <Trash2 className="h-4 w-4" strokeWidth={1.5} />
          </button>
        </div>
      </div>

      {module.description && (
        <p className="mt-4 line-clamp-2 font-secondary text-sm leading-relaxed tracking-tight text-grey-500">
          {module.description}
        </p>
      )}

      <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-white/50 pt-4">
        {module.tpDeadline ? (
          <div
            className={`flex items-center gap-2 rounded-2xl px-3.5 py-2 font-secondary text-xs font-medium tracking-tight backdrop-blur-md border ${
              deadlinePassed
                ? "bg-error/5 text-error border-error/10"
                : deadlineNear
                  ? "bg-warning/5 text-warning-700 border-warning/10"
                  : "bg-white/40 text-grey-700 border-white/50"
            }`}
          >
            <CalendarClock className="h-3.5 w-3.5 shrink-0" strokeWidth={1.5} />
            <div className="flex flex-col leading-tight gap-0.5">
              <span>{formatDeadline(module.tpDeadline)} WIB</span>
              <span className="font-medium opacity-80">
                {getDeadlineCountdownLabel(module.tpDeadline)}
              </span>
            </div>
          </div>
        ) : (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/40 border border-white/50 backdrop-blur-md px-3 py-1.5 font-secondary text-xs font-medium tracking-tight text-grey-500">
            Tanpa deadline TP — selalu terbuka
          </span>
        )}

        <div className="ml-auto flex gap-2">
          {module.fileUrlRegular && (
            <a
              href={module.fileUrlRegular}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full border border-white/60 bg-white/50 backdrop-blur-md px-3 py-1.5 font-secondary text-[11px] font-medium tracking-tight text-grey-700 shadow-sm transition hover:border-primary/30 hover:text-primary hover:bg-white"
            >
              <Download className="h-3.5 w-3.5" strokeWidth={1.5} />
              Reguler
            </a>
          )}
          {module.fileUrlInternational && (
            <a
              href={module.fileUrlInternational}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full border border-white/60 bg-white/50 backdrop-blur-md px-3 py-1.5 font-secondary text-[11px] font-medium tracking-tight text-grey-700 shadow-sm transition hover:border-primary/30 hover:text-primary hover:bg-white"
            >
              <Download className="h-3.5 w-3.5" strokeWidth={1.5} />
              Intl
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
