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

const DEFAULT_TOTAL_SLOTS = 4;
const MAX_TOTAL_SLOTS = 5;

const emptySlots = (count: number) =>
  Array.from({ length: Math.max(count, 0) }, () => ({ value: "" }));

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
      <DialogContent className="sm:max-w-lg w-[calc(100%-2rem)] rounded-[32px] border border-white/50 bg-white/70 p-6 shadow-[0_24px_60px_-15px_rgba(0,0,0,0.1)] backdrop-blur-3xl">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader className="text-left">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/90 text-white shadow-xl shadow-primary/20 backdrop-blur-md">
              <UserPlus className="h-7 w-7" strokeWidth={1.5} />
            </div>
            <DialogTitle className="text-xl font-medium tracking-tighter text-grey-900">
              Tambah Anggota
            </DialogTitle>
            <DialogDescription className="font-secondary text-sm leading-relaxed tracking-tight text-grey-500">
              Masukkan NIM setiap mahasiswa, atau cari mahasiswa yang belum
              berkelompok di bawah ini. Maksimal {MAX_TOTAL_SLOTS} anggota per
              kelompok.
            </DialogDescription>
          </DialogHeader>

          {/* Result summary */}
          {result && (
            <div className="mt-4 space-y-2">
              <div className="flex items-start gap-2.5 rounded-2xl border border-success/15 bg-success/5 px-4 py-3 font-secondary text-sm font-medium tracking-tight text-success backdrop-blur-md">
                <CheckCircle2
                  className="mt-0.5 h-4 w-4 shrink-0"
                  strokeWidth={1.5}
                />
                <span>
                  {result.assignedCount} mahasiswa berhasil ditambahkan.
                </span>
              </div>
              {result.failedNims.length > 0 && (
                <div className="flex items-start gap-2.5 rounded-2xl border border-warning/15 bg-warning/5 px-4 py-3 font-secondary text-sm font-medium tracking-tight text-warning-700 backdrop-blur-md">
                  <AlertTriangle
                    className="mt-0.5 h-4 w-4 shrink-0"
                    strokeWidth={1.5}
                  />
                  <span>
                    NIM tidak ditemukan / tidak valid:{" "}
                    <strong className="font-medium text-warning-800">
                      {result.failedNims.join(", ")}
                    </strong>
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Conflict confirmation panel */}
          {pendingConfirmation && (
            <div className="mt-4 rounded-2xl border border-warning/20 bg-warning/5 p-4 backdrop-blur-md">
              <div className="flex items-start gap-2.5">
                <ArrowRightLeft
                  className="mt-0.5 h-4 w-4 shrink-0 text-warning-700"
                  strokeWidth={1.5}
                />
                <div className="min-w-0 flex-1">
                  <p className="font-secondary text-sm font-medium tracking-tight text-warning-700">
                    {pendingConfirmation.conflicts.length} mahasiswa sudah ada
                    di kelompok lain
                  </p>
                  <p className="mt-1 font-secondary text-xs tracking-tight text-warning-700/90">
                    Melanjutkan akan memindahkan mereka ke kelompok ini.
                  </p>

                  <ul className="mt-3 space-y-1.5 custom-scrollbar max-h-32 overflow-y-auto">
                    {pendingConfirmation.conflicts.map((c) => (
                      <li
                        key={c.nim}
                        className="flex items-center justify-between gap-2 rounded-xl bg-white/50 backdrop-blur-md border border-white/40 px-3 py-2 font-secondary text-xs"
                      >
                        <span className="min-w-0 truncate font-medium tracking-tight text-grey-900">
                          {c.name}{" "}
                          <span className="font-normal text-grey-500">
                            ({c.nim})
                          </span>
                        </span>
                        <span className="shrink-0 rounded-full bg-warning/15 px-2 py-0.5 font-medium tracking-tight text-warning-700 border border-warning/10">
                          dari {c.currentGroupName}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-4 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                    <Button
                      type="button"
                      variant="outline"
                      className="h-9 text-xs font-medium tracking-tight border-white/60 bg-white/50 backdrop-blur-md hover:bg-white/80"
                      onClick={() => setPendingConfirmation(null)}
                    >
                      Batal
                    </Button>
                    <Button
                      type="button"
                      variant="danger"
                      className="h-9 text-xs font-medium tracking-tight rounded-xl shadow-lg"
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
              <div className="flex h-10 items-center rounded-xl border border-white/50 bg-white/40 backdrop-blur-md shadow-sm px-3.5 transition-all focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/10">
                <Search
                  className="mr-2 h-4 w-4 text-grey-400"
                  strokeWidth={1.5}
                />
                <input
                  value={studentSearch}
                  onChange={(e) => setStudentSearch(e.target.value)}
                  placeholder="Cari nama atau NIM mahasiswa belum berkelompok..."
                  className="flex-1 bg-transparent text-sm font-medium tracking-tight text-grey-900 placeholder:font-normal placeholder:text-grey-400 focus:outline-none"
                />
              </div>

              {debouncedSearch.length >= 2 && (
                <div className="absolute z-10 mt-1.5 w-full overflow-hidden rounded-2xl border border-white/50 bg-white/70 backdrop-blur-3xl shadow-[0_24px_60px_-15px_rgba(0,0,0,0.1)]">
                  {isSearching ? (
                    <div className="px-4 py-3 font-secondary text-xs font-medium tracking-tight text-grey-400">
                      Mencari...
                    </div>
                  ) : suggestions.length === 0 ? (
                    <div className="px-4 py-3 font-secondary text-xs font-medium tracking-tight text-grey-400">
                      Tidak ada mahasiswa yang cocok.
                    </div>
                  ) : (
                    suggestions.map((s) => (
                      <button
                        type="button"
                        key={s.id}
                        onClick={() => handlePickStudent(s.nim)}
                        className="flex w-full items-center justify-between gap-2 px-4 py-2.5 text-left transition hover:bg-white/60"
                      >
                        <span className="min-w-0">
                          <span className="block truncate text-xs font-medium tracking-tight text-grey-900">
                            {s.name}
                          </span>
                          <span className="block font-secondary text-[11px] tracking-tight text-grey-500">
                            {s.nim}
                          </span>
                        </span>
                        <Plus
                          className="h-3.5 w-3.5 shrink-0 text-primary"
                          strokeWidth={1.5}
                        />
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>
          )}

          <div className="mt-4 max-h-[260px] space-y-2.5 overflow-y-auto pr-1 custom-scrollbar">
            {existingStudents.map((student, idx) => (
              <div key={student.id} className="flex items-center gap-2">
                <span className="w-[74px] shrink-0 font-secondary text-xs font-medium tracking-tight text-grey-500">
                  Anggota {idx + 1}
                </span>
                <div className="flex h-10 flex-1 items-center rounded-xl border border-white/40 bg-white/30 backdrop-blur-md px-3">
                  <span className="truncate text-sm font-medium tracking-tight text-grey-500">
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
                <span className="w-[74px] shrink-0 font-secondary text-xs font-medium tracking-tight text-grey-500">
                  Anggota {existingStudents.length + index + 1}
                </span>
                <Input
                  {...register(`nims.${index}.value` as const)}
                  placeholder="cth. 1101210001"
                  className="flex-1 bg-white/50 backdrop-blur-md border-white/40 font-medium tracking-tight"
                />
                {fields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-grey-400 transition hover:bg-white hover:text-error hover:shadow-sm"
                    aria-label={`Hapus baris anggota ${
                      existingStudents.length + index + 1
                    }`}
                  >
                    <X className="h-4 w-4" strokeWidth={1.5} />
                  </button>
                )}
              </div>
            ))}

            {isAtCapacity ? (
              <div className="flex items-start gap-2.5 rounded-2xl border border-white/50 bg-white/30 backdrop-blur-md px-4 py-3 font-secondary text-xs font-medium tracking-tight text-grey-500 shadow-sm">
                <AlertTriangle
                  className="mt-0.5 h-4 w-4 shrink-0 text-grey-400"
                  strokeWidth={1.5}
                />
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
                className="mt-1 flex w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-white/60 bg-white/40 backdrop-blur-md py-2.5 font-secondary text-xs font-medium tracking-tight text-primary transition-all hover:border-primary/50 hover:bg-white/60 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Plus className="h-3.5 w-3.5" strokeWidth={1.5} />
                {isGroupFull
                  ? `Maksimal ${MAX_TOTAL_SLOTS} anggota tercapai`
                  : "Tambah Anggota"}
              </button>
            )}

            {errors.root?.empty && (
              <div className="rounded-2xl border border-error/15 bg-error/5 px-4 py-3 font-secondary text-sm font-medium tracking-tight text-error backdrop-blur-md">
                {errors.root.empty.message}
              </div>
            )}

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
                Tutup
              </Button>
            </DialogClose>
            <Button
              type="submit"
              disabled={isPending || !!pendingConfirmation || isAtCapacity}
              className="w-full sm:w-auto font-medium tracking-tight rounded-xl shadow-lg"
            >
              {isPending ? "Menambahkan..." : "Tambah Anggota"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
