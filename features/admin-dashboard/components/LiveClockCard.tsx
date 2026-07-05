"use client";

import { useEffect, useState } from "react";
import { Clock3 } from "lucide-react";

export function LiveClockCard() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const timeString = now
    ? now.toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })
    : "--:--:--";

  const dateString = now
    ? now.toLocaleDateString("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "";

  return (
    <div className="relative flex h-full min-h-[140px] w-full flex-col justify-between overflow-hidden rounded-2xl border border-primary bg-primary p-5 text-white shadow-md shadow-primary/20">
      <div className="flex items-start justify-between">
        <p className="font-secondary text-sm font-medium text-white/80">
          Waktu Saat Ini (WIB)
        </p>
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/20 bg-white/10">
          <Clock3 className="h-4 w-4 text-white" strokeWidth={2.5} />
        </div>
      </div>

      <div className="mt-2">
        <h2 className="font-primary text-3xl font-extrabold tracking-tight tabular-nums text-white">
          {timeString}
        </h2>
        <p className="mt-2 font-secondary text-[11px] font-semibold text-white/80">
          {dateString}
        </p>
      </div>
    </div>
  );
}
