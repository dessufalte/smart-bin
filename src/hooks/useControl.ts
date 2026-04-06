"use client";

import { useEffect, useState, useCallback } from "react";
import { ref, onValue, off, set, update, push, get } from "firebase/database";
import { db } from "@/lib/firebase";
import type {
  ControlState, CalibrationSettings, RecentItem, TrashNetLabel,
} from "@/types";
import { DEFAULT_CONTROL, DEFAULT_CALIBRATION } from "@/types";

// ── Control Panel ──────────────────────────────────────────

export function useControl(binId: string) {
  const [control, setControl] = useState<ControlState>(DEFAULT_CONTROL);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!binId) return;
    const r = ref(db, `${binId}/control`);
    const unsub = onValue(r, (snap) => {
      if (snap.exists()) {
        setControl({ ...DEFAULT_CONTROL, ...snap.val() });
      } else {
        // Write defaults on first load
        set(r, DEFAULT_CONTROL);
      }
      setLoading(false);
    }, () => setLoading(false));
    return () => off(r);
  }, [binId]);

  const updateControl = useCallback(
    async (partial: Partial<ControlState>) => {
      const payload = { ...partial, last_control_update: new Date().toISOString() };
      await update(ref(db, `${binId}/control`), payload);
    },
    [binId]
  );

  const triggerEmergencyStop = useCallback(async () => {
    await update(ref(db, `${binId}/control`), {
      emergency_stop: true,
      light_enabled: false,
      disinfectant_enabled: false,
      lid_locked: true,
      "spreader_plastic/enabled": false,
      "spreader_wet/enabled": false,
      "spreader_dry/enabled": false,
      last_control_update: new Date().toISOString(),
    });
  }, [binId]);

  const releaseEmergencyStop = useCallback(async () => {
    await updateControl({ emergency_stop: false });
  }, [updateControl]);

  return { control, loading, updateControl, triggerEmergencyStop, releaseEmergencyStop };
}

// ── Calibration ────────────────────────────────────────────

export function useCalibration(binId: string) {
  const [calib, setCalib] = useState<CalibrationSettings>(DEFAULT_CALIBRATION);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!binId) return;
    const r = ref(db, `${binId}/calibration`);
    const unsub = onValue(r, (snap) => {
      if (snap.exists()) setCalib({ ...DEFAULT_CALIBRATION, ...snap.val() });
      else set(r, DEFAULT_CALIBRATION);
      setLoading(false);
    }, () => setLoading(false));
    return () => off(r);
  }, [binId]);

  const saveCalibration = useCallback(
    async (data: Partial<CalibrationSettings>) => {
      await update(ref(db, `${binId}/calibration`), data);
    },
    [binId]
  );

  return { calib, loading, saveCalibration };
}

// ── Observer / Recent Items ────────────────────────────────

export function useObserver(binId: string) {
  const [items, setItems] = useState<RecentItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!binId) return;
    const r = ref(db, `${binId}/observer/recent_items`);
    const unsub = onValue(r, (snap) => {
      if (snap.exists()) {
        const raw = snap.val() as Record<string, RecentItem>;
        const arr = Object.entries(raw)
          .map(([id, v]) => ({ ...v, id }))
          .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
          .slice(0, 30);
        setItems(arr);
      } else {
        setItems([]);
      }
      setLoading(false);
    }, () => setLoading(false));
    return () => off(r);
  }, [binId]);

  const submitFeedback = useCallback(
    async (itemId: string, feedback: "correct" | "incorrect", feedbackLabel?: TrashNetLabel) => {
      await update(ref(db, `${binId}/observer/recent_items/${itemId}`), {
        feedback,
        feedback_label: feedbackLabel ?? null,
      });
    },
    [binId]
  );

  return { items, loading, submitFeedback };
}

// ── Bin ID Validation ──────────────────────────────────────

export async function validateBinId(rawId: string): Promise<string | null> {
  // Normalize: "0001" → "trashbin_id0001", "trashbin_id0001" → "trashbin_id0001"
  let id = rawId.trim();
  if (!id.startsWith("trashbin_")) {
    id = `trashbin_id${id.padStart(4, "0")}`;
  }

  try {
    const snap = await get(ref(db, id));
    // Accept even if node is empty (will use mock data), 
    // but validate format is correct
    if (/^trashbin_id\d+$/.test(id)) return id;
    return null;
  } catch {
    // Network error — still accept if format is valid
    if (/^trashbin_id\d+$/.test(id)) return id;
    return null;
  }
}
