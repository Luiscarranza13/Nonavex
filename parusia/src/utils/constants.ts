export const WHATSAPP_NUMBER = "51999999999";
export const WHATSAPP_MESSAGE =
  "Hola Novanex, quiero comprar detergente Parusia de 850g.";

export const product = {
  id: "parusia",
  nombre: "Parusia",
  presentacion: "Bolsa de detergente",
  peso: "850g",
  precio: 12.9,
  descripcion:
    "Detergente en polvo de alto rendimiento para una limpieza profunda, aroma fresco y cuidado diario de la ropa del hogar.",
  imagen: "/parusia-product.svg",
};

export const benefits = [
  "Elimina manchas difíciles",
  "Aroma fresco",
  "Limpieza profunda",
  "Rinde más",
  "Cuida tu ropa",
  "Ideal para el hogar",
];

export const testimonials = [
  {
    nombre: "María R.",
    comentario: "Deja la ropa limpia y con un aroma fresco que dura.",
  },
  {
    nombre: "Claudia S.",
    comentario: "Rinde bastante y funciona muy bien con ropa de uso diario.",
  },
  {
    nombre: "Rosa M.",
    comentario: "La presentación de 850g es práctica para mi hogar.",
  },
];

export const gallery = [
  { titulo: "Parusia 850g", imagen: "/parusia-product.svg" },
  { titulo: "Limpieza profunda", imagen: "/parusia-product.svg" },
  { titulo: "Aroma fresco", imagen: "/parusia-product.svg" },
];

export function whatsappUrl(message = WHATSAPP_MESSAGE, phone = WHATSAPP_NUMBER) {
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}
