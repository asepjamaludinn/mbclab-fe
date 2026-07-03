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
      <div className="pointer-events-none absolute -right-20 top-8 h-60 w-60 rounded-full bg-white/15 blur-[75px]" />
      <div className="pointer-events-none absolute -left-24 top-52 h-64 w-64 rounded-full bg-white/10 blur-[80px]" />

      <div className="relative z-10 w-full max-w-sm">
        <button
          onClick={onCancel}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 font-secondary text-xs font-bold text-white shadow-sm backdrop-blur-md transition hover:bg-white/20 active:scale-[0.96]"
        >
          <ArrowLeft className="h-4 w-4" /> Kembali
        </button>

        <div className="overflow-hidden rounded-[32px] border border-white/50 bg-white/40 p-6 shadow-[0_24px_60px_-38px_rgba(0,101,176,0.3)] backdrop-blur-2xl">
          <div className="mb-6 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-[20px] bg-white text-primary shadow-sm">
              <KeyRound className="h-8 w-8" strokeWidth={1.8} />
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
              Otentikasi Ujian
            </h1>
            <p className="mt-2 font-secondary text-[13px] leading-relaxed text-slate-600">
              Masukkan <strong>Kode Akses</strong> dari Asisten Praktikum untuk
              memulai ujian ini.
            </p>
          </div>

          <form onSubmit={onJoin} className="space-y-4">
            <div>
              <Input
                value={accessCode}
                onChange={(e) => setAccessCode(e.target.value)}
                placeholder="MBCLAB123"
                className="h-14 rounded-2xl border-white/60 bg-white/80 text-center font-secondary text-xl font-bold tracking-widest text-slate-900 shadow-inner placeholder:text-slate-400 focus:border-primary focus:ring-primary/20"
                autoComplete="off"
              />
            </div>

            {joinError && (
              <div className="rounded-[16px] border border-error/10 bg-error/10 p-3 text-center font-secondary text-sm font-semibold text-error-700">
                {joinError}
              </div>
            )}

            <Button
              type="submit"
              disabled={isJoining || !accessCode}
              className="h-[52px] w-full rounded-2xl text-[15px] shadow-primary/25 disabled:opacity-50"
            >
              {isJoining ? "Memverifikasi..." : "Mulai Ujian Sekarang"}
            </Button>
          </form>
        </div>
      </div>
    </main>
  );
}
