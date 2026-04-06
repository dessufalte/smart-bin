"use client";

import { useEffect, useRef } from "react";
import { CHAMBER_INFO } from "@/types";
import type { TrashBinData } from "@/types";

interface ChamberGaugeProps {
  chamber: "plastik" | "kering" | "basah";
  data: TrashBinData;
}

function CircularGauge({
  percent,
  color,
  size = 120,
}: {
  percent: number;
  color: string;
  size?: number;
}) {
  const r = (size - 14) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (percent / 100) * circ;
  const cx = size / 2;
  const cy = size / 2;

  const statusColor =
    percent >= 90 ? "#ef4444" : percent >= 70 ? "#f59e0b" : color;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="progress-ring drop-shadow-lg">
      {/* Track */}
      <circle
        cx={cx} cy={cy} r={r}
        fill="none"
        stroke="rgba(255,255,255,0.06)"
        strokeWidth={10}
      />
      {/* Glow circle */}
      <circle
        cx={cx} cy={cy} r={r}
        fill="none"
        stroke={statusColor}
        strokeWidth={10}
        strokeLinecap="round"
        strokeDasharray={circ}
        strokeDashoffset={offset}
        style={{
          transition: "stroke-dashoffset 1.2s cubic-bezier(0.34,1.56,0.64,1)",
          filter: `drop-shadow(0 0 6px ${statusColor}88)`,
        }}
        opacity={0.85}
      />
      {/* Inner glow */}
      <circle
        cx={cx} cy={cy} r={r}
        fill="none"
        stroke={statusColor}
        strokeWidth={2}
        strokeLinecap="round"
        strokeDasharray={circ}
        strokeDashoffset={offset}
        style={{
          transition: "stroke-dashoffset 1.2s cubic-bezier(0.34,1.56,0.64,1)",
          filter: `blur(2px)`,
        }}
        opacity={0.4}
      />
    </svg>
  );
}

export function ChamberCard({ chamber, data }: ChamberGaugeProps) {
  const info = CHAMBER_INFO[chamber];

  const capacityMap = {
    plastik: data.capacity_plastic,
    kering: data.capacity_dry,
    basah: data.capacity_wet,
  };

  const countMap = {
    plastik: data.count_plastic,
    kering: data.count_cardboard + data.count_glass + data.count_metal + data.count_paper,
    basah: data.count_trash,
  };

  const labelMap = {
    plastik: ["Plastik"],
    kering: ["Kardus", "Kaca", "Logam", "Kertas"],
    basah: ["Organik"],
  };

  const countDetailMap = {
    plastik: [{ label: "Plastik", count: data.count_plastic, color: "#22d3ee" }],
    kering: [
      { label: "Kardus", count: data.count_cardboard, color: "#fb923c" },
      { label: "Kaca",   count: data.count_glass,     color: "#a78bfa" },
      { label: "Logam",  count: data.count_metal,     color: "#94a3b8" },
      { label: "Kertas", count: data.count_paper,     color: "#fbbf24" },
    ],
    basah: [{ label: "Organik", count: data.count_trash, color: "#4ade80" }],
  };

  const capacity = capacityMap[chamber];
  const total = countMap[chamber];
  const details = countDetailMap[chamber];

  const statusLabel =
    capacity >= 90 ? "Penuh" : capacity >= 70 ? "Hampir Penuh" : "Normal";
  const statusClass =
    capacity >= 90 ? "badge-danger" : capacity >= 70 ? "badge-warning" : "badge-normal";

  return (
    <div
      className={`glass rounded-2xl p-5 border bg-gradient-to-br ${info.bgClass} ${info.borderClass} relative overflow-hidden group transition-all duration-300 hover:scale-[1.01]`}
      id="chamber-cards"
    >
      {/* BG glow blob */}
      <div
        className="absolute -right-8 -bottom-8 w-32 h-32 rounded-full opacity-10 blur-2xl pointer-events-none transition-all duration-500 group-hover:opacity-20"
        style={{ background: info.color }}
      />

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-xl">{info.icon}</span>
          <div>
            <p className="font-display font-bold text-white text-sm">{info.label}</p>
            <p className="text-white/40 text-[10px] font-body">{labelMap[chamber].join(" · ")}</p>
          </div>
        </div>
        <span className={`${statusClass} text-[10px] font-medium px-2 py-0.5 rounded-lg`}>
          {statusLabel}
        </span>
      </div>

      {/* Gauge + number */}
      <div className="flex items-center gap-4">
        <div className="relative flex-shrink-0">
          <CircularGauge percent={capacity} color={info.color} size={110} />
          {/* Center text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-display font-extrabold text-white text-xl leading-none">{capacity}%</span>
            <span className="text-white/40 text-[9px] font-body mt-0.5">kapasitas</span>
          </div>
        </div>

        {/* Detail counts */}
        <div className="flex-1 space-y-2">
          {details.map((d) => (
            <div key={d.label}>
              <div className="flex justify-between items-center mb-0.5">
                <span className="text-white/60 text-[11px] font-body">{d.label}</span>
                <span className="text-white font-display font-bold text-xs">{d.count}</span>
              </div>
              <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-1000"
                  style={{
                    width: `${total > 0 ? Math.round((d.count / total) * 100) : 0}%`,
                    background: d.color,
                    boxShadow: `0 0 6px ${d.color}66`,
                  }}
                />
              </div>
            </div>
          ))}
          <p className="text-white/30 text-[10px] font-body pt-1 border-t border-white/10">
            Total: <span className="text-white/60 font-bold">{total}</span> item
          </p>
        </div>
      </div>
    </div>
  );
}
