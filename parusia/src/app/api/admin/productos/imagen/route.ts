import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) return false;

  const { data: perfil } = await supabase
    .from("perfiles")
    .select("rol, activo")
    .eq("id", user.id)
    .single();

  return perfil?.rol === "admin" && perfil.activo;
}

export async function POST(request: Request) {
  const isAdmin = await requireAdmin();
  if (!isAdmin) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File) || !file.size) {
    return NextResponse.json({ error: "Selecciona una imagen válida." }, { status: 400 });
  }

  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ error: "El archivo debe ser una imagen." }, { status: 400 });
  }

  if (file.size > 5 * 1024 * 1024) {
    return NextResponse.json({ error: "La imagen no debe superar 5 MB." }, { status: 400 });
  }

  const extension = file.name.split(".").pop()?.toLowerCase() || "webp";
  const path = `productos/${crypto.randomUUID()}.${extension}`;
  const admin = createAdminClient();
  const bytes = await file.arrayBuffer();

  const { error } = await admin.storage.from("parusia-productos").upload(path, bytes, {
    contentType: file.type,
    upsert: false,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  const { data } = admin.storage.from("parusia-productos").getPublicUrl(path);
  return NextResponse.json({ url: data.publicUrl });
}
