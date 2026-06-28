"use client";

import Image from "next/image";
import { UserRoundCheck } from "lucide-react";
import LogoLoop, { LogoItem } from "@/shared/components/ui/LogoLoop";
import { PublicAssistant } from "../types/public-home.type";

type HomeAssistantListProps = {
  assistants: PublicAssistant[];
};

function getInitials(name: string) {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function HomeAssistantList({ assistants }: HomeAssistantListProps) {
  const assistantItems: LogoItem[] = assistants.map((assistant) => ({
    title: assistant.name,
    ariaLabel: assistant.name,
    node: (
      <article className="w-[120px] rounded-[24px] border border-grey-200/60 bg-white px-3 py-5 text-center shadow-sm">
        <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center overflow-hidden rounded-full border border-grey-100 bg-primary/5">
          {assistant.photoUrl ? (
            <Image
              src={assistant.photoUrl}
              alt={assistant.name}
              width={56}
              height={56}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          ) : (
            <span className="font-secondary text-sm font-bold text-primary">
              {getInitials(assistant.name)}
            </span>
          )}
        </div>
        <h3 className="line-clamp-2 text-xs font-bold leading-tight text-grey-900">
          {assistant.name}
        </h3>
        <p className="mt-1 line-clamp-1 font-secondary text-[10px] text-grey-500">
          {assistant.role}
        </p>
      </article>
    ),
  }));

  return (
    <section id="asisten" className="px-6 pt-10">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-bold uppercase tracking-wider text-grey-900/60">
          Tim Asisten
        </h2>
        <span className="rounded-full bg-primary/10 px-3 py-1 font-secondary text-[10px] font-bold text-primary">
          {assistants.length} Profil
        </span>
      </div>

      <div className="overflow-hidden rounded-[32px] border border-grey-200/60 bg-white py-3 shadow-sm">
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
            fadeOutColor="var(--color-white)"
            ariaLabel="Daftar asisten praktikum MBCLAB"
            className="-mt-16"
          />
        ) : (
          <div className="px-5 py-8 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-[16px] bg-primary/5">
              <UserRoundCheck
                className="h-6 w-6 text-primary"
                strokeWidth={1.5}
              />
            </div>
            <h3 className="text-sm font-bold text-grey-900">
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
