const Joi = require("joi");

export const create = {
  body: {
    timesheets: Joi.array().items(
      Joi.object().keys({
        workHours: Joi.number().required(),
        projectId: Joi.number().required(),
        date: Joi.date().optional(),
        description: Joi.string().optional(),
      })
    ),
  },
};
