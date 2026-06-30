type ModulesHeroProps = {
  totalModules?: number;
};

export function ModulesHero({ totalModules = 0 }: ModulesHeroProps) {
  return (
    <section className="px-5 pt-8">
      <div className="mb-6">
        <h1 className="max-w-[280px] text-[42px] font-extrabold leading-[1.02] tracking-[-0.04em] text-white">
          Modul
          <br />
          Praktikum
        </h1>

        <p className="mt-4 max-w-[300px] font-secondary text-sm leading-relaxed text-white/75">
          Pilih dan akses materi praktikum MBC Laboratory.
        </p>
      </div>

      <div className="flex rounded-full border border-white/25 bg-white/15 p-1 shadow-sm backdrop-blur-xl">
        <button className="flex flex-1 items-center justify-center gap-1 rounded-full bg-white px-4 py-3 font-secondary text-xs font-bold text-primary shadow-sm">
          Tersedia
          <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[10px] text-white">
            {totalModules}
          </span>
        </button>

        <button className="flex flex-1 items-center justify-center rounded-full px-4 py-3 font-secondary text-xs font-semibold text-white/80">
          Arsip
        </button>

        <button className="flex flex-1 items-center justify-center rounded-full px-4 py-3 font-secondary text-xs font-semibold text-white/80">
          Selesai
        </button>
      </div>
    </section>
  );
}
