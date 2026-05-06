"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { ProductForm } from "@/components/admin/ProductForm";
import { Card, CardContent } from "@/components/ui/card";
import { getProductoById } from "@/services/producto.service";
import type { Producto } from "@/types/producto.types";

export default function EditarProductoPage() {
  const params = useParams<{ id: string }>();
  const [producto, setProducto] = useState<Producto | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProductoById(params.id)
      .then(({ data, error }) => {
        if (error) toast.error(error.message);
        setProducto((data as Producto | null) ?? null);
      })
      .finally(() => setLoading(false));
  }, [params.id]);

  if (loading) {
    return <Card><CardContent className="p-6 text-sm text-muted-foreground">Cargando producto...</CardContent></Card>;
  }

  if (!producto) {
    return <Card><CardContent className="p-6 text-sm text-muted-foreground">Producto no encontrado.</CardContent></Card>;
  }

  return <ProductForm producto={producto} />;
}
