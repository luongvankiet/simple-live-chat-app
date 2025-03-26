import Joi from "@hapi/joi";

export const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  fullName: Joi.string().required(),
  password: Joi.string().min(6).required(),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});
