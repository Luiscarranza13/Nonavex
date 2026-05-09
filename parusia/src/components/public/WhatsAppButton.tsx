"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { MessageCircle } from "lucide-react";
import { whatsappUrl } from "@/utils/constants";

export function WhatsAppButton() {
  const ref = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const tween = gsap.to(element, {
      scale: 1.08,
      duration: 1.1,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
    });

    return () => {
      tween.kill();
    };
  }, []);

  return (
    <a
      ref={ref}
      href={whatsappUrl()}
      target="_blank"
      rel="noreferrer"
      aria-label="Comprar Parusia por WhatsApp"
      className="fixed bottom-5 right-5 z-50 flex size-14 items-center justify-center rounded-full bg-red-600 text-white shadow-xl transition hover:bg-red-700"
    >
      <MessageCircle />
    </a>
  );
}
