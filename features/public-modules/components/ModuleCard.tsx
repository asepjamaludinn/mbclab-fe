import Image from "next/image";
import { Download, Info, LockKeyhole } from "lucide-react";
import { PublicModule } from "@/features/public-home";

type ModuleCardProps = {
  module: PublicModule & {
    coverUrl?: string;
  };
  index: number;
};

const FALLBACK_COVERS = [
  "/images/module-cover-1.jpg",
  "/images/module-cover-2.jpg",
  "/images/module-cover-3.jpg",
  "/images/module-cover-4.jpg",
];

export function ModuleCard({ module, index }: ModuleCardProps) {
  const canDownload = module.isActive && module.fileUrl !== "#";
  const coverUrl =
    module.coverUrl || FALLBACK_COVERS[index % FALLBACK_COVERS.length];

  return (
    <article className="group relative h-[230px] overflow-hidden rounded-[34px] bg-grey-900 shadow-[0_22px_60px_-30px_rgba(0,0,0,0.55)]">
      <Image
        src={coverUrl}
        alt={module.title}
        fill
        className="object-cover transition duration-500 group-hover:scale-105"
        sizes="(max-width: 480px) 100vw, 420px"
      />

      <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-black/20 to-black/75" />

      <div className="absolute left-5 top-5 right-5 flex items-start justify-between gap-3">
        <div>
          <p className="font-secondary text-[11px] font-light uppercase tracking-[0.18em] text-white/75">
            Modul {index + 1}
          </p>

          <h3 className="mt-1 max-w-[230px] text-[26px] font-medium leading-[1.02] tracking-tight text-white">
            {module.title}
          </h3>
        </div>

        <button
          type="button"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-xl transition hover:bg-white hover:text-primary"
          aria-label="Informasi modul"
        >
          <Info className="h-4 w-4" />
        </button>
      </div>

      <div className="absolute bottom-5 left-5 right-5 flex items-center gap-3">
        {canDownload ? (
          <a
            href={module.fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-1 items-center justify-center gap-2 rounded-full bg-black px-5 py-3 font-secondary text-xs font-bold text-white shadow-lg transition hover:bg-primary"
          >
            <Download className="h-4 w-4" />
            Download Modul
          </a>
        ) : (
          <div className="flex flex-1 items-center justify-center gap-2 rounded-full bg-black/80 px-5 py-3 font-secondary text-xs font-bold text-white backdrop-blur-xl">
            <LockKeyhole className="h-4 w-4" />
            Belum Dibuka
          </div>
        )}
      </div>
    </article>
  );
}
