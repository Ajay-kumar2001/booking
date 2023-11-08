import Joi from "joi";

export const joiSchemaform3 = Joi.object({
  form: Joi.string().valid("form3"),
  hotelId: Joi.string(),
  hotelsList: Joi.array().items(
    Joi.object({
      latitude: Joi.number(),
      longitude: Joi.number(),
      selectedFacilities: Joi.array().items(Joi.string()),
      houserules: Joi.array().items(
        Joi.object({
          rule: Joi.string(),
        })
      ),
      packageOptions: Joi.array().items(
        Joi.object({
          packageDiscountPrice: Joi.number(),
          packageName: Joi.object({
            name: Joi.string(),
          }),
          packageTime:Joi.number(),
          packagePerson:Joi.number(),
          packageOriginalPrice: Joi.number(),
        })
      ),
      hotelNotAvailable: Joi.array().items(Joi.string()),
      hotelavailableDateUpto: Joi.string().isoDate(),
    })
  ),
});
