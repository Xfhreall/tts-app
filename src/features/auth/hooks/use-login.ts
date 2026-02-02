"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";
import { useLoginMutation } from "@/shared/repository/auth";

export function useLogin() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const loginMutation = useLoginMutation();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setError(null);

      if (!username.trim() || !password.trim()) {
        setError("Username dan password harus diisi");
        return;
      }

      try {
        const result = await loginMutation.mutateAsync({ username, password });

        if (result.success) {
          const redirect = searchParams.get("redirect") || "/admin";
          router.push(redirect);
        } else {
          setError(result.error || "Login gagal");
        }
      } catch {
        setError("Terjadi kesalahan saat login");
      }
    },
    [username, password, loginMutation, router, searchParams]
  );

  return {
    username,
    password,
    error,
    isLoading: loginMutation.isPending,
    setUsername,
    setPassword,
    handleSubmit,
  };
}
