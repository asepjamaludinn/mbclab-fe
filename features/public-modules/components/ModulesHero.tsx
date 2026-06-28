import Image from "next/image";

export function ModulesHero() {
  return (
    <section className="relative overflow-hidden rounded-b-[40px] bg-primary px-4 pb-16 pt-5 text-white shadow-sm">
      <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-white/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-20 h-64 w-64 rounded-full bg-secondary/40 blur-3xl" />

      <div className="relative z-10">
        <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-white p-2 shadow-lg">
          <Image
            src="/images/logo_utama.svg"
            alt="Logo MBC Laboratory"
            width={56}
            height={56}
            className="h-full w-full object-contain"
          />
        </div>

        <h1 className="mt-2 max-w-sm text-4xl font-bold leading-[1.05] tracking-tight text-white">
          Modul Praktikum
        </h1>

        <p className="mt-4 max-w-sm font-secondary text-sm leading-relaxed text-white/75">
          Akses daftar modul praktikum yang telah dipublikasikan oleh tim
          akademik MBC Laboratory.
        </p>
      </div>
    </section>
  );
}
