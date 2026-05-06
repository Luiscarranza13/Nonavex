import { NextResponse } from "next/server";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { usuarioSchema } from "@/lib/validations/schemas";

async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) return null;

  const { data: perfil } = await supabase
    .from("perfiles")
    .select("rol, activo")
    .eq("id", user.id)
    .single();

  return perfil?.rol === "admin" && perfil.activo ? user : null;
}

export async function POST(request: Request) {
  const user = await requireAdmin();
  if (!user) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  const body = await request.json();
  const parsed = usuarioSchema.extend({ password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres.") }).safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Datos inválidos." }, { status: 400 });
  }

  const admin = createAdminClient();
  const { data, error } = await admin.auth.admin.createUser({
    email: parsed.data.email,
    password: parsed.data.password,
    email_confirm: true,
    user_metadata: {
      nombre: parsed.data.nombre,
      rol: parsed.data.rol,
    },
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  if (data.user) {
    await admin.from("perfiles").upsert({
      id: data.user.id,
      nombre: parsed.data.nombre,
      email: parsed.data.email,
      rol: parsed.data.rol,
      activo: parsed.data.activo,
    });
  }

  return NextResponse.json({ user: data.user });
}
