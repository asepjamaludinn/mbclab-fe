"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Search,
  BookOpenCheck,
  ClipboardCheck,
  UserRoundCheck,
  UsersRound,
  MessageCircle,
} from "lucide-react";
import {
  HERO_CARDS,
  OA_LINE_MBC_LAB_URL,
} from "../constants/public-home.constant";
import {
  usePublicModules,
  usePublicAssistants,
} from "../hooks/use-public-home";
import {
  useQuickSearch,
  QuickSearchResult,
} from "@/shared/hooks/use-quick-search";
import { QuickSearchDropdown } from "@/shared/components/ui/quick-search-dropdown";

export function HomeHero() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const { data: modules = [] } = usePublicModules();
  const { data: assistants = [] } = usePublicAssistants();

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
      subtitle: "Modul praktikum",
      icon: BookOpenCheck,
      href: `/modul?q=${encodeURIComponent(m.title)}`,
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
      href: "/modul",
    },
    {
      id: "link-assessment",
      title: "Assessment",
      subtitle: "TP & TA (perlu login)",
      icon: ClipboardCheck,
      href: "/assessment",
    },
    {
      id: "link-kelompok",
      title: "Kelompok & Jadwal",
      subtitle: "Cek jadwal dan kelompok di SPS",
      icon: UsersRound,
      scrollToId: "kelompok",
    },
    {
      id: "link-kontak",
      title: "Kontak OA LINE",
      subtitle: "Hubungi kami jika ada kendala",
      icon: MessageCircle,
      externalHref: OA_LINE_MBC_LAB_URL,
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

  return (
    <section className="relative px-5 pt-6 text-white">
      <div className="pointer-events-none absolute -right-20 top-2 h-56 w-56 rounded-full bg-white/15 blur-[70px]" />
      <div className="pointer-events-none absolute -left-24 top-36 h-64 w-64 rounded-full bg-white/10 blur-[80px]" />

      <div className="relative z-10 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-sm">
          <Image
            src="/images/logo_utama.svg"
            alt="Logo MBC Laboratory"
            width={36}
            height={36}
            className="h-8 w-8 object-contain"
            priority
          />
        </div>

        <div>
          <p className="font-secondary text-[11px] font-medium text-white/70">
            Portal Praktikum
          </p>
          <h1 className="text-xl font-extrabold tracking-tight">
            MBC Laboratory
          </h1>
        </div>
      </div>

      <div className="relative z-30 mt-5 flex items-center gap-3">
        <div ref={searchContainerRef} className="relative flex-1">
          <form
            onSubmit={handleSearch}
            className="flex h-11 items-center gap-3 rounded-full border border-white/25 bg-white/15 px-4 text-white shadow-sm backdrop-blur-xl transition-all focus-within:border-white/50 focus-within:bg-white/25"
          >
            <Search className="h-4.5 w-4.5 text-white/80" strokeWidth={1.8} />
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

      <div className="relative z-10 mt-5 flex snap-x gap-3 overflow-x-auto pb-1">
        {HERO_CARDS.map((item) => {
          const Icon = item.icon;

          const cardContent = (
            <div className="flex h-[116px] min-w-[122px] snap-start flex-col justify-between rounded-[22px] bg-white p-3.5 shadow-[0_16px_30px_-22px_rgba(0,0,0,0.45)] transition active:scale-[0.98]">
              <div>
                <h2 className="text-base font-extrabold tracking-tight text-grey-900">
                  {item.title}
                </h2>
                <p className="mt-0.5 font-secondary text-[11px] font-medium text-grey-500">
                  {item.description}
                </p>
              </div>

              <div
                className={`ml-auto flex h-10 w-10 items-center justify-center rounded-full ${item.iconClassName} shadow-sm`}
              >
                <Icon className="h-5 w-5" strokeWidth={1.8} />
              </div>
            </div>
          );

          if (item.isExternal) {
            return (
              <a
                key={item.title}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                {cardContent}
              </a>
            );
          }

          return (
            <Link key={item.title} href={item.href}>
              {cardContent}
            </Link>
          );
        })}
      </div>
    </section>
  );
}
