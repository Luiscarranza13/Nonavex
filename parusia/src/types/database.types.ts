export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export type Database = {
  public: {
    Tables: {
      perfiles: { Row: import("./usuarios.types").Perfil };
      productos: { Row: import("./producto.types").Producto };
      inventario: { Row: import("./inventario.types").Inventario };
      movimientos_inventario: { Row: import("./inventario.types").MovimientoInventario };
      ventas: { Row: import("./ventas.types").Venta };
    };
    Functions: {
      registrar_venta: {
        Args: {
          p_producto_id: string;
          p_usuario_id: string;
          p_cantidad: number;
          p_precio_unitario: number;
          p_observacion?: string;
        };
        Returns: string;
      };
    };
  };
};
