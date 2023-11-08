import * as Joi from "joi";

export const querySchema = Joi.object({
  city: Joi.string().required(),
  check_in_date: Joi.string().isoDate().required(), // Assumes date is in ISO format (YYYY-MM-DD)
  check_out_date: Joi.string().isoDate().required(), // Assumes date is in ISO format (YYYY-MM-DD)
  roomPerChildren:Joi.number().required(),
  roomPerAdults:Joi.number().required()  

});
