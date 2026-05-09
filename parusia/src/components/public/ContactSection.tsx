"use client";

import { useState } from "react";
import { MessageCircle, Send } from "lucide-react";
import { toast } from "sonner";
import { Reveal } from "@/components/animations/Reveal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { whatsappUrl } from "@/utils/constants";

export function ContactSection() {
  const [loading, setLoading] = useState(false);

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success("Mensaje registrado. Novanex puede conectarlo a Supabase desde la tabla contactos.");
      event.currentTarget.reset();
    }, 500);
  }

  return (
    <section id="contacto" className="bg-slate-950 py-20 text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.8fr_1fr]">
        <Reveal>
          <p className="font-semibold text-cyan-200">Contacto</p>
          <h2 className="mt-2 text-3xl font-bold tracking-normal">Habla con Novanex.</h2>
          <p className="mt-4 text-slate-200">Escríbenos para consultas comerciales o compra directamente por WhatsApp.</p>
          <Button asChild data-magnetic className="mt-6 bg-red-600 text-white hover:bg-red-700">
            <a href={whatsappUrl()} target="_blank" rel="noreferrer">
              <MessageCircle /> Ir a WhatsApp
            </a>
          </Button>
        </Reveal>
        <Reveal>
          <form onSubmit={submit} className="grid gap-4 rounded-lg border-2 border-cyan-300 bg-white p-6 shadow-xl">
            <Input name="nombre" placeholder="Nombre" required className="bg-white text-slate-950" />
            <Input name="correo" type="email" placeholder="Correo" className="bg-white text-slate-950" />
            <Textarea name="mensaje" placeholder="Mensaje" required className="min-h-32 bg-white text-slate-950" />
            <Button disabled={loading} type="submit" className="bg-cyan-500 text-slate-950 hover:bg-cyan-400">
              <Send /> Enviar
            </Button>
          </form>
        </Reveal>
      </div>
    </section>
  );
}
