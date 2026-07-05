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
        return "bg-success/10 text-success";

      case "warning":
        return "bg-warning/10 text-warning";

      case "error":
        return "bg-error/10 text-error";

      default:
        return "bg-grey-100 text-grey-600";
    }
  };

  return (
    <div
      className={`group relative flex h-[180px] w-full min-w-0  flex-col justify-between overflow-hidden rounded-[28px] border p-5 transition-all duration-300 ${
        isPrimary
          ? "border-primary bg-primary text-white shadow-lg shadow-primary/15"
          : "border-grey-200 bg-white shadow-sm hover:shadow-md"
      }`}
    >
      {/* Decorative Blur */}
      {isPrimary && (
        <>
          <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-16 left-0 h-32 w-32 rounded-full bg-white/5 blur-3xl" />
        </>
      )}

      {/* Header */}
      <div className="relative z-10 flex items-start justify-between">
        <div>
          <p
            className={`text-[15px] font-semibold ${
              isPrimary ? "text-white/85" : "text-grey-700"
            }`}
          >
            {title}
          </p>
        </div>

        <div
          className={`flex h-10 w-10 items-center justify-center rounded-full transition-all ${
            isPrimary
              ? "bg-white text-primary"
              : "border border-grey-200 bg-white text-grey-500 group-hover:border-primary group-hover:text-primary"
          }`}
        >
          <ArrowUpRight className="h-5 w-5" strokeWidth={2.4} />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex items-end justify-between">
        <div>
          <h2
            className={`leading-none font-black tracking-tight ${
              isPrimary ? "text-white text-5xl" : "text-grey-900 text-5xl"
            }`}
          >
            {value}
          </h2>

          <div
            className={`mt-3 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold ${badgeStyle()}`}
          >
            <TrendIcon className="h-3.5 w-3.5" strokeWidth={2.5} />
            <span>{trendText}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
