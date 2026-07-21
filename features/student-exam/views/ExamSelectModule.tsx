import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  ClipboardList,
  LockKeyhole,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import {
  MyExamSession,
  MyExamAttemptHistory,
} from "../types/student-exam.type";
import { PracticumModule } from "@/features/student-modules";
import { getShiftLabel } from "@/features/admin-exam-sessions/constants/admin-exam-session.constant";

type Props = {
  modules: PracticumModule[];
  mySessions: MyExamSession[];
  myAttempts: MyExamAttemptHistory[];
  isLoadingData: boolean;
  onSelectSession: (sessionId: string) => void;
};

export function ExamSelectModule({
  modules,
  mySessions,
  myAttempts,
  isLoadingData,
  onSelectSession,
}: Props) {
  const activeModules = modules.filter((m) => m.isActive);

  const availableModules = activeModules.filter((mod) => {
    const session = mySessions.find((s) => s.moduleId === mod.id);
    const hasSubmitted = session?.attempts?.some(
      (a) => a.status === "SUBMITTED",
    );
    return !hasSubmitted;
  });

  return (
    <main className="relative min-h-screen overflow-hidden bg-[linear-gradient(180deg,#0065b0_0%,#1e3f75_30%,#eaf6ff_58%,#ffffff_86%)] pb-10 font-primary selection:bg-primary/20">
      <div className="pointer-events-none absolute -right-20 top-8 h-60 w-60 rounded-full bg-white/15 blur-[75px]" />
      <div className="pointer-events-none absolute -left-24 top-52 h-64 w-64 rounded-full bg-white/10 blur-[80px]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.2),transparent_34%)]" />

      <div className="relative z-10">
        <section className="px-5 pt-8 text-white">
          <Link
            href="/student/assessment"
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 font-secondary text-xs font-bold text-white shadow-sm backdrop-blur-md transition hover:bg-white/20 active:scale-[0.96]"
          >
            <ArrowLeft className="h-4 w-4" /> Kembali
          </Link>

          <h1 className="text-[32px] font-extrabold tracking-tight drop-shadow-sm">
            Tes Awal (TA)
          </h1>
          <p className="mt-2 max-w-sm font-secondary text-sm leading-relaxed text-white/85">
            Pilih modul ujian. Akses ujian akan terbuka secara otomatis sesuai
            dengan jadwal praktikum kelompok Anda.
          </p>
        </section>

        <section className="mt-8 space-y-4 px-5">
          <h2 className="text-xl font-extrabold text-white drop-shadow-sm">
            Ujian Tersedia
          </h2>

          {isLoadingData ? (
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className="h-28 w-full animate-pulse rounded-[30px] bg-white/40 backdrop-blur-xl"
                />
              ))}
            </div>
          ) : availableModules.length === 0 ? (
            <div className="rounded-[30px] border border-white/50 bg-white/40 p-6 text-center shadow-sm backdrop-blur-xl">
              <p className="font-secondary text-sm font-semibold text-slate-600">
                {activeModules.length === 0
                  ? "Belum ada modul praktikum aktif."
                  : "Semua ujian pada modul aktif sudah Anda kerjakan."}
              </p>
            </div>
          ) : (
            availableModules.map((mod) => {
              const session = mySessions.find((s) => s.moduleId === mod.id);

              let statusLabel = "Belum Ada Jadwal";
              let statusClass =
                "bg-slate-100 text-slate-500 border border-slate-200";
              let actionButton = null;

              if (session) {
                const now = new Date();
                const sessionDate = new Date(session.date);
                const start = new Date(session.startTime);
                const end = new Date(session.endTime);

                const isToday =
                  now.getFullYear() === sessionDate.getFullYear() &&
                  now.getMonth() === sessionDate.getMonth() &&
                  now.getDate() === sessionDate.getDate();

                const formattedDate = sessionDate.toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                });

                const shiftName = session.shift.replace("_", " ");

                if (isToday) {
                  if (now < start) {
                    statusLabel = `Hari ini Pukul ${start.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}`;
                    statusClass =
                      "bg-info/15 text-info-700 border border-info/20";
                  } else if (now > end) {
                    statusLabel = "Waktu Ujian Berakhir";
                    statusClass =
                      "bg-error/10 text-error-700 border border-error/20";
                  } else {
                    statusLabel = "Sedang Berlangsung";
                    statusClass =
                      "bg-success/15 text-success-700 border border-success/20";
                    actionButton = (
                      <Button
                        onClick={() => onSelectSession(session.id)}
                        className="w-full h-11 rounded-xl shadow-primary/25"
                      >
                        Masuk Ujian <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    );
                  }
                } else if (sessionDate > now) {
                  statusLabel = `Jadwal: ${formattedDate} (${shiftName})`;
                  statusClass =
                    "bg-warning/15 text-warning-700 border border-warning/20";
                } else {
                  statusLabel = `Sesi Telah Berlalu (${formattedDate})`;
                  statusClass =
                    "bg-slate-100 text-slate-500 border border-slate-200";
                }
              }

              return (
                <article
                  key={mod.id}
                  className="relative overflow-hidden rounded-[30px] border border-white/60 bg-white/60 p-5 shadow-[0_16px_45px_-28px_rgba(0,101,176,0.15)] backdrop-blur-2xl"
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-[22px] shadow-sm ${
                        actionButton
                          ? "bg-primary text-white shadow-primary/30"
                          : "bg-white text-slate-400"
                      }`}
                    >
                      {actionButton ? (
                        <ClipboardList className="h-7 w-7" strokeWidth={1.8} />
                      ) : (
                        <LockKeyhole className="h-6 w-6" strokeWidth={1.8} />
                      )}
                    </div>

                    <div className="min-w-0 flex-1 pt-1">
                      <h2 className="text-[17px] font-extrabold text-slate-900 tracking-tight">
                        {mod.title}
                      </h2>
                      <div className="mt-2 flex flex-wrap items-center">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 font-secondary text-[11px] font-bold ${statusClass}`}
                        >
                          {statusLabel}
                        </span>
                      </div>
                    </div>
                  </div>

                  {actionButton && (
                    <div className="mt-5 border-t border-white/40 pt-4">
                      {actionButton}
                    </div>
                  )}
                </article>
              );
            })
          )}
        </section>

        {!isLoadingData && myAttempts.length > 0 && (
          <section className="mt-10 space-y-4 px-5">
            <h2 className="text-xl font-extrabold text-white drop-shadow-sm">
              Riwayat Ujian
            </h2>

            {myAttempts.map((attempt) => {
              const isDisqualified = attempt.cheatCount >= 5;
              const statusLabel = isDisqualified
                ? "Didiskualifikasi"
                : "Selesai";
              const statusColor = isDisqualified
                ? "text-error"
                : "text-success-700";
              const bgColor = isDisqualified ? "bg-error/15" : "bg-success/15";
              const IconComponent = isDisqualified
                ? AlertTriangle
                : CheckCircle2;

              return (
                <article
                  key={attempt.id}
                  className="relative overflow-hidden rounded-[30px] border border-white/60 bg-white/40 p-5 shadow-sm backdrop-blur-xl"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[20px] bg-white text-slate-400 shadow-sm">
                      <IconComponent
                        className={`h-6 w-6 ${isDisqualified ? "text-error" : "text-success"}`}
                        strokeWidth={2}
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <h2 className="text-[15px] font-extrabold text-slate-900 tracking-tight">
                        {attempt.session.module.title}
                      </h2>
                      <p className="mt-0.5 font-secondary text-xs text-slate-600">
                        {new Date(attempt.session.date).toLocaleDateString(
                          "id-ID",
                          {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          },
                        )}{" "}
                        • {getShiftLabel(attempt.session.shift as any)}
                      </p>

                      <div className="mt-3">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 font-secondary text-[10px] font-bold ${bgColor} ${statusColor}`}
                        >
                          {statusLabel}
                        </span>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </section>
        )}
      </div>
    </main>
  );
}
