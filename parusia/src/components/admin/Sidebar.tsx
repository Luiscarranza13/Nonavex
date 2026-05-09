"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, Boxes, Home, Package, Settings, ShoppingBag, Users } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { href: "/admin/dashboard", label: "Dashboard", icon: Home },
  { href: "/admin/producto", label: "Productos", icon: Package },
  { href: "/admin/inventario", label: "Inventario", icon: Boxes },
  { href: "/admin/ventas", label: "Ventas", icon: ShoppingBag },
  { href: "/admin/reportes", label: "Reportes", icon: BarChart3 },
  { href: "/admin/configuracion", label: "Configuracion", icon: Settings },
  { href: "/admin/usuarios", label: "Usuarios", icon: Users },
];

export function Sidebar({ className = "" }: { className?: string }) {
  const pathname = usePathname();

  return (
    <aside className={`min-h-screen w-64 border-r border-slate-800 bg-slate-950 text-white ${className}`}>
      <div className="border-b border-slate-800 p-6">
        <p className="text-xl font-bold">Parusia Admin</p>
        <p className="text-sm text-slate-300">Novanex</p>
      </div>
      <nav className="grid gap-1 p-3">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-300 transition-colors hover:bg-slate-800 hover:text-white",
                isActive && "bg-cyan-500 text-slate-950 shadow-sm hover:bg-cyan-500 hover:text-slate-950",
              )}
            >
              <Icon className="size-4" /> {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
