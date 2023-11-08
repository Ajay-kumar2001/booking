import Joi from "joi";

export const Form1Validaton = Joi.object({
  form: Joi.string().valid("form1"),
  apartmentname: Joi.string(),
  city: Joi.string(),
  country: Joi.string(),
  pincode: Joi.number(),
  state: Joi.string(),
  streetname: Joi.string(),
});
