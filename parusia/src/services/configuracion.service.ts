import { createClient } from "@/lib/supabase/client";

export async function getConfiguracion() {
  const supabase = createClient();
  return supabase
    .from("configuracion")
    .select("*")
    .eq("activo", true)
    .order("actualizado_en", { ascending: false })
    .limit(1)
    .maybeSingle();
}

export async function updateConfiguracion(id: string, payload: Record<string, unknown>) {
  const supabase = createClient();
  return supabase.from("configuracion").update(payload).eq("id", id).select("*").single();
}

export async function uploadLogo(file: File) {
  const supabase = createClient();
  const extension = file.name.split(".").pop() ?? "webp";
  const path = `logo-${Date.now()}.${extension}`;
  const upload = await supabase.storage.from("parusia-configuracion").upload(path, file, {
    upsert: true,
  });

  if (upload.error) return { data: null, error: upload.error };

  const { data } = supabase.storage.from("parusia-configuracion").getPublicUrl(path);
  return { data: data.publicUrl, error: null };
}
