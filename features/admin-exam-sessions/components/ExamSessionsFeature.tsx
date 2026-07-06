"use client";

import { useState } from "react";
import { Plus, CalendarClock, Pencil, Trash2, Users } from "lucide-react";
import { useAdminExamSessions } from "../hooks/use-admin-exam-sessions";
import { AdminExamSession } from "../types/admin-exam-session.type";
import { getShiftLabel } from "../constants/admin-exam-session.constant";
import { Button } from "@/shared/components/ui/button";
import { DataTable, DataTableColumn } from "@/shared/components/ui/data-table";
import { ExamSessionFormDialog } from "./ExamSessionFormDialog";
import { DeleteExamSessionDialog } from "./DeleteExamSessionDialog";

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

export function ExamSessionsFeature() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [formOpen, setFormOpen] = useState(false);
  const [editingSession, setEditingSession] = useState<AdminExamSession | null>(
    null,
  );
  const [deletingSession, setDeletingSession] =
    useState<AdminExamSession | null>(null);

  const { data, isLoading, isError } = useAdminExamSessions(page, pageSize);
  const sessions = data?.data ?? [];
  const meta = data?.meta;

  const openCreateDialog = () => {
    setEditingSession(null);
    setFormOpen(true);
  };

  const openEditDialog = (session: AdminExamSession) => {
    setEditingSession(session);
    setFormOpen(true);
  };

  const columns: DataTableColumn<AdminExamSession>[] = [
    {
      key: "module",
      header: "Modul",
      render: (s) => (
        <div>
          <p className="text-sm font-semibold text-grey-900">
            Modul {s.module?.order} — {s.module?.title}
          </p>
          <p className="mt-0.5 font-secondary text-xs text-grey-500">
            {s.group?.name}
          </p>
        </div>
      ),
    },
    {
      key: "schedule",
      header: "Jadwal",
      render: (s) => (
        <div>
          <p className="text-sm font-semibold text-grey-900">
            {new Date(s.date).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </p>
          <p className="mt-0.5 font-secondary text-xs text-grey-500">
            {getShiftLabel(s.shift)}
          </p>
        </div>
      ),
    },
    {
      key: "time",
      header: "Waktu Akses",
      render: (s) => (
        <span className="font-secondary text-sm text-grey-700">
          {new Date(s.startTime).toLocaleTimeString("id-ID", {
            hour: "2-digit",
            minute: "2-digit",
          })}{" "}
          -{" "}
          {new Date(s.endTime).toLocaleTimeString("id-ID", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      ),
    },
    {
      key: "attempts",
      header: "Peserta",
      render: (s) => (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 font-secondary text-xs font-bold text-primary">
          <Users className="h-3 w-3" strokeWidth={2.5} />
          {s._count?.attempts ?? 0}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Aksi",
      headerClassName:
        "px-6 py-3.5 text-right font-secondary text-[11px] font-bold uppercase tracking-wider text-grey-500",
      render: (s) => (
        <div className="flex items-center justify-end gap-1.5">
          <button
            onClick={() => openEditDialog(s)}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-grey-400 transition hover:bg-primary/10 hover:text-primary"
            aria-label="Ubah sesi"
          >
            <Pencil className="h-4 w-4" strokeWidth={2} />
          </button>
          <button
            onClick={() => setDeletingSession(s)}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-grey-400 transition hover:bg-error/10 hover:text-error"
            aria-label="Hapus sesi"
          >
            <Trash2 className="h-4 w-4" strokeWidth={2} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="flex w-full flex-col gap-6 font-primary">
      <div className="flex w-full flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-primary text-2xl font-bold tracking-tight text-grey-900">
            Sesi Ujian
          </h1>
          <p className="mt-1 font-secondary text-sm text-grey-500">
            Jadwalkan sesi Tes Awal (TA) untuk tiap kelompok praktikum.
          </p>
        </div>

        <Button
          onClick={openCreateDialog}
          className="h-10 shrink-0 rounded-lg px-4 shadow-sm"
        >
          <Plus className="mr-2 h-4 w-4" strokeWidth={2} />
          Buat Sesi
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={sessions}
        rowKey={(s) => s.id}
        isLoading={isLoading}
        isError={isError}
        errorMessage="Gagal memuat sesi ujian."
        emptyIcon={CalendarClock}
        emptyTitle="Belum ada sesi ujian"
        emptyDescription='Klik "Buat Sesi" untuk menjadwalkan sesi pertama.'
        page={page}
        pageSize={pageSize}
        totalItems={meta?.total ?? 0}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
        pageSizeOptions={PAGE_SIZE_OPTIONS}
        itemsLabel="sesi"
      />

      <ExamSessionFormDialog
        session={editingSession}
        open={formOpen}
        onOpenChange={(o) => {
          setFormOpen(o);
          if (!o) setEditingSession(null);
        }}
      />
      <DeleteExamSessionDialog
        session={deletingSession}
        onOpenChange={(open) => !open && setDeletingSession(null)}
      />
    </div>
  );
}
