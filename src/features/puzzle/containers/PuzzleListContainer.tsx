import { ArrowLeft, Gamepad2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/shared/components/ui/button";
import { PuzzleGrid } from "../components/puzzle-grid";
import { getPuzzlesList } from "../data/puzzles";

export async function PuzzleListContainer() {
  const puzzles = await getPuzzlesList();

  // Convert to plain objects for client component
  const puzzlesData = puzzles.map((puzzle) => ({
    id: puzzle.id,
    title: puzzle.title,
    words: puzzle.words.map((w) => ({ id: w.id })),
    createdAt: puzzle.createdAt.toISOString(),
    difficulty: puzzle.difficulty,
  }));

  return (
    <div className="min-h-screen">
      <header className="glass border-b sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/">
                <ArrowLeft className="w-5 h-5" />
              </Link>
            </Button>
            <div>
              <h1 className="text-lg font-bold">Jelajahi Puzzle</h1>
              <p className="text-sm text-muted-foreground">{puzzles.length} puzzle tersedia</p>
            </div>
          </div>
          <Button asChild>
            <Link href="/admin/create">Buat Sendiri</Link>
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        {puzzles.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-flex p-4 rounded-full bg-muted/50 mb-6">
              <Gamepad2 className="w-10 h-10 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-bold mb-2">Belum ada puzzle</h2>
            <p className="text-muted-foreground mb-6">Jadilah yang pertama membuat puzzle!</p>
            <Button asChild>
              <Link href="/admin/create">Buat TTS</Link>
            </Button>
          </div>
        ) : (
          <PuzzleGrid puzzles={puzzlesData} />
        )}
      </main>
    </div>
  );
}
