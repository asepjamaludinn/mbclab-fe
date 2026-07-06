"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ShieldAlert } from "lucide-react";
import {
  changePasswordSchema,
  ChangePasswordFormData,
  PASSWORD_POLICY_HINT,
} from "@/features/auth/schemas/auth.schema";
import { useChangePassword, useProfile } from "@/features/auth";
import { useSyncMustChangePasswordFlag } from "@/shared/hooks/use-sync-password-flag";
import { Button } from "@/shared/components/ui/button";
import { PasswordInput } from "@/shared/components/ui/password-input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";

export function ForcePasswordChangeDialog() {
  const router = useRouter();

  const { data: user } = useProfile("ADMIN");

  useSyncMustChangePasswordFlag(user);

  const isForced = user?.mustChangePassword === true;
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(isForced);
  }, [isForced]);

  const {
    isChangingPassword,
    passwordMessage,
    passwordError,
    handleChangePassword,
  } = useChangePassword();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
  });

  if (!isForced) return null;

  const onSubmit = (data: ChangePasswordFormData) => {
    handleChangePassword(data, () => {
      reset();
      const url = new URL(window.location.href);
      url.searchParams.delete("forceChangePassword");
      router.replace(url.pathname);
      setOpen(false);
    });
  };

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent
        className="sm:max-w-md w-[calc(100%-2rem)] rounded-[28px] border border-grey-200 bg-white p-6 shadow-[0_24px_60px_-30px_rgba(0,0,0,0.18)]"
        onEscapeKeyDown={(e) => e.preventDefault()}
        onPointerDownOutside={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
        hideCloseButton
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader className="text-left">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-error text-white shadow-[0_12px_28px_-14px_rgba(220,38,38,0.65)]">
              <ShieldAlert className="h-7 w-7" strokeWidth={1.8} />
            </div>

            <DialogTitle className="text-xl font-extrabold text-grey-900">
              Password Wajib Diganti
            </DialogTitle>

            <DialogDescription className="font-secondary text-sm leading-relaxed text-grey-500">
              Akun Anda masih menggunakan password default (sama dengan NIM).
              Untuk keamanan, Anda wajib mengganti password sebelum melanjutkan.
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

          <DialogFooter className="mt-7">
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
