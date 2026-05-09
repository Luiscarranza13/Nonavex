"use client";

import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, BadgeDollarSign, Boxes, PackageCheck, ShoppingBag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartCard } from "@/components/admin/ChartCard";
import { DataTable } from "@/components/admin/DataTable";
import { StatCard } from "@/components/admin/StatCard";
import { createClient } from "@/lib/supabase/client";
import { formatCurrency } from "@/utils/formatCurrency";

type VentaRow = {
  id: string;
  producto_id: string | null;
  cantidad: number;
  total: number;
  canal: string;
  fecha_venta: string;
  productos?: { nombre?: string | null } | null;
};

type InventarioRow = {
  id: string;
  stock_actual: number;
  stock_minimo: number;
  productos?: { nombre?: string | null; peso?: string | null } | null;
};

type ProductoRow = {
  id: string;
  nombre: string;
  activo: boolean;
};

export default function DashboardPage() {
  const [ventas, setVentas] = useState<VentaRow[]>([]);
  const [inventario, setInventario] = useState<InventarioRow[]>([]);
  const [productos, setProductos] = useState<ProductoRow[]>([]);
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null);

  async function loadData() {
    const supabase = createClient();
    const [ventasResult, inventarioResult, productosResult] = await Promise.all([
      supabase.from("ventas").select("id, producto_id, cantidad, total, canal, fecha_venta, productos(nombre)").order("fecha_venta", { ascending: false }),
      supabase.from("inventario").select("id, stock_actual, stock_minimo, productos(nombre, peso)").order("actualizado_en", { ascending: false }),
      supabase.from("productos").select("id, nombre, activo").order("creado_en", { ascending: false }),
    ]);

    if (!ventasResult.error) setVentas((ventasResult.data ?? []) as unknown as VentaRow[]);
    if (!inventarioResult.error) setInventario((inventarioResult.data ?? []) as unknown as InventarioRow[]);
    if (!productosResult.error) setProductos((productosResult.data ?? []) as ProductoRow[]);
    setUpdatedAt(new Date());
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadData();
    const supabase = createClient();
    const channel = supabase
      .channel("admin-dashboard-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "ventas" }, loadData)
      .on("postgres_changes", { event: "*", schema: "public", table: "inventario" }, loadData)
      .on("postgres_changes", { event: "*", schema: "public", table: "productos" }, loadData)
      .on("postgres_changes", { event: "*", schema: "public", table: "movimientos_inventario" }, loadData)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const stats = useMemo(() => {
    const stockActual = inventario.reduce((sum, item) => sum + Number(item.stock_actual ?? 0), 0);
    const ingresos = ventas.reduce((sum, item) => sum + Number(item.total ?? 0), 0);
    const unidadesPorProducto = new Map<string, number>();

    for (const venta of ventas) {
      const name = venta.productos?.nombre ?? "Sin producto";
      unidadesPorProducto.set(name, (unidadesPorProducto.get(name) ?? 0) + Number(venta.cantidad ?? 0));
    }

    const masVendido = [...unidadesPorProducto.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? "Sin ventas";

    return {
      stockActual,
      totalVentas: ventas.length,
      ingresos,
      masVendido,
      activos: productos.filter((item) => item.activo).length,
    };
  }, [inventario, productos, ventas]);

  const chartData = useMemo(() => {
    const days = Array.from({ length: 7 }).map((_, index) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - index));
      const key = date.toISOString().slice(0, 10);
      return { key, dia: date.toLocaleDateString("es-PE", { weekday: "short" }), ventas: 0, ingresos: 0 };
    });

    for (const venta of ventas) {
      const key = new Date(venta.fecha_venta).toISOString().slice(0, 10);
      const day = days.find((item) => item.key === key);
      if (day) {
        day.ventas += 1;
        day.ingresos += Number(venta.total ?? 0);
      }
    }

    return days.map(({ dia, ventas: count, ingresos }) => ({ dia, ventas: count, ingresos }));
  }, [ventas]);

  const ventasTable = ventas.slice(0, 8).map((venta) => ({
    fecha: new Date(venta.fecha_venta).toLocaleDateString("es-PE"),
    producto: venta.productos?.nombre ?? "Sin producto",
    cantidad: venta.cantidad,
    total: formatCurrency(Number(venta.total ?? 0)),
    canal: venta.canal,
  }));

  const lowStock = inventario.filter((item) => Number(item.stock_actual) <= Number(item.stock_minimo));

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-normal">Dashboard</h1>
          <p className="text-sm text-muted-foreground">Datos reales sincronizados con Supabase Realtime.</p>
        </div>
        <Badge variant="secondary">
          {updatedAt ? `Actualizado ${updatedAt.toLocaleTimeString("es-PE")}` : "Cargando..."}
        </Badge>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard title="Stock actual" value={stats.stockActual} icon={Boxes} />
        <StatCard title="Ventas registradas" value={stats.totalVentas} icon={ShoppingBag} />
        <StatCard title="Ingresos totales" value={stats.ingresos} prefix="S/ " icon={BadgeDollarSign} />
        <StatCard title="Producto más vendido" value={stats.masVendido} icon={PackageCheck} />
        <StatCard title="Productos activos" value={stats.activos} icon={PackageCheck} />
      </div>
      <div className="grid gap-4 xl:grid-cols-[1fr_380px]">
        <ChartCard data={chartData} />
        <Card>
          <CardHeader>
            <CardTitle>Alertas de stock</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {lowStock.length ? lowStock.map((item) => (
              <div key={item.id} className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4 text-amber-900 dark:bg-amber-950">
                <AlertTriangle className="mt-0.5 size-5" />
                <div>
                  <p className="font-semibold">{item.productos?.nombre ?? "Producto"} bajo stock</p>
                  <p className="text-sm">Stock: {item.stock_actual} · mínimo: {item.stock_minimo}</p>
                </div>
              </div>
            )) : (
              <div className="rounded-lg border bg-muted p-4 text-sm text-muted-foreground">No hay alertas de bajo stock.</div>
            )}
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Últimas ventas registradas</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable data={ventasTable} columns={[
            { accessorKey: "fecha", header: "Fecha" },
            { accessorKey: "producto", header: "Producto" },
            { accessorKey: "cantidad", header: "Cantidad" },
            { accessorKey: "total", header: "Total" },
            { accessorKey: "canal", header: "Canal" },
          ]} />
        </CardContent>
      </Card>
    </div>
  );
}
