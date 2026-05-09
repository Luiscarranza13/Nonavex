"use client";

import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="grid min-h-screen place-items-center bg-background px-4 text-foreground">
      <div className="max-w-md space-y-4 text-center">
        <p className="text-sm font-semibold text-primary">Parusia</p>
        <h1 className="text-3xl font-bold tracking-normal">No se pudo cargar la pagina</h1>
        <p className="text-sm text-muted-foreground">
          Intenta nuevamente. Si el problema continua, revisa la configuracion de Supabase.
        </p>
        <Button onClick={reset}>
          <RotateCcw /> Reintentar
        </Button>
      </div>
    </main>
  );
}
