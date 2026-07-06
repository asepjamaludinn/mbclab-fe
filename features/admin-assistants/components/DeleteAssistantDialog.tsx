"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
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
import { useDeleteAssistant } from "../hooks/use-admin-assistants";
import { AdminAssistantProfile } from "../types/admin-assistant.type";

type DeleteAssistantDialogProps = {
  assistant: AdminAssistantProfile | null;
  onOpenChange: (open: boolean) => void;
};

export function DeleteAssistantDialog({
  assistant,
  onOpenChange,
}: DeleteAssistantDialogProps) {
  const { mutateAsync: deleteAssistant, isPending } = useDeleteAssistant();
  const [error, setError] = useState("");

  const handleDelete = async () => {
    if (!assistant) return;
    setError("");
    try {
      await deleteAssistant(assistant.id);
      onOpenChange(false);
    } catch (err: unknown) {
      setError(
        axios.isAxiosError(err)
          ? err.response?.data?.message || "Gagal menghapus profil asisten."
          : "Gagal menghapus profil asisten.",
      );
    }
  };

  return (
    <Dialog open={!!assistant} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm w-[calc(100%-2rem)] rounded-[28px] border border-grey-200 bg-white p-6 shadow-[0_24px_60px_-30px_rgba(0,0,0,0.18)]">
        <DialogHeader className="text-left">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-error text-white shadow-[0_12px_28px_-14px_rgba(220,38,38,0.65)]">
            <Trash2 className="h-7 w-7" strokeWidth={1.8} />
          </div>
          <DialogTitle>Hapus Profil Asisten?</DialogTitle>
          <DialogDescription>
            Profil <strong>{assistant?.name}</strong> akan dihapus permanen dan
            langsung hilang dari halaman publik.
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
