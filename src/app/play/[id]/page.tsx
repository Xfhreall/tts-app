"use client";

import { use } from "react";
import { PlayerContainer } from "@/features/player/containers";

interface PlayPageProps {
  params: Promise<{ id: string }>;
}

export default function PlayPage({ params }: PlayPageProps) {
  const { id } = use(params);
  return <PlayerContainer puzzleId={id} />;
}
