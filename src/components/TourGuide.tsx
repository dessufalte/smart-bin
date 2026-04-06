"use client";

import { useState, useEffect } from "react";
import { X, ChevronRight, ChevronLeft, Lightbulb } from "lucide-react";

interface TourStep {
  id: string;
  title: string;
  description: string;
  position: "top" | "bottom" | "left" | "right";
  emoji: string;
}

const TOUR_STEPS: TourStep[] = [
  {
    id: "bin-selector",
    title: "Pilih Tempat Sampah",
    description: "Gunakan panel ini untuk memilih ID tempat sampah yang ingin dipantau. Setiap ID terhubung langsung ke database Firebase secara real-time.",
    position: "right",
    emoji: "🗑️",
  },
  {
    id: "status-bar",
    title: "Status & Lokasi",
    description: "Menampilkan status koneksi, lokasi perangkat, dan waktu pembaruan terakhir dari Raspberry Pi 4 yang terpasang.",
    position: "bottom",
    emoji: "📡",
  },
  {
    id: "chamber-cards",
    title: "Kapasitas 3 Chamber",
    description: "Sistem memiliki 3 chamber pemilah: Plastik, Anorganik Kering (kardus, kaca, logam, kertas), dan Organik Basah. Setiap gauge menunjukkan persentase kepenuhan secara real-time.",
    position: "bottom",
    emoji: "📊",
  },
  {
    id: "waste-chart",
    title: "Statistik Klasifikasi",
    description: "Grafik menampilkan distribusi jenis sampah berdasarkan label TrashNet: plastic, cardboard, glass, metal, paper, dan trash. Model MobileNetV2 melakukan klasifikasi otomatis via kamera Raspberry Pi Camera V2.",
    position: "top",
    emoji: "🤖",
  },
  {
    id: "gas-monitor",
    title: "Monitor Kualitas Udara",
    description: "Sensor gas MQ-135 memantau konsentrasi gas (PPM) di dalam tempat sampah. Nilai tinggi mengindikasikan pembusukan sampah organik dan memicu peringatan.",
    position: "top",
    emoji: "💨",
  },
];

interface TourGuideProps {
  onClose: () => void;
}

export function TourGuide({ onClose }: TourGuideProps) {
  const [step, setStep] = useState(0);
  const current = TOUR_STEPS[step];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Tour Card */}
      <div className="relative z-10 glass glow-green-strong rounded-2xl p-6 max-w-md w-full mx-4 border border-eco-500/30">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{current.emoji}</span>
            <div>
              <div className="text-xs text-eco-400 font-body mb-0.5">
                Langkah {step + 1} dari {TOUR_STEPS.length}
              </div>
              <h3 className="font-display font-bold text-white text-lg">{current.title}</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/40 hover:text-white/80 transition-colors ml-2 flex-shrink-0"
          >
            <X size={18} />
          </button>
        </div>

        {/* Progress dots */}
        <div className="flex gap-1.5 mb-4">
          {TOUR_STEPS.map((_, i) => (
            <div
              key={i}
              className={`h-1 rounded-full transition-all duration-300 ${
                i === step
                  ? "bg-eco-400 w-6"
                  : i < step
                  ? "bg-eco-600 w-2"
                  : "bg-white/15 w-2"
              }`}
            />
          ))}
        </div>

        {/* Description */}
        <p className="text-white/70 text-sm leading-relaxed font-body mb-6">
          {current.description}
        </p>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
            className="flex items-center gap-1.5 text-sm text-white/50 hover:text-white/80 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft size={16} />
            Sebelumnya
          </button>

          {step < TOUR_STEPS.length - 1 ? (
            <button
              onClick={() => setStep((s) => s + 1)}
              className="flex items-center gap-1.5 bg-eco-500 hover:bg-eco-400 text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors"
            >
              Lanjut
              <ChevronRight size={16} />
            </button>
          ) : (
            <button
              onClick={onClose}
              className="flex items-center gap-1.5 bg-eco-500 hover:bg-eco-400 text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors"
            >
              Mulai Eksplorasi 🎉
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export function TourButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="glass border border-eco-500/20 hover:border-eco-500/40 text-eco-400 hover:text-eco-300 px-3 py-2 rounded-xl flex items-center gap-2 text-sm transition-all"
    >
      <Lightbulb size={15} />
      <span className="hidden sm:inline font-body">Tour Guide</span>
    </button>
  );
}
