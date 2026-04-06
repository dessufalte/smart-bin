"use client";

import { useState, useEffect } from "react";
import { Lightbulb, Wind, ShieldOff, Lock, Settings2, Save, CheckCircle, Loader2 } from "lucide-react";
import { useControl } from "@/hooks/useControl";
import { Toggle, Slider, Segmented, ControlSection, ValueRow, NumberInput } from "./ui/Controls";
import type { SpreadSettings, ControlState } from "@/types";

interface ControlPanelProps {
  binId: string;
  capacity_plastic: number;
  capacity_wet: number;
  capacity_dry: number;
}

type SaveState = "idle" | "saving" | "saved";

function useSave() {
  const [state, setState] = useState<SaveState>("idle");
  const trigger = async (fn: () => Promise<void>) => {
    setState("saving");
    try { await fn(); setState("saved"); setTimeout(() => setState("idle"), 2000); }
    catch { setState("idle"); }
  };
  return { state, trigger };
}

// ── Spreader sub-card ─────────────────────────────────────

interface SpreaderCardProps {
  label: string;
  emoji: string;
  color: string;
  value: SpreadSettings;
  disabled?: boolean;
  onChange: (v: Partial<SpreadSettings>) => void;
}

function SpreaderCard({ label, emoji, color, value, disabled, onChange }: SpreaderCardProps) {
  return (
    <div
      className="rounded-2xl p-4 border space-y-3 transition-all"
      style={{
        background: `${color}09`,
        borderColor: value.enabled ? `${color}33` : "rgba(255,255,255,0.06)",
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg">{emoji}</span>
          <span className="font-display font-bold text-white text-sm">{label}</span>
        </div>
        <Toggle
          checked={value.enabled}
          onChange={(v) => onChange({ enabled: v })}
          disabled={disabled}
          colorOn={color}
          size="sm"
        />
      </div>

      <div className={`space-y-3 transition-opacity ${(!value.enabled || disabled) ? "opacity-30 pointer-events-none" : ""}`}>
        {/* Mode */}
        <div>
          <p className="text-white/35 text-[10px] font-body mb-1.5">Mode Operasi</p>
          <Segmented
            value={value.mode}
            onChange={(v) => onChange({ mode: v })}
            options={[
              { value: "speed",     label: "Kecepatan", icon: "⚡" },
              { value: "compactor", label: "Kompactor",  icon: "🔄" },
            ]}
            color={color}
            disabled={!value.enabled || disabled}
          />
        </div>

        {/* Direction */}
        <div>
          <p className="text-white/35 text-[10px] font-body mb-1.5">Arah Putaran</p>
          <Segmented
            value={value.direction}
            onChange={(v) => onChange({ direction: v })}
            options={[
              { value: "clockwise",      label: "Searah Jarum",   icon: "↻" },
              { value: "back_and_forth", label: "Maju Mundur",    icon: "↔" },
            ]}
            color={color}
            disabled={!value.enabled || disabled}
          />
        </div>

        {/* Speed */}
        <div>
          <div className="flex justify-between mb-1.5">
            <p className="text-white/35 text-[10px] font-body">Kecepatan Manual</p>
            <span className="text-[10px] font-display font-bold" style={{ color }}>{value.speed}%</span>
          </div>
          <Slider
            value={value.speed}
            onChange={(v) => onChange({ speed: v })}
            color={color}
            disabled={!value.enabled || disabled}
          />
        </div>
      </div>
    </div>
  );
}

// ── Main Control Panel ────────────────────────────────────

export function ControlPanel({ binId, capacity_plastic, capacity_wet, capacity_dry }: ControlPanelProps) {
  const { control, loading, updateControl, triggerEmergencyStop, releaseEmergencyStop } = useControl(binId);
  const [local, setLocal] = useState<ControlState | null>(null);
  const { state: saveState, trigger: doSave } = useSave();

  // Sync local state when Firebase data arrives
  useEffect(() => {
    if (control) setLocal(control);
  }, [control]);

  if (loading || !local) {
    return (
      <div className="flex items-center justify-center h-48 text-white/30">
        <Loader2 className="animate-spin mr-2" size={18} /> Memuat konfigurasi…
      </div>
    );
  }

  const set = (patch: Partial<ControlState>) => setLocal((prev) => prev ? { ...prev, ...patch } : prev);
  const setSpreader = (chamber: "plastic" | "wet" | "dry", patch: Partial<SpreadSettings>) =>
    setLocal((prev) => {
      if (!prev) return prev;
      const key = `spreader_${chamber}` as keyof ControlState;
      return { ...prev, [key]: { ...(prev[key] as SpreadSettings), ...patch } };
    });

  const handleSave = () =>
    doSave(async () => {
      if (local) await updateControl(local);
    });

  const isEmergency = local.emergency_stop;

  return (
    <div className="space-y-4">

      {/* ── Emergency Stop Banner ── */}
      {isEmergency && (
        <div className="glass rounded-2xl p-4 border border-red-500/40 flex items-center justify-between gap-4 bg-red-500/10"
          style={{ boxShadow: "0 0 30px rgba(239,68,68,0.15)" }}>
          <div>
            <p className="text-red-400 font-display font-bold text-sm">🚨 EMERGENCY STOP AKTIF</p>
            <p className="text-red-300/60 text-xs font-body mt-0.5">Semua aktuator dihentikan. Tutup terkunci.</p>
          </div>
          <button
            onClick={() => { releaseEmergencyStop(); set({ emergency_stop: false }); }}
            className="bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 text-red-300 text-xs font-body px-4 py-2 rounded-xl transition-all flex-shrink-0"
          >
            Reset
          </button>
        </div>
      )}

      <div className={`grid grid-cols-1 lg:grid-cols-2 gap-4 ${isEmergency ? "opacity-40 pointer-events-none" : ""}`}>

        {/* ── Pencahayaan SMD ── */}
        <ControlSection title="Pencahayaan SMD 5730" subtitle="Lampu area sorter dish" icon={<Lightbulb size={16} />} color="#fbbf24">
          <ValueRow label="Status Lampu">
            <div className="flex justify-end">
              <Toggle checked={local.light_enabled} onChange={(v) => set({ light_enabled: v })} colorOn="#fbbf24" label={local.light_enabled ? "Menyala" : "Mati"} />
            </div>
          </ValueRow>
          <ValueRow label="Kecerahan">
            <Slider
              value={local.light_brightness}
              onChange={(v) => set({ light_brightness: v })}
              disabled={!local.light_enabled}
              color="#fbbf24"
            />
          </ValueRow>
          <div className="mt-3 rounded-xl overflow-hidden border border-yellow-500/10">
            <div className="h-2 bg-white/[0.04]">
              <div
                className="h-full transition-all duration-300 rounded-full"
                style={{
                  width: local.light_enabled ? `${local.light_brightness}%` : "0%",
                  background: "linear-gradient(90deg, #78350f, #fbbf24)",
                  boxShadow: local.light_enabled ? "0 0 8px #fbbf2488" : "none",
                }}
              />
            </div>
          </div>
        </ControlSection>

        {/* ── Pan-Tilt Servo ── */}
        <ControlSection title="Servo Pan-Tilt Kamera" subtitle="Raspberry Pi Camera V2 · gimbal" icon={<Wind size={16} />} color="#22d3ee">
          <ValueRow label="Kecepatan Pan-Tilt">
            <Slider value={local.pan_tilt_speed} onChange={(v) => set({ pan_tilt_speed: v })} color="#22d3ee" />
          </ValueRow>
          <div className="mt-3 grid grid-cols-3 gap-2 text-center text-[10px] font-body">
            {[["Lambat", 25], ["Sedang", 50], ["Cepat", 80]].map(([label, val]) => (
              <button
                key={label}
                onClick={() => set({ pan_tilt_speed: val as number })}
                className={`py-1.5 rounded-lg border transition-all ${
                  Math.abs(local.pan_tilt_speed - (val as number)) < 15
                    ? "border-cyan-500/40 bg-cyan-500/15 text-cyan-300"
                    : "border-white/[0.06] bg-white/[0.03] text-white/40 hover:text-white/60"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </ControlSection>

        {/* ── Disinfektan ── */}
        <ControlSection title="Sistem Disinfektan" subtitle="Semprotan otomatis setiap siklus" icon={<ShieldOff size={16} />} color="#a78bfa">
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-white/60 text-xs font-body">Fungsi Disinfektan</p>
              <p className="text-white/30 text-[10px] font-body mt-0.5">
                {local.disinfectant_enabled ? "Aktif — spray setiap siklus pemilahan" : "Dinonaktifkan"}
              </p>
            </div>
            <Toggle
              checked={local.disinfectant_enabled}
              onChange={(v) => set({ disinfectant_enabled: v })}
              colorOn="#a78bfa"
            />
          </div>
          {!local.disinfectant_enabled && (
            <div className="mt-2 rounded-lg bg-violet-500/10 border border-violet-500/20 px-3 py-2">
              <p className="text-violet-300/70 text-[10px] font-body">
                ⚠️ Disinfektan mati dapat meningkatkan risiko kontaminasi pada chamber organik.
              </p>
            </div>
          )}
        </ControlSection>

        {/* ── Tutup Sorter Dish ── */}
        <ControlSection title="Tutup Sorter Dish" subtitle="Kunci pintu masuk & auto-lock" icon={<Lock size={16} />} color="#fb923c">
          <ValueRow label="Kunci Manual">
            <div className="flex justify-end">
              <Toggle checked={local.lid_locked} onChange={(v) => set({ lid_locked: v })} colorOn="#fb923c"
                label={local.lid_locked ? "Terkunci" : "Terbuka"} />
            </div>
          </ValueRow>
          <ValueRow label="Auto-Lock saat Penuh">
            <div className="flex justify-end">
              <Toggle checked={local.lid_auto_lock} onChange={(v) => set({ lid_auto_lock: v })} colorOn="#fb923c"
                label={local.lid_auto_lock ? "Aktif" : "Nonaktif"} />
            </div>
          </ValueRow>
          {local.lid_auto_lock && (
            <ValueRow label="Threshold Auto-Lock">
              <NumberInput
                value={local.lid_auto_lock_threshold}
                onChange={(v) => set({ lid_auto_lock_threshold: v })}
                min={50} max={100} step={5} unit="%"
              />
            </ValueRow>
          )}
          {/* Capacity indicators */}
          <div className="mt-3 space-y-1.5">
            {[
              { label: "Plastik", val: capacity_plastic, color: "#22d3ee" },
              { label: "Kering",  val: capacity_dry,     color: "#fb923c" },
              { label: "Basah",   val: capacity_wet,     color: "#4ade80" },
            ].map((c) => (
              <div key={c.label} className="flex items-center gap-2 text-[10px] font-body">
                <span className="text-white/35 w-12">{c.label}</span>
                <div className="flex-1 h-1 bg-white/[0.06] rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${c.val}%`, background: c.val >= local.lid_auto_lock_threshold ? "#f87171" : c.color }} />
                </div>
                <span style={{ color: c.val >= local.lid_auto_lock_threshold ? "#f87171" : c.color }}>{c.val}%</span>
                {c.val >= local.lid_auto_lock_threshold && local.lid_auto_lock && (
                  <span className="text-red-400">🔒</span>
                )}
              </div>
            ))}
          </div>
        </ControlSection>
      </div>

      {/* ── Spreaders / Compactor ── */}
      <div className="glass rounded-2xl p-5 border border-white/[0.08]">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-xl bg-eco-500/15 border border-eco-500/25 flex items-center justify-center">
            <Settings2 size={16} className="text-eco-400" />
          </div>
          <div>
            <h3 className="font-display font-bold text-white text-sm">Spreader / Kompactor</h3>
            <p className="text-white/35 text-[10px] font-body">Pengatur pemerata sampah per chamber</p>
          </div>
        </div>

        <div className={`grid grid-cols-1 md:grid-cols-3 gap-3 ${isEmergency ? "opacity-40 pointer-events-none" : ""}`}>
          <SpreaderCard
            label="Chamber Plastik" emoji="🧴" color="#22d3ee"
            value={local.spreader_plastic}
            onChange={(p) => setSpreader("plastic", p)}
          />
          <SpreaderCard
            label="Chamber Kering" emoji="♻️" color="#fb923c"
            value={local.spreader_dry}
            onChange={(p) => setSpreader("dry", p)}
          />
          <SpreaderCard
            label="Chamber Basah" emoji="🌿" color="#4ade80"
            value={local.spreader_wet}
            onChange={(p) => setSpreader("wet", p)}
          />
        </div>
      </div>

      {/* ── Save / Actions bar ── */}
      <div className="flex items-center justify-between gap-4 glass rounded-2xl px-5 py-4 border border-white/[0.08]">
        <p className="text-white/30 text-xs font-body">
          {saveState === "saved" ? "✅ Disimpan ke Firebase" : "Perubahan belum disimpan"}
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => { if (local) setLocal(control); }}
            className="text-white/40 hover:text-white/70 text-xs font-body px-3 py-2 rounded-xl border border-white/[0.07] hover:border-white/[0.15] transition-all"
          >
            Reset
          </button>
          <button
            onClick={handleSave}
            disabled={saveState === "saving"}
            className="flex items-center gap-2 bg-eco-500/20 hover:bg-eco-500/30 border border-eco-500/30 text-eco-300 hover:text-eco-200 text-xs font-body px-4 py-2 rounded-xl transition-all"
          >
            {saveState === "saving" ? (
              <><Loader2 size={13} className="animate-spin" /> Menyimpan…</>
            ) : saveState === "saved" ? (
              <><CheckCircle size={13} /> Tersimpan!</>
            ) : (
              <><Save size={13} /> Simpan ke Firebase</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
