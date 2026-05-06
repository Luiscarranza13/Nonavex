"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DataTable } from "@/components/admin/DataTable";
import { ModalForm } from "@/components/admin/ModalForm";
import { getInventario } from "@/services/inventario.service";
import { deleteVenta, getVentas, registrarVenta } from "@/services/ventas.service";
import { formatCurrency } from "@/utils/formatCurrency";

type ProductoVenta = {
  producto_id: string;
  nombre: string;
  precio: number;
  stock: number;
};

export default function VentasPage() {
  const [productos, setProductos] = useState<ProductoVenta[]>([]);
  const [productoId, setProductoId] = useState("");
  const [ventas, setVentas] = useState<Record<string, unknown>[]>([]);
  const [cantidad, setCantidad] = useState(1);
  const [precio, setPrecio] = useState(12.9);
  const [saving, setSaving] = useState(false);

  async function loadData() {
    const [inventarioResult, ventasResult] = await Promise.all([getInventario(), getVentas()]);
    if (inventarioResult.error) toast.error(inventarioResult.error.message);
    if (ventasResult.error) toast.error(ventasResult.error.message);

    const nextProducts = ((inventarioResult.data ?? []) as unknown as Array<{
      producto_id: string;
      stock_actual: number;
      productos?: { nombre?: string; precio?: number } | null;
    }>).map((stock) => ({
      producto_id: stock.producto_id,
      nombre: stock.productos?.nombre ?? "Producto",
      precio: Number(stock.productos?.precio ?? 0),
      stock: Number(stock.stock_actual ?? 0),
    }));
    setProductos(nextProducts);
    const current = nextProducts.find((item) => item.producto_id === productoId) ?? nextProducts[0];
    if (current) {
      setProductoId(current.producto_id);
      setPrecio(current.precio);
    }

    setVentas(
      (ventasResult.data ?? []).map((item) => {
        const row = item as Record<string, unknown> & {
          productos?: { nombre?: string } | null;
          perfiles?: { nombre?: string } | null;
        };
        return {
          id: row.id,
          fecha: new Date(String(row.fecha_venta)).toLocaleDateString("es-PE"),
          producto: row.productos?.nombre ?? "Parusia",
          usuario: row.perfiles?.nombre ?? "Sistema",
          cantidad: row.cantidad,
          precio: formatCurrency(Number(row.precio_unitario)),
          total: formatCurrency(Number(row.total)),
          metodo: row.canal,
        };
      }),
    );
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function submitVenta(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const producto = productos.find((item) => item.producto_id === productoId);
    if (!producto) return;
    setSaving(true);
    const formData = new FormData(event.currentTarget);
    const { error } = await registrarVenta({
      producto_id: producto.producto_id,
      cantidad,
      precio_unitario: precio,
      observacion: String(formData.get("observacion") ?? ""),
    });
    setSaving(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Venta registrada y stock descontado.");
    event.currentTarget.reset();
    setCantidad(1);
    await loadData();
  }

  async function removeVenta(id: string) {
    const ok = window.confirm("Eliminar la venta no repone stock automáticamente. ¿Continuar?");
    if (!ok) return;
    const { error } = await deleteVenta(id);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Venta eliminada.");
    await loadData();
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-normal">Ventas manuales</h1>
          <p className="text-sm text-muted-foreground">Ventas realizadas por WhatsApp. Al registrar se descuenta stock automáticamente.</p>
        </div>
        <ModalForm title="Registrar venta WhatsApp" trigger={<Button><Plus /> Nueva venta</Button>}>
          <form onSubmit={submitVenta} className="grid gap-4">
            <div className="grid gap-2">
              <Label>Producto</Label>
              <select
                className="h-9 rounded-md border bg-background px-3 text-sm"
                value={productoId}
                onChange={(event) => {
                  const next = productos.find((item) => item.producto_id === event.target.value);
                  setProductoId(event.target.value);
                  if (next) setPrecio(next.precio);
                }}
              >
                {productos.map((item) => (
                  <option key={item.producto_id} value={item.producto_id}>
                    {item.nombre} · stock {item.stock}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid gap-2"><Label>Cantidad vendida</Label><Input value={cantidad} onChange={(event) => setCantidad(Number(event.target.value))} type="number" min={1} required /></div>
            <div className="grid gap-2"><Label>Precio unitario</Label><Input value={precio} onChange={(event) => setPrecio(Number(event.target.value))} type="number" step="0.01" min={0.01} required /></div>
            <div className="grid gap-2"><Label>Total automático</Label><Input value={formatCurrency(cantidad * precio)} readOnly /></div>
            <div className="grid gap-2"><Label>Método de venta</Label><Input value="WhatsApp" readOnly /></div>
            <div className="grid gap-2"><Label>Observación</Label><Textarea name="observacion" /></div>
            <Button disabled={saving} type="submit">Registrar venta</Button>
          </form>
        </ModalForm>
      </div>
      <Card>
        <CardHeader><CardTitle>Ventas registradas</CardTitle></CardHeader>
        <CardContent>
          <DataTable data={ventas} columns={[
            { accessorKey: "fecha", header: "Fecha" },
            { accessorKey: "producto", header: "Producto" },
            { accessorKey: "usuario", header: "Usuario" },
            { accessorKey: "cantidad", header: "Cantidad" },
            { accessorKey: "precio", header: "Precio unitario" },
            { accessorKey: "total", header: "Total" },
            { accessorKey: "metodo", header: "Método" },
            {
              accessorKey: "id",
              header: "Acciones",
              cell: (value) => (
                <Button variant="destructive" size="sm" onClick={() => removeVenta(String(value))}>
                  <Trash2 /> Eliminar
                </Button>
              ),
            },
          ]} />
        </CardContent>
      </Card>
    </div>
  );
}
