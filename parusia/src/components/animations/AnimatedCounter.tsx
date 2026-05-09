"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export function AnimatedCounter({
  value,
  prefix = "",
  locale = "es-PE",
}: {
  value: number;
  prefix?: string;
  locale?: string;
}) {
  const [display, setDisplay] = useState(0);
  const previous = useRef(0);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      previous.current = value;
      const update = gsap.delayedCall(0, () => setDisplay(value));
      return () => {
        update.kill();
      };
    }

    const state = { value: previous.current };
    const tween = gsap.to(state, {
      value,
      duration: 0.9,
      ease: "power3.out",
      onUpdate: () => setDisplay(state.value),
      onComplete: () => {
        previous.current = value;
        setDisplay(value);
      },
    });

    return () => {
      tween.kill();
    };
  }, [value]);

  return (
    <>
      {prefix}
      {display.toLocaleString(locale, {
        minimumFractionDigits: prefix ? 2 : 0,
        maximumFractionDigits: prefix ? 2 : 0,
      })}
    </>
  );
}
