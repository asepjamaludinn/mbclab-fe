"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
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
  const { data: groupsRes } = useAdminGroups(1, 200);
  const groups = groupsRes?.data ?? [];

  const { mutateAsync: createSession, isPending: isCreating } =
    useCreateExamSession();
  const { mutateAsync: updateSession, isPending: isUpdating } =
    useUpdateExamSession();
  const isPending = isCreating || isUpdating;

  const {
    register,
    handleSubmit,
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
      <DialogContent className="sm:max-w-lg w-[calc(100%-2rem)] rounded-[28px] border border-grey-200 bg-white p-6 shadow-[0_24px_60px_-30px_rgba(0,0,0,0.18)]">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader className="text-left">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-[0_12px_28px_-14px_rgba(0,101,176,0.65)]">
              <CalendarClock className="h-7 w-7" strokeWidth={1.8} />
            </div>
            <DialogTitle>
              {isEditing ? "Ubah Sesi Ujian" : "Buat Sesi Ujian"}
            </DialogTitle>
            <DialogDescription>
              {isEditing
                ? "Kosongkan Kode Akses jika tidak ingin menggantinya."
                : "Satu kelompok hanya bisa memiliki satu sesi per tanggal & shift."}
            </DialogDescription>
          </DialogHeader>

          <div className="mt-6 max-h-[60vh] space-y-4 overflow-y-auto pr-1">
            <div>
              <label className="mb-1.5 block font-secondary text-xs font-bold text-grey-700">
                Modul Praktikum
              </label>
              <select
                {...register("moduleId")}
                className="h-11 w-full rounded-xl border border-grey-200 bg-grey-50 px-3.5 text-sm text-grey-900 focus:border-primary focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/10"
              >
                <option value="">Pilih modul...</option>
                {modules.map((m) => (
                  <option key={m.id} value={m.id}>
                    Modul {m.order} — {m.title}
                  </option>
                ))}
              </select>
              {errors.moduleId && (
                <p className="mt-1 text-xs font-medium text-error">
                  {errors.moduleId.message}
                </p>
              )}
            </div>

            <div>
              <label className="mb-1.5 block font-secondary text-xs font-bold text-grey-700">
                Kelompok
              </label>
              <select
                {...register("groupId")}
                className="h-11 w-full rounded-xl border border-grey-200 bg-grey-50 px-3.5 text-sm text-grey-900 focus:border-primary focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/10"
              >
                <option value="">Pilih kelompok...</option>
                {groups.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.name}
                  </option>
                ))}
              </select>
              {errors.groupId && (
                <p className="mt-1 text-xs font-medium text-error">
                  {errors.groupId.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1.5 block font-secondary text-xs font-bold text-grey-700">
                  Tanggal
                </label>
                <Input type="date" {...register("date")} />
                {errors.date && (
                  <p className="mt-1 text-xs font-medium text-error">
                    {errors.date.message}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-1.5 block font-secondary text-xs font-bold text-grey-700">
                  Shift
                </label>
                <select
                  {...register("shift")}
                  className="h-11 w-full rounded-xl border border-grey-200 bg-grey-50 px-3.5 text-sm text-grey-900 focus:border-primary focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/10"
                >
                  {SHIFT_OPTIONS.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1.5 block font-secondary text-xs font-bold text-grey-700">
                  Waktu Mulai
                </label>
                <Input type="time" {...register("startTime")} />
                {errors.startTime && (
                  <p className="mt-1 text-xs font-medium text-error">
                    {errors.startTime.message}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-1.5 block font-secondary text-xs font-bold text-grey-700">
                  Waktu Selesai
                </label>
                <Input type="time" {...register("endTime")} />
                {errors.endTime && (
                  <p className="mt-1 text-xs font-medium text-error">
                    {errors.endTime.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="mb-1.5 block font-secondary text-xs font-bold text-grey-700">
                Kode Akses {isEditing && "(opsional)"}
              </label>
              <Input
                {...register("accessCode")}
                placeholder={
                  isEditing
                    ? "Biarkan kosong jika tidak diubah"
                    : "cth. MBCLAB123"
                }
              />
              {errors.accessCode && (
                <p className="mt-1 text-xs font-medium text-error">
                  {errors.accessCode.message}
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
              {isPending ? "Menyimpan..." : "Simpan Sesi"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
