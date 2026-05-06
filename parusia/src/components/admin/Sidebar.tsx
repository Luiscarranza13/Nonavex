import Link from "next/link";
import { BarChart3, Boxes, Home, Package, Settings, ShoppingBag, Users } from "lucide-react";

const items = [
  { href: "/admin/dashboard", label: "Dashboard", icon: Home },
  { href: "/admin/producto", label: "Productos", icon: Package },
  { href: "/admin/inventario", label: "Inventario", icon: Boxes },
  { href: "/admin/ventas", label: "Ventas", icon: ShoppingBag },
  { href: "/admin/reportes", label: "Reportes", icon: BarChart3 },
  { href: "/admin/configuracion", label: "Configuración", icon: Settings },
  { href: "/admin/usuarios", label: "Usuarios", icon: Users },
];

export function Sidebar({ className = "" }: { className?: string }) {
  return (
    <aside className={`min-h-screen w-64 border-r bg-slate-950 text-white ${className}`}>
      <div className="border-b border-white/10 p-6">
        <p className="text-xl font-bold">Parusia Admin</p>
        <p className="text-sm text-white/55">Novanex</p>
      </div>
      <nav className="grid gap-1 p-3">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href} className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-white/75 hover:bg-white/10 hover:text-white">
              <Icon className="size-4" /> {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
