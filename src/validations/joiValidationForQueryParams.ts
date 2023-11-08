import Joi from "joi";

export const joiValidationForQueryParams = Joi.object({
  docId: Joi.string().min(1).max(30),
  hotelId: Joi.string().min(1).max(30),
});
