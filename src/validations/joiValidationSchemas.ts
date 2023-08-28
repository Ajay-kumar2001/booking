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
    .pattern(/^[\w \s . _ -]{1,20}$/)
    
});

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
  apartmentname: joi.string(),
  city: joi.string(),
  country: joi.string(),
  form: joi.string(),
  pincode: joi.string().pattern(/^\d{6}$/),
  state: joi.string(),
  streetname: joi.string()
});


/**
 * Joi Schema for Hotel Category Type
 *
 * @typedef {Object} HotelCategoryTypeSchema
 * @property {string} hotelCategoryTypeTitle - The title of the hotel category type (required)
 * @property {string} hotelDiscountPrice - The discount price for the hotel category type (required)
 * @property {Array<{ title: string, code: string }>} hotelFacility - Array of hotel facilities (required)
 * @property {string} hotelOriginalPrice - The original price for the hotel category type (required)
 * @property {string} hotelTaxesPrice - The taxes price for the hotel category type (required)
 */

/**
 * Joi Schema for Hotel Room
 *
 * @typedef {Object} HotelRoomSchema
 * @property {string} hotelImage - The image of the hotel room (required)
 * @property {string} hotelRoomBedType - The bed type of the hotel room (required)
 * @property {number} hotelRoomSize - The size of the hotel room (required)
 * @property {string} hotelType - The type of the hotel room (required)
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
  hotelCategoryTypeTitle: joi.string().required(),
  hotelDiscountPrice: joi.string().required(),
  hotelFacility: joi.array().items(joi.object({
    title: joi.string().required(),
    code: joi.string().required()
  })).required(),
  hotelOriginalPrice: joi.string().required(),
  hotelTaxesPrice: joi.string().required()
});

const hotelRoomSchema = joi.object({
  hotelImage: joi.string().required(),
  hotelRoomBedType: joi.string().required(),
  hotelRoomSize: joi.number().required(),
  hotelType: joi.string().required(),
  hotelsCategories: joi.array().items(hotelCategoryTypeSchema)
});

const packageOptionSchema = joi.object({
  packageDiscountPrice: joi.number().required(),
  packageName: joi.object({
    name: joi.string().required()
  }).required(),
  packageOriginalPrice: joi.number().required()
});

const hotelSchema = joi.object({
  hotelPricesDetails: joi.object({
    hoteTotalPrice: joi.number().required(),
    hotelDiscountInPercent: joi.number().required(),
    hotelTaxStateInPercent: joi.number().required(),
    hoteltTaxCenterInPercent: joi.number().required(),
    hotelServicePrice: joi.number().required()
  }).required(),
  hotelName: joi.string().required(),
  hotelType: joi.string().required(),
  hotelImage: joi.array().items(joi.string()).required(),
  hotelDescription: joi.string().required(),
  hotelRelatedImages: joi.array().items(joi.string()).required(),
  originalHotelPrice: joi.string().required(),
  hotelPrice: joi.string().required(),
  facilities: joi.array().items(joi.string()).required(),
  rating: joi.string().required(),
  roomperguest: joi.string().required(),
  hotelAllRoomTypes: joi.array().items(hotelRoomSchema).required()
});

export const form2ValidationSchema = joi.object({
  draftId: joi.string().required(),
  hotelsList: joi.array().items(hotelSchema).required()
});