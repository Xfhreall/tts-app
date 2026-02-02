"use client";

import { Pause, Play, RotateCcw } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { useTimer } from "@/shared/hooks";

interface TimerProps {
  onTimeChange?: (seconds: number) => void;
  autoStart?: boolean;
}

export function Timer({ onTimeChange, autoStart = true }: TimerProps) {
  const { formattedTime, isRunning, toggle, reset } = useTimer({
    autoStart,
    onTimeChange,
  });

  return (
    <div className="flex items-center gap-2">
      <span className="font-mono text-2xl font-bold min-w-20">{formattedTime}</span>
      <Button variant="outline" size="icon" onClick={toggle}>
        {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
      </Button>
      <Button variant="outline" size="icon" onClick={reset}>
        <RotateCcw className="w-4 h-4" />
      </Button>
    </div>
  );
}
