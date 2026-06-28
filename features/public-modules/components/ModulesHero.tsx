import { Search } from "lucide-react";

type ModulesHeroProps = {
  totalModules?: number;
};

export function ModulesHero({ totalModules = 0 }: ModulesHeroProps) {
  return (
    <section className="px-5 pt-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-secondary text-[11px] font-bold uppercase tracking-[0.18em] text-primary/70">
            MBCLAB Portal
          </p>

          <h1 className="mt-2 max-w-[260px] text-[42px] font-extrabold leading-[1.02] tracking-tight text-grey-900">
            Pilih Modul Praktikum
          </h1>
        </div>

        <button
          type="button"
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/70 bg-white/70 text-grey-900 shadow-sm backdrop-blur-xl transition hover:bg-white"
          aria-label="Cari modul"
        >
          <Search className="h-5 w-5" />
        </button>
      </div>

      <div className="mt-5 flex gap-2 overflow-x-auto pb-1">
        <span className="shrink-0 rounded-full bg-primary px-5 py-2.5 font-secondary text-xs font-bold text-white shadow-sm">
          Semua
        </span>

        <span className="shrink-0 rounded-full border border-white/70 bg-white/70 px-5 py-2.5 font-secondary text-xs font-bold text-grey-600 shadow-sm backdrop-blur-xl">
          Aktif
        </span>

        <span className="shrink-0 rounded-full border border-white/70 bg-white/70 px-5 py-2.5 font-secondary text-xs font-bold text-grey-600 shadow-sm backdrop-blur-xl">
          PDF
        </span>

        <span className="shrink-0 rounded-full border border-white/70 bg-white/70 px-5 py-2.5 font-secondary text-xs font-bold text-grey-600 shadow-sm backdrop-blur-xl">
          {totalModules} Modul
        </span>
      </div>
    </section>
  );
}
