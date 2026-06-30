"use client";

import { usePublicAssistants } from "../hooks/use-public-home";
import { publicQuickMenus } from "../constants/public-home.constant";
import { HomeHero } from "./HomeHero";
import { HomeQuickMenu } from "./HomeQuickMenu";
import { HomeAboutMbc } from "./HomeAboutMbc";
import { HomeGroupInfo } from "./HomeGroupInfo";
import { HomeAssistantList } from "./HomeAssistantList";
import { PublicBottomNavigation } from "./PublicBottomNavigation";

export function PublicHomeFeature() {
  const {
    data: assistants = [],
    isLoading: isAssistantsLoading,
    isError: isAssistantsError,
  } = usePublicAssistants();

  return (
    <main className="min-h-screen overflow-hidden bg-[linear-gradient(180deg,#0065b0_0%,#1e3f75_28%,#eaf6ff_58%,#ffffff_82%)] pb-28 font-primary selection:bg-primary/20">
      <HomeHero />
      <HomeQuickMenu menus={publicQuickMenus} />
      <HomeAboutMbc />
      <HomeGroupInfo />

      {isAssistantsLoading ? (
        <section className="px-5 pt-8">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-extrabold tracking-tight text-grey-900">
              Tim Asisten
            </h2>

            <span className="font-secondary text-[11px] font-bold text-primary">
              Memuat...
            </span>
          </div>

          <div className="h-36 animate-pulse rounded-[30px] bg-white/80 shadow-sm backdrop-blur-xl" />
        </section>
      ) : isAssistantsError ? (
        <section className="px-5 pt-8">
          <div className="rounded-[30px] border border-error/10 bg-white/80 p-6 text-center shadow-sm backdrop-blur-xl">
            <h2 className="text-sm font-extrabold text-error">
              Data asisten gagal dimuat
            </h2>

            <p className="mt-1 font-secondary text-xs text-grey-500">
              Silakan coba beberapa saat lagi.
            </p>
          </div>
        </section>
      ) : (
        <HomeAssistantList assistants={assistants} />
      )}

      <PublicBottomNavigation />
    </main>
  );
}
