import { createClient } from "@/lib/supabase/client";
import type { Producto } from "@/types/producto.types";

export async function getProductoActivo() {
  const supabase = createClient();
  return supabase.from("productos").select("*").eq("slug", "parusia").eq("activo", true).single();
}

export async function getProductoParusia() {
  const supabase = createClient();
  return supabase.from("productos").select("*").eq("slug", "parusia").maybeSingle();
}

export async function getProductos() {
  const supabase = createClient();
  return supabase.from("productos").select("*").order("creado_en", { ascending: false });
}

export async function getProductoById(id: string) {
  const supabase = createClient();
  return supabase.from("productos").select("*").eq("id", id).single();
}

export async function createProducto(payload: Partial<Producto> & { stock_minimo?: number; ubicacion?: string }) {
  const supabase = createClient();
  const { stock_minimo, ubicacion, ...producto } = payload;
  const created = await supabase.from("productos").insert(producto).select("*").single();

  if (created.error || !created.data) return created;

  const inventory = await supabase.from("inventario").insert({
    producto_id: created.data.id,
    stock_actual: 0,
    stock_minimo: stock_minimo ?? 10,
    ubicacion: ubicacion ?? "Almacén principal",
  });

  if (inventory.error) return { data: null, error: inventory.error };
  return created;
}

export async function updateProducto(id: string, payload: Partial<Producto>) {
  const supabase = createClient();
  return supabase.from("productos").update(payload).eq("id", id).select("*").single();
}

export async function deleteProducto(id: string) {
  const supabase = createClient();
  return supabase.from("productos").delete().eq("id", id);
}

export async function uploadProductoImagen(file: File) {
  const body = new FormData();
  body.append("file", file);
  const response = await fetch("/api/admin/productos/imagen", {
    method: "POST",
    body,
  });
  const result = await response.json();

  if (!response.ok) {
    return { data: null, error: { message: result.error ?? "No se pudo subir la imagen." } };
  }

  return { data: result.url as string, error: null };
}
