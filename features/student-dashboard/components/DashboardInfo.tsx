import { CalendarDays, FileText } from "lucide-react";

export function DashboardInfo() {
  return (
    <div className="rounded-[32px] border border-grey-200/60 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-[18px] bg-warning/10 text-warning">
          <CalendarDays className="h-6 w-6" strokeWidth={1.5} />
        </div>

        <div>
          <h2 className="text-base font-extrabold text-grey-900">
            Informasi Praktikum
          </h2>
          <p className="font-secondary text-[11px] text-grey-500">
            Pantau jadwal dan instruksi dari asisten.
          </p>
        </div>
      </div>

      <div className="rounded-[24px] bg-grey-50 p-4">
        <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-[14px] bg-primary/10 text-primary">
          <FileText className="h-5 w-5" strokeWidth={1.5} />
        </div>

        <p className="text-sm font-bold text-grey-900">
          Pastikan data praktikum selalu diperiksa
        </p>

        <p className="mt-1 font-secondary text-xs leading-relaxed text-grey-500">
          Informasi modul, tugas, dan assessment dapat berubah mengikuti arahan
          asisten praktikum.
        </p>
      </div>
    </div>
  );
}
