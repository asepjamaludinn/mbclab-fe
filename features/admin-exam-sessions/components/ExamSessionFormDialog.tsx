"use client";

import { useEffect, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarClock } from "lucide-react";
import axios from "axios";
import {
  examSessionFormSchema,
  ExamSessionFormData,
} from "../schemas/admin-exam-session.schema";
import {
  useCreateExamSession,
  useUpdateExamSession,
} from "../hooks/use-admin-exam-sessions";
import { AdminExamSession } from "../types/admin-exam-session.type";
import { SHIFT_OPTIONS } from "../constants/admin-exam-session.constant";
import { useStudentModules } from "@/features/student-modules";
import { useAdminGroups } from "@/features/admin-groups/hooks/use-admin-groups";
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

type ExamSessionFormDialogProps = {
  session: AdminExamSession | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

function toDateInputValue(iso: string) {
  return iso.slice(0, 10);
}

function toTimeInputValue(iso: string) {
  return new Date(iso).toTimeString().slice(0, 5);
}

export function ExamSessionFormDialog({
  session,
  open,
  onOpenChange,
}: ExamSessionFormDialogProps) {
  const isEditing = !!session;

  const { data: modulesRes } = useStudentModules(1, 50);
  const modules = modulesRes?.data ?? [];
  const moduleOptions = useMemo(
    () => [
      { value: "", label: "Pilih modul..." },
      ...modules.map((m) => ({
        value: m.id,
        label: `Modul ${m.order} — ${m.title}`,
      })),
    ],
    [modules],
  );

  const { data: groupsRes } = useAdminGroups({ page: 1, limit: 200 });
  const groups = groupsRes?.data ?? [];
  const groupOptions = useMemo(
    () => [
      { value: "", label: "Pilih kelompok..." },
      ...groups.map((g) => ({
        value: g.id,
        label: g.name,
      })),
    ],
    [groups],
  );

  const { mutateAsync: createSession, isPending: isCreating } =
    useCreateExamSession();
  const { mutateAsync: updateSession, isPending: isUpdating } =
    useUpdateExamSession();
  const isPending = isCreating || isUpdating;

  const {
    register,
    handleSubmit,
    control,
    reset,
    setError,
    formState: { errors },
  } = useForm<ExamSessionFormData>({
    resolver: zodResolver(examSessionFormSchema),
  });

  useEffect(() => {
    if (!open) return;

    if (session) {
      reset({
        moduleId: session.moduleId,
        groupId: session.groupId,
        date: toDateInputValue(session.date),
        shift: session.shift,
        startTime: toTimeInputValue(session.startTime),
        endTime: toTimeInputValue(session.endTime),
        accessCode: "",
      });
    } else {
      reset({
        moduleId: "",
        groupId: "",
        date: "",
        shift: "SHIFT_1",
        startTime: "",
        endTime: "",
        accessCode: "",
      });
    }
  }, [open, session, reset]);

  const onSubmit = async (data: ExamSessionFormData) => {
    const startTime = new Date(
      `${data.date}T${data.startTime}:00`,
    ).toISOString();
    const endTime = new Date(`${data.date}T${data.endTime}:00`).toISOString();

    const basePayload = {
      moduleId: data.moduleId,
      groupId: data.groupId,
      date: data.date,
      shift: data.shift,
      startTime,
      endTime,
    };

    try {
      if (isEditing) {
        await updateSession({
          id: session!.id,
          payload: {
            ...basePayload,
            ...(data.accessCode ? { accessCode: data.accessCode } : {}),
          },
        });
      } else {
        await createSession({ ...basePayload, accessCode: data.accessCode });
      }
      onOpenChange(false);
    } catch (error: unknown) {
      const message = axios.isAxiosError(error)
        ? error.response?.data?.message || "Gagal menyimpan sesi ujian."
        : "Gagal menyimpan sesi ujian.";
      setError("root.serverError", {
        type: "server",
        message: Array.isArray(message) ? message[0] : message,
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg w-[calc(100%-2rem)] rounded-[32px] border border-white/50 bg-white/70 p-6 shadow-[0_24px_60px_-15px_rgba(0,0,0,0.1)] backdrop-blur-3xl">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader className="text-left">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/90 text-white shadow-xl shadow-primary/20 backdrop-blur-md">
              <CalendarClock className="h-7 w-7" strokeWidth={1.5} />
            </div>
            <DialogTitle className="text-xl font-medium tracking-tighter text-grey-900">
              {isEditing ? "Ubah Sesi Ujian" : "Buat Sesi Ujian"}
            </DialogTitle>
            <DialogDescription className="font-secondary text-sm leading-relaxed tracking-tight text-grey-500">
              {isEditing
                ? "Kosongkan Kode Akses jika tidak ingin menggantinya."
                : "Satu kelompok hanya bisa memiliki satu sesi per tanggal & shift."}
            </DialogDescription>
          </DialogHeader>

          <div className="mt-6 max-h-[60vh] space-y-4 overflow-y-auto pr-1 custom-scrollbar">
            <div>
              <label className="mb-1.5 block font-secondary text-xs font-medium tracking-tight text-grey-700">
                Modul Praktikum
              </label>
              <Controller
                control={control}
                name="moduleId"
                render={({ field }) => (
                  <FilterDropdown<string>
                    value={field.value}
                    options={moduleOptions}
                    onChange={field.onChange}
                    widthClassName="w-full"
                    hideCheckIcon={true}
                  />
                )}
              />
              {errors.moduleId && (
                <p className="mt-1 text-xs font-medium tracking-tight text-error">
                  {errors.moduleId.message}
                </p>
              )}
            </div>

            <div>
              <label className="mb-1.5 block font-secondary text-xs font-medium tracking-tight text-grey-700">
                Kelompok
              </label>
              <Controller
                control={control}
                name="groupId"
                render={({ field }) => (
                  <FilterDropdown<string>
                    value={field.value}
                    options={groupOptions}
                    onChange={field.onChange}
                    widthClassName="w-full"
                    hideCheckIcon={true}
                  />
                )}
              />
              {errors.groupId && (
                <p className="mt-1 text-xs font-medium tracking-tight text-error">
                  {errors.groupId.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1.5 block font-secondary text-xs font-medium tracking-tight text-grey-700">
                  Tanggal
                </label>
                <Input
                  type="date"
                  {...register("date")}
                  className="bg-white/50 backdrop-blur-md border-white/40"
                />
                {errors.date && (
                  <p className="mt-1 text-xs font-medium tracking-tight text-error">
                    {errors.date.message}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-1.5 block font-secondary text-xs font-medium tracking-tight text-grey-700">
                  Shift
                </label>
                <Controller
                  control={control}
                  name="shift"
                  render={({ field }) => (
                    <FilterDropdown<string>
                      value={field.value}
                      options={SHIFT_OPTIONS as any}
                      onChange={field.onChange}
                      widthClassName="w-full"
                      hideCheckIcon={true}
                    />
                  )}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1.5 block font-secondary text-xs font-medium tracking-tight text-grey-700">
                  Waktu Mulai
                </label>
                <Input
                  type="time"
                  {...register("startTime")}
                  className="bg-white/50 backdrop-blur-md border-white/40"
                />
                {errors.startTime && (
                  <p className="mt-1 text-xs font-medium tracking-tight text-error">
                    {errors.startTime.message}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-1.5 block font-secondary text-xs font-medium tracking-tight text-grey-700">
                  Waktu Selesai
                </label>
                <Input
                  type="time"
                  {...register("endTime")}
                  className="bg-white/50 backdrop-blur-md border-white/40"
                />
                {errors.endTime && (
                  <p className="mt-1 text-xs font-medium tracking-tight text-error">
                    {errors.endTime.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="mb-1.5 block font-secondary text-xs font-medium tracking-tight text-grey-700">
                Kode Akses {isEditing && "(opsional)"}
              </label>
              <Input
                {...register("accessCode")}
                className="bg-white/50 backdrop-blur-md border-white/40 font-mono tracking-wider"
                placeholder={
                  isEditing
                    ? "Biarkan kosong jika tidak diubah"
                    : "cth. MBCLAB123"
                }
              />
              {errors.accessCode && (
                <p className="mt-1 text-xs font-medium tracking-tight text-error">
                  {errors.accessCode.message}
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
              {isPending ? "Menyimpan..." : "Simpan Sesi"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
