"use client";

export function SkeletonCard({ className = "" }: { className?: string }) {
  return (
    <div className={`glass rounded-2xl p-5 border border-white/[0.06] ${className}`}>
      <div className="space-y-3">
        <div className="shimmer h-4 w-2/5 rounded-lg" />
        <div className="shimmer h-3 w-1/3 rounded-lg" />
        <div className="flex items-center gap-4 pt-2">
          <div className="shimmer w-24 h-24 rounded-full flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="shimmer h-3 w-full rounded-lg" />
            <div className="shimmer h-2 w-3/4 rounded-lg" />
            <div className="shimmer h-2 w-1/2 rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function LoadingScreen() {
  return (
    <div className="min-h-screen bg-mesh flex flex-col items-center justify-center gap-6">
      {/* Animated leaf */}
      <div className="relative w-20 h-20">
        <div className="absolute inset-0 rounded-full bg-eco-500/20 animate-ping" />
        <div className="relative w-20 h-20 rounded-full bg-eco-900 border border-eco-500/30 flex items-center justify-center">
          <span className="text-4xl animate-[leaf_3s_ease-in-out_infinite]">🌿</span>
        </div>
      </div>
      <div className="text-center">
        <p className="font-display font-bold text-white text-lg">Smart Trash Bin</p>
        <p className="text-eco-400/60 text-sm font-body mt-1">Menghubungkan ke Firebase…</p>
      </div>
    </div>
  );
}
