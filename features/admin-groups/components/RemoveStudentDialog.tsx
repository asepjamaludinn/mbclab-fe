"use client";

import { useEffect, useState } from "react";
import { UserMinus } from "lucide-react";
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
import { useRemoveStudent } from "../hooks/use-admin-groups";
import { GroupStudent } from "../types/admin-group.type";

type RemoveStudentDialogProps = {
  groupId: string;
  student: GroupStudent | null;
  onOpenChange: (open: boolean) => void;
};

export function RemoveStudentDialog({
  groupId,
  student,
  onOpenChange,
}: RemoveStudentDialogProps) {
  const { mutateAsync: removeStudent, isPending } = useRemoveStudent(groupId);
  const [error, setError] = useState("");

  useEffect(() => {
    setError("");
  }, [student?.id]);

  const handleRemove = async () => {
    if (!student) return;
    setError("");

    try {
      await removeStudent(student.nim);
      onOpenChange(false);
    } catch (err: unknown) {
      setError(
        axios.isAxiosError(err)
          ? err.response?.data?.message || "Gagal mengeluarkan anggota."
          : "Gagal mengeluarkan anggota.",
      );
    }
  };

  return (
    <Dialog
      open={!!student}
      onOpenChange={(o) => {
        onOpenChange(o);
        if (!o) setError("");
      }}
    >
      <DialogContent className="sm:max-w-sm w-[calc(100%-2rem)] rounded-[28px] border border-grey-200 bg-white p-6 shadow-[0_24px_60px_-30px_rgba(0,0,0,0.18)]">
        <DialogHeader className="text-left">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-warning text-white shadow-[0_12px_28px_-14px_rgba(217,119,6,0.5)]">
            <UserMinus className="h-7 w-7" strokeWidth={1.8} />
          </div>
          <DialogTitle>Keluarkan Anggota?</DialogTitle>
          <DialogDescription>
            <strong>{student?.name}</strong> ({student?.nim}) akan dikeluarkan
            dari kelompok ini.
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="mt-2 rounded-2xl border border-error/15 bg-error/5 px-4 py-3 font-secondary text-sm text-error">
            {error}
          </div>
        )}

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
            variant="danger"
            onClick={handleRemove}
            disabled={isPending}
            className="w-full sm:w-auto"
          >
            {isPending ? "Memproses..." : "Ya, Keluarkan"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
