"use client";

import { AlertCircle, Trash2 } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import type { WordInput } from "@/shared/lib/types";

interface WordInputFormProps {
  words: WordInput[];
  onChange: (words: WordInput[]) => void;
  disabled?: boolean;
  maxWords?: number;
}

export function WordInputForm({
  words,
  onChange,
  disabled = false,
  maxWords = 15,
}: WordInputFormProps) {
  const removeWord = (index: number) => {
    onChange(words.filter((_, i) => i !== index));
  };

  const updateWord = (index: number, field: keyof WordInput, value: string) => {
    const updated = [...words];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base sm:text-lg font-semibold">Daftar Kata</h3>
          <p className="text-xs sm:text-sm text-muted-foreground">
            {words.length}/{maxWords} kata
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {words.map((word, index) => (
          <Card key={`word-${index + 1}`} className="p-3 sm:p-4 border-0 bg-muted/50">
            <div className="flex gap-2 sm:gap-3">
              {/* Number indicator */}
              <div className="flex flex-col items-center gap-1 pt-2">
                <span className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs sm:text-sm font-bold">
                  {index + 1}
                </span>
              </div>

              {/* Input fields */}
              <div className="flex-1 space-y-2 sm:space-y-3">
                <div>
                  <Label className="text-xs text-muted-foreground mb-1 block sm:hidden">Kata</Label>
                  <Input
                    placeholder="Masukkan kata"
                    value={word.text}
                    onChange={(e) => updateWord(index, "text", e.target.value.toUpperCase())}
                    disabled={disabled}
                    className="font-mono uppercase text-sm sm:text-base h-9 sm:h-10"
                  />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground mb-1 block sm:hidden">
                    Petunjuk
                  </Label>
                  <Input
                    placeholder="Masukkan petunjuk/clue"
                    value={word.clue}
                    onChange={(e) => updateWord(index, "clue", e.target.value)}
                    disabled={disabled}
                    className="text-sm sm:text-base h-9 sm:h-10"
                  />
                </div>
              </div>

              {/* Delete button */}
              <div className="pt-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 sm:h-9 sm:w-9 text-muted-foreground hover:text-destructive"
                  onClick={() => removeWord(index)}
                  disabled={disabled || words.length <= 1}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {words.length < 5 && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
          <p className="text-xs sm:text-sm text-amber-600 dark:text-amber-400">
            Minimal 5 kata diperlukan untuk membuat TTS
          </p>
        </div>
      )}
    </div>
  );
}
