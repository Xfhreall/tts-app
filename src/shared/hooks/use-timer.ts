"use client";

import { useCallback, useEffect, useState } from "react";

interface UseTimerProps {
  autoStart?: boolean;
  onTimeChange?: (seconds: number) => void;
}

export function useTimer({ autoStart = true, onTimeChange }: UseTimerProps = {}) {
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(autoStart);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isRunning) {
      interval = setInterval(() => {
        setSeconds((prev) => {
          const newSeconds = prev + 1;
          onTimeChange?.(newSeconds);
          return newSeconds;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, onTimeChange]);

  const formatTime = useCallback((totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    }
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  }, []);

  const toggle = useCallback(() => {
    setIsRunning((prev) => !prev);
  }, []);

  const reset = useCallback(() => {
    setSeconds(0);
    setIsRunning(false);
    onTimeChange?.(0);
  }, [onTimeChange]);

  const start = useCallback(() => {
    setIsRunning(true);
  }, []);

  const pause = useCallback(() => {
    setIsRunning(false);
  }, []);

  return {
    seconds,
    isRunning,
    formattedTime: formatTime(seconds),
    toggle,
    reset,
    start,
    pause,
  };
}
