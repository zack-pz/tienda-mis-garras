# AGENTS.md — Monorepo Root

## Project Skills

- `monorepo`: ver `.opencode/skills/monorepo/SKILL.md`
- `api`: ver `.opencode/skills/api/SKILL.md`
- `web`: ver `.opencode/skills/web/SKILL.md`

## Monorepo Conventions

- El package manager principal del repo es `pnpm`.
- `Nx` se usa para orquestar tareas y entender proyectos del monorepo.
- `apps/` contiene aplicaciones ejecutables.
- `libs/` contiene código compartido, contratos, tipos y utilidades reutilizables.
- `libs/` no debe asumirse como conjunto de packages independientes mientras no esté declarado como tal en el workspace.
