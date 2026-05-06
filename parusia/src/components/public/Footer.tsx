import { AtSign, MessageCircle, Music2 } from "lucide-react";
import { whatsappUrl } from "@/utils/constants";

export function Footer() {
  return (
    <footer className="border-t bg-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xl font-bold text-primary">Parusia</p>
          <p className="text-sm text-muted-foreground">Empresa Novanex · Todos los derechos reservados.</p>
        </div>
        <div className="flex items-center gap-3 text-muted-foreground">
          <a href={whatsappUrl()} target="_blank" rel="noreferrer" aria-label="WhatsApp"><MessageCircle /></a>
          <a href="#" aria-label="Facebook"><AtSign /></a>
          <a href="#" aria-label="Instagram"><Music2 /></a>
        </div>
      </div>
    </footer>
  );
}
