const Joi = require("joi");

export const changePassword = {
  body: {
    newPassword: Joi.string().required(),
  },
};

export const register = {
  body: {
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  },
};

export const login = {
  body: {
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  },
};
