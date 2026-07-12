import React from "react";
import { ShieldAlert, AlertCircle } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";

type ExamBlockedProps = {
  unblockCode: string;
  setUnblockCode: (code: string) => void;
  unblockError: string;
  isUnblocking: boolean;
  onUnblock: (e: React.FormEvent) => void;
  statusMessage?: string;
  cheatCount?: number;
};

export function ExamBlocked({
  unblockCode,
  setUnblockCode,
  unblockError,
  isUnblocking,
  onUnblock,
  statusMessage,
  cheatCount,
}: ExamBlockedProps) {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[linear-gradient(180deg,#1e293b_0%,#0f172a_100%)] px-5 font-primary">
      <div className="absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-red-500/20 blur-[120px]" />

      <div className="relative z-10 w-full max-w-md">
        <div className="rounded-[34px] border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl">
          {/* Header */}

          <div className="text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl border border-red-400/20 bg-red-500/15 text-red-400 shadow-lg shadow-red-500/10">
              <ShieldAlert className="h-10 w-10" />
            </div>

            <h1 className="mt-6 text-3xl font-extrabold text-white">
              Ujian Terblokir
            </h1>

            <p className="mt-3 text-sm leading-7 text-slate-300">
              {statusMessage ??
                "Sistem mendeteksi Anda meninggalkan halaman ujian."}
              <br />
              Hubungi Asisten Praktikum untuk mendapatkan
              <span className="font-bold text-white"> Kode Unblock</span>.
            </p>

            {typeof cheatCount === "number" && cheatCount > 0 && (
              <div className="mt-5 inline-flex rounded-full border border-yellow-400/20 bg-yellow-400/10 px-4 py-2 text-xs font-semibold text-yellow-300">
                Pelanggaran ke-{cheatCount} dari maksimal 5
              </div>
            )}
          </div>

          <form
            onSubmit={onUnblock}
            className="mt-8 border-t border-white/10 pt-6"
          >
            <div className="space-y-2">
              <label
                htmlFor="unblock-code"
                className="text-sm font-semibold text-slate-200"
              >
                Kode Unblock
              </label>
              <Input
                value={unblockCode}
                onChange={(e) => setUnblockCode(e.target.value)}
                placeholder="000000"
                maxLength={6}
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck={false}
                className="
                h-16
                rounded-2xl
                border-2
                border-slate-600

                bg-slate-800

                text-center

                text-2xl
                font-bold
                tracking-[0.3em]

                text-black

                caret-red-400

                placeholder:text-slate-500

                transition-all

                focus:border-red-400
                focus:ring-4
                focus:ring-red-500/20
                "
              />

              <p className="text-center text-xs text-slate-400">
                Masukkan kode yang diberikan oleh Asisten Praktikum.
              </p>
            </div>

            {unblockError && (
              <div className="mt-5 flex gap-3 rounded-2xl border border-red-400/20 bg-red-500/10 p-4">
                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-300" />

                <p className="text-sm font-medium text-red-200">
                  {unblockError}
                </p>
              </div>
            )}

            <Button
              type="submit"
              disabled={isUnblocking || unblockCode.length < 6}
              variant="danger"
              className="
                mt-6
                h-14
                w-full
                rounded-2xl

                text-[15px]
                font-bold

                transition-all

                hover:-translate-y-0.5
                hover:shadow-xl

                active:translate-y-0

                disabled:pointer-events-none
                disabled:opacity-50
              "
            >
              {isUnblocking ? "Memverifikasi..." : "Buka Blokir Sesi"}
            </Button>
          </form>
        </div>
      </div>
    </main>
  );
}
