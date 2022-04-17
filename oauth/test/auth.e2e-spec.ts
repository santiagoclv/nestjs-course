import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
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

  it('/auth/register (POST)', () => {
    return request(app.getHttpServer())
      .post('/auth/register')
      .send({
        "first_name": "first_name",
        "last_name": "last_name",
        "email": "email",
        "password": "password",
        "password_confirm": "password"
      })
      .expect(201);
  });

  it('/auth/register (POST) password do not match error', () => {
    return request(app.getHttpServer())
      .post('/auth/register')
      .send({
        "first_name": "first_name",
        "last_name": "last_name",
        "email": "email",
        "password": "password",
        "password_confirm": "password"
      })
      .expect(400);
  });
});
