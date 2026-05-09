"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ArrowDown, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { LandingConfig, LandingProduct } from "@/lib/public-data";
import { whatsappUrl } from "@/utils/constants";

export function Hero({ product, config }: { product: LandingProduct; config: LandingConfig }) {
  const buyUrl = whatsappUrl(config.mensaje_whatsapp, config.whatsapp);
  const sectionRef = useRef<HTMLElement>(null);
  const productRef = useRef<HTMLDivElement>(null);
  const titleWords = `${product.nombre} limpia profundo y deja tu ropa fresca.`
    .split(" ")
    .map((word, index) => ({ word, id: `${word}-${index}` }));

  useEffect(() => {
    const section = sectionRef.current;
    const productCard = productRef.current;
    if (!section || !productCard) return;
    const currentSection = section;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const ctx = gsap.context(() => {
      const timeline = gsap.timeline({ defaults: { ease: "power3.out" } });

      timeline
        .from("[data-hero-eyebrow]", { autoAlpha: 0, y: 16, duration: 0.55 })
        .from("[data-hero-word]", { yPercent: 110, rotate: 2, duration: 0.78, stagger: 0.035 }, "-=0.2")
        .from("[data-hero-copy]", { autoAlpha: 0, y: 24, duration: 0.64, stagger: 0.07 }, "-=0.42")
        .from("[data-hero-product]", { autoAlpha: 0, y: 46, scale: 0.92, rotate: 2, duration: 0.95 }, "-=0.72")
        .from("[data-hero-chip]", { autoAlpha: 0, y: 14, duration: 0.48, stagger: 0.06 }, "-=0.58")
        .from("[data-hero-bubble]", { autoAlpha: 0, scale: 0, duration: 0.7, stagger: 0.08 }, "-=0.75");

      gsap.to("[data-hero-product]", {
        y: -12,
        duration: 2.7,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });

      gsap.to("[data-hero-bubble]", {
        y: "random(-18, 18)",
        x: "random(-10, 10)",
        duration: "random(2.4, 4.2)",
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
        stagger: 0.2,
      });

      gsap.to("[data-hero-shine]", {
        xPercent: 260,
        duration: 2.6,
        ease: "power2.inOut",
        repeat: -1,
        repeatDelay: 1.4,
      });

      gsap.to("[data-hero-product]", {
        yPercent: 12,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    }, section);

    function handlePointerMove(event: PointerEvent) {
      const rect = currentSection.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;

      gsap.to(productCard, {
        x: x * 18,
        y: y * 14,
        rotate: x * 2,
        duration: 0.6,
        ease: "power3.out",
      });
    }

    currentSection.addEventListener("pointermove", handlePointerMove);

    return () => {
      currentSection.removeEventListener("pointermove", handlePointerMove);
      ctx.revert();
    };
  }, []);

  return (
    <section ref={sectionRef} id="inicio" className="relative overflow-hidden bg-[#f5fbff]">
      <div className="absolute inset-x-0 top-0 h-4 bg-red-600" />
      <div data-hero-bubble className="absolute left-[6%] top-28 size-10 rounded-full border-2 border-cyan-200 bg-white/70" />
      <div data-hero-bubble className="absolute right-[12%] top-24 size-16 rounded-full border-2 border-blue-100 bg-cyan-100/70" />
      <div data-hero-bubble className="absolute bottom-24 left-[45%] size-8 rounded-full border-2 border-red-100 bg-white/80" />
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_0.9fr]">
        <div className="space-y-7">
          <div data-hero-eyebrow className="inline-flex rounded-full border-2 border-primary bg-white px-4 py-1.5 text-sm font-bold text-primary shadow-sm">
            Detergente en polvo de Novanex
          </div>
          <h1 className="max-w-3xl text-5xl font-black tracking-normal text-slate-950 sm:text-6xl lg:text-7xl">
            {titleWords.map(({ word, id }) => (
              <span key={id} className="mr-3 inline-block overflow-hidden align-bottom sm:mr-4">
                <span data-hero-word className="inline-block">
                  {word}
                </span>
              </span>
            ))}
          </h1>
          <p data-hero-copy className="max-w-2xl text-lg leading-8 text-slate-600">
            Alto rendimiento en presentación de {product.peso} para hogares que buscan limpieza visible, aroma agradable y una compra simple por WhatsApp.
          </p>
          <div data-hero-copy className="grid max-w-xl gap-3 sm:grid-cols-3">
            {[product.peso, "Compra directa", "Aroma fresco"].map((item) => (
              <div key={item} data-hero-chip className="rounded-lg border-2 border-slate-200 bg-white px-4 py-3 text-center text-sm font-bold text-slate-800 shadow-sm">
                {item}
              </div>
            ))}
          </div>
          <div data-hero-copy className="flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" data-magnetic className="h-12 bg-red-600 px-5 text-white hover:bg-red-700">
              <a href={buyUrl} target="_blank" rel="noreferrer">
                <MessageCircle /> Comprar por WhatsApp
              </a>
            </Button>
            <Button asChild variant="outline" size="lg" data-magnetic className="h-12 px-5">
              <a href="#beneficios">
                <ArrowDown /> Ver beneficios
              </a>
            </Button>
          </div>
        </div>
        <div ref={productRef} data-hero-product className="relative mx-auto w-full max-w-md overflow-hidden rounded-2xl">
          <div className="absolute inset-x-8 bottom-6 h-20 rounded-full bg-cyan-200" />
          <div className="absolute inset-y-12 right-0 w-24 rounded-full bg-red-100" />
          <div data-hero-shine className="absolute inset-y-0 left-[-65%] z-10 w-1/2 rotate-12 bg-white/35 blur-xl" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={product.imagen} alt={`Detergente ${product.nombre} ${product.peso}`} className="relative mx-auto max-h-[560px] w-auto max-w-full object-contain drop-shadow-2xl" />
        </div>
      </div>
    </section>
  );
}
