# Nonavex

Repositorio de la app comercial y administrativa de Parusia, detergente de Novanex.

La aplicacion principal esta en [`parusia`](./parusia). Desde la raiz puedes usar:

```bash
npm run dev
npm run build
npm run lint
```

## Estructura

- `parusia/src/app`: rutas publicas, panel admin y APIs internas.
- `parusia/src/components`: UI publica, componentes admin y shadcn/ui.
- `parusia/src/lib`: clientes Supabase, autorizacion y utilidades compartidas.
- `parusia/supabase/schema.sql`: esquema base de datos.

## Variables

Copia `parusia/.env.example` a `parusia/.env` y completa Supabase antes de usar el panel admin o las APIs.
