import { createClient } from "@/lib/supabase/client";

export async function getVentas() {
  const supabase = createClient();
  return supabase.from("ventas").select("*, productos(nombre), perfiles(nombre)").order("fecha_venta", {
    ascending: false,
  });
}

export async function deleteVenta(id: string) {
  const supabase = createClient();
  return supabase.from("ventas").delete().eq("id", id);
}

export async function registrarVenta(payload: {
  producto_id: string;
  cantidad: number;
  precio_unitario: number;
  observacion?: string;
}) {
  const supabase = createClient();
  const { data: user } = await supabase.auth.getUser();
  return supabase.rpc("registrar_venta", {
    p_producto_id: payload.producto_id,
    p_usuario_id: user.user?.id,
    p_cantidad: payload.cantidad,
    p_precio_unitario: payload.precio_unitario,
    p_observacion: payload.observacion,
  });
}
