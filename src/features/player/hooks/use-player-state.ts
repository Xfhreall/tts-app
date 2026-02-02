"use client";

import { useCallback, useState } from "react";
import type { PlayerState } from "../types/player";

export function usePlayerState() {
  const [state, setState] = useState<PlayerState>({
    progress: 0,
    isComplete: false,
    finalTime: 0,
  });

  const setProgress = useCallback((progress: number) => {
    setState((s) => ({ ...s, progress }));
  }, []);

  const setComplete = useCallback(() => {
    setState((s) => ({ ...s, isComplete: true }));
  }, []);

  const updateTime = useCallback((time: number) => {
    setState((s) => (s.isComplete ? s : { ...s, finalTime: time }));
  }, []);

  return {
    ...state,
    setProgress,
    setComplete,
    updateTime,
  };
}
