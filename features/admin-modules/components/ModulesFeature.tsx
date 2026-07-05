"use client";

import { useState } from "react";
import { Plus, BookOpen, Search } from "lucide-react";
import { useAdminModules } from "../hooks/use-admin-modules";
import { AdminModule } from "../types/admin-module.type";
import { ModuleCard } from "./ModuleCard";
import { ModuleFormDialog } from "./ModuleFormDialog";
import { DeleteModuleDialog } from "./DeleteModuleDialog";
import { Button } from "@/shared/components/ui/button";

export function ModulesFeature() {
  const { data, isLoading, isError } = useAdminModules(1, 50);
  const modules = data?.data ?? [];

  const [searchQuery, setSearchQuery] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editingModule, setEditingModule] = useState<AdminModule | null>(null);
  const [deletingModule, setDeletingModule] = useState<AdminModule | null>(
    null,
  );

  const filteredModules = modules
    .filter((m) => m.title.toLowerCase().includes(searchQuery.toLowerCase()))
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
            Kelola materi, status, dan tenggat TP tiap modul.
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

      <div className="flex h-11 max-w-md items-center rounded-xl border border-grey-200 bg-white px-4">
        <Search className="mr-2.5 h-4 w-4 text-grey-400" strokeWidth={2} />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Cari modul..."
          className="flex-1 bg-transparent text-sm text-grey-900 placeholder:text-grey-400 focus:outline-none"
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
          <p className="text-sm font-bold text-grey-900">Belum ada modul</p>
          <p className="mt-1 font-secondary text-xs text-grey-500">
            Klik &quot;Tambah Modul&quot; untuk membuat modul praktikum pertama.
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
