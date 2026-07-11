import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  ShieldAlert,
  Clock,
  MonitorOff,
  CheckSquare,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";

type Props = {
  onAgree: () => void;
  onCancel: () => void;
};

export function ExamRules({ onAgree, onCancel }: Props) {
  const [isAgreed, setIsAgreed] = useState(false);

  const rules = [
    {
      icon: Clock,
      title: "Waktu Terbatas",
      description:
        "Anda memiliki waktu 15 Menit untuk menyelesaikan Tes Awal (TA). Kuis akan ter-submit otomatis jika waktu habis.",
      color: "text-info-700",
      bg: "bg-info/15",
    },
    {
      icon: MonitorOff,
      title: "Sistem Anti-Curang",
      description:
        "Sesi Anda akan otomatis TERBLOKIR jika Anda meninggalkan halaman kuis, menutup tab, atau membuka aplikasi lain.",
      color: "text-error",
      bg: "bg-error/15",
    },
    {
      icon: ShieldAlert,
      title: "Diskualifikasi",
      description:
        "Jika Anda terblokir hingga 5 kali, ujian akan langsung diakhiri dan Anda akan mendapatkan nilai 0.",
      color: "text-warning-700",
      bg: "bg-warning/15",
    },
  ];

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[linear-gradient(180deg,#0065b0_0%,#1e3f75_30%,#eaf6ff_58%,#ffffff_86%)] px-5 py-12 font-primary selection:bg-primary/20">
      <div className="pointer-events-none absolute -right-20 top-8 h-60 w-60 rounded-full bg-white/15 blur-[75px]" />
      <div className="pointer-events-none absolute -left-24 top-52 h-64 w-64 rounded-full bg-white/10 blur-[80px]" />

      <div className="relative z-10 w-full max-w-md">
        <div className="mb-6">
          <button
            onClick={onCancel}
            className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/15 px-4 py-2 font-secondary text-xs font-bold text-white shadow-sm backdrop-blur-md transition-all hover:bg-white/25 hover:shadow-md active:scale-[0.96]"
          >
            <ArrowLeft className="h-4 w-4" /> Kembali
          </button>
        </div>

        <div className="overflow-hidden rounded-[36px] border border-white/50 bg-white/60 p-6 shadow-[0_24px_60px_-38px_rgba(0,101,176,0.35)] backdrop-blur-2xl transition-all sm:p-8">
          <div className="mb-6 text-center">
            <h1 className="text-[24px] font-extrabold tracking-tight text-slate-900 drop-shadow-sm">
              Peraturan Ujian
            </h1>
            <p className="mt-2 font-secondary text-sm leading-relaxed text-slate-600">
              Harap baca dan setujui peraturan berikut sebelum memulai Tes Awal
              (TA).
            </p>
          </div>

          <div className="space-y-4">
            {rules.map((rule, idx) => {
              const Icon = rule.icon;
              return (
                <div
                  key={idx}
                  className="flex items-start gap-4 rounded-2xl bg-white/80 p-4 shadow-sm"
                >
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${rule.bg} ${rule.color}`}
                  >
                    <Icon className="h-5 w-5" strokeWidth={2} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-extrabold text-slate-900 text-sm">
                      {rule.title}
                    </h3>
                    <p className="mt-1 font-secondary text-xs leading-relaxed text-slate-600">
                      {rule.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 border-t border-slate-200/60 pt-5">
            <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-transparent p-2 transition-colors hover:bg-white/50">
              <div className="relative flex h-5 w-5 shrink-0 items-center justify-center mt-0.5">
                <input
                  type="checkbox"
                  checked={isAgreed}
                  onChange={(e) => setIsAgreed(e.target.checked)}
                  className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border-2 border-slate-300 bg-white checked:border-primary checked:bg-primary transition-all"
                />
                <CheckSquare
                  className="pointer-events-none absolute h-3.5 w-3.5 text-white opacity-0 transition-opacity peer-checked:opacity-100"
                  strokeWidth={3}
                />
              </div>
              <span className="font-secondary text-[13px] font-semibold text-slate-700 leading-relaxed select-none">
                Saya telah membaca, memahami, dan menyetujui seluruh peraturan
                di atas.
              </span>
            </label>

            <Button
              onClick={onAgree}
              disabled={!isAgreed}
              className="mt-5 h-[54px] w-full rounded-[20px] text-[15px] font-bold shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/30 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
            >
              Lanjutkan <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
