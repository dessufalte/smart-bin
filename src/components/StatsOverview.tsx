"use client";

import { Package, Recycle, Leaf, BarChart2, AlertCircle } from "lucide-react";
import type { TrashBinData } from "@/types";

interface StatsOverviewProps {
  data: TrashBinData;
  binId: string;
}

export function StatsOverview({ data, binId }: StatsOverviewProps) {
  const totalItems =
    data.count_plastic +
    data.count_cardboard +
    data.count_glass +
    data.count_metal +
    data.count_paper +
    data.count_trash;

  const avgCapacity = Math.round(
    (data.capacity_plastic + data.capacity_wet + data.capacity_dry) / 3
  );

  const mostFull = [
    { label: "Plastik", val: data.capacity_plastic },
    { label: "Kering",  val: data.capacity_dry },
    { label: "Basah",   val: data.capacity_wet },
  ].sort((a, b) => b.val - a.val)[0];

  const alerts =
    (data.capacity_plastic >= 90 ? 1 : 0) +
    (data.capacity_dry >= 90 ? 1 : 0) +
    (data.capacity_wet >= 90 ? 1 : 0) +
    (data.air_quality !== "Normal" ? 1 : 0);

  const cards = [
    {
      icon: Package,
      label: "Total Item Terdeteksi",
      value: totalItems,
      unit: "item",
      color: "#22d3ee",
      bg: "from-cyan-500/10 to-cyan-600/5",
      border: "border-cyan-500/20",
    },
    {
      icon: BarChart2,
      label: "Rata-rata Kapasitas",
      value: `${avgCapacity}%`,
      unit: "dari 3 chamber",
      color: "#a78bfa",
      bg: "from-violet-500/10 to-violet-600/5",
      border: "border-violet-500/20",
    },
    {
      icon: Recycle,
      label: "Paling Penuh",
      value: mostFull.label,
      unit: `${mostFull.val}%`,
      color: "#fb923c",
      bg: "from-orange-500/10 to-orange-600/5",
      border: "border-orange-500/20",
    },
    {
      icon: alerts > 0 ? AlertCircle : Leaf,
      label: alerts > 0 ? "Peringatan Aktif" : "Semua Aman",
      value: alerts > 0 ? alerts : "✓",
      unit: alerts > 0 ? "kondisi perlu perhatian" : "tidak ada peringatan",
      color: alerts > 0 ? "#f87171" : "#4ade80",
      bg: alerts > 0 ? "from-red-500/10 to-red-600/5" : "from-green-500/10 to-green-600/5",
      border: alerts > 0 ? "border-red-500/20" : "border-green-500/20",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.label}
            className={`glass rounded-2xl p-4 border bg-gradient-to-br ${card.bg} ${card.border} transition-all duration-300 hover:scale-[1.02] group`}
          >
            <div className="flex items-start justify-between mb-3">
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center"
                style={{ background: `${card.color}18` }}
              >
                <Icon size={16} style={{ color: card.color }} />
              </div>
            </div>
            <p
              className="font-display font-extrabold text-2xl leading-none mb-1"
              style={{ color: card.color }}
            >
              {card.value}
            </p>
            <p className="text-white/60 text-[10px] font-body">{card.unit}</p>
            <p className="text-white/30 text-[9px] font-body mt-1 line-clamp-1">{card.label}</p>
          </div>
        );
      })}
    </div>
  );
}
