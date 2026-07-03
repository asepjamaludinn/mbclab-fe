"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { KeyRound, ChevronRight } from "lucide-react";

import {
  changePasswordSchema,
  ChangePasswordFormData,
} from "@/features/auth/schemas/auth.schema";

import { useChangePassword } from "../hooks/use-change-password";

import { Button } from "@/shared/components/ui/button";
import { PasswordInput } from "@/shared/components/ui/password-input";

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

type ChangePasswordDialogProps = {
  itemClassName: string;
  iconClassName: string;
  chevronClassName: string;
};

export function ChangePasswordDialog({
  itemClassName,
  iconClassName,
  chevronClassName,
}: ChangePasswordDialogProps) {
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
    <Dialog
      onOpenChange={(open) => {
        if (!open) {
          resetMessages();
          reset();
        }
      }}
    >
      <DialogTrigger asChild>
        <button className={itemClassName}>
          <div className="flex min-w-0 items-center gap-3">
            <div className={iconClassName}>
              <KeyRound className="h-4.5 w-4.5" strokeWidth={1.8} />
            </div>

            <div className="min-w-0 text-left">
              <h3 className="text-sm font-extrabold text-grey-900">
                Ganti Password
              </h3>
              <p className="mt-0.5 font-secondary text-[11px] text-grey-500">
                Perbarui kata sandi akun
              </p>
            </div>
          </div>

          <ChevronRight className={chevronClassName} />
        </button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md w-[calc(100%-2rem)] rounded-[28px] border border-grey-200 bg-white p-6 shadow-[0_24px_60px_-30px_rgba(0,0,0,0.18)]">
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Tambahkan text-left untuk menimpa class bawaan Shadcn UI */}
          <DialogHeader className="text-left">
            {/* Hapus mx-auto agar selalu rata kiri */}
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-[0_12px_28px_-14px_rgba(0,101,176,0.65)]">
              <KeyRound className="h-7 w-7" strokeWidth={1.8} />
            </div>

            <DialogTitle className="text-xl font-extrabold text-grey-900">
              Ganti Password
            </DialogTitle>

            <DialogDescription className="font-secondary text-sm leading-relaxed text-grey-500">
              Masukkan password lama kemudian buat password baru untuk menjaga
              keamanan akun praktikan.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-6 space-y-4">
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
              <div className="rounded-2xl border border-error/15 bg-error/5 px-4 py-3 font-secondary text-sm text-error">
                {passwordError}
              </div>
            )}

            {passwordMessage && (
              <div className="rounded-2xl border border-success/15 bg-success/5 px-4 py-3 font-secondary text-sm text-success">
                {passwordMessage}
              </div>
            )}
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
  );
}
