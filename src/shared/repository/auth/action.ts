"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authActions } from "@/shared/store/auth-store";
import type { LoginDto, LoginResponseDto } from "./dto";

async function loginRequest(data: LoginDto): Promise<LoginResponseDto> {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

async function logoutRequest(): Promise<{ success: boolean }> {
  const res = await fetch("/api/auth/logout", {
    method: "POST",
  });
  return res.json();
}

export function useLoginMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: loginRequest,
    onSuccess: (data) => {
      if (data.success && data.user) {
        authActions.setUser(data.user);
        queryClient.invalidateQueries({ queryKey: ["auth"] });
      }
    },
  });
}

export function useLogoutMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logoutRequest,
    onSuccess: () => {
      authActions.logout();
      queryClient.invalidateQueries({ queryKey: ["auth"] });
      queryClient.clear();
    },
  });
}
