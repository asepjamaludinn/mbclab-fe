import { GraduationCap, ShieldCheck, UserRoundCheck } from "lucide-react";

type DashboardProfileProps = {
  nim?: string;
  groupName: string;
};

export function DashboardProfile({ nim, groupName }: DashboardProfileProps) {
  return (
    <div className="overflow-hidden rounded-[32px] border border-white/80 bg-white/90 p-6 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.08)] backdrop-blur-2xl">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <p className="font-secondary text-[11px] font-bold uppercase tracking-[0.18em] text-primary">
            Profil Praktikan
          </p>

          <h2 className="mt-2 text-xl font-extrabold tracking-tight text-grey-900">
            {nim || "NIM belum tersedia"}
          </h2>

          <p className="mt-1 font-secondary text-xs leading-relaxed text-grey-500">
            {groupName}
          </p>
        </div>

        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[20px] bg-primary/10 text-primary">
          <UserRoundCheck className="h-7 w-7" strokeWidth={1.5} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-[24px] bg-grey-50 p-4">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-[14px] bg-primary/10 text-primary">
            <GraduationCap className="h-5 w-5" strokeWidth={1.5} />
          </div>
          <p className="text-sm font-bold text-grey-900">Praktikan</p>
          <p className="mt-1 font-secondary text-[11px] text-grey-500">
            Role aktif
          </p>
        </div>

        <div className="rounded-[24px] bg-grey-50 p-4">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-[14px] bg-success/10 text-success">
            <ShieldCheck className="h-5 w-5" strokeWidth={1.5} />
          </div>
          <p className="text-sm font-bold text-grey-900">Aktif</p>
          <p className="mt-1 font-secondary text-[11px] text-grey-500">
            Status akses
          </p>
        </div>
      </div>
    </div>
  );
}
