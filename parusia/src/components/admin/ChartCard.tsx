"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ChartCard({ data }: { data: { dia: string; ventas: number; ingresos: number }[] }) {
  const max = Math.max(...data.map((item) => item.ingresos), 1);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ventas por día</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex h-72 items-end gap-3 border-b border-l px-3 pb-3">
          {data.map((item) => (
            <div key={item.dia} className="flex flex-1 flex-col items-center gap-2">
              <div
                className="w-full rounded-t-md bg-primary/80"
                style={{ height: `${Math.max(18, (item.ingresos / max) * 230)}px` }}
                title={`S/ ${item.ingresos.toFixed(2)} · ${item.ventas} ventas`}
              />
              <span className="text-xs text-muted-foreground">{item.dia}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
