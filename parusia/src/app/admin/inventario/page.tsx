"use client";

import { useEffect, useState } from "react";
import { Plus, Save } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { DataTable } from "@/components/admin/DataTable";
import { ModalForm } from "@/components/admin/ModalForm";
import {
  getInventario,
  getMovimientosInventario,
  registrarMovimiento,
  updateInventario,
} from "@/services/inventario.service";

type InventarioRow = {
  id: string;
  producto_id: string;
  stock_actual: number;
  stock_minimo: number;
  ubicacion: string | null;
  productos?: { nombre?: string; peso?: string; precio?: number } | null;
};

export default function InventarioPage() {
  const [inventarios, setInventarios] = useState<InventarioRow[]>([]);
  const [productoId, setProductoId] = useState("");
  const [movimientos, setMovimientos] = useState<Record<string, unknown>[]>([]);
  const [tipo, setTipo] = useState<"entrada" | "salida" | "ajuste">("entrada");
  const [loading, setLoading] = useState(false);

  async function loadData() {
    const [stockResult, movimientosResult] = await Promise.all([getInventario(), getMovimientosInventario()]);
    if (stockResult.error) toast.error(stockResult.error.message);
    if (movimientosResult.error) toast.error(movimientosResult.error.message);

    const nextInventarios = (stockResult.data ?? []) as unknown as InventarioRow[];
    setInventarios(nextInventarios);
    if (!productoId && nextInventarios[0]) setProductoId(nextInventarios[0].producto_id);
    setMovimientos(
      (movimientosResult.data ?? []).map((item) => {
        const row = item as Record<string, unknown> & {
          productos?: { nombre?: string } | null;
          perfiles?: { nombre?: string } | null;
        };
        return {
          fecha: new Date(String(row.creado_en)).toLocaleDateString("es-PE"),
          producto: row.productos?.nombre ?? "Parusia",
          usuario: row.perfiles?.nombre ?? "Sistema",
          tipo: row.tipo,
          cantidad: row.cantidad,
          stock: row.stock_nuevo,
          motivo: row.motivo,
        };
      }),
    );
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function submitMovimiento(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const inventario = inventarios.find((item) => item.producto_id === productoId);
    if (!inventario) return;
    setLoading(true);
    const formData = new FormData(event.currentTarget);
    const { error } = await registrarMovimiento({
      producto_id: inventario.producto_id,
      tipo,
      cantidad: Number(formData.get("cantidad")),
      motivo: String(formData.get("motivo") ?? ""),
      observacion: String(formData.get("observacion") ?? ""),
    });
    setLoading(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Movimiento registrado.");
    event.currentTarget.reset();
    await loadData();
  }

  async function saveInventario(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const inventario = inventarios.find((item) => item.producto_id === productoId);
    if (!inventario) return;
    const formData = new FormData(event.currentTarget);
    const { error } = await updateInventario(inventario.id, {
      stock_minimo: Number(formData.get("stock_minimo")),
      ubicacion: String(formData.get("ubicacion") ?? ""),
    });
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Inventario actualizado.");
    await loadData();
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-normal">Inventario</h1>
          <p className="text-sm text-muted-foreground">Entradas, salidas, ajustes y movimientos por venta.</p>
        </div>
        <ModalForm title="Registrar movimiento" trigger={<Button><Plus /> Nuevo movimiento</Button>}>
          <form onSubmit={submitMovimiento} className="grid gap-4">
            <div className="grid gap-2">
              <Label>Producto</Label>
              <select className="h-9 rounded-md border bg-background px-3 text-sm" value={productoId} onChange={(event) => setProductoId(event.target.value)}>
                {inventarios.map((item) => (
                  <option key={item.producto_id} value={item.producto_id}>{item.productos?.nombre ?? "Producto"}</option>
                ))}
              </select>
            </div>
            <div className="grid gap-2">
              <Label>Tipo</Label>
              <Select value={tipo} onValueChange={(value) => setTipo(value as typeof tipo)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="entrada">Entrada</SelectItem>
                  <SelectItem value="salida">Salida</SelectItem>
                  <SelectItem value="ajuste">Ajuste manual</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2"><Label>Cantidad</Label><Input name="cantidad" type="number" min={1} required /></div>
            <div className="grid gap-2"><Label>Motivo</Label><Input name="motivo" required /></div>
            <div className="grid gap-2"><Label>Observación</Label><Textarea name="observacion" /></div>
            <Button disabled={loading} type="submit">Guardar</Button>
          </form>
        </ModalForm>
      </div>

      <Card>
        <CardHeader><CardTitle>Stock por producto</CardTitle></CardHeader>
        <CardContent>
          <DataTable data={inventarios.map((item) => ({
            producto: item.productos?.nombre ?? "Producto",
            stock_actual: item.stock_actual,
            stock_minimo: item.stock_minimo,
            ubicacion: item.ubicacion ?? "",
            estado: item.stock_actual <= item.stock_minimo ? "bajo" : "ok",
          }))} columns={[
            { accessorKey: "producto", header: "Producto" },
            { accessorKey: "stock_actual", header: "Stock actual" },
            { accessorKey: "stock_minimo", header: "Stock mínimo" },
            { accessorKey: "ubicacion", header: "Ubicación" },
            { accessorKey: "estado", header: "Estado" },
          ]} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Configurar inventario</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={saveInventario} className="grid gap-4 sm:grid-cols-3">
            <div className="grid gap-2">
              <Label>Producto</Label>
              <select className="h-9 rounded-md border bg-background px-3 text-sm" value={productoId} onChange={(event) => setProductoId(event.target.value)}>
                {inventarios.map((item) => (
                  <option key={item.producto_id} value={item.producto_id}>{item.productos?.nombre ?? "Producto"}</option>
                ))}
              </select>
            </div>
            <div className="grid gap-2"><Label>Stock mínimo</Label><Input name="stock_minimo" type="number" min={0} defaultValue={inventarios.find((item) => item.producto_id === productoId)?.stock_minimo ?? 10} /></div>
            <div className="grid gap-2"><Label>Ubicación</Label><Input name="ubicacion" defaultValue={inventarios.find((item) => item.producto_id === productoId)?.ubicacion ?? ""} /></div>
            <Button type="submit" className="w-fit sm:col-span-4"><Save /> Guardar inventario</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Movimientos de stock</CardTitle></CardHeader>
        <CardContent>
          <DataTable data={movimientos} columns={[
            { accessorKey: "fecha", header: "Fecha" },
            { accessorKey: "producto", header: "Producto" },
            { accessorKey: "usuario", header: "Usuario" },
            { accessorKey: "tipo", header: "Tipo" },
            { accessorKey: "cantidad", header: "Cantidad" },
            { accessorKey: "stock", header: "Stock nuevo" },
            { accessorKey: "motivo", header: "Motivo" },
          ]} />
        </CardContent>
      </Card>
    </div>
  );
}
