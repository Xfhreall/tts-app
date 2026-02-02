export type Difficulty = "easy" | "medium" | "hard";

export function calculateDifficulty(wordCount: number): Difficulty {
  if (wordCount <= 8) return "easy";
  if (wordCount <= 13) return "medium";
  return "hard";
}

export function getDifficultyLabel(difficulty: Difficulty): string {
  const labels: Record<Difficulty, string> = {
    easy: "Mudah",
    medium: "Sedang",
    hard: "Sulit",
  };
  return labels[difficulty];
}

export function getDifficultyColor(difficulty: Difficulty): string {
  const colors: Record<Difficulty, string> = {
    easy: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    medium: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    hard: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  };
  return colors[difficulty];
}

export const DIFFICULTY_RANGES = {
  easy: { min: 5, max: 8 },
  medium: { min: 9, max: 13 },
  hard: { min: 14, max: 20 },
} as const;
