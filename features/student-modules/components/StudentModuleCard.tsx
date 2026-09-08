import Image from "next/image";
import { Download, LockKeyhole, Clock } from "lucide-react";
import { resolveAssetUrl } from "@/shared/utils/asset-url";
import { FALLBACK_MODULE_COVERS } from "@/features/public-modules/constants/public-modules.constant";
import { isDeadlinePassed, formatDeadline } from "@/shared/utils/deadline";

type StudentModuleCardProps = {
  module: any;
  index: number;
  isInternational: boolean;
  isTpSubmitted: boolean;
};

const getModuleCoverUrl = (
  coverUrl: string | null | undefined,
  index: number,
) => {
  if (coverUrl && coverUrl.trim() !== "") return resolveAssetUrl(coverUrl);
  const safeIndex = isNaN(index) || index < 0 ? 0 : index;
  return FALLBACK_MODULE_COVERS[safeIndex % FALLBACK_MODULE_COVERS.length];
};

export function StudentModuleCard({
  module,
  index,
  isInternational,
  isTpSubmitted,
}: StudentModuleCardProps) {
  const fileUrl = isInternational
    ? module.fileUrlInternational
    : module.fileUrlRegular;

  const canDownload = module.isActive && !!fileUrl;

  const coverUrl = getModuleCoverUrl(module.coverUrl, index);

  const deadlinePassed = module.tpDeadline
    ? isDeadlinePassed(module.tpDeadline)
    : false;

  return (
    <article className="group relative aspect-[4/5] w-full overflow-hidden rounded-[30px] bg-grey-900 shadow-md">
      <Image
        src={coverUrl || FALLBACK_MODULE_COVERS[0]}
        alt={module.title || "Modul Praktikum"}
        fill
        className="object-cover transition duration-500 group-hover:scale-105"
        sizes="(max-width: 480px) 100vw, 420px"
        unoptimized
      />

      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/90" />

      {/* Informasi Modul di Kiri Atas */}
      <div className="absolute left-4 right-4 top-4">
        <span className="inline-flex rounded-full border border-white/25 bg-white/15 px-3 py-1 font-secondary text-[10px] font-bold uppercase tracking-[0.14em] text-white backdrop-blur-xl">
          Modul {module.order ?? index + 1}
        </span>

        <h3 className="mt-2 line-clamp-2 text-xl font-extrabold leading-[1.1] tracking-tight text-white">
          {module.title}
        </h3>
      </div>

      <div className="absolute bottom-4 left-4 right-4 flex flex-col justify-end">
        {module.tpDeadline && !isTpSubmitted && !deadlinePassed && (
          <p className="mb-4 flex items-center gap-1 text-xs font-secondary font-medium text-white">
            <Clock className="h-3.5 w-3.5" />
            Deadline: {formatDeadline(module.tpDeadline)}
          </p>
        )}

        {canDownload ? (
          <a
            href={fileUrl!}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center justify-center gap-2 rounded-full bg-white px-5 py-3 font-secondary text-xs font-bold text-primary shadow-sm transition hover:bg-primary hover:text-white"
          >
            <Download className="h-4 w-4" />
            Unduh Modul ({isInternational ? "Intl" : "Reg"})
          </a>
        ) : (
          <div className="flex w-full items-center justify-center gap-2 rounded-full border border-white/25 bg-white/15 px-5 py-3 font-secondary text-xs font-bold text-white shadow-sm backdrop-blur-xl">
            <LockKeyhole className="h-4 w-4" />
            {fileUrl ? "Belum Aktif" : "Modul Belum Diunggah"}
          </div>
        )}
      </div>
    </article>
  );
}
