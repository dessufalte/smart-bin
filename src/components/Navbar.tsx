"use client";

import { useState } from "react";
import { Wifi, WifiOff, MapPin, Clock, Menu, X, Trash2 } from "lucide-react";
import { TourButton } from "./TourGuide";
import { formatDistanceToNow } from "date-fns";
import { id as localeId } from "date-fns/locale";

interface NavbarProps {
  bins: string[];
  selectedBin: string;
  onSelectBin: (bin: string) => void;
  isOnline: boolean;
  location: string;
  lastUpdate: string;
  useMock: boolean;
  onTourOpen: () => void;
}

export function Navbar({
  bins,
  selectedBin,
  onSelectBin,
  isOnline,
  location,
  lastUpdate,
  useMock,
  onTourOpen,
}: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  const timeAgo = lastUpdate
    ? formatDistanceToNow(new Date(lastUpdate), { addSuffix: true, locale: localeId })
    : "—";

  return (
    <nav className="sticky top-0 z-40 glass border-b border-white/[0.07]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <div className="flex items-center gap-3 flex-shrink-0" id="status-bar">
          <div className="relative">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-eco-500 to-eco-700 flex items-center justify-center shadow-lg shadow-eco-900/50">
              <Trash2 size={18} className="text-white" />
            </div>
            <span
              className={`absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-[#020e05] pulse-dot ${
                isOnline ? "bg-eco-400" : "bg-red-500"
              }`}
            />
          </div>
          <div className="hidden sm:block">
            <p className="font-display font-bold text-white text-sm leading-tight">Smart Trash Bin</p>
            <p className="text-eco-400/70 text-[10px] font-body">IoT Dashboard</p>
          </div>
        </div>

        {/* Bin Selector – center */}
        <div className="flex-1 max-w-xs" id="bin-selector">
          <div className="relative">
            <select
              value={selectedBin}
              onChange={(e) => onSelectBin(e.target.value)}
              className="w-full bg-white/[0.06] border border-white/[0.12] text-white text-sm font-body rounded-xl px-3 py-2 pr-8 appearance-none cursor-pointer focus:outline-none focus:border-eco-500/50 focus:ring-1 focus:ring-eco-500/30 transition-all"
            >
              {bins.map((b) => (
                <option key={b} value={b} className="bg-[#052e0f]">
                  {b.replace("trashbin_", "").replace("id", "ID-")}
                </option>
              ))}
            </select>
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none text-xs">▾</span>
          </div>
        </div>

        {/* Meta info – desktop */}
        <div className="hidden lg:flex items-center gap-4 text-xs text-white/50 font-body flex-shrink-0">
          {useMock && (
            <span className="badge-warning px-2 py-0.5 rounded-lg text-[10px] font-medium">Demo Data</span>
          )}
          <span className="flex items-center gap-1.5">
            <MapPin size={12} className="text-eco-500" />
            {location || "—"}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock size={12} className="text-eco-500" />
            {timeAgo}
          </span>
          <span className={`flex items-center gap-1.5 ${isOnline ? "text-eco-400" : "text-red-400"}`}>
            {isOnline ? <Wifi size={13} /> : <WifiOff size={13} />}
            {isOnline ? "Online" : "Offline"}
          </span>
        </div>

        {/* Tour + hamburger */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <TourButton onClick={onTourOpen} />
          <button
            className="lg:hidden text-white/60 hover:text-white transition-colors"
            onClick={() => setMenuOpen((v) => !v)}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile meta bar */}
      {menuOpen && (
        <div className="lg:hidden border-t border-white/[0.06] px-4 py-3 flex flex-wrap gap-3 text-xs text-white/50 font-body">
          {useMock && (
            <span className="badge-warning px-2 py-0.5 rounded-lg text-[10px] font-medium">Demo Data</span>
          )}
          <span className="flex items-center gap-1.5">
            <MapPin size={12} className="text-eco-500" /> {location || "—"}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock size={12} className="text-eco-500" /> {timeAgo}
          </span>
          <span className={`flex items-center gap-1.5 ${isOnline ? "text-eco-400" : "text-red-400"}`}>
            {isOnline ? <Wifi size={13} /> : <WifiOff size={13} />}
            {isOnline ? "Online" : "Offline"}
          </span>
        </div>
      )}
    </nav>
  );
}
