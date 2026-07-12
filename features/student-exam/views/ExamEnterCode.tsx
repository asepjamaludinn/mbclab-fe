import { ArrowLeft, KeyRound, AlertCircle } from "lucide-react";
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
      {/* Background */}
      <div className="pointer-events-none absolute -right-20 top-8 h-60 w-60 rounded-full bg-white/15 blur-[75px]" />
      <div className="pointer-events-none absolute -left-24 top-52 h-64 w-64 rounded-full bg-white/10 blur-[80px]" />
      <div className="pointer-events-none absolute bottom-10 right-10 h-40 w-40 rounded-full bg-primary/10 blur-[60px]" />

      {/* Back */}
      <button
        onClick={onCancel}
        className="absolute left-5 top-6 z-20 inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/15 px-4 py-2 font-secondary text-xs font-bold text-white shadow-md backdrop-blur-md transition-all hover:bg-white/25 hover:shadow-lg active:scale-95 sm:left-8 sm:top-8"
      >
        <ArrowLeft className="h-4 w-4" />
        Kembali
      </button>

      <div className="relative z-10 w-full max-w-sm">
        <div className="rounded-[32px] border border-white/60 bg-white/75 p-8 shadow-[0_24px_60px_-20px_rgba(0,101,176,0.25)] backdrop-blur-xl">
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-white shadow-lg shadow-primary/20">
              <KeyRound className="h-8 w-8" strokeWidth={2} />
            </div>

            <h1 className="text-[28px] font-extrabold tracking-tight text-slate-900">
              Otentikasi Ujian
            </h1>

            <p className="mt-2 font-secondary text-sm leading-6 text-slate-600">
              Masukkan <strong>Kode Akses</strong> yang diberikan oleh Asisten
              Praktikum untuk memulai sesi ujian TA.
            </p>
          </div>

          <form onSubmit={onJoin} className="space-y-6">
            <div className="space-y-2">
              <label
                htmlFor="access-code"
                className="block text-sm font-semibold text-slate-700"
              >
                Kode Akses
              </label>

              <Input
                id="access-code"
                value={accessCode}
                onChange={(e) => setAccessCode(e.target.value)}
                placeholder="Masukkan kode akses"
                className="
                  h-14
                  rounded-2xl
                  border-2
                  border-slate-300
                  bg-white

                  px-5

                  text-center
                  font-secondary
                  text-lg
                  font-semibold
                  text-slate-900
                  tracking-normal

                  caret-primary

                  shadow-sm

                  transition-all
                  duration-200

                  placeholder:text-slate-400
                  placeholder:font-medium
                  placeholder:text-center

                  hover:border-primary/50

                  focus:border-primary
                  focus:ring-4
                  focus:ring-primary/15
                  focus:bg-white
                "
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck={false}
                aria-label="Kode akses ujian"
              />

              <p className="text-center font-secondary text-xs leading-5 text-slate-500">
                Kode akses <strong>peka terhadap huruf besar/kecil</strong>.
                Masukkan persis seperti yang diberikan oleh asisten.
              </p>
            </div>

            {joinError && (
              <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4">
                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />

                <p className="font-secondary text-sm font-medium text-red-700">
                  {joinError}
                </p>
              </div>
            )}

            <Button
              type="submit"
              disabled={isJoining || !accessCode}
              className="
                h-14
                w-full
                rounded-2xl

                text-[15px]
                font-bold

                shadow-lg
                shadow-primary/20

                transition-all
                duration-200

                hover:-translate-y-0.5
                hover:shadow-xl

                active:translate-y-0

                disabled:pointer-events-none
                disabled:opacity-50
                disabled:shadow-none
              "
            >
              {isJoining ? "Memverifikasi..." : "Mulai Ujian Sekarang"}
            </Button>
          </form>
        </div>
      </div>
    </main>
  );
}
