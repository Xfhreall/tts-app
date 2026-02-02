"use client";

import { ArrowLeft, Loader2, Plus, Save, Sparkles } from "lucide-react";
import Link from "next/link";
import { PuzzlePreview } from "@/features/admin/components/puzzle-preview";
import { WordInputForm } from "@/features/admin/components/word-input-form";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader } from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { useCreatePuzzle } from "../hooks/use-create-puzzle";

export function CreatePuzzleContainer() {
  const {
    title,
    words,
    preview,
    isGenerating,
    isPublishing,
    error,
    setTitle,
    setWords,
    addWord,
    handlePublish,
    canAddWord,
    canPublish,
    maxWords,
  } = useCreatePuzzle();

  return (
    <div className="min-h-screen">
      <header className="glass border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-4">
              <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-10 sm:w-10" asChild>
                <Link href="/admin">
                  <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                </Link>
              </Button>
              <div>
                <h1 className="text-base sm:text-lg font-bold">Buat TTS Baru</h1>
                <p className="text-xs sm:text-sm text-muted-foreground hidden sm:block">
                  Masukkan kata dan petunjuk
                </p>
              </div>
            </div>
            <Button
              onClick={handlePublish}
              disabled={!canPublish || isPublishing}
              size="sm"
              className="h-8 sm:h-9"
            >
              {isPublishing ? (
                <Loader2 className="w-4 h-4 sm:mr-2 animate-spin" />
              ) : (
                <Save className="w-4 h-4 sm:mr-2" />
              )}
              <span className="hidden sm:inline">Publish</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 py-4 sm:py-8">
        <div className="grid lg:grid-cols-2 gap-4 sm:gap-8">
          {/* Left Column - Form */}
          <div className="space-y-4 sm:space-y-6">
            <Card className="border-0 shadow-sm">
              <CardContent className="p-4 sm:p-6">
                <Label htmlFor="title" className="text-sm font-medium mb-2 block">
                  Judul Puzzle
                </Label>
                <Input
                  id="title"
                  placeholder="Contoh: TTS Hewan Indonesia"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="text-sm sm:text-base"
                />
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardContent className="p-4 sm:p-6">
                <WordInputForm
                  words={words}
                  onChange={setWords}
                  disabled={isGenerating || isPublishing}
                  maxWords={maxWords}
                />

                {canAddWord && (
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full mt-4"
                    size="sm"
                    onClick={addWord}
                    disabled={isGenerating || isPublishing}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Tambah Kata
                  </Button>
                )}
              </CardContent>
            </Card>

            {error && (
              <Card className="border-destructive/50 bg-destructive/5">
                <CardContent className="p-4 text-destructive text-sm">{error}</CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Preview */}
          <div className="lg:sticky lg:top-24 h-max">
            <Card className="border-0 shadow-sm">
              <CardHeader className="p-4 sm:p-6 pb-0 sm:pb-0">
                <h2 className="text-base sm:text-lg font-semibold flex items-center gap-2">
                  <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                  Preview
                  {isGenerating && <Loader2 className="w-4 h-4 animate-spin ml-auto" />}
                </h2>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                {preview ? (
                  <PuzzlePreview
                    grid={preview.grid}
                    words={preview.words}
                    width={preview.width}
                    height={preview.height}
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center h-48 sm:h-64 text-muted-foreground">
                    <Sparkles className="w-8 h-8 sm:w-10 sm:h-10 mb-3 opacity-40" />
                    <p className="text-xs sm:text-sm text-center px-4">
                      {isGenerating
                        ? "Generating preview..."
                        : "Isi minimal 5 kata dengan clue untuk melihat preview"}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
