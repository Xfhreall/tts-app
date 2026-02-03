"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check, Eye, EyeOff, Zap } from "lucide-react";
import { useCallback, useEffect, useRef } from "react";

import { Button } from "@/shared/components/ui/button";
import { useCrosswordGrid } from "@/shared/hooks";
import type { PlacedWord } from "@/shared/lib/types";
import { cn } from "@/shared/lib/utils";

interface CrosswordGridProps {
  grid: string[][];
  words: PlacedWord[];
  onComplete?: () => void;
  onProgressChange?: (progress: number) => void;
}

export function CrosswordGrid({ grid, words, onComplete, onProgressChange }: CrosswordGridProps) {
  const gridRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    cells,
    activeCell,
    showValidation,
    width,
    height,
    isInActiveWord,
    handleCellClick,
    handleInput,
    checkAnswers,
    hideValidation,
  } = useCrosswordGrid({ grid, words, onComplete, onProgressChange });

  const cellSize = Math.min(42, 550 / Math.max(width, height));

  useEffect(() => {
    if (activeCell && inputRef.current) {
      inputRef.current.focus();
    }
  }, [activeCell]);

  const handleCellClickWithFocus = useCallback(
    (x: number, y: number) => {
      handleCellClick(x, y);
      if (inputRef.current) {
        inputRef.current.focus();
      }
    },
    [handleCellClick]
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      if (value && /^[a-zA-Z]$/.test(value)) {
        handleInput(value.toUpperCase());
      }
      e.target.value = "";
    },
    [handleInput]
  );

  const handleInputKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Backspace") {
        e.preventDefault();
        handleInput("Backspace");
      } else if (
        e.key === "ArrowUp" ||
        e.key === "ArrowDown" ||
        e.key === "ArrowLeft" ||
        e.key === "ArrowRight" ||
        e.key === "Tab"
      ) {
        e.preventDefault();
        handleInput(e.key);
      }
    },
    [handleInput]
  );

  return (
    <div className="space-y-6">
      <input
        ref={inputRef}
        type="text"
        inputMode="text"
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="characters"
        spellCheck={false}
        className="absolute opacity-0 w-0 h-0 pointer-events-none"
        style={{ position: "absolute", left: "-9999px" }}
        onChange={handleInputChange}
        onKeyDown={handleInputKeyDown}
        aria-label="Crossword input"
      />

      <div className="relative">
        <div className="absolute inset-0 bg-primary/5 blur-3xl rounded-full scale-75 opacity-50" />

        <motion.div
          ref={gridRef}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="relative inline-grid gap-0.5 bg-linear-to-br from-border to-border/50 p-0.5 rounded-xl shadow-lg focus-within:ring-2 focus-within:ring-primary/50 focus-within:shadow-primary/20 focus-within:shadow-xl transition-shadow duration-300"
          style={{
            gridTemplateColumns: `repeat(${width}, ${cellSize}px)`,
          }}
          tabIndex={-1}
          onClick={() => inputRef.current?.focus()}
        >
          {cells.map((row, y) =>
            row.map((cell, x) => {
              const isActive = activeCell?.x === x && activeCell?.y === y;
              const isHighlighted = isInActiveWord(x, y);
              const isCorrect =
                showValidation && cell.userLetter && cell.userLetter === cell.correctLetter;
              const isWrong =
                showValidation && cell.userLetter && cell.userLetter !== cell.correctLetter;
              const cellKey = `${x}-${y}`;

              return (
                <motion.div
                  key={cellKey}
                  initial={false}
                  animate={{
                    scale: isActive ? 1.02 : 1,
                    backgroundColor: cell.isBlocked
                      ? "var(--color-muted)"
                      : isActive
                        ? "var(--color-primary)"
                        : isHighlighted
                          ? "color-mix(in srgb, var(--color-primary) 15%, transparent)"
                          : isCorrect
                            ? "color-mix(in srgb, var(--color-green-500) 20%, var(--color-background))"
                            : isWrong
                              ? "color-mix(in srgb, var(--color-red-500) 20%, var(--color-background))"
                              : "var(--color-background)",
                  }}
                  transition={{ duration: 0.15 }}
                  whileTap={!cell.isBlocked ? { scale: 0.95 } : undefined}
                  className={cn(
                    "relative flex items-center justify-center font-bold cursor-pointer select-none overflow-hidden",
                    cell.isBlocked
                      ? "cursor-default bg-muted"
                      : isActive
                        ? "text-primary-foreground z-10 shadow-lg"
                        : isCorrect
                          ? "text-green-700 dark:text-green-400"
                          : isWrong
                            ? "text-red-700 dark:text-red-400"
                            : "hover:bg-muted/50",
                    "first:rounded-tl-lg",
                    x === width - 1 && y === 0 && "rounded-tr-lg",
                    x === 0 && y === height - 1 && "rounded-bl-lg",
                    x === width - 1 && y === height - 1 && "rounded-br-lg"
                  )}
                  style={{
                    width: cellSize,
                    height: cellSize,
                    fontSize: cellSize * 0.48,
                  }}
                  onClick={() => handleCellClickWithFocus(x, y)}
                >
                  {cell.number && (
                    <span
                      className={cn(
                        "absolute top-0.5 left-1 font-medium tracking-tight",
                        isActive ? "text-primary-foreground/80" : "text-muted-foreground"
                      )}
                      style={{ fontSize: cellSize * 0.22 }}
                    >
                      {cell.number}
                    </span>
                  )}

                  {!cell.isBlocked && (
                    <AnimatePresence mode="wait">
                      {cell.userLetter && (
                        <motion.span
                          key={cell.userLetter}
                          initial={{ opacity: 0, y: -8, scale: 0.8 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          transition={{ duration: 0.12 }}
                          className="uppercase"
                        >
                          {cell.userLetter}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  )}

                  {isCorrect && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-0.5 right-0.5"
                    >
                      <div className="w-3 h-3 bg-green-500 rounded-full flex items-center justify-center">
                        <Check className="w-2 h-2 text-white" strokeWidth={3} />
                      </div>
                    </motion.div>
                  )}

                  {isActive && !cell.isBlocked && (
                    <motion.div
                      className="absolute inset-0 bg-primary/20 rounded"
                      animate={{ opacity: [0.5, 0.8, 0.5] }}
                      transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
                    />
                  )}
                </motion.div>
              );
            })
          )}
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex flex-wrap gap-3"
      >
        <Button
          onClick={checkAnswers}
          variant="default"
          size="sm"
          className="gap-2 shadow-md hover:shadow-lg transition-shadow"
        >
          <Zap className="w-4 h-4" />
          Cek Jawaban
        </Button>
        <Button onClick={hideValidation} variant="outline" size="sm" className="gap-2">
          {showValidation ? (
            <>
              <EyeOff className="w-4 h-4" />
              Sembunyikan
            </>
          ) : (
            <>
              <Eye className="w-4 h-4" />
              Tampilkan
            </>
          )}
        </Button>
      </motion.div>
    </div>
  );
}
