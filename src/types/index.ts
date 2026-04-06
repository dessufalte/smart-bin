// ──────────────────────────────────────────────────────────
// CONTROL PANEL TYPES
// ──────────────────────────────────────────────────────────

export type SpreadDirection = "clockwise" | "back_and_forth";
export type SpreadMode = "compactor" | "speed";

export interface SpreadSettings {
  enabled: boolean;
  mode: SpreadMode;
  direction: SpreadDirection;
  speed: number; // 0–100
}

export interface ControlState {
  // 💡 SMD Light
  light_enabled: boolean;
  light_brightness: number; // 0–100

  // 🎮 Pan-Tilt Servo
  pan_tilt_speed: number; // 0–100

  // 🧴 Disinfectant
  disinfectant_enabled: boolean;

  // 🔒 Lid
  lid_locked: boolean;
  lid_auto_lock: boolean;
  lid_auto_lock_threshold: number; // default 90

  // ⚙️ Spreaders per chamber
  spreader_plastic: SpreadSettings;
  spreader_wet: SpreadSettings;
  spreader_dry: SpreadSettings;

  // 🚨 Emergency
  emergency_stop: boolean;

  // meta
  last_control_update: string;
}

export const DEFAULT_CONTROL: ControlState = {
  light_enabled: true,
  light_brightness: 80,
  pan_tilt_speed: 50,
  disinfectant_enabled: true,
  lid_locked: false,
  lid_auto_lock: true,
  lid_auto_lock_threshold: 90,
  spreader_plastic: { enabled: true,  mode: "speed",     direction: "clockwise",    speed: 60 },
  spreader_wet:     { enabled: true,  mode: "compactor", direction: "back_and_forth", speed: 40 },
  spreader_dry:     { enabled: true,  mode: "speed",     direction: "clockwise",    speed: 60 },
  emergency_stop: false,
  last_control_update: new Date().toISOString(),
};

// ──────────────────────────────────────────────────────────
// OBSERVER TYPES
// ──────────────────────────────────────────────────────────

export type TrashNetLabel = "plastic" | "cardboard" | "glass" | "metal" | "paper" | "trash";

export interface RecentItem {
  id: string;
  label: TrashNetLabel;
  confidence: number; // 0–1
  timestamp: string;
  chamber: "plastik" | "kering" | "basah";
  feedback?: "correct" | "incorrect" | null;
  feedback_label?: TrashNetLabel | null;
}

export interface CalibrationSettings {
  // Gas MQ-135
  gas_baseline: number;
  gas_threshold_warning: number;
  gas_threshold_danger: number;
  // Distance JSN-SR04T (cm)
  dist_plastic_empty: number;
  dist_plastic_full: number;
  dist_wet_empty: number;
  dist_wet_full: number;
  dist_dry_empty: number;
  dist_dry_full: number;
}

export const DEFAULT_CALIBRATION: CalibrationSettings = {
  gas_baseline: 50,
  gas_threshold_warning: 150,
  gas_threshold_danger: 300,
  dist_plastic_empty: 40,
  dist_plastic_full: 5,
  dist_wet_empty: 40,
  dist_wet_full: 5,
  dist_dry_empty: 40,
  dist_dry_full: 5,
};

// ──────────────────────────────────────────────────────────
// ORIGINAL TRASH BIN DATA TYPES
// ──────────────────────────────────────────────────────────

// TrashNet labels: cardboard, glass, metal, paper, plastic, trash
// Chamber mapping:
//   plastic  → chamber "plastik"
//   cardboard, glass, metal, paper → chamber "kering" (dry/anorganic)
//   trash (organic) → chamber "basah" (wet/organic)

export type AirQualityStatus = "Normal" | "Peringatan" | "Berbahaya";

export interface TrashBinData {
  // Capacities (0–100%)
  capacity_plastic: number;
  capacity_wet: number;
  capacity_dry: number;

  // TrashNet label counts
  count_plastic: number;
  count_cardboard: number;
  count_glass: number;
  count_metal: number;
  count_paper: number;
  count_trash: number; // organic/wet

  // Gas / odor
  gas_level: number; // PPM
  air_quality: AirQualityStatus;

  // Meta
  last_update: string;
  is_active: boolean;
  location: string;
}

export interface TrashBin {
  id: string; // e.g. "trashbin_id0001"
  data: TrashBinData;
}

export const TRASHNET_LABELS: { key: TrashNetLabel; label: string; chamber: "plastik" | "kering" | "basah"; color: string; emoji: string }[] = [
  { key: "plastic",   label: "Plastik",    chamber: "plastik", color: "#22d3ee", emoji: "🧴" },
  { key: "cardboard", label: "Kardus",     chamber: "kering",  color: "#fb923c", emoji: "📦" },
  { key: "glass",     label: "Kaca",       chamber: "kering",  color: "#a78bfa", emoji: "🫙" },
  { key: "metal",     label: "Logam",      chamber: "kering",  color: "#94a3b8", emoji: "🔩" },
  { key: "paper",     label: "Kertas",     chamber: "kering",  color: "#fbbf24", emoji: "📄" },
  { key: "trash",     label: "Organik",    chamber: "basah",   color: "#4ade80", emoji: "🍃" },
];

export const CHAMBER_INFO = {
  plastik: { label: "Plastik", color: "#22d3ee", bgClass: "from-cyan-500/20 to-cyan-600/10", borderClass: "border-cyan-500/30", icon: "🧴" },
  kering:  { label: "Anorganik Kering", color: "#fb923c", bgClass: "from-orange-500/20 to-orange-600/10", borderClass: "border-orange-500/30", icon: "♻️" },
  basah:   { label: "Organik Basah", color: "#4ade80", bgClass: "from-green-500/20 to-green-600/10", borderClass: "border-green-500/30", icon: "🌿" },
};

// Mock data for demo/fallback
export const MOCK_TRASHBIN_DATA: TrashBinData = {
  capacity_plastic: 67,
  capacity_wet: 42,
  capacity_dry: 85,
  count_plastic: 23,
  count_cardboard: 8,
  count_glass: 5,
  count_metal: 3,
  count_paper: 12,
  count_trash: 19,
  gas_level: 124.5,
  air_quality: "Normal",
  last_update: new Date().toISOString(),
  is_active: true,
  location: "Gedung FTI – Lantai 2",
};
