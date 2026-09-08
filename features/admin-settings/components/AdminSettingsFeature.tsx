"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { KeyRound, ShieldCheck, Lock } from "lucide-react";
import {
  changePasswordSchema,
  ChangePasswordFormData,
  PASSWORD_POLICY_HINT,
} from "@/features/auth/schemas/auth.schema";
import { useChangePassword, useProfile } from "@/features/auth";
import { Button } from "@/shared/components/ui/button";
import { PasswordInput } from "@/shared/components/ui/password-input";
import { getInitials } from "@/shared/utils/string";

export function AdminSettingsFeature() {
  const { data: userProfile } = useProfile("ADMIN");
  const {
    isChangingPassword,
    passwordMessage,
    passwordError,
    handleChangePassword,
    resetMessages,
  } = useChangePassword();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
  });

  const onSubmit = (data: ChangePasswordFormData) => {
    handleChangePassword(data, () => {
      reset();
    });
  };

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 font-primary">
      {/* Header */}
      <div className="flex w-full flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-primary text-2xl font-medium tracking-tighter text-grey-900">
            Pengaturan Akun
          </h1>
          <p className="mt-1 font-secondary text-sm tracking-tight text-grey-500">
            Kelola profil dan perbarui keamanan kredensial akun asisten Anda.
          </p>
        </div>
      </div>

      {/* Profil Ringkas & Form Keamanan dalam Satu Alur Elegan */}
      <div className="overflow-hidden rounded-[32px] border border-white/60 bg-white/60 p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-2xl sm:p-8">
        {/* User Identity Banner */}
        <div className="flex flex-col sm:flex-row items-center gap-5 border-b border-white/50 pb-6 mb-6">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-white/60 bg-white/50 text-2xl font-medium tracking-tighter text-primary shadow-sm backdrop-blur-md">
            {getInitials(userProfile?.name || "A")}
          </div>
          <div className="text-center sm:text-left">
            <h2 className="text-xl font-medium tracking-tighter text-grey-900">
              {userProfile?.name || "Memuat..."}
            </h2>
            <p className="mt-0.5 font-secondary text-sm font-medium tracking-tight text-grey-500">
              {userProfile?.nim || "-"}
            </p>
            {userProfile?.division && (
              <div className="mt-2.5 inline-flex items-center gap-1.5 rounded-full border border-success/10 bg-success/10 px-3 py-0.5 font-secondary text-xs font-medium tracking-tight text-success backdrop-blur-md">
                <ShieldCheck className="h-3.5 w-3.5" strokeWidth={1.5} />
                <span>{userProfile.division}</span>
              </div>
            )}
          </div>
        </div>

        {/* Ganti Password Section */}
        <div className="mb-6 flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-warning/10 bg-warning/10 text-warning-700 backdrop-blur-md">
            <KeyRound className="h-6 w-6" strokeWidth={1.5} />
          </div>
          <div>
            <h3 className="text-base font-medium tracking-tighter text-grey-900">
              Ganti Password
            </h3>
            <p className="font-secondary text-xs tracking-tight text-grey-500">
              Gunakan password yang kuat agar keamanan sistem terjaga.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-4 rounded-[24px] border border-white/50 bg-white/40 p-5 backdrop-blur-md shadow-sm">
            <div>
              <label className="mb-1.5 block font-secondary text-xs font-medium tracking-tight text-grey-700">
                Password Lama
              </label>
              <PasswordInput
                {...register("oldPassword")}
                placeholder="Masukkan password saat ini"
                error={errors.oldPassword?.message}
                onChange={() => resetMessages()}
                className="bg-white/50 backdrop-blur-md border-white/40 font-medium tracking-tight"
              />
            </div>

            <div>
              <label className="mb-1.5 block font-secondary text-xs font-medium tracking-tight text-grey-700">
                Password Baru
              </label>
              <PasswordInput
                {...register("newPassword")}
                placeholder="Buat password baru"
                error={errors.newPassword?.message}
                onChange={() => resetMessages()}
                className="bg-white/50 backdrop-blur-md border-white/40 font-medium tracking-tight"
              />
              <p className="mt-2 font-secondary text-[11px] leading-relaxed tracking-tight text-grey-500">
                * {PASSWORD_POLICY_HINT}
              </p>
            </div>

            <div>
              <label className="mb-1.5 block font-secondary text-xs font-medium tracking-tight text-grey-700">
                Konfirmasi Password Baru
              </label>
              <PasswordInput
                {...register("confirmPassword")}
                placeholder="Ulangi password baru"
                error={errors.confirmPassword?.message}
                onChange={() => resetMessages()}
                className="bg-white/50 backdrop-blur-md border-white/40 font-medium tracking-tight"
              />
            </div>
          </div>

          {passwordError && (
            <div className="rounded-2xl border border-error/15 bg-error/5 px-4 py-3 font-secondary text-sm font-medium tracking-tight text-error backdrop-blur-md">
              {passwordError}
            </div>
          )}

          {passwordMessage && (
            <div className="rounded-2xl border border-success/15 bg-success/5 px-4 py-3 font-secondary text-sm font-medium tracking-tight text-success backdrop-blur-md">
              {passwordMessage}
            </div>
          )}

          <div className="flex justify-end pt-2">
            <Button
              type="submit"
              disabled={isChangingPassword}
              className="w-full sm:w-auto font-medium tracking-tight rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
            >
              <Lock className="mr-2 h-4 w-4" strokeWidth={1.5} />
              {isChangingPassword ? "Menyimpan..." : "Simpan Password Baru"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
