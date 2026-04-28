CREATE TABLE IF NOT EXISTS auth_sessions (
    id TEXT PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
    last_activity_at TIMESTAMP NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMP NOT NULL,
    revoked_at TIMESTAMP
);
--> statement-breakpoint

CREATE INDEX IF NOT EXISTS auth_sessions_user_id_idx ON auth_sessions (user_id);
--> statement-breakpoint

CREATE INDEX IF NOT EXISTS auth_sessions_expires_at_idx ON auth_sessions (expires_at);
--> statement-breakpoint

INSERT INTO usuarios (nombre, apellido, nombre_usuario, contrasena, id_rol)
SELECT
    'Admin',
    'Sistema',
    'admin',
    'scrypt$a8ae30fea05bb2074307759f47d71407$fde488f9124beb56d97e0858907c91576033726e81824cfeb0843fd82904a30829d06d0f3a7aa2b86e123773eb638d1fa8113b876bbd0ebf30aff840ea6f927e',
    r.id_rol
FROM roles r
WHERE r.nombre = 'Administrador'
ON CONFLICT (nombre_usuario) DO UPDATE
SET contrasena = EXCLUDED.contrasena,
    id_rol = EXCLUDED.id_rol,
    activo = TRUE;
