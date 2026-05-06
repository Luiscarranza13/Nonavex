create extension if not exists "pgcrypto";

create table if not exists public.perfiles (
  id uuid primary key references auth.users(id) on delete cascade,
  nombre text not null,
  email text not null unique,
  rol text not null default 'vendedor' check (rol in ('admin', 'vendedor')),
  activo boolean default true,
  avatar_url text,
  creado_en timestamptz default now(),
  actualizado_en timestamptz default now()
);

create table if not exists public.productos (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  slug text not null unique,
  descripcion text,
  presentacion text,
  peso text,
  precio numeric(10,2) not null default 0,
  imagen_url text,
  activo boolean default true,
  destacado boolean default true,
  creado_en timestamptz default now(),
  actualizado_en timestamptz default now()
);

create table if not exists public.inventario (
  id uuid primary key default gen_random_uuid(),
  producto_id uuid references public.productos(id) on delete cascade,
  stock_actual integer not null default 0,
  stock_minimo integer not null default 10,
  ubicacion text,
  actualizado_en timestamptz default now()
);

create table if not exists public.movimientos_inventario (
  id uuid primary key default gen_random_uuid(),
  producto_id uuid references public.productos(id) on delete cascade,
  usuario_id uuid references public.perfiles(id),
  tipo text not null check (tipo in ('entrada', 'salida', 'ajuste', 'venta')),
  cantidad integer not null check (cantidad > 0),
  stock_anterior integer not null,
  stock_nuevo integer not null,
  motivo text,
  observacion text,
  creado_en timestamptz default now()
);

create table if not exists public.ventas (
  id uuid primary key default gen_random_uuid(),
  producto_id uuid references public.productos(id),
  usuario_id uuid references public.perfiles(id),
  cantidad integer not null check (cantidad > 0),
  precio_unitario numeric(10,2) not null check (precio_unitario > 0),
  total numeric(10,2) not null,
  canal text not null default 'WhatsApp',
  observacion text,
  fecha_venta timestamptz default now(),
  creado_en timestamptz default now()
);

create table if not exists public.configuracion (
  id uuid primary key default gen_random_uuid(),
  empresa text not null default 'Novanex',
  nombre_comercial text not null default 'Parusia',
  whatsapp text,
  mensaje_whatsapp text,
  facebook text,
  instagram text,
  tiktok text,
  correo text,
  direccion text,
  logo_url text,
  activo boolean default true,
  actualizado_en timestamptz default now()
);

create table if not exists public.testimonios (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  comentario text not null,
  calificacion integer default 5,
  activo boolean default true,
  creado_en timestamptz default now()
);

create table if not exists public.galeria (
  id uuid primary key default gen_random_uuid(),
  titulo text,
  imagen_url text not null,
  orden integer default 0,
  activo boolean default true,
  creado_en timestamptz default now()
);

create table if not exists public.contactos (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  correo text,
  mensaje text not null,
  estado text default 'nuevo' check (estado in ('nuevo', 'revisado', 'cerrado')),
  creado_en timestamptz default now()
);

create or replace function public.set_actualizado_en()
returns trigger
language plpgsql
as $$
begin
  new.actualizado_en = now();
  return new;
end;
$$;

create or replace function public.es_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.perfiles
    where id = auth.uid() and rol = 'admin' and activo = true
  );
$$;

create or replace function public.es_admin_o_vendedor()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.perfiles
    where id = auth.uid() and rol in ('admin', 'vendedor') and activo = true
  );
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.perfiles (id, nombre, email, rol)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'nombre', split_part(new.email, '@', 1)),
    new.email,
    coalesce(new.raw_user_meta_data->>'rol', 'vendedor')
  );
  return new;
end;
$$;

create or replace function public.registrar_movimiento_inventario(
  p_producto_id uuid,
  p_usuario_id uuid,
  p_tipo text,
  p_cantidad integer,
  p_motivo text,
  p_observacion text default null
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_stock_anterior integer;
  v_stock_nuevo integer;
  v_movimiento_id uuid;
begin
  if p_tipo not in ('entrada', 'salida', 'ajuste') then
    raise exception 'Tipo de movimiento inválido';
  end if;

  select stock_actual into v_stock_anterior
  from public.inventario
  where producto_id = p_producto_id
  for update;

  if v_stock_anterior is null then
    raise exception 'Inventario no encontrado';
  end if;

  v_stock_nuevo := case
    when p_tipo = 'entrada' then v_stock_anterior + p_cantidad
    when p_tipo = 'salida' then v_stock_anterior - p_cantidad
    else p_cantidad
  end;

  if v_stock_nuevo < 0 then
    raise exception 'Stock insuficiente';
  end if;

  update public.inventario set stock_actual = v_stock_nuevo where producto_id = p_producto_id;

  insert into public.movimientos_inventario (
    producto_id, usuario_id, tipo, cantidad, stock_anterior, stock_nuevo, motivo, observacion
  ) values (
    p_producto_id, p_usuario_id, p_tipo, p_cantidad, v_stock_anterior, v_stock_nuevo, p_motivo, p_observacion
  ) returning id into v_movimiento_id;

  return v_movimiento_id;
end;
$$;

create or replace function public.registrar_venta(
  p_producto_id uuid,
  p_usuario_id uuid,
  p_cantidad integer,
  p_precio_unitario numeric,
  p_observacion text default null
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_stock_anterior integer;
  v_stock_nuevo integer;
  v_venta_id uuid;
begin
  select stock_actual into v_stock_anterior
  from public.inventario
  where producto_id = p_producto_id
  for update;

  if v_stock_anterior is null then
    raise exception 'Inventario no encontrado';
  end if;

  v_stock_nuevo := v_stock_anterior - p_cantidad;

  if v_stock_nuevo < 0 then
    raise exception 'Stock insuficiente';
  end if;

  insert into public.ventas (
    producto_id, usuario_id, cantidad, precio_unitario, total, canal, observacion
  ) values (
    p_producto_id, p_usuario_id, p_cantidad, p_precio_unitario, p_cantidad * p_precio_unitario, 'WhatsApp', p_observacion
  ) returning id into v_venta_id;

  update public.inventario set stock_actual = v_stock_nuevo where producto_id = p_producto_id;

  insert into public.movimientos_inventario (
    producto_id, usuario_id, tipo, cantidad, stock_anterior, stock_nuevo, motivo, observacion
  ) values (
    p_producto_id, p_usuario_id, 'venta', p_cantidad, v_stock_anterior, v_stock_nuevo, 'Venta WhatsApp', p_observacion
  );

  return v_venta_id;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

do $$
declare
  t text;
begin
  foreach t in array array['perfiles','productos','inventario','configuracion'] loop
    execute format('drop trigger if exists trg_%I_actualizado_en on public.%I', t, t);
    execute format('create trigger trg_%I_actualizado_en before update on public.%I for each row execute function public.set_actualizado_en()', t, t);
  end loop;
end $$;

insert into public.productos (nombre, slug, descripcion, presentacion, peso, precio, activo, destacado)
values ('Parusia', 'parusia', 'Detergente en polvo para limpieza profunda, aroma fresco y gran rendimiento.', 'Bolsa de detergente', '850g', 12.90, true, true)
on conflict (slug) do nothing;

insert into public.inventario (producto_id, stock_actual, stock_minimo, ubicacion)
select id, 0, 10, 'Almacén principal' from public.productos where slug = 'parusia'
on conflict do nothing;

insert into public.configuracion (empresa, nombre_comercial, whatsapp, mensaje_whatsapp, activo)
values ('Novanex', 'Parusia', '51999999999', 'Hola Novanex, quiero comprar detergente Parusia de 850g.', true);

alter table public.perfiles enable row level security;
alter table public.productos enable row level security;
alter table public.inventario enable row level security;
alter table public.movimientos_inventario enable row level security;
alter table public.ventas enable row level security;
alter table public.configuracion enable row level security;
alter table public.testimonios enable row level security;
alter table public.galeria enable row level security;
alter table public.contactos enable row level security;

create policy "public read active products" on public.productos for select using (activo = true or public.es_admin_o_vendedor());
create policy "admin manage products" on public.productos for all using (public.es_admin()) with check (public.es_admin());

create policy "public read active config" on public.configuracion for select using (activo = true or public.es_admin_o_vendedor());
create policy "admin manage config" on public.configuracion for all using (public.es_admin()) with check (public.es_admin());

create policy "public read active testimonials" on public.testimonios for select using (activo = true or public.es_admin_o_vendedor());
create policy "admin manage testimonials" on public.testimonios for all using (public.es_admin()) with check (public.es_admin());

create policy "public read active gallery" on public.galeria for select using (activo = true or public.es_admin_o_vendedor());
create policy "admin manage gallery" on public.galeria for all using (public.es_admin()) with check (public.es_admin());

create policy "authenticated read inventory" on public.inventario for select using (public.es_admin_o_vendedor());
create policy "admin manage inventory" on public.inventario for all using (public.es_admin()) with check (public.es_admin());

create policy "authenticated read movements" on public.movimientos_inventario for select using (public.es_admin_o_vendedor());
create policy "authenticated insert movements" on public.movimientos_inventario for insert with check (public.es_admin_o_vendedor());
create policy "admin delete movements" on public.movimientos_inventario for delete using (public.es_admin());

create policy "authenticated read sales" on public.ventas for select using (public.es_admin_o_vendedor());
create policy "authenticated insert sales" on public.ventas for insert with check (public.es_admin_o_vendedor());
create policy "admin manage sales" on public.ventas for update using (public.es_admin()) with check (public.es_admin());
create policy "admin delete sales" on public.ventas for delete using (public.es_admin());

create policy "users read own profile" on public.perfiles for select using (id = auth.uid() or public.es_admin());
create policy "admin manage profiles" on public.perfiles for all using (public.es_admin()) with check (public.es_admin());

create policy "public create contact" on public.contactos for insert with check (true);
create policy "admin manage contacts" on public.contactos for all using (public.es_admin()) with check (public.es_admin());

insert into storage.buckets (id, name, public)
values
  ('parusia-productos', 'parusia-productos', true),
  ('parusia-galeria', 'parusia-galeria', true),
  ('parusia-configuracion', 'parusia-configuracion', true)
on conflict (id) do nothing;

create policy "public read parusia storage" on storage.objects
for select using (bucket_id in ('parusia-productos', 'parusia-galeria', 'parusia-configuracion'));

create policy "admin write parusia storage" on storage.objects
for all using (bucket_id in ('parusia-productos', 'parusia-galeria', 'parusia-configuracion') and public.es_admin())
with check (bucket_id in ('parusia-productos', 'parusia-galeria', 'parusia-configuracion') and public.es_admin());
