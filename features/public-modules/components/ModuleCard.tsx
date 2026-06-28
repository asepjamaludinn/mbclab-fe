import { Download, FileText, LockKeyhole } from "lucide-react";
import { Card } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { PublicModule } from "@/features/public-home";

type ModuleCardProps = {
  module: PublicModule;
  index: number;
};

export function ModuleCard({ module, index }: ModuleCardProps) {
  const canDownload = module.isActive && module.fileUrl !== "#";

  return (
    <Card className="group p-5 hover:border-primary/20 hover:shadow-md">
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
}
