"use client";

import { useState } from "react";
import { TrendingUp, Inbox } from "lucide-react";
import { WeeklyActivityPoint } from "../types/admin-dashboard.type";

type ActivityChartProps = {
  data: WeeklyActivityPoint[];
};

const WIDTH = 640;
const HEIGHT = 200;
const PADDING = 20;

function getPoints(chartData: WeeklyActivityPoint[], maxValue: number) {
  const step = (WIDTH - PADDING * 2) / Math.max(chartData.length - 1, 1);
  const safeMax = maxValue > 0 ? maxValue : 1;

  return chartData.map((d, i) => ({
    x: PADDING + i * step,
    y: HEIGHT - PADDING - (d.value / safeMax) * (HEIGHT - PADDING * 2),
    ...d,
  }));
}

function buildSmoothPath(points: { x: number; y: number }[]) {
  if (points.length < 2) return "";
  let path = `M ${points[0].x},${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i];
    const p1 = points[i + 1];
    const midX = (p0.x + p1.x) / 2;
    path += ` C ${midX},${p0.y} ${midX},${p1.y} ${p1.x},${p1.y}`;
  }
  return path;
}

export function ActivityChart({ data }: ActivityChartProps) {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const hasActivity = data.some((d) => d.value > 0);
  const maxValue = Math.max(...data.map((d) => d.value), 0);

  const points = getPoints(data, maxValue);
  const linePath = buildSmoothPath(points);
  const areaPath = hasActivity
    ? `${linePath} L ${points[points.length - 1]?.x ?? 0},${HEIGHT - PADDING} L ${points[0]?.x ?? 0},${HEIGHT - PADDING} Z`
    : "";

  const peak = points.reduce(
    (a, b) => (b.value > a.value ? b : a),
    points[0] || { day: "-", value: 0 },
  );

  return (
    <div className="flex h-full min-h-[280px] w-full flex-col overflow-hidden rounded-[32px] border border-white/60 bg-white/60 p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-2xl">
      {/* Header */}
      <div className="mb-2 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-medium tracking-tighter text-grey-900">
            Aktivitas Praktikum
          </h2>
          <p className="mt-0.5 font-secondary text-[13px] tracking-tight text-grey-500">
            Total pengumpulan TP & pengerjaan TA — 7 hari terakhir
          </p>
        </div>

        {hasActivity && (
          <div className="flex items-center gap-1.5 rounded-full bg-success/10 px-3 py-1.5 text-[12px] font-medium tracking-tight text-success">
            <TrendingUp className="h-3.5 w-3.5" strokeWidth={1.5} />
            <span>
              Puncak {peak.day} ({peak.value})
            </span>
          </div>
        )}
      </div>

      {/* Chart or Empty State */}
      {hasActivity ? (
        <div className="relative mt-4 flex-1">
          <svg
            viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
            className="h-full w-full overflow-visible"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0065B0" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#0065B0" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="lineStroke" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#0065B0" />
                <stop offset="100%" stopColor="#38BDF8" />
              </linearGradient>
            </defs>

            {/* grid lines */}
            {[0.25, 0.5, 0.75].map((r) => (
              <line
                key={r}
                x1={PADDING}
                x2={WIDTH - PADDING}
                y1={PADDING + r * (HEIGHT - PADDING * 2)}
                y2={PADDING + r * (HEIGHT - PADDING * 2)}
                stroke="#F0F1F3"
                strokeWidth={1}
                strokeOpacity={0.5}
              />
            ))}

            {/* area fill */}
            <path
              d={areaPath}
              fill="url(#areaFill)"
              className="transition-all duration-700 ease-out"
            />

            {/* line */}
            <path
              d={linePath}
              fill="none"
              stroke="url(#lineStroke)"
              strokeWidth={2}
              strokeLinecap="round"
              className="transition-all duration-700 ease-out"
            />

            {/* points */}
            {points.map((p, i) => (
              <g key={i}>
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={hoverIndex === i ? 6 : 4}
                  fill="#fff"
                  stroke="#0065B0"
                  strokeWidth={1.5}
                  className="cursor-pointer transition-all duration-200"
                  onMouseEnter={() => setHoverIndex(i)}
                  onMouseLeave={() => setHoverIndex(null)}
                />
                {hoverIndex === i && (
                  <>
                    <rect
                      x={p.x - 20}
                      y={p.y - 38}
                      width={40}
                      height={24}
                      rx={8}
                      fill="rgba(255, 255, 255, 0.7)"
                      stroke="rgba(255, 255, 255, 0.5)"
                      style={{ backdropFilter: "blur(8px)" }}
                    />
                    <text
                      x={p.x}
                      y={p.y - 21}
                      textAnchor="middle"
                      fontSize={12}
                      fontWeight={500}
                      fill="#0F172A"
                      letterSpacing="-0.5px"
                    >
                      {p.value}
                    </text>
                  </>
                )}
              </g>
            ))}
          </svg>
        </div>
      ) : (
        <div className="flex flex-1 flex-col items-center justify-center py-10 text-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-grey-100/50 text-grey-400 backdrop-blur-md">
            <Inbox className="h-6 w-6" strokeWidth={1.5} />
          </div>
          <p className="font-secondary text-sm font-medium tracking-tighter text-grey-700">
            Belum ada aktivitas
          </p>
          <p className="mt-1 font-secondary text-xs tracking-tight text-grey-500">
            Belum ada TP atau TA yang dikerjakan dalam 7 hari terakhir.
          </p>
        </div>
      )}

      {/* Labels */}
      <div className="mt-2 flex justify-between px-1">
        {data.map((d, i) => (
          <span
            key={i}
            className={`font-secondary text-[12px] font-medium tracking-tight transition-colors ${
              hoverIndex === i ? "text-primary" : "text-grey-400"
            }`}
          >
            {d.day}
          </span>
        ))}
      </div>
    </div>
  );
}
