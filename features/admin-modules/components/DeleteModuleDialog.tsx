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
      <DialogContent className="sm:max-w-md w-[calc(100%-2rem)] rounded-[28px] border border-grey-200 bg-white p-6 shadow-[0_24px_60px_-30px_rgba(0,0,0,0.18)]">
        <DialogHeader className="text-left">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-error text-white shadow-[0_12px_28px_-14px_rgba(220,38,38,0.65)]">
            <AlertTriangle className="h-7 w-7" strokeWidth={1.8} />
          </div>
          <DialogTitle>Hapus Modul?</DialogTitle>
          <DialogDescription>
            Modul <strong>{module?.title}</strong> beserta seluruh soal dan data
            terkait akan dihapus permanen. Tindakan ini tidak dapat dibatalkan.
          </DialogDescription>
        </DialogHeader>

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
            onClick={handleDelete}
            disabled={isPending}
            className="w-full sm:w-auto"
          >
            {isPending ? "Menghapus..." : "Ya, Hapus"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
