const Joi = require("joi");

export const create = {
  body: {
    name: Joi.string().required(),
  },
};
