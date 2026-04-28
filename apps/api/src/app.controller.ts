import {
  Body,
  Controller,
  Get,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { IsString, MinLength } from 'class-validator';
import { AppService } from './app.service';

class SamplePayloadDto {
  @IsString()
  @MinLength(3)
  name!: string;
}

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('validation/sample')
  validatePayload(@Body() payload: SamplePayloadDto): {
    accepted: true;
    name: string;
  } {
    return { accepted: true, name: payload.name };
  }

  @Get('auth/protected')
  authProtected(): void {
    throw new UnauthorizedException('Token missing or invalid');
  }

  @Get('errors/unexpected')
  unexpected(): void {
    throw new Error('Boom');
  }
}
