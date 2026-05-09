import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center bg-background px-4 text-foreground">
      <div className="max-w-md space-y-4 text-center">
        <p className="text-sm font-semibold text-primary">404</p>
        <h1 className="text-3xl font-bold tracking-normal">Pagina no encontrada</h1>
        <p className="text-sm text-muted-foreground">
          La ruta que abriste no existe o fue movida.
        </p>
        <Button asChild>
          <Link href="/">
            <ArrowLeft /> Volver al inicio
          </Link>
        </Button>
      </div>
    </main>
  );
}
