import { NestFactory } from '@nestjs/core';
import { configurePlatform } from './common/http/platform-bootstrap';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  configurePlatform(app);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
