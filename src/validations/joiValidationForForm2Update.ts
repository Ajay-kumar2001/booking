import Joi from "joi";

const hotelCategoryTypeSchema = Joi.object({
  roomCategoryTypeTitle: Joi.string(),
  roomDiscountInPercentage: Joi.number(),
  roomNumber:Joi.string().required(),
  roomOccupied:Joi.boolean().required(),
  roomPerChildren:Joi.number().required(),
   roomPerAdults:Joi.number().required(),
   roomNotAvailable:Joi.array().items(Joi.string()).required(),
  roomFacility: Joi.array().items(
    Joi.object({
      title: Joi.string(),
      code: Joi.string(),
    })
  ),
  roomOriginalPrice: Joi.number(),
   roomServicesPrice: Joi.number(),
});

const hotelRoomTypeSchema = Joi.object({
  totalRooms:Joi.string(),
  Occupied:Joi.number(),
  vacant:Joi .number(),
  hotelImage: Joi.string(),
  hotelRoomBedType: Joi.string(),
  hotelRoomSize: Joi.number(),
  hotelRoomType: Joi.string(),
  hotelsCategories: Joi.array().items(hotelCategoryTypeSchema),
});

const hotelPricesDetailsSchema = Joi.object({
  hotelTotalPrice: Joi.number(),
  hotelDiscountInPercent: Joi.number(),
  hotelTaxStateInPercent: Joi.number(),
  hotelTaxCenterInPercent: Joi.number(),
  hotelServicePrice: Joi.number(),
});

const hotelSchema = Joi.object({
  hotelPricesDetails: hotelPricesDetailsSchema, // Include hotelPricesDetails
  hotelName: Joi.string(),
  hotelAddress: Joi.string(),
  hotelType: Joi.string(),
  hotelImage: Joi.array().items(Joi.string()),
  hotelDescription: Joi.string(),
  hotelRelatedImages: Joi.array().items(Joi.string()),
  originalHotelPrice: Joi.string(),
  hotelPrice: Joi.string(),
  facilities: Joi.array().items(Joi.string()),
  rating: Joi.number(),
  roomperguest: Joi.number(),
  hotelAllRoomTypes: Joi.array().items(hotelRoomTypeSchema),
});
    
const hotelsListSchema = Joi.array().items(hotelSchema);

export const joiSchemaform2 = Joi.object({
  form: Joi.string(),
  hotelId: Joi.string(),
  hotelsList: hotelsListSchema,
});
