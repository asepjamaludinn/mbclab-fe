"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  CalendarDays,
  Clock3,
  Layers3,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import { PracticumModule } from "@/features/student-modules";
import { Submission } from "@/features/student-submissions";

type DashboardProgressSummaryProps = {
  modules: PracticumModule[];
  submissions: Submission[];
  userName?: string;
};

export function DashboardProgressSummary({
  modules,
  submissions,
  userName = "Praktikan",
}: DashboardProgressSummaryProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/student/search?q=${encodeURIComponent(searchQuery)}`);
    } else {
      router.push("/student/modules");
    }
  };

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-3">
        <form
          onSubmit={handleSearch}
          className="flex h-11 flex-1 items-center gap-3 rounded-full border border-white/25 bg-white/15 px-4 text-white shadow-sm backdrop-blur-xl transition-all focus-within:border-white/50 focus-within:bg-white/25"
        >
          <Search
            className="h-[18px] w-[18px] text-white/80"
            strokeWidth={1.8}
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari modul atau informasi..."
            className="w-full bg-transparent font-secondary text-xs font-medium text-white placeholder:text-white/75 focus:outline-none"
          />
        </form>

        <button
          type="button"
          onClick={() => router.push("/student/search?filter=open")}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/25 bg-white/15 text-white shadow-sm backdrop-blur-xl transition hover:bg-white hover:text-primary active:scale-[0.96]"
          aria-label="Filter"
        >
          <SlidersHorizontal className="h-5 w-5" strokeWidth={1.8} />
        </button>
      </div>

      <div className="relative overflow-hidden rounded-[34px] bg-primary p-5 text-white shadow-[0_22px_55px_-30px_rgba(0,101,176,0.85)]">
        <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/10" />
        <div className="pointer-events-none absolute -bottom-16 -right-12 h-44 w-44 rotate-12 rounded-[46px] bg-secondary/45" />
        <div className="pointer-events-none absolute -bottom-10 right-10 h-24 w-24 rotate-12 rounded-[28px] bg-white/10" />

        <div className="relative z-10">
          <div className="mb-8 flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <p className="font-secondary text-xs font-semibold text-white/80">
                Jadwal Praktikum
              </p>
              <h2 className="mt-1 max-w-[240px] text-[28px] font-extrabold leading-[1.05] tracking-tight">
                {userName}
              </h2>
            </div>
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white text-primary shadow-sm">
              <CalendarDays className="h-6 w-6" strokeWidth={1.8} />
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2 font-secondary text-sm font-semibold text-white">
              <CalendarDays className="h-4 w-4" strokeWidth={1.8} />
              <span>Hari Praktikum</span>
            </div>
            <div className="flex items-center gap-2 font-secondary text-sm font-semibold text-white">
              <Layers3 className="h-4 w-4" strokeWidth={1.8} />
              <span>Shift Praktikum</span>
            </div>
            <div className="flex items-center gap-2 font-secondary text-sm font-semibold text-white">
              <Clock3 className="h-4 w-4" strokeWidth={1.8} />
              <span>Jam Praktikum</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
