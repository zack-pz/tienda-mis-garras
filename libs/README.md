# libs

Estructura base para código compartido.

## Convención actual del proyecto

- El foco de compartición entre API(s) está en **tipos/contratos** para mantener una comunicación clara.
- `libs/shared-types` y `libs/api-contracts` son las carpetas principales para ese objetivo.
- Las demás carpetas quedan preparadas para uso futuro, evitando sobreacoplar lógica de negocio al inicio.

## Estrategia source-first (EP-00)

- Consumir tipos/contratos desde aliases (`@garras/*`) y no con paths relativos frágiles hacia `libs/`.
- Cada librería expone su API pública en `src/index.ts`; los consumers importan desde ese entrypoint.
- En esta etapa NO se requiere build step de `libs/`: las apps resuelven a source (`src/index.ts`) vía aliases/workspace.
