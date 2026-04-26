CREATE OR REPLACE FUNCTION fn_audit_log(
    p_id_usuario INTEGER,
    p_accion accion_auditoria_enum,
    p_tabla TEXT,
    p_registro_id INTEGER,
    p_datos_ant JSONB,
    p_datos_nuevos JSONB
) RETURNS VOID AS $$
BEGIN
    INSERT INTO log_auditoria (id_usuario, accion, tabla_afectada, registro_id, datos_anteriores, datos_nuevos)
    VALUES (p_id_usuario, p_accion, p_tabla, p_registro_id, p_datos_ant, p_datos_nuevos);
END;
$$ LANGUAGE plpgsql;
--> statement-breakpoint

CREATE OR REPLACE FUNCTION trg_fn_audit_venta_insert()
RETURNS TRIGGER AS $$
BEGIN
    PERFORM fn_audit_log(
        NEW.id_usuario,
        'INSERT',
        'ventas',
        NEW.id_venta,
        NULL,
        jsonb_build_object(
            'folio', NEW.folio,
            'id_cliente', NEW.id_cliente,
            'total', NEW.total,
            'metodo_pago', NEW.metodo_pago::TEXT,
            'estado', NEW.estado::TEXT
        )
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
--> statement-breakpoint

CREATE OR REPLACE FUNCTION trg_fn_audit_venta_cancel()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.estado = 'CANCELADA' AND OLD.estado <> 'CANCELADA' THEN
        PERFORM fn_audit_log(
            NEW.id_usuario,
            'UPDATE',
            'ventas',
            NEW.id_venta,
            jsonb_build_object('estado', OLD.estado::TEXT),
            jsonb_build_object('estado', NEW.estado::TEXT)
        );
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
--> statement-breakpoint

CREATE OR REPLACE FUNCTION trg_fn_audit_inventario_update()
RETURNS TRIGGER AS $$
BEGIN
    PERFORM fn_audit_log(
        NULL,
        'UPDATE',
        'inventario',
        NEW.id_inventario,
        jsonb_build_object('cantidad', OLD.cantidad),
        jsonb_build_object('cantidad', NEW.cantidad)
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
--> statement-breakpoint

CREATE OR REPLACE FUNCTION trg_fn_audit_producto_precio()
RETURNS TRIGGER AS $$
BEGIN
    PERFORM fn_audit_log(
        NULL,
        'UPDATE',
        'productos',
        NEW.id_producto,
        jsonb_build_object('precio_venta', OLD.precio_venta),
        jsonb_build_object('precio_venta', NEW.precio_venta)
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
--> statement-breakpoint

CREATE OR REPLACE FUNCTION trg_fn_descontar_inventario()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE inventario
    SET cantidad = cantidad - NEW.cantidad,
        fecha_actualizacion = NOW()
    WHERE id_producto = NEW.id_producto;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
