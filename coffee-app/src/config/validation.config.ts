import * as Joi from '@hapi/joi';

export default Joi.object({
  environment: Joi.string(),
  database: Joi.object({
    host: Joi.required(),
    port: Joi.number().default(5432),
  })
});