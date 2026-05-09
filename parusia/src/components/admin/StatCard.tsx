"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import type { LucideIcon } from "lucide-react";
import { AnimatedCounter } from "@/components/animations/AnimatedCounter";
import { Card, CardContent } from "@/components/ui/card";

export function StatCard({ title, value, icon: Icon, prefix = "" }: { title: string; value: number | string; icon: LucideIcon; prefix?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const card = ref.current;
    if (!card || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.fromTo(card, { autoAlpha: 0, y: 14, scale: 0.98 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.45, ease: "power2.out" });
  }, [value]);

  return (
    <Card ref={ref} className="transition hover:-translate-y-0.5 hover:shadow-md">
      <CardContent className="flex items-center justify-between p-5">
        <div className="min-w-0">
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="mt-1 line-clamp-1 text-2xl font-bold">
            {typeof value === "number" ? <AnimatedCounter value={value} prefix={prefix} /> : value}
          </p>
        </div>
        <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-cyan-100 text-primary">
          <Icon />
        </span>
      </CardContent>
    </Card>
  );
}
