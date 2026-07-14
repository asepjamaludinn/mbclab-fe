"use client";

import Image from "next/image";
import { Download, Info, LockKeyhole } from "lucide-react";
import { PublicModule } from "@/features/public-home";
import { FALLBACK_MODULE_COVERS } from "../constants/public-modules.constant";

type ModuleCardProps = {
  module: PublicModule & {
    coverUrl?: string;
  };
  index: number;
};

const getModuleCoverUrl = (coverUrl: string | undefined, index: number) => {
  if (coverUrl) return coverUrl;
  return FALLBACK_MODULE_COVERS[index % FALLBACK_MODULE_COVERS.length];
};

export function ModuleCard({ module, index }: ModuleCardProps) {
  const canDownload = module.isActive && module.fileUrl !== "#";
  const coverUrl = getModuleCoverUrl(module.coverUrl, index);

  return (
    <article className="group relative h-[214px] overflow-hidden rounded-[30px] bg-grey-900 shadow-[0_22px_60px_-34px_rgba(0,101,176,0.55)]">
      <Image
        src={coverUrl}
        alt={module.title}
        fill
        className="object-cover transition duration-500 group-hover:scale-105"
        sizes="(max-width: 480px) 100vw, 420px"
      />

      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/25 to-black/80" />

      <div className="absolute left-4 right-4 top-4 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <span className="inline-flex rounded-full border border-white/25 bg-white/15 px-3 py-1 font-secondary text-[10px] font-bold uppercase tracking-[0.14em] text-white backdrop-blur-xl">
            Modul {index + 1}
          </span>

          <h3 className="mt-3 line-clamp-2 max-w-[240px] text-2xl font-extrabold leading-[1.04] tracking-tight text-white">
            {module.title}
          </h3>
        </div>

        <button
          type="button"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/25 bg-white/15 text-white shadow-sm backdrop-blur-xl transition hover:bg-white hover:text-primary"
          aria-label="Informasi modul"
        >
          <Info className="h-4 w-4" />
        </button>
      </div>

      <div className="absolute bottom-4 left-4 right-4">
        {canDownload ? (
          <a
            href={module.fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center justify-center gap-2 rounded-full bg-white px-5 py-3 font-secondary text-xs font-bold text-primary shadow-sm transition hover:bg-primary hover:text-white"
          >
            <Download className="h-4 w-4" />
            Download Modul
          </a>
        ) : (
          <div className="flex w-full items-center justify-center gap-2 rounded-full border border-white/25 bg-white/15 px-5 py-3 font-secondary text-xs font-bold text-white shadow-sm backdrop-blur-xl">
            <LockKeyhole className="h-4 w-4" />
            Belum Dibuka
          </div>
        )}
      </div>
    </article>
  );
}
