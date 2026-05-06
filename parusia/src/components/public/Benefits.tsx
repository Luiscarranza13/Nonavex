import { Droplets, Home, Shirt, Sparkles, Stars, Wind } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { benefits } from "@/utils/constants";

const icons = [Sparkles, Wind, Droplets, Stars, Shirt, Home];

export function Benefits() {
  return (
    <section id="beneficios" className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
      <div className="mb-10 max-w-2xl">
        <p className="font-semibold text-primary">Beneficios</p>
        <h2 className="mt-2 text-3xl font-bold tracking-normal sm:text-4xl">Limpieza pensada para el ritmo del hogar.</h2>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {benefits.map((benefit, index) => {
          const Icon = icons[index];
          return (
            <Card key={benefit} className="border-blue-100 bg-white shadow-sm">
              <CardContent className="flex items-center gap-4 p-6">
                <span className="flex size-12 items-center justify-center rounded-lg bg-cyan-100 text-primary">
                  <Icon />
                </span>
                <h3 className="font-semibold">{benefit}</h3>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
