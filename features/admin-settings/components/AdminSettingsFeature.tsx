"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { KeyRound, ShieldCheck } from "lucide-react";
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
    <div className="flex w-full flex-col gap-6 font-primary">
      <div className="flex w-full flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-primary text-2xl font-bold tracking-tight text-grey-900">
            Pengaturan Akun
          </h1>
          <p className="mt-1 font-secondary text-sm text-grey-500">
            Kelola profil dan perbarui keamanan kredensial akun asisten Anda.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Kolom Kiri: Profil Ringkas */}
        <div className="flex flex-col gap-6 lg:col-span-1">
          <div className="overflow-hidden rounded-[32px] border border-grey-200/60 bg-white p-6 shadow-sm">
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-24 w-24 items-center justify-center rounded-[24px] bg-primary/10 text-3xl font-extrabold text-primary shadow-sm">
                {getInitials(userProfile?.name || "A")}
              </div>
              <h2 className="text-xl font-extrabold text-grey-900">
                {userProfile?.name || "Memuat..."}
              </h2>
              <p className="mt-1 font-secondary text-sm font-medium text-grey-500">
                {userProfile?.nim || "-"}
              </p>

              {userProfile?.division && (
                <div className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-success/10 px-3 py-1 font-secondary text-xs font-bold text-success">
                  <ShieldCheck className="h-4 w-4" strokeWidth={2.5} />
                  {userProfile.division}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Kolom Kanan: Form Ganti Password */}
        <div className="lg:col-span-2">
          <div className="overflow-hidden rounded-[32px] border border-grey-200/60 bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-warning/10 text-warning-700">
                <KeyRound className="h-6 w-6" strokeWidth={2} />
              </div>
              <div>
                <h2 className="text-lg font-extrabold text-grey-900">
                  Ganti Password
                </h2>
                <p className="font-secondary text-sm text-grey-500">
                  Gunakan password yang kuat agar keamanan sistem terjaga.
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="space-y-4 rounded-2xl border border-grey-100 bg-grey-50/50 p-5">
                <div>
                  <label className="mb-1.5 block font-secondary text-xs font-bold text-grey-700">
                    Password Lama
                  </label>
                  <PasswordInput
                    {...register("oldPassword")}
                    placeholder="Masukkan password saat ini"
                    error={errors.oldPassword?.message}
                    onChange={() => resetMessages()}
                  />
                </div>

                <div>
                  <label className="mb-1.5 block font-secondary text-xs font-bold text-grey-700">
                    Password Baru
                  </label>
                  <PasswordInput
                    {...register("newPassword")}
                    placeholder="Buat password baru"
                    error={errors.newPassword?.message}
                    onChange={() => resetMessages()}
                  />
                  <p className="mt-2 font-secondary text-[11px] leading-relaxed text-grey-500">
                    * {PASSWORD_POLICY_HINT}
                  </p>
                </div>

                <div>
                  <label className="mb-1.5 block font-secondary text-xs font-bold text-grey-700">
                    Konfirmasi Password Baru
                  </label>
                  <PasswordInput
                    {...register("confirmPassword")}
                    placeholder="Ulangi password baru"
                    error={errors.confirmPassword?.message}
                    onChange={() => resetMessages()}
                  />
                </div>
              </div>

              {passwordError && (
                <div className="rounded-2xl border border-error/15 bg-error/5 px-4 py-3 font-secondary text-sm text-error">
                  {passwordError}
                </div>
              )}

              {passwordMessage && (
                <div className="rounded-2xl border border-success/15 bg-success/5 px-4 py-3 font-secondary text-sm text-success">
                  {passwordMessage}
                </div>
              )}

              <div className="flex justify-end pt-2">
                <Button
                  type="submit"
                  disabled={isChangingPassword}
                  className="w-full sm:w-auto"
                >
                  {isChangingPassword ? "Menyimpan..." : "Simpan Password Baru"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
