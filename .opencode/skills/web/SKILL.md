---
name: web
description: >
  Convenciones del frontend web en apps/web con SvelteKit, arquitectura modular por features,
  shadcn-svelte, Tailwind, Zod y TanStack Form. Trigger: cuando el AI cree, edite o analice
  páginas, layouts, componentes, formularios o estructura dentro de apps/web.
license: Apache-2.0
metadata:
  author: gentleman-programming
  version: "1.0"
---

## When to Use

- Cuando trabajes dentro de `apps/web`
- Cuando implementes rutas, layouts o páginas en SvelteKit
- Cuando agregues componentes UI o features nuevas
- Cuando diseñes formularios, validaciones o flujos CSR/SSR/prerender

## Critical Patterns

### 1. Arquitectura modular por features

- Organizar el dominio por features, no por tipo de archivo.
- Ubicar la implementación reutilizable dentro de `src/lib/features/*`.
- Mantener `src/routes` como capa de entrada del router: define ruta, page options, loads y acciones.
- No meter lógica de negocio ni componentes complejos dentro de `src/routes`; las rutas importan desde los features.

### 2. Estructura recomendada

```tree
src/
├ lib/
│ ├ features/
│ │ └ checkout/
│ │   ├ components/
│ │   ├ schemas/
│ │   ├ services/
│ │   ├ server/
│ │   ├ state/
│ │   └ index.ts
│ ├ ui/
│ └ utils/
└ routes/
  └ checkout/
    ├ +page.svelte
    ├ +page.ts
    └ +page.server.ts
```

### 3. Rutas livianas

- `+page.svelte`, `+layout.svelte`, `+page.ts` y `+page.server.ts` deben actuar como composition root de la ruta.
- La ruta importa vistas, loaders, schemas o actions desde `src/lib/features/...`.
- Si una pieza solo vive en una ruta puntual y no se reutiliza, puede coexistir cerca de la ruta, pero la preferencia sigue siendo feature-first.

### 4. UI por defecto

- Usar `shadcn-svelte` como librería base de componentes.
- Estilar con Tailwind CSS.
- Reutilizar y extender componentes en `src/lib/ui` antes de crear UI ad-hoc.

### 5. Estrategia de renderizado

- Por defecto, aprovechar el comportamiento híbrido de SvelteKit.
- Elegir `SSR`, `CSR` o `prerender` según necesidad de negocio:
  - `SSR`: SEO, datos por request, auth, contenido dinámico.
  - `CSR`: dashboards, interacciones intensivas, páginas que dependen fuerte del browser.
  - `prerender`: marketing, landings, contenido estático o casi estático.
- Declarar la estrategia por ruta con `+page.ts`, `+page.server.ts` o layouts compartidos.
- No desactivar `ssr` porque sí; solo cuando el problema realmente sea browser-only.

### 6. Formularios

- Todos los formularios usan `Zod` para validar contratos de datos.
- Formularios CSR usan `@tanstack/svelte-form` como solución por defecto.
- Formularios server-driven pueden usar actions de SvelteKit, pero igual deben validar con Zod.
- No mezclar validaciones dispersas en inputs, stores y handlers; el schema es la fuente de verdad.

### 7. Server boundaries

- Código sensible o dependiente del servidor va en `src/lib/server` o `src/lib/features/**/server`.
- Nunca importar server-only modules desde componentes cliente.

## Decision Guide

| Necesidad | Solución recomendada |
| --- | --- |
| Página pública con SEO | SSR o prerender |
| Dashboard interno con mucha interacción | CSR |
| Formulario CSR | TanStack Form + Zod |
| Formulario submit tradicional | SvelteKit actions + Zod |
| UI base | shadcn-svelte + Tailwind |
| Reutilización de negocio/UI | `src/lib/features/*` |
| Archivo en `routes` | Solo wiring de ruta |

## Code Examples

### Ruta que solo compone

```ts
// src/routes/checkout/+page.ts
export { load, ssr } from '$lib/features/checkout';
```

```svelte
<!-- src/routes/checkout/+page.svelte -->
<script lang="ts">
	import CheckoutPage from '$lib/features/checkout/components/checkout-page.svelte';
</script>

<CheckoutPage />
```

### Schema con Zod

```ts
// src/lib/features/checkout/schemas/checkout.schema.ts
import { z } from 'zod';

export const checkoutSchema = z.object({
	email: z.email(),
	name: z.string().min(2)
});
```

### Page options para CSR

```ts
// src/routes/account/+page.ts
export const ssr = false;
export const csr = true;
```

### Page options para prerender

```ts
// src/routes/about/+page.ts
export const prerender = true;
```

## Commands

```bash
bun add @tanstack/svelte-form zod
bunx shadcn-svelte@latest add button input form
bun run check
```

## Resources

- **Skill file**: `./SKILL.md`
