import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { createErrorEnvelope } from '../http/error-envelope';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const statusCode =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const payload =
      exception instanceof HttpException ? exception.getResponse() : undefined;

    const error =
      typeof payload === 'object' && payload !== null && 'error' in payload
        ? String(payload.error)
        : statusCode === HttpStatus.INTERNAL_SERVER_ERROR
          ? 'Internal Server Error'
          : exception instanceof HttpException
            ? exception.name
            : 'Error';

    const message =
      typeof payload === 'object' && payload !== null && 'message' in payload
        ? (payload.message as string | string[])
        : exception instanceof HttpException
          ? exception.message
          : 'Unexpected error';

    response.status(statusCode).json(
      createErrorEnvelope({
        statusCode,
        error,
        message,
        path: request.url,
      }),
    );
  }
}
