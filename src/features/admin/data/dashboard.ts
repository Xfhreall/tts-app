import { getAdminPuzzlesList } from "@/features/puzzle/data/puzzles";

export async function getAdminDashboardData() {
  const puzzles = await getAdminPuzzlesList();
  return {
    puzzles,
    totalPuzzles: puzzles.length,
    publishedCount: puzzles.filter((p) => p.published).length,
    totalWords: puzzles.reduce((acc, p) => acc + p.words.length, 0),
  };
}
