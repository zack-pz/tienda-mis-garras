CREATE TYPE "public"."accion_auditoria_enum" AS ENUM('INSERT', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT', 'ERROR');--> statement-breakpoint
CREATE TYPE "public"."estado_orden_enum" AS ENUM('PENDIENTE', 'RECIBIDA', 'CANCELADA');--> statement-breakpoint
CREATE TYPE "public"."estado_venta_enum" AS ENUM('COMPLETADA', 'CANCELADA', 'PENDIENTE');--> statement-breakpoint
CREATE TYPE "public"."genero_enum" AS ENUM('Hombre', 'Mujer', 'Unisex', 'Niño', 'Niña');--> statement-breakpoint
CREATE TYPE "public"."metodo_pago_enum" AS ENUM('EFECTIVO', 'TARJETA', 'TRANSFERENCIA', 'OTRO');--> statement-breakpoint
CREATE TYPE "public"."tipo_descuento_enum" AS ENUM('PORCENTAJE', 'MONTO_FIJO');--> statement-breakpoint
CREATE TYPE "public"."tipo_movimiento_enum" AS ENUM('ENTRADA', 'SALIDA', 'AJUSTE', 'DEVOLUCION');--> statement-breakpoint
CREATE TABLE "permisos" (
	"id_permiso" serial PRIMARY KEY NOT NULL,
	"id_rol" integer NOT NULL,
	"modulo" varchar(50) NOT NULL,
	"puede_leer" boolean DEFAULT false NOT NULL,
	"puede_crear" boolean DEFAULT false NOT NULL,
	"puede_editar" boolean DEFAULT false NOT NULL,
	"puede_eliminar" boolean DEFAULT false NOT NULL,
	CONSTRAINT "permisos_id_rol_modulo_unique" UNIQUE("id_rol","modulo")
);
--> statement-breakpoint
CREATE TABLE "roles" (
	"id_rol" serial PRIMARY KEY NOT NULL,
	"nombre" varchar(50) NOT NULL,
	"descripcion" text,
	"activo" boolean DEFAULT true NOT NULL,
	"fecha_creacion" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "roles_nombre_unique" UNIQUE("nombre")
);
--> statement-breakpoint
CREATE TABLE "usuarios" (
	"id_usuario" serial PRIMARY KEY NOT NULL,
	"nombre" varchar(100) NOT NULL,
	"apellido" varchar(100) NOT NULL,
	"nombre_usuario" varchar(50) NOT NULL,
	"contrasena" text NOT NULL,
	"id_rol" integer NOT NULL,
	"activo" boolean DEFAULT true NOT NULL,
	"fecha_creacion" timestamp DEFAULT now() NOT NULL,
	"ultimo_acceso" timestamp,
	CONSTRAINT "usuarios_nombre_usuario_unique" UNIQUE("nombre_usuario")
);
--> statement-breakpoint
CREATE TABLE "categorias" (
	"id_categoria" serial PRIMARY KEY NOT NULL,
	"nombre" varchar(100) NOT NULL,
	"descripcion" text,
	"activo" boolean DEFAULT true NOT NULL,
	"fecha_creacion" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "categorias_nombre_unique" UNIQUE("nombre")
);
--> statement-breakpoint
CREATE TABLE "productos" (
	"id_producto" serial PRIMARY KEY NOT NULL,
	"codigo" varchar(50) NOT NULL,
	"nombre" varchar(150) NOT NULL,
	"descripcion" text,
	"id_categoria" integer,
	"talla" varchar(10),
	"color" varchar(50),
	"genero" "genero_enum",
	"precio_compra" numeric(12, 2) DEFAULT 0 NOT NULL,
	"precio_venta" numeric(12, 2) DEFAULT 0 NOT NULL,
	"imagen" "bytea",
	"activo" boolean DEFAULT true NOT NULL,
	"fecha_creacion" timestamp DEFAULT now() NOT NULL,
	"fecha_modificacion" timestamp,
	CONSTRAINT "productos_codigo_unique" UNIQUE("codigo")
);
--> statement-breakpoint
CREATE TABLE "inventario" (
	"id_inventario" serial PRIMARY KEY NOT NULL,
	"id_producto" integer NOT NULL,
	"cantidad" integer DEFAULT 0 NOT NULL,
	"stock_minimo" integer DEFAULT 5 NOT NULL,
	"ubicacion" varchar(100),
	"fecha_actualizacion" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "inventario_id_producto_unique" UNIQUE("id_producto"),
	CONSTRAINT "inventario_cantidad_non_negative" CHECK ("inventario"."cantidad" >= 0)
);
--> statement-breakpoint
CREATE TABLE "movimientos_inventario" (
	"id_movimiento" serial PRIMARY KEY NOT NULL,
	"id_producto" integer NOT NULL,
	"tipo" "tipo_movimiento_enum" NOT NULL,
	"cantidad" integer NOT NULL,
	"cantidad_anterior" integer NOT NULL,
	"cantidad_nueva" integer NOT NULL,
	"motivo" text,
	"id_usuario" integer NOT NULL,
	"fecha" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ofertas" (
	"id_oferta" serial PRIMARY KEY NOT NULL,
	"nombre" varchar(150) NOT NULL,
	"descripcion" text,
	"tipo_descuento" "tipo_descuento_enum" NOT NULL,
	"valor_descuento" numeric(12, 2) NOT NULL,
	"fecha_inicio" date NOT NULL,
	"fecha_fin" date NOT NULL,
	"activo" boolean DEFAULT true NOT NULL,
	"id_usuario_creo" integer NOT NULL,
	"fecha_creacion" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "ofertas_valor_descuento_positive" CHECK ("ofertas"."valor_descuento" > 0),
	CONSTRAINT "chk_fechas_oferta" CHECK ("ofertas"."fecha_fin" >= "ofertas"."fecha_inicio")
);
--> statement-breakpoint
CREATE TABLE "ofertas_categorias" (
	"id_oferta_categoria" serial PRIMARY KEY NOT NULL,
	"id_oferta" integer NOT NULL,
	"id_categoria" integer NOT NULL,
	CONSTRAINT "ofertas_categorias_id_oferta_id_categoria_unique" UNIQUE("id_oferta","id_categoria")
);
--> statement-breakpoint
CREATE TABLE "ofertas_productos" (
	"id_oferta_producto" serial PRIMARY KEY NOT NULL,
	"id_oferta" integer NOT NULL,
	"id_producto" integer NOT NULL,
	CONSTRAINT "ofertas_productos_id_oferta_id_producto_unique" UNIQUE("id_oferta","id_producto")
);
--> statement-breakpoint
CREATE TABLE "clientes" (
	"id_cliente" serial PRIMARY KEY NOT NULL,
	"nombre" varchar(100) NOT NULL,
	"apellido" varchar(100) NOT NULL,
	"telefono" varchar(20),
	"email" varchar(150),
	"direccion" text,
	"notas" text,
	"activo" boolean DEFAULT true NOT NULL,
	"fecha_registro" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "detalle_ventas" (
	"id_detalle" serial PRIMARY KEY NOT NULL,
	"id_venta" integer NOT NULL,
	"id_producto" integer NOT NULL,
	"cantidad" integer NOT NULL,
	"precio_unitario" numeric(12, 2) NOT NULL,
	"id_oferta" integer,
	"descuento" numeric(12, 2) DEFAULT 0 NOT NULL,
	"subtotal" numeric(12, 2) NOT NULL,
	CONSTRAINT "detalle_ventas_cantidad_positive" CHECK ("detalle_ventas"."cantidad" > 0)
);
--> statement-breakpoint
CREATE TABLE "pagos" (
	"id_pago" serial PRIMARY KEY NOT NULL,
	"id_venta" integer NOT NULL,
	"monto" numeric(12, 2) NOT NULL,
	"metodo_pago" "metodo_pago_enum" NOT NULL,
	"referencia" varchar(100),
	"fecha_pago" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "pagos_monto_positive" CHECK ("pagos"."monto" > 0)
);
--> statement-breakpoint
CREATE TABLE "ventas" (
	"id_venta" serial PRIMARY KEY NOT NULL,
	"folio" varchar(30) NOT NULL,
	"id_cliente" integer,
	"id_usuario" integer NOT NULL,
	"subtotal" numeric(12, 2) DEFAULT 0 NOT NULL,
	"descuento_total" numeric(12, 2) DEFAULT 0 NOT NULL,
	"impuesto" numeric(12, 2) DEFAULT 0 NOT NULL,
	"total" numeric(12, 2) DEFAULT 0 NOT NULL,
	"metodo_pago" "metodo_pago_enum" NOT NULL,
	"estado" "estado_venta_enum" DEFAULT 'COMPLETADA' NOT NULL,
	"observaciones" text,
	"fecha_venta" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "ventas_folio_unique" UNIQUE("folio")
);
--> statement-breakpoint
CREATE TABLE "detalle_ordenes_compra" (
	"id_detalle" serial PRIMARY KEY NOT NULL,
	"id_orden" integer NOT NULL,
	"id_producto" integer NOT NULL,
	"cantidad" integer NOT NULL,
	"precio_unitario" numeric(12, 2) NOT NULL,
	"subtotal" numeric(12, 2) NOT NULL,
	CONSTRAINT "detalle_ordenes_compra_cantidad_positive" CHECK ("detalle_ordenes_compra"."cantidad" > 0)
);
--> statement-breakpoint
CREATE TABLE "ordenes_compra" (
	"id_orden" serial PRIMARY KEY NOT NULL,
	"id_proveedor" integer NOT NULL,
	"id_usuario" integer NOT NULL,
	"estado" "estado_orden_enum" DEFAULT 'PENDIENTE' NOT NULL,
	"total" numeric(12, 2) DEFAULT 0 NOT NULL,
	"observaciones" text,
	"fecha_orden" timestamp DEFAULT now() NOT NULL,
	"fecha_recepcion" timestamp
);
--> statement-breakpoint
CREATE TABLE "proveedores" (
	"id_proveedor" serial PRIMARY KEY NOT NULL,
	"nombre" varchar(150) NOT NULL,
	"contacto" varchar(100),
	"telefono" varchar(20),
	"email" varchar(150),
	"direccion" text,
	"rfc" varchar(20),
	"notas" text,
	"activo" boolean DEFAULT true NOT NULL,
	"fecha_registro" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "proveedores_productos" (
	"id_proveedor_producto" serial PRIMARY KEY NOT NULL,
	"id_proveedor" integer NOT NULL,
	"id_producto" integer NOT NULL,
	"precio_proveedor" numeric(12, 2),
	"tiempo_entrega_dias" integer,
	CONSTRAINT "proveedores_productos_id_proveedor_id_producto_unique" UNIQUE("id_proveedor","id_producto")
);
--> statement-breakpoint
CREATE TABLE "log_auditoria" (
	"id_log" serial PRIMARY KEY NOT NULL,
	"id_usuario" integer,
	"accion" "accion_auditoria_enum" NOT NULL,
	"tabla_afectada" varchar(100),
	"registro_id" integer,
	"datos_anteriores" jsonb,
	"datos_nuevos" jsonb,
	"ip_local" varchar(45),
	"fecha" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "permisos" ADD CONSTRAINT "fk_permisos_rol" FOREIGN KEY ("id_rol") REFERENCES "public"."roles"("id_rol") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "usuarios" ADD CONSTRAINT "fk_usuarios_rol" FOREIGN KEY ("id_rol") REFERENCES "public"."roles"("id_rol") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "productos" ADD CONSTRAINT "fk_productos_categoria" FOREIGN KEY ("id_categoria") REFERENCES "public"."categorias"("id_categoria") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inventario" ADD CONSTRAINT "fk_inventario_producto" FOREIGN KEY ("id_producto") REFERENCES "public"."productos"("id_producto") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "movimientos_inventario" ADD CONSTRAINT "fk_movimientos_producto" FOREIGN KEY ("id_producto") REFERENCES "public"."productos"("id_producto") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "movimientos_inventario" ADD CONSTRAINT "fk_movimientos_usuario" FOREIGN KEY ("id_usuario") REFERENCES "public"."usuarios"("id_usuario") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ofertas" ADD CONSTRAINT "fk_ofertas_usuario" FOREIGN KEY ("id_usuario_creo") REFERENCES "public"."usuarios"("id_usuario") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ofertas_categorias" ADD CONSTRAINT "fk_oc_oferta" FOREIGN KEY ("id_oferta") REFERENCES "public"."ofertas"("id_oferta") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ofertas_categorias" ADD CONSTRAINT "fk_oc_categoria" FOREIGN KEY ("id_categoria") REFERENCES "public"."categorias"("id_categoria") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ofertas_productos" ADD CONSTRAINT "fk_op_oferta" FOREIGN KEY ("id_oferta") REFERENCES "public"."ofertas"("id_oferta") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ofertas_productos" ADD CONSTRAINT "fk_op_producto" FOREIGN KEY ("id_producto") REFERENCES "public"."productos"("id_producto") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "detalle_ventas" ADD CONSTRAINT "fk_dv_venta" FOREIGN KEY ("id_venta") REFERENCES "public"."ventas"("id_venta") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "detalle_ventas" ADD CONSTRAINT "fk_dv_producto" FOREIGN KEY ("id_producto") REFERENCES "public"."productos"("id_producto") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "detalle_ventas" ADD CONSTRAINT "fk_dv_oferta" FOREIGN KEY ("id_oferta") REFERENCES "public"."ofertas"("id_oferta") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pagos" ADD CONSTRAINT "fk_pagos_venta" FOREIGN KEY ("id_venta") REFERENCES "public"."ventas"("id_venta") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ventas" ADD CONSTRAINT "fk_ventas_cliente" FOREIGN KEY ("id_cliente") REFERENCES "public"."clientes"("id_cliente") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ventas" ADD CONSTRAINT "fk_ventas_usuario" FOREIGN KEY ("id_usuario") REFERENCES "public"."usuarios"("id_usuario") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "detalle_ordenes_compra" ADD CONSTRAINT "fk_doc_orden" FOREIGN KEY ("id_orden") REFERENCES "public"."ordenes_compra"("id_orden") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "detalle_ordenes_compra" ADD CONSTRAINT "fk_doc_product" FOREIGN KEY ("id_producto") REFERENCES "public"."productos"("id_producto") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ordenes_compra" ADD CONSTRAINT "fk_oc_proveedor" FOREIGN KEY ("id_proveedor") REFERENCES "public"."proveedores"("id_proveedor") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ordenes_compra" ADD CONSTRAINT "fk_oc_usuario" FOREIGN KEY ("id_usuario") REFERENCES "public"."usuarios"("id_usuario") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "proveedores_productos" ADD CONSTRAINT "fk_pp_proveedor" FOREIGN KEY ("id_proveedor") REFERENCES "public"."proveedores"("id_proveedor") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "proveedores_productos" ADD CONSTRAINT "fk_pp_producto" FOREIGN KEY ("id_producto") REFERENCES "public"."productos"("id_producto") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "log_auditoria" ADD CONSTRAINT "fk_log_usuario" FOREIGN KEY ("id_usuario") REFERENCES "public"."usuarios"("id_usuario") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_productos_categoria" ON "productos" USING btree ("id_categoria");--> statement-breakpoint
CREATE INDEX "idx_productos_nombre" ON "productos" USING btree ("nombre");--> statement-breakpoint
CREATE INDEX "idx_movimientos_producto" ON "movimientos_inventario" USING btree ("id_producto");--> statement-breakpoint
CREATE INDEX "idx_movimientos_fecha" ON "movimientos_inventario" USING btree ("fecha");--> statement-breakpoint
CREATE INDEX "idx_clientes_nombre" ON "clientes" USING btree ("nombre","apellido");--> statement-breakpoint
CREATE INDEX "idx_detalle_venta" ON "detalle_ventas" USING btree ("id_venta");--> statement-breakpoint
CREATE INDEX "idx_detalle_producto" ON "detalle_ventas" USING btree ("id_producto");--> statement-breakpoint
CREATE INDEX "idx_ventas_fecha" ON "ventas" USING btree ("fecha_venta");--> statement-breakpoint
CREATE INDEX "idx_ventas_cliente" ON "ventas" USING btree ("id_cliente");--> statement-breakpoint
CREATE INDEX "idx_log_usuario" ON "log_auditoria" USING btree ("id_usuario");--> statement-breakpoint
CREATE INDEX "idx_log_fecha" ON "log_auditoria" USING btree ("fecha");--> statement-breakpoint
CREATE INDEX "idx_log_accion" ON "log_auditoria" USING btree ("accion");--> statement-breakpoint
CREATE INDEX "idx_log_tabla" ON "log_auditoria" USING btree ("tabla_afectada");--> statement-breakpoint
CREATE INDEX "idx_log_datos_nuevos" ON "log_auditoria" USING gin ("datos_nuevos");--> statement-breakpoint
CREATE INDEX "idx_log_datos_anteriores" ON "log_auditoria" USING gin ("datos_anteriores");--> statement-breakpoint
CREATE VIEW "public"."vw_historial_cliente" AS (
  SELECT
    c.id_cliente,
    c.nombre || ' ' || c.apellido AS cliente,
    v.folio,
    v.total,
    v.metodo_pago,
    v.fecha_venta
  FROM ventas v
  JOIN clientes c ON v.id_cliente = c.id_cliente
  WHERE v.estado = 'COMPLETADA'
  ORDER BY v.fecha_venta DESC
);--> statement-breakpoint
CREATE VIEW "public"."vw_productos_mas_vendidos" AS (
  SELECT
    p.id_producto,
    p.codigo,
    p.nombre,
    p.talla,
    p.color,
    SUM(dv.cantidad) AS unidades_vendidas,
    SUM(dv.subtotal) AS ingreso_generado
  FROM detalle_ventas dv
  JOIN productos p ON dv.id_producto = p.id_producto
  JOIN ventas v ON dv.id_venta = v.id_venta
  WHERE v.estado = 'COMPLETADA'
  GROUP BY p.id_producto, p.codigo, p.nombre, p.talla, p.color
  ORDER BY unidades_vendidas DESC
);--> statement-breakpoint
CREATE VIEW "public"."vw_stock_bajo" AS (
  SELECT
    p.id_producto,
    p.codigo,
    p.nombre,
    p.talla,
    p.color,
    i.cantidad,
    i.stock_minimo,
    i.ubicacion
  FROM productos p
  JOIN inventario i ON p.id_producto = i.id_producto
  WHERE i.cantidad <= i.stock_minimo
    AND p.activo = TRUE
);--> statement-breakpoint
CREATE VIEW "public"."vw_ventas_diarias" AS (
  SELECT
    v.fecha_venta::DATE AS fecha,
    COUNT(v.id_venta) AS total_ventas,
    SUM(v.total) AS ingreso_total,
    SUM(v.descuento_total) AS descuentos_total
  FROM ventas v
  WHERE v.estado = 'COMPLETADA'
  GROUP BY v.fecha_venta::DATE
);--> statement-breakpoint
CREATE VIEW "public"."vw_ventas_por_vendedor" AS (
  SELECT
    u.id_usuario,
    u.nombre || ' ' || u.apellido AS vendedor,
    COUNT(v.id_venta) AS num_ventas,
    SUM(v.total) AS total_vendido
  FROM ventas v
  JOIN usuarios u ON v.id_usuario = u.id_usuario
  WHERE v.estado = 'COMPLETADA'
  GROUP BY u.id_usuario, u.nombre, u.apellido
);