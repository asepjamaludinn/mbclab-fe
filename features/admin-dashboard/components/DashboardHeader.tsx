import { RefreshCw, Plus } from "lucide-react";
import { Button } from "@/shared/components/ui/button";

type DashboardHeaderProps = {
  userName: string;
  isRefetching: boolean;
  onRefresh: () => void;
};

export function DashboardHeader({
  userName,
  isRefetching,
  onRefresh,
}: DashboardHeaderProps) {
  return (
    <div className="mb-6 flex w-full flex-col justify-between gap-4 sm:flex-row sm:items-center">
      <div>
        <h1 className="font-primary text-2xl font-bold tracking-tight text-grey-900">
          Dashboard
        </h1>
        <p className="mt-1 font-secondary text-sm text-grey-500">
          Ringkasan aktivitas praktikum hari ini.
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-3">
        <Button
          variant="outline"
          onClick={onRefresh}
          disabled={isRefetching}
          className="h-10 rounded-lg px-4 shadow-sm"
        >
          <RefreshCw
            className={`mr-2 h-4 w-4 ${isRefetching ? "animate-spin" : ""}`}
            strokeWidth={2}
          />
          Segarkan
        </Button>
        <Button className="h-10 rounded-lg px-4 shadow-sm">
          <Plus className="mr-2 h-4 w-4" strokeWidth={2} />
          Buat Sesi
        </Button>
      </div>
    </div>
  );
}
