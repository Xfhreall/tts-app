"use client";

import { Calendar, Eye, Hash, MoreVertical, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { DifficultyBadge } from "@/shared/components/difficulty-badge";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import type { Difficulty } from "@/shared/lib/difficulty";

interface PuzzleItem {
  id: string;
  title: string;
  published: boolean;
  difficulty: string;
  createdAt: string;
  wordCount: number;
}

interface PuzzleTableProps {
  puzzles: PuzzleItem[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export function PuzzleTable({ puzzles, onEdit, onDelete }: PuzzleTableProps) {
  if (puzzles.length === 0) {
    return (
      <div className="text-center py-12 px-4 text-muted-foreground">
        <p className="mb-4">Belum ada puzzle yang dibuat</p>
        <Button asChild size="sm">
          <Link href="/admin/create">Buat Puzzle Baru</Link>
        </Button>
      </div>
    );
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <>
      {/* Mobile Card View */}
      <div className="sm:hidden divide-y">
        {puzzles.map((puzzle) => (
          <div key={puzzle.id} className="p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-sm truncate">{puzzle.title}</h3>
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  <Badge
                    variant={puzzle.published ? "default" : "secondary"}
                    className={
                      puzzle.published ? "bg-green-500/10 text-green-600 border-green-500/20" : ""
                    }
                  >
                    {puzzle.published ? "Published" : "Draft"}
                  </Badge>
                  <DifficultyBadge difficulty={puzzle.difficulty as Difficulty} />
                </div>
                <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Hash className="w-3 h-3" />
                    {puzzle.wordCount} kata
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {formatDate(puzzle.createdAt)}
                  </span>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href={`/play/${puzzle.id}`} className="flex items-center gap-2">
                      <Eye className="w-4 h-4" />
                      Lihat
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => onEdit(puzzle.id)}
                    className="flex items-center gap-2"
                  >
                    <Pencil className="w-4 h-4" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => onDelete(puzzle.id)}
                    className="flex items-center gap-2 text-destructive focus:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                    Hapus
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table View */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-muted/30">
              <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">
                Judul
              </th>
              <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">
                Kata
              </th>
              <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">
                Level
              </th>
              <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">
                Status
              </th>
              <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">
                Tanggal
              </th>
              <th className="text-right py-3 px-4 font-medium text-sm text-muted-foreground">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {puzzles.map((puzzle) => (
              <tr key={puzzle.id} className="hover:bg-muted/30 transition-colors">
                <td className="py-3 px-4">
                  <span className="font-medium text-sm">{puzzle.title}</span>
                </td>
                <td className="py-3 px-4">
                  <span className="text-sm text-muted-foreground">{puzzle.wordCount}</span>
                </td>
                <td className="py-3 px-4">
                  <DifficultyBadge difficulty={puzzle.difficulty as Difficulty} />
                </td>
                <td className="py-3 px-4">
                  <Badge
                    variant={puzzle.published ? "default" : "secondary"}
                    className={
                      puzzle.published ? "bg-green-500/10 text-green-600 border-green-500/20" : ""
                    }
                  >
                    {puzzle.published ? "Published" : "Draft"}
                  </Badge>
                </td>
                <td className="py-3 px-4">
                  <span className="text-sm text-muted-foreground">
                    {formatDate(puzzle.createdAt)}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center justify-end gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                      <Link href={`/play/${puzzle.id}`}>
                        <Eye className="w-4 h-4" />
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => onEdit(puzzle.id)}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={() => onDelete(puzzle.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
