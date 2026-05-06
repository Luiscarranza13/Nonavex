import { createClient } from "@/lib/supabase/client";

export async function getInventario() {
  const supabase = createClient();
  return supabase.from("inventario").select("*, productos(nombre, peso, precio)").order("actualizado_en");
}

export async function getMovimientosInventario() {
  const supabase = createClient();
  return supabase
    .from("movimientos_inventario")
    .select("*, productos(nombre), perfiles(nombre)")
    .order("creado_en", { ascending: false });
}

export async function registrarMovimiento(payload: {
  producto_id: string;
  tipo: "entrada" | "salida" | "ajuste";
  cantidad: number;
  motivo: string;
  observacion?: string;
}) {
  const supabase = createClient();
  const { data: user } = await supabase.auth.getUser();
  return supabase.rpc("registrar_movimiento_inventario", {
    p_producto_id: payload.producto_id,
    p_usuario_id: user.user?.id,
    p_tipo: payload.tipo,
    p_cantidad: payload.cantidad,
    p_motivo: payload.motivo,
    p_observacion: payload.observacion,
  });
}

export async function updateInventario(
  id: string,
  payload: { stock_minimo?: number; ubicacion?: string | null },
) {
  const supabase = createClient();
  return supabase.from("inventario").update(payload).eq("id", id).select("*").single();
}
