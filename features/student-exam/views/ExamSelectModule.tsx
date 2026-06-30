import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  ClipboardList,
  LockKeyhole,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { StudentBottomNavigation } from "@/features/student-navigation";
import { TodayExamSession } from "../types/student-exam.type";
import { PracticumModule } from "@/features/student-modules";

type Props = {
  modules: PracticumModule[];
  todaySessions: TodayExamSession[];
  isLoadingData: boolean;
  onSelectSession: (sessionId: string) => void;
};

export function ExamSelectModule({
  modules,
  todaySessions,
  isLoadingData,
  onSelectSession,
}: Props) {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(0,101,176,0.18),transparent_32%),linear-gradient(180deg,#f8f9fa_0%,#edf6ff_42%,#f8f9fa_100%)] pb-28">
      <section className="px-5 pt-6">
        <Link
          href="/student/dashboard"
          className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/70 px-4 py-2 font-secondary text-xs font-bold text-primary shadow-sm backdrop-blur-xl transition hover:bg-primary hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" /> Kembali
        </Link>
        <p className="font-secondary text-[11px] font-bold uppercase tracking-[0.18em] text-primary/70">
          Tes Awal (TA)
        </p>
        <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-grey-900">
          Pilih Modul Ujian
        </h1>
        <p className="mt-2 font-secondary text-sm leading-relaxed text-grey-500">
          Modul hanya akan terbuka sesuai jadwal sesi praktikum kelompok Anda
          hari ini.
        </p>
      </section>

      <section className="mt-6 space-y-4 px-5">
        {isLoadingData ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-28 w-full animate-pulse rounded-[30px] bg-white/60"
              />
            ))}
          </div>
        ) : modules.length === 0 ? (
          <div className="rounded-[30px] border border-white/70 bg-white/80 p-5 text-center shadow-sm">
            <p className="font-secondary text-sm font-semibold text-grey-500">
              Belum ada modul praktikum aktif.
            </p>
          </div>
        ) : (
          modules.map((mod) => {
            const session = todaySessions.find((s) => s.moduleId === mod.id);
            let statusLabel = "Tidak Ada Jadwal Hari Ini";
            let statusClass = "bg-grey-200 text-grey-600";
            let actionButton = null;

            if (session) {
              const now = new Date();
              const start = new Date(session.startTime);
              const end = new Date(session.endTime);

              if (now < start) {
                statusLabel = `Mulai Pukul ${start.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}`;
                statusClass = "bg-warning/10 text-warning";
              } else if (now > end) {
                statusLabel = "Waktu Ujian Berakhir";
                statusClass = "bg-error/10 text-error";
              } else {
                statusLabel = "Sedang Berlangsung";
                statusClass = "bg-success/10 text-success";
                actionButton = (
                  <Button size="sm" onClick={() => onSelectSession(session.id)}>
                    Masuk Ujian <ArrowRight className="h-4 w-4" />
                  </Button>
                );
              }
            }

            return (
              <article
                key={mod.id}
                className="relative overflow-hidden rounded-[30px] border border-white/70 bg-white/80 p-5 shadow-[0_16px_45px_-28px_rgba(0,0,0,0.35)] backdrop-blur-xl"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[22px] bg-primary/10 text-primary shadow-sm">
                    {actionButton ? (
                      <ClipboardList className="h-7 w-7" strokeWidth={1.8} />
                    ) : (
                      <LockKeyhole className="h-6 w-6" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h2 className="text-base font-extrabold text-grey-900">
                      {mod.title}
                    </h2>
                    <span
                      className={`mt-2 inline-block rounded-full px-3 py-1 font-secondary text-[10px] font-bold ${statusClass}`}
                    >
                      {statusLabel}
                    </span>
                  </div>
                </div>
                {actionButton && (
                  <div className="mt-5 border-t border-grey-100 pt-4 flex justify-end">
                    {actionButton}
                  </div>
                )}
              </article>
            );
          })
        )}
      </section>
      <StudentBottomNavigation />
    </main>
  );
}
