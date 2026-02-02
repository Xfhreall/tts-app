import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { generateCrossword, validateWords } from "@/shared/lib/crossword-generator";
import { prisma } from "@/shared/lib/db";
import { calculateDifficulty } from "@/shared/lib/difficulty";
import { getSession } from "@/shared/lib/session";
import type { WordInput } from "@/shared/lib/types";

export async function GET() {
  try {
    const puzzles = await prisma.puzzle.findMany({
      where: { published: true },
      orderBy: { createdAt: "desc" },
      include: { words: true },
    });

    return NextResponse.json(puzzles);
  } catch (error) {
    console.error("Error fetching puzzles:", error);
    return NextResponse.json({ error: "Failed to fetch puzzles" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    const body = await request.json();
    const {
      title,
      words,
      publish = false,
    } = body as {
      title: string;
      words: WordInput[];
      publish?: boolean;
    };

    if (!title?.trim()) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    const validationErrors = validateWords(words);
    if (validationErrors.length > 0) {
      return NextResponse.json({ error: validationErrors.join(", ") }, { status: 400 });
    }

    const generated = generateCrossword(words);

    if (generated.unplacedWords.length > 0) {
      return NextResponse.json(
        {
          error: `Beberapa kata tidak dapat ditempatkan: ${generated.unplacedWords.join(", ")}`,
          unplacedWords: generated.unplacedWords,
        },
        { status: 400 }
      );
    }

    const difficulty = calculateDifficulty(generated.words.length);

    const puzzle = await prisma.puzzle.create({
      data: {
        title,
        gridData: {
          grid: generated.grid,
          width: generated.width,
          height: generated.height,
        },
        published: publish,
        difficulty,
        userId: session.userId || null,
        words: {
          create: generated.words.map((word) => ({
            text: word.text,
            clue: word.clue,
            direction: word.direction,
            startX: word.startX,
            startY: word.startY,
            number: word.number,
          })),
        },
      },
      include: { words: true },
    });

    return NextResponse.json(puzzle, { status: 201 });
  } catch (error) {
    console.error("Error creating puzzle:", error);
    return NextResponse.json({ error: "Failed to create puzzle" }, { status: 500 });
  }
}
