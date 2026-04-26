INSERT INTO roles (nombre, descripcion, activo)
VALUES
    ('Administrador', 'Acceso total al sistema: usuarios, precios, auditoría y reportes', TRUE),
    ('Vendedor', 'Registra ventas, clientes y pagos', TRUE),
    ('Almacenista', 'Gestiona productos, inventario y proveedores', TRUE)
ON CONFLICT (nombre) DO UPDATE
SET descripcion = EXCLUDED.descripcion,
    activo = EXCLUDED.activo;
--> statement-breakpoint

INSERT INTO permisos (id_rol, modulo, puede_leer, puede_crear, puede_editar, puede_eliminar)
SELECT
    r.id_rol,
    p.modulo,
    p.puede_leer,
    p.puede_crear,
    p.puede_editar,
    p.puede_eliminar
FROM (
    VALUES
        ('Administrador', 'productos', TRUE, TRUE, TRUE, TRUE),
        ('Administrador', 'inventario', TRUE, TRUE, TRUE, TRUE),
        ('Administrador', 'ventas', TRUE, TRUE, TRUE, TRUE),
        ('Administrador', 'clientes', TRUE, TRUE, TRUE, TRUE),
        ('Administrador', 'proveedores', TRUE, TRUE, TRUE, TRUE),
        ('Administrador', 'ofertas', TRUE, TRUE, TRUE, TRUE),
        ('Administrador', 'reportes', TRUE, TRUE, TRUE, TRUE),
        ('Administrador', 'usuarios', TRUE, TRUE, TRUE, TRUE),
        ('Administrador', 'auditoria', TRUE, FALSE, FALSE, FALSE),
        ('Vendedor', 'productos', TRUE, FALSE, FALSE, FALSE),
        ('Vendedor', 'inventario', TRUE, FALSE, FALSE, FALSE),
        ('Vendedor', 'ventas', TRUE, TRUE, TRUE, FALSE),
        ('Vendedor', 'clientes', TRUE, TRUE, TRUE, FALSE),
        ('Vendedor', 'proveedores', FALSE, FALSE, FALSE, FALSE),
        ('Vendedor', 'ofertas', TRUE, FALSE, FALSE, FALSE),
        ('Vendedor', 'reportes', TRUE, FALSE, FALSE, FALSE),
        ('Vendedor', 'usuarios', FALSE, FALSE, FALSE, FALSE),
        ('Vendedor', 'auditoria', FALSE, FALSE, FALSE, FALSE),
        ('Almacenista', 'productos', TRUE, TRUE, TRUE, FALSE),
        ('Almacenista', 'inventario', TRUE, TRUE, TRUE, FALSE),
        ('Almacenista', 'ventas', FALSE, FALSE, FALSE, FALSE),
        ('Almacenista', 'clientes', FALSE, FALSE, FALSE, FALSE),
        ('Almacenista', 'proveedores', TRUE, TRUE, TRUE, FALSE),
        ('Almacenista', 'ofertas', TRUE, FALSE, FALSE, FALSE),
        ('Almacenista', 'reportes', TRUE, FALSE, FALSE, FALSE),
        ('Almacenista', 'usuarios', FALSE, FALSE, FALSE, FALSE),
        ('Almacenista', 'auditoria', FALSE, FALSE, FALSE, FALSE)
) AS p(nombre_rol, modulo, puede_leer, puede_crear, puede_editar, puede_eliminar)
JOIN roles r ON r.nombre = p.nombre_rol
ON CONFLICT (id_rol, modulo) DO UPDATE
SET puede_leer = EXCLUDED.puede_leer,
    puede_crear = EXCLUDED.puede_crear,
    puede_editar = EXCLUDED.puede_editar,
    puede_eliminar = EXCLUDED.puede_eliminar;
--> statement-breakpoint

-- Reemplazar CAMBIAR_POR_HASH_SEGURO por un hash real antes de usar este seed en entornos compartidos.
INSERT INTO usuarios (nombre, apellido, nombre_usuario, contrasena, id_rol)
SELECT
    'Admin',
    'Sistema',
    'admin',
    'CAMBIAR_POR_HASH_SEGURO',
    r.id_rol
FROM roles r
WHERE r.nombre = 'Administrador'
ON CONFLICT (nombre_usuario) DO NOTHING;
