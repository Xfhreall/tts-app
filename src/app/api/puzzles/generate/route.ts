import { type NextRequest, NextResponse } from "next/server";
import { generateCrossword, validateWords } from "@/shared/lib/crossword-generator";
import type { WordInput } from "@/shared/lib/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { words } = body as { words: WordInput[] };

    const validationErrors = validateWords(words);
    if (validationErrors.length > 0) {
      return NextResponse.json({ error: validationErrors.join(", ") }, { status: 400 });
    }

    const generated = generateCrossword(words);

    return NextResponse.json({
      grid: generated.grid,
      words: generated.words,
      width: generated.width,
      height: generated.height,
      unplacedWords: generated.unplacedWords,
    });
  } catch (error) {
    console.error("Error generating crossword:", error);
    return NextResponse.json({ error: "Failed to generate crossword" }, { status: 500 });
  }
}
