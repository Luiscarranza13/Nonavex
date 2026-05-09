# Parusia

Aplicacion Next.js para la landing publica de Parusia y un panel administrativo conectado a Supabase.

## Scripts

```bash
npm run dev        # desarrollo con webpack
npm run dev:turbo  # desarrollo con Turbopack
npm run build      # build de produccion
npm run lint       # ESLint
npm run test:admin # prueba modular del panel admin
```

## Configuracion

1. Copia `.env.example` a `.env`.
2. Completa:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `NEXT_PUBLIC_SITE_URL`
3. Aplica `supabase/schema.sql` en tu proyecto Supabase.
4. Crea un usuario con perfil `admin` activo para entrar al panel.

## Rutas principales

- `/`: landing publica con producto destacado, beneficios, galeria, FAQ y contacto.
- `/login`: acceso al panel administrativo.
- `/admin/dashboard`: metricas, ventas recientes y alertas de stock.
- `/admin/producto`, `/admin/inventario`, `/admin/ventas`, `/admin/reportes`, `/admin/configuracion`, `/admin/usuarios`: modulos operativos.
- `/api/admin/productos/imagen`: subida controlada de imagenes de producto.
- `/api/admin/usuarios`: creacion de usuarios desde el panel.

## Seguridad aplicada

- El layout admin valida sesion y rol `admin` en servidor antes de renderizar.
- Las APIs admin reutilizan la misma autorizacion server-side.
- La subida de imagenes limita tamano a 5 MB y formatos a JPG, PNG, WEBP o SVG.
- `robots.txt` bloquea `/admin/` y `/api/`.
