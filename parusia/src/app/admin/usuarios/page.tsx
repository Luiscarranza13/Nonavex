"use client";

import { useEffect, useState } from "react";
import { Plus, Save } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DataTable } from "@/components/admin/DataTable";
import { ModalForm } from "@/components/admin/ModalForm";
import { getUsuarios, updateUsuario } from "@/services/usuarios.service";

type UsuarioRow = {
  id: string;
  nombre: string;
  email: string;
  rol: "admin" | "vendedor";
  activo: boolean;
};

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState<UsuarioRow[]>([]);
  const [rol, setRol] = useState<"admin" | "vendedor">("vendedor");
  const [activo, setActivo] = useState(true);

  async function loadUsuarios() {
    const { data, error } = await getUsuarios();
    if (error) {
      toast.error(error.message);
      return;
    }
    setUsuarios((data ?? []) as UsuarioRow[]);
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadUsuarios();
  }, []);

  async function createUsuario(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const response = await fetch("/api/admin/usuarios", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nombre: String(formData.get("nombre") ?? ""),
        email: String(formData.get("email") ?? ""),
        password: String(formData.get("password") ?? ""),
        rol,
        activo,
      }),
    });
    const result = await response.json();

    if (!response.ok) {
      toast.error(result.error ?? "No se pudo crear el usuario.");
      return;
    }

    toast.success("Usuario creado.");
    event.currentTarget.reset();
    await loadUsuarios();
  }

  async function toggleUsuario(usuario: UsuarioRow) {
    const { error } = await updateUsuario(usuario.id, { activo: !usuario.activo });
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Estado actualizado.");
    await loadUsuarios();
  }

  async function changeRol(usuario: UsuarioRow, nextRol: "admin" | "vendedor") {
    const { error } = await updateUsuario(usuario.id, { rol: nextRol });
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Rol actualizado.");
    await loadUsuarios();
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-normal">Usuarios administradores</h1>
          <p className="text-sm text-muted-foreground">Roles permitidos: admin y vendedor.</p>
        </div>
        <ModalForm title="Crear usuario administrador" trigger={<Button><Plus /> Nuevo usuario</Button>}>
          <form onSubmit={createUsuario} className="grid gap-4">
            <div className="grid gap-2"><Label>Nombre</Label><Input name="nombre" required /></div>
            <div className="grid gap-2"><Label>Email</Label><Input name="email" type="email" required /></div>
            <div className="grid gap-2"><Label>Contraseña</Label><Input name="password" type="password" minLength={6} required /></div>
            <div className="grid gap-2">
              <Label>Rol</Label>
              <Select value={rol} onValueChange={(value) => setRol(value as typeof rol)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="vendedor">Vendedor</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <label className="flex items-center gap-2 text-sm"><Checkbox checked={activo} onCheckedChange={(value) => setActivo(Boolean(value))} /> Usuario activo</label>
            <Button type="submit">Crear usuario</Button>
          </form>
        </ModalForm>
      </div>
      <Card>
        <CardHeader><CardTitle>Listado de usuarios</CardTitle></CardHeader>
        <CardContent>
          <DataTable data={usuarios as unknown as Record<string, unknown>[]} columns={[
            { accessorKey: "nombre", header: "Nombre" },
            { accessorKey: "email", header: "Email" },
            {
              accessorKey: "rol",
              header: "Rol",
              cell: (value, row) => (
                <Select value={String(value)} onValueChange={(next) => changeRol(row as unknown as UsuarioRow, next as "admin" | "vendedor")}>
                  <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="admin">Admin</SelectItem><SelectItem value="vendedor">Vendedor</SelectItem></SelectContent>
                </Select>
              ),
            },
            { accessorKey: "activo", header: "Estado", cell: (value) => <Badge>{value ? "activo" : "inactivo"}</Badge> },
            {
              accessorKey: "id",
              header: "Acciones",
              cell: (_value, row) => {
                const usuario = row as unknown as UsuarioRow;
                return (
                  <Button variant="outline" size="sm" onClick={() => toggleUsuario(usuario)}>
                    <Save /> {usuario.activo ? "Desactivar" : "Activar"}
                  </Button>
                );
              },
            },
          ]} />
        </CardContent>
      </Card>
    </div>
  );
}
