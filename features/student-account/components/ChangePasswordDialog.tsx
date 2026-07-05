"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { KeyRound, ChevronRight, ShieldAlert } from "lucide-react";

import {
  changePasswordSchema,
  ChangePasswordFormData,
  PASSWORD_POLICY_HINT,
} from "@/features/auth/schemas/auth.schema";

import { useChangePassword } from "@/features/auth";
import { useProfile } from "@/features/auth";

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
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: user } = useProfile();

  const isForced =
    searchParams.get("forceChangePassword") === "1" ||
    user?.mustChangePassword === true;

  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (isForced) setOpen(true);
  }, [isForced]);

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
      if (isForced) {
        const url = new URL(window.location.href);
        url.searchParams.delete("forceChangePassword");
        router.replace(url.pathname);
        setOpen(false);
      }
    });
  };

  return (
    <Dialog
      open={isForced ? true : open}
      onOpenChange={(next) => {
        if (isForced) return;
        setOpen(next);
        if (!next) {
          resetMessages();
          reset();
        }
      }}
    >
      {!isForced && (
        <DialogTrigger asChild>
          <button className={itemClassName} onClick={() => setOpen(true)}>
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
      )}

      <DialogContent
        className="sm:max-w-md w-[calc(100%-2rem)] rounded-[28px] border border-grey-200 bg-white p-6 shadow-[0_24px_60px_-30px_rgba(0,0,0,0.18)]"
        onEscapeKeyDown={(e) => isForced && e.preventDefault()}
        onPointerDownOutside={(e) => isForced && e.preventDefault()}
        onInteractOutside={(e) => isForced && e.preventDefault()}
        hideCloseButton={isForced}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader className="text-left">
            <div
              className={`mb-4 flex h-14 w-14 items-center justify-center rounded-full text-white shadow-[0_12px_28px_-14px_rgba(0,101,176,0.65)] ${
                isForced ? "bg-error" : "bg-primary"
              }`}
            >
              {isForced ? (
                <ShieldAlert className="h-7 w-7" strokeWidth={1.8} />
              ) : (
                <KeyRound className="h-7 w-7" strokeWidth={1.8} />
              )}
            </div>

            <DialogTitle className="text-xl font-extrabold text-grey-900">
              {isForced ? "Password Wajib Diganti" : "Ganti Password"}
            </DialogTitle>

            <DialogDescription className="font-secondary text-sm leading-relaxed text-grey-500">
              {isForced
                ? "Akun Anda masih menggunakan password default (sama dengan NIM). Untuk keamanan, Anda wajib mengganti password sebelum melanjutkan."
                : "Masukkan password lama kemudian buat password baru untuk menjaga keamanan akun praktikan."}
            </DialogDescription>
          </DialogHeader>

          <div className="mt-6 space-y-4">
            <PasswordInput
              {...register("oldPassword")}
              placeholder="Password lama (NIM Anda)"
              error={errors.oldPassword?.message}
            />

            <div>
              <PasswordInput
                {...register("newPassword")}
                placeholder="Password baru"
                error={errors.newPassword?.message}
              />
              <p className="mt-1.5 font-secondary text-[11px] text-grey-500">
                {PASSWORD_POLICY_HINT}
              </p>
            </div>

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
            {!isForced && (
              <DialogClose asChild>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full sm:w-auto"
                >
                  Batal
                </Button>
              </DialogClose>
            )}

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
