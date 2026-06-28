import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function DashboardHero() {
  return (
    <section className="relative overflow-hidden rounded-[38px] border border-white/70 bg-white/45 px-5 pb-5 pt-5 text-grey-900 shadow-[0_24px_70px_-32px_rgba(0,101,176,0.45)] backdrop-blur-2xl">
      <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-primary/20 blur-[70px]" />
      <div className="pointer-events-none absolute -bottom-24 -left-20 h-60 w-60 rounded-full bg-secondary/15 blur-[80px]" />
      <div className="pointer-events-none absolute left-1/2 top-8 h-40 w-40 -translate-x-1/2 rounded-full bg-white/60 blur-[60px]" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/80 via-white/35 to-primary/10" />

      <div className="relative z-10">
        <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/80 bg-white/70 p-2 shadow-sm backdrop-blur-xl">
          <Image
            src="/images/logo_utama.svg"
            alt="Logo MBC Laboratory"
            width={56}
            height={56}
            className="h-full w-full object-contain"
            priority
          />
        </div>

        <p className="font-secondary text-[11px] font-bold uppercase tracking-[0.2em] text-primary/70">
          Dashboard Praktikum
        </p>

        <h2 className="mt-3 max-w-[285px] text-[28px] font-extrabold leading-[1.08] tracking-tight text-grey-900">
          Kelola aktivitas praktikum dengan mudah
        </h2>

        <p className="mt-4 max-w-[290px] font-secondary text-sm leading-relaxed text-grey-600">
          Akses modul, kumpulkan TP, dan lanjutkan assessment dari satu tempat.
        </p>

        <Link
          href="/student/assessment"
          className="mt-6 flex items-center justify-between rounded-2xl border border-primary/10 bg-primary/10 px-4 py-3 font-secondary text-xs font-bold text-primary shadow-sm backdrop-blur-xl transition hover:bg-primary hover:text-white"
        >
          Lanjutkan Assessment
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
