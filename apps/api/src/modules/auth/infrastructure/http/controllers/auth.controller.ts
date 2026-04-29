import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import {
  ApiCookieAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import type { LoginRequest, LoginResponse, SessionResponse } from '@garras/api-contracts';
import type { Request, Response } from 'express';
import { LoginLocalUseCase } from '../../../application/use-cases/login-local.use-case';
import { SessionAuthGuard, type SessionRequest } from '../guards/session-auth.guard';
import { DrizzleAuthSessionRepository } from '../../persistence/drizzle/repositories/drizzle-auth-session.repository';

function readSessionId(request: Request): string | undefined {
  const cookie = request.headers.cookie;
  if (!cookie) return undefined;
  const token = cookie
    .split(';')
    .map((entry) => entry.trim())
    .find((entry) => entry.startsWith('sid='));
  return token?.slice(4);
}

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(
    private readonly loginUseCase: LoginLocalUseCase,
    private readonly sessions: DrizzleAuthSessionRepository,
  ) {}

  @Post('login')
  @HttpCode(200)
  @ApiOperation({ summary: 'Inicia sesión local y crea cookie HttpOnly sid' })
  @ApiOkResponse({ description: 'Sesión autenticada y cookie sid emitida' })
  @ApiUnauthorizedResponse({ description: 'Credenciales inválidas' })
  async login(
    @Body() body: LoginRequest,
    @Res({ passthrough: true }) response: Response,
  ): Promise<LoginResponse> {
    const result = await this.loginUseCase.execute(body);

    response.setHeader(
      'Set-Cookie',
      `sid=${result.sessionId}; HttpOnly; Path=/; SameSite=Lax`,
    );

    return result.response;
  }

  @Get('session')
  @UseGuards(SessionAuthGuard)
  @ApiCookieAuth('sid')
  @ApiOperation({ summary: 'Resuelve sesión activa y renueva expiración por inactividad (15m)' })
  @ApiOkResponse({ description: 'Sesión activa' })
  @ApiUnauthorizedResponse({ description: 'SESSION_EXPIRED' })
  async session(@Req() request: SessionRequest): Promise<SessionResponse> {
    return {
      ok: true,
      data: {
        user: request.authSession!.user,
        expiresAt: request.authSession!.expiresAt.toISOString(),
      },
    };
  }

  @Post('logout')
  @HttpCode(200)
  @ApiCookieAuth('sid')
  @ApiOperation({ summary: 'Revoca sesión actual y limpia cookie sid' })
  @ApiOkResponse({ description: 'Sesión revocada' })
  @ApiUnauthorizedResponse({ description: 'SESSION_EXPIRED' })
  async logout(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ): Promise<{ ok: true; data: { done: true } }> {
    const sessionId = readSessionId(request);
    if (!sessionId) {
      throw new UnauthorizedException('SESSION_EXPIRED');
    }

    await this.sessions.revokeSession(sessionId);
    response.setHeader('Set-Cookie', 'sid=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax');
    return { ok: true, data: { done: true } };
  }
}
