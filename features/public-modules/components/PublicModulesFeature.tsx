"use client";

import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  Download,
  FileText,
  LockKeyhole,
} from "lucide-react";
import {
  usePublicModules,
  PublicBottomNavigation,
  publicBottomNavItems,
} from "@/features/public-home";
import { Card } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";

export function PublicModulesFeature() {
  const { data: modules = [], isLoading, isError } = usePublicModules();

  return (
    <main className="min-h-screen bg-grey-200 pb-28">
      <section className="relative overflow-hidden rounded-b-[40px] bg-primary px-4 pb-16 pt-5 text-white shadow-sm">
        <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-20 h-64 w-64 rounded-full bg-secondary/40 blur-3xl" />

        <div className="relative z-10">
          <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-white p-2 shadow-lg">
            <img
              src="/images/logo_utama.svg"
              alt="Logo MBC Laboratory"
              className="h-full w-full object-contain"
            />
          </div>

          <h1 className="mt-2 max-w-sm text-4xl font-bold leading-[1.05] tracking-tight text-white">
            Modul Praktikum
          </h1>

          <p className="mt-4 max-w-sm font-secondary text-sm leading-relaxed text-white/75">
            Akses daftar modul praktikum yang telah dipublikasikan oleh tim
            akademik MBC Laboratory.
          </p>
        </div>
      </section>

      <section className="relative z-20 -mt-8 px-4 space-y-4">
        <Card className="flex items-center justify-between p-4">
          <div>
            <h2 className="text-lg font-bold text-grey-900">Daftar Modul</h2>
            <p className="font-secondary text-xs text-grey-700">
              Materi praktikum untuk praktikan.
            </p>
          </div>

          <span className="rounded-full bg-primary/10 px-3 py-1 font-secondary text-[11px] font-bold text-primary">
            {modules.length} Modul
          </span>
        </Card>

        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="h-32 animate-pulse rounded-[32px] border border-grey-200 bg-white"
              />
            ))}
          </div>
        ) : isError ? (
          <Card className="border-error/20 bg-error/10 p-5 text-center">
            <h3 className="text-base font-bold text-error">
              Modul gagal dimuat
            </h3>
            <p className="mt-2 font-secondary text-sm text-grey-700">
              Silakan coba beberapa saat lagi.
            </p>
          </Card>
        ) : modules.length === 0 ? (
          <Card className="p-6 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
              <BookOpen className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-base font-bold text-grey-900">
              Modul belum tersedia
            </h3>
            <p className="mt-2 font-secondary text-sm leading-relaxed text-grey-700">
              Daftar modul akan tampil setelah dipublikasikan oleh asisten.
            </p>
          </Card>
        ) : (
          <div className="space-y-3">
            {modules.map((module, index) => {
              const canDownload = module.isActive && module.fileUrl !== "#";

              return (
                <Card
                  key={module.id}
                  className="group p-5 hover:border-primary/20 hover:shadow-md"
                >
                  <div className="flex gap-4">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10 transition group-hover:bg-primary">
                      <FileText className="h-7 w-7 text-primary transition group-hover:text-white" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="mb-2 flex items-start justify-between gap-3">
                        <div>
                          <span className="font-secondary text-[11px] font-bold uppercase tracking-wide text-primary">
                            Modul {index + 1}
                          </span>
                          <h3 className="mt-1 text-base font-bold leading-snug text-grey-900">
                            {module.title}
                          </h3>
                        </div>

                        {!canDownload && (
                          <span className="shrink-0 rounded-full bg-grey-200 px-3 py-1 font-secondary text-[10px] font-bold text-grey-700">
                            Terkunci
                          </span>
                        )}
                      </div>

                      <p className="font-secondary text-xs leading-relaxed text-grey-700">
                        {module.description}
                      </p>

                      {canDownload ? (
                        <Button
                          asChild
                          size="sm"
                          className="mt-4 gap-2 font-secondary text-xs"
                        >
                          <a
                            href={module.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Download Modul
                            <Download className="h-4 w-4" />
                          </a>
                        </Button>
                      ) : (
                        <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-grey-200 px-4 py-2 font-secondary text-xs font-semibold text-grey-700">
                          <LockKeyhole className="h-4 w-4" />
                          Belum dibuka
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </section>

      <PublicBottomNavigation items={publicBottomNavItems} />
    </main>
  );
}
