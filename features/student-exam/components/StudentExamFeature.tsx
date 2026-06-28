"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock,
  ShieldAlert,
  ClipboardList,
  LockKeyhole,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { StudentBottomNavigation } from "@/features/student-navigation";
import { useStudentModules } from "@/features/student-modules";
import { ExamAttempt, Question } from "../types/student-exam.type";
import {
  useJoinExam,
  useReportCheat,
  useSaveAnswer,
  useSubmitExam,
  useUnblockAttempt,
  useTodayExamSessions,
} from "../hooks/use-student-exam";

type ExamState =
  | "SELECT_MODULE"
  | "ENTER_CODE"
  | "IN_PROGRESS"
  | "BLOCKED"
  | "SUBMITTED";
type AnswerOption = "A" | "B" | "C" | "D" | "E";

export function StudentExamFeature() {
  const { data: modulesRes, isLoading: isModulesLoading } = useStudentModules();
  const { data: todaySessions = [], isLoading: isSessionsLoading } =
    useTodayExamSessions();
  const isLoadingData = isModulesLoading || isSessionsLoading;

  const [examState, setExamState] = useState<ExamState>("SELECT_MODULE");
  const [selectedSessionId, setSelectedSessionId] = useState("");
  const [accessCode, setAccessCode] = useState("");
  const [joinError, setJoinError] = useState("");

  const [attempt, setAttempt] = useState<ExamAttempt | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, AnswerOption>>({});
  const [timeLeft, setTimeLeft] = useState("--:--");

  // Unblock State
  const [unblockCode, setUnblockCode] = useState("");
  const [unblockError, setUnblockError] = useState("");

  // Mutations
  const { mutateAsync: joinExam, isPending: isJoining } = useJoinExam();
  const { mutateAsync: saveAnswer } = useSaveAnswer();
  const { mutateAsync: submitExam, isPending: isSubmitting } = useSubmitExam();
  const { mutateAsync: reportCheat } = useReportCheat();
  const { mutateAsync: unblockAttempt, isPending: isUnblocking } =
    useUnblockAttempt();

  // 1. TIMER EFFECT
  useEffect(() => {
    if (examState !== "IN_PROGRESS" || !attempt) return;

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const expiredAt = new Date(attempt.expiredAt).getTime();
      const distance = expiredAt - now;

      if (distance <= 0) {
        clearInterval(interval);
        setTimeLeft("00:00");
        handleForceSubmit();
      } else {
        const m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((distance % (1000 * 60)) / 1000);
        setTimeLeft(
          `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`,
        );
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [examState, attempt]);

  useEffect(() => {
    if (examState !== "IN_PROGRESS" || !attempt) return;

    const handleBlur = async () => {
      try {
        const res = await reportCheat(selectedSessionId);
        setAttempt(res.attempt);
        setExamState("BLOCKED");
      } catch (error) {
        console.error("Gagal merekam indikasi kecurangan:", error);
      }
    };

    window.addEventListener("blur", handleBlur);
    return () => window.removeEventListener("blur", handleBlur);
  }, [examState, attempt, selectedSessionId]);

  // 3. HANDLERS
  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    setJoinError("");

    if (!selectedSessionId || !accessCode) {
      setJoinError("Kode Akses wajib diisi.");
      return;
    }

    try {
      const res = await joinExam({ sessionId: selectedSessionId, accessCode });
      setAttempt(res.attempt);
      setQuestions(res.questions);
      setExamState(res.attempt.status as ExamState);
    } catch (error: any) {
      if (
        error?.response?.status === 403 &&
        error.response.data.message.includes("diblokir")
      ) {
        setExamState("BLOCKED");
      } else {
        setJoinError(
          error?.response?.data?.message || "Gagal masuk ke sesi ujian.",
        );
      }
    }
  };

  const handleSelectAnswer = async (
    questionId: string,
    option: AnswerOption,
  ) => {
    setAnswers((prev) => ({ ...prev, [questionId]: option }));
    try {
      await saveAnswer({
        sessionId: selectedSessionId,
        questionId,
        selectedOption: option,
      });
    } catch (error) {
      console.error("Gagal menyimpan jawaban:", error);
    }
  };

  const handleForceSubmit = async () => {
    try {
      await submitExam(selectedSessionId);
      setExamState("SUBMITTED");
    } catch (error) {
      setExamState("SUBMITTED");
    }
  };

  const handleManualSubmit = async () => {
    if (
      !confirm(
        "Apakah Anda yakin ingin menyelesaikan ujian ini? Jawaban tidak dapat diubah lagi.",
      )
    )
      return;
    try {
      await submitExam(selectedSessionId);
      setExamState("SUBMITTED");
    } catch (error: any) {
      alert(error?.response?.data?.message || "Gagal menyelesaikan ujian.");
    }
  };

  const handleUnblock = async (e: React.FormEvent) => {
    e.preventDefault();
    setUnblockError("");
    try {
      const res = await unblockAttempt({
        sessionId: selectedSessionId,
        code: unblockCode,
      });
      setAttempt(res.attempt);
      setExamState("IN_PROGRESS");
      setUnblockCode("");
    } catch (error: any) {
      setUnblockError(
        error?.response?.data?.message || "Kode unblock tidak valid.",
      );
    }
  };

  if (examState === "SELECT_MODULE") {
    const modules = modulesRes?.data || [];

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
                    <Button
                      size="sm"
                      onClick={() => {
                        setSelectedSessionId(session.id);
                        setExamState("ENTER_CODE");
                      }}
                    >
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

  if (examState === "ENTER_CODE") {
    return (
      <main className="min-h-screen bg-grey-50 pb-28">
        <section className="px-5 pt-6">
          <button
            onClick={() => setExamState("SELECT_MODULE")}
            className="mb-5 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 font-secondary text-xs font-bold text-primary shadow-sm hover:bg-grey-50"
          >
            <ArrowLeft className="h-4 w-4" /> Batal
          </button>
          <h1 className="text-2xl font-extrabold text-grey-900">
            Otentikasi Ujian
          </h1>
          <p className="mt-2 font-secondary text-sm text-grey-500">
            Masukkan <b>Kode Akses</b> yang diberikan oleh Asisten untuk memulai
            Tes Awal ini.
          </p>
        </section>

        <section className="mt-6 px-5">
          <form
            onSubmit={handleJoin}
            className="rounded-3xl bg-white p-6 shadow-sm"
          >
            <div className="space-y-4">
              <div>
                <label className="mb-2 block font-secondary text-sm font-semibold text-grey-900">
                  Kode Akses
                </label>
                <Input
                  value={accessCode}
                  onChange={(e) => setAccessCode(e.target.value)}
                  placeholder="Contoh: MBCLAB123"
                />
              </div>
              {joinError && (
                <div className="rounded-xl bg-error/10 p-3 font-secondary text-sm text-error">
                  {joinError}
                </div>
              )}
              <Button type="submit" disabled={isJoining} className="w-full">
                {isJoining ? "Memverifikasi..." : "Mulai Mengerjakan"}
              </Button>
            </div>
          </form>
        </section>
      </main>
    );
  }

  if (examState === "BLOCKED") {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-grey-900 px-5 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-error/20 text-error">
          <ShieldAlert className="h-10 w-10" />
        </div>
        <h1 className="mt-6 text-2xl font-extrabold text-white">
          Ujian Diblokir!
        </h1>
        <p className="mt-2 font-secondary text-sm text-grey-400">
          Sistem mendeteksi Anda meninggalkan halaman ujian. Silakan minta{" "}
          <b>Kode Unblock</b> kepada Asisten Praktikum.
        </p>

        <form
          onSubmit={handleUnblock}
          className="mt-8 w-full max-w-sm rounded-3xl bg-grey-800 p-6 shadow-xl"
        >
          <Input
            value={unblockCode}
            onChange={(e) => setUnblockCode(e.target.value)}
            placeholder="Masukkan 6 digit kode"
            className="mb-4 bg-grey-900 text-white placeholder:text-grey-600 focus:ring-error/20 border-grey-700 text-center text-xl tracking-widest font-bold"
            maxLength={6}
          />
          {unblockError && (
            <p className="mb-4 font-secondary text-sm text-error">
              {unblockError}
            </p>
          )}
          <Button
            type="submit"
            disabled={isUnblocking}
            variant="danger"
            className="w-full"
          >
            {isUnblocking ? "Membuka..." : "Buka Blokir"}
          </Button>
        </form>
      </main>
    );
  }

  if (examState === "SUBMITTED") {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-grey-50 px-5 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-success/20 text-success">
          <CheckCircle2 className="h-10 w-10" />
        </div>
        <h1 className="mt-6 text-2xl font-extrabold text-grey-900">
          Ujian Selesai
        </h1>
        <p className="mt-2 font-secondary text-sm text-grey-500">
          Jawaban Tes Awal (TA) Anda berhasil disubmit dan terekam di sistem.
        </p>
        <Link
          href="/student/dashboard"
          className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-primary px-6 py-3 font-secondary text-sm font-bold text-white shadow-lg shadow-primary/20"
        >
          Kembali ke Dashboard
        </Link>
      </main>
    );
  }

  const currentQuestion = questions[currentIdx];

  return (
    <main className="min-h-screen bg-grey-50 pb-24 select-none">
      <header className="sticky top-0 z-40 border-b border-grey-200 bg-white px-5 py-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 rounded-full bg-error/10 px-4 py-2 text-error">
            <Clock className="h-4 w-4 shrink-0" />
            <span className="font-secondary text-sm font-bold tabular-nums">
              {timeLeft}
            </span>
          </div>
          <Button
            onClick={handleManualSubmit}
            disabled={isSubmitting}
            variant="outline"
            size="sm"
            className="border-error text-error hover:bg-error/10"
          >
            {isSubmitting ? "Loading..." : "Akhiri Ujian"}
          </Button>
        </div>

        <div className="mt-4 flex gap-1">
          {questions.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full ${i <= currentIdx ? "bg-primary" : "bg-grey-200"}`}
            />
          ))}
        </div>
      </header>

      <section className="px-5 pt-8">
        <div className="mb-4 inline-flex items-center gap-2 rounded-xl bg-primary/10 px-3 py-1 font-secondary text-xs font-bold text-primary">
          Soal {currentIdx + 1} dari {questions.length}
        </div>
        <h2 className="text-lg font-bold leading-relaxed text-grey-900">
          {currentQuestion?.content}
        </h2>

        <div className="mt-6 space-y-3">
          {(["A", "B", "C", "D", "E"] as AnswerOption[]).map((opt) => {
            const optionText =
              currentQuestion?.[`option${opt}` as keyof Question];
            if (!optionText) return null;

            const isSelected = answers[currentQuestion.id] === opt;

            return (
              <button
                key={opt}
                onClick={() => handleSelectAnswer(currentQuestion.id, opt)}
                className={`flex w-full items-start gap-4 rounded-2xl border p-4 text-left transition-all ${
                  isSelected
                    ? "border-primary bg-primary/5 shadow-sm shadow-primary/10"
                    : "border-grey-200 bg-white hover:border-primary/30"
                }`}
              >
                <div
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs font-bold ${
                    isSelected
                      ? "border-primary bg-primary text-white"
                      : "border-grey-300 text-grey-500"
                  }`}
                >
                  {opt}
                </div>
                <p
                  className={`font-secondary text-sm leading-relaxed ${isSelected ? "font-semibold text-primary" : "text-grey-700"}`}
                >
                  {optionText}
                </p>
              </button>
            );
          })}
        </div>
      </section>

      <div className="fixed bottom-0 left-0 right-0 border-t border-grey-200 bg-white p-4">
        <div className="mx-auto flex max-w-[480px] items-center justify-between">
          <Button
            variant="outline"
            disabled={currentIdx === 0}
            onClick={() => setCurrentIdx((p) => p - 1)}
            className="w-[120px]"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Prev
          </Button>

          {currentIdx === questions.length - 1 ? (
            <Button
              onClick={handleManualSubmit}
              disabled={isSubmitting}
              className="w-[120px]"
            >
              Submit
            </Button>
          ) : (
            <Button
              onClick={() => setCurrentIdx((p) => p + 1)}
              className="w-[120px]"
            >
              Next <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </main>
  );
}
