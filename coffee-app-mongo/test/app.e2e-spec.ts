import { Test, TestingModule } from '@nestjs/testing';
import * as jwt from 'jsonwebtoken';
import { closeInMongodConnection, rootMongooseTestModule } from './mongo-inmemory';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { UsersModule } from './users.module';
import { createUserStub } from './stubs/user.stub';
import { UsersRepository } from './users.repository';

describe('Users Module', () => {
  const userWill = createUserStub();
  let app: INestApplication;
  let usersRepository: UsersRepository;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        rootMongooseTestModule(),
        UsersModule
      ]
    }).compile();

    usersRepository = moduleFixture.get<UsersRepository>(UsersRepository);
    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe('/create (POST)', () => {
    it('successfully', async () => {
      const response = await request(app.getHttpServer())
        .post('/users')
        .send(userWill)
        .set('Accept', 'application/json');
  
      expect(response.status).toEqual(201);
      expect(response.body.email).toEqual(userWill.userInfo.email);
    });
  });

  describe('/users/@me (GET)', () => {
    it('successfully', async () => {
      const user = await usersRepository.findByEmail(userWill.userInfo.email);
      const jwtToken = jwt.sign({ userId: user.id }, 'secret');
      let headers = {
        'Authorization': 'Bearer ' + jwtToken
      };
      const response = await request(app.getHttpServer())
        .get('/users/@me')
        .set(headers);
  
      expect(response.status).toEqual(200);
      expect(response.body.id).toEqual(user.id);
      expect(response.body.email).toEqual(user.email);
      expect(response.body.firstName).toEqual(user.firstName);
    });

    it('bad request', async () => {
      const jwtToken = jwt.sign({ userId: 'a12345' }, 'secret');
      let headers = {
        'Authorization': 'Bearer ' + jwtToken
      };
      const response = await request(app.getHttpServer())
        .get('/users/@me')
        .set(headers);
      console.log(response.body)
      expect(response.status).toEqual(400);
      expect(response.body.email).not.toEqual(userWill.userInfo.email);
    });

    it('unauthorized', async () => {
      let headers = {};
      const response = await request(app.getHttpServer())
        .get('/users/@me')
        .set(headers);

      expect(response.status).toEqual(401);
    });
  });

  afterAll(async () => {
    await closeInMongodConnection();
    return app.close();
  });
});
