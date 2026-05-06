export type RolUsuario = "admin" | "vendedor";

export type Perfil = {
  id: string;
  nombre: string;
  email: string;
  rol: RolUsuario;
  activo: boolean;
  avatar_url: string | null;
};
