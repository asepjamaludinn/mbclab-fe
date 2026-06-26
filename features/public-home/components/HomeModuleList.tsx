import { BookOpen, Download } from "lucide-react";
import { PublicModule } from "../types/public-home.type";

type HomeModuleListProps = {
  modules: PublicModule[];
};

export function HomeModuleList({ modules }: HomeModuleListProps) {
  return (
    <section id="modul" className="px-4 pt-8">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-base font-bold text-grey-900">Download Modul</h2>

        <span className="font-secondary text-xs font-semibold text-primary">
          Materi Praktikum
        </span>
      </div>

      {modules.length === 0 ? (
        <div className="rounded-3xl border border-grey-200 bg-white p-5 text-center shadow-sm">
          <h3 className="text-sm font-bold text-grey-900">
            Modul belum tersedia
          </h3>

          <p className="mt-1 font-secondary text-xs leading-relaxed text-grey-700">
            Daftar modul akan tampil setelah data dipublikasikan.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {modules.map((module) => {
            const canDownload = module.isActive && module.fileUrl !== "#";

            return (
              <article
                key={module.id}
                className="rounded-3xl border border-grey-200 bg-white p-4 shadow-sm"
              >
                <div className="flex gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10">
                    <BookOpen className="h-7 w-7 text-primary" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-bold leading-snug text-grey-900">
                      {module.title}
                    </h3>

                    <p className="mt-1 font-secondary text-xs leading-relaxed text-grey-700">
                      {module.description}
                    </p>

                    {canDownload ? (
                      <a
                        href={module.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3 inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 font-secondary text-xs font-semibold text-white"
                      >
                        Download
                        <Download className="h-4 w-4" />
                      </a>
                    ) : (
                      <span className="mt-3 inline-flex rounded-full bg-grey-200 px-4 py-2 font-secondary text-xs font-semibold text-grey-700">
                        Belum dibuka
                      </span>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
