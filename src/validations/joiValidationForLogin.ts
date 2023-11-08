import joi from "joi";

/**
 * Joi schema for validating user login details.
 *
 * @typedef {Object} LoginSchema
 * @property {string} email - User's email (valid email format).
 * @property {string} password - User's password (1-8 characters, alphanumeric and special characters allowed).
 */
export const loginSchema = joi.object({
  email: joi
    .string()
    .required()
    .email()
    .min(1)
    .max(30)
    .pattern(/^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/),
  password: joi
    .string()
    .required()
    .pattern(/^[\w \s $ @ # % & * ]{1,8}$/),
});
