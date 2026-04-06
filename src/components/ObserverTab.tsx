"use client";

import { useState } from "react";
import { Eye, ThumbsUp, ThumbsDown, AlertOctagon, Gauge, Radio, RefreshCw, CheckCircle, Loader2, Save } from "lucide-react";
import { useObserver, useCalibration, useControl } from "@/hooks/useControl";
import { TRASHNET_LABELS } from "@/types";
import type { TrashNetLabel, RecentItem } from "@/types";
import { ControlSection, Slider, NumberInput, ValueRow } from "./ui/Controls";
import { formatDistanceToNow } from "date-fns";
import { id as localeId } from "date-fns/locale";

// ── Recent Item Card ──────────────────────────────────────

function ItemCard({ item, onFeedback }: {
  item: RecentItem;
  onFeedback: (id: string, f: "correct" | "incorrect", lbl?: TrashNetLabel) => void;
}) {
  const [showLabels, setShowLabels] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const info = TRASHNET_LABELS.find((l) => l.key === item.label)!;
  const confPct = Math.round(item.confidence * 100);

  const chamberColor = {
    plastik: "#22d3ee",
    kering:  "#fb923c",
    basah:   "#4ade80",
  }[item.chamber];

  const handleFeedback = async (f: "correct" | "incorrect", lbl?: TrashNetLabel) => {
    setSubmitting(true);
    await onFeedback(item.id, f, lbl);
    setSubmitting(false);
    setShowLabels(false);
  };

  return (
    <div
      className="glass rounded-xl p-3.5 border border-white/[0.08] transition-all hover:border-white/[0.14] group"
      style={{ borderLeftColor: chamberColor, borderLeftWidth: "3px" }}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start gap-2.5">
          <span className="text-2xl leading-none mt-0.5">{info?.emoji ?? "❓"}</span>
          <div>
            <div className="flex items-center gap-2">
              <p className="font-display font-bold text-white text-sm">{info?.label ?? item.label}</p>
              <span
                className="text-[9px] font-body px-1.5 py-0.5 rounded-md"
                style={{ background: `${chamberColor}20`, color: chamberColor, border: `1px solid ${chamberColor}30` }}
              >
                {item.chamber}
              </span>
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              {/* Confidence bar */}
              <div className="w-20 h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${confPct}%`,
                    background: confPct >= 80 ? "#4ade80" : confPct >= 60 ? "#fbbf24" : "#f87171",
                  }}
                />
              </div>
              <span className="text-white/40 text-[10px] font-body">{confPct}% yakin</span>
            </div>
            <p className="text-white/25 text-[9px] font-body mt-0.5">
              {formatDistanceToNow(new Date(item.timestamp), { addSuffix: true, locale: localeId })}
            </p>
          </div>
        </div>

        {/* Feedback zone */}
        <div className="flex-shrink-0 flex items-center gap-1">
          {item.feedback ? (
            <span className={`text-[10px] font-body px-2 py-0.5 rounded-lg ${item.feedback === "correct" ? "badge-normal" : "badge-danger"}`}>
              {item.feedback === "correct" ? "✓ Benar" : "✗ Salah"}
            </span>
          ) : (
            <>
              {submitting ? (
                <Loader2 size={14} className="animate-spin text-white/30" />
              ) : showLabels ? (
                <div className="flex flex-wrap gap-1 max-w-[160px] justify-end">
                  {TRASHNET_LABELS.map((l) => (
                    <button
                      key={l.key}
                      onClick={() => handleFeedback("incorrect", l.key)}
                      className="text-[9px] font-body px-1.5 py-0.5 rounded-md border border-white/[0.10] hover:border-white/[0.25] text-white/50 hover:text-white transition-all"
                    >
                      {l.emoji} {l.label}
                    </button>
                  ))}
                  <button onClick={() => setShowLabels(false)} className="text-[9px] text-white/25 hover:text-white/50 px-1">✕</button>
                </div>
              ) : (
                <>
                  <button
                    onClick={() => handleFeedback("correct")}
                    title="Klasifikasi benar"
                    className="w-7 h-7 rounded-lg bg-green-500/10 hover:bg-green-500/20 border border-green-500/20 flex items-center justify-center text-green-400 hover:text-green-300 transition-all"
                  >
                    <ThumbsUp size={13} />
                  </button>
                  <button
                    onClick={() => setShowLabels(true)}
                    title="Klasifikasi salah"
                    className="w-7 h-7 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 flex items-center justify-center text-red-400 hover:text-red-300 transition-all"
                  >
                    <ThumbsDown size={13} />
                  </button>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Calibration Panel ─────────────────────────────────────

function CalibrationPanel({ binId }: { binId: string }) {
  const { calib, saveCalibration } = useCalibration(binId);
  const [local, setLocal] = useState(calib);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const set = (k: keyof typeof calib, v: number) => setLocal((p) => ({ ...p, [k]: v }));

  const handleSave = async () => {
    setSaving(true);
    await saveCalibration(local);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-4">
      {/* Gas MQ-135 */}
      <ControlSection title="Kalibrasi Sensor Gas MQ-135" subtitle="Ambang batas deteksi bau & pembusukan" icon={<Radio size={16} />} color="#a78bfa">
        <ValueRow label="Baseline (udara bersih)">
          <NumberInput value={local.gas_baseline} onChange={(v) => set("gas_baseline", v)} min={0} max={100} unit="ppm" />
        </ValueRow>
        <ValueRow label="Threshold Peringatan">
          <NumberInput value={local.gas_threshold_warning} onChange={(v) => set("gas_threshold_warning", v)} min={50} max={500} step={10} unit="ppm" />
        </ValueRow>
        <ValueRow label="Threshold Berbahaya">
          <NumberInput value={local.gas_threshold_danger} onChange={(v) => set("gas_threshold_danger", v)} min={100} max={1000} step={10} unit="ppm" />
        </ValueRow>
        {/* Zone preview */}
        <div className="mt-3 h-3 rounded-full overflow-hidden flex">
          <div className="bg-green-500/60" style={{ width: `${(local.gas_threshold_warning / 600) * 100}%` }} />
          <div className="bg-yellow-500/60" style={{ width: `${((local.gas_threshold_danger - local.gas_threshold_warning) / 600) * 100}%` }} />
          <div className="bg-red-500/60 flex-1" />
        </div>
        <div className="flex justify-between text-[9px] text-white/30 font-body mt-1">
          <span>0</span><span>{local.gas_threshold_warning}</span><span>{local.gas_threshold_danger}</span><span>600+</span>
        </div>
      </ControlSection>

      {/* Distance JSN-SR04T */}
      <ControlSection title="Kalibrasi Sensor Jarak JSN-SR04T" subtitle="Estimasi kapasitas chamber (cm)" icon={<Gauge size={16} />} color="#4ade80">
        {(["plastik", "kering", "basah"] as const).map((chamber, i) => {
          const emptyKey = `dist_${["plastic","dry","wet"][i]}_empty` as keyof typeof local;
          const fullKey  = `dist_${["plastic","dry","wet"][i]}_full`  as keyof typeof local;
          const color = ["#22d3ee", "#fb923c", "#4ade80"][i];
          return (
            <div key={chamber} className="py-2 border-b border-white/[0.05] last:border-0">
              <p className="text-white/50 text-[10px] font-body mb-2">
                Chamber {["Plastik 🧴", "Kering ♻️", "Basah 🌿"][i]}
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-white/30 text-[9px] font-body mb-1">Kosong (cm)</p>
                  <NumberInput value={local[emptyKey] as number} onChange={(v) => set(emptyKey, v)} min={5} max={100} unit="cm" />
                </div>
                <div>
                  <p className="text-white/30 text-[9px] font-body mb-1">Penuh (cm)</p>
                  <NumberInput value={local[fullKey] as number} onChange={(v) => set(fullKey, v)} min={1} max={50} unit="cm" />
                </div>
              </div>
            </div>
          );
        })}
      </ControlSection>

      {/* Save */}
      <button
        onClick={handleSave}
        disabled={saving}
        className="w-full flex items-center justify-center gap-2 bg-eco-500/20 hover:bg-eco-500/30 border border-eco-500/30 text-eco-300 text-sm font-body py-3 rounded-xl transition-all"
      >
        {saving ? <><Loader2 size={15} className="animate-spin" />Menyimpan…</> :
         saved  ? <><CheckCircle size={15} />Kalibrasi Tersimpan!</> :
                  <><Save size={15} />Simpan Kalibrasi</>}
      </button>
    </div>
  );
}

// ── Main Observer Tab ─────────────────────────────────────

export function ObserverTab({ binId }: { binId: string }) {
  const { items, loading, submitFeedback } = useObserver(binId);
  const { triggerEmergencyStop, control } = useControl(binId);
  const [subTab, setSubTab] = useState<"live" | "calibration">("live");
  const [eStopConfirm, setEStopConfirm] = useState(false);
  const [eStopLoading, setEStopLoading] = useState(false);

  const isEmergency = control?.emergency_stop ?? false;

  const handleEmergency = async () => {
    if (!eStopConfirm) { setEStopConfirm(true); return; }
    setEStopLoading(true);
    await triggerEmergencyStop();
    setEStopLoading(false);
    setEStopConfirm(false);
  };

  const correctCount = items.filter((i) => i.feedback === "correct").length;
  const incorrectCount = items.filter((i) => i.feedback === "incorrect").length;
  const accuracy = items.length > 0 && (correctCount + incorrectCount) > 0
    ? Math.round((correctCount / (correctCount + incorrectCount)) * 100) : null;

  return (
    <div className="space-y-4">

      {/* ── Emergency Stop ── */}
      <div
        className="glass rounded-2xl p-4 border flex items-center justify-between gap-4 transition-all"
        style={{
          borderColor: isEmergency ? "rgba(239,68,68,0.5)" : "rgba(239,68,68,0.2)",
          background: isEmergency ? "rgba(239,68,68,0.10)" : "rgba(239,68,68,0.04)",
          boxShadow: isEmergency ? "0 0 30px rgba(239,68,68,0.15)" : "none",
        }}
      >
        <div>
          <p className="font-display font-bold text-red-400 text-sm flex items-center gap-2">
            <AlertOctagon size={15} />
            {isEmergency ? "EMERGENCY STOP AKTIF" : "Emergency Stop"}
          </p>
          <p className="text-red-300/50 text-[11px] font-body mt-0.5">
            {isEmergency
              ? "Semua aktuator dihentikan. Pergi ke Control Panel untuk mereset."
              : "Menghentikan semua aktuator dan mengunci tutup segera."}
          </p>
        </div>
        {!isEmergency && (
          <button
            onClick={handleEmergency}
            disabled={eStopLoading}
            className={`flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl font-body font-bold text-sm transition-all ${
              eStopConfirm
                ? "bg-red-500 hover:bg-red-400 text-white animate-pulse"
                : "bg-red-500/15 hover:bg-red-500/25 border border-red-500/30 text-red-400"
            }`}
          >
            {eStopLoading ? <Loader2 size={15} className="animate-spin" /> : <AlertOctagon size={15} />}
            {eStopConfirm ? "Konfirmasi Stop!" : "Stop Darurat"}
          </button>
        )}
        {eStopConfirm && (
          <button onClick={() => setEStopConfirm(false)} className="text-white/30 hover:text-white/60 text-xs font-body">Batal</button>
        )}
      </div>

      {/* ── Sub-tab ── */}
      <div className="flex gap-1 bg-white/[0.03] rounded-xl p-1 border border-white/[0.06] w-fit">
        {([
          { key: "live",        label: "Live Observer",  icon: "👁️" },
          { key: "calibration", label: "Kalibrasi Sensor", icon: "🔧" },
        ] as const).map((t) => (
          <button
            key={t.key}
            onClick={() => setSubTab(t.key)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-body transition-all ${
              subTab === t.key
                ? "bg-eco-500/20 text-eco-300 border border-eco-500/25"
                : "text-white/40 hover:text-white/60"
            }`}
          >
            <span>{t.icon}</span> {t.label}
          </button>
        ))}
      </div>

      {subTab === "live" ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

          {/* Item feed */}
          <div className="lg:col-span-2 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Eye size={15} className="text-eco-400" />
                <h3 className="font-display font-bold text-white text-sm">Item Terbaru</h3>
                <span className="text-[10px] text-white/30 font-body">real-time Firebase</span>
              </div>
              {loading && <Loader2 size={13} className="animate-spin text-white/30" />}
            </div>

            {items.length === 0 && !loading ? (
              <div className="glass rounded-2xl p-10 border border-white/[0.06] text-center">
                <p className="text-4xl mb-3">🗑️</p>
                <p className="text-white/40 text-sm font-body">Belum ada item yang terdeteksi.</p>
                <p className="text-white/25 text-xs font-body mt-1">Masukkan sampah ke dalam tempat sampah.</p>
              </div>
            ) : (
              <div className="space-y-2.5 max-h-[480px] overflow-y-auto pr-1">
                {items.map((item) => (
                  <ItemCard key={item.id} item={item} onFeedback={submitFeedback} />
                ))}
              </div>
            )}
          </div>

          {/* Sidebar stats */}
          <div className="space-y-3">
            {/* Accuracy */}
            <div className="glass rounded-2xl p-4 border border-white/[0.08]">
              <p className="text-white/40 text-[10px] font-body mb-2 flex items-center gap-1.5">
                <CheckCircle size={11} className="text-eco-400" /> Akurasi Klasifikasi
              </p>
              {accuracy !== null ? (
                <>
                  <p className="font-display font-extrabold text-4xl" style={{ color: accuracy >= 80 ? "#4ade80" : accuracy >= 60 ? "#fbbf24" : "#f87171" }}>
                    {accuracy}%
                  </p>
                  <p className="text-white/30 text-[10px] font-body mt-1">dari {correctCount + incorrectCount} feedback</p>
                </>
              ) : (
                <p className="text-white/30 text-sm font-body">Belum ada feedback</p>
              )}
            </div>

            {/* Label distribution */}
            <div className="glass rounded-2xl p-4 border border-white/[0.08]">
              <p className="text-white/40 text-[10px] font-body mb-3">Distribusi Label (30 terakhir)</p>
              <div className="space-y-1.5">
                {TRASHNET_LABELS.map((l) => {
                  const count = items.filter((i) => i.label === l.key).length;
                  const pct = items.length > 0 ? Math.round((count / items.length) * 100) : 0;
                  return (
                    <div key={l.key} className="flex items-center gap-2 text-[10px] font-body">
                      <span className="w-4">{l.emoji}</span>
                      <span className="text-white/40 w-12">{l.label}</span>
                      <div className="flex-1 h-1 bg-white/[0.05] rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${pct}%`, background: l.color }} />
                      </div>
                      <span style={{ color: l.color }} className="w-6 text-right">{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Feedback summary */}
            <div className="glass rounded-2xl p-4 border border-white/[0.08]">
              <p className="text-white/40 text-[10px] font-body mb-3">Ringkasan Feedback</p>
              <div className="flex gap-3">
                <div className="flex-1 text-center p-2 rounded-xl bg-green-500/10 border border-green-500/20">
                  <p className="font-display font-bold text-green-400 text-xl">{correctCount}</p>
                  <p className="text-green-400/50 text-[9px] font-body">Benar</p>
                </div>
                <div className="flex-1 text-center p-2 rounded-xl bg-red-500/10 border border-red-500/20">
                  <p className="font-display font-bold text-red-400 text-xl">{incorrectCount}</p>
                  <p className="text-red-400/50 text-[9px] font-body">Salah</p>
                </div>
                <div className="flex-1 text-center p-2 rounded-xl bg-white/[0.04] border border-white/[0.07]">
                  <p className="font-display font-bold text-white/50 text-xl">{items.filter((i) => !i.feedback).length}</p>
                  <p className="text-white/25 text-[9px] font-body">Belum</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <CalibrationPanel binId={binId} />
      )}
    </div>
  );
}
