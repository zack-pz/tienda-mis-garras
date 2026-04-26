---
name: monorepo
description: >
  Convenciones para trabajar en este monorepo con Nx y pnpm, incluyendo cómo ejecutar tareas,
  cómo entender apps versus libs y cuál es el propósito real de la carpeta libs en la raíz.
license: Apache-2.0
metadata:
  author: gentleman-programming
  version: "1.0"
---

# Monorepo Skill — Nx + pnpm

Guía para trabajar en este proyecto como **monorepo**, usando **Nx** para orquestación y **pnpm** como package manager principal.

## When to Use

- Cuando agregues una app nueva dentro de `apps/`
- Cuando necesites correr tareas por proyecto con Nx
- Cuando quieras entender dónde vive el código compartido
- Cuando tengas dudas sobre la diferencia entre `apps` y `libs`
- Cuando modifiques dependencias, scripts o estructura de workspace

## Qué hay en este repo realmente

La raíz del proyecto usa:

- **pnpm** como package manager (`packageManager: pnpm@10.18.3`)
- **Nx** como orquestador (`nx`, `graph`, `affected`)
- `pnpm-workspace.yaml` con `apps/*`
- `nx.json` con plugin `nx/plugins/package-json`

### Implicación práctica

Este monorepo, HOY, detecta proyectos principalmente a partir de `package.json`.

Eso significa:

- `apps/api` y `apps/web` son proyectos claros del workspace
- `libs/` NO está configurado todavía como workspace package independiente en `pnpm-workspace.yaml`
- `libs/` tampoco tiene `project.json` en los paths inspeccionados

Entonces, por ahora, `libs/` debe entenderse como **espacio de código compartido del repositorio**, no necesariamente como paquetes publicables ni como proyectos Nx aislados.

## Regla principal del monorepo

- **`apps/` contiene aplicaciones ejecutables**
- **`libs/` contiene código compartido reusable**

Es así de simple.

Si algo se puede desplegar, correr o servir por sí mismo, va a `apps/`.
Si algo existe para ser reutilizado por varias apps, va a `libs/`.

## Propósito de `libs/`

La carpeta `libs/` en la raíz existe para alojar **código transversal y contratos compartidos** entre aplicaciones.

### Convención observada hoy

Según `libs/README.md`, el foco actual está en:

- `libs/shared/types`
- `libs/api/contracts`

Además existen carpetas preparadas para crecer:

- `libs/shared/config`
- `libs/shared/constants`
- `libs/shared/utils`
- `libs/api/clients`

### Qué debería vivir en `libs/`

Buen uso de `libs/`:

- tipos compartidos
- contratos entre frontend y backend
- clientes de API reutilizables
- constantes cross-app
- utilidades puras sin acoplamiento fuerte a una app concreta
- configuración reusable entre apps

Mal uso de `libs/`:

- lógica de negocio específica de una sola app
- controladores NestJS de un módulo concreto
- páginas/layouts de SvelteKit
- código que solo existe para una app pero se mete en `libs` “por orden”

No conviertas `libs` en un depósito de cosas “porque suenan compartibles”. Si solo lo usa una app, probablemente NO pertenece ahí.

## Cómo pensar Nx en este repo

Nx no es el package manager. Nx **orquesta tareas** sobre proyectos.

pnpm instala dependencias.
Nx entiende proyectos y ejecuta tareas con contexto.

### Comandos raíz útiles

Desde la raíz:

```bash
pnpm nx graph
pnpm nx affected
pnpm nx <target> <project>
```

También existen scripts raíz:

```bash
pnpm nx
pnpm graph
pnpm affected
```

## Cómo ejecutar tareas correctamente

### Opción recomendada: desde la raíz con Nx

Usar Nx desde la raíz cuando quieras operar por proyecto dentro del monorepo.

Ejemplos conceptuales:

```bash
pnpm nx run api:start:dev
pnpm nx run web:lint
pnpm nx run web:test
```

### Opción secundaria: entrar al package y usar sus scripts

También puede usarse el `package.json` de cada app directamente cuando el contexto sea local a esa app.

Ejemplos conceptuales:

```bash
pnpm --dir apps/api start:dev
pnpm --dir apps/web lint
```

### Tradeoff

- **Nx desde raíz**: mejor visibilidad de monorepo, afectación y escalabilidad
- **script local por app**: más directo para trabajo puntual

Si el trabajo afecta arquitectura del repo, dependencias cruzadas o múltiples apps, preferí Nx.

## Cómo agregar dependencias

### Dependencia para una app específica

Agregarla en el `package.json` de esa app.

Ejemplo mental:
- algo solo para `apps/api` → instalar en `apps/api`
- algo solo para `apps/web` → instalar en `apps/web`

### Dependencia compartida de tooling del monorepo

Si la usa todo el repo, va a la raíz.

Ejemplos:
- Nx
- tooling global de workspace
- scripts infra compartidos

### Dependencia para `libs/`

Acá hay que pensar bien: como `libs/` no está declarado hoy como workspace package independiente, evitá asumir instalación aislada por librería.

Si una lib necesita una dependencia:
- o la resuelve la app consumidora
- o más adelante se formaliza esa lib como package/workspace real

## Cómo crear código nuevo

### Nueva aplicación

Va en `apps/<nombre-app>`.

### Nuevo código compartido

Va en `libs/...`, pero SOLO si cumple una de estas:

- lo usan dos o más apps
- define un contrato cross-app
- es infraestructura reusable de verdad

### Regla anti-humo

No muevas algo a `libs/` solo porque “algún día” podría compartirse.
Primero demostrá la necesidad real.

## Estado actual de detección de proyectos

Según lo verificado:

- `pnpm-workspace.yaml` incluye solo `apps/*`
- `nx.json` usa `nx/plugins/package-json`
- no se encontraron `project.json` definidos en el repo inspeccionado

Entonces, si querés que `libs/` tenga más protagonismo como unidad de Nx/pnpm, hay alternativas:

### Alternativa A — Mantener `libs/` como carpeta compartida simple

**Ventajas**:
- menos complejidad
- más rápido para arrancar

**Desventajas**:
- menos aislamiento
- menos claridad de ownership/targets
- menos capacidades de orquestación fina con Nx

### Alternativa B — Convertir partes de `libs/` en packages/proyectos reales

Para eso habría que:

- incluir `libs/*` o paths más finos en `pnpm-workspace.yaml`
- agregar `package.json` por lib y/o `project.json`
- definir targets y ownership más explícitos

**Ventajas**:
- mejor modularidad
- mejor escalado del monorepo
- contratos de dependencia más claros

**Desventajas**:
- más setup
- más disciplina estructural

## Convención recomendada para este repo

Mientras el repo siga como está:

- usar `apps/` para apps ejecutables
- usar `libs/` para tipos, contratos, config y utilidades compartidas
- no tratar `libs/` como si ya fueran packages independientes
- correr tareas de monorepo preferentemente con Nx desde la raíz
- manejar dependencias con pnpm respetando el scope real de cada app

## Anti-patrones prohibidos

- instalar cosas en raíz que solo usa una app
- meter lógica específica de una app en `libs/`
- asumir que `libs/` ya es un workspace package si no está declarado
- duplicar tipos/contratos entre `apps/web` y `apps/api` cuando deberían vivir en `libs/`
- usar Nx y pnpm como si fueran lo mismo
