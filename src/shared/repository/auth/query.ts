"use client";

import { useQuery } from "@tanstack/react-query";
import type { MeResponseDto } from "./dto";

async function fetchCurrentUser(): Promise<MeResponseDto> {
  const res = await fetch("/api/auth/me");
  if (!res.ok) {
    throw new Error("Failed to fetch user");
  }
  return res.json();
}

export function useCurrentUserQuery() {
  return useQuery({
    queryKey: ["auth", "me"],
    queryFn: fetchCurrentUser,
    staleTime: 1000 * 60 * 5,
    retry: false,
  });
}
