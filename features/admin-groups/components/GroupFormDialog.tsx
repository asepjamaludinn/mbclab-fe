"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UsersRound } from "lucide-react";
import axios from "axios";
import { groupFormSchema, GroupFormData } from "../schemas/admin-group.schema";
import { useCreateGroup, useUpdateGroup } from "../hooks/use-admin-groups";
import { AdminGroup } from "../types/admin-group.type";
import {
  DAY_OF_WEEK_OPTIONS,
  WEEK_TYPE_OPTIONS,
  SHIFT_SCHEDULE_OPTIONS,
} from "@/shared/utils/schedule";
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
  group?: AdminGroup | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function GroupFormDialog({
  group,
  open,
  onOpenChange,
}: GroupFormDialogProps) {
  const isEditing = !!group;

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
    if (!open) return;

    reset({
      name: group?.name ?? "",
      day: group?.day ?? "",
      weekType: group?.weekType ?? "",
      shift: group?.shift ?? "",
    });
  }, [open, group, reset]);

  const onSubmit = async (data: GroupFormData) => {
    const payload = {
      name: data.name,
      day: data.day === "" ? undefined : data.day,
      weekType: data.weekType === "" ? undefined : data.weekType,
      shift: data.shift === "" ? undefined : data.shift,
    };

    try {
      if (isEditing && group) {
        await updateGroup({ id: group.id, payload });
      } else {
        await createGroup(payload);
      }
      onOpenChange(false);
    } catch (error: unknown) {
      const message = axios.isAxiosError(error)
        ? error.response?.data?.message ||
          `Gagal ${isEditing ? "menyimpan perubahan" : "membuat"} kelompok.`
        : `Gagal ${isEditing ? "menyimpan perubahan" : "membuat"} kelompok.`;
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
              {isEditing ? "Ubah Kelompok" : "Buat Kelompok"}
            </DialogTitle>
            <DialogDescription>
              Jadwal praktikum (Hari, Minggu, Shift) jadwal akan otomatis tampil
              di Dashboard tiap anggota kelompok
            </DialogDescription>
          </DialogHeader>

          <div className="mt-6 space-y-4">
            <div>
              <label className="mb-1.5 block font-secondary text-xs font-bold text-grey-700">
                Nama Kelompok
              </label>
              <Input {...register("name")} placeholder="cth. Kelompok 1" />
              {errors.name && (
                <p className="mt-1 text-xs font-medium text-error">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className="rounded-2xl border border-grey-100 bg-grey-50/60 p-4">
              <p className="mb-3 font-secondary text-xs font-bold text-grey-700">
                Jadwal Praktikum Rutin
              </p>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div>
                  <label className="mb-1.5 block font-secondary text-[11px] font-bold text-grey-500">
                    Hari
                  </label>
                  <select
                    {...register("day")}
                    className="h-11 w-full rounded-xl border border-grey-200 bg-white px-3 text-sm text-grey-900 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10"
                  >
                    <option value="">Tidak diatur</option>
                    {DAY_OF_WEEK_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1.5 block font-secondary text-[11px] font-bold text-grey-500">
                    Minggu
                  </label>
                  <select
                    {...register("weekType")}
                    className="h-11 w-full rounded-xl border border-grey-200 bg-white px-3 text-sm text-grey-900 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10"
                  >
                    <option value="">Tidak diatur</option>
                    {WEEK_TYPE_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1.5 block font-secondary text-[11px] font-bold text-grey-500">
                    Shift
                  </label>
                  <select
                    {...register("shift")}
                    className="h-11 w-full rounded-xl border border-grey-200 bg-white px-3 text-sm text-grey-900 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10"
                  >
                    <option value="">Tidak diatur</option>
                    {SHIFT_SCHEDULE_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {errors.shift && (
                <p className="mt-2 text-xs font-medium text-error">
                  {errors.shift.message}
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
              {isPending
                ? "Menyimpan..."
                : isEditing
                  ? "Simpan Perubahan"
                  : "Buat Kelompok"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
