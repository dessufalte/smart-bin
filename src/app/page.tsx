"use client";

import { useState, useEffect } from "react";
import { LoginPage } from "@/components/LoginPage";
import { Dashboard } from "@/components/Dashboard";

const SESSION_KEY = "stb_active_bin";

export default function Home() {
  const [binId, setBinId] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const saved = sessionStorage.getItem(SESSION_KEY);
    if (saved) setBinId(saved);
    setHydrated(true);
  }, []);

  const handleLogin = (id: string) => {
    sessionStorage.setItem(SESSION_KEY, id);
    setBinId(id);
  };

  const handleLogout = () => {
    sessionStorage.removeItem(SESSION_KEY);
    setBinId(null);
  };

  if (!hydrated) return null;

  if (!binId) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return <Dashboard binId={binId} onLogout={handleLogout} />;
}
