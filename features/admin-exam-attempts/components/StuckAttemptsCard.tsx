"use client";

import { RotateCw } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import {
  useStuckAttempts,
  useForceSubmitAttempt,
} from "../hooks/use-admin-exam-attempts";

export function StuckAttemptsCard() {
  const { data: attempts = [], isLoading } = useStuckAttempts();
  const { mutate: forceSubmit, isPending, variables } = useForceSubmitAttempt();

  if (isLoading) {
    return (
      <div className="h-40 w-full animate-pulse rounded-2xl bg-grey-100" />
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-grey-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-grey-100 px-6 py-5">
        <h2 className="text-base font-bold tracking-tight text-grey-900">
          Ujian Macet (Timeout, belum ter-submit)
        </h2>
        {attempts.length > 0 && (
          <span className="rounded-full bg-error/10 px-2.5 py-1 font-secondary text-[11px] font-bold text-error">
            {attempts.length} perlu tindakan
          </span>
        )}
      </div>

      {attempts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <p className="font-secondary text-sm font-semibold text-grey-500">
            Tidak ada attempt yang macet. Sweep otomatis berjalan tiap menit.
          </p>
        </div>
      ) : (
        <table className="w-full text-left font-secondary text-sm">
          <thead className="border-b border-grey-100 bg-grey-50/80 text-[11px] font-bold text-grey-500">
            <tr>
              <th className="px-6 py-3">Mahasiswa</th>
              <th className="px-6 py-3">Modul & Kelompok</th>
              <th className="px-6 py-3">Kedaluwarsa</th>
              <th className="px-6 py-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-grey-100">
            {attempts.map((attempt) => (
              <tr key={attempt.id} className="hover:bg-grey-50/50">
                <td className="px-6 py-3.5">
                  <p className="font-semibold text-grey-900">
                    {attempt.student.name}
                  </p>
                  <p className="text-xs text-grey-500">{attempt.student.nim}</p>
                </td>
                <td className="px-6 py-3.5">
                  <p className="font-semibold text-grey-900">
                    Modul {attempt.module.order} — {attempt.module.title}
                  </p>
                  <p className="text-xs text-grey-500">{attempt.group.name}</p>
                </td>
                <td className="px-6 py-3.5 text-xs text-grey-600">
                  {new Date(attempt.expiredAt).toLocaleString("id-ID")}
                </td>
                <td className="px-6 py-3.5 text-right">
                  <Button
                    variant="danger"
                    className="h-8 rounded-lg px-3 text-xs"
                    disabled={isPending && variables === attempt.id}
                    onClick={() => forceSubmit(attempt.id)}
                  >
                    <RotateCw className="mr-1.5 h-3.5 w-3.5" strokeWidth={2} />
                    {isPending && variables === attempt.id
                      ? "Memproses..."
                      : "Force Submit"}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
