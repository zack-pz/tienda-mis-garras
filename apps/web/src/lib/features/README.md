# Features

Arquitectura modular basada en features.

## Regla principal

- Cada feature agrupa su UI, schemas, estado, servicios y código server-side.
- `src/routes` solo compone rutas, page options, loads y actions importando desde acá.

## Estructura sugerida por feature

```tree
src/lib/features/
└ example-feature/
  ├ components/
  ├ schemas/
  ├ services/
  ├ server/
  ├ state/
  └ index.ts
```

## Convención

- Crear una carpeta por feature.
- Exportar la API pública de cada feature desde su `index.ts`.
- No compartir lógica de negocio desde `src/routes`.
