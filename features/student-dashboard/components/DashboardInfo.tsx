import { AlertCircle, CalendarDays, FileText } from "lucide-react";

export function DashboardInfo() {
  return (
    <section className="rounded-[34px] border border-white/70 bg-white/75 p-5 shadow-[0_18px_50px_-30px_rgba(0,101,176,0.4)] backdrop-blur-xl">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-[20px] bg-warning/10 text-warning">
          <CalendarDays className="h-6 w-6" strokeWidth={1.5} />
        </div>

        <div>
          <p className="font-secondary text-[11px] font-bold uppercase tracking-[0.18em] text-primary/70">
            Reminder
          </p>
          <h2 className="text-base font-extrabold text-grey-900">
            Informasi Praktikum
          </h2>
        </div>
      </div>

      <div className="space-y-3">
        <div className="rounded-[26px] bg-grey-50/90 p-4">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-[16px] bg-primary/10 text-primary">
            <FileText className="h-5 w-5" strokeWidth={1.5} />
          </div>

          <p className="text-sm font-bold text-grey-900">
            Periksa modul sebelum mengerjakan TP
          </p>

          <p className="mt-1 font-secondary text-xs leading-relaxed text-grey-500">
            Pastikan kamu membaca modul praktikum terlebih dahulu sebelum
            mengumpulkan TP atau mengikuti TA.
          </p>
        </div>

        <div className="rounded-[26px] bg-warning/10 p-4">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-[16px] bg-warning/10 text-warning">
            <AlertCircle className="h-5 w-5" strokeWidth={1.5} />
          </div>

          <p className="text-sm font-bold text-grey-900">
            Jadwal dan assessment dapat berubah
          </p>

          <p className="mt-1 font-secondary text-xs leading-relaxed text-grey-700">
            Selalu ikuti arahan terbaru dari asisten praktikum terkait jadwal,
            batas waktu TP, dan pelaksanaan TA.
          </p>
        </div>
      </div>
    </section>
  );
}
