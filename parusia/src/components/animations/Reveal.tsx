"use client";

import { type ReactNode, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type RevealProps = {
  children: ReactNode;
  className?: string;
  childSelector?: string;
  delay?: number;
  y?: number;
};

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function Reveal({ children, className, childSelector, delay = 0, y = 28 }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      const targets = childSelector ? element.querySelectorAll(childSelector) : element;

      gsap.fromTo(
        targets,
        { autoAlpha: 0, y, filter: "blur(8px)" },
        {
          autoAlpha: 1,
          y: 0,
          filter: "blur(0px)",
          delay,
          duration: 0.82,
          ease: "expo.out",
          stagger: childSelector ? 0.08 : 0,
          scrollTrigger: {
            trigger: element,
            start: "top 82%",
            once: true,
          },
        },
      );
    }, element);

    return () => ctx.revert();
  }, [childSelector, delay, y]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
