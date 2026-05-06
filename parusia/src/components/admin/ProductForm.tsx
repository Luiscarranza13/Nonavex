"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, ImagePlus, Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { productoSchema } from "@/lib/validations/schemas";
import { createProducto, updateProducto, uploadProductoImagen } from "@/services/producto.service";
import type { Producto } from "@/types/producto.types";
import { product as fallbackProduct } from "@/utils/constants";

const productoAdminSchema = productoSchema.extend({
  slug: z.string().min(1, "El slug es obligatorio."),
  destacado: z.boolean().default(false),
  stock_minimo: z.coerce.number().int().min(0).default(10),
  ubicacion: z.string().optional().default("Almacén principal"),
});

type Values = z.input<typeof productoAdminSchema>;
type OutputValues = z.output<typeof productoAdminSchema>;

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function ProductForm({ producto }: { producto?: Producto }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [preview, setPreview] = useState(producto?.imagen_url ?? fallbackProduct.imagen);
  const [file, setFile] = useState<File | null>(null);
  const isEditing = Boolean(producto);

  const form = useForm<Values, unknown, OutputValues>({
    resolver: zodResolver(productoAdminSchema),
    defaultValues: {
      nombre: producto?.nombre ?? "",
      slug: producto?.slug ?? "",
      descripcion: producto?.descripcion ?? "",
      presentacion: producto?.presentacion ?? "Bolsa de detergente",
      peso: producto?.peso ?? "",
      precio: Number(producto?.precio ?? 0),
      activo: producto?.activo ?? true,
      destacado: producto?.destacado ?? false,
      stock_minimo: 10,
      ubicacion: "Almacén principal",
    },
  });

  const activo = useWatch({ control: form.control, name: "activo" });
  const destacado = useWatch({ control: form.control, name: "destacado" });
  const nombre = useWatch({ control: form.control, name: "nombre" });

  useEffect(() => {
    if (!isEditing && nombre) {
      form.setValue("slug", slugify(String(nombre)), { shouldValidate: true });
    }
  }, [form, isEditing, nombre]);

  const imageLabel = useMemo(() => {
    if (file) return file.name;
    if (producto?.imagen_url) return "Imagen actual";
    return "Seleccionar imagen";
  }, [file, producto?.imagen_url]);

  function onFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const nextFile = event.target.files?.[0] ?? null;
    setFile(nextFile);
    if (nextFile) {
      setPreview(URL.createObjectURL(nextFile));
    }
  }

  async function onSubmit(values: OutputValues) {
    setSaving(true);
    let imagenUrl = producto?.imagen_url ?? null;

    if (file) {
      const upload = await uploadProductoImagen(file);
      if (upload.error) {
        toast.error(upload.error.message);
        setSaving(false);
        return;
      }
      imagenUrl = upload.data;
    }

    const payload = {
      nombre: values.nombre,
      slug: slugify(values.slug),
      descripcion: values.descripcion ?? "",
      presentacion: values.presentacion,
      peso: values.peso ?? "",
      precio: values.precio,
      activo: values.activo,
      destacado: values.destacado,
      imagen_url: imagenUrl,
    };

    const result = producto
      ? await updateProducto(producto.id, payload)
      : await createProducto({ ...payload, stock_minimo: values.stock_minimo, ubicacion: values.ubicacion });

    setSaving(false);

    if (result.error) {
      toast.error(result.error.message);
      return;
    }

    toast.success(producto ? "Producto actualizado." : "Producto creado.");
    router.push("/admin/producto");
    router.refresh();
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-primary">Productos</p>
          <h1 className="text-2xl font-bold tracking-normal">{producto ? "Editar producto" : "Nuevo producto"}</h1>
          <p className="text-sm text-muted-foreground">Administra datos comerciales, estado, imagen e inventario inicial.</p>
        </div>
        <Button variant="outline" onClick={() => router.push("/admin/producto")}>
          <ArrowLeft /> Volver
        </Button>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_380px]">
        <Card>
          <CardHeader>
            <CardTitle>Información del producto</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-5">
            <div className="grid gap-2">
              <Label>Nombre</Label>
              <Input placeholder="Parusia 850g" {...form.register("nombre")} />
              <p className="text-xs text-destructive">{form.formState.errors.nombre?.message}</p>
            </div>
            <div className="grid gap-2">
              <Label>Slug</Label>
              <Input placeholder="parusia-850g" {...form.register("slug")} />
              <p className="text-xs text-muted-foreground">Identificador único para URLs y consultas.</p>
            </div>
            <div className="grid gap-2">
              <Label>Descripción</Label>
              <Textarea className="min-h-32" {...form.register("descripcion")} />
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="grid gap-2"><Label>Presentación</Label><Input {...form.register("presentacion")} /></div>
              <div className="grid gap-2"><Label>Peso</Label><Input placeholder="850g" {...form.register("peso")} /></div>
              <div className="grid gap-2"><Label>Precio</Label><Input type="number" step="0.01" {...form.register("precio")} /></div>
            </div>
            {!isEditing ? (
              <div className="grid gap-4 md:grid-cols-2">
                <div className="grid gap-2"><Label>Stock mínimo inicial</Label><Input type="number" min={0} {...form.register("stock_minimo")} /></div>
                <div className="grid gap-2"><Label>Ubicación inicial</Label><Input {...form.register("ubicacion")} /></div>
              </div>
            ) : null}
          </CardContent>
        </Card>

        <div className="grid gap-5">
          <Card>
            <CardHeader>
              <CardTitle>Imagen</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="flex aspect-square items-center justify-center rounded-lg border bg-muted/30 p-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={preview} alt="Vista previa del producto" className="max-h-full max-w-full object-contain" />
              </div>
              <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed p-4 text-sm font-medium hover:bg-muted">
                <ImagePlus className="size-4" />
                {imageLabel}
                <Input type="file" accept="image/*" className="sr-only" onChange={onFileChange} />
              </label>
              <p className="text-xs text-muted-foreground">Formatos recomendados: PNG, JPG o WEBP. Máximo 5 MB.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Estado</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3">
              <label className="flex items-center gap-2 text-sm">
                <Checkbox checked={Boolean(activo)} onCheckedChange={(value) => form.setValue("activo", Boolean(value))} />
                Producto activo
              </label>
              <label className="flex items-center gap-2 text-sm">
                <Checkbox checked={Boolean(destacado)} onCheckedChange={(value) => form.setValue("destacado", Boolean(value))} />
                Destacado en la web pública
              </label>
              <Button disabled={saving} type="submit" className="mt-2">
                {saving ? <Loader2 className="animate-spin" /> : <Save />}
                {producto ? "Guardar cambios" : "Crear producto"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  );
}
