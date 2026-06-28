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
    <main className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(0,101,176,0.18),transparent_32%),radial-gradient(circle_at_top_right,rgba(30,63,117,0.12),transparent_30%),linear-gradient(180deg,#f8f9fa_0%,#edf6ff_42%,#f8f9fa_100%)] pb-28 font-primary selection:bg-primary/20">
      <HomeHero />
      <HomeQuickMenu menus={publicQuickMenus} />
      <HomeAboutMbc />
      <HomeGroupInfo />

      {isAssistantsLoading ? (
        <section className="px-5 pt-10">
          <div className="mb-4 flex items-end justify-between">
            <div>
              <p className="font-secondary text-[11px] font-bold uppercase tracking-[0.18em] text-primary/70">
                Assistant Team
              </p>
              <h2 className="mt-1 text-xl font-extrabold tracking-tight text-grey-900">
                Tim Asisten
              </h2>
            </div>

            <span className="font-secondary text-[11px] font-bold text-primary">
              Memuat...
            </span>
          </div>

          <div className="h-36 animate-pulse rounded-[34px] border border-white/70 bg-white/60 shadow-sm backdrop-blur-xl" />
        </section>
      ) : isAssistantsError ? (
        <section className="px-5 pt-10">
          <div className="rounded-[34px] border border-error/10 bg-white/75 p-6 text-center shadow-[0_18px_50px_-30px_rgba(0,101,176,0.35)] backdrop-blur-xl">
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
