import { z } from 'zod';

export const loginSchema = z.object({
	nombreUsuario: z.string().trim().min(1, 'Ingresá tu usuario'),
	contrasena: z.string().min(1, 'Ingresá tu contraseña')
});

export type LoginSchema = z.infer<typeof loginSchema>;
