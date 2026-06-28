import {
  BookOpenCheck,
  ClipboardList,
  GraduationCap,
  ArrowUpRight,
} from "lucide-react";

const ABOUT_ITEMS = [
  {
    title: "Modul Praktikum",
    description:
      "Akses materi resmi dan panduan praktikum secara terpusat untuk menunjang kegiatan akademik.",
    icon: BookOpenCheck,
  },
  {
    title: "Assessment",
    description: "Evaluasi & pengumpulan tugas.",
    icon: ClipboardList,
  },
  {
    title: "Pendampingan",
    description: "Bantuan akademik asisten.",
    icon: GraduationCap,
  },
];

export function HomeAboutMbc() {
  return (
    <section className="px-6 pt-10">
      <div className="mb-6">
        <h2 className="text-xl font-extrabold tracking-tight text-grey-900">
          Tentang Portal
        </h2>
        <p className="mt-2 font-secondary text-xs leading-relaxed text-grey-500">
          Fasilitas digital untuk memusatkan informasi dan administrasi
          praktikum di lingkungan MBC Laboratory.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {ABOUT_ITEMS.map((item, index) => {
          const Icon = item.icon;
          const isLarge = index === 0;

          return (
            <article
              key={item.title}
              className={`group relative flex flex-col justify-between overflow-hidden rounded-[32px] border border-grey-200/60 bg-white shadow-sm transition-all duration-300 hover:border-primary/20 hover:shadow-md ${
                isLarge ? "col-span-2 p-6" : "col-span-1 p-5"
              }`}
            >
              <div className="mb-6 flex items-start justify-between">
                <div
                  className={`flex shrink-0 items-center justify-center rounded-[16px] bg-primary/5 transition-colors duration-300 group-hover:bg-primary/10 ${
                    isLarge ? "h-14 w-14" : "h-12 w-12"
                  }`}
                >
                  <Icon
                    className={`text-primary ${
                      isLarge ? "h-6 w-6" : "h-5 w-5"
                    }`}
                    strokeWidth={1.5}
                  />
                </div>

                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-grey-50 text-grey-400 transition-colors duration-300 group-hover:bg-primary group-hover:text-white">
                  <ArrowUpRight className="h-4 w-4" strokeWidth={2} />
                </div>
              </div>

              <div>
                <h3
                  className={`font-bold tracking-tight text-grey-900 ${
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
