"use client";

import { RotateCw } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import {
  useStuckAttempts,
  useForceSubmitAttempt,
} from "../hooks/use-admin-exam-attempts";
import { DataTable, DataTableColumn } from "@/shared/components/ui/data-table";
import { StuckAttempt } from "../types/admin-exam-attempt.type";

export function StuckAttemptsCard() {
  const { data: attempts = [], isLoading } = useStuckAttempts();
  const { mutate: forceSubmit, isPending, variables } = useForceSubmitAttempt();

  if (isLoading) {
    return (
      <div className="h-40 w-full animate-pulse rounded-[32px] border border-white/50 bg-white/40 backdrop-blur-md" />
    );
  }

  const columns: DataTableColumn<StuckAttempt>[] = [
    {
      key: "student",
      header: "Mahasiswa",
      render: (attempt) => (
        <div className="flex flex-col gap-0.5">
          <p className="font-medium tracking-tight text-grey-900">
            {attempt.student.name}
          </p>
          <p className="font-secondary text-xs tracking-tight text-grey-500">
            {attempt.student.nim}
          </p>
        </div>
      ),
    },
    {
      key: "module",
      header: "Modul & Kelompok",
      render: (attempt) => (
        <div className="flex flex-col gap-0.5">
          <p className="font-medium tracking-tight text-grey-900">
            Modul {attempt.module.order} — {attempt.module.title}
          </p>
          <p className="font-secondary text-xs tracking-tight text-grey-500">
            {attempt.group.name}
          </p>
        </div>
      ),
    },
    {
      key: "expired",
      header: "Kedaluwarsa",
      render: (attempt) => (
        <span className="font-secondary text-xs tracking-tight text-grey-600">
          {new Date(attempt.expiredAt).toLocaleString("id-ID")}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Aksi",
      headerClassName: "text-right",
      render: (attempt) => (
        <div className="flex justify-end">
          <Button
            variant="danger"
            className="h-8 rounded-lg px-3 text-xs font-medium tracking-tight shadow-sm"
            disabled={isPending && variables === attempt.id}
            onClick={() => forceSubmit(attempt.id)}
          >
            <RotateCw className="mr-1.5 h-3.5 w-3.5" strokeWidth={1.5} />
            {isPending && variables === attempt.id
              ? "Memproses..."
              : "Force Submit"}
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="overflow-hidden rounded-[32px] border border-white/60 bg-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-2xl">
      <div className="flex items-center justify-between border-b border-white/50 px-6 py-5">
        <h2 className="text-base font-medium tracking-tighter text-grey-900">
          Ujian Macet (Timeout, belum ter-submit)
        </h2>
        {attempts.length > 0 && (
          <span className="rounded-full bg-error/10 px-2.5 py-1 font-secondary text-[11px] font-medium tracking-tight text-error backdrop-blur-md">
            {attempts.length} perlu tindakan
          </span>
        )}
      </div>

      <DataTable
        columns={columns}
        data={attempts}
        rowKey={(a) => a.id}
        emptyTitle="Tidak ada attempt yang macet."
        emptyDescription="Sweep otomatis berjalan tiap menit."
        page={1}
        pageSize={attempts.length || 10}
        totalItems={attempts.length}
        onPageChange={() => {}}
        pageSizeOptions={[]}
      />
    </div>
  );
}
