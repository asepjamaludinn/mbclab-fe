"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertOctagon, RefreshCw, Home } from "lucide-react";
import { Button } from "@/shared/components/ui/button";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Aplikasi menangkap error:", error);
  }, [error]);

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(220,38,38,0.1),transparent_40%),radial-gradient(circle_at_top_right,rgba(0,101,176,0.05),transparent_40%),linear-gradient(180deg,#fef2f2_0%,#ffffff_50%,#f8f9fa_100%)] px-5 font-primary">
      {/* Ornamen Latar */}
      <div className="pointer-events-none absolute -left-20 top-20 h-64 w-64 rounded-full bg-error/5 blur-[80px]" />
      <div className="pointer-events-none absolute -right-20 bottom-20 h-72 w-72 rounded-full bg-primary/5 blur-[90px]" />

      <div className="relative z-10 w-full max-w-md rounded-[36px] border border-error/10 bg-white/70 p-8 text-center shadow-[0_24px_60px_-24px_rgba(220,38,38,0.15)] backdrop-blur-2xl">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-[24px] bg-error/10 shadow-inner">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-error text-white shadow-lg shadow-error/25">
            <AlertOctagon className="h-6 w-6" strokeWidth={2} />
          </div>
        </div>

        <h1 className="text-2xl font-extrabold tracking-tight text-grey-900">
          Terjadi Kesalahan Sistem
        </h1>

        <p className="mt-3 font-secondary text-sm leading-relaxed text-grey-600">
          Maaf, terjadi kesalahan tak terduga saat memuat halaman ini. Sistem
          telah merekam log error untuk ditinjau lebih lanjut.
        </p>

        {process.env.NODE_ENV === "development" && (
          <div className="mt-4 max-h-32 overflow-y-auto rounded-xl border border-error/20 bg-error/5 p-3 text-left">
            <p className="font-mono text-[10px] text-error">
              {error.message || "Unknown Error"}
            </p>
          </div>
        )}

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button
            onClick={() => reset()}
            variant="default"
            className="w-full rounded-2xl bg-grey-900 text-white shadow-lg transition hover:bg-black sm:w-auto"
          >
            <RefreshCw className="mr-2 h-4 w-4" strokeWidth={2} />
            Coba Lagi
          </Button>

          <Button
            asChild
            variant="outline"
            className="w-full rounded-2xl border-grey-200 bg-white shadow-sm sm:w-auto"
          >
            <Link href="/">
              <Home className="mr-2 h-4 w-4" strokeWidth={2} />
              Beranda
            </Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
