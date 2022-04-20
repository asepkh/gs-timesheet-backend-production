const Joi = require("joi");

export const create = {
  body: {
    value: Joi.number().required(),
    date: Joi.date().required(),
  },
};

export const update = {
  body: {
    value: Joi.number().required(),
    date: Joi.date().required(),
  },
};

export const remove = {
  params: {
    id: Joi.string().required(),
  },
};
