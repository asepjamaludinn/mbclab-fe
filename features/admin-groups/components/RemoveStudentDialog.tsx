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
      <DialogContent className="sm:max-w-sm w-[calc(100%-2rem)] rounded-[32px] border border-white/50 bg-white/70 p-6 shadow-[0_24px_60px_-15px_rgba(0,0,0,0.1)] backdrop-blur-3xl">
        <DialogHeader className="text-left">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-error text-white shadow-xl shadow-error/30 backdrop-blur-md">
            <UserMinus className="h-7 w-7" strokeWidth={1.5} />
          </div>
          <DialogTitle className="text-xl font-medium tracking-tighter text-grey-900">
            Keluarkan Anggota?
          </DialogTitle>
          <DialogDescription className="font-secondary text-sm leading-relaxed tracking-tight text-grey-500">
            <strong className="font-medium text-grey-800">
              {student?.name}
            </strong>{" "}
            ({student?.nim}) akan dikeluarkan dari kelompok ini.
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="mt-2 rounded-2xl border border-error/15 bg-error/5 px-4 py-3 font-secondary text-sm font-medium tracking-tight text-error backdrop-blur-md">
            {error}
          </div>
        )}

        <DialogFooter className="mt-7 flex-col-reverse gap-3 sm:flex-row">
          <DialogClose asChild>
            <Button
              type="button"
              variant="outline"
              className="w-full sm:w-auto font-medium tracking-tight border-white/60 bg-white/50 backdrop-blur-md transition-all duration-300 hover:bg-white/80 hover:shadow-sm"
            >
              Batal
            </Button>
          </DialogClose>
          <Button
            type="button"
            onClick={handleRemove}
            disabled={isPending}
            className="w-full sm:w-auto font-medium tracking-tight rounded-xl shadow-lg bg-error text-white border-transparent transition-all duration-300 hover:bg-error/90 hover:shadow-xl hover:shadow-error/20 hover:-translate-y-0.5 active:translate-y-0"
          >
            {isPending ? "Memproses..." : "Ya, Keluarkan"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
