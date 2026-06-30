import Image from "next/image";
import { ExternalLink, Users } from "lucide-react";
import {
  OA_LINE_MBC_LAB_URL,
  SPS_URL,
} from "../constants/public-home.constant";

export function HomeGroupInfo() {
  return (
    <section id="kelompok" className="px-5 pt-7">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-extrabold tracking-tight text-grey-900">
          Informasi
        </h2>

        <span className="font-secondary text-[11px] font-bold text-primary">
          Detail
        </span>
      </div>

      <div className="space-y-3">
        <div className="group rounded-[30px] border border-white/25 bg-white/25 p-4 shadow-sm backdrop-blur-xl transition hover:-translate-y-0.5 hover:bg-white/35">
          <div className="flex items-center justify-between gap-4">
            <div className="flex min-w-0 flex-1 items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/30 bg-white/30 text-primary shadow-sm backdrop-blur-xl">
                <Users className="h-5 w-5" strokeWidth={1.6} />
              </div>

              <div className="min-w-0 flex-1">
                <h3 className="truncate text-sm font-extrabold text-grey-900">
                  Pembagian Kelompok
                </h3>

                <p className="mt-1 truncate font-secondary text-[11px] text-grey-600">
                  Cek jadwal dan kelompok di SPS.
                </p>
              </div>
            </div>

            <a
              href={SPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex shrink-0 items-center gap-1.5 rounded-2xl border border-white/30 bg-white/30 px-4 py-2.5 font-secondary text-xs font-bold text-primary shadow-sm backdrop-blur-xl transition hover:bg-primary hover:text-white"
            >
              Cek
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>

        <a
          href={OA_LINE_MBC_LAB_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="group block rounded-[30px] border border-white/25 bg-white/25 p-4 shadow-sm backdrop-blur-xl transition hover:-translate-y-0.5 hover:bg-white/35"
        >
          <div className="flex items-center justify-between gap-4">
            <div className="flex min-w-0 flex-1 items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/30 bg-white/30 shadow-sm backdrop-blur-xl">
                <Image
                  src="/images/line.png"
                  alt="Logo LINE"
                  width={28}
                  height={28}
                  className="h-7 w-7 object-contain"
                />
              </div>

              <div className="min-w-0 flex-1">
                <h3 className="truncate text-sm font-extrabold text-grey-900">
                  Kontak OA LINE
                </h3>

                <p className="mt-1 truncate font-secondary text-[11px] text-grey-600">
                  Hubungi kami jika ada kendala.
                </p>
              </div>
            </div>

            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/30 bg-white/30 text-primary shadow-sm backdrop-blur-xl transition group-hover:bg-success group-hover:text-white">
              <ExternalLink className="h-4 w-4" />
            </div>
          </div>
        </a>
      </div>
    </section>
  );
}
