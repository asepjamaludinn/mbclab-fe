import { User } from "lucide-react";

type AccountHeaderProps = {
  name?: string;
  nim?: string;
};

export function AccountHeader({ name, nim }: AccountHeaderProps) {
  return (
    <section className="relative overflow-hidden rounded-b-[40px] bg-primary px-4 pb-20 pt-5 text-white shadow-sm">
      <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-white/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-20 h-64 w-64 rounded-full bg-secondary/40 blur-3xl" />

      <div className="relative z-10 mt-6 text-center">
        <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-white/20 p-2 shadow-lg backdrop-blur-md">
          <User className="h-10 w-10 text-white" strokeWidth={1.5} />
        </div>
        <h1 className="text-2xl font-bold leading-tight text-white">
          {name || "Pengguna"}
        </h1>
        <p className="mt-1 font-secondary text-sm text-white/80">
          NIM: {nim || "-"}
        </p>
        <div className="mt-3 inline-block rounded-full border border-success/40 bg-success/20 px-3 py-1 font-secondary text-[10px] font-bold uppercase tracking-wider text-white">
          Praktikan MBCLAB
        </div>
      </div>
    </section>
  );
}
