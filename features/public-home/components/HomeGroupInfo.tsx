import { ExternalLink, MessageCircle, Users } from "lucide-react";

const OA_LINE_MBC_LAB_URL = "https://line.me/R/ti/p/@mbclab";

const SPS_URL = "https://igracias.telkomuniversity.ac.id/";

export function HomeGroupInfo() {
  return (
    <section id="kelompok" className="px-6 pt-10">
      <h2 className="mb-4 text-sm font-bold uppercase tracking-wider text-grey-900/60">
        Informasi Tambahan
      </h2>

      <div className="space-y-3">
        <div className="flex items-center justify-between gap-4 rounded-[24px] border border-grey-200/60 bg-white p-5 shadow-sm transition-all duration-300 hover:border-primary/20 hover:shadow-md">
          <div className="flex min-w-0 flex-1 items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[16px] bg-primary/5">
              <Users className="h-5 w-5 text-primary" strokeWidth={1.5} />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="truncate text-sm font-bold text-grey-900">
                Pembagian Kelompok
              </h3>
              <p className="mt-0.5 truncate font-secondary text-[11px] text-grey-500">
                Cek jadwal & kelompok di SPS.
              </p>
            </div>
          </div>

          <a
            href={SPS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group/btn flex shrink-0 items-center justify-center gap-1.5 rounded-[14px] bg-primary/10 px-4 py-2.5 font-secondary text-xs font-bold text-primary transition-all duration-300 hover:bg-primary hover:text-white hover:shadow-[0_8px_16px_rgba(0,101,176,0.15)] active:scale-95"
          >
            Cek SPS
            <ExternalLink
              className="h-3.5 w-3.5 transition-transform duration-300 group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5"
              strokeWidth={2}
            />
          </a>
        </div>

        <a
          href={OA_LINE_MBC_LAB_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center justify-between gap-4 rounded-[24px] border border-grey-200/60 bg-white p-5 shadow-sm transition-all duration-300 hover:border-success/30 hover:shadow-md"
        >
          <div className="flex min-w-0 flex-1 items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[16px] bg-success/10 transition-colors group-hover:bg-success/20">
              <img
                src="/images/line.png"
                alt="Logo LINE"
                className="h-7 w-7 object-contain"
                loading="lazy"
              />
            </div>

            <div className="min-w-0 flex-1">
              <h3 className="truncate text-sm font-bold text-grey-900">
                Kontak OA LINE
              </h3>
              <p className="mt-0.5 truncate font-secondary text-[11px] text-grey-500">
                Hubungi kami jika ada kendala.
              </p>
            </div>
          </div>

          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-grey-50 text-grey-400 transition-all duration-300 group-hover:bg-success group-hover:text-white">
            <ExternalLink
              className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              strokeWidth={2}
            />
          </div>
        </a>
      </div>
    </section>
  );
}
