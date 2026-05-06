"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { getConfiguracion, updateConfiguracion, uploadLogo } from "@/services/configuracion.service";
import { WHATSAPP_MESSAGE, WHATSAPP_NUMBER } from "@/utils/constants";

type Config = {
  id: string;
  empresa: string;
  nombre_comercial: string;
  whatsapp: string | null;
  mensaje_whatsapp: string | null;
  facebook: string | null;
  instagram: string | null;
  tiktok: string | null;
  correo: string | null;
  direccion: string | null;
  logo_url: string | null;
};

export default function ConfiguracionPage() {
  const [config, setConfig] = useState<Config | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getConfiguracion().then(({ data, error }) => {
      if (error) {
        toast.error(error.message);
        return;
      }
      setConfig(data as Config);
    });
  }, []);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!config) {
      toast.error("No se encontró configuración. Ejecuta supabase/schema.sql.");
      return;
    }

    setSaving(true);
    const formData = new FormData(event.currentTarget);
    const file = (formData.get("logo") as File | null) ?? null;
    let logoUrl = config.logo_url;

    if (file?.size) {
      const upload = await uploadLogo(file);
      if (upload.error) {
        toast.error(upload.error.message);
        setSaving(false);
        return;
      }
      logoUrl = upload.data;
    }

    const payload = {
      empresa: String(formData.get("empresa") ?? ""),
      nombre_comercial: String(formData.get("nombre_comercial") ?? ""),
      whatsapp: String(formData.get("whatsapp") ?? ""),
      correo: String(formData.get("correo") ?? ""),
      facebook: String(formData.get("facebook") ?? ""),
      instagram: String(formData.get("instagram") ?? ""),
      tiktok: String(formData.get("tiktok") ?? ""),
      direccion: String(formData.get("direccion") ?? ""),
      mensaje_whatsapp: String(formData.get("mensaje_whatsapp") ?? ""),
      logo_url: logoUrl,
    };

    const { data, error } = await updateConfiguracion(config.id, payload);
    setSaving(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    setConfig(data as Config);
    toast.success("Configuración actualizada.");
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Configuración comercial</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={submit} className="grid gap-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2"><Label>Nombre de empresa</Label><Input name="empresa" defaultValue={config?.empresa ?? "Novanex"} required /></div>
            <div className="grid gap-2"><Label>Nombre comercial</Label><Input name="nombre_comercial" defaultValue={config?.nombre_comercial ?? "Parusia"} required /></div>
            <div className="grid gap-2"><Label>WhatsApp</Label><Input name="whatsapp" defaultValue={config?.whatsapp ?? WHATSAPP_NUMBER} required /></div>
            <div className="grid gap-2"><Label>Correo</Label><Input name="correo" type="email" defaultValue={config?.correo ?? ""} placeholder="ventas@novanex.com" /></div>
            <div className="grid gap-2"><Label>Facebook</Label><Input name="facebook" defaultValue={config?.facebook ?? ""} placeholder="https://facebook.com/..." /></div>
            <div className="grid gap-2"><Label>Instagram</Label><Input name="instagram" defaultValue={config?.instagram ?? ""} placeholder="https://instagram.com/..." /></div>
            <div className="grid gap-2"><Label>TikTok</Label><Input name="tiktok" defaultValue={config?.tiktok ?? ""} placeholder="https://tiktok.com/@..." /></div>
            <div className="grid gap-2"><Label>Logo</Label><Input name="logo" type="file" accept="image/*" /></div>
          </div>
          <div className="grid gap-2"><Label>Dirección</Label><Input name="direccion" defaultValue={config?.direccion ?? ""} /></div>
          <div className="grid gap-2"><Label>Mensaje predeterminado para WhatsApp</Label><Textarea name="mensaje_whatsapp" defaultValue={config?.mensaje_whatsapp ?? WHATSAPP_MESSAGE} required /></div>
          <Button disabled={saving} type="submit" className="w-fit">Guardar configuración</Button>
        </form>
      </CardContent>
    </Card>
  );
}
