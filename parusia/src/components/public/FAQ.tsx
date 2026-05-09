import { Card, CardContent } from "@/components/ui/card";

const faqs = [
  ["Donde puedo comprar Parusia?", "Puedes comprarlo directamente con Novanex por WhatsApp."],
  ["Como hago mi pedido?", "Toca cualquier boton de compra y se abrira WhatsApp con un mensaje listo."],
  ["El pedido se realiza por WhatsApp?", "Si. La web no tiene modulo de pedidos ni carrito; la compra es solo por WhatsApp."],
  ["Que presentacion tiene el producto?", "Parusia esta disponible en presentacion de 850g."],
];

export function FAQ() {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <div className="mb-8 text-center">
          <p className="font-semibold text-primary">Preguntas frecuentes</p>
          <h2 className="mt-2 text-3xl font-bold tracking-normal">Compra simple y directa.</h2>
        </div>
        <div className="grid gap-3">
          {faqs.map(([question, answer]) => (
            <Card key={question} className="border-2 border-slate-200 bg-[#fbfdff]">
              <CardContent className="p-5">
                <h3 className="font-semibold">{question}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{answer}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
