"use client";

import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserPlus } from "lucide-react";
import axios from "axios";
import {
  createAdminSchema,
  CreateAdminFormData,
} from "../schemas/admin-account.schema";
import { useCreateAdminAccount } from "../hooks/use-admin-accounts";
import { CreateAdminPayload } from "../types/admin-account.type";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { FilterDropdown } from "@/shared/components/ui/filter-dropdown";
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

const DIVISION_FORM_OPTIONS = [
  { value: "PRACTICUM", label: "Praktikum" },
  { value: "ACADEMIC", label: "Akademik" },
  { value: "COORDINATOR", label: "Koordinator" },
];

export function AdminAccountFormDialog({ open, onOpenChange }: Props) {
  const { mutateAsync: createAdmin, isPending } = useCreateAdminAccount();
  const {
    register,
    handleSubmit,
    control,
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
    const division = (data.division ||
      "PRACTICUM") as CreateAdminPayload["division"];

    const payload: CreateAdminPayload = {
      nim: data.nim,
      name: data.name,
      role: "ADMIN",
      division,
    };

    try {
      await createAdmin(payload);
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
      <DialogContent className="sm:max-w-md w-[calc(100%-2rem)] max-h-[90vh] overflow-y-auto custom-scrollbar rounded-[32px] border border-white/50 bg-white/70 p-6 shadow-[0_24px_60px_-15px_rgba(0,0,0,0.1)] backdrop-blur-3xl">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader className="text-left">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/90 text-white shadow-xl shadow-primary/20 backdrop-blur-md">
              <UserPlus className="h-7 w-7" strokeWidth={1.5} />
            </div>
            <DialogTitle className="text-xl font-medium tracking-tighter text-grey-900">
              Buat Akun Asisten Baru
            </DialogTitle>
            <DialogDescription className="font-secondary text-sm leading-relaxed tracking-tight text-grey-500">
              Password otomatis menggunakan NIM. Asisten wajib mengganti
              password saat pertama login.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-6 space-y-4">
            <div>
              <label className="mb-1.5 block font-secondary text-xs font-medium tracking-tight text-grey-700">
                NIM
              </label>
              <Input
                {...register("nim")}
                placeholder="cth. mbclab_admin"
                className="bg-white/50 backdrop-blur-md border-white/40 font-medium tracking-tight"
              />
              {errors.nim && (
                <p className="mt-1 text-xs font-medium tracking-tight text-error">
                  {errors.nim.message}
                </p>
              )}
            </div>

            <div>
              <label className="mb-1.5 block font-secondary text-xs font-medium tracking-tight text-grey-700">
                Nama Lengkap
              </label>
              <Input
                {...register("name")}
                placeholder="cth. Admin Utama"
                className="bg-white/50 backdrop-blur-md border-white/40 font-medium tracking-tight"
              />
              {errors.name && (
                <p className="mt-1 text-xs font-medium tracking-tight text-error">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div>
              <label className="mb-1.5 block font-secondary text-xs font-medium tracking-tight text-grey-700">
                Divisi
              </label>
              <Controller
                control={control}
                name="division"
                render={({ field }) => (
                  <FilterDropdown<string>
                    value={field.value || "PRACTICUM"}
                    options={DIVISION_FORM_OPTIONS}
                    onChange={field.onChange}
                    widthClassName="w-full"
                    hideCheckIcon={true}
                  />
                )}
              />
              {errors.division && (
                <p className="mt-1 text-xs font-medium tracking-tight text-error">
                  {errors.division.message}
                </p>
              )}
            </div>

            {errors.root?.serverError && (
              <div className="rounded-2xl border border-error/15 bg-error/5 px-4 py-3 font-secondary text-sm font-medium tracking-tight text-error backdrop-blur-md">
                {errors.root.serverError.message}
              </div>
            )}
          </div>

          <DialogFooter className="mt-7 flex-col-reverse gap-3 sm:flex-row">
            <DialogClose asChild>
              <Button
                type="button"
                variant="outline"
                className="w-full sm:w-auto font-medium tracking-tight border-white/60 bg-white/50 backdrop-blur-md hover:bg-white/80"
              >
                Batal
              </Button>
            </DialogClose>
            <Button
              type="submit"
              disabled={isPending}
              className="w-full sm:w-auto font-medium tracking-tight rounded-xl shadow-lg"
            >
              {isPending ? "Menyimpan..." : "Buat Akun"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
