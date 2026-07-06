"use client";

import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  UserPlus,
  Plus,
  X,
  Search,
  CheckCircle2,
  AlertTriangle,
  ArrowRightLeft,
} from "lucide-react";
import axios from "axios";
import {
  assignStudentsSchema,
  AssignStudentsFormData,
} from "../schemas/admin-group.schema";
import {
  useAssignStudents,
  useUnassignedStudents,
} from "../hooks/use-admin-groups";
import {
  AssignStudentsConflict,
  GroupStudent,
} from "../types/admin-group.type";
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

type AssignStudentsDialogProps = {
  groupId: string;
  existingStudents: GroupStudent[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

type AssignResult = {
  assignedCount: number;
  failedNims: string[];
};

type PendingConfirmation = {
  studentNims: string[];
  conflicts: AssignStudentsConflict[];
};

// Total anggota (yang sudah ada + slot kosong) yang ditampilkan secara default.
const DEFAULT_TOTAL_SLOTS = 4;
// Batas maksimal total anggota per kelompok (sudah ada + baru).
const MAX_TOTAL_SLOTS = 5;

const emptySlots = (count: number) =>
  Array.from({ length: Math.max(count, 0) }, () => ({ value: "" }));

/**
 * Menghitung berapa slot kosong yang perlu ditampilkan saat dialog dibuka,
 * berdasarkan jumlah anggota yang sudah ada di kelompok.
 *
 * Contoh:
 * - existingCount = 0 -> 4 slot kosong (Anggota 1-4)
 * - existingCount = 2 -> 2 slot kosong (Anggota 3-4)
 * - existingCount = 4 -> 1 slot kosong (Anggota 5), karena default (4) sudah
 *   terpenuhi oleh anggota yang ada, tapi tetap sediakan 1 slot untuk diisi
 * - existingCount = 5 (atau lebih) -> 0 slot kosong, kelompok sudah penuh
 */
const computeInitialEditableSlots = (existingCount: number) => {
  const remainingCapacity = Math.max(MAX_TOTAL_SLOTS - existingCount, 0);
  if (remainingCapacity === 0) return 0;

  const desiredDefault = DEFAULT_TOTAL_SLOTS - existingCount;
  return Math.min(Math.max(desiredDefault, 1), remainingCapacity);
};

export function AssignStudentsDialog({
  groupId,
  existingStudents,
  open,
  onOpenChange,
}: AssignStudentsDialogProps) {
  const { mutateAsync: assignStudents, isPending } = useAssignStudents(groupId);
  const [result, setResult] = useState<AssignResult | null>(null);
  const [pendingConfirmation, setPendingConfirmation] =
    useState<PendingConfirmation | null>(null);

  const [studentSearch, setStudentSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(studentSearch.trim());
    }, 300);
    return () => clearTimeout(timeout);
  }, [studentSearch]);

  const { data: suggestions = [], isFetching: isSearching } =
    useUnassignedStudents(debouncedSearch);

  const {
    register,
    control,
    handleSubmit,
    reset,
    getValues,
    setValue,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<AssignStudentsFormData>({
    resolver: zodResolver(assignStudentsSchema),
    defaultValues: {
      nims: emptySlots(computeInitialEditableSlots(existingStudents.length)),
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "nims",
  });

  useEffect(() => {
    if (open) {
      reset({
        nims: emptySlots(computeInitialEditableSlots(existingStudents.length)),
      });
      setResult(null);
      setPendingConfirmation(null);
      setStudentSearch("");
    }
    // existingStudents.length sengaja dijadikan dependency: saat dialog
    // dibuka kembali setelah anggota bertambah, jumlah slot kosong ikut
    // menyesuaikan (bukan selalu 4).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, existingStudents.length, reset]);

  const totalMembers = existingStudents.length + fields.length;
  const isGroupFull = totalMembers >= MAX_TOTAL_SLOTS;
  const isAtCapacity = existingStudents.length >= MAX_TOTAL_SLOTS;

  const handlePickStudent = (nim: string) => {
    const values = getValues("nims");
    const emptyIndex = values.findIndex((n) => !n.value.trim());

    if (emptyIndex >= 0) {
      setValue(`nims.${emptyIndex}.value`, nim);
    } else if (!isGroupFull) {
      append({ value: nim });
    }
    setStudentSearch("");
  };

  const runAssign = async (studentNims: string[], force: boolean) => {
    clearErrors("root");

    try {
      const res = await assignStudents({ studentNims, force });

      if (res.requiresConfirmation && res.conflicts) {
        setPendingConfirmation({ studentNims, conflicts: res.conflicts });
        return;
      }

      setPendingConfirmation(null);
      setResult({
        assignedCount: res.assignedCount,
        failedNims: res.failedNims ?? [],
      });
      // Tidak reset field di sini — biarkan NIM yang baru dimasukkan tetap
      // terlihat sebagai konfirmasi. Field akan menyesuaikan ulang saat
      // dialog ditutup lalu dibuka lagi (lihat useEffect di atas), karena
      // `existingStudents` akan bertambah setelah query di-invalidate.
    } catch (error: unknown) {
      const message = axios.isAxiosError(error)
        ? error.response?.data?.message || "Gagal menambahkan anggota."
        : "Gagal menambahkan anggota.";
      setError("root.serverError", {
        type: "server",
        message: Array.isArray(message) ? message[0] : message,
      });
    }
  };

  const onSubmit = async (data: AssignStudentsFormData) => {
    setResult(null);
    setPendingConfirmation(null);
    clearErrors("root");

    const studentNims = data.nims.map((n) => n.value.trim()).filter(Boolean);

    if (studentNims.length === 0) {
      setError("root.empty", {
        type: "validate",
        message: "Masukkan minimal satu NIM anggota.",
      });
      return;
    }

    await runAssign(studentNims, false);
  };

  const handleConfirmMove = async () => {
    if (!pendingConfirmation) return;
    await runAssign(pendingConfirmation.studentNims, true);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        onOpenChange(o);
        if (!o) {
          setResult(null);
          setPendingConfirmation(null);
        }
      }}
    >
      <DialogContent className="sm:max-w-lg w-[calc(100%-2rem)] rounded-[28px] border border-grey-200 bg-white p-6 shadow-[0_24px_60px_-30px_rgba(0,0,0,0.18)]">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader className="text-left">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-[0_12px_28px_-14px_rgba(0,101,176,0.65)]">
              <UserPlus className="h-7 w-7" strokeWidth={1.8} />
            </div>
            <DialogTitle>Tambah Anggota</DialogTitle>
            <DialogDescription>
              Masukkan NIM setiap mahasiswa, atau cari mahasiswa yang belum
              berkelompok di bawah ini. Maksimal {MAX_TOTAL_SLOTS} anggota per
              kelompok.
            </DialogDescription>
          </DialogHeader>

          {/* Result summary */}
          {result && (
            <div className="mt-4 space-y-2">
              <div className="flex items-start gap-2.5 rounded-2xl border border-success/15 bg-success/5 px-4 py-3 font-secondary text-sm text-success">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                <span>
                  {result.assignedCount} mahasiswa berhasil ditambahkan.
                </span>
              </div>
              {result.failedNims.length > 0 && (
                <div className="flex items-start gap-2.5 rounded-2xl border border-warning/15 bg-warning/5 px-4 py-3 font-secondary text-sm text-warning-700">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>
                    NIM tidak ditemukan / tidak valid:{" "}
                    <strong>{result.failedNims.join(", ")}</strong>
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Conflict confirmation panel */}
          {pendingConfirmation && (
            <div className="mt-4 rounded-2xl border border-warning/20 bg-warning/5 p-4">
              <div className="flex items-start gap-2.5">
                <ArrowRightLeft className="mt-0.5 h-4 w-4 shrink-0 text-warning-700" />
                <div className="min-w-0 flex-1">
                  <p className="font-secondary text-sm font-bold text-warning-700">
                    {pendingConfirmation.conflicts.length} mahasiswa sudah ada
                    di kelompok lain
                  </p>
                  <p className="mt-1 font-secondary text-xs text-warning-700/90">
                    Melanjutkan akan memindahkan mereka ke kelompok ini.
                  </p>

                  <ul className="mt-3 space-y-1.5">
                    {pendingConfirmation.conflicts.map((c) => (
                      <li
                        key={c.nim}
                        className="flex items-center justify-between gap-2 rounded-lg bg-white/70 px-3 py-2 font-secondary text-xs"
                      >
                        <span className="min-w-0 truncate font-semibold text-grey-900">
                          {c.name}{" "}
                          <span className="font-normal text-grey-500">
                            ({c.nim})
                          </span>
                        </span>
                        <span className="shrink-0 rounded-full bg-warning/15 px-2 py-0.5 font-bold text-warning-700">
                          dari {c.currentGroupName}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-4 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                    <Button
                      type="button"
                      variant="outline"
                      className="h-9 text-xs"
                      onClick={() => setPendingConfirmation(null)}
                    >
                      Batal
                    </Button>
                    <Button
                      type="button"
                      variant="danger"
                      className="h-9 text-xs"
                      disabled={isPending}
                      onClick={handleConfirmMove}
                    >
                      {isPending ? "Memindahkan..." : "Ya, Pindahkan Semua"}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Student search */}
          {!isAtCapacity && (
            <div className="relative mt-5">
              <div className="flex h-10 items-center rounded-xl border border-grey-200 bg-grey-50 px-3.5">
                <Search
                  className="mr-2 h-4 w-4 text-grey-400"
                  strokeWidth={2}
                />
                <input
                  value={studentSearch}
                  onChange={(e) => setStudentSearch(e.target.value)}
                  placeholder="Cari nama atau NIM mahasiswa belum berkelompok..."
                  className="flex-1 bg-transparent text-sm text-grey-900 placeholder:text-grey-400 focus:outline-none"
                />
              </div>

              {debouncedSearch.length >= 2 && (
                <div className="absolute z-10 mt-1.5 w-full overflow-hidden rounded-xl border border-grey-200 bg-white shadow-lg">
                  {isSearching ? (
                    <div className="px-4 py-3 font-secondary text-xs text-grey-400">
                      Mencari...
                    </div>
                  ) : suggestions.length === 0 ? (
                    <div className="px-4 py-3 font-secondary text-xs text-grey-400">
                      Tidak ada mahasiswa yang cocok.
                    </div>
                  ) : (
                    suggestions.map((s) => (
                      <button
                        type="button"
                        key={s.id}
                        onClick={() => handlePickStudent(s.nim)}
                        className="flex w-full items-center justify-between gap-2 px-4 py-2.5 text-left transition hover:bg-primary/5"
                      >
                        <span className="min-w-0">
                          <span className="block truncate text-xs font-semibold text-grey-900">
                            {s.name}
                          </span>
                          <span className="block font-secondary text-[11px] text-grey-500">
                            {s.nim}
                          </span>
                        </span>
                        <Plus className="h-3.5 w-3.5 shrink-0 text-primary" />
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>
          )}

          <div className="mt-4 max-h-[260px] space-y-2.5 overflow-y-auto pr-1">
            {/* Anggota yang sudah tergabung di kelompok ini — terkunci,
                tidak bisa dihapus/diubah dari dialog ini. Ditampilkan lebih
                dulu supaya penomoran "Anggota N" konsisten dengan slot
                input baru di bawahnya. */}
            {existingStudents.map((student, idx) => (
              <div key={student.id} className="flex items-center gap-2">
                <span className="w-[74px] shrink-0 font-secondary text-xs font-bold text-grey-500">
                  Anggota {idx + 1}
                </span>
                <div className="flex h-9 flex-1 items-center rounded-lg border border-grey-200 bg-grey-50 px-3">
                  <span className="truncate text-sm text-grey-500">
                    {student.name}{" "}
                    <span className="text-grey-400">({student.nim})</span>
                  </span>
                </div>
                {/* Spacer supaya lebar sejajar dengan tombol hapus di baris editable */}
                <div className="h-9 w-9 shrink-0" aria-hidden="true" />
              </div>
            ))}

            {/* Slot baru yang bisa diisi / dihapus */}
            {fields.map((field, index) => (
              <div key={field.id} className="flex items-center gap-2">
                <span className="w-[74px] shrink-0 font-secondary text-xs font-bold text-grey-500">
                  Anggota {existingStudents.length + index + 1}
                </span>
                <Input
                  {...register(`nims.${index}.value` as const)}
                  placeholder="cth. 1101210001"
                  className="flex-1"
                />
                {fields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-grey-400 transition hover:bg-error/10 hover:text-error"
                    aria-label={`Hapus baris anggota ${
                      existingStudents.length + index + 1
                    }`}
                  >
                    <X className="h-4 w-4" strokeWidth={2} />
                  </button>
                )}
              </div>
            ))}

            {isAtCapacity ? (
              <div className="flex items-start gap-2.5 rounded-2xl border border-grey-200 bg-grey-50 px-4 py-3 font-secondary text-xs text-grey-500">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-grey-400" />
                <span>
                  Kelompok ini sudah mencapai batas maksimal {MAX_TOTAL_SLOTS}{" "}
                  anggota.
                </span>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => append({ value: "" })}
                disabled={isGroupFull}
                className="mt-1 flex w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-grey-300 py-2.5 font-secondary text-xs font-bold text-primary transition hover:border-primary hover:bg-primary/5 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-grey-300 disabled:hover:bg-transparent"
              >
                <Plus className="h-3.5 w-3.5" strokeWidth={2.5} />
                {isGroupFull
                  ? `Maksimal ${MAX_TOTAL_SLOTS} anggota tercapai`
                  : "Tambah Anggota"}
              </button>
            )}

            {errors.root?.empty && (
              <div className="rounded-2xl border border-error/15 bg-error/5 px-4 py-3 font-secondary text-sm text-error">
                {errors.root.empty.message}
              </div>
            )}

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
                Tutup
              </Button>
            </DialogClose>
            <Button
              type="submit"
              disabled={isPending || !!pendingConfirmation || isAtCapacity}
              className="w-full sm:w-auto"
            >
              {isPending ? "Menambahkan..." : "Tambah Anggota"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
