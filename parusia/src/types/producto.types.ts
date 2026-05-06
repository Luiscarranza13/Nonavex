export type Producto = {
  id: string;
  nombre: string;
  slug: string;
  descripcion: string | null;
  presentacion: string | null;
  peso: string | null;
  precio: number;
  imagen_url: string | null;
  activo: boolean;
  destacado: boolean;
};
