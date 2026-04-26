DROP TRIGGER IF EXISTS trg_audit_venta_insert ON ventas;
CREATE TRIGGER trg_audit_venta_insert
AFTER INSERT ON ventas
FOR EACH ROW EXECUTE FUNCTION trg_fn_audit_venta_insert();
--> statement-breakpoint

DROP TRIGGER IF EXISTS trg_audit_venta_cancel ON ventas;
CREATE TRIGGER trg_audit_venta_cancel
AFTER UPDATE OF estado ON ventas
FOR EACH ROW EXECUTE FUNCTION trg_fn_audit_venta_cancel();
--> statement-breakpoint

DROP TRIGGER IF EXISTS trg_audit_inventario_update ON inventario;
CREATE TRIGGER trg_audit_inventario_update
AFTER UPDATE OF cantidad ON inventario
FOR EACH ROW EXECUTE FUNCTION trg_fn_audit_inventario_update();
--> statement-breakpoint

DROP TRIGGER IF EXISTS trg_audit_producto_precio ON productos;
CREATE TRIGGER trg_audit_producto_precio
AFTER UPDATE OF precio_venta ON productos
FOR EACH ROW EXECUTE FUNCTION trg_fn_audit_producto_precio();
--> statement-breakpoint

DROP TRIGGER IF EXISTS trg_descontar_inventario ON detalle_ventas;
CREATE TRIGGER trg_descontar_inventario
AFTER INSERT ON detalle_ventas
FOR EACH ROW EXECUTE FUNCTION trg_fn_descontar_inventario();
