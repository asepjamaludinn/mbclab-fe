import { Search } from "lucide-react";

type ModulesHeroProps = {
  totalModules?: number;
  activeFilter?: string;
  onFilterChange?: (filter: string) => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
};

export function ModulesHero({
  totalModules = 0,
  activeFilter = "all",
  onFilterChange,
  searchQuery = "",
  onSearchChange,
}: ModulesHeroProps) {
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

      <div className="mb-5 flex h-11 items-center gap-3 rounded-full border border-white/25 bg-white/15 px-4 text-white shadow-sm backdrop-blur-xl focus-within:border-white/50 focus-within:bg-white/25">
        <Search className="h-[18px] w-[18px] text-white/80" strokeWidth={1.8} />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
          placeholder="Cari modul..."
          className="w-full bg-transparent font-secondary text-xs font-medium text-white placeholder:text-white/75 focus:outline-none"
        />
      </div>

      <div className="flex rounded-full border border-white/25 bg-white/15 p-1 shadow-sm backdrop-blur-xl">
        <button
          onClick={() => onFilterChange && onFilterChange("all")}
          className={`flex flex-1 items-center justify-center gap-1 rounded-full px-4 py-3 font-secondary text-xs font-semibold transition ${activeFilter === "all" ? "bg-white text-primary shadow-sm font-bold" : "text-white/80"}`}
        >
          Semua
          <span
            className={`flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[10px] ${activeFilter === "all" ? "bg-primary text-white" : "bg-white/20 text-white"}`}
          >
            {totalModules}
          </span>
        </button>

        <button
          onClick={() => onFilterChange && onFilterChange("active")}
          className={`flex flex-1 items-center justify-center rounded-full px-4 py-3 font-secondary text-xs font-semibold transition ${activeFilter === "active" ? "bg-white text-primary shadow-sm font-bold" : "text-white/80"}`}
        >
          Tersedia
        </button>

        <button
          onClick={() => onFilterChange && onFilterChange("archived")}
          className={`flex flex-1 items-center justify-center rounded-full px-4 py-3 font-secondary text-xs font-semibold transition ${activeFilter === "archived" ? "bg-white text-primary shadow-sm font-bold" : "text-white/80"}`}
        >
          Selesai
        </button>
      </div>
    </section>
  );
}
