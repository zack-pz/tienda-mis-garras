import { INestApplication, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { HttpExceptionFilter } from '../filters/http-exception.filter';

export function configurePlatform(app: INestApplication): void {
  app.enableCors({
    origin: true,
    credentials: true,
  });

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Tienda Mis Garras API')
    .setDescription('Plataforma base HTTP')
    .setVersion('1.0.0')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, document);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.useGlobalFilters(new HttpExceptionFilter());
}
