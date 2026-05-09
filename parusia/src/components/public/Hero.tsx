"use client";

import { ArrowDown, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { LandingConfig, LandingProduct } from "@/lib/public-data";
import { whatsappUrl } from "@/utils/constants";

export function Hero({ product, config }: { product: LandingProduct; config: LandingConfig }) {
  const buyUrl = whatsappUrl(config.mensaje_whatsapp, config.whatsapp);

  return (
    <section id="inicio" className="relative overflow-hidden bg-[#f5fbff]">
      <div className="absolute inset-x-0 top-0 h-4 bg-red-600" />
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_0.9fr]">
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-7">
          <div className="inline-flex rounded-full border-2 border-primary bg-white px-4 py-1.5 text-sm font-bold text-primary shadow-sm">
            Detergente en polvo de Novanex
          </div>
          <h1 className="max-w-3xl text-5xl font-black tracking-normal text-slate-950 sm:text-6xl lg:text-7xl">
            {product.nombre} limpia profundo y deja tu ropa fresca.
          </h1>
          <p className="max-w-2xl text-lg leading-8 text-slate-600">
            Alto rendimiento en presentacion de {product.peso} para hogares que buscan limpieza visible, aroma agradable y una compra simple por WhatsApp.
          </p>
          <div className="grid max-w-xl gap-3 sm:grid-cols-3">
            {[product.peso, "Compra directa", "Aroma fresco"].map((item) => (
              <div key={item} className="rounded-lg border-2 border-slate-200 bg-white px-4 py-3 text-center text-sm font-bold text-slate-800 shadow-sm">
                {item}
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="h-12 bg-red-600 px-5 text-white hover:bg-red-700">
              <a href={buyUrl} target="_blank" rel="noreferrer">
                <MessageCircle /> Comprar por WhatsApp
              </a>
            </Button>
            <Button asChild variant="outline" size="lg" className="h-12 px-5">
              <a href="#beneficios">
                <ArrowDown /> Ver beneficios
              </a>
            </Button>
          </div>
        </div>
        <div className="animate-in fade-in zoom-in-95 duration-700 relative mx-auto w-full max-w-md">
          <div className="absolute inset-x-8 bottom-6 h-20 rounded-full bg-cyan-200" />
          <div className="absolute inset-y-12 right-0 w-24 rounded-full bg-red-100" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={product.imagen} alt={`Detergente ${product.nombre} ${product.peso}`} className="relative mx-auto max-h-[560px] w-auto max-w-full object-contain drop-shadow-2xl" />
        </div>
      </div>
    </section>
  );
}
