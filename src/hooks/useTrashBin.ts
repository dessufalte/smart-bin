"use client";

import { useEffect, useState } from "react";
import { ref, onValue, off } from "firebase/database";
import { db } from "@/lib/firebase";
import type { TrashBinData } from "@/types";
import { MOCK_TRASHBIN_DATA } from "@/types";

export function useTrashBin(binId: string) {
  const [data, setData] = useState<TrashBinData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [useMock, setUseMock] = useState(false);

  useEffect(() => {
    if (!binId) return;

    setLoading(true);
    setError(null);

    const binRef = ref(db, binId);

    const unsubscribe = onValue(
      binRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const raw = snapshot.val();
          // Normalize & merge with defaults
          const normalized: TrashBinData = {
            capacity_plastic: raw.capacity_plastic ?? 0,
            capacity_wet: raw.capacity_wet ?? 0,
            capacity_dry: raw.capacity_dry ?? 0,
            count_plastic: raw.count_plastic ?? 0,
            count_cardboard: raw.count_cardboard ?? 0,
            count_glass: raw.count_glass ?? 0,
            count_metal: raw.count_metal ?? 0,
            count_paper: raw.count_paper ?? 0,
            count_trash: raw.count_trash ?? 0,
            gas_level: raw.gas_level ?? 0,
            air_quality: raw.air_quality ?? "Normal",
            last_update: raw.last_update ?? new Date().toISOString(),
            is_active: raw.is_active ?? true,
            location: raw.location ?? "Unknown",
          };
          setData(normalized);
          setUseMock(false);
        } else {
          // Node doesn't exist – use demo data so the dashboard is still usable
          setData({ ...MOCK_TRASHBIN_DATA, last_update: new Date().toISOString() });
          setUseMock(true);
        }
        setLoading(false);
      },
      (err) => {
        console.error("Firebase error:", err);
        setError(err.message);
        setData({ ...MOCK_TRASHBIN_DATA, last_update: new Date().toISOString() });
        setUseMock(true);
        setLoading(false);
      }
    );

    return () => off(binRef);
  }, [binId]);

  return { data, loading, error, useMock };
}

export function useAllBins() {
  const [bins, setBins] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const rootRef = ref(db, "/");
    const unsubscribe = onValue(
      rootRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const val = snapshot.val();
          const keys = Object.keys(val).filter((k) => k.startsWith("trashbin_id"));
          setBins(keys);
        } else {
          // Demo bins
          setBins(["trashbin_id0001", "trashbin_id0002", "trashbin_id0003"]);
        }
        setLoading(false);
      },
      () => {
        setBins(["trashbin_id0001", "trashbin_id0002", "trashbin_id0003"]);
        setLoading(false);
      }
    );
    return () => off(rootRef);
  }, []);

  return { bins, loading };
}
