"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Clock, RotateCcw, Sparkles, Star, Trophy } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { useCompletedPuzzles } from "@/shared/hooks/use-completed-puzzles";

interface CompletionModalProps {
  isOpen: boolean;
  onClose: () => void;
  puzzleId: string;
  finalTime: number;
  puzzleTitle: string;
  wordCount: number;
}

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

const getPerformanceRating = (
  time: number,
  wordCount: number
): { stars: number; label: string } => {
  const avgTimePerWord = time / wordCount;
  if (avgTimePerWord < 15) return { stars: 3, label: "Luar Biasa!" };
  if (avgTimePerWord < 30) return { stars: 2, label: "Bagus Sekali!" };
  return { stars: 1, label: "Kerja Bagus!" };
};

const confettiColors = ["#FFD700", "#FF6B6B", "#4ECDC4", "#A78BFA", "#F472B6", "#34D399"];

function Confetti() {
  const [particles, setParticles] = useState<
    Array<{
      id: number;
      x: number;
      delay: number;
      duration: number;
      color: string;
      size: number;
      rotation: number;
    }>
  >([]);

  useEffect(() => {
    const newParticles = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 0.5,
      duration: 2 + Math.random() * 2,
      color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
      size: 6 + Math.random() * 8,
      rotation: Math.random() * 360,
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute"
          style={{
            left: `${particle.x}%`,
            width: particle.size,
            height: particle.size,
            backgroundColor: particle.color,
            borderRadius: Math.random() > 0.5 ? "50%" : "2px",
          }}
          initial={{ top: "-10%", rotate: 0, opacity: 1 }}
          animate={{
            top: "110%",
            rotate: particle.rotation + 720,
            opacity: [1, 1, 0],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            ease: "easeIn",
          }}
        />
      ))}
    </div>
  );
}

function StarRating({ stars }: { stars: number }) {
  return (
    <div className="flex justify-center gap-2">
      {[1, 2, 3].map((index) => (
        <motion.div
          key={index}
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 20,
            delay: 0.3 + index * 0.15,
          }}
        >
          <Star
            className={`w-8 h-8 sm:w-10 sm:h-10 ${
              index <= stars
                ? "fill-yellow-400 text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]"
                : "fill-muted text-muted-foreground/30"
            }`}
          />
        </motion.div>
      ))}
    </div>
  );
}

export function CompletionModal({
  isOpen,
  onClose,
  puzzleId,
  finalTime,
  puzzleTitle,
  wordCount,
}: CompletionModalProps) {
  const { stars, label } = getPerformanceRating(finalTime, wordCount);
  const { markAsCompleted } = useCompletedPuzzles();

  // Mark puzzle as completed when modal opens
  useEffect(() => {
    if (isOpen && puzzleId) {
      markAsCompleted(puzzleId, finalTime, stars);
    }
  }, [isOpen, puzzleId, finalTime, stars, markAsCompleted]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <AnimatePresence>
        {isOpen && (
          <DialogContent
            showCloseButton={false}
            className="sm:max-w-md overflow-hidden border-2 border-primary/20 bg-linear-to-b from-background to-muted/30"
          >
            <Confetti />

            <DialogHeader className="relative z-10">
              <motion.div
                className="flex justify-center mb-4"
                initial={{ scale: 0, y: -50 }}
                animate={{ scale: 1, y: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 260,
                  damping: 20,
                  delay: 0.1,
                }}
              >
                <div className="relative">
                  <motion.div
                    className="absolute inset-0 rounded-full bg-yellow-400/20"
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.5, 0, 0.5],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "easeInOut",
                    }}
                  />
                  <div className="relative p-4 rounded-full bg-linear-to-br from-yellow-400 to-amber-500 shadow-lg shadow-yellow-500/30">
                    <Trophy className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
                  </div>
                  <motion.div
                    className="absolute -top-1 -right-1"
                    animate={{ rotate: [0, 15, -15, 0] }}
                    transition={{
                      duration: 2,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "easeInOut",
                    }}
                  >
                    <Sparkles className="w-5 h-5 text-yellow-400" />
                  </motion.div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <DialogTitle className="text-center text-2xl sm:text-3xl font-bold bg-linear-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  Selamat! 🎉
                </DialogTitle>
                <DialogDescription className="text-center mt-2 text-base">
                  Kamu berhasil menyelesaikan{" "}
                  <span className="font-semibold text-foreground">{puzzleTitle}</span>
                </DialogDescription>
              </motion.div>
            </DialogHeader>

            <motion.div
              className="relative z-10 space-y-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <StarRating stars={stars} />

              <motion.p
                className="text-center text-lg font-semibold text-primary"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 }}
              >
                {label}
              </motion.p>

              <motion.div
                className="flex justify-center gap-6 p-4 rounded-xl bg-muted/50 border"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 text-muted-foreground mb-1">
                    <Clock className="w-4 h-4" />
                    <span className="text-xs uppercase tracking-wider">Waktu</span>
                  </div>
                  <p className="text-2xl font-bold font-mono">{formatTime(finalTime)}</p>
                </div>
                <div className="w-px bg-border" />
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 text-muted-foreground mb-1">
                    <Sparkles className="w-4 h-4" />
                    <span className="text-xs uppercase tracking-wider">Kata</span>
                  </div>
                  <p className="text-2xl font-bold">{wordCount}</p>
                </div>
              </motion.div>

              <motion.div
                className="flex flex-col sm:flex-row gap-3 pt-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <Button variant="outline" className="flex-1 gap-2" asChild>
                  <Link href="/">
                    <ArrowLeft className="w-4 h-4" />
                    Kembali
                  </Link>
                </Button>
                <Button asChild className="flex-1 gap-2">
                  <Link href="/puzzles">
                    <RotateCcw className="w-4 h-4" />
                    Main Lagi
                  </Link>
                </Button>
              </motion.div>
            </motion.div>
          </DialogContent>
        )}
      </AnimatePresence>
    </Dialog>
  );
}
