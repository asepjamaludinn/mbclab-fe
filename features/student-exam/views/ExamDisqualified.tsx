import Link from "next/link";
import { ShieldAlert } from "lucide-react";

type ExamDisqualifiedProps = {
  message?: string;
};

export function ExamDisqualified({ message }: ExamDisqualifiedProps) {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[linear-gradient(180deg,#1e293b_0%,#0f172a_100%)] px-5 text-center font-primary">
      <div className="pointer-events-none absolute -top-20 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-error/20 blur-[100px]" />

      <div className="relative z-10 w-full max-w-sm rounded-[32px] border border-error/20 bg-white/5 p-8 shadow-2xl backdrop-blur-xl">
        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-[28px] bg-error/20 text-error shadow-[0_0_40px_-10px_rgba(220,38,38,0.4)] border border-error/20">
          <ShieldAlert className="h-12 w-12" strokeWidth={1.8} />
        </div>

        <h1 className="mt-6 text-3xl font-extrabold tracking-tight text-white">
          Ujian Diakhiri
        </h1>

        <p className="mt-3 font-secondary text-[14px] leading-relaxed text-slate-300">
          {message ||
            "Anda telah melebihi batas maksimal pelanggaran (meninggalkan halaman ujian berkali-kali). Ujian otomatis diakhiri."}
        </p>

        <div className="mt-6 rounded-2xl border border-error/20 bg-error/10 px-4 py-3">
          <p className="font-secondary text-sm font-bold text-error">
            Nilai Tes Awal (TA) Anda: 0
          </p>
        </div>

        <Link
          href="/student/dashboard"
          className="mt-8 flex h-[52px] w-full items-center justify-center rounded-2xl bg-white font-secondary text-[15px] font-bold text-slate-900 shadow-lg transition-all hover:bg-slate-100 active:scale-[0.98]"
        >
          Kembali ke Dashboard
        </Link>
      </div>
    </main>
  );
}
