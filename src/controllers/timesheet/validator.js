const Joi = require("joi");

export const create = {
  body: {
    timesheets: Joi.array().items(
      Joi.object().keys({
        workHours: Joi.number().required(),
        date: Joi.date().optional(),
      })
    ),
  },
};
