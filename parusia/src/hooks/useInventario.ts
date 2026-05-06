"use client";

import { useEffect, useState } from "react";
import { getInventario } from "@/services/inventario.service";

export function useInventario() {
  const [data, setData] = useState<unknown[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getInventario().then((result) => setData(result.data ?? [])).finally(() => setLoading(false));
  }, []);

  return { data, loading };
}
