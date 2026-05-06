"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Edit, PackagePlus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/admin/DataTable";
import { deleteProducto, getProductos } from "@/services/producto.service";
import type { Producto } from "@/types/producto.types";
import { product as fallbackProduct } from "@/utils/constants";
import { formatCurrency } from "@/utils/formatCurrency";

export default function ProductoPage() {
  const [productos, setProductos] = useState<Producto[]>([]);

  async function loadProductos() {
    const { data, error } = await getProductos();
    if (error) {
      toast.error(error.message);
      return;
    }
    setProductos((data ?? []) as Producto[]);
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadProductos();
  }, []);

  async function removeProducto(producto: Producto) {
    const ok = window.confirm(`Eliminar "${producto.nombre}" también eliminará su inventario por cascada. ¿Continuar?`);
    if (!ok) return;
    const { error } = await deleteProducto(producto.id);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Producto eliminado.");
    await loadProductos();
  }

  const tableData = useMemo(
    () =>
      productos.map((producto) => ({
        id: producto.id,
        imagen: producto.imagen_url ?? fallbackProduct.imagen,
        nombre: producto.nombre,
        slug: producto.slug,
        presentacion: `${producto.presentacion ?? ""} ${producto.peso ?? ""}`.trim(),
        precio: formatCurrency(Number(producto.precio)),
        activo: producto.activo,
        destacado: producto.destacado,
        raw: producto,
      })),
    [productos],
  );

  const activos = productos.filter((producto) => producto.activo).length;
  const destacados = productos.filter((producto) => producto.destacado).length;

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-primary">Catálogo</p>
          <h1 className="text-2xl font-bold tracking-normal">Productos</h1>
          <p className="text-sm text-muted-foreground">Gestiona productos, precios, imágenes y disponibilidad comercial.</p>
        </div>
        <Button asChild>
          <Link href="/admin/producto/nuevo">
            <PackagePlus /> Nuevo producto
          </Link>
        </Button>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">Registrados</p><p className="text-2xl font-bold">{productos.length}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">Activos</p><p className="text-2xl font-bold">{activos}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">Destacados</p><p className="text-2xl font-bold">{destacados}</p></CardContent></Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Listado de productos</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable data={tableData} columns={[
            {
              accessorKey: "imagen",
              header: "Imagen",
              cell: (value) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={String(value)} alt="" className="size-12 rounded-md border bg-white object-contain" />
              ),
            },
            { accessorKey: "nombre", header: "Nombre" },
            { accessorKey: "slug", header: "Slug" },
            { accessorKey: "presentacion", header: "Presentación" },
            { accessorKey: "precio", header: "Precio" },
            { accessorKey: "activo", header: "Activo", cell: (value) => <Badge variant={value ? "default" : "secondary"}>{value ? "Sí" : "No"}</Badge> },
            { accessorKey: "destacado", header: "Destacado", cell: (value) => <Badge variant={value ? "default" : "secondary"}>{value ? "Sí" : "No"}</Badge> },
            {
              accessorKey: "raw",
              header: "Acciones",
              cell: (value) => {
                const producto = value as Producto;
                return (
                  <div className="flex flex-wrap gap-2">
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/admin/producto/${producto.id}/editar`}><Edit /> Editar</Link>
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => removeProducto(producto)}><Trash2 /></Button>
                  </div>
                );
              },
            },
          ]} />
        </CardContent>
      </Card>
    </div>
  );
}
