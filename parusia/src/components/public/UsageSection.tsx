import { Droplets, PackageCheck, Shirt } from "lucide-react";
import { Reveal } from "@/components/animations/Reveal";

const steps = [
  {
    title: "Dosifica",
    text: "Usa la cantidad adecuada según la carga de ropa y el nivel de suciedad.",
    icon: PackageCheck,
  },
  {
    title: "Lava",
    text: "Actúa en prendas de uso diario con limpieza profunda y aroma fresco.",
    icon: Shirt,
  },
  {
    title: "Rinde",
    text: "La presentación de 850g está pensada para compras prácticas del hogar.",
    icon: Droplets,
  },
];

export function UsageSection() {
  return (
    <section className="bg-[#f8fcff] py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal className="mb-10 max-w-2xl">
          <p className="font-semibold text-primary">Uso y rendimiento</p>
          <h2 className="mt-2 text-3xl font-bold tracking-normal sm:text-4xl">
            Compra simple, lavado práctico y resultado visible.
          </h2>
        </Reveal>
        <Reveal childSelector="[data-usage-step]" className="grid gap-4 md:grid-cols-3">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={step.title} data-usage-step data-motion-card className="rounded-xl border-2 border-blue-100 bg-white p-6 shadow-sm">
                <div className="mb-5 flex items-center justify-between">
                  <span className="flex size-12 items-center justify-center rounded-lg bg-cyan-100 text-slate-950">
                    <Icon />
                  </span>
                  <span className="font-mono text-sm font-bold text-primary">0{index + 1}</span>
                </div>
                <h3 className="text-lg font-bold">{step.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{step.text}</p>
              </div>
            );
          })}
        </Reveal>
      </div>
    </section>
  );
}
