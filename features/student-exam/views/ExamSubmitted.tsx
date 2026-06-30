import React from "react";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

export function ExamSubmitted() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-grey-50 px-5 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-success/20 text-success">
        <CheckCircle2 className="h-10 w-10" strokeWidth={1.8} />
      </div>

      <h1 className="mt-6 text-2xl font-extrabold text-grey-900">
        Ujian Selesai
      </h1>

      <p className="mt-2 font-secondary text-sm text-grey-500">
        Jawaban Tes Awal (TA) Anda berhasil disubmit dan terekam di sistem.
      </p>

      <Link
        href="/student/dashboard"
        className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-primary px-6 py-3 font-secondary text-sm font-bold text-white shadow-lg shadow-primary/20 transition-all hover:bg-secondary active:scale-[0.98]"
      >
        Kembali ke Dashboard
      </Link>
    </main>
  );
}
