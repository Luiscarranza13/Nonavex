import { NextResponse } from "next/server";
import { isAdminUser } from "@/lib/auth/admin";
import { createAdminClient } from "@/lib/supabase/admin";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Map([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
  ["image/svg+xml", "svg"],
]);

export async function POST(request: Request) {
  const isAdmin = await isAdminUser();
  if (!isAdmin) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "Formulario invalido." }, { status: 400 });
  }

  const file = formData.get("file");

  if (!(file instanceof File) || !file.size) {
    return NextResponse.json({ error: "Selecciona una imagen valida." }, { status: 400 });
  }

  const extension = ALLOWED_IMAGE_TYPES.get(file.type);
  if (!extension) {
    return NextResponse.json(
      { error: "Formato no permitido. Usa JPG, PNG, WEBP o SVG." },
      { status: 400 },
    );
  }

  if (file.size > MAX_IMAGE_SIZE) {
    return NextResponse.json({ error: "La imagen no debe superar 5 MB." }, { status: 400 });
  }

  const path = `productos/${new Date().toISOString().slice(0, 10)}/${crypto.randomUUID()}.${extension}`;
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
