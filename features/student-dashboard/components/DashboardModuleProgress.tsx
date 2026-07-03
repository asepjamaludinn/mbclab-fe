import Link from "next/link";
import {
  CheckCircle2,
  Clock3,
  Download,
  FileCheck2,
  FileText,
  LockKeyhole,
  PlayCircle,
} from "lucide-react";
import { PracticumModule } from "@/features/student-modules";

type DashboardModuleProgressProps = {
  activeModule: PracticumModule | null;
  isTpSubmitted: boolean;
};

function getStatusConfig(isActive: boolean, isTpSubmitted: boolean) {
  if (!isActive) {
    return {
      icon: LockKeyhole,
      label: "Terkunci",
      className: "bg-grey-200 text-grey-700",
      iconClassName: "border-white/45 bg-grey-500/70 text-white",
    };
  }

  if (isTpSubmitted) {
    return {
      icon: CheckCircle2,
      label: "TP Selesai",
      className: "bg-success/10 text-success",
      iconClassName: "border-white/45 bg-success/80 text-white",
    };
  }

  return {
    icon: PlayCircle,
    label: "Aktif",
    className: "bg-primary/10 text-primary",
    iconClassName: "border-white/45 bg-primary/80 text-white",
  };
}

export function DashboardModuleProgress({
  activeModule,
  isTpSubmitted,
}: DashboardModuleProgressProps) {
  const config = activeModule
    ? getStatusConfig(activeModule.isActive, isTpSubmitted)
    : null;

  const Icon = config?.icon;

  const canDownload = !!activeModule?.fileUrl && activeModule.fileUrl !== "#";

  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-extrabold tracking-tight text-white">
          Modul Terbaru
        </h2>

        <Link
          href="/student/modules"
          className="font-secondary text-[11px] font-bold text-white transition hover:text-white/75"
        >
          Lihat Semua
        </Link>
      </div>

      {!activeModule || !config || !Icon ? (
        <div className="rounded-[34px] border border-white/45 bg-white/20 p-6 text-center shadow-[0_18px_50px_-32px_rgba(0,101,176,0.35)] backdrop-blur-2xl">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full border border-white/45 bg-white/25 text-primary shadow-sm backdrop-blur-xl">
            <FileText className="h-6 w-6" strokeWidth={1.7} />
          </div>

          <p className="font-secondary text-sm font-semibold text-white/80">
            Belum ada modul aktif.
          </p>
        </div>
      ) : (
        <article className="relative overflow-hidden rounded-[36px] border border-white/35 bg-white/20 p-5 shadow-[0_24px_60px_-38px_rgba(0,101,176,0.55)] backdrop-blur-2xl">
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.28)_0%,rgba(234,248,255,0.16)_55%,rgba(215,247,255,0.18)_100%)]" />
          <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-primary/10 blur-[70px]" />
          <div className="pointer-events-none absolute -bottom-24 -left-20 h-60 w-60 rounded-full bg-secondary/10 blur-[80px]" />

          <div className="relative z-10">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div
                className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-full border shadow-sm backdrop-blur-xl ${config.iconClassName}`}
              >
                <Icon className="h-7 w-7" strokeWidth={1.7} />
              </div>

              {canDownload ? (
                <a
                  href={activeModule.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/45 bg-white/25 text-primary shadow-sm backdrop-blur-xl transition hover:bg-primary hover:text-white active:scale-[0.96]"
                  aria-label="Download modul"
                >
                  <Download className="h-5 w-5" strokeWidth={1.8} />
                </a>
              ) : (
                <div
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/45 bg-white/20 text-grey-500 shadow-sm backdrop-blur-xl"
                  aria-label="Modul belum dapat diunduh"
                >
                  <Download className="h-5 w-5" strokeWidth={1.8} />
                </div>
              )}
            </div>

            <p className="font-secondary text-[11px] font-bold uppercase tracking-[0.16em] text-primary">
              Modul {activeModule.order}
            </p>

            <h3 className="mt-2 line-clamp-2 text-[26px] font-extrabold leading-[1.05] tracking-tight text-grey-900">
              {activeModule.title}
            </h3>

            <div className="mt-3 flex flex-wrap gap-2">
              <span
                className={`rounded-full px-3 py-1 font-secondary text-[11px] font-bold ${config.className}`}
              >
                {config.label}
              </span>

              <span className="rounded-full border border-white/45 bg-white/25 px-3 py-1 font-secondary text-[11px] font-bold text-grey-700 shadow-sm backdrop-blur-xl">
                Praktikum
              </span>
            </div>

            <div className="my-6 grid grid-cols-2 divide-x divide-white/35 rounded-[26px] border border-white/35 bg-white/20 px-3 py-4 shadow-sm backdrop-blur-xl">
              <div className="text-center">
                <div className="mb-2 flex items-center justify-center gap-1.5">
                  <FileCheck2 className="h-4 w-4 text-primary" />
                  <p className="text-lg font-extrabold text-grey-900">
                    {isTpSubmitted ? "Selesai" : "Belum"}
                  </p>
                </div>

                <p className="font-secondary text-xs font-medium text-grey-500">
                  Status TP
                </p>
              </div>

              <div className="text-center">
                <div className="mb-2 flex items-center justify-center gap-1.5">
                  <Clock3 className="h-4 w-4 text-warning" />
                  <p className="text-lg font-extrabold text-grey-900">Belum</p>
                </div>

                <p className="font-secondary text-xs font-medium text-grey-500">
                  Status TA
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/student/modules"
                className="flex h-[52px] flex-1 items-center justify-center rounded-full border border-white/45 bg-white/25 font-secondary text-sm font-extrabold text-grey-900 shadow-sm backdrop-blur-xl transition hover:border-primary hover:bg-primary hover:text-white active:scale-[0.98]"
              >
                Lihat Detail Modul
              </Link>

              <Link
                href="/student/submissions"
                className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-full border border-white/45 bg-white/25 text-primary shadow-sm backdrop-blur-xl transition hover:bg-primary hover:text-white active:scale-[0.96]"
                aria-label="Upload TP"
              >
                <FileCheck2 className="h-5 w-5" strokeWidth={1.8} />
              </Link>
            </div>
          </div>
        </article>
      )}
    </section>
  );
}
