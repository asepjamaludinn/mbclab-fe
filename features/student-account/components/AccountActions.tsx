import Link from "next/link";
import { LogOut, LayoutDashboard, AlertTriangle } from "lucide-react";
import { Card } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/dialog";

type AccountActionsProps = {
  role?: string;
  isLoggingOut: boolean;
  onLogout: () => void;
};

export function AccountActions({
  role,
  isLoggingOut,
  onLogout,
}: AccountActionsProps) {
  const dashboardHref =
    role === "ADMIN" ? "/admin/dashboard" : "/student/dashboard";

  return (
    <section className="relative z-20 -mt-8 space-y-3 px-4">
      <Link href={dashboardHref}>
        <Card className="flex cursor-pointer items-center justify-between p-5 transition hover:border-primary/20 hover:shadow-md">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <LayoutDashboard className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-grey-900">
                Pergi ke Dashboard
              </h3>
              <p className="font-secondary text-xs text-grey-500">
                Masuk ke tampilan penuh portal.
              </p>
            </div>
          </div>
        </Card>
      </Link>

      <Dialog>
        <DialogTrigger asChild>
          <button className="w-full text-left outline-none">
            <Card className="flex cursor-pointer items-center justify-between p-5 transition hover:border-error/20 hover:shadow-md">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-error/10 text-error">
                  <LogOut className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-error">Keluar Akun</h3>
                  <p className="font-secondary text-xs text-grey-500">
                    Akhiri sesi Anda saat ini.
                  </p>
                </div>
              </div>
            </Card>
          </button>
        </DialogTrigger>

        <DialogContent>
          <DialogHeader>
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-error/10 text-error sm:mx-0">
              <AlertTriangle className="h-7 w-7" />
            </div>
            <DialogTitle>Konfirmasi Keluar</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin keluar dari akun portal praktikan? Anda
              harus memasukkan NIM dan password kembali untuk mengakses
              dashboard.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="mt-4">
            <Button
              variant="danger"
              onClick={onLogout}
              disabled={isLoggingOut}
              className="w-full sm:w-auto"
            >
              {isLoggingOut ? "Keluar..." : "Ya, Keluar Akun"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}
