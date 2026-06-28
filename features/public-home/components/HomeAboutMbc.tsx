import {
  BookOpenCheck,
  ClipboardList,
  GraduationCap,
  ArrowUpRight,
} from "lucide-react";

const ABOUT_ITEMS = [
  {
    title: "Modul Praktikum",
    description: "Akses materi resmi dan panduan praktikum secara terpusat.",
    icon: BookOpenCheck,
  },
  {
    title: "Assessment",
    description: "Evaluasi dan pengumpulan tugas.",
    icon: ClipboardList,
  },
  {
    title: "Pendampingan",
    description: "Bantuan akademik dari asisten.",
    icon: GraduationCap,
  },
];

export function HomeAboutMbc() {
  return (
    <section className="px-5 pt-10">
      <div className="mb-5">
        <p className="font-secondary text-[11px] font-bold uppercase tracking-[0.18em] text-primary/70">
          Tentang Portal
        </p>
        <h2 className="mt-1 text-xl font-extrabold tracking-tight text-grey-900">
          Fasilitas Praktikum
        </h2>
        <p className="mt-2 max-w-sm font-secondary text-xs leading-relaxed text-grey-500">
          Portal digital untuk memusatkan informasi dan administrasi praktikum
          di lingkungan MBC Laboratory.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {ABOUT_ITEMS.map((item, index) => {
          const Icon = item.icon;
          const isLarge = index === 0;

          return (
            <article
              key={item.title}
              className={`group relative overflow-hidden rounded-[30px] border border-white/70 bg-white/70 shadow-sm backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:bg-white ${
                isLarge ? "col-span-2 p-5" : "col-span-1 p-4"
              }`}
            >
              <div className="pointer-events-none absolute -right-10 -top-10 h-24 w-24 rounded-full bg-primary/10 blur-2xl" />

              <div className="relative z-10 mb-6 flex items-start justify-between">
                <div
                  className={`flex shrink-0 items-center justify-center rounded-[20px] bg-primary text-white shadow-lg shadow-primary/20 ${
                    isLarge ? "h-14 w-14" : "h-12 w-12"
                  }`}
                >
                  <Icon
                    className={isLarge ? "h-6 w-6" : "h-5 w-5"}
                    strokeWidth={1.6}
                  />
                </div>

                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-grey-50 text-grey-400 transition group-hover:bg-primary group-hover:text-white">
                  <ArrowUpRight className="h-4 w-4" />
                </div>
              </div>

              <div className="relative z-10">
                <h3
                  className={`font-extrabold tracking-tight text-grey-900 ${
                    isLarge ? "text-lg" : "text-sm"
                  }`}
                >
                  {item.title}
                </h3>

                <p
                  className={`mt-1.5 font-secondary leading-relaxed text-grey-500 ${
                    isLarge ? "text-sm" : "text-[11px]"
                  }`}
                >
                  {item.description}
                </p>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
