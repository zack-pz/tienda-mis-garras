# Backlog técnico v1

## Sistema autónomo de gestión para tienda de ropa

Documento derivado de `docs/srs.md` para convertir los requerimientos en un plan de implementación realista para el monorepo actual (`apps/api` + `apps/web` + `libs/*`).

---

## 1. Objetivo

Traducir el SRS a un backlog técnico implementable, organizado por:

- épicas funcionales;
- historias de usuario;
- módulos esperados en `apps/api`;
- features y rutas esperadas en `apps/web`;
- contratos o tipos compartidos sugeridos en `libs/`.

---

## 2. Criterios de implementación

### 2.1 Convenciones del monorepo

- `apps/api` contendrá módulos de negocio con arquitectura limpia.
- `apps/web` seguirá organización feature-first.
- `libs/` se usará para contratos, tipos y utilidades compartidas entre API y Web.
- `src/routes` en Web actuará solo como composition root.
- `src/common` en API contendrá infraestructura transversal, no lógica de dominio.

### 2.2 Principios de entrega

- primero seguridad y acceso;
- luego catálogo, inventario y ofertas;
- después ventas y clientes;
- luego proveedores y órdenes de compra;
- finalmente auditoría, reportes y endurecimiento técnico.

### 2.3 Definition of Done mínima

Una historia se considera terminada cuando:

- cumple reglas del SRS;
- expone contrato claro entre frontend y backend cuando aplique;
- incluye validación de entradas;
- devuelve respuestas HTTP predecibles;
- tiene cobertura de pruebas acorde al riesgo;
- queda integrada a la UI o flujo operativo correspondiente.

---

## 3. Mapa objetivo de módulos

| Dominio | API (`apps/api/src/modules`) | Web (`apps/web/src/lib/features`) | Rutas sugeridas (`apps/web/src/routes`) | Compartido (`libs/`) |
| :--- | :--- | :--- | :--- | :--- |
| Autenticación | `auth` | `auth` | `/login` | `libs/api/contracts/auth`, `libs/shared/types/auth` |
| Usuarios | `users` | `users` | `/admin/usuarios` | `libs/api/contracts/users` |
| Catálogo | `catalog` | `catalog` | `/inventario/productos`, `/inventario/categorias` | `libs/api/contracts/catalog` |
| Inventario | `inventory` | `inventory` | `/inventario/movimientos`, `/inventario/stock` | `libs/api/contracts/inventory` |
| Ofertas | `offers` | `offers` | `/inventario/ofertas` | `libs/api/contracts/offers` |
| Clientes | `customers` | `customers` | `/ventas/clientes` | `libs/api/contracts/customers` |
| Ventas | `sales` | `sales` | `/ventas/nueva`, `/ventas/historial` | `libs/api/contracts/sales` |
| Proveedores | `suppliers` | `suppliers` | `/compras/proveedores` | `libs/api/contracts/suppliers` |
| Órdenes de compra | `purchase-orders` | `purchase-orders` | `/compras/ordenes` | `libs/api/contracts/purchase-orders` |
| Auditoría | `audit` | `audit` | `/admin/auditoria` | `libs/api/contracts/audit` |
| Reportes | `reports` | `reports` | `/reportes` | `libs/api/contracts/reports` |

> Nota: hoy `libs/` no está formalizado como workspace package independiente. Por ahora debe verse como carpeta de código compartido del repo, no como package aislado.

---

## 4. Orden recomendado de entrega

### Fase 0 — Fundaciones técnicas

1. bootstrap de API con validación global, manejo de errores y Swagger;
2. shell base del frontend con layout autenticado;
3. contratos compartidos mínimos en `libs/`;
4. estrategia base de sesión y guards por rol.

### Fase 1 — Acceso y seguridad

1. login;
2. expiración por inactividad;
3. administración de usuarios;
4. seed/migración del administrador inicial.

### Fase 2 — Catálogo, inventario y ofertas

1. categorías;
2. productos por variante/SKU;
3. movimientos de inventario;
4. stock bajo;
5. ofertas por producto/categoría.

### Fase 3 — Clientes y ventas

1. alta de clientes;
2. venta con cliente opcional;
3. múltiples pagos exactos;
4. ticket en frontend;
5. cancelación total con restitución de stock.

### Fase 4 — Compras y abastecimiento

1. proveedores;
2. órdenes de compra;
3. recepción de órdenes con impacto en stock.

### Fase 5 — Auditoría, reportes y endurecimiento

1. auditoría de eventos críticos;
2. limpieza automática a 7 días;
3. reportes operativos;
4. pruebas de integración/E2E críticas.

---

## 5. Épicas e historias de usuario

---

## EP-00. Fundaciones técnicas del monorepo

**Objetivo:** dejar lista la base técnica transversal antes de construir negocio.  
**Prioridad:** P0  
**RF relacionados:** RF-19, RF-20, RF-23  
**Módulos:** `auth`, `users`, infraestructura transversal.

### US-0001 — Bootstrap base del backend

**Como** equipo de desarrollo  
**Quiero** un backend con validación global, formato de errores consistente y Swagger  
**Para** poder construir módulos de negocio sobre una base predecible.

**Criterios de aceptación:**

- `apps/api` expone Swagger para los endpoints HTTP.
- Existe validación global de payloads.
- Los errores de validación y autorización tienen formato consistente.

### US-0002 — Shell base del frontend autenticado

**Como** equipo de desarrollo  
**Quiero** un layout base con navegación por rol  
**Para** conectar las futuras pantallas sin duplicar wiring.

**Criterios de aceptación:**

- Existe layout base autenticado en Web.
- La navegación visible cambia según el rol del usuario.
- `src/routes` solo compone vistas desde `src/lib/features`.

### US-0003 — Contratos compartidos iniciales

**Como** equipo de desarrollo  
**Quiero** contratos compartidos para auth, usuarios y respuestas comunes  
**Para** evitar duplicación de tipos entre API y Web.

**Criterios de aceptación:**

- Se definen DTOs o contratos mínimos en `libs/api/contracts`.
- Se definen tipos comunes en `libs/shared/types` cuando aplique.
- Web consume esos contratos como fuente de verdad.

---

## EP-01. Autenticación y sesiones

**Objetivo:** permitir acceso seguro local con control de sesión.  
**Prioridad:** P0  
**RF relacionados:** RF-19, RF-20, RF-22, RF-23  
**API:** `auth`  
**Web:** `auth` / ruta `/login`

### US-0101 — Inicio de sesión local

**Como** usuario del sistema  
**Quiero** iniciar sesión con nombre de usuario y contraseña  
**Para** acceder únicamente a las funciones permitidas por mi rol.

**Criterios de aceptación:**

- El sistema valida credenciales locales.
- Si las credenciales son válidas, se crea sesión autenticada.
- Si son inválidas, se muestra error claro sin exponer detalles internos.

### US-0102 — Expiración automática por inactividad

**Como** dueño del sistema  
**Quiero** que la sesión expire tras 15 minutos de inactividad  
**Para** reducir accesos no autorizados en la computadora local.

**Criterios de aceptación:**

- La sesión expira tras 15 minutos sin actividad.
- El usuario debe autenticarse nuevamente luego de la expiración.
- La expiración aplica de forma consistente en frontend y backend.

### US-0103 — Creación del administrador inicial

**Como** responsable de despliegue  
**Quiero** que la base cree un administrador inicial por migración  
**Para** poder operar el sistema desde la primera instalación.

**Criterios de aceptación:**

- Existe migración/seed para crear el usuario administrador inicial.
- La contraseña inicial es fija según la definición de v1.
- El usuario queda operativo tras ejecutar la migración.

---

## EP-02. Administración de usuarios y roles

**Objetivo:** permitir al Administrador gestionar cuentas locales.  
**Prioridad:** P0  
**RF relacionados:** RF-21, RF-23, RF-26  
**API:** `users`  
**Web:** `users` / ruta `/admin/usuarios`

### US-0201 — Alta de usuarios

**Como** Administrador  
**Quiero** crear usuarios con rol fijo  
**Para** habilitar la operación del sistema por distintas personas.

**Criterios de aceptación:**

- El Administrador puede crear usuarios con rol Administrador, Vendedor o Inventario.
- El nombre de usuario es único.
- El usuario nuevo queda habilitado para iniciar sesión.

### US-0202 — Edición y desactivación de usuarios

**Como** Administrador  
**Quiero** editar o desactivar usuarios  
**Para** mantener control operativo sin eliminar historial.

**Criterios de aceptación:**

- El Administrador puede modificar datos básicos del usuario.
- El Administrador puede desactivar cuentas.
- Una cuenta desactivada no puede volver a iniciar sesión.

### US-0203 — Restricción por rol

**Como** sistema  
**Quiero** aplicar permisos por rol fijo  
**Para** mostrar y permitir solo acciones válidas para cada usuario.

**Criterios de aceptación:**

- Vendedor no puede administrar usuarios ni auditoría.
- Inventario no puede registrar ventas.
- La navegación y los endpoints respetan el rol autenticado.

---

## EP-03. Catálogo y productos vendibles

**Objetivo:** administrar el catálogo como base de ventas e inventario.  
**Prioridad:** P0  
**RF relacionados:** RF-01, RF-02  
**API:** `catalog`  
**Web:** `catalog` / rutas `/inventario/productos`, `/inventario/categorias`

### US-0301 — Gestión de categorías

**Como** usuario de Inventario  
**Quiero** crear y editar categorías  
**Para** organizar correctamente el catálogo.

**Criterios de aceptación:**

- Se pueden crear categorías con nombre y descripción.
- No se permiten nombres duplicados.
- Las categorías pueden usarse al crear productos.

### US-0302 — Alta de producto vendible por variante

**Como** usuario de Inventario  
**Quiero** registrar un producto con talla y color  
**Para** tratar cada combinación vendible como SKU independiente.

**Criterios de aceptación:**

- Cada combinación producto+talla+color genera un SKU único.
- El código del producto se autogenera.
- El producto guarda nombre, categoría, género, precios e imagen opcional.

### US-0303 — Edición de producto y precio

**Como** usuario de Inventario  
**Quiero** editar atributos y precios del producto  
**Para** mantener el catálogo actualizado.

**Criterios de aceptación:**

- Inventario puede modificar precio de compra y precio de venta.
- Los cambios no alteran ventas históricas ya registradas.
- La modificación queda disponible para futuras ventas.

### US-0304 — Consulta de catálogo y stock

**Como** usuario autenticado  
**Quiero** consultar productos por categoría y disponibilidad  
**Para** ubicar rápidamente lo que necesito vender o reponer.

**Criterios de aceptación:**

- Se puede filtrar por categoría.
- Se muestra stock actual del producto vendible.
- La consulta está disponible según la matriz definida en el SRS.

---

## EP-04. Inventario y movimientos

**Objetivo:** controlar existencias con trazabilidad operativa.  
**Prioridad:** P0  
**RF relacionados:** RF-11, RF-14, RF-15, RF-18, RF-28  
**API:** `inventory`  
**Web:** `inventory` / rutas `/inventario/movimientos`, `/inventario/stock`

### US-0401 — Registro manual de movimientos

**Como** usuario de Inventario  
**Quiero** registrar entradas, salidas, ajustes y devoluciones  
**Para** mantener el stock correcto.

**Criterios de aceptación:**

- El sistema soporta tipos ENTRADA, SALIDA, AJUSTE y DEVOLUCIÓN.
- El movimiento guarda usuario, fecha/hora y cantidades antes/después.
- Las entradas manuales requieren motivo obligatorio.

### US-0402 — Actualización automática por venta

**Como** sistema  
**Quiero** disminuir automáticamente el stock al vender  
**Para** evitar desfases entre ventas e inventario.

**Criterios de aceptación:**

- Una venta completada reduce el stock del SKU correcto.
- No se permite vender por encima del stock disponible.
- La actualización ocurre dentro de la misma transacción de negocio.

### US-0403 — Stock bajo

**Como** usuario de Inventario o Administrador  
**Quiero** ver productos con stock bajo  
**Para** priorizar reposición.

**Criterios de aceptación:**

- Existe consulta o reporte de stock bajo.
- El criterio usa el stock mínimo configurado por producto.
- La vista está disponible según el rol definido.

---

## EP-05. Ofertas y reglas de descuento

**Objetivo:** gestionar descuentos sin ambigüedad.  
**Prioridad:** P1  
**RF relacionados:** RF-03, RF-04  
**API:** `offers`  
**Web:** `offers` / ruta `/inventario/ofertas`

### US-0501 — Crear ofertas por producto o categoría

**Como** usuario autorizado  
**Quiero** registrar ofertas por producto o categoría  
**Para** aplicar promociones vigentes.

**Criterios de aceptación:**

- Se pueden crear ofertas con tipo porcentaje o monto fijo.
- La oferta registra fechas de inicio y fin.
- La oferta puede asociarse a productos o categorías.

### US-0502 — Aplicar la mejor oferta disponible

**Como** sistema  
**Quiero** calcular la oferta con mayor descuento final  
**Para** aplicar una sola promoción válida por producto.

**Criterios de aceptación:**

- Si hay varias ofertas aplicables, se calcula el descuento monetario efectivo de cada una.
- Se aplica solo la oferta que mayor descuento produce.
- La venta conserva el descuento histórico aplicado.

---

## EP-06. Clientes e historial

**Objetivo:** permitir asociar ventas a clientes sin hacerlos obligatorios.  
**Prioridad:** P1  
**RF relacionados:** RF-05, RF-06, RF-28  
**API:** `customers`  
**Web:** `customers` / ruta `/ventas/clientes`

### US-0601 — Alta de clientes

**Como** Vendedor  
**Quiero** registrar clientes  
**Para** asociarlos a futuras ventas y consultar su historial.

**Criterios de aceptación:**

- Se pueden capturar nombre, teléfono, correo, dirección y notas.
- El cliente queda disponible inmediatamente para selección en ventas.
- El sistema permite omitir el cliente y completar igual la venta.

### US-0602 — Historial de compras por cliente

**Como** usuario autorizado  
**Quiero** consultar compras históricas de un cliente  
**Para** revisar su comportamiento de compra.

**Criterios de aceptación:**

- La consulta muestra folio, fecha, total y método de pago.
- Solo usuarios habilitados por rol acceden a la vista.
- Las ventas canceladas se distinguen del resto.

---

## EP-07. Ventas, pagos y ticket

**Objetivo:** operar la caja con precisión y trazabilidad.  
**Prioridad:** P0  
**RF relacionados:** RF-06, RF-07, RF-08, RF-09, RF-10, RF-12, RF-13  
**API:** `sales`  
**Web:** `sales` / rutas `/ventas/nueva`, `/ventas/historial`

### US-0701 — Registrar venta con cliente opcional

**Como** Vendedor  
**Quiero** registrar una venta seleccionando productos y cantidades  
**Para** concretar la operación de mostrador.

**Criterios de aceptación:**

- La venta genera folio único.
- El cliente es opcional.
- La venta guarda subtotal, impuesto, descuento total y total final.

### US-0702 — Registrar múltiples pagos exactos

**Como** Vendedor  
**Quiero** registrar uno o varios pagos por venta  
**Para** completar cobros mixtos sin errores.

**Criterios de aceptación:**

- Se permiten pagos de tipo efectivo, tarjeta y transferencia.
- La suma de pagos debe ser exactamente igual al total de la venta.
- No se permite vuelto ni exceso de cobro en v1.

### US-0703 — Visualizar ticket de venta

**Como** Vendedor  
**Quiero** ver el ticket en pantalla al finalizar la venta  
**Para** confirmar el detalle cobrado.

**Criterios de aceptación:**

- El ticket muestra folio, fecha/hora, vendedor, productos, cantidades, descuentos, pagos y total.
- El ticket se visualiza en frontend sin impresión física.
- El formato es legible para revisión operativa.

### US-0704 — Cancelación total de venta

**Como** usuario autorizado  
**Quiero** cancelar una venta completa  
**Para** corregir operaciones cerradas incorrectamente.

**Criterios de aceptación:**

- La venta cambia a estado CANCELADA.
- El stock se repone automáticamente.
- Los pagos asociados se conservan para trazabilidad.

---

## EP-08. Proveedores y órdenes de compra

**Objetivo:** soportar abastecimiento básico para reposición.  
**Prioridad:** P1  
**RF relacionados:** RF-16, RF-17, RF-18  
**API:** `suppliers`, `purchase-orders`  
**Web:** `suppliers`, `purchase-orders` / rutas `/compras/proveedores`, `/compras/ordenes`

### US-0801 — Gestión de proveedores

**Como** usuario de Inventario  
**Quiero** registrar y consultar proveedores  
**Para** relacionarlos con productos y compras.

**Criterios de aceptación:**

- Se guardan nombre, contacto, teléfono, correo, dirección y notas.
- Se puede relacionar proveedor con productos suministrados.
- La consulta está disponible para Inventario y Administrador.

### US-0802 — Crear orden de compra

**Como** usuario de Inventario  
**Quiero** generar órdenes de compra  
**Para** formalizar reposiciones.

**Criterios de aceptación:**

- La orden se asocia a un proveedor.
- La orden tiene detalle de productos, cantidades y precios.
- La orden inicia en estado PENDIENTE.

### US-0803 — Recepción de orden de compra

**Como** usuario de Inventario  
**Quiero** marcar una orden como recibida  
**Para** incrementar automáticamente el stock.

**Criterios de aceptación:**

- Al recibir la orden, el stock aumenta automáticamente.
- Se registra un movimiento de inventario tipo ENTRADA.
- La orden actualiza su estado a RECIBIDA.

---

## EP-09. Auditoría y reportes

**Objetivo:** asegurar trazabilidad y visibilidad operativa.  
**Prioridad:** P1  
**RF relacionados:** RF-24, RF-25, RF-26, RF-27, RF-28  
**API:** `audit`, `reports`  
**Web:** `audit`, `reports` / rutas `/admin/auditoria`, `/reportes`

### US-0901 — Registrar eventos críticos

**Como** Administrador  
**Quiero** que el sistema audite eventos críticos  
**Para** poder revisar quién hizo qué y cuándo.

**Criterios de aceptación:**

- Se registran venta, ajuste de inventario, cambio de precio, creación de usuario y cancelación de venta.
- Cada evento guarda usuario, acción, entidad afectada, registro y fecha/hora.
- El log queda disponible para consulta posterior.

### US-0902 — Retención semanal del log

**Como** sistema  
**Quiero** eliminar automáticamente logs con más de 7 días  
**Para** respetar la política definida para v1.

**Criterios de aceptación:**

- El sistema conserva solo una semana de auditoría.
- Existe limpieza automática de registros antiguos.
- La política se ejecuta sin intervención manual diaria.

### US-0903 — Reportes operativos básicos

**Como** Administrador  
**Quiero** ver reportes operativos clave  
**Para** entender el desempeño de la tienda.

**Criterios de aceptación:**

- Existen reportes de ventas diarias, productos más vendidos, ventas por vendedor y stock bajo.
- Los reportes usan datos consistentes con ventas e inventario.
- La UI permite filtrar o consultar de forma simple según el caso.

---

## 6. Backlog técnico complementario

Estos ítems no necesariamente se expresan como historias de negocio, pero son parte del trabajo real.

### 6.1 API

- configurar `ValidationPipe` global;
- agregar Swagger en `main.ts`;
- definir guards por autenticación y rol;
- mapear errores de dominio a HTTP predecible;
- separar schemas Drizzle actuales hacia módulos de negocio progresivamente;
- crear repositorios por módulo en lugar de consumir Drizzle de forma directa desde controllers.

### 6.2 Web

- crear layout autenticado con navegación por rol;
- crear capa de servicios por feature;
- usar Zod para formularios y validación;
- usar TanStack Form en flujos con alto input del usuario;
- mantener `routes` delgadas y delegar lógica a `src/lib/features/*`.

### 6.3 Compartido

- consolidar contratos request/response por dominio en `libs/api/contracts`;
- consolidar tipos transversales en `libs/shared/types`;
- evitar lógica de negocio en `libs/` mientras no exista necesidad real cross-app.

---

## 7. Dependencias clave entre épicas

- EP-00 desbloquea a todas las demás.
- EP-01 desbloquea EP-02 a EP-09.
- EP-03 desbloquea EP-04, EP-05 y EP-07.
- EP-04 desbloquea reglas de ventas consistentes en EP-07.
- EP-06 aporta contexto opcional a EP-07.
- EP-08 alimenta reposición y movimientos de EP-04.
- EP-09 depende de eventos producidos por EP-02, EP-03, EP-04 y EP-07.

---

## 8. Corte recomendado para MVP real

Si hubiese que hacer un MVP usable sin sobrecargar el alcance, el corte razonable sería:

1. EP-00 Fundaciones técnicas.
2. EP-01 Autenticación y sesiones.
3. EP-02 Administración de usuarios.
4. EP-03 Catálogo y productos vendibles.
5. EP-04 Inventario y movimientos.
6. EP-07 Ventas, pagos y ticket.
7. EP-09 Auditoría mínima de venta y cancelación.

Las ofertas, clientes avanzados, proveedores, órdenes y reportes completos pueden entrar en una segunda iteración sin romper el flujo principal del negocio.
