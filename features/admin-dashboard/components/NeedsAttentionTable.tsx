import { Activity, AlertTriangle } from "lucide-react";
import { BlockedAttempt } from "../types/admin-dashboard.type";

type NeedsAttentionTableProps = {
  data: BlockedAttempt[];
};

export function NeedsAttentionTable({ data }: NeedsAttentionTableProps) {
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
              </tr>
            </thead>
            <tbody className="divide-y divide-grey-100">
              {data.map((attempt) => (
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
                    <span className="inline-block rounded-md border border-grey-200 bg-white px-2.5 py-1 font-mono text-xs font-bold text-grey-700">
                      {attempt.unblockCode || "EXPIRED"}
                    </span>
                  </td>
                  <td className="px-6 py-3.5">
                    <span className="inline-flex items-center gap-1 rounded bg-error/10 px-2 py-1 text-[11px] font-semibold text-error">
                      <AlertTriangle className="h-3 w-3" strokeWidth={2.5} />
                      {attempt.cheatCount}x
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
