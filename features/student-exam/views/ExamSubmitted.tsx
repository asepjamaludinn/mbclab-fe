import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

export function ExamSubmitted() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[linear-gradient(180deg,#0065b0_0%,#1e3f75_30%,#eaf6ff_58%,#ffffff_86%)] px-5 text-center font-primary">
      <div className="pointer-events-none absolute -right-20 top-8 h-60 w-60 rounded-full bg-white/15 blur-[75px]" />
      <div className="pointer-events-none absolute -left-24 top-52 h-64 w-64 rounded-full bg-white/10 blur-[80px]" />

      <div className="relative z-10 w-full max-w-sm rounded-[32px] border border-white/50 bg-white/40 p-8 shadow-[0_24px_60px_-38px_rgba(0,101,176,0.3)] backdrop-blur-2xl">
        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-[28px] bg-success text-white shadow-[0_10px_30px_-10px_rgba(22,163,74,0.6)]">
          <CheckCircle2 className="h-12 w-12" strokeWidth={2} />
        </div>

        <h1 className="mt-6 text-3xl font-extrabold tracking-tight text-slate-900">
          Ujian Selesai
        </h1>

        <p className="mt-3 font-secondary text-[14px] leading-relaxed text-slate-600">
          Selamat! Jawaban Tes Awal (TA) Anda berhasil disubmit dan telah aman
          terekam di sistem.
        </p>

        <Link
          href="/student/dashboard"
          className="mt-8 flex h-[52px] w-full items-center justify-center rounded-2xl bg-primary font-secondary text-[15px] font-bold text-white shadow-lg shadow-primary/25 transition-all hover:bg-secondary active:scale-[0.98]"
        >
          Kembali ke Dashboard
        </Link>
      </div>
    </main>
  );
}
