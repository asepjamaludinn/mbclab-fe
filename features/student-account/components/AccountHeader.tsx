type AccountHeaderProps = {
  name?: string;
  nim?: string;
  role?: string;
  groupName?: string;
};

function getInitials(name?: string) {
  if (!name) return "P";

  return name
    .split(" ")
    .filter(Boolean)
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function AccountHeader({
  name,
  nim,
  role,
  groupName,
}: AccountHeaderProps) {
  return (
    <section className="px-5 pt-6">
      <div className="mb-5">
        <p className="font-secondary text-[11px] font-bold uppercase tracking-[0.18em] text-primary/70">
          Akun Praktikan
        </p>

        <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-grey-900">
          Profile
        </h1>

        <p className="mt-2 max-w-sm font-secondary text-sm leading-relaxed text-grey-500">
          Informasi akun, akses portal, dan pengaturan keamanan akun praktikan.
        </p>
      </div>

      <div className="relative overflow-hidden rounded-[38px] border border-white/70 bg-white/45 px-5 pb-6 pt-6 text-center shadow-[0_24px_70px_-32px_rgba(0,101,176,0.45)] backdrop-blur-2xl">
        <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-primary/20 blur-[70px]" />
        <div className="pointer-events-none absolute -bottom-24 -left-20 h-60 w-60 rounded-full bg-secondary/15 blur-[80px]" />
        <div className="pointer-events-none absolute left-1/2 top-8 h-40 w-40 -translate-x-1/2 rounded-full bg-white/60 blur-[60px]" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/80 via-white/35 to-primary/10" />

        <div className="relative z-10 flex flex-col items-center">
          <div className="flex h-28 w-28 items-center justify-center rounded-[36px] border border-white/80 bg-gradient-to-br from-primary to-secondary text-white shadow-[0_20px_50px_-20px_rgba(0,101,176,0.65)]">
            <span className="text-4xl font-extrabold tracking-tight">
              {getInitials(name)}
            </span>
          </div>

          <h2 className="mt-5 max-w-full truncate text-2xl font-extrabold tracking-tight text-grey-900">
            {name || "Praktikan"}
          </h2>

          <p className="mt-1 font-secondary text-sm font-medium text-grey-500">
            {nim || "-"} {groupName ? `• ${groupName}` : ""}
          </p>

          <div className="mt-5 flex flex-wrap justify-center gap-2">
            <span className="rounded-full border border-primary/10 bg-primary/10 px-4 py-2 font-secondary text-[11px] font-bold uppercase tracking-[0.14em] text-primary">
              {role === "ADMIN" ? "Asisten MBCLAB" : "Praktikan MBCLAB"}
            </span>

            <span className="rounded-full border border-success/10 bg-success/10 px-4 py-2 font-secondary text-[11px] font-bold uppercase tracking-[0.14em] text-success">
              Aktif
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
