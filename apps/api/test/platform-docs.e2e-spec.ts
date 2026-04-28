import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { configurePlatform } from '../src/common/http/platform-bootstrap';

describe('Platform docs (e2e)', () => {
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

  it('GET /docs returns swagger UI shell', async () => {
    await request(app.getHttpServer())
      .get('/docs')
      .expect(200)
      .expect((response) => {
        expect(response.text).toContain('swagger-ui');
      });
  });
});
