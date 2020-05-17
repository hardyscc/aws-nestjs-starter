import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/notification (POST)', () => {
    return request(app.getHttpServer())
      .post('/notification')
      .send({
        targetId: 'device1',
        userId: 'user1',
        content: 'Hello',
      })
      .expect(201);
  });

  it('/notification (GET)', () => {
    return request(app.getHttpServer())
      .get('/notification?userId=dummy')
      .expect(200)
      .expect([]);
  });
});
