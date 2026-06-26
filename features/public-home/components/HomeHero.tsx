import Image from "next/image";

export function HomeHero() {
  return (
    <section className="relative overflow-hidden rounded-b-[48px] bg-gradient-to-b from-primary to-secondary px-6 pb-32 pt-16 shadow-2xl shadow-primary/20">
      <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-[80px]" />
      <div className="pointer-events-none absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-primary/40 blur-[80px]" />
      <div className="pointer-events-none absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay" />

      <div className="relative z-10 flex flex-col items-start">
        <Image
          src="/images/logo_utama.svg"
          alt="Logo MBC Laboratory"
          width={160}
          height={48}
          className="mb-8 h-12 w-auto object-contain drop-shadow-md"
          priority
        />

        <span className="mb-3 inline-flex items-center rounded-full border border-white/20 bg-white/10 px-3 py-1 font-secondary text-[10px] font-bold uppercase tracking-[0.15em] text-white backdrop-blur-md">
          Laboratorium Riset & Praktikum
        </span>

        <h1 className="text-[32px] font-extrabold leading-[1.15] tracking-tight text-white sm:text-4xl">
          Portal Akademik
        </h1>

        <p className="mt-4 max-w-[300px] font-secondary text-sm leading-relaxed text-white/75">
          Sistem informasi dan manajemen praktikum terpadu untuk asisten dan
          praktikan.
        </p>
      </div>
    </section>
  );
}
