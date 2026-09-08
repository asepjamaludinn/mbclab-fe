import Image from "next/image";
import { Download, Info, LockKeyhole } from "lucide-react";
import { PublicModule } from "@/features/public-home";
import { resolveAssetUrl } from "@/shared/utils/asset-url";
import { FALLBACK_MODULE_COVERS } from "@/features/public-modules/constants/public-modules.constant";

type ModuleCardProps = {
  module: PublicModule & {
    coverUrl?: string | null;
    order?: number;
  };
  index: number;
};

const getModuleCoverUrl = (
  coverUrl: string | null | undefined,
  index: number,
) => {
  if (coverUrl && coverUrl.trim() !== "") return resolveAssetUrl(coverUrl);
  const safeIndex = isNaN(index) || index < 0 ? 0 : index;
  return FALLBACK_MODULE_COVERS[safeIndex % FALLBACK_MODULE_COVERS.length];
};

export function ModuleCard({ module, index }: ModuleCardProps) {
  const hasRegular = !!module.fileUrlRegular;
  const hasIntl = !!module.fileUrlInternational;
  const canDownload = module.isActive && (hasRegular || hasIntl);

  const displayOrder = module.order ?? index + 1;

  const finalCoverUrl = getModuleCoverUrl(module.coverUrl, index);

  return (
    <article className="group relative w-full aspect-[4/5] overflow-hidden rounded-[30px] bg-grey-900 shadow-[0_22px_60px_-34px_rgba(0,101,176,0.55)]">
      <Image
        src={finalCoverUrl}
        alt={module.title || "Modul Praktikum"}
        fill
        className="object-cover transition duration-500 group-hover:scale-105"
        sizes="(max-width: 480px) 100vw, 420px"
        unoptimized
      />

      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/25 to-black/80" />

      <div className="absolute left-4 right-4 top-4 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <span className="inline-flex rounded-full border border-white/25 bg-white/15 px-3 py-1 font-secondary text-[10px] font-bold uppercase tracking-[0.14em] text-white backdrop-blur-xl">
            Modul {displayOrder}
          </span>

          <h3 className="mt-3 line-clamp-3 text-xl font-extrabold leading-[1.04] tracking-tight text-white">
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

      <div className="absolute bottom-4 left-4 right-4 flex flex-col gap-2">
        {canDownload ? (
          <div className="flex w-full gap-2">
            {hasRegular && (
              <a
                href={module.fileUrlRegular!}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-1 items-center justify-center gap-1.5 rounded-full bg-white px-3 py-2.5 font-secondary text-xs font-bold text-primary shadow-sm transition hover:bg-primary hover:text-white"
              >
                <Download className="h-3.5 w-3.5" /> Reguler
              </a>
            )}
            {hasIntl && (
              <a
                href={module.fileUrlInternational!}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-1 items-center justify-center gap-1.5 rounded-full bg-white px-3 py-2.5 font-secondary text-xs font-bold text-primary shadow-sm transition hover:bg-primary hover:text-white"
              >
                <Download className="h-3.5 w-3.5" /> Intl
              </a>
            )}
          </div>
        ) : (
          <div className="flex w-full items-center justify-center gap-2 rounded-full border border-white/25 bg-white/15 px-5 py-3 font-secondary text-xs font-bold text-white shadow-sm backdrop-blur-xl">
            <LockKeyhole className="h-4 w-4" /> Belum Dibuka
          </div>
        )}
      </div>
    </article>
  );
}
