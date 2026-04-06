"use client";

import { ReactNode } from "react";

// ── Toggle Switch ─────────────────────────────────────────

interface ToggleProps {
  checked: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
  colorOn?: string;
  label?: string;
  size?: "sm" | "md";
}

export function Toggle({ checked, onChange, disabled, colorOn = "#22c55e", label, size = "md" }: ToggleProps) {
  const sm = size === "sm";
  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={() => !disabled && onChange(!checked)}
        className={`relative rounded-full transition-all duration-300 flex-shrink-0 ${disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"} ${sm ? "w-9 h-5" : "w-12 h-6"}`}
        style={{
          background: checked ? `${colorOn}33` : "rgba(255,255,255,0.08)",
          border: `1px solid ${checked ? colorOn + "66" : "rgba(255,255,255,0.12)"}`,
          boxShadow: checked ? `0 0 10px ${colorOn}44` : "none",
        }}
      >
        <span
          className={`absolute top-0.5 rounded-full transition-all duration-300 shadow-sm ${sm ? "w-3.5 h-3.5" : "w-4.5 h-4.5 w-[18px] h-[18px]"}`}
          style={{
            left: checked ? (sm ? "calc(100% - 18px)" : "calc(100% - 22px)") : "2px",
            background: checked ? colorOn : "rgba(255,255,255,0.4)",
            boxShadow: checked ? `0 0 8px ${colorOn}88` : "none",
          }}
        />
      </button>
      {label && (
        <span className={`font-body ${checked ? "text-white/70" : "text-white/30"} transition-colors ${sm ? "text-[11px]" : "text-xs"}`}>
          {label}
        </span>
      )}
    </div>
  );
}

// ── Slider ────────────────────────────────────────────────

interface SliderProps {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  color?: string;
  showValue?: boolean;
  unit?: string;
}

export function Slider({ value, onChange, min = 0, max = 100, step = 1, disabled, color = "#22c55e", showValue = true, unit = "%" }: SliderProps) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div className="flex items-center gap-3">
      <div className="relative flex-1 h-2 group">
        <div className="absolute inset-0 bg-white/[0.06] rounded-full" />
        <div
          className="absolute left-0 top-0 h-full rounded-full transition-all"
          style={{ width: `${pct}%`, background: disabled ? "rgba(255,255,255,0.15)" : color, boxShadow: disabled ? "none" : `0 0 8px ${color}66` }}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
          style={{ zIndex: 2 }}
        />
        {/* Thumb dot */}
        <div
          className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full border-2 border-[#020e05] transition-all pointer-events-none"
          style={{
            left: `calc(${pct}% - 7px)`,
            background: disabled ? "rgba(255,255,255,0.2)" : color,
            boxShadow: disabled ? "none" : `0 0 8px ${color}`,
          }}
        />
      </div>
      {showValue && (
        <span className="text-xs font-display font-bold w-14 text-right" style={{ color: disabled ? "rgba(255,255,255,0.2)" : color }}>
          {value}{unit}
        </span>
      )}
    </div>
  );
}

// ── Segmented Control ─────────────────────────────────────

interface SegmentedProps<T extends string> {
  value: T;
  options: { value: T; label: string; icon?: string }[];
  onChange: (v: T) => void;
  disabled?: boolean;
  color?: string;
}

export function Segmented<T extends string>({ value, options, onChange, disabled, color = "#22c55e" }: SegmentedProps<T>) {
  return (
    <div className={`flex gap-1 bg-white/[0.04] rounded-xl p-1 border border-white/[0.06] ${disabled ? "opacity-40" : ""}`}>
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => !disabled && onChange(opt.value)}
          disabled={disabled}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs font-body transition-all ${
            value === opt.value
              ? "text-white font-medium"
              : "text-white/30 hover:text-white/50"
          }`}
          style={{
            background: value === opt.value ? `${color}22` : "transparent",
            border: value === opt.value ? `1px solid ${color}44` : "1px solid transparent",
            boxShadow: value === opt.value ? `0 0 8px ${color}22` : "none",
          }}
        >
          {opt.icon && <span>{opt.icon}</span>}
          {opt.label}
        </button>
      ))}
    </div>
  );
}

// ── Section Card ──────────────────────────────────────────

interface SectionProps {
  title: string;
  subtitle?: string;
  icon: ReactNode;
  color?: string;
  children: ReactNode;
  className?: string;
  warning?: boolean;
}

export function ControlSection({ title, subtitle, icon, color = "#22c55e", children, className = "", warning }: SectionProps) {
  return (
    <div
      className={`glass rounded-2xl p-5 border transition-all ${warning ? "border-red-500/30" : "border-white/[0.08]"} ${className}`}
      style={warning ? { boxShadow: "0 0 20px rgba(239,68,68,0.1)" } : undefined}
    >
      <div className="flex items-center gap-3 mb-4">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: `${color}18`, border: `1px solid ${color}30` }}
        >
          <span style={{ color }}>{icon}</span>
        </div>
        <div>
          <h3 className="font-display font-bold text-white text-sm">{title}</h3>
          {subtitle && <p className="text-white/35 text-[10px] font-body">{subtitle}</p>}
        </div>
      </div>
      {children}
    </div>
  );
}

// ── Value Row ─────────────────────────────────────────────

export function ValueRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 py-2 border-b border-white/[0.05] last:border-0">
      <span className="text-white/50 text-xs font-body flex-shrink-0">{label}</span>
      <div className="flex-1">{children}</div>
    </div>
  );
}

// ── Number Input ──────────────────────────────────────────

interface NumberInputProps {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  disabled?: boolean;
}

export function NumberInput({ value, onChange, min = 0, max = 100, step = 1, unit, disabled }: NumberInputProps) {
  return (
    <div className="flex items-center gap-1.5 justify-end">
      <button
        onClick={() => onChange(Math.max(min, value - step))}
        disabled={disabled || value <= min}
        className="w-6 h-6 rounded-lg bg-white/[0.06] border border-white/[0.08] text-white/50 hover:text-white hover:bg-white/[0.10] disabled:opacity-30 disabled:cursor-not-allowed transition-all text-xs flex items-center justify-center"
      >−</button>
      <div className="bg-white/[0.06] border border-white/[0.08] rounded-lg px-2.5 py-1 min-w-[52px] text-center">
        <span className="font-display font-bold text-white text-xs">{value}</span>
        {unit && <span className="text-white/30 text-[10px] ml-0.5">{unit}</span>}
      </div>
      <button
        onClick={() => onChange(Math.min(max, value + step))}
        disabled={disabled || value >= max}
        className="w-6 h-6 rounded-lg bg-white/[0.06] border border-white/[0.08] text-white/50 hover:text-white hover:bg-white/[0.10] disabled:opacity-30 disabled:cursor-not-allowed transition-all text-xs flex items-center justify-center"
      >+</button>
    </div>
  );
}
