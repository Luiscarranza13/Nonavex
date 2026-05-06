import { createClient } from "@/lib/supabase/server";
import { product as fallbackProduct, WHATSAPP_MESSAGE, WHATSAPP_NUMBER } from "@/utils/constants";

export type LandingProduct = {
  id: string;
  nombre: string;
  presentacion: string;
  peso: string;
  precio: number;
  descripcion: string;
  imagen: string;
};

export type LandingConfig = {
  whatsapp: string;
  mensaje_whatsapp: string;
};

export async function getLandingData(): Promise<{ product: LandingProduct; config: LandingConfig }> {
  try {
    const supabase = await createClient();
    const [productResult, configResult] = await Promise.all([
      supabase
        .from("productos")
        .select("id,nombre,descripcion,presentacion,peso,precio,imagen_url")
        .eq("activo", true)
        .order("destacado", { ascending: false })
        .order("actualizado_en", { ascending: false })
        .limit(1)
        .maybeSingle(),
      supabase
        .from("configuracion")
        .select("whatsapp,mensaje_whatsapp")
        .eq("activo", true)
        .order("actualizado_en", { ascending: false })
        .limit(1)
        .maybeSingle(),
    ]);

    const dbProduct = productResult.data;

    return {
      product: dbProduct
        ? {
            id: dbProduct.id,
            nombre: dbProduct.nombre,
            presentacion: dbProduct.presentacion ?? fallbackProduct.presentacion,
            peso: dbProduct.peso ?? fallbackProduct.peso,
            precio: Number(dbProduct.precio ?? fallbackProduct.precio),
            descripcion: dbProduct.descripcion ?? fallbackProduct.descripcion,
            imagen: dbProduct.imagen_url || fallbackProduct.imagen,
          }
        : fallbackProduct,
      config: {
        whatsapp: configResult.data?.whatsapp || WHATSAPP_NUMBER,
        mensaje_whatsapp: configResult.data?.mensaje_whatsapp || WHATSAPP_MESSAGE,
      },
    };
  } catch {
    return {
      product: fallbackProduct,
      config: {
        whatsapp: WHATSAPP_NUMBER,
        mensaje_whatsapp: WHATSAPP_MESSAGE,
      },
    };
  }
}
