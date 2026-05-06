"use client";

import Image from "next/image";
import { gallery } from "@/utils/constants";

export function Gallery() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
      <div className="mb-8">
        <p className="font-semibold text-primary">Galería</p>
        <h2 className="mt-2 text-3xl font-bold tracking-normal">Parusia en cada lavado.</h2>
      </div>
      <div className="grid auto-cols-[82%] grid-flow-col gap-4 overflow-x-auto pb-3 sm:auto-cols-[48%] lg:grid-flow-row lg:grid-cols-3 lg:overflow-visible">
        {gallery.map((item) => (
          <div key={item.titulo}>
            <div className="flex aspect-[4/3] items-center justify-center rounded-lg border bg-gradient-to-br from-blue-50 to-cyan-50 p-8">
              <Image src={item.imagen} alt={item.titulo} width={280} height={330} className="max-h-full w-auto" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
