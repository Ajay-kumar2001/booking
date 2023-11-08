import joi from "joi";

/**
 * Joi schema for validating file names.
 *
 * @typedef {Object} FileValidationSchema
 * @property {string} fileName - File name (1-20 characters, alphanumeric, spaces, periods, underscores, and hyphens allowed).
 */
export const fileValidation = joi.object({
  fileName: joi
    .string()
    .required()
    .max(20)
    .min(1)
    .pattern(/^[\w \s . _ -]{1,20}$/),
});
