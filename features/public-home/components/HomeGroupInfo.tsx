import { ExternalLink, Users } from "lucide-react";

const OA_LINE_MBC_LAB_URL = "https://line.me/R/ti/p/@mbclab";
const SPS_URL = "https://igracias.telkomuniversity.ac.id/";

export function HomeGroupInfo() {
  return (
    <section id="kelompok" className="px-5 pt-10">
      <div className="mb-4">
        <p className="font-secondary text-[11px] font-bold uppercase tracking-[0.18em] text-primary/70">
          Informasi
        </p>
        <h2 className="mt-1 text-xl font-extrabold tracking-tight text-grey-900">
          Informasi Tambahan
        </h2>
      </div>

      <div className="space-y-3">
        <div className="group relative overflow-hidden rounded-[30px] border border-white/70 bg-white/75 p-5 shadow-sm backdrop-blur-xl transition hover:bg-white">
          <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-primary/10 blur-2xl" />

          <div className="relative z-10 flex items-center justify-between gap-4">
            <div className="flex min-w-0 flex-1 items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[20px] bg-primary text-white shadow-lg shadow-primary/20">
                <Users className="h-5 w-5" strokeWidth={1.6} />
              </div>

              <div className="min-w-0 flex-1">
                <h3 className="truncate text-sm font-extrabold text-grey-900">
                  Pembagian Kelompok
                </h3>
                <p className="mt-1 truncate font-secondary text-[11px] text-grey-500">
                  Cek jadwal dan kelompok di SPS.
                </p>
              </div>
            </div>

            <a
              href={SPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex shrink-0 items-center gap-1.5 rounded-2xl bg-primary/10 px-4 py-2.5 font-secondary text-xs font-bold text-primary transition hover:bg-primary hover:text-white"
            >
              Cek SPS
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>

        <a
          href={OA_LINE_MBC_LAB_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative block overflow-hidden rounded-[30px] border border-white/70 bg-white/75 p-5 shadow-sm backdrop-blur-xl transition hover:bg-white"
        >
          <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-success/10 blur-2xl" />

          <div className="relative z-10 flex items-center justify-between gap-4">
            <div className="flex min-w-0 flex-1 items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[20px] bg-success/10 shadow-sm">
                <img
                  src="/images/line.png"
                  alt="Logo LINE"
                  className="h-7 w-7 object-contain"
                  loading="lazy"
                />
              </div>

              <div className="min-w-0 flex-1">
                <h3 className="truncate text-sm font-extrabold text-grey-900">
                  Kontak OA LINE
                </h3>
                <p className="mt-1 truncate font-secondary text-[11px] text-grey-500">
                  Hubungi kami jika ada kendala.
                </p>
              </div>
            </div>

            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-grey-50 text-grey-400 transition group-hover:bg-success group-hover:text-white">
              <ExternalLink className="h-4 w-4" />
            </div>
          </div>
        </a>
      </div>
    </section>
  );
}
