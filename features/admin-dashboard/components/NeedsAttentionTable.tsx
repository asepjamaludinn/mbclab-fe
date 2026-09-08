"use client";

import { useEffect, useState } from "react";
import { Activity, AlertTriangle, Clock3, RotateCw } from "lucide-react";
import { BlockedAttempt } from "../types/admin-dashboard.type";
import { useRegenerateUnblockCode } from "@/features/admin-exam-attempts";
import { showToast } from "@/shared/lib/toast";
import axios from "axios";
import { DataTable, DataTableColumn } from "@/shared/components/ui/data-table";

type NeedsAttentionTableProps = {
  data: BlockedAttempt[];
};

function useNow(intervalMs = 1000) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), intervalMs);
    return () => clearInterval(interval);
  }, [intervalMs]);
  return now;
}

function formatRemaining(ms: number) {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function NeedsAttentionTable({ data }: NeedsAttentionTableProps) {
  const now = useNow();
  const {
    mutate: regenerate,
    isPending,
    variables,
  } = useRegenerateUnblockCode();

  const handleRegenerate = (attemptId: string) => {
    regenerate(attemptId, {
      onSuccess: () =>
        showToast.success(
          "Kode unblock baru dibuat",
          "Sampaikan kode terbaru ini kepada praktikan.",
        ),
      onError: (err: unknown) => {
        const message = axios.isAxiosError(err)
          ? err.response?.data?.message || "Gagal membuat kode unblock baru."
          : "Gagal membuat kode unblock baru.";
        showToast.error("Gagal", message);
      },
    });
  };

  const columns: DataTableColumn<BlockedAttempt>[] = [
    {
      key: "student",
      header: "Mahasiswa",
      cellClassName: "px-6 py-4 whitespace-nowrap",
      render: (attempt) => (
        <div>
          <p className="font-medium tracking-tight text-grey-900">
            {attempt.student.name}
          </p>
          <p className="text-xs tracking-tight text-grey-500">
            {attempt.student.nim}
          </p>
        </div>
      ),
    },
    {
      key: "module",
      header: "Modul & Shift",
      cellClassName: "px-6 py-4 whitespace-nowrap",
      render: (attempt) => (
        <div>
          <p className="font-medium tracking-tight text-grey-900">
            {attempt.session.module.title}
          </p>
          <p className="text-xs tracking-tight text-grey-500">
            {attempt.session.shift.replace("_", " ")}
          </p>
        </div>
      ),
    },
    {
      key: "blockedAt",
      header: "Waktu Blokir",
      cellClassName: "px-6 py-4 whitespace-nowrap",
      render: (attempt) => (
        <span className="text-xs font-medium text-grey-600">
          {attempt.blockedAt
            ? new Date(attempt.blockedAt).toLocaleTimeString("id-ID", {
                hour: "2-digit",
                minute: "2-digit",
              })
            : "-"}{" "}
          WIB
        </span>
      ),
    },
    {
      key: "unblockCode",
      header: "Kode Unblock",
      cellClassName: "px-6 py-4 whitespace-nowrap",
      render: (attempt) => {
        const expiresAt = attempt.unblockCodeExpiresAt
          ? new Date(attempt.unblockCodeExpiresAt).getTime()
          : null;
        const remainingMs = expiresAt ? expiresAt - now : null;
        const isExpired =
          !attempt.unblockCode || (remainingMs !== null && remainingMs <= 0);

        return (
          <span
            className={`inline-block rounded-md border px-2.5 py-1 font-mono text-xs font-medium ${isExpired ? "border-grey-200/50 bg-grey-100/50 text-grey-400 line-through" : "border-white/60 bg-white/60 text-grey-700 shadow-sm"}`}
          >
            {attempt.unblockCode || "EXPIRED"}
          </span>
        );
      },
    },
    {
      key: "status",
      header: "Status",
      cellClassName: "px-6 py-4 whitespace-nowrap",
      render: (attempt) => {
        const expiresAt = attempt.unblockCodeExpiresAt
          ? new Date(attempt.unblockCodeExpiresAt).getTime()
          : null;
        const remainingMs = expiresAt ? expiresAt - now : null;
        const isExpired =
          !attempt.unblockCode || (remainingMs !== null && remainingMs <= 0);

        return (
          <div className="flex flex-col gap-1">
            <span className="inline-flex w-fit items-center gap-1 rounded bg-error/10 px-2 py-1 text-[11px] font-medium tracking-tight text-error backdrop-blur-md">
              <AlertTriangle className="h-3 w-3" strokeWidth={1.5} />{" "}
              {attempt.cheatCount}x
            </span>
            {isExpired ? (
              <span className="inline-flex w-fit items-center gap-1 rounded bg-warning/10 px-2 py-0.5 text-[10px] font-medium tracking-tight text-warning-700 backdrop-blur-md">
                <Clock3 className="h-2.5 w-2.5" strokeWidth={1.5} /> Kode
                Kedaluwarsa
              </span>
            ) : (
              <span className="inline-flex w-fit items-center gap-1 rounded bg-info/10 px-2 py-0.5 text-[10px] font-medium tracking-tight text-info-700 backdrop-blur-md">
                <Clock3 className="h-2.5 w-2.5" strokeWidth={1.5} /> Sisa{" "}
                {formatRemaining(remainingMs!)}
              </span>
            )}
          </div>
        );
      },
    },
    {
      key: "actions",
      header: "Aksi",
      headerClassName:
        "px-6 py-3.5 text-right font-secondary text-[11px] font-bold uppercase tracking-wider text-grey-500 whitespace-nowrap",
      cellClassName: "px-6 py-4 whitespace-nowrap",
      render: (attempt) => {
        const expiresAt = attempt.unblockCodeExpiresAt
          ? new Date(attempt.unblockCodeExpiresAt).getTime()
          : null;
        const remainingMs = expiresAt ? expiresAt - now : null;
        const isExpired =
          !attempt.unblockCode || (remainingMs !== null && remainingMs <= 0);
        const isRegeneratingThis = isPending && variables === attempt.id;

        return (
          <div className="flex justify-end">
            <button
              onClick={() => handleRegenerate(attempt.id)}
              disabled={isRegeneratingThis}
              className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-[11px] font-medium tracking-tight whitespace-nowrap transition disabled:cursor-not-allowed disabled:opacity-50 ${isExpired ? "border-primary bg-primary text-white shadow-md hover:bg-secondary backdrop-blur-md" : "border-grey-200 text-grey-700 hover:bg-grey-50 bg-white shadow-sm"}`}
            >
              <RotateCw
                className={`h-3.5 w-3.5 ${isRegeneratingThis ? "animate-spin" : ""}`}
                strokeWidth={1.5}
              />
              {isRegeneratingThis ? "Memproses..." : "Buat Kode Baru"}
            </button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="h-full overflow-hidden rounded-[32px] border border-white/60 bg-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-2xl">
      <div className="flex items-center justify-between border-b border-white/50 px-6 py-5">
        <h2 className="text-base font-medium tracking-tighter text-grey-900">
          Status Ujian
        </h2>
        {data.length > 0 && (
          <span className="rounded-full bg-error/10 px-2.5 py-1 font-secondary text-[11px] font-medium tracking-tight text-error">
            {data.length} perlu tindakan
          </span>
        )}
      </div>

      <div className="p-1.5">
        <DataTable
          columns={columns}
          data={data}
          rowKey={(a) => a.id}
          emptyIcon={Activity}
          emptyTitle="Tidak ada sesi terblokir"
          page={1}
          pageSize={data.length || 10}
          totalItems={data.length}
          onPageChange={() => {}}
          pageSizeOptions={[]}
        />
      </div>
    </div>
  );
}
