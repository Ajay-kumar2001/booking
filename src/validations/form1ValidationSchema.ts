import joi from "joi";

/**
 * Joi schema for validating Form 1 details.
 *
 * @typedef {Object} Form1ValidationSchema
 * @property {string} apartmentname - Apartment name.
 * @property {string} city - City name.
 * @property {string} country - Country name.
 * @property {string} form - Form name.
 * @property {string} pincode - Pincode (6 digits).
 * @property {string} state - State name.
 * @property {string} streetname - Street name.
 */
export const form1ValidationSchema = joi.object({
  apartmentname: joi.string().trim(),
  city: joi.string(),
  country: joi.string(),
  form: joi.string(),
  pincode: joi.number(),
  state: joi.string(),
  streetname: joi.string(),
});
