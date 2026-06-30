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
    <main className="flex min-h-screen flex-col items-center justify-center bg-grey-900 px-5 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-error/20 text-error">
        <ShieldAlert className="h-10 w-10" strokeWidth={1.8} />
      </div>

      <h1 className="mt-6 text-2xl font-extrabold text-white">
        Ujian Diblokir!
      </h1>

      <p className="mt-2 font-secondary text-sm text-grey-400">
        Sistem mendeteksi Anda meninggalkan halaman ujian. Silakan minta{" "}
        <b className="text-white">Kode Unblock</b> kepada Asisten Praktikum.
      </p>

      <form
        onSubmit={onUnblock}
        className="mt-8 w-full max-w-sm rounded-3xl bg-grey-800 p-6 shadow-xl"
      >
        <Input
          value={unblockCode}
          onChange={(e) => setUnblockCode(e.target.value)}
          placeholder="Masukkan 6 digit kode"
          className="mb-4 bg-grey-900 text-center font-bold text-xl tracking-widest text-white placeholder:text-grey-600 focus:ring-error/20 border-grey-700"
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
