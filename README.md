# Tienda Mis Garras

Monorepo con `apps/api` (NestJS) y `apps/web` (SvelteKit), orquestado con Nx y `pnpm`.

## Variables de entorno

Este repo usa un único archivo `.env` en la raíz para compartir configuración entre `api` y `web`.

### Primer arranque

```bash
cp .env.example .env
```

Después ajustá los valores según tu entorno local.

### Reglas importantes

- `.env` **no se sube** al repositorio.
- `.env.example` **sí se versiona** como plantilla de onboarding.
- Variables expuestas al frontend deben empezar con `PUBLIC_`.
- Secretos como `DATABASE_URL` o `DB_PASSWORD` deben permanecer del lado servidor.

## Desarrollo

Instalar dependencias:

```bash
pnpm install
```

Levantar `api` y `web` juntos desde la raíz:

```bash
pnpm dev
```

## Apps

- `apps/api` — API en NestJS
- `apps/web` — frontend en SvelteKit
