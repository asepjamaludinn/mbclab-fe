"use client";

import { useEffect, useState } from "react";
import { Activity, AlertTriangle, Clock3, RotateCw } from "lucide-react";
import { BlockedAttempt } from "../types/admin-dashboard.type";
import { useRegenerateUnblockCode } from "@/features/admin-exam-attempts";
import { showToast } from "@/shared/lib/toast";
import axios from "axios";

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
      onSuccess: () => {
        showToast.success(
          "Kode unblock baru dibuat",
          "Sampaikan kode terbaru ini kepada praktikan.",
        );
      },
      onError: (err: unknown) => {
        const message = axios.isAxiosError(err)
          ? err.response?.data?.message || "Gagal membuat kode unblock baru."
          : "Gagal membuat kode unblock baru.";
        showToast.error("Gagal", message);
      },
    });
  };

  return (
    <div className="h-full overflow-hidden rounded-2xl border border-grey-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-grey-100 px-6 py-5">
        <h2 className="text-base font-bold tracking-tight text-grey-900">
          Status Ujian
        </h2>
        {data.length > 0 && (
          <span className="rounded-full bg-error/10 px-2.5 py-1 font-secondary text-[11px] font-bold text-error">
            {data.length} perlu tindakan
          </span>
        )}
      </div>

      <div className="overflow-x-auto">
        {data.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-success/10 text-success">
              <Activity className="h-6 w-6" strokeWidth={2} />
            </div>
            <p className="font-secondary text-sm font-semibold text-grey-900">
              Tidak ada sesi terblokir
            </p>
          </div>
        ) : (
          <table className="w-full text-left font-secondary text-sm">
            <thead className="border-b border-grey-100 bg-grey-50/80 text-[11px] font-bold text-grey-500">
              <tr>
                <th className="px-6 py-3">Mahasiswa</th>
                <th className="px-6 py-3">Modul & Shift</th>
                <th className="px-6 py-3">Waktu Blokir</th>
                <th className="px-6 py-3">Kode Unblock</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-grey-100">
              {data.map((attempt) => {
                const expiresAt = attempt.unblockCodeExpiresAt
                  ? new Date(attempt.unblockCodeExpiresAt).getTime()
                  : null;
                const remainingMs = expiresAt ? expiresAt - now : null;
                const isExpired =
                  !attempt.unblockCode ||
                  (remainingMs !== null && remainingMs <= 0);
                const isRegeneratingThis =
                  isPending && variables === attempt.id;

                return (
                  <tr
                    key={attempt.id}
                    className="transition-colors hover:bg-grey-50/50"
                  >
                    <td className="px-6 py-3.5">
                      <p className="font-semibold text-grey-900">
                        {attempt.student.name}
                      </p>
                      <p className="text-xs text-grey-500">
                        {attempt.student.nim}
                      </p>
                    </td>
                    <td className="px-6 py-3.5">
                      <p className="font-semibold text-grey-900">
                        {attempt.session.module.title}
                      </p>
                      <p className="text-xs text-grey-500">
                        {attempt.session.shift.replace("_", " ")}
                      </p>
                    </td>
                    <td className="px-6 py-3.5 text-xs text-grey-600">
                      {attempt.blockedAt
                        ? new Date(attempt.blockedAt).toLocaleTimeString(
                            "id-ID",
                            { hour: "2-digit", minute: "2-digit" },
                          )
                        : "-"}{" "}
                      WIB
                    </td>
                    <td className="px-6 py-3.5">
                      <span
                        className={`inline-block rounded-md border px-2.5 py-1 font-mono text-xs font-bold ${
                          isExpired
                            ? "border-grey-200 bg-grey-100 text-grey-400 line-through"
                            : "border-grey-200 bg-white text-grey-700"
                        }`}
                      >
                        {attempt.unblockCode || "EXPIRED"}
                      </span>
                    </td>
                    <td className="px-6 py-3.5">
                      <div className="flex flex-col gap-1">
                        <span className="inline-flex w-fit items-center gap-1 rounded bg-error/10 px-2 py-1 text-[11px] font-semibold text-error">
                          <AlertTriangle
                            className="h-3 w-3"
                            strokeWidth={2.5}
                          />
                          {attempt.cheatCount}x
                        </span>
                        {isExpired ? (
                          <span className="inline-flex w-fit items-center gap-1 rounded bg-warning/10 px-2 py-0.5 text-[10px] font-bold text-warning-700">
                            <Clock3 className="h-2.5 w-2.5" />
                            Kode Kedaluwarsa
                          </span>
                        ) : (
                          <span className="inline-flex w-fit items-center gap-1 rounded bg-info/10 px-2 py-0.5 text-[10px] font-bold text-info-700">
                            <Clock3 className="h-2.5 w-2.5" />
                            Sisa {formatRemaining(remainingMs!)}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-3.5 text-right">
                      <button
                        onClick={() => handleRegenerate(attempt.id)}
                        disabled={isRegeneratingThis}
                        className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-[11px] font-bold transition disabled:cursor-not-allowed disabled:opacity-50 ${
                          isExpired
                            ? "border-primary bg-primary text-white hover:bg-secondary"
                            : "border-grey-200 text-grey-600 hover:bg-grey-50"
                        }`}
                      >
                        <RotateCw
                          className={`h-3.5 w-3.5 ${isRegeneratingThis ? "animate-spin" : ""}`}
                          strokeWidth={2}
                        />
                        {isRegeneratingThis ? "Memproses..." : "Buat Kode Baru"}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
