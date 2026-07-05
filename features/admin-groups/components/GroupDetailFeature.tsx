"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  UserPlus,
  UserMinus,
  UsersRound,
  Search,
  ArrowUp,
  ArrowDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useAdminGroup } from "../hooks/use-admin-groups";
import { GroupStudent } from "../types/admin-group.type";
import { AssignStudentsDialog } from "./AssignStudentsDialog";
import { RemoveStudentDialog } from "./RemoveStudentDialog";
import { Button } from "@/shared/components/ui/button";
import { getInitials } from "@/shared/utils/string";

type GroupDetailFeatureProps = {
  groupId: string;
};

type SortDir = "asc" | "desc";

const PAGE_SIZE = 8;

export function GroupDetailFeature({ groupId }: GroupDetailFeatureProps) {
  const { data: group, isLoading, isError } = useAdminGroup(groupId);
  const [assignOpen, setAssignOpen] = useState(false);
  const [removingStudent, setRemovingStudent] = useState<GroupStudent | null>(
    null,
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [page, setPage] = useState(1);

  const filteredSorted = useMemo(() => {
    if (!group) return [];
    const q = searchQuery.toLowerCase();
    const result = group.students.filter(
      (s) =>
        s.name.toLowerCase().includes(q) || s.nim.toLowerCase().includes(q),
    );
    return [...result].sort((a, b) =>
      sortDir === "asc"
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name),
    );
  }, [group, searchQuery, sortDir]);

  useEffect(() => {
    setPage(1);
  }, [searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredSorted.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paginated = filteredSorted.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE,
  );

  if (isLoading) {
    return (
      <div className="h-64 w-full animate-pulse rounded-2xl bg-grey-100" />
    );
  }

  if (isError || !group) {
    return (
      <div className="rounded-2xl border border-grey-200 bg-white p-10 text-center">
        <p className="font-secondary text-sm font-semibold text-error">
          Kelompok tidak ditemukan.
        </p>
        <Link
          href="/admin/groups"
          className="mt-4 inline-block font-secondary text-sm font-bold text-primary"
        >
          Kembali ke daftar kelompok
        </Link>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-6 font-primary">
      <div>
        <Link
          href="/admin/groups"
          className="mb-4 inline-flex items-center gap-1.5 font-secondary text-xs font-bold text-grey-500 transition hover:text-primary"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Kembali ke Kelompok
        </Link>

        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <UsersRound className="h-7 w-7" strokeWidth={1.8} />
            </div>
            <div>
              <h1 className="font-primary text-2xl font-bold tracking-tight text-grey-900">
                {group.name}
              </h1>
              <p className="mt-1 font-secondary text-sm text-grey-500">
                {group.students.length} anggota terdaftar
              </p>
            </div>
          </div>

          <Button
            onClick={() => setAssignOpen(true)}
            className="h-10 shrink-0 rounded-lg px-4 shadow-sm"
          >
            <UserPlus className="mr-2 h-4 w-4" strokeWidth={2} />
            Tambah Anggota
          </Button>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-grey-200 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-grey-100 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-base font-bold tracking-tight text-grey-900">
            Daftar Anggota
          </h2>
          <div className="flex h-10 w-full items-center rounded-xl border border-grey-200 bg-white px-3.5 sm:w-64">
            <Search className="mr-2 h-4 w-4 text-grey-400" strokeWidth={2} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama atau NIM..."
              className="flex-1 bg-transparent text-sm text-grey-900 placeholder:text-grey-400 focus:outline-none"
            />
          </div>
        </div>

        {group.students.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-14 text-center">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-grey-100 text-grey-400">
              <UsersRound className="h-6 w-6" strokeWidth={2} />
            </div>
            <p className="font-secondary text-sm font-semibold text-grey-700">
              Belum ada anggota di kelompok ini.
            </p>
          </div>
        ) : filteredSorted.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-14 text-center">
            <p className="font-secondary text-sm font-semibold text-grey-700">
              Tidak ada anggota yang cocok dengan pencarian.
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-b border-grey-200 bg-grey-50/70">
                    <th className="w-14 px-6 py-3 font-secondary text-[11px] font-bold uppercase tracking-wider text-grey-500">
                      #
                    </th>
                    <th className="px-6 py-3">
                      <button
                        onClick={() =>
                          setSortDir((d) => (d === "asc" ? "desc" : "asc"))
                        }
                        className="inline-flex items-center gap-1.5 font-secondary text-[11px] font-bold uppercase tracking-wider text-grey-500 transition hover:text-grey-700"
                      >
                        Nama
                        {sortDir === "asc" ? (
                          <ArrowUp
                            className="h-3 w-3 text-primary"
                            strokeWidth={2.5}
                          />
                        ) : (
                          <ArrowDown
                            className="h-3 w-3 text-primary"
                            strokeWidth={2.5}
                          />
                        )}
                      </button>
                    </th>
                    <th className="px-6 py-3 font-secondary text-[11px] font-bold uppercase tracking-wider text-grey-500">
                      NIM
                    </th>
                    <th className="px-6 py-3 text-right font-secondary text-[11px] font-bold uppercase tracking-wider text-grey-500">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-grey-100">
                  {paginated.map((student, idx) => (
                    <tr
                      key={student.id}
                      className="transition hover:bg-grey-50/60"
                    >
                      <td className="px-6 py-4 font-secondary text-xs font-semibold text-grey-400">
                        {(safePage - 1) * PAGE_SIZE + idx + 1}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 font-secondary text-xs font-bold text-primary">
                            {getInitials(student.name)}
                          </div>
                          <span className="text-sm font-semibold text-grey-900">
                            {student.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-secondary text-sm text-grey-500">
                        {student.nim}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end">
                          <button
                            onClick={() => setRemovingStudent(student)}
                            className="flex h-9 w-9 items-center justify-center rounded-lg text-grey-400 transition hover:bg-error/10 hover:text-error"
                            aria-label="Keluarkan anggota"
                          >
                            <UserMinus className="h-4 w-4" strokeWidth={2} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex flex-col items-center justify-between gap-3 border-t border-grey-100 px-6 py-4 sm:flex-row">
              <p className="font-secondary text-xs text-grey-500">
                Menampilkan{" "}
                <span className="font-bold text-grey-700">
                  {(safePage - 1) * PAGE_SIZE + 1}-
                  {Math.min(safePage * PAGE_SIZE, filteredSorted.length)}
                </span>{" "}
                dari{" "}
                <span className="font-bold text-grey-700">
                  {filteredSorted.length}
                </span>{" "}
                anggota
              </p>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={safePage === 1}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-grey-200 text-grey-500 transition hover:bg-grey-50 disabled:cursor-not-allowed disabled:opacity-40"
                  aria-label="Halaman sebelumnya"
                >
                  <ChevronLeft className="h-4 w-4" strokeWidth={2} />
                </button>
                <span className="px-2 font-secondary text-xs font-bold text-grey-600">
                  {safePage} / {totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={safePage === totalPages}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-grey-200 text-grey-500 transition hover:bg-grey-50 disabled:cursor-not-allowed disabled:opacity-40"
                  aria-label="Halaman berikutnya"
                >
                  <ChevronRight className="h-4 w-4" strokeWidth={2} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      <AssignStudentsDialog
        groupId={groupId}
        existingStudents={group.students}
        open={assignOpen}
        onOpenChange={setAssignOpen}
      />
      <RemoveStudentDialog
        groupId={groupId}
        student={removingStudent}
        onOpenChange={(open) => !open && setRemovingStudent(null)}
      />
    </div>
  );
}
