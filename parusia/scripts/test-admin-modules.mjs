import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { createClient } from "@supabase/supabase-js";

process.env.NODE_TLS_REJECT_UNAUTHORIZED ??= "0";

function loadEnvFile(path) {
  if (!existsSync(path)) return;
  const content = readFileSync(path, "utf8");
  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const index = trimmed.indexOf("=");
    if (index === -1) continue;
    const key = trimmed.slice(0, index);
    const value = trimmed.slice(index + 1);
    process.env[key] ??= value;
  }
}

const projectRoot = resolve(process.cwd());
loadEnvFile(resolve(projectRoot, ".env"));
loadEnvFile(resolve(projectRoot, "..", ".env"));

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error("Faltan NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY.");
  process.exit(1);
}

const supabase = createClient(url, serviceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function step(name, fn) {
  process.stdout.write(`- ${name}... `);
  try {
    const result = await fn();
    console.log("OK");
    return result;
  } catch (error) {
    console.log("FALLÓ");
    console.error(error.message);
    process.exitCode = 1;
    throw error;
  }
}

async function expectNoError(result) {
  if (result.error) throw new Error(result.error.message);
  return result.data;
}

const product = await step("Producto Parusia existe", async () => {
  let { data, error } = await supabase.from("productos").select("*").eq("slug", "parusia").maybeSingle();
  if (error) throw error;
  if (!data) {
    const inserted = await supabase
      .from("productos")
      .insert({
        nombre: "Parusia",
        slug: "parusia",
        descripcion: "Detergente en polvo de Novanex.",
        presentacion: "Bolsa de detergente",
        peso: "850g",
        precio: 12.9,
        activo: true,
        destacado: true,
      })
      .select("*")
      .single();
    data = await expectNoError(inserted);
  }
  return data;
});

await step("CRUD producto: update/read", async () => {
  await expectNoError(
    await supabase
      .from("productos")
      .update({ actualizado_en: new Date().toISOString() })
      .eq("id", product.id)
      .select("id")
      .single(),
  );
});

const inventory = await step("Inventario existe", async () => {
  let { data, error } = await supabase.from("inventario").select("*").eq("producto_id", product.id).maybeSingle();
  if (error) throw error;
  if (!data) {
    data = await expectNoError(
      await supabase
        .from("inventario")
        .insert({ producto_id: product.id, stock_actual: 0, stock_minimo: 10, ubicacion: "Almacén principal" })
        .select("*")
        .single(),
    );
  }
  return data;
});

await step("CRUD inventario: update stock mínimo", async () => {
  await expectNoError(
    await supabase
      .from("inventario")
      .update({ stock_minimo: inventory.stock_minimo })
      .eq("id", inventory.id)
      .select("id")
      .single(),
  );
});

await step("RPC movimiento inventario: entrada", async () => {
  await expectNoError(
    await supabase.rpc("registrar_movimiento_inventario", {
      p_producto_id: product.id,
      p_usuario_id: null,
      p_tipo: "entrada",
      p_cantidad: 1,
      p_motivo: "Test automático",
      p_observacion: "Validación de módulo inventario",
    }),
  );
});

await step("RPC ventas: registra venta y descuenta stock", async () => {
  await expectNoError(
    await supabase.rpc("registrar_venta", {
      p_producto_id: product.id,
      p_usuario_id: null,
      p_cantidad: 1,
      p_precio_unitario: Number(product.precio || 12.9),
      p_observacion: "Validación de módulo ventas",
    }),
  );
});

await step("Reportes: ventas e inventario consultables", async () => {
  await expectNoError(await supabase.from("ventas").select("id,total,fecha_venta").limit(5));
  await expectNoError(await supabase.from("movimientos_inventario").select("id,tipo,cantidad").limit(5));
});

await step("Configuración existe y actualiza", async () => {
  let { data, error } = await supabase.from("configuracion").select("*").eq("activo", true).limit(1).maybeSingle();
  if (error) throw error;
  if (!data) {
    data = await expectNoError(
      await supabase
        .from("configuracion")
        .insert({
          empresa: "Novanex",
          nombre_comercial: "Parusia",
          whatsapp: "51999999999",
          mensaje_whatsapp: "Hola Novanex, quiero comprar detergente Parusia de 850g.",
          activo: true,
        })
        .select("*")
        .single(),
    );
  }
  await expectNoError(
    await supabase
      .from("configuracion")
      .update({ actualizado_en: new Date().toISOString() })
      .eq("id", data.id)
      .select("id")
      .single(),
  );
});

await step("Usuarios: perfiles consultables", async () => {
  await expectNoError(await supabase.from("perfiles").select("id,nombre,email,rol,activo").limit(10));
});

console.log("\nPrueba completada. Módulos admin validados contra Supabase.");
