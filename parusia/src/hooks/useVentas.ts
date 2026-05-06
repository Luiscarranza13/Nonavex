"use client";

import { useEffect, useState } from "react";
import { getVentas } from "@/services/ventas.service";

export function useVentas() {
  const [data, setData] = useState<unknown[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getVentas().then((result) => setData(result.data ?? [])).finally(() => setLoading(false));
  }, []);

  return { data, loading };
}
