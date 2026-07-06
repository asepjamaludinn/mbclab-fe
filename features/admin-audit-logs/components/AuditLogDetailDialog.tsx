"use client";

import { History, ArrowRight } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { AuditLog } from "../types/admin-audit-log.type";
import { getAuditActionMeta } from "../constants/admin-audit-log.constant";
import { parseAuditDetails } from "../utils/audit-details";

type AuditLogDetailDialogProps = {
  log: AuditLog | null;
  onOpenChange: (open: boolean) => void;
};

export function AuditLogDetailDialog({
  log,
  onOpenChange,
}: AuditLogDetailDialogProps) {
  const parsed = log
    ? parseAuditDetails(log.details)
    : { kind: "empty" as const };
  const actionMeta = log ? getAuditActionMeta(log.action) : null;

  return (
    <Dialog open={!!log} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg w-[calc(100%-2rem)] rounded-[28px] border border-grey-200 bg-white p-6 shadow-[0_24px_60px_-30px_rgba(0,0,0,0.18)]">
        <DialogHeader className="text-left">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-[0_12px_28px_-14px_rgba(0,101,176,0.65)]">
            <History className="h-7 w-7" strokeWidth={1.8} />
          </div>
          <DialogTitle>{actionMeta?.label ?? "-"}</DialogTitle>
          <DialogDescription>
            {log?.entity} — {log?.entityId}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 space-y-3">
          <div className="rounded-2xl border border-grey-100 bg-grey-50/60 p-4">
            <p className="font-secondary text-xs font-bold text-grey-500">
              Dilakukan oleh
            </p>
            <p className="mt-1 text-sm font-semibold text-grey-900">
              {log?.user?.name ?? "-"}{" "}
              <span className="font-normal text-grey-500">
                ({log?.user?.nim ?? "-"})
              </span>
            </p>
            <p className="mt-1 font-secondary text-xs text-grey-500">
              {log ? new Date(log.createdAt).toLocaleString("id-ID") : "-"}
            </p>
          </div>

          <div>
            <p className="mb-2 font-secondary text-xs font-bold text-grey-500">
              Detail Perubahan
            </p>

            {parsed.kind === "empty" && (
              <p className="rounded-2xl border border-grey-100 bg-grey-50/60 px-4 py-4 text-center font-secondary text-xs text-grey-400">
                Tidak ada detail tambahan.
              </p>
            )}

            {parsed.kind === "diff" && (
              <div className="max-h-72 space-y-2 overflow-y-auto rounded-2xl border border-grey-100 bg-grey-50/60 p-3">
                {parsed.rows.length === 0 ? (
                  <p className="px-2 py-2 text-center font-secondary text-xs text-grey-400">
                    Tidak ada perubahan nilai yang tercatat.
                  </p>
                ) : (
                  parsed.rows.map((row) => (
                    <div
                      key={row.key}
                      className="rounded-xl border border-grey-100 bg-white px-3.5 py-2.5"
                    >
                      <p className="font-secondary text-[11px] font-bold uppercase tracking-wide text-grey-400">
                        {row.label}
                      </p>
                      <div className="mt-1 flex items-center gap-2 font-secondary text-sm">
                        <span className="truncate text-grey-400 line-through decoration-error/40">
                          {row.before}
                        </span>
                        <ArrowRight className="h-3.5 w-3.5 shrink-0 text-grey-300" />
                        <span className="truncate font-semibold text-grey-900">
                          {row.after}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {parsed.kind === "list" && (
              <div className="max-h-72 space-y-1.5 overflow-y-auto rounded-2xl border border-grey-100 bg-grey-50/60 p-3">
                {parsed.rows.map((row) => (
                  <div
                    key={row.label}
                    className="flex items-start justify-between gap-3 rounded-xl border border-grey-100 bg-white px-3.5 py-2.5"
                  >
                    <span className="font-secondary text-xs font-bold text-grey-500">
                      {row.label}
                    </span>
                    <span className="max-w-[60%] break-words text-right font-secondary text-xs font-semibold text-grey-900">
                      {row.value}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
