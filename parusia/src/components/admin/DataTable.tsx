"use client";

import { ReactNode, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type RowData = Record<string, unknown>;
export type SimpleColumn = {
  accessorKey: string;
  header: string;
  cell?: (value: unknown, row: RowData) => ReactNode;
};

export function DataTable({
  data,
  columns,
  searchPlaceholder = "Buscar...",
}: {
  data: RowData[];
  columns: SimpleColumn[];
  searchPlaceholder?: string;
}) {
  const [filter, setFilter] = useState("");
  const rows = useMemo(() => {
    const normalized = filter.trim().toLowerCase();
    if (!normalized) return data;
    return data.filter((row) =>
      Object.values(row).some((value) => String(value).toLowerCase().includes(normalized)),
    );
  }, [data, filter]);

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
            placeholder={searchPlaceholder}
            className="pl-9"
          />
        </div>
        <p className="text-xs text-muted-foreground">
          {rows.length} de {data.length} registros
        </p>
      </div>
      <div className="overflow-x-auto rounded-lg border">
        <Table className="min-w-[760px]">
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column.accessorKey}>{column.header}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length ? rows.map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                {columns.map((column) => (
                  <TableCell key={column.accessorKey}>
                    {column.cell ? column.cell(row[column.accessorKey], row) : String(row[column.accessorKey] ?? "")}
                  </TableCell>
                ))}
              </TableRow>
            )) : (
              <TableRow>
                <TableCell colSpan={Math.max(columns.length, 1)} className="h-24 text-center text-muted-foreground">
                  {filter ? "No hay resultados para la busqueda." : "Sin registros."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
