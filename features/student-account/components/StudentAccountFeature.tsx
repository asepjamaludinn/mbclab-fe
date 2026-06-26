"use client";

import { useState } from "react";
import { User, LogOut, LayoutDashboard, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useProfile, authService } from "@/features/auth";
import { PublicBottomNavigation } from "@/features/public-home";
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

export function StudentAccountFeature() {
  const { data: user, isLoading } = useProfile();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await authService.logout();
      localStorage.removeItem("access_token");
      localStorage.removeItem("user_role");
      router.push("/login/student");
    } catch (error) {
      console.error("Logout failed", error);
      setIsLoggingOut(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-grey-200">
        <span className="animate-pulse font-secondary text-sm font-bold text-primary">
          Memuat Profil...
        </span>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-grey-200 pb-28">
      <section className="relative overflow-hidden rounded-b-[40px] bg-primary px-4 pb-20 pt-5 text-white shadow-sm">
        <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-20 h-64 w-64 rounded-full bg-secondary/40 blur-3xl" />

        <div className="relative z-10 mt-6 text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-white/20 p-2 shadow-lg backdrop-blur-md">
            <User className="h-10 w-10 text-white" strokeWidth={1.5} />
          </div>
          <h1 className="text-2xl font-bold leading-tight text-white">
            {user?.name}
          </h1>
          <p className="mt-1 font-secondary text-sm text-white/80">
            NIM: {user?.nim}
          </p>
          <div className="mt-3 inline-block rounded-full border border-success/40 bg-success/20 px-3 py-1 font-secondary text-[10px] font-bold uppercase tracking-wider text-white">
            Praktikan MBCLAB
          </div>
        </div>
      </section>

      <section className="relative z-20 -mt-8 space-y-3 px-4">
        <Link
          href={
            user?.role === "ADMIN" ? "/admin/dashboard" : "/student/dashboard"
          }
        >
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
                    <h3 className="text-sm font-bold text-error">
                      Keluar Akun
                    </h3>
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
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="w-full sm:w-auto"
              >
                {isLoggingOut ? "Keluar..." : "Ya, Keluar Akun"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </section>

      <PublicBottomNavigation />
    </main>
  );
}
