"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CalendarDays,
  Clock3,
  Layers3,
  Search,
  BookOpenCheck,
  ClipboardCheck,
  UserRoundCheck,
  UsersRound,
  MessageCircle,
  User,
} from "lucide-react";
import { UserGroup } from "@/features/auth";
import { PublicAssistant } from "@/features/public-home";
import { PracticumModule } from "@/features/student-modules";
import {
  useQuickSearch,
  QuickSearchResult,
} from "@/shared/hooks/use-quick-search";
import { QuickSearchDropdown } from "@/shared/components/ui/quick-search-dropdown";
import {
  getDayLabel,
  getShiftLabel,
  getShiftTimeRangeLabel,
  getWeekTypeLabel,
} from "@/shared/utils/schedule";
import { WHATSAPP_COMMUNITY_URL } from "../constants/student-dashboard.constant";

type DashboardProgressSummaryProps = {
  userName?: string;
  group?: UserGroup | null;
  modules?: PracticumModule[];
  assistants?: PublicAssistant[];
};

function formatScheduleDate(group?: UserGroup | null) {
  if (!group?.nextScheduleAt || !group.day || !group.weekType) {
    return "Belum Ada Jadwal";
  }

  const date = new Date(group.nextScheduleAt);
  const weekLabel = getWeekTypeLabel(group.weekType);
  const dayLabel = getDayLabel(group.day);
  const dateNum = date.getDate();
  const monthName = date.toLocaleDateString("id-ID", { month: "long" });
  const year = date.getFullYear();

  return `${weekLabel}, ${dayLabel} ${dateNum} ${monthName} ${year}`;
}

export function DashboardProgressSummary({
  userName = "Praktikan",
  group,
  modules = [],
  assistants = [],
}: DashboardProgressSummaryProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!searchContainerRef.current?.contains(e.target as Node)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const searchEntries: QuickSearchResult[] = [
    ...modules.map((m) => ({
      id: `module-${m.id}`,
      title: m.title,
      subtitle: `Modul ${m.order}`,
      icon: BookOpenCheck,
      href: `/student/modules?q=${encodeURIComponent(m.title)}`,
    })),
    ...assistants.map((a) => ({
      id: `assistant-${a.id}`,
      title: a.name,
      subtitle: a.role || "Asisten laboratorium",
      icon: UserRoundCheck,
      scrollToId: "asisten",
    })),
    {
      id: "link-modul",
      title: "Modul Praktikum",
      subtitle: "Lihat semua modul",
      icon: BookOpenCheck,
      href: "/student/modules",
    },
    {
      id: "link-assessment",
      title: "Assessment",
      subtitle: "Tugas Pendahuluan & Tes Awal",
      icon: ClipboardCheck,
      href: "/student/assessment",
    },
    {
      id: "link-kelompok",
      title: "Kelompok & Jadwal",
      subtitle: "Cek jadwal dan kelompok di SPS",
      icon: UsersRound,
      scrollToId: "kelompok",
    },
    {
      id: "link-akun",
      title: "Akun Saya",
      subtitle: "Profil dan pengaturan akun",
      icon: User,
      href: "/student/account",
    },
    {
      id: "link-kontak",
      title: "Info TP",
      subtitle: "Hubungi kami via WhatsApp",
      icon: MessageCircle,
      externalHref: WHATSAPP_COMMUNITY_URL,
    },
  ];

  const results = useQuickSearch(searchQuery, searchEntries);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearchOpen(false);
  };

  const handleSelectResult = (result: QuickSearchResult) => {
    setSearchQuery("");
    setIsSearchOpen(false);

    if (result.scrollToId) {
      document
        .getElementById(result.scrollToId)
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    if (result.externalHref) {
      window.open(result.externalHref, "_blank", "noopener,noreferrer");
      return;
    }
    if (result.href) {
      router.push(result.href);
    }
  };

  const hasSchedule = !!(group?.day && group?.weekType && group?.shift);

  const scheduleDate = formatScheduleDate(group);
  const scheduleShift = hasSchedule ? getShiftLabel(group!.shift) : "-";
  const scheduleTime = hasSchedule ? getShiftTimeRangeLabel(group!.shift) : "-";

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-3">
        <div ref={searchContainerRef} className="relative flex-1">
          <form
            onSubmit={handleSearch}
            className="flex h-11 items-center gap-3 rounded-full border border-white/25 bg-white/15 px-4 text-white shadow-sm backdrop-blur-xl transition-all focus-within:border-white/50 focus-within:bg-white/25"
          >
            <Search
              className="h-[18px] w-[18px] text-white/80"
              strokeWidth={1.8}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchOpen(true)}
              onKeyDown={(e) => e.key === "Escape" && setIsSearchOpen(false)}
              placeholder="Cari modul, asisten, atau jadwal..."
              className="w-full bg-transparent font-secondary text-xs font-medium text-white placeholder:text-white/75 focus:outline-none"
            />
          </form>

          {isSearchOpen && searchQuery.trim() && (
            <QuickSearchDropdown
              query={searchQuery}
              results={results}
              onSelect={handleSelectResult}
            />
          )}
        </div>
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
              <CalendarDays className="h-4 w-4 shrink-0" strokeWidth={1.8} />
              <span>{scheduleDate}</span>
            </div>
            <div className="flex items-center gap-2 font-secondary text-sm font-semibold text-white">
              <Layers3 className="h-4 w-4 shrink-0" strokeWidth={1.8} />
              <span>{scheduleShift}</span>
            </div>
            <div className="flex items-center gap-2 font-secondary text-sm font-semibold text-white">
              <Clock3 className="h-4 w-4 shrink-0" strokeWidth={1.8} />
              <span>{scheduleTime}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
