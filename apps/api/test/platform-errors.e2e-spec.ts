import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { configurePlatform } from '../src/common/http/platform-bootstrap';

describe('Platform errors (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    configurePlatform(app);
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('maps UnauthorizedException to standardized envelope', async () => {
    await request(app.getHttpServer())
      .get('/auth/protected')
      .expect(401)
      .expect((response) => {
        expect(response.body).toMatchObject({
          statusCode: 401,
          error: 'Unauthorized',
          message: 'Token missing or invalid',
          path: '/auth/protected',
        });
      });
  });

  it('maps unexpected errors to the same envelope contract', async () => {
    await request(app.getHttpServer())
      .get('/errors/unexpected')
      .expect(500)
      .expect((response) => {
        expect(response.body).toMatchObject({
          statusCode: 500,
          error: 'Internal Server Error',
          message: 'Unexpected error',
          path: '/errors/unexpected',
        });
      });
  });
});
