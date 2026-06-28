import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookOpenCheck, GraduationCap } from "lucide-react";

export function HomeHero() {
  return (
    <section className="relative px-5 pt-8">
      <div className="pointer-events-none absolute -right-24 top-8 h-64 w-64 rounded-full bg-primary/15 blur-[80px]" />
      <div className="pointer-events-none absolute -left-24 top-48 h-72 w-72 rounded-full bg-secondary/10 blur-[90px]" />

      <div className="relative z-10 mb-8 flex items-center justify-between">
        <Image
          src="/images/logo_utama.svg"
          alt="Logo MBC Laboratory"
          width={150}
          height={48}
          className="h-11 w-auto object-contain"
          priority
        />
      </div>

      <div className="relative z-10">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/10 bg-white/55 px-4 py-2 font-secondary text-[11px] font-bold uppercase tracking-[0.14em] text-primary shadow-sm backdrop-blur-xl">
          <GraduationCap className="h-4 w-4" />
          Laboratorium Riset & Praktikum
        </div>

        <h1 className="max-w-[330px] text-[40px] font-extrabold leading-[1.02] tracking-tight text-grey-900">
          Portal Akademik Praktikum
        </h1>

        <p className="mt-4 max-w-[315px] font-secondary text-sm leading-relaxed text-grey-600">
          Akses modul, assessment, informasi praktikum, dan layanan akademik MBC
          Laboratory dalam satu tempat.
        </p>

        <div className="mt-7 flex gap-3">
          <Link
            href="/login/student"
            className="group flex flex-1 items-center justify-between rounded-[22px] bg-primary px-5 py-4 font-secondary text-sm font-bold text-white shadow-lg shadow-primary/20 transition hover:bg-secondary active:scale-[0.98]"
          >
            Masuk
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>

          <Link
            href="/modul"
            className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-[22px] border border-white/70 bg-white/60 text-primary shadow-sm backdrop-blur-xl transition hover:bg-white"
            aria-label="Lihat modul"
          >
            <BookOpenCheck className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
