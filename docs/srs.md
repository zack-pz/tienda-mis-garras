# Especificación de Requerimientos de Software (ERS / SRS)

## Sistema autónomo de gestión para tienda de ropa

**Estándar de referencia:** IEEE 830-1998  
**Versión del documento:** 1.0  
**Idioma del sistema:** Español

---

## 1. Introducción

### 1.1 Propósito

Este documento define los requerimientos funcionales y no funcionales del sistema autónomo de gestión para una tienda de ropa. Su objetivo es servir como base de comunicación entre las partes interesadas y el equipo de desarrollo, estableciendo con claridad el alcance de la primera versión del sistema.

### 1.2 Alcance

El sistema permitirá operar una tienda de ropa desde una sola computadora física, mediante una arquitectura compuesta por un frontend web y un backend API separados, ambos ejecutándose localmente en la misma máquina.

La primera versión incluye:

- autenticación local de usuarios;
- gestión de productos, categorías, precios, tallas y colores;
- control de inventario por producto vendible;
- registro de clientes e historial de compras;
- gestión de ventas con múltiples pagos;
- gestión de ofertas;
- gestión de proveedores y órdenes de compra;
- reportes operativos básicos;
- auditoría de eventos críticos.

La primera versión **no** incluye:

- tienda en línea o e-commerce;
- operación en múltiples computadoras o terminales;
- acceso por red local o Internet;
- impresión física de tickets;
- devoluciones parciales de ventas;
- recuperación de contraseña;
- respaldos automáticos o restauración de datos;
- integración con periféricos externos.

### 1.3 Definiciones, acrónimos y abreviaciones

- **API:** interfaz de programación usada por el frontend para comunicarse con el backend.
- **BD:** base de datos.
- **Frontend:** aplicación web usada por el personal de la tienda.
- **Backend:** servicio local responsable de reglas de negocio, persistencia y seguridad.
- **Localhost:** ejecución local dentro de la misma computadora, sin acceso remoto.
- **SKU:** identificador único de un producto vendible.
- **Producto vendible:** combinación específica de producto, talla y color con código y stock propios.
- **Oferta mayor:** oferta única que genera el mayor descuento monetario final sobre el precio del producto.

### 1.4 Referencias

- IEEE 830-1998 - Recommended Practice for Software Requirements Specifications.

### 1.5 Visión general del documento

El documento se divide en cuatro secciones principales:

1. Introducción.
2. Descripción general del sistema.
3. Requerimientos específicos.
4. Índice resumido de requerimientos.

---

## 2. Descripción general

### 2.1 Perspectiva del producto

El sistema será una solución local compuesta por:

- un **frontend web** para la interacción del usuario;
- un **backend API** para lógica de negocio y seguridad;
- una **base de datos PostgreSQL local** para persistencia.

Los tres componentes se ejecutarán en una sola computadora física. El sistema funcionará sin dependencia de servicios en la nube y sin necesidad de conexión a Internet para su operación principal.

### 2.2 Funcionalidad general del producto

El sistema deberá proporcionar, como mínimo, las siguientes capacidades:

- inicio de sesión con usuario y contraseña;
- administración de usuarios con roles fijos;
- alta y edición de productos, categorías, precios y atributos comerciales;
- control de inventario con movimientos de entrada, salida, ajuste y devolución;
- registro de ventas con uno o varios pagos;
- registro opcional de clientes y consulta de su historial;
- registro y aplicación de ofertas por producto o categoría;
- gestión de proveedores y órdenes de compra;
- visualización de ticket de venta en pantalla;
- generación de reportes operativos;
- auditoría de acciones críticas.

### 2.3 Características de los usuarios y roles del sistema

La primera versión manejará tres roles fijos. No se contempla aún un sistema de permisos granulares configurable.

#### 2.3.1 Administrador

Usuario con acceso total al sistema.

**Responsabilidades y permisos:**

- crear, modificar o desactivar usuarios;
- consultar el log de auditoría;
- realizar cualquier operación permitida a Vendedor o Inventario.

#### 2.3.2 Vendedor

Usuario orientado a la operación de punto de venta.

**Responsabilidades y permisos:**

- registrar ventas;
- buscar productos y consultar stock disponible;
- visualizar ofertas activas;
- registrar clientes opcionalmente y vincularlos a una venta;
- visualizar el ticket de la venta actual;
- consultar sus ventas registradas.

**Restricciones:**

- no puede administrar usuarios;
- no puede consultar el log de auditoría;
- no puede gestionar órdenes de compra ni proveedores.

#### 2.3.3 Inventario

Usuario orientado a la gestión de catálogo, stock y abastecimiento.

**Responsabilidades y permisos:**

- agregar, editar y categorizar productos;
- modificar precios de compra y venta;
- consultar stock;
- registrar movimientos de inventario;
- registrar proveedores;
- crear y consultar órdenes de compra;
- registrar entradas manuales de mercancía con motivo obligatorio.

**Restricciones:**

- no puede cobrar ni registrar ventas;
- no puede administrar usuarios;
- no puede consultar el log de auditoría.

#### 2.3.4 Matriz resumida de consultas por rol

| Consulta / vista | Administrador | Vendedor | Inventario |
| :--- | :---: | :---: | :---: |
| Stock y catálogo | Sí | Sí | Sí |
| Ofertas activas | Sí | Sí | Sí |
| Ticket actual | Sí | Sí | No |
| Historial de cliente | Sí | Sí | No |
| Ventas propias | Sí | Sí | No |
| Ventas diarias | Sí | No | No |
| Productos más vendidos | Sí | No | No |
| Ventas por vendedor | Sí | No | No |
| Stock bajo | Sí | No | Sí |
| Proveedores y órdenes de compra | Sí | No | Sí |
| Log de auditoría | Sí | No | No |

### 2.4 Restricciones generales

- El sistema deberá ejecutarse **solo en localhost**.
- El sistema deberá operar en **una sola computadora física**.
- La base de datos oficial de la primera versión será **PostgreSQL local**.
- El sistema no deberá depender de servicios externos para su operación principal.
- El sistema deberá funcionar en **Windows y Linux** a través de un navegador web moderno.
- No se implementará soporte para múltiples terminales o acceso remoto en esta versión.
- No se implementarán respaldos automáticos ni restauración en esta versión.
- No se integrarán periféricos externos en esta versión.

### 2.5 Suposiciones y dependencias

- La computadora anfitriona contará con recursos suficientes para ejecutar frontend, backend y PostgreSQL localmente.
- El reloj del sistema deberá estar correctamente configurado para registrar fechas y horas confiables.
- La migración inicial de base de datos deberá crear el usuario administrador inicial con una contraseña fija.
- El sistema será usado principalmente por un operador activo a la vez, aunque podrá tolerar varias sesiones locales de navegador abiertas en la misma máquina.

---

## 3. Requerimientos específicos

### 3.1 Requerimientos funcionales

- **RF-01. Gestión de productos y catálogo:** El sistema deberá permitir agregar, editar y categorizar productos, incluyendo nombre, descripción, categoría, talla, color, género, precio de compra, precio de venta e imagen opcional.

- **RF-02. Producto vendible por variante:** Cada combinación de producto, talla y color deberá tratarse como un producto vendible independiente, con código único autogenerado y stock propio.

- **RF-03. Gestión de ofertas:** El sistema deberá permitir crear ofertas por producto o por categoría, con descuento de tipo porcentaje o monto fijo, indicando vigencia mediante fecha de inicio y fecha de fin.

- **RF-04. Regla de aplicación de ofertas:** Cuando un producto tenga más de una oferta aplicable, el sistema deberá aplicar solo una: aquella que produzca el mayor descuento monetario final sobre el precio del producto.

- **RF-05. Registro de clientes:** El sistema deberá permitir registrar clientes con nombre, dirección, correo y teléfono, así como consultar su historial de compras.

- **RF-06. Cliente opcional en venta:** El registro de cliente no será obligatorio para completar una venta.

- **RF-07. Registro de ventas:** El sistema deberá registrar ventas indicando folio, fecha, vendedor, productos, cantidades, descuentos aplicados, subtotal, impuesto, total y estado de la venta.

- **RF-08. Múltiples pagos por venta:** El sistema deberá permitir registrar uno o varios pagos por venta usando efectivo, tarjeta o transferencia.

- **RF-09. Regla de cierre de pagos:** La suma de todos los pagos registrados en una venta deberá coincidir exactamente con el total de la venta. No se permitirá registrar pagos por encima o por debajo del total y no se manejará cálculo de cambio o vuelto en esta versión.

- **RF-10. Visualización de ticket:** Al finalizar una venta, el sistema deberá mostrar un ticket en el frontend con folio, fecha y hora, vendedor, productos, cantidades, descuentos, pagos y total. La impresión física del ticket no forma parte del alcance de esta versión.

- **RF-11. Actualización automática de inventario:** El sistema deberá disminuir automáticamente el stock correspondiente al producto vendido después de cada venta completada.

- **RF-12. Cancelación total de venta:** El sistema deberá permitir cancelar completamente una venta registrada. En caso de cancelación, el stock deberá restituirse automáticamente.

- **RF-13. Conservación histórica de pagos y precios:** La cancelación de una venta no deberá eliminar los pagos asociados; estos deberán conservarse para trazabilidad. Además, la venta deberá conservar los precios y descuentos históricos originalmente registrados, aunque posteriormente cambien los precios del catálogo o las ofertas.

- **RF-14. Gestión de inventario:** El sistema deberá permitir registrar movimientos de inventario de tipo entrada, salida, ajuste y devolución.

- **RF-15. Motivo obligatorio en entradas manuales:** Toda entrada manual de mercancía al inventario deberá requerir la captura obligatoria de un motivo.

- **RF-16. Gestión de proveedores:** El sistema deberá permitir registrar y consultar la información de contacto de los proveedores y relacionarlos con los productos que suministran.

- **RF-17. Órdenes de compra:** El sistema deberá permitir crear, consultar y actualizar órdenes de compra asociadas a un proveedor.

- **RF-18. Recepción de órdenes de compra:** Cuando una orden de compra se marque como recibida, el sistema deberá aumentar automáticamente el stock correspondiente y registrar un movimiento de inventario de tipo entrada.

- **RF-19. Inicio de sesión:** El sistema deberá requerir que cada usuario inicie sesión mediante nombre de usuario y contraseña únicos antes de permitir cualquier operación.

- **RF-20. Sesión por inactividad:** La sesión del usuario deberá expirar automáticamente después de 15 minutos de inactividad.

- **RF-21. Administración de usuarios:** El sistema deberá permitir que el Administrador cree, modifique o desactive cuentas de usuario.

- **RF-22. Creación inicial del Administrador:** La base de datos deberá incluir un usuario administrador inicial creado por migración, con contraseña fija definida para el primer despliegue local.

- **RF-23. Roles fijos en versión 1:** El sistema deberá operar únicamente con los roles Administrador, Vendedor e Inventario. No se requerirá configuración granular de permisos en esta versión.

- **RF-24. Registro de auditoría:** El sistema deberá registrar, como mínimo, los eventos críticos de venta, ajuste de inventario, cambio de precio, creación de usuarios y cancelación de venta.

- **RF-25. Contenido mínimo de auditoría:** Cada evento auditado deberá almacenar, como mínimo, el usuario que realizó la acción, la acción ejecutada, la entidad o módulo afectado, el identificador del registro afectado y la fecha y hora exactas.

- **RF-26. Acceso al log de auditoría:** Solo el Administrador podrá consultar el log de auditoría.

- **RF-27. Retención de auditoría:** El sistema deberá conservar los registros de auditoría durante una semana y eliminar automáticamente los registros más antiguos.

- **RF-28. Consultas y reportes:** El sistema deberá permitir consultar stock por categoría, ofertas activas, historial de compras de clientes y los siguientes reportes: ventas diarias, productos más vendidos, ventas por vendedor y stock bajo.

### 3.2 Requerimientos de interfaz externa

#### 3.2.1 Interfaz de usuario

- La interfaz deberá estar en idioma español.
- El acceso al sistema se realizará desde un navegador web moderno.
- La interfaz deberá presentar pantallas diferenciadas según el rol autenticado.
- El ticket de venta deberá visualizarse en el frontend al finalizar una venta.

#### 3.2.2 Interfaz entre frontend y backend

- El frontend deberá comunicarse únicamente con el backend local.
- La comunicación entre frontend y backend deberá darse en el mismo equipo anfitrión.
- No se requerirá comunicación con servicios de terceros para la operación principal.

#### 3.2.3 Interfaz con base de datos

- El backend deberá interactuar con una base de datos PostgreSQL alojada localmente en la misma máquina.

### 3.3 Requerimientos de rendimiento

- Las operaciones comunes de consulta, búsqueda y registro deberán responder en un tiempo promedio objetivo de **200 ms** y en un tiempo máximo esperado de **1 segundo**, bajo condiciones normales de operación local.
- El sistema deberá soportar un operador principal activo y hasta **5 sesiones locales simultáneas** abiertas en navegador dentro de la misma computadora, sin degradación severa en operaciones comunes.

### 3.4 Restricciones de diseño

- La arquitectura del sistema deberá mantenerse separada en frontend web, backend API y base de datos local.
- El sistema deberá ejecutarse en una única computadora física.
- El backend no deberá depender de conectividad a Internet para su funcionamiento principal.
- El acceso al sistema deberá limitarse a localhost en esta versión.

### 3.5 Atributos de calidad

- **Usabilidad:** el sistema deberá priorizar operaciones rápidas y claras para mostrador e inventario.
- **Disponibilidad local:** el sistema deberá seguir operando sin Internet, siempre que la computadora anfitriona y la base de datos local estén disponibles.
- **Trazabilidad:** las operaciones críticas deberán poder vincularse al usuario responsable.
- **Consistencia:** los datos de ventas, pagos e inventario deberán mantenerse sincronizados después de cada operación.

### 3.6 Otros requerimientos

- No habrá impresión física de tickets en esta versión.
- No habrá integración con lectores de código de barras, impresoras térmicas, cajón de dinero o terminal bancaria en esta versión.
- No habrá flujo de devoluciones parciales de ventas en esta versión.
- No habrá mecanismo automático de respaldo o restauración en esta versión. La organización acepta el riesgo operativo de pérdida de información ante una falla física del equipo o del disco.

---

## 4. Índice resumido de requerimientos

| ID | Descripción |
| :--- | :--- |
| RF-01 | Gestión de productos y catálogo. |
| RF-02 | Producto vendible por variante con SKU autogenerado. |
| RF-03 | Gestión de ofertas por producto o categoría. |
| RF-04 | Aplicación de la oferta con mayor descuento final. |
| RF-05 | Registro de clientes e historial de compras. |
| RF-06 | Cliente opcional en venta. |
| RF-07 | Registro detallado de ventas. |
| RF-08 | Múltiples pagos por venta. |
| RF-09 | La suma de pagos debe coincidir exactamente con el total. |
| RF-10 | Visualización de ticket en frontend. |
| RF-11 | Actualización automática del inventario tras la venta. |
| RF-12 | Cancelación total de venta con restitución de stock. |
| RF-13 | Conservación histórica de pagos, precios y descuentos. |
| RF-14 | Movimientos de inventario: entrada, salida, ajuste y devolución. |
| RF-15 | Motivo obligatorio en entradas manuales. |
| RF-16 | Gestión de proveedores. |
| RF-17 | Gestión de órdenes de compra. |
| RF-18 | Recepción de órdenes con actualización automática de stock. |
| RF-19 | Inicio de sesión por nombre de usuario y contraseña. |
| RF-20 | Expiración de sesión tras 15 minutos de inactividad. |
| RF-21 | Administración de usuarios por el Administrador. |
| RF-22 | Creación inicial del Administrador por migración. |
| RF-23 | Roles fijos en la versión 1. |
| RF-24 | Registro de auditoría de eventos críticos. |
| RF-25 | Contenido mínimo obligatorio de la auditoría. |
| RF-26 | Acceso al log solo para Administrador. |
| RF-27 | Retención de auditoría de una semana con limpieza automática. |
| RF-28 | Consultas y reportes operativos. |
