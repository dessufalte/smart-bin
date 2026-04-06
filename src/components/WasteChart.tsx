"use client";

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, PieChart, Pie, Legend,
} from "recharts";
import { TRASHNET_LABELS } from "@/types";
import type { TrashBinData } from "@/types";
import { useState } from "react";

interface WasteChartProps {
  data: TrashBinData;
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const item = payload[0];
    return (
      <div className="glass border border-white/15 rounded-xl px-3 py-2 text-xs font-body">
        <p className="text-white font-bold">{item.payload.label}</p>
        <p style={{ color: item.payload.color }}>
          {item.value} item ({item.payload.pct}%)
        </p>
      </div>
    );
  }
  return null;
};

const CustomPieTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass border border-white/15 rounded-xl px-3 py-2 text-xs font-body">
        <p className="text-white font-bold">{payload[0].name}</p>
        <p style={{ color: payload[0].payload.color }}>
          {payload[0].value} item · {payload[0].payload.pct}%
        </p>
      </div>
    );
  }
  return null;
};

export function WasteChart({ data }: WasteChartProps) {
  const [view, setView] = useState<"bar" | "pie">("bar");

  const counts: Record<string, number> = {
    plastic:   data.count_plastic,
    cardboard: data.count_cardboard,
    glass:     data.count_glass,
    metal:     data.count_metal,
    paper:     data.count_paper,
    trash:     data.count_trash,
  };

  const total = Object.values(counts).reduce((a, b) => a + b, 0) || 1;

  const chartData = TRASHNET_LABELS.map((l) => ({
    key: l.key,
    label: l.label,
    emoji: l.emoji,
    value: counts[l.key] ?? 0,
    color: l.color,
    pct: total > 0 ? Math.round(((counts[l.key] ?? 0) / total) * 100) : 0,
    chamber: l.chamber,
  }));

  const pieData = chartData.filter((d) => d.value > 0);

  return (
    <div className="glass rounded-2xl p-5 border border-white/[0.08]" id="waste-chart">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="font-display font-bold text-white text-base">Distribusi Sampah</h3>
          <p className="text-white/40 text-xs font-body mt-0.5">
            Klasifikasi oleh MobileNetV2 · TrashNet Dataset
          </p>
        </div>
        <div className="flex gap-1 bg-white/[0.05] rounded-xl p-1 border border-white/[0.08]">
          {(["bar", "pie"] as const).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`px-3 py-1 rounded-lg text-xs font-body transition-all ${
                view === v
                  ? "bg-eco-500/30 text-eco-300 border border-eco-500/30"
                  : "text-white/40 hover:text-white/60"
              }`}
            >
              {v === "bar" ? "Batang" : "Lingkaran"}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="h-52">
        {view === "bar" ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 4, right: 4, bottom: 4, left: -20 }} barCategoryGap="30%">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis
                dataKey="emoji"
                tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 16 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10, fontFamily: "DM Sans" }}
                axisLine={false}
                tickLine={false}
                allowDecimals={false}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
              <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={40}>
                {chartData.map((entry, i) => (
                  <Cell
                    key={i}
                    fill={entry.color}
                    fillOpacity={0.85}
                    style={{ filter: `drop-shadow(0 0 6px ${entry.color}55)` }}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData.length > 0 ? pieData : [{ label: "Belum ada data", value: 1, color: "#334155", pct: 100 }]}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={80}
                paddingAngle={3}
                dataKey="value"
                nameKey="label"
              >
                {(pieData.length > 0 ? pieData : [{ color: "#334155" }]).map((entry, i) => (
                  <Cell
                    key={i}
                    fill={entry.color}
                    fillOpacity={0.85}
                    style={{ filter: `drop-shadow(0 0 5px ${entry.color}55)` }}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomPieTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Legend */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mt-4 pt-4 border-t border-white/[0.06]">
        {chartData.map((d) => (
          <div key={d.key} className="flex flex-col items-center gap-1">
            <span className="text-base">{d.emoji}</span>
            <span className="text-[10px] font-body" style={{ color: d.color }}>{d.label}</span>
            <span className="font-display font-bold text-white text-xs">{d.value}</span>
            <span className="text-white/30 text-[10px]">{d.pct}%</span>
          </div>
        ))}
      </div>

      {/* Total */}
      <div className="mt-3 flex justify-between items-center text-xs font-body">
        <span className="text-white/30">Total Teridentifikasi</span>
        <span className="text-eco-400 font-bold font-display">{total - (total === 1 ? 1 : 0)} item</span>
      </div>
    </div>
  );
}
