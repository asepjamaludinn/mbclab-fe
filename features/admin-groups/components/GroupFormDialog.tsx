"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UsersRound } from "lucide-react";
import axios from "axios";
import { groupFormSchema, GroupFormData } from "../schemas/admin-group.schema";
import { useCreateGroup, useUpdateGroup } from "../hooks/use-admin-groups";
import { AdminGroup } from "../types/admin-group.type";
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

type GroupFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  group?: AdminGroup | null;
};

export function GroupFormDialog({
  open,
  onOpenChange,
  group = null,
}: GroupFormDialogProps) {
  const isEditMode = !!group;

  const { mutateAsync: createGroup, isPending: isCreating } = useCreateGroup();
  const { mutateAsync: updateGroup, isPending: isUpdating } = useUpdateGroup();
  const isPending = isCreating || isUpdating;

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<GroupFormData>({ resolver: zodResolver(groupFormSchema) });

  useEffect(() => {
    if (open) reset({ name: group?.name ?? "" });
  }, [open, group, reset]);

  const onSubmit = async (data: GroupFormData) => {
    try {
      if (isEditMode && group) {
        await updateGroup({ id: group.id, name: data.name });
      } else {
        await createGroup(data.name);
      }
      onOpenChange(false);
    } catch (error: unknown) {
      const message = axios.isAxiosError(error)
        ? error.response?.data?.message ||
          (isEditMode
            ? "Gagal mengubah nama kelompok."
            : "Gagal membuat kelompok.")
        : isEditMode
          ? "Gagal mengubah nama kelompok."
          : "Gagal membuat kelompok.";
      setError("root.serverError", {
        type: "server",
        message: Array.isArray(message) ? message[0] : message,
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md w-[calc(100%-2rem)] rounded-[28px] border border-grey-200 bg-white p-6 shadow-[0_24px_60px_-30px_rgba(0,0,0,0.18)]">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader className="text-left">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-[0_12px_28px_-14px_rgba(0,101,176,0.65)]">
              <UsersRound className="h-7 w-7" strokeWidth={1.8} />
            </div>
            <DialogTitle>
              {isEditMode ? "Ubah Nama Kelompok" : "Buat Kelompok"}
            </DialogTitle>
            <DialogDescription>
              {isEditMode
                ? "Perbarui nama kelompok ini. Anggota yang sudah terdaftar tidak akan berubah."
                : "Kelompok baru dapat langsung diisi anggota setelah dibuat."}
            </DialogDescription>
          </DialogHeader>

          <div className="mt-6">
            <label className="mb-1.5 block font-secondary text-xs font-bold text-grey-700">
              Nama Kelompok
            </label>
            <Input {...register("name")} placeholder="cth. Kelompok 1" />
            {errors.name && (
              <p className="mt-1 text-xs font-medium text-error">
                {errors.name.message}
              </p>
            )}

            {errors.root?.serverError && (
              <div className="mt-3 rounded-2xl border border-error/15 bg-error/5 px-4 py-3 font-secondary text-sm text-error">
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
              {isPending
                ? "Menyimpan..."
                : isEditMode
                  ? "Simpan Perubahan"
                  : "Buat Kelompok"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
