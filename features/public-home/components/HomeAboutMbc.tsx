import { GraduationCap, UserRoundCheck } from "lucide-react";

export function HomeAboutMbc() {
  return (
    <section className="px-5 pt-7">
      <div className="space-y-3">
        <div className="relative overflow-hidden rounded-[30px] bg-[linear-gradient(135deg,#0065b0_0%,#1e3f75_100%)] p-5 text-white shadow-[0_22px_55px_-36px_rgba(0,101,176,0.75)]">
          <div className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full border border-white/15" />
          <div className="pointer-events-none absolute -right-4 -top-4 h-24 w-24 rounded-full border border-white/15" />

          <div className="relative z-10">
            <h2 className="max-w-[250px] text-2xl font-extrabold leading-tight tracking-tight">
              Tentang MBC Laboratory
            </h2>

            <p className="mt-3 max-w-[280px] font-secondary text-xs leading-relaxed text-white/75">
              Ruang belajar berbasis riset, praktikum, dan pengembangan
              teknologi untuk mendukung aktivitas akademik mahasiswa.
            </p>
          </div>

          <div className="relative z-10 mt-5 flex gap-3">
            <div className="rounded-full border border-white/25 bg-white/10 px-4 py-2 font-secondary text-[11px] font-semibold text-white backdrop-blur-xl">
              Riset
            </div>

            <div className="rounded-full bg-white px-4 py-2 font-secondary text-[11px] font-bold text-primary">
              Praktikum
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="relative min-h-[118px] overflow-hidden rounded-[24px] bg-grey-50 p-3.5">
            <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-primary/10 blur-2xl" />

            <div className="relative z-10 flex h-full flex-col justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-primary shadow-sm">
                <GraduationCap className="h-5 w-5" strokeWidth={1.7} />
              </div>

              <div>
                <p className="font-secondary text-[10px] font-semibold text-grey-500">
                  Modul Praktikum
                </p>

                <div className="mt-1 flex items-end gap-1">
                  <span className="text-[38px] font-extrabold leading-none tracking-tight text-grey-900">
                    3
                  </span>
                  <span className="mb-1 font-secondary text-xs font-bold text-primary">
                    modul
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="relative min-h-[140px] overflow-hidden rounded-[24px] bg-grey-50 p-3.5">
            <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-primary/10 blur-2xl" />

            <div className="relative z-10 flex h-full flex-col justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-primary shadow-sm">
                <UserRoundCheck className="h-5 w-5" strokeWidth={1.7} />
              </div>

              <div>
                <p className="font-secondary text-[10px] font-semibold text-grey-500">
                  Asisten Praktikum
                </p>

                <div className="mt-1 flex items-end gap-1">
                  <span className="text-[38px] font-extrabold leading-none tracking-tight text-grey-900">
                    14
                  </span>
                  <span className="mb-1 font-secondary text-xs font-bold text-primary">
                    orang
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
