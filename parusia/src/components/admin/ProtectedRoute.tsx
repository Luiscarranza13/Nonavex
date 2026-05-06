"use client";

import { ReactNode } from "react";
import { useAuth } from "@/hooks/useAuth";

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="grid gap-3 p-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="h-9 animate-pulse rounded-lg bg-muted" />
        ))}
      </div>
    );
  }

  return children;
}
