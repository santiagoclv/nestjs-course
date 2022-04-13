# Nest.js Fundamentals 

[Official Nest.js Fundamentals Course](https://learn.nestjs.com/)

A framework to work with node.js that let us focusing on feature development and it takes care of config and architecture.


## Useful Commands

* `$ nest generate controller {name}` // Generates a new Controller
* `$ nest generate service {name}` // Generates a new Service (Business logic)
* `$ nest generate module {name}` // Generates a new bundle and import it from its closest module
* `$ nest generate class coffees/dto/create-coffee.dto --no-spec` // input & output interfaces from controllers
    + Input Validators for the DTOs thorough the pipeline validators, based on the dtos.
        First install `npm install class-validator class-transformer`
        It could even throw error based on the dtos.
    + To create update-coffee.dto based on creat-coffee.dto
        First install `npm install @nestjs/mapped-types`
        Use PartialType to define update-coffee without repeting code
        PartialType extends from create-coffee but all its properties as optionals
        And also it inherits all its validation rules.


## SQL - Postgres
### NPM Install
* pg
* @nestjs/typeorm
* TypeORM


## Custom Providers

Custom instance of our provider instead of having Nest instantiate the class for us

* Override a class with a **mock** for testing or a value version for testing or specific uses

```ts
export class MockCoffeesService { }

@Module({
  providers: [
    {
      provide: CoffeesService,
      useValue: new MockCoffeesService(), // <-- mock implementation
    }
  ]
})
export class CoffeesModule {}
```

* Create a provider that is not a class with **useValue** for specific uses

```ts
// String-valued token
{
  provide: 'COFFEE_BRANDS', // This could be a constant defined somewhere else.
  useValue: ['buddy brew', 'nescafe'] // array of coffee brands,
},

// Injecting string-valued token into CoffeesService
@Injectable()
export class CoffeesService {
  constructor(@Inject('COFFEE_BRANDS') coffeeBrands: string[]) {}
}

/* coffees.constants.ts File */
export const COFFEE_BRANDS = 'COFFEE_BRANDS';
```

* Using a different syntax to the previous example but using the **useClass** 
    ** **Strategy Pattern**: Provide an abstract class and interchange the real implementation based on different conditions

```ts
// "useClass" syntax example
{
  provide: ConfigService,
  useClass:
    process.env.NODE_ENV === 'development'
      ? DevelopmentConfigService
      : ProductionConfigService,
},
```

* **useFactory** Useful when we want to determine the instance of a provider based on the value of other providers (service or factory).


```ts
// "useFactory" syntax example
{
  provide: 'COFFEE_BRANDS',
  useFactory: () => ['buddy brew', 'nescafe']
}
```

```ts
@Injectable()
export class SomeFactory { 
    create() {
        return `Something`
    }
}

@Module({
  providers: [
    SomeFactory,
    {
      provide: CoffeesService,
      inject: [SomeFactory]
      useFactory: (someFactory: SomeFactory) => someFactory.create;
    }
  ]
})
export class SomethingModule {}
```

* Asynchronous **useFactory** (async provider example)
```ts
{
  provide: 'COFFEE_BRANDS',
  // Note "async" here, and Promise/Async event inside the Factory function 
  // Could be a database connection / API call / etc
  // In our case we're just "mocking" this type of event with a Promise
  useFactory: async (connectionTypeORM: Connection): Promise<string[]> => {
    // const coffeeBrands = await connectionTypeORM.query('SELECT * ...');
    const coffeeBrands = await Promise.resolve(['buddy brew', 'nescafe'])
    return coffeeBrands;
  },
  inject: [Connection],
}
```

### Dynamic Module

This is useful when the module being imported by other module needs to be customised to be used by the module importing the module. Similar to **Strategy Pattern**

Common examples of Dynamic modules are: TypeOrmModule.forRoot, TypeOrmModule.forFeature

```bash
# Generate a DatabaseModule
nest g mo database
```

```ts
// Initial attempt at creating "CONNECTION" provider, and utilizing useValue for values */
import { createConnection } from 'typeorm';

@Module({
  providers: [
    {
      provide: 'CONNECTION',
      useValue: createConnection({
        type: 'postgres',
        host: 'localhost',
        port: 5432
      }),
    }
  ]
})


// ---------------------------------

// Improved Dynamic Module way of creating CONNECTION provider
import { DynamicModule, Module } from '@nestjs/common';
import { createConnection } from 'typeorm';

@Module({})
export class DatabaseModule {
  static register(options: ConnectionOptions): DynamicModule {
    return {
      module: DatabaseModule, // Same Class module
      providers: [
        {
          provide: 'CONNECTION', // 
          useValue: createConnection(options), 
        }
      ]
    }
  }
}

// Utilizing the dynamic DatabaseModule in another Modules imports: []
imports: [
  DatabaseModule.register({ //  passing in dynamic values
    type: 'postgres',
    host: 'localhost',
    password: 'password',
  })
]
```


### Control Providers Scope

There are 3 types of scopes, **DEFAULT** (which are singleton), **TRANSIENT** and **REQUEST**

```ts
// Scope DEFAULT - This is assumed when NO Scope is entered like so: @Injectable() */
@Injectable({ scope: Scope.DEFAULT })
export class CoffeesService {}

// -------------

/** 
 * Scope TRANSIENT 
  
 * Transient providers are NOT shared across consumers (Modules or places where the providers have been used). 
 * Each consumer that injects a transient provider will receive a new, dedicated instance of that provider. 
 */
@Injectable({ scope: Scope.TRANSIENT })
export class CoffeesService {}

// Example of how a Scope could be used only over a sigle consumer.
// Scope TRANSIENT with a Custom Provider
{
  provide: 'COFFEE_BRANDS',
  useFactory: () => ['buddy brew', 'nescafe'],
  scope: Scope.TRANSIENT // 
}

// -------------

/**
 * Scope REQUEST ()
 * It could have impact on peformance
 * Request scope provides a new instance of the provider exclusively for each incoming request.
 *
 * IMPORTANT! If you inject a provider in a controller it became of scope REQUEST too
 */
@Injectable({ scope: Scope.REQUEST })
export class CoffeesService {}

/**
 * Scope REQUEST has an extra special feature
 * IMPORTANT! If you inject a provider in a controller it became of scope REQUEST too
 * They can inject the ORIGINAL Request object for that instance and access things like header and cookies
 */
@Injectable({ scope: Scope.REQUEST })
export class CoffeesService {
  constructor(@Inject(REQUEST) private request: Request) {} // 👈
}

```

## Nest Env Configuration Service

`npm i @nestjs/config`
`npm install @hapi/joi`
`npm install --save-dev @types/hapi__joi`

```ts

/**
 * Configuration file necesary to load on ConfigModule.
 * /src/config/app.config.ts File 
 *
 */
export default () => ({
  environment: process.env.NODE_ENV || 'development',
  database: {
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT, 10) || 5432
  }
});


/**
 * Schema validation ( Joi neccessary dependencies for this example )
 * /src/config/validation.config.ts File 
 * 
 */
import * as Joi from 'joi';

export default const validationSchema = Joi.object({
  environment: Joi.required(),
  database: Joi.object({
    host: Joi.required(),
    port: Joi.number().default(5432),
  })
});

/**
 * To specify another path (or file) to get the env variables
 */
import { ConfigModule } from '@nestjs/config';
import appConfig from './config/app.config';
import validationConfig from './config/validation.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.environment’,
      load: [appConfig], // 👈
      validationSchema: validationConfig
    }),
  ],
})
export class AppModule {}

/** 
 * Have ConfigModule *ignore* .env files 
 * Useful when using Provider UI's such as Heroku, etc (and they handle all ENV variables)
 */
ConfigModule.forRoot({
  ignoreEnvFile: true,
});

/* Utilize ConfigService */
import { ConfigService } from '@nestjs/config';

constructor(
  private readonly configService: ConfigService, // 👈
) {}

/* Accessing process.env variables from ConfigService */
const databaseHost = this.configService.get<string>('database.host');
console.log(databaseHost);

/**
 * ASYNC Load env variables because changes in the order of the load of modules (ConfigModule.)
 * Example using async provider example from useFactory
 */

TypeOrmModule.forRootAsync({ // 👈
  useFactory: () => ({
    type: 'postgres',
    host: process.env.DATABASE_HOST,
    port: +process.env.DATABASE_PORT,
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    autoLoadEntities: true,
    synchronize: true,
  }),
}),
```

## Additional building blocks.

* **Exception filters** (Process and handle unespected exceptions on responses)
* **Pipes** (Transformations and Validations)
* **Guards** (Authorizations, Authentication)
* **Interceptors** (Middlewares?)

This blocks can be bind to these scopes:

* **Globally**-scoped, 
* **Controller**-scoped, 
* **Method**-scoped, 
* **Param**-scoped (It's available to Pipes only.)

### Exception filters
`nest g filter common/filters/filter-name-exception`

### Guards
`nest g guard common/guards/guards-name`

Attention!: When the Guard needs to be injected with some demendencies you can not use globalContext.

See the custom @ Public decorator and CommonModule for more information.

### Interceptors

`nest g interceptor common/interceptors/wrap-response`

* bind extra logic before or after method execution
* transform the result returned from a method
* transform the exception thrown from a method
* extend basic method behavior
* even completely overriding a method - depending on a specific condition (for example: doing something like caching various responses)

* Another technique useful for Interceptors is to extend the basic function behavior by applying RxJS operators to the response stream.

### Pipes

* Transformation: where we transform input data to the desired output
* Validation: where we evaluate input data and if valid, simply pass it through unchanged. If the data is NOT valid - we want to throw an exception.

`nest g pipe common/pipes/parse-int`

## Middleware 
(**This are executed before the route handler and any other building block**)

`nest g middleware common/middleware/logging`

Middleware functions have access to the request and response objects, and are not specifically tied to any method, but rather to a specified route PATH.

Middleware functions can perform the following tasks:

* executing code
* making changes to the request and the response objects.
* ending the request-response cycle.
* Or even calling the next middleware function in the call stack.

When working with middleware, if the current middleware function does not END the request-response cycle, it must call the next() method, which passes control to the next middleware function. Otherwise, the request will be left hanging - and never complete.

## Custom Decorator with createParamDecorator where we can get info from request.

This example is a simple Protocol deocrator that return the protocol from the requests.

```ts
import {
    createParamDecorator,
    ExecutionContext,
} from '@nestjs/common';

export const Protocol = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
      const request = ctx.switchToHttp().getRequest();
      return request.protocol;
    },
);

```

## OpenAPI documentation with Swagger

`npm install --save @nestjs/swagger swagger-ui-express`



````json
  // added on nest-cli.json, helps auto detect properties on endpoints
  "compilerOptions": {
    "deleteOutDir": true,
    "plugins": ["@nestjs/swagger/plugin"]
  }
```

```ts
// First create the option object
const options = new DocumentBuilder()
  .setTitle('Iluvcoffee')
  .setDescription('Coffee application')
  .setVersion('1.0')
  .build();

// the document to serve
const document = SwaggerModule.createDocument(app, options);

// startup over `/api`
SwaggerModule.setup('api', app, document);
```