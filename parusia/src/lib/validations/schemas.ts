import { z } from "zod";

const required = "Este campo es obligatorio.";

export const loginSchema = z.object({
  email: z.string().email("Ingresa un correo válido."),
  password: z.string().min(1, required),
});

export const productoSchema = z.object({
  nombre: z.string().min(1, required),
  descripcion: z.string().optional(),
  presentacion: z.string().min(1, required),
  peso: z.string().optional(),
  precio: z.coerce.number().positive("El precio debe ser mayor a 0."),
  activo: z.boolean().default(true),
});

export const inventarioSchema = z.object({
  tipo: z.enum(["entrada", "salida", "ajuste"]),
  cantidad: z.coerce.number().int().positive("La cantidad debe ser mayor a 0."),
  motivo: z.string().min(1, required),
  observacion: z.string().optional(),
});

export const ventaSchema = z.object({
  cantidad: z.coerce.number().int().positive("La cantidad debe ser mayor a 0."),
  precio_unitario: z.coerce.number().positive("El precio unitario debe ser mayor a 0."),
  observacion: z.string().optional(),
});

export const configuracionSchema = z.object({
  empresa: z.string().min(1, required),
  nombre_comercial: z.string().min(1, required),
  whatsapp: z.string().regex(/^\+?\d{8,15}$/, "Ingresa un WhatsApp válido."),
  mensaje_whatsapp: z.string().min(1, required),
  correo: z.string().email("Correo inválido.").optional().or(z.literal("")),
  facebook: z.string().optional(),
  instagram: z.string().optional(),
  tiktok: z.string().optional(),
  direccion: z.string().optional(),
});

export const usuarioSchema = z.object({
  nombre: z.string().min(1, required),
  email: z.string().email("Ingresa un correo válido."),
  rol: z.enum(["admin", "vendedor"]),
  activo: z.boolean().default(true),
});
