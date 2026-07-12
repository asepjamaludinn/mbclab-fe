"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserPlus } from "lucide-react";
import axios from "axios";
import {
  createAdminSchema,
  CreateAdminFormData,
} from "../schemas/admin-account.schema";
import { useCreateAdminAccount } from "../hooks/use-admin-accounts";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/shared/components/ui/dialog";

type Props = { open: boolean; onOpenChange: (open: boolean) => void };

export function AdminAccountFormDialog({ open, onOpenChange }: Props) {
  const { mutateAsync: createAdmin, isPending } = useCreateAdminAccount();
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<CreateAdminFormData>({
    resolver: zodResolver(createAdminSchema),
  });

  useEffect(() => {
    if (open) reset({ nim: "", name: "", division: "PRACTICUM" as any });
  }, [open, reset]);

  const onSubmit = async (data: CreateAdminFormData) => {
    try {
      await createAdmin({ ...data, role: "ADMIN" });
      onOpenChange(false);
    } catch (error: unknown) {
      const message = axios.isAxiosError(error)
        ? error.response?.data?.message || "Gagal membuat akun."
        : "Gagal membuat akun.";
      setError("root.serverError", {
        type: "server",
        message: Array.isArray(message) ? message[0] : message,
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md w-[calc(100%-2rem)] rounded-[28px] border border-grey-200 bg-white p-6 shadow-xl">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader className="text-left">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-md">
              <UserPlus className="h-7 w-7" strokeWidth={1.8} />
            </div>
            <DialogTitle>Buat Akun Asisten Baru</DialogTitle>
            <DialogDescription>
              Password otomatis menggunakan username/NIM. Asisten wajib
              mengganti password saat pertama login.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-6 space-y-4">
            <div>
              <label className="mb-1.5 block font-secondary text-xs font-bold text-grey-700">
                Username / NIM
              </label>
              <Input {...register("nim")} placeholder="cth. mbclab_admin" />
              {errors.nim && (
                <p className="mt-1 text-xs font-medium text-error">
                  {errors.nim.message}
                </p>
              )}
            </div>
            <div>
              <label className="mb-1.5 block font-secondary text-xs font-bold text-grey-700">
                Nama Lengkap
              </label>
              <Input {...register("name")} placeholder="cth. Admin Utama" />
              {errors.name && (
                <p className="mt-1 text-xs font-medium text-error">
                  {errors.name.message}
                </p>
              )}
            </div>
            <div>
              <label className="mb-1.5 block font-secondary text-xs font-bold text-grey-700">
                Divisi
              </label>
              <select
                {...register("division")}
                className="h-11 w-full rounded-xl border border-grey-200 bg-grey-50 px-3.5 text-sm text-grey-900 focus:border-primary focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/10"
              >
                <option value="">Asisten</option>
                <option value="PRACTICUM">Praktikum</option>
                <option value="ACADEMIC">Akademik</option>
                <option value="COORDINATOR">Koordinator</option>
              </select>
              {errors.division && (
                <p className="mt-1 text-xs font-medium text-error">
                  {errors.division.message}
                </p>
              )}
            </div>
            {errors.root?.serverError && (
              <div className="rounded-2xl border border-error/15 bg-error/5 px-4 py-3 font-secondary text-sm text-error">
                {errors.root.serverError.message}
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
              disabled={isPending}
              className="w-full sm:w-auto"
            >
              {isPending ? "Menyimpan..." : "Buat Akun"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
