"use client";

import { useState, useEffect } from "react";
import { LayoutDashboard, SlidersHorizontal, Eye, LogOut, Trash2 } from "lucide-react";
import { ChamberCard } from "./ChamberCard";
import { WasteChart } from "./WasteChart";
import { GasMonitor } from "./GasMonitor";
import { StatsOverview } from "./StatsOverview";
import { SystemInfo } from "./SystemInfo";
import { TourGuide, TourButton } from "./TourGuide";
import { ControlPanel } from "./ControlPanel";
import { ObserverTab } from "./ObserverTab";
import { BackgroundOrbs, FloatingLeaves } from "./Background";
import { SkeletonCard, LoadingScreen } from "./Skeleton";
import { useTrashBin } from "@/hooks/useTrashBin";
import { AlertTriangle, Wifi, WifiOff, MapPin, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { id as localeId } from "date-fns/locale";

const TOUR_DISMISSED_KEY = "stb_tour_dismissed";
type Tab = "overview" | "control" | "observer";

interface DashboardProps {
  binId: string;
  onLogout: () => void;
}

const TABS = [
  { key: "overview" as Tab,  label: "Overview",       icon: LayoutDashboard },
  { key: "control"  as Tab,  label: "Control Panel",  icon: SlidersHorizontal },
  { key: "observer" as Tab,  label: "Observer",       icon: Eye },
];

export function Dashboard({ binId, onLogout }: DashboardProps) {
  const { data, loading, error, useMock } = useTrashBin(binId);
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [showTour, setShowTour] = useState(false);

  useEffect(() => {
    if (!loading) {
      const dismissed = localStorage.getItem(TOUR_DISMISSED_KEY);
      if (!dismissed) setTimeout(() => setShowTour(true), 600);
    }
  }, [loading]);

  if (loading && !data) return <LoadingScreen />;

  const timeAgo = data?.last_update
    ? formatDistanceToNow(new Date(data.last_update), { addSuffix: true, locale: localeId })
    : "—";
  const binLabel = binId.replace("trashbin_", "").replace("id", "ID-").toUpperCase();

  return (
    <div className="relative min-h-screen bg-mesh">
      <BackgroundOrbs />
      <FloatingLeaves />
      {showTour && (
        <TourGuide
          onClose={() => {
            setShowTour(false);
            localStorage.setItem(TOUR_DISMISSED_KEY, "1");
          }}
        />
      )}

      {/* ── Navbar ── */}
      <nav className="sticky top-0 z-40 glass border-b border-white/[0.07]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-2.5 flex-shrink-0">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-eco-500 to-eco-700 flex items-center justify-center shadow-lg shadow-eco-900/50">
              <Trash2 size={15} className="text-white" />
            </div>
            <div className="hidden sm:block">
              <p className="font-display font-bold text-white text-sm leading-tight">Smart Trash Bin</p>
              <p className="text-eco-400/60 text-[10px] font-body">{binLabel}</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 bg-white/[0.04] rounded-xl p-1 border border-white/[0.06]">
            {TABS.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-body transition-all ${
                  activeTab === key
                    ? "bg-eco-500/20 text-eco-300 border border-eco-500/25"
                    : "text-white/40 hover:text-white/60"
                }`}
              >
                <Icon size={13} />
                <span className="hidden sm:inline">{label}</span>
              </button>
            ))}
          </div>

          {/* Right */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="hidden lg:flex items-center gap-3 text-[11px] text-white/40 font-body">
              {useMock && <span className="badge-warning px-2 py-0.5 rounded-lg text-[10px]">Demo</span>}
              <span className="flex items-center gap-1"><MapPin size={11} className="text-eco-500" />{data?.location ?? "—"}</span>
              <span className="flex items-center gap-1"><Clock size={11} className="text-eco-500" />{timeAgo}</span>
              <span className={`flex items-center gap-1 ${!error && !useMock ? "text-eco-400" : "text-red-400"}`}>
                {!error && !useMock ? <Wifi size={12} /> : <WifiOff size={12} />}
                {!error && !useMock ? "Live" : "Offline"}
              </span>
            </div>
            <TourButton onClick={() => setShowTour(true)} />
            <button
              onClick={onLogout}
              title="Keluar"
              className="w-8 h-8 rounded-xl glass border border-white/[0.08] hover:border-red-500/30 text-white/40 hover:text-red-400 flex items-center justify-center transition-all"
            >
              <LogOut size={14} />
            </button>
          </div>
        </div>
      </nav>

      {/* ── Content ── */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {(error || useMock) && (
          <div className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-body mb-5 ${
            error
              ? "bg-red-500/10 border border-red-500/20 text-red-300"
              : "bg-yellow-500/10 border border-yellow-500/20 text-yellow-300"
          }`}>
            <AlertTriangle size={16} className="flex-shrink-0" />
            {error ? `Firebase error: ${error}` : `Node "${binId}" belum ada — menampilkan data demo.`}
          </div>
        )}

        {/* OVERVIEW */}
        {activeTab === "overview" && (
          <div className="space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
              <div>
                <h1 className="font-display font-extrabold text-3xl sm:text-4xl gradient-text">Dashboard</h1>
                <p className="text-white/35 text-sm font-body mt-1">Smart Bin Adaptif · {binLabel}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-eco-400 pulse-dot" />
                <span className="text-eco-400/60 text-xs font-body">Realtime Firebase</span>
              </div>
            </div>

            {data && <StatsOverview data={data} binId={binId} />}

            {loading && !data ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <SkeletonCard /><SkeletonCard /><SkeletonCard />
              </div>
            ) : data ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4" id="chamber-cards">
                <ChamberCard chamber="plastik" data={data} />
                <ChamberCard chamber="kering"  data={data} />
                <ChamberCard chamber="basah"   data={data} />
              </div>
            ) : null}

            {data && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                <div className="lg:col-span-6" id="waste-chart"><WasteChart data={data} /></div>
                <div className="lg:col-span-3" id="gas-monitor"><GasMonitor data={data} /></div>
                <div className="lg:col-span-3"><SystemInfo binId={binId} data={data} /></div>
              </div>
            )}
          </div>
        )}

        {/* CONTROL PANEL */}
        {activeTab === "control" && (
          <div className="space-y-5">
            <div>
              <h1 className="font-display font-extrabold text-3xl gradient-text">Control Panel</h1>
              <p className="text-white/35 text-sm font-body mt-1">
                Kendali hardware {binLabel} · Perubahan disimpan ke Firebase/{binId}/control
              </p>
            </div>
            <ControlPanel
              binId={binId}
              capacity_plastic={data?.capacity_plastic ?? 0}
              capacity_wet={data?.capacity_wet ?? 0}
              capacity_dry={data?.capacity_dry ?? 0}
            />
          </div>
        )}

        {/* OBSERVER */}
        {activeTab === "observer" && (
          <div className="space-y-5">
            <div>
              <h1 className="font-display font-extrabold text-3xl gradient-text">Observer</h1>
              <p className="text-white/35 text-sm font-body mt-1">
                Live klasifikasi · Feedback · Kalibrasi Sensor · Emergency Stop
              </p>
            </div>
            <ObserverTab binId={binId} />
          </div>
        )}

        <footer className="text-center pt-8 pb-2 mt-4 border-t border-white/[0.04]">
          <p className="text-white/15 text-[10px] font-body">
            Smart Bin Adaptif · 2026 · Imam Ali Yaasin · Muhammad Aldi · Rayhan Assiddiqqy Lionar · Muhammad Fachri
          </p>
        </footer>
      </main>
    </div>
  );
}
