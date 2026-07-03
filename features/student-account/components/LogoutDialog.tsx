"use client";

import { AlertTriangle, ChevronRight, LogOut } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/shared/components/ui/dialog";
import { useLogout } from "../hooks/use-account";

export function LogoutDialog() {
  const { isLoggingOut, handleLogout } = useLogout();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="group w-full text-left outline-none">
          <div className="overflow-hidden rounded-[30px] border border-white/35 bg-white/20 shadow-[0_24px_60px_-34px_rgba(220,38,38,0.45),inset_0_1px_0_rgba(255,255,255,0.55)] backdrop-blur-2xl transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/25">
            <div className="flex items-center justify-between px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full border border-red-300/30 bg-error text-white shadow-[0_14px_34px_-18px_rgba(220,38,38,0.85)]">
                  <LogOut className="h-5 w-5" strokeWidth={1.9} />
                </div>

                <div>
                  <h3 className="text-sm font-extrabold text-error">
                    Keluar Akun
                  </h3>

                  <p className="mt-0.5 font-secondary text-[11px] text-grey-500">
                    Akhiri sesi praktikum dengan aman.
                  </p>
                </div>
              </div>

              <ChevronRight className="h-4 w-4 text-error transition duration-300 group-hover:translate-x-1" />
            </div>
          </div>
        </button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md w-[calc(100%-2rem)] rounded-[28px] border border-grey-200 bg-white p-6 shadow-[0_24px_60px_-30px_rgba(0,0,0,0.18)]">
        <DialogHeader className="text-left">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-error text-white shadow-[0_12px_28px_-14px_rgba(220,38,38,0.65)]">
            <AlertTriangle className="h-7 w-7" strokeWidth={1.8} />
          </div>

          <DialogTitle className="text-xl font-extrabold text-grey-900">
            Keluar Akun?
          </DialogTitle>

          <DialogDescription className="font-secondary text-sm leading-relaxed text-grey-500">
            Anda akan keluar dari Portal Praktikum MBC Laboratory dan harus
            login kembali untuk mengakses dashboard.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-6 rounded-2xl border border-error/15 bg-error/5 px-4 py-3">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-error" />
            <p className="font-secondary text-sm leading-relaxed text-error">
              Pastikan seluruh pekerjaan atau pengumpulan tugas telah selesai
              sebelum keluar dari akun.
            </p>
          </div>
        </div>

        <DialogFooter className="mt-7 flex-col-reverse gap-3 sm:flex-row">
          <DialogClose asChild>
            <Button
              type="button"
              variant="outline"
              className="w-full sm:w-auto"
            >
              Batal
            </Button>
          </DialogClose>

          <Button
            variant="danger"
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="w-full sm:w-auto"
          >
            {isLoggingOut ? "Keluar..." : "Ya, Keluar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
