import { prisma } from "@/shared/lib/db";

export async function getPuzzlesList() {
  return prisma.puzzle.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
    include: { words: true },
  });
}

export async function getAdminPuzzlesList() {
  return prisma.puzzle.findMany({
    orderBy: { createdAt: "desc" },
    include: { words: true },
  });
}
