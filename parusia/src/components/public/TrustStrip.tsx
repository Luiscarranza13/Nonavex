"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

const items = ["Limpieza profunda", "Aroma fresco", "Compra por WhatsApp", "Rinde más", "850g", "Novanex"];

export function TrustStrip() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const strip = ref.current;
    if (!strip || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      gsap.to("[data-trust-track]", {
        xPercent: -50,
        duration: 18,
        ease: "none",
        repeat: -1,
      });
    }, strip);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} className="overflow-hidden border-y border-blue-100 bg-white py-4">
      <div data-trust-track className="flex w-max gap-3">
        {[...items, ...items].map((item, index) => (
          <span
            key={`${item}-${index}`}
            className="rounded-full border border-blue-100 bg-[#f8fcff] px-5 py-2 text-sm font-bold text-slate-700"
          >
            {item}
          </span>
        ))}
      </div>
    </section>
  );
}
