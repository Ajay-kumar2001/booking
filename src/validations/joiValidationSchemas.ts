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
  apartmentname: joi.string().required(),
  city: joi.string().required(),
  country: joi.string().required(),
  form: joi.string().required(),
  pincode: joi.string().pattern(/^\d{6}$/).required(),
  state: joi.string().required(),
  streetname: joi.string().required()
});


const hotelCategorySchema = joi.object({
  hotelCategoryTypeTitle: joi.string().required(),
  hotelDiscountPrice: joi.string().required(),
  hotelFacility: joi.array().items(
    joi.object({
      title: joi.string().required(),
      code: joi.string().required(),
    })
  ),
  hotelOriginalPrice: joi.string().required(),
  hotelTaxesPrice: joi.string().required(),
});

const hotelRoomSchema = joi.object({
  hotelImage: joi.string().required(),
  hotelRoomBedType: joi.string().required(),
  hotelRoomSize: joi.number().required(),
  hotelType: joi.string().required(),
  hotelsCategories: joi.array().items(hotelCategorySchema),
});

const hotelSchema = joi.object({
  hotelName: joi.string().required(),
  hotelType: joi.string().required(),
  hotelImage: joi.string().required(),
  hotelDescription: joi.string().required(),
  hotelRelatedImages: joi.array().items(joi.string()).required(),
  originalHotelPrice: joi.string().required(),
  hotelPrice: joi.string().required(),
  facilities: joi.array().items(joi.string()).required(),
  rating: joi.string().required(),
  roomperguest: joi.string().required(),
  hotelAllRoomtypes: joi.array().items(hotelRoomSchema),
});

export const form2ValidationSchema = joi.object({
  Adminemail: joi.string().email().required(),
  form: joi.string().required(),
  existDocumentId: joi.string().required(),
  hotelsList: joi.array().items(hotelSchema),
});
