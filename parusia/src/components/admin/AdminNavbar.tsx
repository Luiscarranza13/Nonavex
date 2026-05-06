"use client";

import { useRouter } from "next/navigation";
import { LogOut, Menu, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Sidebar } from "@/components/admin/Sidebar";
import { createClient } from "@/lib/supabase/client";

export function AdminNavbar() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();

  async function logout() {
    try {
      await createClient().auth.signOut();
      router.push("/login");
    } catch {
      toast.error("Configura Supabase para cerrar sesión.");
    }
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background/90 px-3 backdrop-blur sm:px-5">
      <div className="flex min-w-0 items-center gap-3">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="lg:hidden" aria-label="Abrir navegación">
              <Menu />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-0">
            <Sidebar />
          </SheetContent>
        </Sheet>
        <div className="min-w-0">
          <p className="truncate font-semibold">Parusia Admin</p>
          <p className="hidden text-xs text-muted-foreground sm:block">Gestión comercial sin pedidos ni clientes</p>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <Button variant="outline" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")} aria-label="Cambiar tema">
          <Sun className="scale-100 dark:scale-0" />
          <Moon className="absolute scale-0 dark:scale-100" />
        </Button>
        <Button variant="outline" onClick={logout} className="px-2 sm:px-3">
          <LogOut /> <span className="hidden sm:inline">Salir</span>
        </Button>
      </div>
    </header>
  );
}
