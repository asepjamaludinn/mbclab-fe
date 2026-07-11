import { ArrowLeft, KeyRound } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";

type Props = {
  accessCode: string;
  setAccessCode: (code: string) => void;
  joinError: string;
  isJoining: boolean;
  onJoin: (e: React.FormEvent) => void;
  onCancel: () => void;
};

export function ExamEnterCode({
  accessCode,
  setAccessCode,
  joinError,
  isJoining,
  onJoin,
  onCancel,
}: Props) {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[linear-gradient(180deg,#0065b0_0%,#1e3f75_30%,#eaf6ff_58%,#ffffff_86%)] px-5 font-primary selection:bg-primary/20">
      {/* Background Orbs */}
      <div className="pointer-events-none absolute -right-20 top-8 h-60 w-60 rounded-full bg-white/15 blur-[75px]" />
      <div className="pointer-events-none absolute -left-24 top-52 h-64 w-64 rounded-full bg-white/10 blur-[80px]" />
      <div className="pointer-events-none absolute bottom-10 right-10 h-40 w-40 rounded-full bg-primary/10 blur-[60px]" />

      {/* Tombol Kembali di Pojok Kiri Atas */}
      <button
        onClick={onCancel}
        className="absolute left-5 top-6 z-20 inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/15 px-4 py-2 font-secondary text-xs font-bold text-white shadow-sm backdrop-blur-md transition-all hover:bg-white/25 hover:shadow-md active:scale-[0.96] sm:left-8 sm:top-8"
      >
        <ArrowLeft className="h-4 w-4" /> Kembali
      </button>

      <div className="relative z-10 w-full max-w-sm">
        <div className="overflow-hidden rounded-[36px] border border-white/50 bg-white/40 p-8 shadow-[0_24px_60px_-38px_rgba(0,101,176,0.35)] backdrop-blur-2xl transition-all">
          <div className="mb-7 text-center">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-[22px] border border-white/60 bg-white text-primary shadow-lg shadow-primary/10">
              <KeyRound className="h-8 w-8" strokeWidth={1.8} />
            </div>
            <h1 className="text-[26px] font-extrabold tracking-tight text-slate-900 drop-shadow-sm">
              Otentikasi Ujian
            </h1>
            <p className="mt-2.5 font-secondary text-[13px] leading-relaxed text-slate-600">
              Masukkan <strong>Kode Akses</strong> dari Asisten Praktikum untuk
              memulai sesi ujian TA Anda.
            </p>
          </div>

          <form onSubmit={onJoin} className="space-y-5">
            <div>
              <Input
                value={accessCode}
                // Paksa input menjadi uppercase otomatis
                onChange={(e) => setAccessCode(e.target.value.toUpperCase())}
                placeholder="MBCLAB123"
                className="h-14 rounded-[20px] border-white/60 bg-white/80 text-center font-secondary text-xl font-extrabold uppercase tracking-[0.2em] text-slate-900 shadow-inner transition-all placeholder:font-medium placeholder:tracking-normal placeholder:text-slate-400 focus:border-primary focus:ring-primary/20"
                autoComplete="off"
                autoCorrect="off"
                spellCheck="false"
              />
            </div>

            {joinError && (
              <div className="animate-in fade-in zoom-in-95 rounded-[16px] border border-error/15 bg-error/10 p-3.5 text-center font-secondary text-sm font-semibold text-error-700">
                {joinError}
              </div>
            )}

            <Button
              type="submit"
              disabled={isJoining || !accessCode}
              className="h-[54px] w-full rounded-[20px] text-[15px] font-bold shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/30 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
            >
              {isJoining ? "Memverifikasi..." : "Mulai Ujian Sekarang"}
            </Button>
          </form>
        </div>
      </div>
    </main>
  );
}
