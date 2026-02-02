"use client";

import { ArrowRight, Grid3X3, Plus, Sparkles } from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "@/shared/components/theme-toggle";
import { Button } from "@/shared/components/ui/button";

export function HomeContainer() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="glass border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 sm:gap-3 group">
            <div className="p-2 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
              <Grid3X3 className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
            </div>
            <span className="text-base sm:text-lg font-bold tracking-tight">My TTS Gue</span>
          </Link>
          <nav className="flex items-center gap-1 sm:gap-2">
            <Button variant="ghost" size="sm" className="hidden sm:inline-flex" asChild>
              <Link href="/puzzles">Jelajahi</Link>
            </Button>
            <Button variant="ghost" size="sm" className="hidden sm:inline-flex" asChild>
              <Link href="/admin">Dashboard</Link>
            </Button>
            <ThemeToggle />
            <Button size="sm" asChild>
              <Link href="/admin/create">
                <Plus className="w-4 h-4 sm:mr-1.5" />
                <span className="hidden sm:inline">Buat TTS</span>
              </Link>
            </Button>
          </nav>
        </div>
      </header>

      <section className="flex-1 flex items-center justify-center px-4 sm:px-6 py-12 sm:py-24">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 rounded-full text-primary text-sm font-medium mb-8">
            <Sparkles className="w-4 h-4" />
            Generator Otomatis
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            Buat Teka Teki Silang
            <br />
            <span className="text-gradient">dengan Mudah</span>
          </h1>

          <p className="text-base sm:text-lg text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed px-2">
            Masukkan kata dan petunjuk, biarkan algoritma cerdas menyusun grid TTS secara otomatis.
            Bagikan dan main bersama teman.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" className="h-12 px-8" asChild>
              <Link href="/admin/create">
                <Plus className="w-5 h-5 mr-2" />
                Buat TTS Baru
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="h-12 px-8" asChild>
              <Link href="/puzzles">
                Lihat Puzzle
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
      <footer className="border-t py-4 sm:py-6">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          My TTS Gue — Technical Test Memento Game Studios
        </div>
      </footer>
    </div>
  );
}
