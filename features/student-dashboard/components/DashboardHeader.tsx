import Link from "next/link";
import { Settings } from "lucide-react";
import { getInitials } from "@/shared/utils/string";

type DashboardHeaderProps = {
  userName?: string;
  nim?: string;
  onLogout?: () => void;
  isLoggingOut?: boolean;
};

export function DashboardHeader({
  userName = "Praktikan",
  nim,
}: DashboardHeaderProps) {
  return (
    <header className="flex items-center justify-between px-5 pt-6 text-white">
      <Link href="/student/account" className="flex min-w-0 items-center gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/30 bg-white/20 font-secondary text-sm font-extrabold text-white shadow-sm backdrop-blur-xl">
          {getInitials(userName)}
        </div>

        <div className="min-w-0">
          <h1 className="truncate text-lg font-extrabold leading-tight tracking-tight">
            {userName}
          </h1>

          {nim && (
            <p className="mt-1 truncate font-secondary text-sm font-bold leading-tight text-white/85">
              {nim}
            </p>
          )}
        </div>
      </Link>

      <div className="flex shrink-0 items-center gap-3">
        <Link
          href="/student/account"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-white/15 text-white shadow-sm backdrop-blur-xl transition hover:bg-white hover:text-primary active:scale-[0.96]"
          aria-label="Pengaturan akun"
        >
          <Settings className="h-5 w-5" strokeWidth={2.2} />
        </Link>
      </div>
    </header>
  );
}
