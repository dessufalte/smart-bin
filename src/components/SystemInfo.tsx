"use client";

import { Cpu, Camera, Zap, Database, RefreshCw } from "lucide-react";
import type { TrashBinData } from "@/types";
import { formatDistanceToNow, format } from "date-fns";
import { id as localeId } from "date-fns/locale";

interface SystemInfoProps {
  binId: string;
  data: TrashBinData;
  onRefresh?: () => void;
}

const specs = [
  { icon: Cpu,      label: "Prosesor",   value: "Raspberry Pi 4B" },
  { icon: Camera,   label: "Kamera",     value: "Pi Camera V2 (8MP)" },
  { icon: Zap,      label: "Model ML",   value: "MobileNetV2 · TrashNet" },
  { icon: Database, label: "Database",   value: "Firebase Realtime DB" },
];

export function SystemInfo({ binId, data, onRefresh }: SystemInfoProps) {
  const updateDate = data.last_update ? new Date(data.last_update) : new Date();

  return (
    <div className="glass rounded-2xl p-5 border border-white/[0.08]">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-display font-bold text-white text-base">Informasi Sistem</h3>
          <p className="text-white/40 text-[10px] font-body">{binId.replace("trashbin_", "").replace("id", "ID-").toUpperCase()}</p>
        </div>
        <button
          onClick={onRefresh}
          className="w-7 h-7 rounded-lg bg-white/[0.05] hover:bg-white/[0.10] border border-white/[0.08] flex items-center justify-center text-white/40 hover:text-eco-400 transition-all"
          title="Refresh"
        >
          <RefreshCw size={13} />
        </button>
      </div>

      {/* Specs */}
      <div className="space-y-2.5 mb-4">
        {specs.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-lg bg-eco-500/10 flex items-center justify-center flex-shrink-0">
                <Icon size={12} className="text-eco-400" />
              </div>
              <span className="text-white/40 text-xs font-body flex-1">{s.label}</span>
              <span className="text-white/80 text-xs font-body font-medium">{s.value}</span>
            </div>
          );
        })}
      </div>

      {/* Divider */}
      <div className="border-t border-white/[0.06] pt-3 space-y-1.5">
        <div className="flex justify-between text-[11px] font-body">
          <span className="text-white/40">Lokasi</span>
          <span className="text-white/70">{data.location}</span>
        </div>
        <div className="flex justify-between text-[11px] font-body">
          <span className="text-white/40">Status</span>
          <span className={data.is_active ? "text-eco-400" : "text-red-400"}>
            {data.is_active ? "● Aktif" : "● Tidak Aktif"}
          </span>
        </div>
        <div className="flex justify-between text-[11px] font-body">
          <span className="text-white/40">Update Terakhir</span>
          <span className="text-white/70">
            {formatDistanceToNow(updateDate, { addSuffix: true, locale: localeId })}
          </span>
        </div>
        <div className="flex justify-between text-[11px] font-body">
          <span className="text-white/40">Timestamp</span>
          <span className="text-white/40 text-[10px]">
            {format(updateDate, "dd MMM yyyy · HH:mm")}
          </span>
        </div>
      </div>

      {/* Chamber health summary */}
      <div className="mt-4 pt-3 border-t border-white/[0.06]">
        <p className="text-white/40 text-[10px] font-body mb-2">Kesehatan Chamber</p>
        <div className="flex gap-2">
          {[
            { name: "Plastik", val: data.capacity_plastic, color: "#22d3ee" },
            { name: "Kering",  val: data.capacity_dry,     color: "#fb923c" },
            { name: "Basah",   val: data.capacity_wet,     color: "#4ade80" },
          ].map((c) => (
            <div key={c.name} className="flex-1 text-center">
              <div className="text-[9px] text-white/30 font-body mb-1">{c.name}</div>
              <div
                className="font-display font-bold text-sm"
                style={{ color: c.val >= 90 ? "#f87171" : c.val >= 70 ? "#fbbf24" : c.color }}
              >
                {c.val}%
              </div>
              <div className="h-1 bg-white/[0.06] rounded-full mt-1 overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${c.val}%`,
                    background: c.val >= 90 ? "#f87171" : c.val >= 70 ? "#fbbf24" : c.color,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
