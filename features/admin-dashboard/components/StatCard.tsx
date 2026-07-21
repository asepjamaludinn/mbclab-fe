import { ArrowUpRight, LucideIcon } from "lucide-react";

type StatCardProps = {
  title: string;
  value: number;
  trendText: string;
  trendIcon: LucideIcon;
  variant?: "primary" | "default";
  trendColor?: "success" | "warning" | "error" | "default";
};

export function StatCard({
  title,
  value,
  trendText,
  trendIcon: TrendIcon,
  variant = "default",
  trendColor = "default",
}: StatCardProps) {
  const isPrimary = variant === "primary";

  const badgeStyle = () => {
    if (isPrimary) {
      return "bg-white/15 text-white border border-white/10";
    }

    switch (trendColor) {
      case "success":
        return "bg-success/10 text-success border border-success/10";

      case "warning":
        return "bg-warning/10 text-warning border border-warning/10";

      case "error":
        return "bg-error/10 text-error border border-error/10";

      default:
        return "bg-grey-100/50 text-grey-600 border border-grey-200/50";
    }
  };

  return (
    <div
      className={`group relative flex h-[180px] w-full min-w-0 flex-col justify-between overflow-hidden rounded-[28px] border p-5 transition-all duration-500 backdrop-blur-2xl ${
        isPrimary
          ? "border-white/20 bg-primary text-white shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:bg-primary/90"
          : "border-white/60 bg-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:bg-white/80"
      }`}
    >
      {/* Decorative Blur */}
      {isPrimary && (
        <>
          <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/15 blur-3xl transition-opacity duration-700 group-hover:opacity-100 opacity-80" />
          <div className="absolute -bottom-16 left-0 h-32 w-32 rounded-full bg-white/10 blur-3xl transition-opacity duration-700 group-hover:opacity-100 opacity-60" />
        </>
      )}

      {/* Header */}
      <div className="relative z-10 flex items-start justify-between">
        <div>
          <p
            className={`text-[15px] font-medium tracking-tight ${
              isPrimary ? "text-white/90" : "text-grey-700"
            }`}
          >
            {title}
          </p>
        </div>

        <div
          className={`flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300 ${
            isPrimary
              ? "bg-white/10 text-white backdrop-blur-md"
              : "border border-white/50 bg-white/40 text-grey-500 backdrop-blur-md group-hover:border-primary/30 group-hover:text-primary"
          }`}
        >
          <ArrowUpRight className="h-5 w-5" strokeWidth={1.5} />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex items-end justify-between">
        <div>
          <h2
            className={`leading-none font-medium tracking-tighter ${
              isPrimary ? "text-white text-5xl" : "text-grey-900 text-5xl"
            }`}
          >
            {value}
          </h2>

          <div
            className={`mt-3 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium tracking-tight backdrop-blur-md ${badgeStyle()}`}
          >
            <TrendIcon className="h-3.5 w-3.5" strokeWidth={1.5} />
            <span>{trendText}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
