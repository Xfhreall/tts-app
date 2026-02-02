import { type Difficulty, getDifficultyColor, getDifficultyLabel } from "@/shared/lib/difficulty";
import { cn } from "@/shared/lib/utils";

interface DifficultyBadgeProps {
  difficulty: Difficulty;
  className?: string;
}

export function DifficultyBadge({ difficulty, className }: DifficultyBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
        getDifficultyColor(difficulty),
        className
      )}
    >
      {getDifficultyLabel(difficulty)}
    </span>
  );
}
