import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  BookOpen,
  CalendarDays,
  ClipboardList,
  FileText,
  GraduationCap,
  ShieldCheck,
  UserRoundCheck,
} from "lucide-react";
import { User } from "@/features/auth";

type StudentDashboardFeatureProps = {
  user: User | null;
};

export function StudentDashboardFeature({
  user,
}: StudentDashboardFeatureProps) {
  const groupName = user?.group?.name || "Belum ada kelompok";

  return (
    <main className="min-h-screen bg-grey-50 pb-28">
      <section className="relative overflow-hidden rounded-b-[48px] bg-gradient-to-b from-primary to-secondary px-6 pb-28 pt-10 text-white shadow-2xl shadow-primary/20">
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-[80px]" />
        <div className="pointer-events-none absolute -bottom-24 -left-20 h-72 w-72 rounded-full bg-primary/40 blur-[80px]" />
        <div className="pointer-events-none absolute left-1/2 top-20 h-48 w-48 -translate-x-1/2 rounded-full bg-white/10 blur-3xl" />

        <div className="relative z-10">
          <div className="mb-8 flex items-center justify-between">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white p-2 shadow-lg">
              <Image
                src="/images/logo_utama.svg"
                alt="Logo MBC Laboratory"
                width={56}
                height={56}
                className="h-full w-full object-contain"
                priority
              />
            </div>
          </div>

          <p className="font-secondary text-[11px] font-bold uppercase tracking-[0.2em] text-white/70">
            Selamat Datang Kembali
          </p>

          <h1 className="mt-3 max-w-sm text-[34px] font-extrabold leading-[1.08] tracking-tight text-white">
            {user?.name || "Mahasiswa"} 👋
          </h1>

          <p className="mt-4 max-w-sm font-secondary text-sm leading-relaxed text-white/75">
            Kelola aktivitas praktikum, akses modul, dan kumpulkan TP serta TA
            melalui dashboard praktikan MBC Laboratory.
          </p>
        </div>
      </section>

      <section className="relative z-20 -mt-16 px-5">
        <div className="overflow-hidden rounded-[32px] border border-white/80 bg-white/90 p-6 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.08)] backdrop-blur-2xl">
          <div className="mb-5 flex items-start justify-between gap-4">
            <div>
              <p className="font-secondary text-[11px] font-bold uppercase tracking-[0.18em] text-primary">
                Profil Praktikan
              </p>

              <h2 className="mt-2 text-xl font-extrabold tracking-tight text-grey-900">
                {user?.nim || "NIM belum tersedia"}
              </h2>

              <p className="mt-1 font-secondary text-xs leading-relaxed text-grey-500">
                {groupName}
              </p>
            </div>

            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[20px] bg-primary/10 text-primary">
              <UserRoundCheck className="h-7 w-7" strokeWidth={1.5} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-[24px] bg-grey-50 p-4">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-[14px] bg-primary/10 text-primary">
                <GraduationCap className="h-5 w-5" strokeWidth={1.5} />
              </div>
              <p className="text-sm font-bold text-grey-900">Praktikan</p>
              <p className="mt-1 font-secondary text-[11px] text-grey-500">
                Role aktif
              </p>
            </div>

            <div className="rounded-[24px] bg-grey-50 p-4">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-[14px] bg-success/10 text-success">
                <ShieldCheck className="h-5 w-5" strokeWidth={1.5} />
              </div>
              <p className="text-sm font-bold text-grey-900">Aktif</p>
              <p className="mt-1 font-secondary text-[11px] text-grey-500">
                Status akses
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 pt-10">
        <div className="mb-5 flex items-end justify-between">
          <div>
            <h2 className="text-xl font-extrabold tracking-tight text-grey-900">
              Akses Praktikum
            </h2>
            <p className="mt-1 font-secondary text-xs text-grey-500">
              Pilih aktivitas yang ingin kamu kerjakan.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <Link href="/student/modules" className="group block">
            <article className="relative overflow-hidden rounded-[32px] border border-grey-200/60 bg-white p-6 shadow-sm transition-all duration-500 hover:-translate-y-1 hover:border-primary/20 hover:shadow-md">
              <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-primary/10 blur-2xl" />

              <div className="relative z-10">
                <div className="mb-7 flex items-start justify-between">
                  <div className="flex h-16 w-16 items-center justify-center rounded-[22px] bg-primary/10 text-primary transition-colors duration-500 group-hover:bg-primary group-hover:text-white">
                    <BookOpen className="h-7 w-7" strokeWidth={1.5} />
                  </div>

                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-grey-50 text-grey-400 transition-all duration-500 group-hover:bg-primary group-hover:text-white">
                    <ArrowUpRight className="h-4 w-4" />
                  </div>
                </div>

                <span className="font-secondary text-[11px] font-bold uppercase tracking-[0.18em] text-primary">
                  Materi Praktikum
                </span>

                <h3 className="mt-2 text-xl font-extrabold tracking-tight text-grey-900">
                  Modul Praktikum
                </h3>

                <p className="mt-2 max-w-sm font-secondary text-xs leading-relaxed text-grey-500">
                  Akses materi, panduan, dan informasi modul praktikum resmi
                  yang sudah dipublikasikan oleh asisten.
                </p>
              </div>
            </article>
          </Link>

          <Link href="/student/submissions" className="group block">
            <article className="relative overflow-hidden rounded-[32px] border border-grey-200/60 bg-white p-6 shadow-sm transition-all duration-500 hover:-translate-y-1 hover:border-info/20 hover:shadow-md">
              <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-info/10 blur-2xl" />

              <div className="relative z-10">
                <div className="mb-7 flex items-start justify-between">
                  <div className="flex h-16 w-16 items-center justify-center rounded-[22px] bg-info/10 text-info transition-colors duration-500 group-hover:bg-info group-hover:text-white">
                    <ClipboardList className="h-7 w-7" strokeWidth={1.5} />
                  </div>

                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-grey-50 text-grey-400 transition-all duration-500 group-hover:bg-info group-hover:text-white">
                    <ArrowUpRight className="h-4 w-4" />
                  </div>
                </div>

                <span className="font-secondary text-[11px] font-bold uppercase tracking-[0.18em] text-info">
                  Tugas Pendahuluan
                </span>

                <h3 className="mt-2 text-xl font-extrabold tracking-tight text-grey-900">
                  Pengumpulan TP
                </h3>

                <p className="mt-2 max-w-sm font-secondary text-xs leading-relaxed text-grey-500">
                  Unggah file Tugas Pendahuluan sesuai modul dan pastikan
                  pengumpulan dilakukan sebelum batas waktu.
                </p>
              </div>
            </article>
          </Link>
        </div>
      </section>

      <section className="px-6 pt-10">
        <div className="rounded-[32px] border border-grey-200/60 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-[18px] bg-warning/10 text-warning">
              <CalendarDays className="h-6 w-6" strokeWidth={1.5} />
            </div>

            <div>
              <h2 className="text-base font-extrabold text-grey-900">
                Informasi Praktikum
              </h2>
              <p className="font-secondary text-[11px] text-grey-500">
                Pantau jadwal dan instruksi dari asisten.
              </p>
            </div>
          </div>

          <div className="rounded-[24px] bg-grey-50 p-4">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-[14px] bg-primary/10 text-primary">
              <FileText className="h-5 w-5" strokeWidth={1.5} />
            </div>

            <p className="text-sm font-bold text-grey-900">
              Pastikan data praktikum selalu diperiksa
            </p>

            <p className="mt-1 font-secondary text-xs leading-relaxed text-grey-500">
              Informasi modul, tugas, dan assessment dapat berubah mengikuti
              arahan asisten praktikum.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
