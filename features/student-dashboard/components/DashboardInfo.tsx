import { AlertCircle, FileText, MapPin } from "lucide-react";

export function DashboardInfo() {
  const iconClassName =
    "flex shrink-0 items-center justify-center rounded-full border border-white/45 bg-primary/80 text-white shadow-[0_10px_24px_-14px_rgba(0,101,176,0.9)] backdrop-blur-xl";

  const cardClassName =
    "rounded-[28px] border border-white/40 bg-white/20 shadow-[0_18px_45px_-28px_rgba(0,101,176,0.55),inset_0_1px_0_rgba(255,255,255,0.55)] backdrop-blur-2xl transition duration-300 hover:-translate-y-0.5 hover:bg-white/25 hover:shadow-[0_22px_55px_-30px_rgba(0,101,176,0.7),inset_0_1px_0_rgba(255,255,255,0.65)]";

  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-extrabold tracking-tight">
          Informasi Praktikum
        </h2>
      </div>

      <div className="space-y-3">
        <div className={`${cardClassName} p-4`}>
          <div className="flex items-start gap-3">
            <div className={`h-12 w-12 ${iconClassName}`}>
              <MapPin className="h-6 w-6" strokeWidth={1.8} />
            </div>

            <div className="min-w-0 flex-1">
              <p className="font-secondary text-[11px] font-bold uppercase tracking-[0.14em] text-primary">
                Ruang Praktikum
              </p>

              <h3 className="mt-1 text-[28px] font-extrabold leading-none tracking-tight text-grey-900">
                TULT 11.12
              </h3>

              <p className="mt-2 font-secondary text-xs leading-relaxed text-grey-700">
                Datang sesuai jadwal dan shift praktikum yang sudah ditentukan.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className={`${cardClassName} p-4`}>
            <div className={`mb-4 h-10 w-10 ${iconClassName}`}>
              <FileText className="h-5 w-5" strokeWidth={1.8} />
            </div>

            <p className="text-sm font-extrabold leading-tight text-grey-900">
              Baca modul sebelum TA
            </p>

            <p className="mt-2 font-secondary text-[11px] leading-relaxed text-grey-500">
              Pastikan materi sudah dipahami.
            </p>
          </div>

          <div className={`${cardClassName} p-4`}>
            <div className={`mb-4 h-10 w-10 ${iconClassName}`}>
              <AlertCircle className="h-5 w-5" strokeWidth={1.8} />
            </div>

            <p className="text-sm font-extrabold leading-tight text-grey-900">
              Jadwal bisa berubah
            </p>

            <p className="mt-2 font-secondary text-[11px] leading-relaxed text-grey-500">
              Ikuti arahan terbaru dari asisten praktikum.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
