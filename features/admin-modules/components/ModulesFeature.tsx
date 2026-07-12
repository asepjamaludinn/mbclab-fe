"use client";

import { useMemo, useState } from "react";
import { Plus, BookOpen, Search, Lock, Clock, Layers } from "lucide-react";
import { useAdminModules } from "../hooks/use-admin-modules";
import { AdminModule } from "../types/admin-module.type";
import { isDeadlinePassed } from "@/shared/utils/deadline";
import { ModuleCard } from "./ModuleCard";
import { ModuleFormDialog } from "./ModuleFormDialog";
import { DeleteModuleDialog } from "./DeleteModuleDialog";
import { Button } from "@/shared/components/ui/button";
import { FilterDropdown } from "@/shared/components/ui/filter-dropdown";

type StatusFilter = "all" | "open" | "closed" | "inactive";

const STATUS_OPTIONS: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "Semua Status" },
  { value: "open", label: "TP Terbuka" },
  { value: "closed", label: "TP Ditutup" },
  { value: "inactive", label: "Modul Nonaktif" },
];

export function ModulesFeature() {
  const { data, isLoading, isError } = useAdminModules(1, 50);
  const modules = data?.data ?? [];

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [formOpen, setFormOpen] = useState(false);
  const [editingModule, setEditingModule] = useState<AdminModule | null>(null);
  const [deletingModule, setDeletingModule] = useState<AdminModule | null>(
    null,
  );

  const summary = useMemo(() => {
    const total = modules.length;
    const closed = modules.filter((m) => isDeadlinePassed(m.tpDeadline)).length;
    const active = modules.filter((m) => m.isActive).length;
    return { total, closed, active };
  }, [modules]);

  const filteredModules = modules
    .filter((m) => m.title.toLowerCase().includes(searchQuery.toLowerCase()))
    .filter((m) => {
      if (statusFilter === "all") return true;
      if (statusFilter === "inactive") return !m.isActive;
      const closed = isDeadlinePassed(m.tpDeadline);
      if (statusFilter === "closed") return closed;
      if (statusFilter === "open") return !closed;
      return true;
    })
    .sort((a, b) => a.order - b.order);

  const openCreate = () => {
    setEditingModule(null);
    setFormOpen(true);
  };

  const openEdit = (module: AdminModule) => {
    setEditingModule(module);
    setFormOpen(true);
  };

  return (
    <div className="flex w-full flex-col gap-6 font-primary">
      <div className="flex w-full flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-primary text-2xl font-bold tracking-tight text-grey-900">
            Modul Praktikum
          </h1>
          <p className="mt-1 font-secondary text-sm text-grey-500">
            Kelola materi, status, dan tenggat waktu pengumpulan TP tiap modul.
          </p>
        </div>

        <Button
          onClick={openCreate}
          className="h-10 shrink-0 rounded-lg px-4 shadow-sm"
        >
          <Plus className="mr-2 h-4 w-4" strokeWidth={2} />
          Tambah Modul
        </Button>
      </div>

      {/* Ringkasan status */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="flex items-center gap-3 rounded-2xl border border-grey-200 bg-white p-4 shadow-sm">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Layers className="h-5 w-5" strokeWidth={2} />
          </div>
          <div>
            <p className="text-xl font-extrabold text-grey-900">
              {summary.total}
            </p>
            <p className="font-secondary text-xs text-grey-500">Total Modul</p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-2xl border border-grey-200 bg-white p-4 shadow-sm">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-info/10 text-info-700">
            <Clock className="h-5 w-5" strokeWidth={2} />
          </div>
          <div>
            <p className="text-xl font-extrabold text-grey-900">
              {summary.total - summary.closed}
            </p>
            <p className="font-secondary text-xs text-grey-500">
              TP Masih Terbuka
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-2xl border border-grey-200 bg-white p-4 shadow-sm">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-error/10 text-error">
            <Lock className="h-5 w-5" strokeWidth={2} />
          </div>
          <div>
            <p className="text-xl font-extrabold text-grey-900">
              {summary.closed}
            </p>
            <p className="font-secondary text-xs text-grey-500">
              TP Sudah Ditutup
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex h-11 flex-1 items-center rounded-xl border border-grey-200 bg-white px-4 sm:max-w-md">
          <Search className="mr-2.5 h-4 w-4 text-grey-400" strokeWidth={2} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari modul..."
            className="flex-1 bg-transparent text-sm text-grey-900 placeholder:text-grey-400 focus:outline-none"
          />
        </div>

        <FilterDropdown
          value={statusFilter}
          options={STATUS_OPTIONS}
          onChange={setStatusFilter}
          widthClassName="sm:w-56"
        />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-[180px] animate-pulse rounded-[28px] bg-grey-100"
            />
          ))}
        </div>
      ) : isError ? (
        <div className="rounded-2xl border border-grey-200 bg-white p-10 text-center">
          <p className="font-secondary text-sm font-semibold text-error">
            Gagal memuat data modul.
          </p>
        </div>
      ) : filteredModules.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-grey-200 bg-white p-14 text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
            <BookOpen className="h-7 w-7" strokeWidth={1.8} />
          </div>
          <p className="text-sm font-bold text-grey-900">
            {modules.length === 0
              ? "Belum ada modul"
              : "Tidak ada modul yang cocok"}
          </p>
          <p className="mt-1 font-secondary text-xs text-grey-500">
            {modules.length === 0
              ? 'Klik "Tambah Modul" untuk membuat modul praktikum pertama.'
              : "Coba ubah kata kunci pencarian atau filter."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {filteredModules.map((module) => (
            <ModuleCard
              key={module.id}
              module={module}
              onEdit={() => openEdit(module)}
              onDelete={() => setDeletingModule(module)}
            />
          ))}
        </div>
      )}

      <ModuleFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        module={editingModule}
      />
      <DeleteModuleDialog
        module={deletingModule}
        onOpenChange={(open) => !open && setDeletingModule(null)}
      />
    </div>
  );
}
