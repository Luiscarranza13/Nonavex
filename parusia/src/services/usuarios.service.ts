import { createClient } from "@/lib/supabase/client";

export async function getUsuarios() {
  const supabase = createClient();
  return supabase.from("perfiles").select("*").order("creado_en", { ascending: false });
}

export async function updateUsuario(id: string, payload: Record<string, unknown>) {
  const supabase = createClient();
  return supabase.from("perfiles").update(payload).eq("id", id).select("*").single();
}
