import Link from "next/link";
import { FileQuestion, Home } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Metadata } from "next";
import { BackButton } from "@/shared/components/ui/BackButton";

export const metadata: Metadata = {
  title: "404 - Halaman Tidak Ditemukan | MBCLAB Portal",
  description: "Halaman yang Anda cari tidak tersedia atau telah dipindahkan.",
};

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(0,101,176,0.15),transparent_40%),radial-gradient(circle_at_top_right,rgba(30,63,117,0.1),transparent_40%),linear-gradient(180deg,#f8f9fa_0%,#edf6ff_50%,#f8f9fa_100%)] px-5 font-primary">
      <div className="pointer-events-none absolute -left-20 top-20 h-64 w-64 rounded-full bg-primary/10 blur-[80px]" />
      <div className="pointer-events-none absolute -right-20 bottom-20 h-72 w-72 rounded-full bg-secondary/10 blur-[90px]" />

      <div className="relative z-10 w-full max-w-md text-center">
        <div className="mx-auto mb-8 flex h-28 w-28 items-center justify-center rounded-[32px] border border-white/60 bg-white/50 shadow-[0_24px_60px_-24px_rgba(0,101,176,0.3)] backdrop-blur-xl">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-white shadow-lg shadow-primary/25">
            <FileQuestion className="h-8 w-8" strokeWidth={1.8} />
          </div>
        </div>

        <h1 className="text-[80px] font-black leading-none tracking-tighter text-grey-900 drop-shadow-sm">
          404
        </h1>
        <h2 className="mt-4 text-2xl font-extrabold tracking-tight text-grey-900">
          Halaman Tidak Ditemukan
        </h2>

        <p className="mx-auto mt-3 max-w-[300px] font-secondary text-sm leading-relaxed text-grey-500">
          Maaf, halaman yang Anda cari mungkin telah dipindahkan, dihapus, atau
          memang tidak pernah ada.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <BackButton />

          <Button
            asChild
            className="w-full rounded-2xl shadow-lg shadow-primary/20 sm:w-auto"
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
