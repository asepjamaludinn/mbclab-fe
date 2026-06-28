import Link from "next/link";
import { Bell } from "lucide-react";

type DashboardHeaderProps = {
  userName?: string;
  nim?: string;
};

function getInitials(name?: string) {
  if (!name) return "P";

  return name
    .split(" ")
    .filter(Boolean)
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function DashboardHeader({
  userName = "Praktikan",
  nim,
}: DashboardHeaderProps) {
  return (
    <header className="flex items-center justify-between px-5 pt-6">
      <div className="min-w-0">
        <p className="font-secondary text-[11px] font-bold uppercase tracking-[0.18em] text-primary/70">
          MBCLAB Portal
        </p>

        <h1 className="mt-1 truncate text-2xl font-extrabold tracking-tight text-grey-900">
          Halo, {userName}
        </h1>

        {nim && (
          <p className="mt-1 font-secondary text-xs font-semibold text-grey-500">
            {nim}
          </p>
        )}
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <button
          type="button"
          className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/70 bg-white/80 text-primary shadow-sm backdrop-blur-xl transition hover:bg-primary hover:text-white"
          aria-label="Notifikasi"
        >
          <Bell className="h-5 w-5" strokeWidth={1.8} />
        </button>

        <Link
          href="/student/account"
          className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-secondary text-sm font-extrabold text-white shadow-[0_12px_30px_rgba(0,101,176,0.25)]"
        >
          {getInitials(userName)}
        </Link>
      </div>
    </header>
  );
}
