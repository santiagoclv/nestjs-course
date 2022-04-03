# Nest.js Fundamentals 

(Official Nest.js Fundamentals Course)[https://learn.nestjs.com/]

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