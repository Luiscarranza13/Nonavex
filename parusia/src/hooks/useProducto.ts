"use client";

import { useEffect, useState } from "react";
import { getProductoActivo } from "@/services/producto.service";

export function useProducto() {
  const [data, setData] = useState<unknown>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProductoActivo().then((result) => setData(result.data)).finally(() => setLoading(false));
  }, []);

  return { data, loading };
}
