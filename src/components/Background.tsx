"use client";

export function BackgroundOrbs() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Large ambient orbs */}
      <div
        className="orb w-96 h-96 bg-eco-600"
        style={{ top: "-10%", left: "-10%", animationDelay: "0s" }}
      />
      <div
        className="orb w-80 h-80 bg-eco-700"
        style={{ bottom: "10%", right: "-5%", animationDelay: "3s" }}
      />
      <div
        className="orb w-64 h-64 bg-emerald-600"
        style={{ top: "50%", left: "40%", animationDelay: "6s", opacity: 0.06 }}
      />

      {/* Decorative grid */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(34,197,94,1) 1px, transparent 1px), linear-gradient(90deg, rgba(34,197,94,1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Vignette */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#020e05]/60 via-transparent to-[#020e05]/80" />
    </div>
  );
}

export function FloatingLeaves() {
  const leaves = ["🍃", "🌿", "🍀", "☘️"];
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="absolute text-lg opacity-[0.04]"
          style={{
            left: `${15 + i * 14}%`,
            top: `${10 + (i % 3) * 30}%`,
            animation: `leaf ${6 + i * 1.5}s ease-in-out infinite`,
            animationDelay: `${i * 1.2}s`,
          }}
        >
          {leaves[i % leaves.length]}
        </div>
      ))}
    </div>
  );
}
