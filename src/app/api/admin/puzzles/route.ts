import { NextResponse } from "next/server";
import { prisma } from "@/shared/lib/db";

export async function GET() {
  try {
    const puzzles = await prisma.puzzle.findMany({
      orderBy: { createdAt: "desc" },
      include: { words: true },
    });

    return NextResponse.json(puzzles);
  } catch (error) {
    console.error("Error fetching puzzles:", error);
    return NextResponse.json({ error: "Failed to fetch puzzles" }, { status: 500 });
  }
}
