import joi from "joi";
/**
 * Joi schema for validating user signup details.
 *
 * @typedef {Object} SignupSchema
 * @property {string} name - User's name (1-30 characters, alphabets only).
 * @property {string} email - User's email (valid email format).
 * @property {string} password - User's password (1-8 characters, alphanumeric and special characters allowed).
 * @property {string} confirmpassword - Confirmed password (must match the 'password' field).
 * @property {string} role - User's role (1-10 characters, alphabets only).
 */
export let signupSchema = joi
  .object({
    name: joi
      .string()
      .required()
      .max(30)
      .min(1)
      .pattern(/^[A-Za-z]{1,30}$/),
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
    confirmpassword: joi.ref("password"),
    role: joi
      .string()
      .required()
      .min(1)
      .max(10)
      .pattern(/^[a-zA-Z\s]{1,10}$/),
  })
  .with("password", "confirmpassword");
