"use client";

import { useEffect, useState } from "react";
import { History, Eye } from "lucide-react";
import { useAdminAuditLogs } from "../hooks/use-admin-audit-logs";
import { AuditLog } from "../types/admin-audit-log.type";
import {
  AUDIT_ENTITY_OPTIONS,
  getAuditActionMeta,
  getAuditActionBadgeClass,
} from "../constants/admin-audit-log.constant";
import { DataTable, DataTableColumn } from "@/shared/components/ui/data-table";
import { FilterDropdown } from "@/shared/components/ui/filter-dropdown";
import { Input } from "@/shared/components/ui/input";
import { getInitials } from "@/shared/utils/string";
import { AuditActionFilter } from "./AuditActionFilter";
import { AuditLogDetailDialog } from "./AuditLogDetailDialog";

const PAGE_SIZE_OPTIONS = [15, 30, 50, 100];

export function AuditLogsFeature() {
  const [action, setAction] = useState("");
  const [entity, setEntity] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);
  const [viewingLog, setViewingLog] = useState<AuditLog | null>(null);

  useEffect(() => {
    setPage(1);
  }, [action, entity, dateFrom, dateTo, pageSize]);

  const { data, isLoading, isError } = useAdminAuditLogs({
    action: action || undefined,
    entity: entity || undefined,
    dateFrom: dateFrom || undefined,
    dateTo: dateTo || undefined,
    page,
    limit: pageSize,
  });

  const logs = data?.data ?? [];
  const meta = data?.meta;

  const columns: DataTableColumn<AuditLog>[] = [
    {
      key: "createdAt",
      header: "Waktu",
      render: (log) => (
        <span className="font-secondary text-sm text-grey-700">
          {new Date(log.createdAt).toLocaleString("id-ID", {
            dateStyle: "medium",
            timeStyle: "short",
          })}
        </span>
      ),
    },
    {
      key: "user",
      header: "Pengguna",
      render: (log) => (
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 font-secondary text-[10px] font-bold text-primary">
            {getInitials(log.user?.name ?? "-")}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-grey-900">
              {log.user?.name ?? "-"}
            </p>
            <p className="font-secondary text-xs text-grey-500">
              {log.user?.nim ?? "-"}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: "action",
      header: "Aksi",
      render: (log) => (
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-1 font-secondary text-[11px] font-bold ${getAuditActionBadgeClass(
            log.action,
          )}`}
        >
          {getAuditActionMeta(log.action).label}
        </span>
      ),
    },
    {
      key: "entity",
      header: "Entitas",
      render: (log) => (
        <span className="font-secondary text-sm text-grey-600">
          {AUDIT_ENTITY_OPTIONS.find((e) => e.value === log.entity)?.label ??
            log.entity}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Detail",
      headerClassName:
        "px-6 py-3.5 text-right font-secondary text-[11px] font-bold uppercase tracking-wider text-grey-500",
      render: (log) => (
        <div className="flex justify-end">
          <button
            onClick={() => setViewingLog(log)}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-grey-400 transition hover:bg-primary/10 hover:text-primary"
            aria-label="Lihat detail audit log"
          >
            <Eye className="h-4 w-4" strokeWidth={2} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="flex w-full flex-col gap-6 font-primary">
      <div>
        <h1 className="font-primary text-2xl font-bold tracking-tight text-grey-900">
          Audit Log
        </h1>
        <p className="mt-1 font-secondary text-sm text-grey-500">
          Rekam jejak perubahan data dan aktivitas penting di sistem.
        </p>
      </div>

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <AuditActionFilter value={action} onChange={setAction} />

        <FilterDropdown
          value={entity}
          options={AUDIT_ENTITY_OPTIONS}
          onChange={setEntity}
          widthClassName="sm:w-56"
        />

        <div className="flex items-center gap-2">
          <Input
            type="date"
            lang="en-GB"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="h-11 w-full sm:w-40"
          />
          <span className="font-secondary text-xs text-grey-400">s/d</span>
          <Input
            type="date"
            lang="en-GB"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="h-11 w-full sm:w-40"
          />
        </div>
      </div>

      <DataTable
        columns={columns}
        data={logs}
        rowKey={(l) => l.id}
        isLoading={isLoading}
        isError={isError}
        errorMessage="Gagal memuat audit log."
        emptyIcon={History}
        emptyTitle="Belum ada aktivitas tercatat"
        emptyDescription="Aktivitas seperti perubahan data kelompok, nilai, atau modul akan muncul di sini."
        page={page}
        pageSize={pageSize}
        totalItems={meta?.total ?? 0}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
        pageSizeOptions={PAGE_SIZE_OPTIONS}
        itemsLabel="log"
      />

      <AuditLogDetailDialog
        log={viewingLog}
        onOpenChange={(open) => !open && setViewingLog(null)}
      />
    </div>
  );
}
