import Link from "next/link";
import { LockKeyhole } from "lucide-react";
import { PublicLockedFeatureProps } from "../types/public-locked.type";
import { PublicBottomNavigation } from "@/features/public-home";

export function PublicLockedFeature({
  title,
  description,
  icon: Icon,
  loginHref = "/login/student",
}: PublicLockedFeatureProps) {
  return (
    <main className="min-h-screen bg-grey-50 pb-28">
      <section className="relative overflow-hidden rounded-b-[40px] bg-primary px-4 pb-12 pt-5 text-white shadow-sm">
        <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-20 h-64 w-64 rounded-full bg-secondary/40 blur-3xl" />

        <div className="relative z-10 mt-6">
          <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-white p-2 shadow-lg">
            <Icon className="h-8 w-8 text-primary" strokeWidth={2} />
          </div>

          <h1 className="mt-2 max-w-sm text-3xl font-bold leading-[1.05] tracking-tight text-white">
            {title}
          </h1>

          <p className="mt-4 max-w-sm font-secondary text-sm leading-relaxed text-white/75">
            {description}
          </p>
        </div>
      </section>

      <section className="relative z-20 -mt-6 px-4">
        <div className="mx-auto w-full max-w-[420px] rounded-3xl bg-white p-6 shadow-sm">
          <div className="mb-3 flex w-fit items-center gap-2 rounded-full bg-grey-200 px-4 py-2 font-secondary text-xs font-semibold text-grey-700">
            <LockKeyhole className="h-4 w-4" />
            Membutuhkan Login
          </div>

          <p className="font-secondary text-sm leading-relaxed text-grey-700">
            Silakan login menggunakan akun praktikan untuk melanjutkan dan
            mengakses halaman ini.
          </p>

          <Link
            href={loginHref}
            className="mt-6 flex w-full items-center justify-center rounded-2xl bg-primary px-5 py-3.5 font-secondary text-sm font-semibold text-white transition hover:bg-secondary active:scale-[0.98]"
          >
            Masuk sebagai Praktikan
          </Link>
        </div>
      </section>

      <PublicBottomNavigation />
    </main>
  );
}
