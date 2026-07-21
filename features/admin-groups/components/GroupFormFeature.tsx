"use client";

import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UsersRound, ArrowLeft } from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { groupFormSchema, GroupFormData } from "../schemas/admin-group.schema";
import {
  useCreateGroup,
  useUpdateGroup,
  useAdminGroup,
} from "../hooks/use-admin-groups";
import {
  DAY_OF_WEEK_OPTIONS,
  WEEK_TYPE_OPTIONS,
  SHIFT_SCHEDULE_OPTIONS,
} from "@/shared/utils/schedule";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { FilterDropdown } from "@/shared/components/ui/filter-dropdown";

type GroupFormFeatureProps = {
  groupId?: string;
};

export function GroupFormFeature({ groupId }: GroupFormFeatureProps) {
  const router = useRouter();
  const isEditing = !!groupId;

  const { data: group, isLoading: isLoadingGroup } = useAdminGroup(
    groupId as string,
  );

  const { mutateAsync: createGroup, isPending: isCreating } = useCreateGroup();
  const { mutateAsync: updateGroup, isPending: isUpdating } = useUpdateGroup();
  const isPending = isCreating || isUpdating;

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    setError,
    formState: { errors },
  } = useForm<GroupFormData>({ resolver: zodResolver(groupFormSchema) });

  useEffect(() => {
    if (isEditing && group) {
      reset({
        name: group.name || "",
        day: group.day || "",
        weekType: group.weekType || "",
        shift: group.shift || "",
      });
    } else if (!isEditing) {
      reset({
        name: "",
        day: "",
        weekType: "",
        shift: "",
      });
    }
  }, [group, isEditing, reset]);

  const onSubmit = async (data: GroupFormData) => {
    const payload = {
      name: data.name,
      day: data.day === "" ? undefined : data.day,
      weekType: data.weekType === "" ? undefined : data.weekType,
      shift: data.shift === "" ? undefined : data.shift,
    };

    try {
      if (isEditing && groupId) {
        await updateGroup({ id: groupId, payload });
      } else {
        await createGroup(payload);
      }
      router.push("/admin/groups");
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

  if (isEditing && isLoadingGroup) {
    return (
      <div className="h-96 w-full animate-pulse rounded-[32px] border border-white/50 bg-white/40 backdrop-blur-md" />
    );
  }

  return (
    <div className="flex w-full flex-col gap-6 font-primary">
      {/* Back button */}
      <div>
        <Link
          href="/admin/groups"
          className="inline-flex items-center gap-1.5 font-secondary text-xs font-medium tracking-tight text-grey-500 transition-all hover:text-primary"
        >
          <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.5} />
          Kembali ke Daftar Kelompok
        </Link>
      </div>

      {/* PERBAIKAN DI SINI: Dihapus class 'overflow-hidden' agar dropdown tidak terpotong oleh batas box putih */}
      <div className="w-full rounded-[32px] border border-white/60 bg-white/60 p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-2xl">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-8 flex items-center gap-5 border-b border-white/50 pb-6">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-primary/10 bg-primary/10 text-primary backdrop-blur-md">
              <UsersRound className="h-7 w-7" strokeWidth={1.5} />
            </div>
            <div>
              <h1 className="text-2xl font-medium tracking-tighter text-grey-900">
                {isEditing ? "Ubah Kelompok" : "Buat Kelompok Baru"}
              </h1>
              <p className="mt-1 font-secondary text-sm tracking-tight text-grey-500">
                Lengkapi detail di bawah ini. Jadwal praktikum akan otomatis
                tampil di Dashboard tiap anggota kelompok yang bersangkutan.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className="mb-2 block font-secondary text-xs font-medium tracking-tight text-grey-700">
                Nama Kelompok
              </label>
              <Input
                {...register("name")}
                placeholder="cth. Kelompok 1"
                className="h-12 border-white/40 bg-white/50 font-medium tracking-tight backdrop-blur-md transition-all focus:border-primary/50 focus:bg-white sm:max-w-xl"
              />
              {errors.name && (
                <p className="mt-1.5 text-xs font-medium tracking-tight text-error">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className="rounded-[24px] border border-white/50 bg-white/30 p-6 shadow-sm backdrop-blur-md">
              <p className="mb-4 font-secondary text-sm font-medium tracking-tight text-grey-900">
                Jadwal Praktikum Rutin
              </p>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                <div>
                  <label className="mb-2 block font-secondary text-xs font-medium tracking-tight text-grey-500">
                    Hari
                  </label>
                  <Controller
                    control={control}
                    name="day"
                    render={({ field }) => (
                      <FilterDropdown<string>
                        value={field.value || ""}
                        options={[
                          { value: "", label: "Tidak diatur" },
                          ...DAY_OF_WEEK_OPTIONS,
                        ]}
                        onChange={field.onChange}
                        widthClassName="w-full"
                        hideCheckIcon={true}
                      />
                    )}
                  />
                </div>

                <div>
                  <label className="mb-2 block font-secondary text-xs font-medium tracking-tight text-grey-500">
                    Minggu
                  </label>
                  <Controller
                    control={control}
                    name="weekType"
                    render={({ field }) => (
                      <FilterDropdown<string>
                        value={field.value || ""}
                        options={[
                          { value: "", label: "Tidak diatur" },
                          ...WEEK_TYPE_OPTIONS,
                        ]}
                        onChange={field.onChange}
                        widthClassName="w-full"
                        hideCheckIcon={true}
                      />
                    )}
                  />
                </div>

                <div>
                  <label className="mb-2 block font-secondary text-xs font-medium tracking-tight text-grey-500">
                    Shift
                  </label>
                  <Controller
                    control={control}
                    name="shift"
                    render={({ field }) => (
                      <FilterDropdown<string>
                        value={field.value || ""}
                        options={[
                          { value: "", label: "Tidak diatur" },
                          ...SHIFT_SCHEDULE_OPTIONS,
                        ]}
                        onChange={field.onChange}
                        widthClassName="w-full"
                        hideCheckIcon={true}
                      />
                    )}
                  />
                </div>
              </div>

              {errors.shift && (
                <p className="mt-3 text-xs font-medium tracking-tight text-error">
                  {errors.shift.message}
                </p>
              )}
            </div>

            {errors.root?.serverError && (
              <div className="rounded-2xl border border-error/15 bg-error/5 px-4 py-3 font-secondary text-sm font-medium tracking-tight text-error backdrop-blur-md">
                {errors.root.serverError.message}
              </div>
            )}
          </div>

          <div className="mt-8 flex flex-col-reverse gap-3 border-t border-white/50 pt-6 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/admin/groups")}
              className="w-full border-white/60 bg-white/50 font-medium tracking-tight hover:bg-white/80 sm:w-auto sm:px-6"
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="w-full rounded-xl font-medium tracking-tight shadow-lg sm:w-auto sm:px-8"
            >
              {isPending
                ? "Menyimpan..."
                : isEditing
                  ? "Simpan Perubahan"
                  : "Buat Kelompok"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
