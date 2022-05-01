import { Test, TestingModule } from '@nestjs/testing';
import * as jwt from 'jsonwebtoken';
import { closeInMongodConnection, rootMongooseTestModule } from './mongo-inmemory';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { CoffeeModule } from './coffee.module';
import { createCoffeeStub } from './stubs/coffee.stub';
import { CoffeeRepository } from './coffees.repository';

describe('Coffee Module', () => {
  const coffeeMocca = createCoffeeStub();
  let app: INestApplication;
  let coffeesRepository: CoffeeRepository;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        rootMongooseTestModule(),
        CoffeeModule
      ]
    }).compile();

    coffeesRepository = moduleFixture.get<CoffeeRepository>(CoffeeRepository);
    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe('/create (POST)', () => {
    it('successfully', async () => {
      const response = await request(app.getHttpServer())
        .post('/coffees')
        .send(coffeeMocca)
        .set('Accept', 'application/json');
  
      expect(response.status).toEqual(201);
      expect(response.body.email).toEqual(coffeeMocca.coffeeInfo.email);
    });
  });

  describe('/coffees/:id (GET)', () => {
    it('successfully', async () => {
      const coffee = await coffeesRepository.findByEmail(coffeeMocca.coffeeInfo.email);
      const jwtToken = jwt.sign({ coffeeId: coffee.id }, 'secret');
      let headers = {
        'Authorization': 'Bearer ' + jwtToken
      };
      const response = await request(app.getHttpServer())
        .get('/coffees/:id')
        .set(headers);
  
      expect(response.status).toEqual(200);
      expect(response.body.id).toEqual(coffee.id);
    });

    it('bad request', async () => {
      const jwtToken = jwt.sign({ coffeeId: 'a12345' }, 'secret');
      let headers = {
        'Authorization': 'Bearer ' + jwtToken
      };
      const response = await request(app.getHttpServer())
        .get('/coffees/:id')
        .set(headers);
      expect(response.status).toEqual(400);
    });

    it('unauthorized', async () => {
      let headers = {};
      const response = await request(app.getHttpServer())
        .get('/coffees/:id')
        .set(headers);

      expect(response.status).toEqual(401);
    });
  });

  afterAll(async () => {
    await closeInMongodConnection();
    return app.close();
  });
});
