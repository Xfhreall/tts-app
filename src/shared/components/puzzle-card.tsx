"use client";

import { Calendar, CheckCircle2, Hash, Play, Trophy } from "lucide-react";
import Link from "next/link";
import { DifficultyBadge } from "@/shared/components/difficulty-badge";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import type { Difficulty } from "@/shared/lib/difficulty";

interface PuzzleCardProps {
  id: string;
  title: string;
  wordCount: number;
  createdAt: string;
  published?: boolean;
  showStatus?: boolean;
  isCompleted?: boolean;
  difficulty?: Difficulty;
}

export function PuzzleCard({
  id,
  title,
  wordCount,
  createdAt,
  published = true,
  showStatus = false,
  isCompleted = false,
  difficulty,
}: PuzzleCardProps) {
  const date = new Date(createdAt).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <Card
      className={`group border-0 min-h-32 shadow-sm hover:shadow-lg transition-all hover:-translate-y-0.5 relative ${isCompleted ? "ring-2 ring-green-500/20" : ""}`}
    >
      {isCompleted && (
        <div className="absolute top-4 right-4 z-10">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-500 shadow-lg shadow-green-500/30">
            <CheckCircle2 className="w-5 h-5 text-white" />
          </div>
        </div>
      )}
      <CardContent className="px-5 grid h-full">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold line-clamp-2 group-hover:text-primary transition-colors">
              {title}
            </h3>
            {isCompleted && (
              <Badge
                variant="secondary"
                className="bg-green-500/10 text-green-600 border-green-500/20 shrink-0"
              >
                <Trophy className="w-3 h-3 mr-1" />
                Selesai
              </Badge>
            )}
          </div>
          {showStatus && (
            <Badge variant={published ? "default" : "secondary"} className="ml-2 shrink-0">
              {published ? "Live" : "Draft"}
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-3 text-sm text-muted-foreground mb-4">
          <div className="flex items-center gap-1">
            <Hash className="w-3.5 h-3.5" />
            <span>{wordCount} kata</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            <span>{date}</span>
          </div>
          {difficulty && <DifficultyBadge difficulty={difficulty} />}
        </div>

        <Button
          asChild
          className={`w-full mt-auto ${isCompleted ? "bg-green-600 hover:bg-green-700" : ""}`}
          size="sm"
        >
          <Link href={`/play/${id}`}>
            <Play className="w-4 h-4 mr-2" />
            {isCompleted ? "Main Lagi" : "Main"}
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
