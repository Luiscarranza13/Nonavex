import { Card, CardContent } from "@/components/ui/card";

const faqs = [
  ["¿Dónde puedo comprar Parusia?", "Puedes comprarlo directamente con Novanex por WhatsApp."],
  ["¿Cómo hago mi pedido?", "Toca cualquier botón de compra y se abrirá WhatsApp con un mensaje listo."],
  ["¿El pedido se realiza por WhatsApp?", "Sí. La web no tiene módulo de pedidos ni carrito; la compra es solo por WhatsApp."],
  ["¿Qué presentación tiene el producto?", "Parusia está disponible en presentación de 850g."],
];

export function FAQ() {
  return (
    <section className="mx-auto max-w-4xl px-4 py-20 sm:px-6">
      <div className="mb-8 text-center">
        <p className="font-semibold text-primary">Preguntas frecuentes</p>
        <h2 className="mt-2 text-3xl font-bold tracking-normal">Compra simple y directa.</h2>
      </div>
      <div className="grid gap-3">
        {faqs.map(([question, answer]) => (
          <Card key={question}>
            <CardContent className="p-5">
              <h3 className="font-semibold">{question}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{answer}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
