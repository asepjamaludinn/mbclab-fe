import Image from "next/image";
import Link from "next/link";
import { Search, SlidersHorizontal } from "lucide-react";
import { HERO_CARDS } from "../constants/public-home.constant";

export function HomeHero() {
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

      <div className="relative z-10 mt-5 flex items-center gap-3">
        <div className="flex h-11 flex-1 items-center gap-3 rounded-full border border-white/25 bg-white/15 px-4 text-white shadow-sm backdrop-blur-xl">
          <Search className="h-4.5 w-4.5 text-white/80" strokeWidth={1.8} />

          <span className="font-secondary text-xs font-medium text-white/75">
            Cari modul atau informasi...
          </span>
        </div>

        <button
          type="button"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/25 bg-white/15 text-white shadow-sm backdrop-blur-xl"
          aria-label="Filter"
        >
          <SlidersHorizontal className="h-5 w-5" strokeWidth={1.8} />
        </button>
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
