import joi from "joi";

/**
 * Joi Schema for Hotel Category Type
 *
 * @typedef {Object} HotelCategoryTypeSchema
 * @property {string} roomCategoryTypeTitle - The title of the hotel category type (required)
 * @property {string} roomDiscountInPercentage - The discount price for the hotel category type (required)
 * @property {Array<{ title: string, code: string }>} roomFacility - Array of hotel facilities (required)
 * @property {string} roomOriginalPrice - The original price for the hotel category type (required)
 * @property {string} roomServicesPrice - The taxes price for the hotel category type (required)
 */

/**
 * Joi Schema for Hotel Room
 *
 * @typedef {Object} HotelRoomSchema
 * @property {string} hotelImage - The image of the hotel room (required)
 * @property {string} hotelRoomBedType - The bed type of the hotel room (required)
 * @property {number} hotelRoomSize - The size of the hotel room (required)
 * @property {string} roomType - The type of the hotel room (required)
 * @property {Array<HotelCategoryTypeSchema>} hotelsCategories - Array of hotel category types
 */

/**
 * Joi Schema for Package Option
 *
 * @typedef {Object} PackageOptionSchema
 * @property {number} packageDiscountPrice - The discount price for the package (required)
 * @property {{ name: string }} packageName - The name of the package (required)
 * @property {number} packageOriginalPrice - The original price for the package (required)
 */

/**
 * Joi Schema for Hotel
 *
 * @typedef {Object} HotelSchema
 * @property {Object} hotelPricesDetails - Details of hotel prices (required)
 * @property {number} hotelPricesDetails.hoteTotalPrice - Total price of the hotel (required)
 * @property {number} hotelPricesDetails.hotelDiscountInPercent - Discount percentage (required)
 * @property {number} hotelPricesDetails.hotelTaxStateInPercent - State tax percentage (required)
 * @property {number} hotelPricesDetails.hoteltTaxCenterInPercent - Center tax percentage (required)
 * @property {number} hotelPricesDetails.hotelServicePrice - Service price (required)
 * @property {string} hotelName - The name of the hotel (required)
 * @property {string} hotelType - The type of the hotel (required)
 * @property {Array<string>} hotelImage - Array of hotel images (required)
 * @property {string} hotelDescription - Description of the hotel (required)
 * @property {Array<string>} hotelRelatedImages - Array of related images (required)
 * @property {string} originalHotelPrice - Original price of the hotel (required)
 * @property {string} hotelPrice - Price of the hotel (required)
 * @property {Array<string>} facilities - Array of facilities (required)
 * @property {string} rating - The rating of the hotel (required)
 * @property {string} roomperguest - The room per guest information (required)
 * @property {Array<HotelRoomSchema>} hotelAllRoomTypes - Array of hotel rooms (required)
 */

/**
 * Joi Schema for Form Data
 *
 * @typedef {Object} FormDataSchema
 * @property {string} draftId - The ID of the draft (required)
 * @property {Array<HotelSchema>} hotelsList - Array of hotel data (required)
 */

const hotelCategoryTypeSchema = joi.object({
  roomCategoryTypeTitle: joi.string().required(),
  roomDiscountInPercentage: joi.number().required(),
  roomFacility: joi
    .array()
    .items(
      joi.object({
        title: joi.string().required(),
        code: joi.string().required(),
      })
    )
    .required(),
roomOriginalPrice: joi.number().required(),
  roomServicesPrice: joi.number().required(),
});

const hotelRoomSchema = joi.object({
  hotelImage: joi.string().required(),
  hotelRoomBedType: joi.string().required(),
  hotelRoomSize: joi.number().required(),
  hotelRoomType: joi.string().required(),
  hotelsCategories: joi.array().items(hotelCategoryTypeSchema),
});

const packageOptionSchema = joi.object({
  packageDiscountPrice: joi.number().required(),
  packageName: joi
    .object({
      name: joi.string().required(),
    })
    .required(),
  packageOriginalPrice: joi.number().required(),
});

const hotelSchema = joi.object({
  hotelPricesDetails: joi
    .object({
      hotelTotalPrice: joi.number().required(),
      hotelDiscountInPercent: joi.number().required(),
      hotelTaxStateInPercent: joi.number().required(),
      hotelTaxCenterInPercent: joi.number().required(),
      hotelServicePrice: joi.number().required(),
    })
    .required(),
  hotelName: joi.string().required(),
  hotelAddress:joi.string().required(),
  hotelType: joi.string().required(),
  hotelImage: joi.array().items(joi.string()).required(),
  hotelDescription: joi.string().required(),
  hotelRelatedImages: joi.array().items(joi.string()).required(),
  facilities: joi.array().items(joi.string()).required(),
  rating: joi.number().required(),
  roomperguest: joi.number().required(),
  hotelAllRoomTypes: joi.array().items(hotelRoomSchema).required(),
});

export const form2ValidationSchema = joi.object({
  form: joi.string().required(),
  draftId: joi.string().required(),
  hotelsList: joi.array().items(hotelSchema).required(),
});
