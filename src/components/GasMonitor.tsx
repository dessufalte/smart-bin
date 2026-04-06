"use client";

import { Wind, AlertTriangle, CheckCircle, XCircle, Thermometer } from "lucide-react";
import type { TrashBinData, AirQualityStatus } from "@/types";

interface GasMonitorProps {
  data: TrashBinData;
}

const THRESHOLDS = {
  normal:  { max: 150, label: "Normal",    color: "#4ade80", icon: CheckCircle,    badge: "badge-normal" },
  warning: { max: 300, label: "Peringatan", color: "#fbbf24", icon: AlertTriangle,  badge: "badge-warning" },
  danger:  { max: Infinity, label: "Berbahaya", color: "#f87171", icon: XCircle,   badge: "badge-danger" },
};

function getStatus(ppm: number) {
  if (ppm < 150) return THRESHOLDS.normal;
  if (ppm < 300) return THRESHOLDS.warning;
  return THRESHOLDS.danger;
}

function GaugeBar({ ppm, max = 500 }: { ppm: number; max?: number }) {
  const pct = Math.min((ppm / max) * 100, 100);
  const status = getStatus(ppm);

  // Segment thresholds
  const normalPct = (150 / max) * 100;
  const warningPct = (300 / max) * 100;

  return (
    <div className="space-y-2">
      {/* Bar */}
      <div className="relative h-4 bg-white/[0.06] rounded-full overflow-hidden border border-white/[0.08]">
        {/* Zone markers */}
        <div className="absolute inset-0 flex">
          <div className="h-full bg-green-500/15" style={{ width: `${normalPct}%` }} />
          <div className="h-full bg-yellow-500/15" style={{ width: `${warningPct - normalPct}%` }} />
          <div className="h-full bg-red-500/15 flex-1" />
        </div>
        {/* Fill */}
        <div
          className="absolute left-0 top-0 h-full rounded-full transition-all duration-1000"
          style={{
            width: `${pct}%`,
            background: `linear-gradient(90deg, #4ade80, ${status.color})`,
            boxShadow: `0 0 10px ${status.color}88`,
          }}
        />
        {/* Threshold lines */}
        {[normalPct, warningPct].map((p, i) => (
          <div
            key={i}
            className="absolute top-0 bottom-0 w-px bg-white/20"
            style={{ left: `${p}%` }}
          />
        ))}
      </div>

      {/* Scale labels */}
      <div className="flex justify-between text-[9px] text-white/30 font-body">
        <span>0</span>
        <span className="text-green-400/60">150</span>
        <span className="text-yellow-400/60">300</span>
        <span>{max}+ ppm</span>
      </div>
    </div>
  );
}

export function GasMonitor({ data }: GasMonitorProps) {
  const status = getStatus(data.gas_level);
  const StatusIcon = status.icon;

  const tips: Record<AirQualityStatus, string> = {
    Normal:      "Kondisi udara di dalam tempat sampah baik. Tidak terdeteksi indikasi pembusukan.",
    Peringatan:  "Terdeteksi peningkatan gas. Sampah organik mulai terurai – pertimbangkan pengangkutan segera.",
    Berbahaya:   "Konsentrasi gas tinggi! Pembusukan aktif terdeteksi. Segera angkut sampah organik.",
  };

  return (
    <div className="glass rounded-2xl p-5 border border-white/[0.08]" id="gas-monitor">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-white/[0.07] flex items-center justify-center">
            <Wind size={16} className="text-eco-400" />
          </div>
          <div>
            <h3 className="font-display font-bold text-white text-base">Kualitas Udara</h3>
            <p className="text-white/40 text-[10px] font-body">Sensor Gas MQ-135</p>
          </div>
        </div>
        <span className={`${status.badge} flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-lg`}>
          <StatusIcon size={11} />
          {status.label}
        </span>
      </div>

      {/* PPM Reading */}
      <div className="flex items-end gap-3 mb-5">
        <div>
          <span
            className="font-display font-extrabold text-5xl leading-none"
            style={{ color: status.color, textShadow: `0 0 20px ${status.color}55` }}
          >
            {data.gas_level.toFixed(1)}
          </span>
          <span className="text-white/40 text-sm font-body ml-2">PPM</span>
        </div>
        <div className="pb-1">
          <StatusIcon size={22} style={{ color: status.color }} />
        </div>
      </div>

      {/* Gauge bar */}
      <GaugeBar ppm={data.gas_level} />

      {/* Tip */}
      <div
        className="mt-4 rounded-xl p-3 text-xs font-body leading-relaxed"
        style={{
          background: `${status.color}12`,
          borderLeft: `3px solid ${status.color}60`,
        }}
      >
        <p style={{ color: status.color }} className="font-medium mb-0.5">
          {status.label === "Normal" ? "✅" : status.label === "Peringatan" ? "⚠️" : "🚨"} Keterangan
        </p>
        <p className="text-white/55">{tips[data.air_quality]}</p>
      </div>

      {/* Legend */}
      <div className="flex gap-3 mt-4 pt-3 border-t border-white/[0.06]">
        {[
          { label: "Normal", range: "< 150", color: "#4ade80" },
          { label: "Peringatan", range: "150–300", color: "#fbbf24" },
          { label: "Berbahaya", range: "> 300", color: "#f87171" },
        ].map((z) => (
          <div key={z.label} className="flex items-center gap-1.5 text-[10px] font-body">
            <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: z.color }} />
            <span className="text-white/40">{z.label}</span>
            <span style={{ color: z.color }}>{z.range}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
