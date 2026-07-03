import React from "react";
import { ShieldAlert } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";

type ExamBlockedProps = {
  unblockCode: string;
  setUnblockCode: (code: string) => void;
  unblockError: string;
  isUnblocking: boolean;
  onUnblock: (e: React.FormEvent) => void;
};

export function ExamBlocked({
  unblockCode,
  setUnblockCode,
  unblockError,
  isUnblocking,
  onUnblock,
}: ExamBlockedProps) {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[linear-gradient(180deg,#1e293b_0%,#0f172a_100%)] px-5 text-center font-primary">
      {/* Ambient Red Glows for urgency */}
      <div className="pointer-events-none absolute -top-20 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-error/20 blur-[100px]" />

      <div className="relative z-10 w-full max-w-sm">
        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-[28px] bg-error/20 text-error shadow-[0_0_40px_-10px_rgba(220,38,38,0.4)] backdrop-blur-xl border border-error/20">
          <ShieldAlert className="h-12 w-12" strokeWidth={1.8} />
        </div>

        <h1 className="mt-8 text-3xl font-extrabold tracking-tight text-white">
          Ujian Terblokir!
        </h1>

        <p className="mt-3 font-secondary text-[15px] leading-relaxed text-slate-300">
          Sistem mendeteksi Anda meninggalkan atau menutup tab ujian. Silakan
          minta <strong className="font-bold text-white">Kode Unblock</strong>{" "}
          kepada Asisten Praktikum yang bertugas.
        </p>

        <form
          onSubmit={onUnblock}
          className="mt-8 overflow-hidden rounded-[32px] border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-xl"
        >
          <div className="space-y-5">
            <Input
              value={unblockCode}
              onChange={(e) => setUnblockCode(e.target.value)}
              placeholder="000000"
              className="h-16 rounded-2xl border-white/20 bg-slate-900/50 text-center font-secondary text-2xl font-bold tracking-[0.3em] text-white shadow-inner placeholder:text-slate-600 focus:border-error focus:ring-error/20"
              maxLength={6}
              autoComplete="off"
            />

            {unblockError && (
              <p className="rounded-xl border border-error/20 bg-error/10 p-3 font-secondary text-sm font-semibold text-error-400">
                {unblockError}
              </p>
            )}

            <Button
              type="submit"
              disabled={isUnblocking || unblockCode.length < 6}
              variant="danger"
              className="h-[52px] w-full rounded-2xl text-[15px] shadow-error/25 disabled:opacity-50"
            >
              {isUnblocking ? "Memverifikasi..." : "Buka Blokir Sesi"}
            </Button>
          </div>
        </form>
      </div>
    </main>
  );
}
