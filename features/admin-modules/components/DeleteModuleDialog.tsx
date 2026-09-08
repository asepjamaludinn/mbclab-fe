"use client";

import { AlertTriangle } from "lucide-react";
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
import { useDeleteModule } from "../hooks/use-admin-modules";
import { AdminModule } from "../types/admin-module.type";

type DeleteModuleDialogProps = {
  module: AdminModule | null;
  onOpenChange: (open: boolean) => void;
};

export function DeleteModuleDialog({
  module,
  onOpenChange,
}: DeleteModuleDialogProps) {
  const { mutateAsync: deleteModule, isPending } = useDeleteModule();

  const handleDelete = async () => {
    if (!module) return;
    await deleteModule(module.id);
    onOpenChange(false);
  };

  return (
    <Dialog open={!!module} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md w-[calc(100%-2rem)] rounded-[32px] border border-white/50 bg-white/70 p-6 shadow-[0_24px_60px_-15px_rgba(0,0,0,0.1)] backdrop-blur-3xl">
        <DialogHeader className="text-left">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-error/90 text-white shadow-xl shadow-error/20 backdrop-blur-md">
            <AlertTriangle className="h-7 w-7" strokeWidth={1.5} />
          </div>
          <DialogTitle className="text-xl font-medium tracking-tighter text-grey-900">
            Hapus Modul?
          </DialogTitle>
          <DialogDescription className="font-secondary text-sm leading-relaxed tracking-tight text-grey-500">
            Modul{" "}
            <span className="font-medium text-grey-700">{module?.title}</span>{" "}
            beserta seluruh soal dan data terkait akan dihapus permanen.
            Tindakan ini tidak dapat dibatalkan.
          </DialogDescription>
        </DialogHeader>

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
            variant="danger"
            onClick={handleDelete}
            disabled={isPending}
            className="w-full sm:w-auto font-medium tracking-tight rounded-xl shadow-lg"
          >
            {isPending ? "Menghapus..." : "Ya, Hapus"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
