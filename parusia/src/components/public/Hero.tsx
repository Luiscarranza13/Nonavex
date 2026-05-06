"use client";

import { ArrowDown, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { LandingConfig, LandingProduct } from "@/lib/public-data";
import { whatsappUrl } from "@/utils/constants";

export function Hero({ product, config }: { product: LandingProduct; config: LandingConfig }) {
  const buyUrl = whatsappUrl(config.mensaje_whatsapp, config.whatsapp);

  return (
    <section id="inicio" className="relative overflow-hidden bg-[linear-gradient(135deg,#eaf7ff_0%,#ffffff_48%,#ffe9e9_100%)]">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_0.9fr]">
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-7">
          <div className="inline-flex rounded-full border bg-white px-4 py-1.5 text-sm font-semibold text-primary shadow-sm">
            Detergente en polvo de Novanex
          </div>
          <h1 className="max-w-3xl text-5xl font-black tracking-normal text-slate-950 sm:text-6xl lg:text-7xl">
            {product.nombre} limpia profundo y deja tu ropa fresca.
          </h1>
          <p className="max-w-2xl text-lg leading-8 text-slate-600">
            Alto rendimiento en presentación de {product.peso} para hogares que buscan limpieza visible, aroma agradable y una compra simple por WhatsApp.
          </p>
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
          <div className="absolute inset-8 rounded-full bg-cyan-300/40 blur-3xl" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={product.imagen} alt={`Detergente ${product.nombre} ${product.peso}`} className="relative mx-auto max-h-[560px] w-auto max-w-full object-contain drop-shadow-2xl" />
        </div>
      </div>
    </section>
  );
}
