import Link from "next/link";
import { ArrowRight, LockKeyhole, ShieldCheck } from "lucide-react";
import { PublicLockedFeatureProps } from "../types/public-locked.type";
import { PublicBottomNavigation } from "@/features/public-home";

export function PublicLockedFeature({
  title,
  description,
  icon: Icon,
  loginHref = "/login/student",
}: PublicLockedFeatureProps) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(0,101,176,0.18),transparent_32%),radial-gradient(circle_at_top_right,rgba(30,63,117,0.12),transparent_30%),linear-gradient(180deg,#f8f9fa_0%,#edf6ff_42%,#f8f9fa_100%)] pb-28">
      <div className="pointer-events-none absolute -right-24 top-10 h-64 w-64 rounded-full bg-primary/15 blur-[80px]" />
      <div className="pointer-events-none absolute -left-24 bottom-24 h-72 w-72 rounded-full bg-secondary/10 blur-[90px]" />
      <div className="pointer-events-none absolute left-1/2 top-1/3 h-52 w-52 -translate-x-1/2 rounded-full bg-white/60 blur-[70px]" />

      <section className="relative z-10 flex min-h-[calc(100vh-7rem)] flex-col px-5 pt-8">
        <div className="mb-10 flex items-center justify-between">
          <div>
            <p className="font-secondary text-[11px] font-bold uppercase tracking-[0.2em] text-primary/70">
              MBCLAB Portal
            </p>
            <p className="mt-1 font-secondary text-xs font-semibold text-grey-500">
              Secure student access
            </p>
          </div>

          <div className="flex h-11 w-11 items-center justify-center rounded-full border border-white/70 bg-white/60 text-primary shadow-sm backdrop-blur-xl">
            <LockKeyhole className="h-5 w-5" strokeWidth={1.8} />
          </div>
        </div>

        <div className="flex flex-1 flex-col justify-center">
          <div className="relative mb-8 h-40">
            <div className="absolute left-1/2 top-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-[42px] border border-white/70 bg-white/45 shadow-[0_24px_70px_-32px_rgba(0,101,176,0.45)] backdrop-blur-2xl" />

            <div className="absolute left-[18%] top-4 flex h-14 w-14 rotate-[-10deg] items-center justify-center rounded-[22px] border border-white/70 bg-white/55 text-primary shadow-sm backdrop-blur-xl">
              <Icon className="h-7 w-7" strokeWidth={1.7} />
            </div>

            <div className="absolute right-[18%] bottom-4 flex h-14 w-14 rotate-[10deg] items-center justify-center rounded-[22px] border border-white/70 bg-primary/10 text-primary shadow-sm backdrop-blur-xl">
              <ShieldCheck className="h-7 w-7" strokeWidth={1.7} />
            </div>

            <div className="absolute left-1/2 top-1/2 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-[30px] bg-gradient-to-br from-primary to-secondary text-white shadow-[0_22px_55px_-24px_rgba(0,101,176,0.8)]">
              <LockKeyhole className="h-9 w-9" strokeWidth={1.8} />
            </div>
          </div>

          <div>
            <div className="mb-4 inline-flex rounded-full border border-primary/10 bg-white/55 px-4 py-2 font-secondary text-[11px] font-bold uppercase tracking-[0.14em] text-primary shadow-sm backdrop-blur-xl">
              Akses Terbatas
            </div>

            <h1 className="max-w-sm text-[34px] font-extrabold leading-[1.05] tracking-tight text-grey-900">
              {title}
            </h1>

            <p className="mt-4 max-w-sm font-secondary text-sm leading-relaxed text-grey-600">
              {description}
            </p>

            <p className="mt-4 max-w-sm font-secondary text-xs leading-relaxed text-grey-500">
              Masuk menggunakan akun praktikan untuk membuka fitur ini dan
              melanjutkan aktivitas portal dengan aman.
            </p>
          </div>

          <div className="mt-8 space-y-3">
            <Link
              href={loginHref}
              className="group flex w-full items-center justify-between rounded-[22px] bg-primary px-5 py-4 font-secondary text-sm font-bold text-white shadow-lg shadow-primary/20 transition hover:bg-secondary active:scale-[0.98]"
            >
              Masuk sebagai Praktikan
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>

      <PublicBottomNavigation />
    </main>
  );
}
