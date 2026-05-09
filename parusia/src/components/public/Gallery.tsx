"use client";

import Image from "next/image";
import { gallery } from "@/utils/constants";

export function Gallery() {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-8">
          <p className="font-semibold text-primary">Galeria</p>
          <h2 className="mt-2 text-3xl font-bold tracking-normal">Parusia en cada lavado.</h2>
        </div>
        <div className="grid auto-cols-[82%] grid-flow-col gap-4 overflow-x-auto pb-3 sm:auto-cols-[48%] lg:grid-flow-row lg:grid-cols-3 lg:overflow-visible">
          {gallery.map((item) => (
            <div key={item.titulo} className="rounded-xl border-2 border-blue-100 bg-[#f0fbff] p-4 shadow-sm">
              <div className="flex aspect-[4/3] items-center justify-center rounded-lg bg-white p-8">
                <Image src={item.imagen} alt={item.titulo} width={280} height={330} className="max-h-full w-auto" />
              </div>
              <p className="mt-4 text-sm font-bold text-slate-800">{item.titulo}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
