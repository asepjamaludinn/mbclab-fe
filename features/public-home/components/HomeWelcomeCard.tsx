import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";

export function HomeWelcomeCard() {
  return (
    <section className="relative z-20 -mt-16 px-5">
      <Card className="mx-auto w-full max-w-[420px] text-center shadow-[0_20px_60px_-15px_rgba(0,0,0,0.08)]">
        <h2 className="text-lg font-extrabold tracking-tight text-grey-900">
          Selamat Datang, Praktikan!
        </h2>

        <p className="mt-2 font-secondary text-xs leading-relaxed text-grey-500">
          Akses dashboard Anda untuk mengumpulkan Tugas Pendahuluan, melihat
          nilai, dan aktivitas lainnya.
        </p>

        <Button
          asChild
          className="group relative mt-5 w-full justify-between overflow-hidden"
        >
          <Link href="/login/student">
            <span className="relative z-10">Masuk ke Dashboard</span>
            <ChevronRight className="relative z-10 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full" />
          </Link>
        </Button>
      </Card>
    </section>
  );
}
