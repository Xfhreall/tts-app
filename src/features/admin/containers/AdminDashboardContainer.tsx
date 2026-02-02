"use client";

import { useStore } from "@tanstack/react-store";
import { ArrowLeft, Grid3X3, Hash, LayoutGrid, LogOut, Plus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import { useLogoutMutation } from "@/shared/repository/auth";
import { usePuzzlesQuery } from "@/shared/repository/puzzle";
import { puzzleStore } from "@/shared/store/puzzle-store";
import { DeleteConfirmModal } from "../components/delete-confirm-modal";
import { EditPuzzleModal } from "../components/edit-puzzle-modal";
import { PuzzleFiltersPanel } from "../components/puzzle-filters";
import { PuzzleTable } from "../components/puzzle-table";

export function AdminDashboardContainer() {
  const router = useRouter();
  const { data: puzzles = [], isLoading, refetch } = usePuzzlesQuery();
  const logoutMutation = useLogoutMutation();
  const filters = useStore(puzzleStore, (state) => state.filters);

  const [editingPuzzle, setEditingPuzzle] = useState<{
    id: string;
    title: string;
    published: boolean;
  } | null>(null);
  const [deletingPuzzle, setDeletingPuzzle] = useState<{
    id: string;
    title: string;
  } | null>(null);

  const filteredPuzzles = useMemo(() => {
    return puzzles.filter((puzzle) => {
      if (filters.difficulty !== "all" && puzzle.difficulty !== filters.difficulty) {
        return false;
      }
      if (filters.published === "published" && !puzzle.published) {
        return false;
      }
      if (filters.published === "draft" && puzzle.published) {
        return false;
      }
      return true;
    });
  }, [puzzles, filters]);

  const stats = useMemo(() => {
    const totalPuzzles = puzzles.length;
    const publishedCount = puzzles.filter((p) => p.published).length;
    const totalWords = puzzles.reduce((acc, p) => acc + p.words.length, 0);
    return { totalPuzzles, publishedCount, totalWords };
  }, [puzzles]);

  const handleEdit = (id: string) => {
    const puzzle = puzzles.find((p) => p.id === id);
    if (puzzle) {
      setEditingPuzzle({
        id: puzzle.id,
        title: puzzle.title,
        published: puzzle.published,
      });
    }
  };

  const handleDelete = (id: string) => {
    const puzzle = puzzles.find((p) => p.id === id);
    if (puzzle) {
      setDeletingPuzzle({ id: puzzle.id, title: puzzle.title });
    }
  };

  const handleLogout = async () => {
    await logoutMutation.mutateAsync();
    router.push("/login");
  };

  return (
    <div className="min-h-screen">
      <header className="glass border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-4">
              <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-10 sm:w-10" asChild>
                <Link href="/">
                  <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                </Link>
              </Button>
              <div>
                <h1 className="text-base sm:text-lg font-bold">Dashboard</h1>
                <p className="text-xs sm:text-sm text-muted-foreground hidden sm:block">
                  Kelola puzzle Anda
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 sm:hidden"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" className="hidden sm:flex" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
              <Button size="sm" className="h-8 sm:h-9" asChild>
                <Link href="/admin/create">
                  <Plus className="w-4 h-4 sm:mr-2" />
                  <span className="hidden sm:inline">Buat TTS</span>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 py-4 sm:py-8">
        {/* Stats Grid - Responsive */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-6 sm:mb-8">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-3 sm:p-5">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <div className="hidden sm:flex p-3 rounded-xl bg-primary/10">
                  <Grid3X3 className="w-5 h-5 text-primary" />
                </div>
                <div className="text-center sm:text-left">
                  <p className="text-xl sm:text-2xl font-bold">{stats.totalPuzzles}</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">Total Puzzle</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm">
            <CardContent className="p-3 sm:p-5">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <div className="hidden sm:flex p-3 rounded-xl bg-green-500/10">
                  <LayoutGrid className="w-5 h-5 text-green-600" />
                </div>
                <div className="text-center sm:text-left">
                  <p className="text-xl sm:text-2xl font-bold">{stats.publishedCount}</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">Published</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm">
            <CardContent className="p-3 sm:p-5">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <div className="hidden sm:flex p-3 rounded-xl bg-amber-500/10">
                  <Hash className="w-5 h-5 text-amber-600" />
                </div>
                <div className="text-center sm:text-left">
                  <p className="text-xl sm:text-2xl font-bold">{stats.totalWords}</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">Total Kata</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Puzzle List Section */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h2 className="text-base sm:text-lg font-semibold">Daftar Puzzle</h2>
            <PuzzleFiltersPanel />
          </div>

          <Card className="border-0 shadow-sm overflow-hidden">
            {isLoading ? (
              <div className="p-8 text-center text-muted-foreground">
                <div className="animate-pulse space-y-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={`skeleton-${i + 1}`} className="h-16 bg-muted rounded-lg" />
                  ))}
                </div>
              </div>
            ) : (
              <PuzzleTable
                puzzles={filteredPuzzles.map((p) => ({
                  id: p.id,
                  title: p.title,
                  published: p.published,
                  difficulty: p.difficulty,
                  createdAt: p.createdAt as unknown as string,
                  wordCount: p.words.length,
                }))}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            )}
          </Card>
        </div>
      </main>

      {editingPuzzle && (
        <EditPuzzleModal
          puzzle={editingPuzzle}
          onClose={() => setEditingPuzzle(null)}
          onSuccess={() => {
            setEditingPuzzle(null);
            refetch();
          }}
        />
      )}

      {deletingPuzzle && (
        <DeleteConfirmModal
          puzzleId={deletingPuzzle.id}
          puzzleTitle={deletingPuzzle.title}
          onClose={() => setDeletingPuzzle(null)}
          onSuccess={() => {
            setDeletingPuzzle(null);
            refetch();
          }}
        />
      )}
    </div>
  );
}
