"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function reducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function MotionRuntime() {
  useEffect(() => {
    if (reducedMotion()) return;

    const progressTween = gsap.to("[data-scroll-progress]", {
      scaleX: 1,
      ease: "none",
      scrollTrigger: {
        trigger: document.documentElement,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.2,
      },
    });

    const cards = Array.from(document.querySelectorAll<HTMLElement>("[data-motion-card]"));
    const magnets = Array.from(document.querySelectorAll<HTMLElement>("[data-magnetic]"));

    const cleanups: Array<() => void> = [];

    cards.forEach((card) => {
      function move(event: PointerEvent) {
        const rect = card.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;

        gsap.to(card, {
          rotateX: y * -4,
          rotateY: x * 5,
          y: -4,
          scale: 1.012,
          transformPerspective: 900,
          duration: 0.35,
          ease: "power2.out",
        });
      }

      function leave() {
        gsap.to(card, {
          rotateX: 0,
          rotateY: 0,
          y: 0,
          scale: 1,
          duration: 0.45,
          ease: "elastic.out(1, 0.55)",
        });
      }

      card.addEventListener("pointermove", move);
      card.addEventListener("pointerleave", leave);
      cleanups.push(() => {
        card.removeEventListener("pointermove", move);
        card.removeEventListener("pointerleave", leave);
      });
    });

    magnets.forEach((magnet) => {
      function move(event: PointerEvent) {
        const rect = magnet.getBoundingClientRect();
        const x = event.clientX - (rect.left + rect.width / 2);
        const y = event.clientY - (rect.top + rect.height / 2);

        gsap.to(magnet, {
          x: x * 0.18,
          y: y * 0.22,
          scale: 1.03,
          duration: 0.35,
          ease: "power3.out",
        });
      }

      function leave() {
        gsap.to(magnet, {
          x: 0,
          y: 0,
          scale: 1,
          duration: 0.55,
          ease: "elastic.out(1, 0.45)",
        });
      }

      magnet.addEventListener("pointermove", move);
      magnet.addEventListener("pointerleave", leave);
      cleanups.push(() => {
        magnet.removeEventListener("pointermove", move);
        magnet.removeEventListener("pointerleave", leave);
      });
    });

    return () => {
      cleanups.forEach((cleanup) => cleanup());
      progressTween.scrollTrigger?.kill();
      progressTween.kill();
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-1 origin-left scale-x-0 bg-red-600" data-scroll-progress />
  );
}
