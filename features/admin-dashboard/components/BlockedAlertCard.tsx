import { ShieldAlert, Clock } from "lucide-react";
import { Button } from "@/shared/components/ui/button";

export function BlockedAlertCard({ count }: { count: number }) {
  return (
    <div className="flex h-full min-h-[280px] w-full flex-col justify-between overflow-hidden rounded-[32px] border border-grey-200/60 bg-white p-6 shadow-sm">
      <div>
        <p className="font-secondary text-[14px] font-bold text-grey-900">
          Reminders
        </p>
        <h3 className="mt-4 text-xl font-extrabold leading-tight text-primary">
          Ada {count} Ujian
          <br />
          Terblokir
        </h3>
        <div className="mt-3 flex items-center gap-1.5 font-secondary text-[13px] text-grey-500">
          <Clock className="h-4 w-4" />
          <span>Harap segera ditinjau</span>
        </div>
      </div>

      <Button
        variant="default"
        className="mt-6 h-12 w-full rounded-2xl bg-primary text-white shadow-lg shadow-primary/20 hover:bg-secondary"
      >
        <ShieldAlert className="mr-2 h-4 w-4" strokeWidth={2.5} />
        Tinjau Sekarang
      </Button>
    </div>
  );
}
