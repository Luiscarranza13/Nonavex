import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function StatCard({ title, value, icon: Icon, prefix = "" }: { title: string; value: number | string; icon: LucideIcon; prefix?: string }) {
  const displayValue =
    typeof value === "number"
      ? `${prefix}${value.toLocaleString("es-PE", { minimumFractionDigits: prefix ? 2 : 0, maximumFractionDigits: prefix ? 2 : 0 })}`
      : value;

  return (
    <Card>
      <CardContent className="flex items-center justify-between p-5">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="mt-1 line-clamp-1 text-2xl font-bold">{displayValue}</p>
        </div>
        <span className="flex size-11 items-center justify-center rounded-lg bg-cyan-100 text-primary">
          <Icon />
        </span>
      </CardContent>
    </Card>
  );
}
