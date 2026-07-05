"use client";

import Image from "next/image";
import { UserRoundCheck } from "lucide-react";
import LogoLoop, { LogoItem } from "@/shared/components/ui/LogoLoop";
import { PublicAssistant } from "../types/public-home.type";
import { getInitials } from "@/shared/utils/string";
import { resolveAssetUrl } from "@/shared/utils/asset-url";

type HomeAssistantListProps = {
  assistants: PublicAssistant[];
};

export function HomeAssistantList({ assistants }: HomeAssistantListProps) {
  const assistantItems: LogoItem[] = assistants.map((assistant) => ({
    title: assistant.name,
    ariaLabel: assistant.name,
    node: (
      <article className="w-[122px] rounded-[26px] border border-white/70 bg-white/75 px-3 py-5 text-center shadow-sm backdrop-blur-xl">
        <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center overflow-hidden rounded-full border border-white/80 bg-primary/5">
          {assistant.photoUrl ? (
            <Image
              src={resolveAssetUrl(assistant.photoUrl)}
              alt={assistant.name}
              width={56}
              height={56}
              className="h-full w-full object-cover"
              loading="lazy"
              unoptimized
            />
          ) : (
            <span className="font-secondary text-sm font-bold text-primary">
              {getInitials(assistant.name)}
            </span>
          )}
        </div>

        <h3 className="line-clamp-2 text-xs font-extrabold leading-tight text-grey-900">
          {assistant.name}
        </h3>

        <p className="mt-1 line-clamp-1 font-secondary text-[10px] text-grey-500">
          {assistant.role}
        </p>
      </article>
    ),
  }));

  return (
    <section id="asisten" className="px-5 pt-10">
      <div className="mb-4 flex items-end justify-between">
        <div>
          <h2 className="mt-1 text-xl font-extrabold tracking-tight text-grey-900">
            Tim Asisten
          </h2>
        </div>

        <span className="rounded-full border border-white/70 bg-white/60 px-3 py-1 font-secondary text-[10px] font-bold text-primary shadow-sm backdrop-blur-xl">
          {assistants.length} Profil
        </span>
      </div>

      <div className="overflow-hidden rounded-[34px] border border-white/70 bg-white/55 py-3 shadow-[0_18px_50px_-30px_rgba(0,101,176,0.35)] backdrop-blur-xl">
        {assistants.length > 0 ? (
          <LogoLoop
            logos={assistantItems}
            speed={30}
            direction="left"
            gap={12}
            logoHeight={140}
            pauseOnHover
            scaleOnHover
            fadeOut
            fadeOutColor="rgba(255,255,255,0.55)"
            ariaLabel="Daftar asisten praktikum MBCLAB"
            className="-mt-16"
          />
        ) : (
          <div className="px-5 py-8 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-[18px] bg-primary/10 text-primary">
              <UserRoundCheck className="h-6 w-6" strokeWidth={1.5} />
            </div>

            <h3 className="text-sm font-extrabold text-grey-900">
              Data belum tersedia
            </h3>

            <p className="mt-1 font-secondary text-[11px] text-grey-500">
              Daftar asisten akan segera dipublikasikan.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
