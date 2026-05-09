import { CheckCircle2, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { LandingConfig, LandingProduct } from "@/lib/public-data";
import { whatsappUrl } from "@/utils/constants";
import { formatCurrency } from "@/utils/formatCurrency";

export function ProductSection({ product, config }: { product: LandingProduct; config: LandingConfig }) {
  const buyUrl = whatsappUrl(config.mensaje_whatsapp, config.whatsapp);

  return (
    <section id="producto" className="bg-slate-950 py-20 text-white">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-2">
        <div className="relative mx-auto max-w-sm rounded-xl bg-white p-8 shadow-2xl">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={product.imagen} alt={`Bolsa de detergente ${product.nombre}`} className="max-h-[520px] w-auto object-contain drop-shadow-2xl" />
        </div>
        <Card className="border-2 border-cyan-300 bg-white text-slate-950">
          <CardContent className="space-y-6 p-8">
            <p className="font-bold text-primary">Producto destacado</p>
            <div>
              <h2 className="text-4xl font-black tracking-normal">{product.nombre}</h2>
              <p className="mt-2 text-lg text-slate-600">{product.presentacion} · {product.peso}</p>
            </div>
            <p className="text-base leading-8 text-slate-700">{product.descripcion}</p>
            <div className="grid gap-3 text-sm sm:grid-cols-2">
              {["Rendimiento familiar", "Compra directa por WhatsApp", "Limpieza profunda", "Aroma fresco"].map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-primary" /> {item}
                </div>
              ))}
            </div>
            <div className="flex flex-col gap-4 border-t-2 border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
              <span className="text-3xl font-black">{formatCurrency(product.precio)}</span>
              <Button asChild className="bg-red-600 text-white hover:bg-red-700">
                <a href={buyUrl} target="_blank" rel="noreferrer">
                  <MessageCircle /> Comprar
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
