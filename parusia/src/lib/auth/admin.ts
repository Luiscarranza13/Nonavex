import "server-only";

import { createClient } from "@/lib/supabase/server";

export type AdminUser = {
  id: string;
  email?: string;
  nombre?: string | null;
  rol: "admin";
};

export async function getAdminUser(): Promise<AdminUser | null> {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) return null;

  const { data: perfil, error: profileError } = await supabase
    .from("perfiles")
    .select("nombre, rol, activo")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError || perfil?.rol !== "admin" || !perfil.activo) return null;

  return {
    id: user.id,
    email: user.email,
    nombre: perfil.nombre,
    rol: "admin",
  };
}

export async function isAdminUser() {
  return Boolean(await getAdminUser());
}
