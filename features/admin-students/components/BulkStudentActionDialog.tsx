"use client";

import { useState } from "react";
import { ShieldOff, ShieldCheck, Trash2, AlertTriangle } from "lucide-react";
import axios from "axios";
import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/shared/components/ui/dialog";
import {
  useBulkDeactivateStudents,
  useBulkReactivateStudents,
  useBulkDeleteStudents,
} from "../hooks/use-admin-students";
import { AdminStudent, FailedStudentAction } from "../types/admin-student.type";

export type BulkStudentAction = "activate" | "deactivate" | "delete";

type BulkStudentActionDialogProps = {
  students: AdminStudent[];
  action: BulkStudentAction;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDone: () => void;
};

const PREVIEW_LIMIT = 5;

const ACTION_CONFIG: Record<
  BulkStudentAction,
  {
    icon: typeof ShieldOff;
    iconBg: string;
    title: (count: number) => string;
    description: string;
    confirmLabel: (count: number) => string;
    processingLabel: string;
    variant: "danger" | "default";
  }
> = {
  activate: {
    icon: ShieldCheck,
    iconBg: "bg-success/90 shadow-success/20",
    title: (count) => `Aktifkan ${count} Praktikan?`,
    description: "Akun yang diaktifkan kembali dapat login seperti biasa.",
    confirmLabel: (count) => `Ya, Aktifkan ${count} Praktikan`,
    processingLabel: "Mengaktifkan...",
    variant: "default",
  },
  deactivate: {
    icon: ShieldOff,
    iconBg: "bg-error/90 shadow-error/20",
    title: (count) => `Nonaktifkan ${count} Praktikan?`,
    description:
      "Akun yang dinonaktifkan tidak akan bisa login sampai diaktifkan kembali.",
    confirmLabel: (count) => `Ya, Nonaktifkan ${count} Praktikan`,
    processingLabel: "Menonaktifkan...",
    variant: "danger",
  },
  delete: {
    icon: Trash2,
    iconBg: "bg-error/90 shadow-error/20",
    title: (count) => `Hapus Permanen ${count} Praktikan?`,
    description:
      "Akun yang memiliki riwayat ujian, pengumpulan TP, atau nilai akan dilewati — gunakan nonaktifkan sebagai gantinya untuk akun tersebut.",
    confirmLabel: (count) => `Ya, Hapus ${count} Praktikan`,
    processingLabel: "Menghapus...",
    variant: "danger",
  },
};

export function BulkStudentActionDialog({
  students,
  action,
  open,
  onOpenChange,
  onDone,
}: BulkStudentActionDialogProps) {
  const { mutateAsync: bulkDeactivate, isPending: isDeactivating } =
    useBulkDeactivateStudents();
  const { mutateAsync: bulkReactivate, isPending: isReactivating } =
    useBulkReactivateStudents();
  const { mutateAsync: bulkDelete, isPending: isDeleting } =
    useBulkDeleteStudents();

  const [error, setError] = useState("");
  const [failedStudents, setFailedStudents] = useState<
    FailedStudentAction[] | null
  >(null);

  const config = ACTION_CONFIG[action];
  const Icon = config.icon;
  const isPending = isDeactivating || isReactivating || isDeleting;

  const previewNames = students.slice(0, PREVIEW_LIMIT).map((s) => s.name);
  const remainingCount = students.length - previewNames.length;

  const handleConfirm = async () => {
    if (students.length === 0) return;
    setError("");
    setFailedStudents(null);

    const studentIds = students.map((s) => s.id);

    try {
      const result =
        action === "activate"
          ? await bulkReactivate(studentIds)
          : action === "deactivate"
            ? await bulkDeactivate(studentIds)
            : await bulkDelete(studentIds);

      onDone();

      if (result.failedCount > 0) {
        setFailedStudents(result.failedStudents);
        return;
      }

      onOpenChange(false);
    } catch (err: unknown) {
      setError(
        axios.isAxiosError(err)
          ? err.response?.data?.message || "Gagal memproses aksi massal."
          : "Gagal memproses aksi massal.",
      );
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        onOpenChange(o);
        if (!o) {
          setError("");
          setFailedStudents(null);
        }
      }}
    >
      <DialogContent className="sm:max-w-md w-[calc(100%-2rem)] rounded-[32px] border border-white/50 bg-white/70 p-6 shadow-[0_24px_60px_-15px_rgba(0,0,0,0.1)] backdrop-blur-3xl">
        <DialogHeader className="text-left">
          <div
            className={`mb-4 flex h-14 w-14 items-center justify-center rounded-full text-white shadow-xl backdrop-blur-md ${config.iconBg}`}
          >
            <Icon className="h-7 w-7" strokeWidth={1.5} />
          </div>
          <DialogTitle className="text-xl font-medium tracking-tighter text-grey-900">
            {config.title(students.length)}
          </DialogTitle>
          <DialogDescription className="font-secondary text-sm leading-relaxed tracking-tight text-grey-500">
            {config.description}
          </DialogDescription>
        </DialogHeader>

        {previewNames.length > 0 && !failedStudents && (
          <ul className="mt-4 max-h-40 space-y-1.5 overflow-y-auto rounded-2xl border border-white/40 bg-white/30 backdrop-blur-md p-3 shadow-sm custom-scrollbar">
            {previewNames.map((name, idx) => (
              <li
                key={idx}
                className="truncate font-secondary text-xs font-medium tracking-tight text-grey-700"
              >
                {name}
              </li>
            ))}
            {remainingCount > 0 && (
              <li className="font-secondary text-xs font-medium tracking-tight text-grey-400">
                +{remainingCount} praktikan lainnya
              </li>
            )}
          </ul>
        )}

        {failedStudents && failedStudents.length > 0 && (
          <div className="mt-4 rounded-2xl border border-warning/20 bg-warning/5 p-4 backdrop-blur-md">
            <div className="flex items-start gap-2.5">
              <AlertTriangle
                className="mt-0.5 h-4 w-4 shrink-0 text-warning-700"
                strokeWidth={1.5}
              />
              <div className="min-w-0 flex-1">
                <p className="font-secondary text-sm font-medium tracking-tight text-warning-700">
                  {failedStudents.length} praktikan gagal diproses
                </p>
                <ul className="mt-3 space-y-1.5 custom-scrollbar">
                  {failedStudents.map((s) => (
                    <li
                      key={s.id}
                      className="rounded-xl border border-white/40 bg-white/50 backdrop-blur-md px-3 py-2 font-secondary text-xs"
                    >
                      <span className="font-medium tracking-tight text-grey-900">
                        {s.name}
                        {s.nim !== "-" && (
                          <span className="font-normal text-grey-500">
                            {" "}
                            ({s.nim})
                          </span>
                        )}
                      </span>
                      <p className="mt-0.5 text-warning-700/90">{s.reason}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="mt-3 rounded-2xl border border-error/15 bg-error/5 px-4 py-3 font-secondary text-sm font-medium tracking-tight text-error backdrop-blur-md">
            {error}
          </div>
        )}

        <DialogFooter className="mt-7 flex-col-reverse gap-3 sm:flex-row">
          <DialogClose asChild>
            <Button
              type="button"
              variant="outline"
              className="w-full sm:w-auto font-medium tracking-tight border-white/60 bg-white/50 backdrop-blur-md hover:bg-white/80"
            >
              {failedStudents ? "Tutup" : "Batal"}
            </Button>
          </DialogClose>
          {!failedStudents && (
            <Button
              variant={config.variant}
              onClick={handleConfirm}
              disabled={isPending || students.length === 0}
              className={`w-full sm:w-auto font-medium tracking-tight rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 ${
                config.variant === "danger"
                  ? "bg-error hover:bg-error/90 hover:shadow-error/20 text-white"
                  : ""
              }`}
            >
              {isPending
                ? config.processingLabel
                : config.confirmLabel(students.length)}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
