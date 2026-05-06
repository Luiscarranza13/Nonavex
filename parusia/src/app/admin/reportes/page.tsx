"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DataTable } from "@/components/admin/DataTable";

const mensual = [
  { mes: "Ene", ventas: 280 },
  { mes: "Feb", ventas: 340 },
  { mes: "Mar", ventas: 410 },
  { mes: "Abr", ventas: 360 },
  { mes: "May", ventas: 386 },
];

const resumen = [
  { indicador: "Ventas por día", valor: "31 unidades" },
  { indicador: "Ventas por mes", valor: "386 unidades" },
  { indicador: "Ganancias totales", valor: "S/ 4,979.40" },
  { indicador: "Productos vendidos", valor: "Parusia 850g" },
  { indicador: "Stock actual", valor: "182 unidades" },
  { indicador: "Movimientos de inventario", valor: "48 movimientos" },
];

export default function ReportesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-normal">Reportes</h1>
        <p className="text-sm text-muted-foreground">Indicadores de venta, ganancia e inventario.</p>
      </div>
      <Card>
        <CardContent className="grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="grid gap-2"><Label>Desde</Label><Input type="date" /></div>
          <div className="grid gap-2"><Label>Hasta</Label><Input type="date" /></div>
        </CardContent>
      </Card>
      <div className="grid gap-4 xl:grid-cols-[1fr_420px]">
        <Card>
          <CardHeader><CardTitle>Ventas por mes</CardTitle></CardHeader>
          <CardContent>
            <div className="flex h-80 items-end gap-4 border-b border-l px-4 pb-3">
              {mensual.map((item) => (
                <div key={item.mes} className="flex flex-1 flex-col items-center gap-2">
                  <div className="w-full rounded-t-md bg-primary" style={{ height: `${Math.max(24, item.ventas / 2)}px` }} title={`${item.ventas} ventas`} />
                  <span className="text-xs text-muted-foreground">{item.mes}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Resumen</CardTitle></CardHeader>
          <CardContent>
            <DataTable data={resumen} columns={[{ accessorKey: "indicador", header: "Indicador" }, { accessorKey: "valor", header: "Valor" }]} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
