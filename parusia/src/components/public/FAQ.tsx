"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { ChevronDown } from "lucide-react";
import { Reveal } from "@/components/animations/Reveal";
import { Card, CardContent } from "@/components/ui/card";

const faqs = [
  ["¿Dónde puedo comprar Parusia?", "Puedes comprarlo directamente con Novanex por WhatsApp."],
  ["¿Cómo hago mi pedido?", "Toca cualquier botón de compra y se abrirá WhatsApp con un mensaje listo."],
  ["¿El pedido se realiza por WhatsApp?", "Sí. La web no tiene módulo de pedidos ni carrito; la compra es solo por WhatsApp."],
  ["¿Qué presentación tiene el producto?", "Parusia está disponible en presentación de 850g."],
];

export function FAQ() {
  const [active, setActive] = useState(0);
  const answersRef = useRef<(HTMLDivElement | null)[]>([]);

  function toggle(index: number) {
    const next = active === index ? -1 : index;
    setActive(next);

    requestAnimationFrame(() => {
      answersRef.current.forEach((answer, answerIndex) => {
        if (!answer) return;
        gsap.to(answer, {
          height: answerIndex === next ? "auto" : 0,
          autoAlpha: answerIndex === next ? 1 : 0,
          duration: 0.28,
          ease: "power2.out",
        });
      });
    });
  }

  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <Reveal className="mb-8 text-center">
          <p className="font-semibold text-primary">Preguntas frecuentes</p>
          <h2 className="mt-2 text-3xl font-bold tracking-normal">Compra simple y directa.</h2>
        </Reveal>
        <Reveal childSelector="[data-faq-card]" className="grid gap-3">
          {faqs.map(([question, answer], index) => (
            <Card key={question} data-faq-card className="border-2 border-slate-200 bg-[#fbfdff]">
              <CardContent className="p-0">
                <button
                  type="button"
                  onClick={() => toggle(index)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left font-semibold"
                  aria-expanded={active === index}
                >
                  {question}
                  <ChevronDown className={`size-4 shrink-0 transition ${active === index ? "rotate-180" : ""}`} />
                </button>
                <div
                  ref={(node) => {
                    answersRef.current[index] = node;
                  }}
                  className="overflow-hidden px-5"
                  style={{ height: active === index ? "auto" : 0, opacity: active === index ? 1 : 0 }}
                >
                  <p className="pb-5 text-sm text-muted-foreground">{answer}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
