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
    <main className="relative min-h-screen overflow-hidden bg-[linear-gradient(180deg,#0065b0_0%,#1e3f75_30%,#eaf6ff_58%,#ffffff_86%)] pb-28 font-primary selection:bg-primary/20">
      <div className="pointer-events-none absolute -right-20 top-8 h-60 w-60 rounded-full bg-white/15 blur-[75px]" />
      <div className="pointer-events-none absolute -left-24 top-52 h-64 w-64 rounded-full bg-white/10 blur-[80px]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.2),transparent_34%)]" />

      <section className="relative z-10 flex min-h-[calc(100vh-7rem)] flex-col px-5 pt-8">
        <div className="flex flex-1 flex-col justify-center">
          <div className="relative overflow-hidden rounded-[34px] border border-white/70 bg-white/75 p-5 shadow-[0_24px_60px_-38px_rgba(0,101,176,0.55)] backdrop-blur-xl">
            <div className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-primary/10 blur-[55px]" />
            <div className="pointer-events-none absolute -left-16 bottom-0 h-40 w-40 rounded-full bg-secondary/10 blur-[55px]" />

            <div className="relative z-10 mb-6 flex justify-center">
              <div className="relative h-36 w-36">
                <div className="absolute inset-0 rounded-[42px] border border-white/70 bg-white/50 shadow-sm backdrop-blur-xl" />

                <div className="absolute left-0 top-3 flex h-14 w-14 rotate-[-10deg] items-center justify-center rounded-[22px] border border-white/70 bg-white/70 text-primary shadow-sm backdrop-blur-xl">
                  <Icon className="h-7 w-7" strokeWidth={1.7} />
                </div>

                <div className="absolute bottom-3 right-0 flex h-14 w-14 rotate-[10deg] items-center justify-center rounded-[22px] border border-white/70 bg-primary/10 text-primary shadow-sm backdrop-blur-xl">
                  <ShieldCheck className="h-7 w-7" strokeWidth={1.7} />
                </div>

                <div className="absolute left-1/2 top-1/2 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-[30px] bg-[linear-gradient(135deg,#0065b0_0%,#1e3f75_100%)] text-white shadow-[0_22px_55px_-24px_rgba(0,101,176,0.8)]">
                  <LockKeyhole className="h-9 w-9" strokeWidth={1.8} />
                </div>
              </div>
            </div>

            <div className="relative z-10 text-center">
              <h2 className="text-xl font-extrabold tracking-tight text-grey-900">
                Login diperlukan
              </h2>

              <p className="mx-auto mt-2 max-w-xs font-secondary text-xs leading-relaxed text-grey-500">
                Masuk menggunakan akun praktikan untuk membuka fitur ini dan
                melanjutkan aktivitas portal dengan aman.
              </p>
            </div>

            <Link
              href={loginHref}
              className="group relative z-10 mt-6 flex w-full items-center justify-between rounded-[24px] bg-primary px-5 py-4 font-secondary text-sm font-bold text-white shadow-lg shadow-primary/20 transition hover:bg-secondary active:scale-[0.98]"
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
