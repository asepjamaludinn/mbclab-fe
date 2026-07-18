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
    <article className="group relative overflow-hidden rounded-[28px] border border-grey-200/70 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
      <div
        className={`absolute inset-y-0 left-0 w-1 ${
          !module.isActive
            ? "bg-grey-300"
            : deadlinePassed
              ? "bg-error"
              : "bg-primary"
        }`}
      />

      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10 font-primary text-xl font-extrabold text-primary">
            {module.order}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-1.5">
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-0.5 font-secondary text-[10px] font-bold ${
                  module.isActive
                    ? "bg-success/10 text-success"
                    : "bg-grey-100 text-grey-500"
                }`}
              >
                {module.isActive ? "Aktif" : "Nonaktif"}
              </span>

              {module.tpDeadline && (
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 font-secondary text-[10px] font-bold ${
                    deadlinePassed
                      ? "bg-error/10 text-error"
                      : deadlineNear
                        ? "bg-warning/10 text-warning-700"
                        : "bg-info/10 text-info-700"
                  }`}
                >
                  {deadlinePassed ? (
                    <>
                      <Lock className="h-2.5 w-2.5" strokeWidth={2.5} />
                      TP Ditutup
                    </>
                  ) : (
                    <>
                      <Clock className="h-2.5 w-2.5" strokeWidth={2.5} />
                      TP Terbuka
                    </>
                  )}
                </span>
              )}
            </div>
            <h3 className="mt-1.5 text-lg font-extrabold tracking-tight text-grey-900">
              {module.title}
            </h3>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-1.5 opacity-0 transition-opacity group-hover:opacity-100">
          <button
            onClick={onEdit}
            className="flex h-9 w-9 items-center justify-center rounded-full text-grey-500 transition hover:bg-primary/10 hover:text-primary"
            aria-label="Edit modul"
          >
            <Pencil className="h-4 w-4" strokeWidth={2} />
          </button>
          <button
            onClick={onDelete}
            className="flex h-9 w-9 items-center justify-center rounded-full text-grey-500 transition hover:bg-error/10 hover:text-error"
            aria-label="Hapus modul"
          >
            <Trash2 className="h-4 w-4" strokeWidth={2} />
          </button>
        </div>
      </div>

      {module.description && (
        <p className="mt-4 line-clamp-2 font-secondary text-sm leading-relaxed text-grey-500">
          {module.description}
        </p>
      )}

      <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-grey-100 pt-4">
        {module.tpDeadline ? (
          <div
            className={`flex items-center gap-2 rounded-2xl px-3.5 py-2 font-secondary text-xs font-semibold ${
              deadlinePassed
                ? "bg-error/5 text-error"
                : deadlineNear
                  ? "bg-warning/5 text-warning-700"
                  : "bg-grey-50 text-grey-600"
            }`}
          >
            <CalendarClock className="h-3.5 w-3.5 shrink-0" />
            <div className="flex flex-col leading-tight">
              <span>{formatDeadline(module.tpDeadline)} WIB</span>
              <span className="font-bold">
                {getDeadlineCountdownLabel(module.tpDeadline)}
              </span>
            </div>
          </div>
        ) : (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-grey-50 px-3 py-1.5 font-secondary text-xs font-medium text-grey-400">
            Tanpa deadline TP — selalu terbuka
          </span>
        )}

        <div className="ml-auto flex gap-2">
          {module.fileUrlRegular && (
            <a
              href={module.fileUrlRegular}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full border border-grey-200 px-3 py-1.5 font-secondary text-[11px] font-bold text-grey-700 transition hover:border-primary hover:text-primary"
            >
              <Download className="h-3.5 w-3.5" />
              Reguler
            </a>
          )}
          {module.fileUrlInternational && (
            <a
              href={module.fileUrlInternational}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full border border-grey-200 px-3 py-1.5 font-secondary text-[11px] font-bold text-grey-700 transition hover:border-primary hover:text-primary"
            >
              <Download className="h-3.5 w-3.5" />
              Intl
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
