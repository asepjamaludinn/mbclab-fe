"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertTriangle,
  ChevronRight,
  Eye,
  EyeOff,
  KeyRound,
  LayoutDashboard,
  LogOut,
  ShieldCheck,
} from "lucide-react";
import { authService } from "@/features/auth";
import {
  changePasswordSchema,
  ChangePasswordFormData,
} from "@/features/auth/schemas/auth.schema";
import { Card } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
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

type PasswordInputProps = {
  placeholder: string;
  error?: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

function PasswordInput({ placeholder, error, ...props }: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  const blockClipboard = (event: React.ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();
  };

  return (
    <div>
      <div className="relative">
        <Input
          {...props}
          type={showPassword ? "text" : "password"}
          placeholder={placeholder}
          onPaste={blockClipboard}
          onCopy={blockClipboard}
          onCut={blockClipboard}
          className="pr-12"
        />

        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-grey-500 transition hover:text-primary"
          aria-label={
            showPassword ? "Sembunyikan password" : "Tampilkan password"
          }
        >
          {showPassword ? (
            <EyeOff className="h-5 w-5" />
          ) : (
            <Eye className="h-5 w-5" />
          )}
        </button>
      </div>

      {error && <span className="mt-2 block text-sm text-error">{error}</span>}
    </div>
  );
}

export function AccountActions({
  role,
  isLoggingOut,
  onLogout,
}: AccountActionsProps) {
  const dashboardHref =
    role === "ADMIN" ? "/admin/dashboard" : "/student/dashboard";

  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
  });

  const handleChangePassword = async (data: ChangePasswordFormData) => {
    setPasswordMessage("");
    setPasswordError("");

    try {
      setIsChangingPassword(true);

      await authService.changePassword({
        oldPassword: data.oldPassword,
        newPassword: data.newPassword,
      });

      setPasswordMessage("Password berhasil diganti.");
      reset();
    } catch (error: any) {
      setPasswordError(
        error?.response?.data?.message || "Gagal mengganti password.",
      );
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <section className="space-y-5 px-5 pt-6">
      <div className="relative overflow-hidden rounded-[34px] border border-white/70 bg-white/75 p-5 shadow-[0_18px_50px_-30px_rgba(0,101,176,0.4)] backdrop-blur-xl">
        <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-primary/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-14 -left-12 h-36 w-36 rounded-full bg-secondary/10 blur-3xl" />

        <div className="relative z-10 mb-5">
          <p className="font-secondary text-[11px] font-bold uppercase tracking-[0.18em] text-primary/70">
            Pengaturan
          </p>

          <h2 className="mt-1 text-xl font-extrabold tracking-tight text-grey-900">
            Account Info
          </h2>

          <p className="mt-1 font-secondary text-xs leading-relaxed text-grey-500">
            Kelola akses dashboard, keamanan akun, dan status akun praktikan.
          </p>
        </div>

        <div className="relative z-10 space-y-3">
          <Link href={dashboardHref} className="group block">
            <div className="flex items-center justify-between rounded-[26px] border border-white/70 bg-white/60 p-4 shadow-sm backdrop-blur-xl transition hover:bg-white">
              <div className="flex min-w-0 items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[20px] bg-primary text-white shadow-lg shadow-primary/20">
                  <LayoutDashboard className="h-5 w-5" />
                </div>

                <div className="min-w-0">
                  <p className="font-secondary text-[10px] font-bold uppercase tracking-[0.18em] text-primary">
                    Portal
                  </p>

                  <h3 className="mt-1 text-sm font-extrabold text-grey-900">
                    Dashboard
                  </h3>

                  <p className="mt-1 font-secondary text-xs text-grey-500">
                    Buka aktivitas praktikum.
                  </p>
                </div>
              </div>

              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-grey-50 text-grey-400 transition group-hover:bg-primary group-hover:text-white">
                <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
              </div>
            </div>
          </Link>

          <Dialog>
            <DialogTrigger asChild>
              <button className="group w-full text-left outline-none">
                <div className="flex items-center justify-between rounded-[26px] border border-white/70 bg-white/60 p-4 shadow-sm backdrop-blur-xl transition hover:bg-white">
                  <div className="flex min-w-0 items-center gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[20px] bg-warning text-white shadow-lg shadow-warning/20">
                      <KeyRound className="h-5 w-5" />
                    </div>

                    <div className="min-w-0">
                      <p className="font-secondary text-[10px] font-bold uppercase tracking-[0.18em] text-warning">
                        Security
                      </p>

                      <h3 className="mt-1 text-sm font-extrabold text-grey-900">
                        Ganti Password
                      </h3>

                      <p className="mt-1 font-secondary text-xs text-grey-500">
                        Perbarui kata sandi akun.
                      </p>
                    </div>
                  </div>

                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-grey-50 text-grey-400 transition group-hover:bg-warning group-hover:text-white">
                    <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
                  </div>
                </div>
              </button>
            </DialogTrigger>

            <DialogContent>
              <form onSubmit={handleSubmit(handleChangePassword)}>
                <DialogHeader>
                  <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-warning/10 text-warning sm:mx-0">
                    <KeyRound className="h-7 w-7" />
                  </div>

                  <DialogTitle>Ganti Password</DialogTitle>
                  <DialogDescription>
                    Masukkan password lama dan password baru untuk memperbarui
                    akses akun praktikan.
                  </DialogDescription>
                </DialogHeader>

                <div className="mt-4 space-y-4">
                  <PasswordInput
                    {...register("oldPassword")}
                    placeholder="Password lama"
                    error={errors.oldPassword?.message}
                  />

                  <PasswordInput
                    {...register("newPassword")}
                    placeholder="Password baru"
                    error={errors.newPassword?.message}
                  />

                  <PasswordInput
                    {...register("confirmPassword")}
                    placeholder="Konfirmasi password baru"
                    error={errors.confirmPassword?.message}
                  />

                  {passwordError && (
                    <div className="rounded-2xl bg-error/10 p-4 text-center font-secondary text-sm text-error">
                      {passwordError}
                    </div>
                  )}

                  {passwordMessage && (
                    <div className="rounded-2xl bg-success/10 p-4 text-center font-secondary text-sm text-success">
                      {passwordMessage}
                    </div>
                  )}
                </div>

                <DialogFooter className="mt-4">
                  <Button
                    type="submit"
                    disabled={isChangingPassword}
                    className="w-full sm:w-auto"
                  >
                    {isChangingPassword ? "Menyimpan..." : "Simpan Password"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

          <div className="flex items-center justify-between rounded-[26px] border border-white/70 bg-white/60 p-4 shadow-sm backdrop-blur-xl">
            <div className="flex min-w-0 items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[20px] bg-success text-white shadow-lg shadow-success/20">
                <ShieldCheck className="h-5 w-5" />
              </div>

              <div className="min-w-0">
                <p className="font-secondary text-[10px] font-bold uppercase tracking-[0.18em] text-success">
                  Verified
                </p>

                <h3 className="mt-1 text-sm font-extrabold text-grey-900">
                  Status Akun
                </h3>

                <p className="mt-1 font-secondary text-xs text-grey-500">
                  Aktif dan terverifikasi.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Dialog>
        <DialogTrigger asChild>
          <button className="group w-full text-left outline-none">
            <div className="relative overflow-hidden rounded-[30px] border border-error/10 bg-white/75 p-5 shadow-[0_16px_45px_-28px_rgba(0,0,0,0.35)] backdrop-blur-xl transition hover:-translate-y-1 hover:bg-white">
              <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-error/10 blur-2xl" />

              <div className="relative z-10 flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[20px] bg-error text-white shadow-lg shadow-error/20">
                  <LogOut className="h-6 w-6" />
                </div>

                <div>
                  <p className="font-secondary text-[10px] font-bold uppercase tracking-[0.18em] text-error">
                    Session
                  </p>

                  <h3 className="mt-1 text-sm font-extrabold text-error">
                    Keluar Akun
                  </h3>

                  <p className="mt-1 font-secondary text-xs text-grey-500">
                    Akhiri sesi akun praktikan saat ini.
                  </p>
                </div>
              </div>
            </div>
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
              harus login kembali untuk mengakses dashboard.
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
