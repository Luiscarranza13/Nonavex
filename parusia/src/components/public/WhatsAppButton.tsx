import { MessageCircle } from "lucide-react";
import { whatsappUrl } from "@/utils/constants";

export function WhatsAppButton() {
  return (
    <a href={whatsappUrl()} target="_blank" rel="noreferrer" aria-label="Comprar Parusia por WhatsApp" className="fixed bottom-5 right-5 z-50 flex size-14 items-center justify-center rounded-full bg-red-600 text-white shadow-xl transition hover:scale-105 hover:bg-red-700">
      <MessageCircle />
    </a>
  );
}
