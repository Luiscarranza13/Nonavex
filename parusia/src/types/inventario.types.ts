export type MovimientoInventarioTipo = "entrada" | "salida" | "ajuste" | "venta";

export type Inventario = {
  id: string;
  producto_id: string;
  stock_actual: number;
  stock_minimo: number;
  ubicacion: string | null;
};

export type MovimientoInventario = {
  id: string;
  producto_id: string;
  usuario_id: string | null;
  tipo: MovimientoInventarioTipo;
  cantidad: number;
  stock_anterior: number;
  stock_nuevo: number;
  motivo: string | null;
  observacion: string | null;
  creado_en: string;
};
