import { Star } from "lucide-react";
import { Reveal } from "@/components/animations/Reveal";
import { Card, CardContent } from "@/components/ui/card";
import { testimonials } from "@/utils/constants";

export function Testimonials() {
  return (
    <section id="testimonios" className="bg-[#eef8ff] py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal className="mb-8">
          <p className="font-semibold text-primary">Testimonios</p>
          <h2 className="mt-2 text-3xl font-bold tracking-normal">Opiniones de clientes.</h2>
        </Reveal>
        <Reveal childSelector="[data-testimonial-card]" className="grid gap-4 md:grid-cols-3">
          {testimonials.map((item) => (
            <Card key={item.nombre} data-testimonial-card data-motion-card className="border-2 border-blue-100 bg-white shadow-sm">
              <CardContent className="space-y-4 p-6">
                <div className="flex text-amber-500">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="size-4 fill-current" />
                  ))}
                </div>
                <p className="text-muted-foreground">&ldquo;{item.comentario}&rdquo;</p>
                <p className="font-semibold">{item.nombre}</p>
              </CardContent>
            </Card>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
