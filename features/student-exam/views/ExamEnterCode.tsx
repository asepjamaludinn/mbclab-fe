import { ArrowLeft } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";

type Props = {
  accessCode: string;
  setAccessCode: (code: string) => void;
  joinError: string;
  isJoining: boolean;
  onJoin: (e: React.FormEvent) => void;
  onCancel: () => void;
};

export function ExamEnterCode({
  accessCode,
  setAccessCode,
  joinError,
  isJoining,
  onJoin,
  onCancel,
}: Props) {
  return (
    <main className="min-h-screen bg-grey-50 pb-28">
      <section className="px-5 pt-6">
        <button
          onClick={onCancel}
          className="mb-5 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 font-secondary text-xs font-bold text-primary shadow-sm hover:bg-grey-50"
        >
          <ArrowLeft className="h-4 w-4" /> Batal
        </button>
        <h1 className="text-2xl font-extrabold text-grey-900">
          Otentikasi Ujian
        </h1>
        <p className="mt-2 font-secondary text-sm text-grey-500">
          Masukkan <b>Kode Akses</b> yang diberikan oleh Asisten untuk memulai
          Tes Awal ini.
        </p>
      </section>
      <section className="mt-6 px-5">
        <form onSubmit={onJoin} className="rounded-3xl bg-white p-6 shadow-sm">
          <div className="space-y-4">
            <div>
              <label className="mb-2 block font-secondary text-sm font-semibold text-grey-900">
                Kode Akses
              </label>
              <Input
                value={accessCode}
                onChange={(e) => setAccessCode(e.target.value)}
                placeholder="Contoh: MBCLAB123"
              />
            </div>
            {joinError && (
              <div className="rounded-xl bg-error/10 p-3 font-secondary text-sm text-error">
                {joinError}
              </div>
            )}
            <Button type="submit" disabled={isJoining} className="w-full">
              {isJoining ? "Memverifikasi..." : "Mulai Mengerjakan"}
            </Button>
          </div>
        </form>
      </section>
    </main>
  );
}
