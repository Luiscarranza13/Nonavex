export type Venta = {
  id: string;
  producto_id: string;
  usuario_id: string | null;
  cantidad: number;
  precio_unitario: number;
  total: number;
  canal: "WhatsApp";
  observacion: string | null;
  fecha_venta: string;
};
