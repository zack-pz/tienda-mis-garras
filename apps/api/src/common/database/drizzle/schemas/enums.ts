import { pgEnum } from 'drizzle-orm/pg-core';

export const generoEnum = pgEnum('genero_enum', ['Hombre', 'Mujer', 'Unisex', 'Niño', 'Niña']);

export const tipoMovimientoEnum = pgEnum('tipo_movimiento_enum', [
  'ENTRADA',
  'SALIDA',
  'AJUSTE',
  'DEVOLUCION',
]);

export const tipoDescuentoEnum = pgEnum('tipo_descuento_enum', ['PORCENTAJE', 'MONTO_FIJO']);

export const metodoPagoEnum = pgEnum('metodo_pago_enum', [
  'EFECTIVO',
  'TARJETA',
  'TRANSFERENCIA',
  'OTRO',
]);

export const estadoVentaEnum = pgEnum('estado_venta_enum', [
  'COMPLETADA',
  'CANCELADA',
  'PENDIENTE',
]);

export const estadoOrdenEnum = pgEnum('estado_orden_enum', ['PENDIENTE', 'RECIBIDA', 'CANCELADA']);

export const accionAuditoriaEnum = pgEnum('accion_auditoria_enum', [
  'INSERT',
  'UPDATE',
  'DELETE',
  'LOGIN',
  'LOGOUT',
  'ERROR',
]);
