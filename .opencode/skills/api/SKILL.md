---
name: api
description: >
  Convenciones del backend API en apps/api con NestJS, arquitectura limpia por módulos,
  carpeta common para infraestructura transversal, Drizzle ORM, Swagger y códigos HTTP predecibles.
license: Apache-2.0
metadata:
  author: gentleman-programming
  version: "1.0"
---

# API Skill — `apps/api`

Guía para trabajar en `apps/api` usando **NestJS** como framework principal, **Drizzle ORM** para persistencia y una estructura separada entre `modules` y `common`.

## Objetivo

- Mantener una arquitectura escalable y predecible.
- Separar negocio por módulos de dominio.
- Centralizar infraestructura transversal en `common`.
- Documentar las APIs con Swagger.
- Devolver códigos HTTP consistentes y predecibles.

## Estructura base

```tree
apps/api/src/
├ common/
│ ├ config/
│ ├ database/
│ ├ decorators/
│ ├ dto/
│ ├ exceptions/
│ ├ filters/
│ ├ guards/
│ ├ interceptors/
│ ├ pipes/
│ ├ types/
│ └ utils/
├ modules/
│ └ <module-name>/
│   ├ application/
│   │ ├ dto/
│   │ ├ ports/
│   │ └ use-cases/
│   ├ domain/
│   │ ├ entities/
│   │ ├ value-objects/
│   │ ├ services/
│   │ └ errors/
│   ├ infrastructure/
│   │ ├ http/
│   │ │ ├ controllers/
│   │ │ └ presenters/
│   │ ├ persistence/
│   │ │ ├ drizzle/
│   │ │ │ ├ repositories/
│   │ │ │ ├ schemas/
│   │ │ │ └ mappers/
│   │ └ providers/
│   ├ <module-name>.module.ts
│   └ index.ts
├ app.module.ts
└ main.ts
```

## Regla de arquitectura

### `modules/`

Cada carpeta dentro de `modules` representa un **bounded context funcional** o una feature de negocio.

Ejemplos:
- `users`
- `auth`
- `catalog`
- `orders`

Dentro de cada módulo se aplica **arquitectura limpia**:

- **domain**: reglas de negocio puras, sin NestJS ni Drizzle.
- **application**: casos de uso, puertos, contratos y DTOs de aplicación.
- **infrastructure**: controladores HTTP, repositorios con Drizzle, mappers y adapters.

### `common/`

`common` NO es un basurero de helpers. Esto es FUNDAMENTAL.

`common` solo contiene piezas **transversales** que sirven a toda la aplicación:

- configuración
- bootstrap global
- conexión a base de datos
- filtros de excepción
- interceptores
- guards
- pipes
- utilidades realmente compartidas
- tipos y DTOs genéricos de infraestructura

Lo que tenga reglas de negocio o pertenezca a un dominio específico debe vivir en `modules/<module-name>`.

## NestJS como default

Usar librerías oficiales de NestJS para la mayoría de los casos:

- `@nestjs/common`
- `@nestjs/core`
- `@nestjs/config`
- `@nestjs/swagger`
- `@nestjs/testing`
- guards, interceptors, pipes, filters y decorators propios del ecosistema Nest

No reinventar wiring que Nest ya resuelve bien.

## Persistencia con Drizzle

- Drizzle es el ORM oficial del proyecto.
- Los schemas y repositories de base de datos viven dentro del módulo correspondiente.
- La inicialización de conexión, cliente y utilidades compartidas puede vivir en `common/database`.
- No filtrar objetos crudos de Drizzle hacia la capa de dominio.
- Usar mappers entre persistence models y entidades/value objects del dominio.

### Regla de dependencia

- `domain` no depende de NestJS.
- `domain` no depende de Drizzle.
- `application` no depende de frameworks concretos.
- `infrastructure` adapta NestJS, Drizzle, HTTP y providers externos al dominio.

## Controladores HTTP

- Los controllers viven en `modules/<module>/infrastructure/http/controllers`.
- Los controllers deben ser finos: reciben request, validan entrada, llaman caso de uso y transforman respuesta.
- No meter lógica de negocio en controllers.
- No acceder a Drizzle directamente desde controllers.

## Validación

- Toda entrada externa debe validarse.
- Preferir pipes/DTOs bien definidos por endpoint.
- La validación global debe configurarse en `main.ts`.
- Si se usa transformación de payloads, debe ser explícita y consistente.

## Swagger obligatorio

Toda API HTTP expuesta debe documentarse con **Swagger de NestJS**.

Mínimo esperado:
- bootstrap de Swagger en `main.ts`
- tags por módulo
- summary y description en endpoints importantes
- request DTOs documentados
- response DTOs documentados
- errores esperables documentados cuando aplique

Usar decorators del ecosistema oficial:
- `@ApiTags`
- `@ApiOperation`
- `@ApiResponse`
- `@ApiCreatedResponse`
- `@ApiBadRequestResponse`
- `@ApiUnauthorizedResponse`
- etc.

## Códigos HTTP predecibles

La API debe devolver códigos consistentes según semántica HTTP. Nada de improvisar `200` para todo.

Guía base:

- `200` → lectura/actualización exitosa con body
- `201` → creación exitosa
- `202` → procesamiento asíncrono aceptado
- `204` → eliminación o éxito sin body
- `400` → request inválido
- `401` → no autenticado
- `403` → autenticado pero sin permisos
- `404` → recurso inexistente
- `409` → conflicto de negocio o unicidad
- `422` → regla de negocio inválida si deciden diferenciarla de `400`
- `500` → error inesperado

Además:
- Definir un formato de error consistente.
- Centralizar errores HTTP repetibles con exception filters/adapters.
- No exponer errores internos de base de datos al cliente.

## App bootstrap recomendado

En `main.ts` debería existir, como base:

- `ValidationPipe` global
- Swagger bootstrap
- prefijo global si la API lo necesita (por ejemplo `/api`)
- CORS si aplica
- filtros/interceptores globales si fueron definidos

## Convenciones de naming

- Carpetas de módulos en plural o singular, pero UNA convención y siempre la misma.
- Casos de uso nombrados por intención: `create-user.use-case.ts`, `list-orders.use-case.ts`.
- Repositorios por capacidad: `users.repository.ts`.
- Controllers por recurso HTTP: `users.controller.ts`.
- No usar nombres genéricos como `manager`, `helper`, `processor`, `util` si no describen responsabilidad.

## Testing

- Unit tests en `domain` y `application` sin infraestructura real.
- Integration tests para repositories/adapters.
- E2E para flujos HTTP críticos.
- Los tests deben acompañar la arquitectura, no romperla.

## Regla práctica para cambios

Cuando agregues una feature nueva:

1. Crear módulo en `src/modules/<feature>`.
2. Modelar dominio y casos de uso.
3. Implementar repositorios/adapters en infraestructura.
4. Exponer controller NestJS.
5. Documentar endpoint con Swagger.
6. Asegurar códigos HTTP y errores predecibles.

## Anti-patrones prohibidos

- lógica de negocio en controllers
- queries SQL/Drizzle repartidas fuera de repositories
- `common` usado como cajón de sastre
- dominio acoplado a decorators de NestJS
- responses no documentadas
- errores improvisados sin contrato claro
