"use client";

import { usePublicAssistants } from "../hooks/use-public-home";
import { publicQuickMenus } from "../constants/public-home.constant";
import { HomeHero } from "./HomeHero";
import { HomeWelcomeCard } from "./HomeWelcomeCard";
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
    <main className="min-h-screen bg-[#F8F9FA] pb-28 font-primary selection:bg-primary/20">
      <HomeHero />
      <HomeWelcomeCard />
      <HomeQuickMenu menus={publicQuickMenus} />
      <HomeAboutMbc />
      <HomeGroupInfo />

      {isAssistantsLoading ? (
        <section className="px-6 pt-10">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-grey-900">
              Asisten Praktikum
            </h2>
            <span className="font-secondary text-[11px] font-semibold text-primary">
              Memuat...
            </span>
          </div>
          <div className="h-32 animate-pulse rounded-[32px] border border-grey-200/50 bg-white" />
        </section>
      ) : isAssistantsError ? (
        <section className="px-6 pt-10">
          <div className="rounded-[32px] border border-error/10 bg-white p-6 text-center shadow-sm">
            <h2 className="text-sm font-bold text-error">
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
