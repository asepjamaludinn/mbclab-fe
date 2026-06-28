import Link from "next/link";
import { ArrowUpRight, BookOpen, ClipboardList } from "lucide-react";

export function DashboardMenu() {
  return (
    <div>
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
                Akses materi, panduan, dan informasi modul praktikum resmi yang
                sudah dipublikasikan oleh asisten.
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
    </div>
  );
}
