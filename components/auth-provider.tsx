"use client"

import { NeonAuthUIProvider } from "@neondatabase/auth/react/ui";
import { authClient } from "@/lib/auth-client";
import "@neondatabase/auth/ui/css";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <NeonAuthUIProvider authClient={authClient} redirectTo="/">
      {children}
    </NeonAuthUIProvider>
  );
}
