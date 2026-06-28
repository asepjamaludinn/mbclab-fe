import Image from "next/image";

type DashboardHeroProps = {
  userName?: string;
};

export function DashboardHero({ userName = "Mahasiswa" }: DashboardHeroProps) {
  return (
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
          {userName} 👋
        </h1>

        <p className="mt-4 max-w-sm font-secondary text-sm leading-relaxed text-white/75">
          Kelola aktivitas praktikum, akses modul, dan kumpulkan TP serta TA
          melalui dashboard praktikan MBC Laboratory.
        </p>
      </div>
    </section>
  );
}
