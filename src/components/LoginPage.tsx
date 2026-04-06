"use client";

import { useState, useRef, useEffect } from "react";
import { Trash2, ArrowRight, Loader2, AlertCircle, Eye, EyeOff } from "lucide-react";
import { validateBinId } from "@/hooks/useControl";
import { BackgroundOrbs, FloatingLeaves } from "./Background";

interface LoginPageProps {
  onLogin: (binId: string) => void;
}

const RECENT_KEY = "stb_recent_ids";

function getRecentIds(): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(RECENT_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveRecentId(id: string) {
  const recent = getRecentIds().filter((r) => r !== id).slice(0, 4);
  localStorage.setItem(RECENT_KEY, JSON.stringify([id, ...recent]));
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showRecent, setShowRecent] = useState(false);
  const [recent, setRecent] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setRecent(getRecentIds());
    setTimeout(() => inputRef.current?.focus(), 600);
  }, []);

  const handleSubmit = async (rawId: string = input) => {
    if (!rawId.trim()) {
      setError("Masukkan ID tempat sampah.");
      return;
    }
    setLoading(true);
    setError("");

    try {
      const id = await validateBinId(rawId);
      if (!id) {
        setError("Format ID tidak valid. Gunakan format: 0001 atau trashbin_id0001");
        setLoading(false);
        return;
      }
      saveRecentId(id);
      onLogin(id);
    } catch {
      setError("Gagal terhubung ke server. Periksa koneksi internet.");
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSubmit();
  };

  return (
    <div className="min-h-screen bg-mesh relative flex items-center justify-center px-4">
      <BackgroundOrbs />
      <FloatingLeaves />

      {/* Card */}
      <div className="relative z-10 w-full max-w-md">
        {/* Logo & title */}
        <div className="text-center mb-10">
          <div className="relative inline-flex mb-5">
            {/* Outer ring animation */}
            <div className="absolute inset-0 rounded-full bg-eco-500/10 animate-ping" style={{ animationDuration: "3s" }} />
            <div className="absolute inset-[-8px] rounded-full border border-eco-500/20 animate-spin-slow" />
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-eco-500 to-eco-700 flex items-center justify-center shadow-2xl shadow-eco-900/80 glow-green-strong relative z-10">
              <Trash2 size={36} className="text-white" />
            </div>
          </div>
          <h1 className="font-display font-extrabold text-4xl gradient-text mb-2">
            Smart Trash Bin
          </h1>
          <p className="text-white/40 text-sm font-body">
            Dashboard IoT · Universitas Andalas
          </p>
        </div>

        {/* Login card */}
        <div className="glass rounded-3xl p-8 border border-white/[0.10] glow-green">
          <h2 className="font-display font-bold text-white text-xl mb-1">
            Masuk ke Dashboard
          </h2>
          <p className="text-white/40 text-sm font-body mb-6">
            Masukkan ID unit tempat sampah yang ingin dipantau
          </p>

          {/* Input group */}
          <div className="space-y-3">
            <div className="relative">
              <div className="relative">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => {
                    setInput(e.target.value);
                    setError("");
                    setShowRecent(false);
                  }}
                  onFocus={() => setShowRecent(recent.length > 0)}
                  onKeyDown={handleKey}
                  placeholder="Contoh: 0001  atau  trashbin_id0001"
                  className={`w-full bg-white/[0.06] border text-white font-body text-sm px-4 py-3.5 rounded-xl pr-10
                    placeholder:text-white/25 focus:outline-none transition-all
                    ${error
                      ? "border-red-500/50 focus:border-red-500/70 focus:ring-1 focus:ring-red-500/20"
                      : "border-white/[0.12] focus:border-eco-500/50 focus:ring-1 focus:ring-eco-500/20"
                    }`}
                  autoComplete="off"
                  spellCheck={false}
                />
                {input && (
                  <button
                    onClick={() => { setInput(""); setError(""); inputRef.current?.focus(); }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                  >
                    ×
                  </button>
                )}
              </div>

              {/* Recent IDs dropdown */}
              {showRecent && recent.length > 0 && !input && (
                <div className="absolute top-full left-0 right-0 mt-1 glass border border-white/[0.10] rounded-xl overflow-hidden z-20">
                  <p className="text-white/30 text-[10px] font-body px-3 pt-2.5 pb-1">Terakhir digunakan</p>
                  {recent.map((id) => (
                    <button
                      key={id}
                      onClick={() => { setInput(id); setShowRecent(false); }}
                      className="w-full text-left px-3 py-2 text-sm font-body text-white/60 hover:bg-white/[0.06] hover:text-white transition-colors flex items-center gap-2"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-eco-500/50" />
                      {id.replace("trashbin_", "").replace("id", "ID-")}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 text-red-400 text-xs font-body bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                <AlertCircle size={13} className="flex-shrink-0" />
                {error}
              </div>
            )}

            {/* Submit button */}
            <button
              onClick={() => handleSubmit()}
              disabled={loading}
              className="w-full bg-gradient-to-r from-eco-600 to-eco-500 hover:from-eco-500 hover:to-eco-400 disabled:opacity-60 disabled:cursor-not-allowed text-white font-display font-bold text-sm py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-eco-900/50 glow-green"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Menghubungkan…
                </>
              ) : (
                <>
                  Buka Dashboard
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </div>

          {/* Format hint */}
          <div className="mt-5 pt-5 border-t border-white/[0.06]">
            <p className="text-white/30 text-[11px] font-body mb-2">Format ID yang diterima:</p>
            <div className="flex flex-wrap gap-2">
              {["0001", "0042", "trashbin_id0001"].map((ex) => (
                <button
                  key={ex}
                  onClick={() => setInput(ex)}
                  className="glass border border-white/[0.08] hover:border-eco-500/30 text-white/40 hover:text-eco-400 text-[11px] font-body px-2.5 py-1 rounded-lg transition-all"
                >
                  {ex}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer note */}
        <p className="text-center text-white/20 text-[11px] font-body mt-6">
          Smart Bin Adaptif Terintegrasi · Teknik Komputer FTI Unand · 2026
        </p>
      </div>
    </div>
  );
}
