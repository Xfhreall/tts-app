import { Suspense } from "react";
import { LoginContainer } from "@/features/auth/containers/LoginContainer";

export default function LoginPage() {
  return (
    <Suspense
      fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}
    >
      <LoginContainer />
    </Suspense>
  );
}
