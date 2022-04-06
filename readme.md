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

`podman run -e POSTGRES_PASSWORD=pass123 -d -p 5432:5432 postgres`

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