import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/shared/lib/db";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const puzzle = await prisma.puzzle.findUnique({
      where: { id },
      include: { words: true },
    });

    if (!puzzle) {
      return NextResponse.json({ error: "Puzzle not found" }, { status: 404 });
    }

    return NextResponse.json(puzzle);
  } catch (error) {
    console.error("Error fetching puzzle:", error);
    return NextResponse.json({ error: "Failed to fetch puzzle" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { published } = body;

    const puzzle = await prisma.puzzle.update({
      where: { id },
      data: { published },
      include: { words: true },
    });

    return NextResponse.json(puzzle);
  } catch (error) {
    console.error("Error updating puzzle:", error);
    return NextResponse.json({ error: "Failed to update puzzle" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.puzzle.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting puzzle:", error);
    return NextResponse.json({ error: "Failed to delete puzzle" }, { status: 500 });
  }
}
