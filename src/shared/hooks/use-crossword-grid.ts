"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { PlacedWord } from "@/shared/lib/types";

interface CellData {
  x: number;
  y: number;
  correctLetter: string;
  userLetter: string;
  number?: number;
  isBlocked: boolean;
}

interface UseCrosswordGridProps {
  grid: string[][];
  words: PlacedWord[];
  onComplete?: () => void;
  onProgressChange?: (progress: number) => void;
}

export function useCrosswordGrid({
  grid,
  words,
  onComplete,
  onProgressChange,
}: UseCrosswordGridProps) {
  const onCompleteRef = useRef(onComplete);
  const onProgressChangeRef = useRef(onProgressChange);

  useEffect(() => {
    onCompleteRef.current = onComplete;
    onProgressChangeRef.current = onProgressChange;
  }, [onComplete, onProgressChange]);
  const [cells, setCells] = useState<CellData[][]>([]);
  const [activeCell, setActiveCell] = useState<{ x: number; y: number } | null>(null);
  const [direction, setDirection] = useState<"across" | "down">("across");
  const [showValidation, setShowValidation] = useState(false);

  const height = grid.length;
  const width = grid[0]?.length || 0;

  useEffect(() => {
    const newCells: CellData[][] = grid.map((row, y) =>
      row.map((cell, x) => {
        const word = words.find((w) => w.startX === x && w.startY === y);
        return {
          x,
          y,
          correctLetter: cell,
          userLetter: "",
          number: word?.number,
          isBlocked: cell === "",
        };
      })
    );
    setCells(newCells);
    setShowValidation(false);
  }, [grid, words]);

  const getActiveWord = useCallback((): PlacedWord | null => {
    if (!activeCell) return null;
    return (
      words.find((w) => {
        if (w.direction !== direction) return false;
        const dx = direction === "across" ? 1 : 0;
        const dy = direction === "down" ? 1 : 0;
        for (let i = 0; i < w.text.length; i++) {
          if (w.startX + i * dx === activeCell.x && w.startY + i * dy === activeCell.y) {
            return true;
          }
        }
        return false;
      }) || null
    );
  }, [activeCell, direction, words]);

  const isInActiveWord = useCallback(
    (x: number, y: number): boolean => {
      const word = getActiveWord();
      if (!word) return false;
      const dx = word.direction === "across" ? 1 : 0;
      const dy = word.direction === "down" ? 1 : 0;
      for (let i = 0; i < word.text.length; i++) {
        if (word.startX + i * dx === x && word.startY + i * dy === y) {
          return true;
        }
      }
      return false;
    },
    [getActiveWord]
  );

  const moveToNextCell = useCallback(
    (fromX: number, fromY: number, forward: boolean = true) => {
      const dx = direction === "across" ? (forward ? 1 : -1) : 0;
      const dy = direction === "down" ? (forward ? 1 : -1) : 0;
      const nextX = fromX + dx;
      const nextY = fromY + dy;

      if (
        nextX >= 0 &&
        nextX < width &&
        nextY >= 0 &&
        nextY < height &&
        cells[nextY]?.[nextX] &&
        !cells[nextY][nextX].isBlocked
      ) {
        setActiveCell({ x: nextX, y: nextY });
      }
    },
    [direction, width, height, cells]
  );

  const handleCellClick = useCallback(
    (x: number, y: number) => {
      if (cells[y]?.[x]?.isBlocked) return;

      if (activeCell?.x === x && activeCell?.y === y) {
        setDirection((d) => (d === "across" ? "down" : "across"));
      } else {
        setActiveCell({ x, y });
      }
    },
    [cells, activeCell]
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!activeCell) return;

      const { x, y } = activeCell;

      if (e.key === "Tab") {
        e.preventDefault();
        setDirection((d) => (d === "across" ? "down" : "across"));
        return;
      }

      if (e.key === "ArrowUp") {
        e.preventDefault();
        if (y > 0 && !cells[y - 1][x].isBlocked) {
          setActiveCell({ x, y: y - 1 });
          setDirection("down");
        }
        return;
      }

      if (e.key === "ArrowDown") {
        e.preventDefault();
        if (y < height - 1 && !cells[y + 1][x].isBlocked) {
          setActiveCell({ x, y: y + 1 });
          setDirection("down");
        }
        return;
      }

      if (e.key === "ArrowLeft") {
        e.preventDefault();
        if (x > 0 && !cells[y][x - 1].isBlocked) {
          setActiveCell({ x: x - 1, y });
          setDirection("across");
        }
        return;
      }

      if (e.key === "ArrowRight") {
        e.preventDefault();
        if (x < width - 1 && !cells[y][x + 1].isBlocked) {
          setActiveCell({ x: x + 1, y });
          setDirection("across");
        }
        return;
      }

      if (e.key === "Backspace") {
        e.preventDefault();
        setCells((prev) => {
          const newCells = [...prev];
          if (newCells[y][x].userLetter === "") {
            moveToNextCell(x, y, false);
          } else {
            newCells[y] = [...newCells[y]];
            newCells[y][x] = { ...newCells[y][x], userLetter: "" };
          }
          return newCells;
        });
        return;
      }

      if (/^[a-zA-Z]$/.test(e.key)) {
        e.preventDefault();
        setCells((prev) => {
          const newCells = [...prev];
          newCells[y] = [...newCells[y]];
          newCells[y][x] = {
            ...newCells[y][x],
            userLetter: e.key.toUpperCase(),
          };
          return newCells;
        });
        moveToNextCell(x, y, true);
      }
    },
    [activeCell, cells, height, width, moveToNextCell]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const cellsRef = useRef(cells);
  cellsRef.current = cells;

  const cellsLengthForTrigger = cells.reduce(
    (acc, row) => acc + row.filter((c) => c.userLetter).length,
    0
  );

  // biome-ignore lint/correctness/useExhaustiveDependencies: cellsLengthForTrigger is intentionally used as a trigger
  useEffect(() => {
    if (cellsRef.current.length === 0) return;

    let filled = 0;
    let total = 0;
    let allCorrect = true;

    for (const row of cellsRef.current) {
      for (const cell of row) {
        if (!cell.isBlocked) {
          total++;
          if (cell.userLetter) {
            filled++;
            if (cell.userLetter !== cell.correctLetter) {
              allCorrect = false;
            }
          } else {
            allCorrect = false;
          }
        }
      }
    }

    const progress = total > 0 ? Math.round((filled / total) * 100) : 0;
    onProgressChangeRef.current?.(progress);

    if (filled === total && allCorrect) {
      onCompleteRef.current?.();
    }
  }, [cellsLengthForTrigger]);

  const checkAnswers = useCallback(() => {
    setShowValidation(true);
  }, []);

  const hideValidation = useCallback(() => {
    setShowValidation(false);
  }, []);

  const activeWord = useMemo(() => getActiveWord(), [getActiveWord]);

  return {
    cells,
    activeCell,
    direction,
    showValidation,
    width,
    height,
    activeWord,
    isInActiveWord,
    handleCellClick,
    checkAnswers,
    hideValidation,
  };
}
