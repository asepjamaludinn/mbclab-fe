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
    <section className="px-5 pt-8 text-white">
      <div className="mb-6">
        <h1 className="max-w-[280px] text-[42px] font-extrabold leading-[1.02] tracking-[-0.04em]">
          Akun
          <br />
          Praktikan
        </h1>

        <p className="mt-4 max-w-[310px] font-secondary text-sm leading-relaxed text-white/75">
          Kelola informasi akun, akses portal, dan keamanan akun praktikan.
        </p>
      </div>

      <div className="relative overflow-hidden rounded-[36px] border border-white/35 bg-white/20 p-5 shadow-[0_24px_60px_-38px_rgba(0,101,176,0.55)] backdrop-blur-2xl">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.28)_0%,rgba(234,248,255,0.16)_55%,rgba(215,247,255,0.18)_100%)]" />
        <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-primary/10 blur-[70px]" />
        <div className="pointer-events-none absolute -bottom-24 -left-20 h-60 w-60 rounded-full bg-secondary/10 blur-[80px]" />

        <div className="relative z-10 flex items-center gap-4">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-[28px] border border-white/45 bg-primary/80 text-white shadow-[0_16px_35px_-22px_rgba(0,101,176,0.9)] backdrop-blur-xl">
            <span className="text-2xl font-extrabold tracking-tight">
              {getInitials(name)}
            </span>
          </div>

          <div className="min-w-0 flex-1">
            <p className="font-secondary text-[11px] font-bold uppercase tracking-[0.14em] text-primary">
              {role === "ADMIN" ? "Asisten MBCLAB" : "Praktikan MBCLAB"}
            </p>

            <h2 className="mt-1 truncate text-2xl font-extrabold tracking-tight text-grey-900">
              {name || "..."}
            </h2>

            <p className="mt-1 truncate font-secondary text-xs font-semibold text-grey-600">
              {nim || "-"} {groupName ? `• ${groupName}` : ""}
            </p>

            <div className="mt-3 inline-flex rounded-full border border-white/45 bg-white/25 px-3 py-1 font-secondary text-[10px] font-bold text-success shadow-sm backdrop-blur-xl">
              Aktif
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
