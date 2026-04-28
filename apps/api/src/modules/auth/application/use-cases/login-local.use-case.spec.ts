import { UnauthorizedException } from '@nestjs/common';
import { describe, expect, it, jest } from '@jest/globals';
import { LoginLocalUseCase } from './login-local.use-case';
import { hashPassword } from '../../domain/password-hasher';

describe('LoginLocalUseCase', () => {
  it('creates a session for valid credentials', async () => {
    const findByUsername = jest.fn().mockResolvedValue({
      id: 10,
      nombreUsuario: 'admin',
      role: 'Administrador',
      contrasena: hashPassword('password'),
    });
    const createSession = jest.fn().mockResolvedValue({
      id: 'session-1',
      expiresAt: new Date('2026-04-28T21:15:00.000Z'),
    });

    const sut = new LoginLocalUseCase({ findByUsername }, { createSession });

    await expect(
      sut.execute({ nombreUsuario: 'admin', contrasena: 'password' }),
    ).resolves.toEqual({
      sessionId: 'session-1',
      response: {
        ok: true,
        data: {
          expiresAt: '2026-04-28T21:15:00.000Z',
          user: {
            id: '10',
            nombreUsuario: 'admin',
            role: 'Administrador',
          },
        },
      },
    });
  });

  it('throws generic unauthorized for invalid credentials', async () => {
    const findByUsername = jest.fn().mockResolvedValue(null);
    const createSession = jest.fn();
    const sut = new LoginLocalUseCase({ findByUsername }, { createSession });

    await expect(
      sut.execute({ nombreUsuario: 'admin', contrasena: 'invalid' }),
    ).rejects.toBeInstanceOf(UnauthorizedException);
    await expect(
      sut.execute({ nombreUsuario: 'admin', contrasena: 'invalid' }),
    ).rejects.toThrow('Credenciales inválidas');
    expect(createSession).not.toHaveBeenCalled();
  });
});
