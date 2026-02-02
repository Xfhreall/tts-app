"use client";

import { motion } from "framer-motion";
import { ArrowDown, ArrowRight, CircleDot, Lightbulb } from "lucide-react";
import type { PlacedWord } from "@/shared/lib/types";
import { cn } from "@/shared/lib/utils";

interface CluePanelProps {
  words: PlacedWord[];
  activeWordNumber?: number;
  activeDirection?: "across" | "down";
  onClueClick?: (word: PlacedWord) => void;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.03,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: { opacity: 1, x: 0 },
};

function ClueItem({
  word,
  isActive,
  onClick,
}: {
  word: PlacedWord;
  isActive: boolean;
  onClick?: () => void;
}) {
  return (
    <motion.li
      variants={itemVariants}
      whileHover={{ x: 4 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "group relative p-3 rounded-xl cursor-pointer transition-all duration-200",
        "border border-transparent",
        isActive
          ? "bg-primary/10 border-primary/30 shadow-sm shadow-primary/10"
          : "hover:bg-muted/80 hover:border-border/50"
      )}
      onClick={onClick}
    >
      <motion.div
        initial={false}
        animate={{
          scaleY: isActive ? 1 : 0,
          opacity: isActive ? 1 : 0,
        }}
        className="absolute left-0 top-2 bottom-2 w-1 bg-primary rounded-full origin-center"
      />

      <div className="flex items-start gap-3">
        <span
          className={cn(
            "shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-sm font-bold transition-colors",
            isActive
              ? "bg-primary text-primary-foreground shadow-sm"
              : "bg-muted text-muted-foreground group-hover:bg-primary/20 group-hover:text-primary"
          )}
        >
          {word.number}
        </span>

        <p
          className={cn(
            "text-sm leading-relaxed pt-0.5 transition-colors",
            isActive
              ? "text-foreground font-medium"
              : "text-muted-foreground group-hover:text-foreground"
          )}
        >
          {word.clue}
        </p>
      </div>

      {isActive && (
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute top-2 right-2"
        >
          <CircleDot className="w-3 h-3 text-primary" />
        </motion.div>
      )}
    </motion.li>
  );
}

function ClueSection({
  title,
  icon: Icon,
  words,
  direction,
  activeWordNumber,
  activeDirection,
  onClueClick,
}: {
  title: string;
  icon: typeof ArrowRight;
  words: PlacedWord[];
  direction: "across" | "down";
  activeWordNumber?: number;
  activeDirection?: "across" | "down";
  onClueClick?: (word: PlacedWord) => void;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3 pb-2 border-b border-border/50">
        <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-primary/10 text-primary shadow-sm">
          <Icon className="w-5 h-5" strokeWidth={2.5} />
        </div>
        <div>
          <h3 className="font-bold text-base">{title}</h3>
          <p className="text-xs text-muted-foreground">{words.length} petunjuk</p>
        </div>
      </div>

      <motion.ul
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-1.5"
      >
        {words.map((word) => (
          <ClueItem
            key={`${direction}-${word.number}`}
            word={word}
            isActive={activeWordNumber === word.number && activeDirection === direction}
            onClick={() => onClueClick?.(word)}
          />
        ))}
      </motion.ul>
    </div>
  );
}

export function CluePanel({
  words,
  activeWordNumber,
  activeDirection,
  onClueClick,
}: CluePanelProps) {
  const acrossWords = words
    .filter((w) => w.direction === "across")
    .sort((a, b) => a.number - b.number);

  const downWords = words.filter((w) => w.direction === "down").sort((a, b) => a.number - b.number);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="space-y-6"
    >
      <div className="grid gap-8">
        <ClueSection
          title="Mendatar"
          icon={ArrowRight}
          words={acrossWords}
          direction="across"
          activeWordNumber={activeWordNumber}
          activeDirection={activeDirection}
          onClueClick={onClueClick}
        />

        <ClueSection
          title="Menurun"
          icon={ArrowDown}
          words={downWords}
          direction="down"
          activeWordNumber={activeWordNumber}
          activeDirection={activeDirection}
          onClueClick={onClueClick}
        />
      </div>
    </motion.div>
  );
}
