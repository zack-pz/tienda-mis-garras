import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { configurePlatform } from '../src/common/http/platform-bootstrap';

describe('Platform validation (e2e)', () => {
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

  it('accepts valid payload', async () => {
    await request(app.getHttpServer())
      .post('/validation/sample')
      .send({ name: 'Zack' })
      .expect(201)
      .expect({ accepted: true, name: 'Zack' });
  });

  it('rejects invalid payload with standardized envelope', async () => {
    await request(app.getHttpServer())
      .post('/validation/sample')
      .send({ name: 'a' })
      .expect(400)
      .expect((response) => {
        expect(response.body).toMatchObject({
          statusCode: 400,
          error: 'Bad Request',
          path: '/validation/sample',
        });
        expect(Array.isArray(response.body.message)).toBe(true);
        expect(typeof response.body.timestamp).toBe('string');
      });
  });
});
