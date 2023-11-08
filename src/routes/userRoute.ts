import express from "express";
import{uploads} from "../middlewares/multerMIddleware"
import{ tokenVerification} from "../middlewares/tokenVerification";
import { signup } from "../controllers/users/signup";
import { login } from "../controllers/users/login";
import { fileUploades } from "../controllers/hotelier/fileUploads";
import { hotelDetails } from "../controllers/hotelier/hotelDetails";
import { hotelDraftInfo } from "../controllers/hotelier/hotelDraftInfo";
import { updatingHotelDetails } from "../controllers/hotelier/updatingHotelDetails";
import { particularHoteldetails } from "../controllers/hotelier/particlarHoteldetails";
import { deletingParticularHotel } from "../controllers/hotelier/deletingParticularHotel";
import { roleBasedAccess } from "../middlewares/checkingroles";
import { hotelBookingDetals } from "../controllers/users/hotelBookingDetails";
import { hotelTotleDetails } from "../controllers/users/hotelTotalDetails";
import { checkout } from "../controllers/payments/paymentCheckout";
import{  paymentVerification } from "../controllers/payments/paymentVerification";
import { getKey } from "../controllers/payments/getRazorpayKey";
import rateLimit from "express-rate-limit";
import { rateLimiter } from "../middlewares/rateLimitHandler";
import {test} from "../controllers/hotelier/text";

const userRoute = express.Router();
/**
 * @swagger
 * /users/signup:
 *   post:
 *     summary: Register a new user
 *     description: Create a new user account by providing the necessary information.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               role:
 *                 type: string
 *               password:
 *                 type: string
 *               confirmpassword:
 *                 type: string
 *             required:
 *               - username
 *               - email
 *               - role
 *               - password
 *               - confirmpassword
 *     responses:
 *       201:
 *         description: User registered successfully.
 *       400:
 *         description: Bad request - missing or invalid data.
 *       409:
 *         description: User with this email already exists.
 *       500:
 *         description: Internal server error.
 */

userRoute.post("/signup", signup);
/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Login for user
 *     description: Login for user account by providing the necessary information.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - email
 *               - password
 *     responses:
 *       200:
 *         description: User logged in successfully.
 *       401:
 *         description: Bad request - Invalid credentials.
 *       400:
 *         description: Missing parameters.
 *       500:
 *         description: Internal server error.
 */
userRoute.post("/login", login);
/**
 * @swagger
 * /users/hoteldetails:
 *   post:
 *     summary: Create a new hotel listing
 *     description: Create a new hotel listing with the provided payload.
 *     tags:
 *       - hotelier hotel details
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               country:
 *                 type: string
 *               form:
 *                 type: string
 *               state:
 *                 type: string
 *               city:
 *                 type: string
 *               pincode:
 *                 type: string
 *               apartmentname:
 *                 type: string
 *               streetname:
 *                 type: string
 *               hotelsList:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/Hotel'
 *     responses:
 *       200:
 *         description: Hotel listing created successfully
 *       400:
 *         description: Bad request
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Hotel:
 *       type: object
 *       properties:
 *         hotelPricesDetails:
 *           $ref: '#/components/schemas/HotelPricesDetails'
 *         hotelName:
 *           type: string
 *         hotelType:
 *           type: string
 *         hotelImage:
 *           type: array
 *           items:
 *             type: string
 *         hotelDescription:
 *           type: string
 *         hotelRelatedImages:
 *           type: array
 *           items:
 *             type: string
 *         originalHotelPrice:
 *           type: string
 *         hotelPrice:
 *           type: string
 *         facilities:
 *           type: array
 *           items:
 *             type: string
 *         rating:
 *           type: string
 *         roomperguest:
 *           type: string
 *         hotelAllRoomTypes:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/HotelRoomType'
 *         latitude:
 *           type: string
 *         longitude:
 *           type: string
 *         selectedFacilities:
 *           type: array
 *           items:
 *             type: string
 *         houserules:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               rule:
 *                 type: string
 *         packageOptions:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/PackageOption'
 *         hotelNotAvailable:
 *           type: array
 *           items:
 *             type: string
 *         hotelavailableDateUpto:
 *           type: string
 *
 *     HotelPricesDetails:
 *       type: object
 *       properties:
 *         hoteTotalPrice:
 *           type: number
 *         hotelDiscountInPercent:
 *           type: number
 *         hotelTaxStateInPercent:
 *           type: number
 *         hoteltTaxCenterInPercent:
 *           type: number
 *         hotelServicePrice:
 *           type: number
 *
 *     HotelRoomType:
 *       type: object
 *       properties:
 *         hotelImage:
 *           type: string
 *         hotelRoomBedType:
 *           type: string
 *         hotelRoomSize:
 *           type: number
 *         hotelType:
 *           type: string
 *         hotelsCategories:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/HotelCategory'
 *
 *     HotelCategory:
 *       type: object
 *       properties:
 *         hotelCategoryTypeTitle:
 *           type: string
 *         hotelDiscountPrice:
 *           type: string
 *         hotelFacility:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               code:
 *                 type: string
 *
 *     PackageOption:
 *       type: object
 *       properties:
 *         packageDiscountPrice:
 *           type: number
 *         packageName:
 *           type: object
 *           properties:
 *             name:
 *               type: string
 *         packageOriginalPrice:
 *           type: number
 */
userRoute.post("/hoteldetails",tokenVerification,hotelDetails)
/**
 * @swagger
 * /users/hoteldetails/{draftId}:
 *   get:
 *     summary: Get hotelier information.
 *     tags:
 *       - hotelier hotel details
 *     parameters:
 *       - in: path
 *         name: draftId
 *         description: The ID of the hotel draft.
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Successful response
 *       '400':
 *         description: Invalid input or draft not found
 *       '500':
 *         description: Internal server error
 */

userRoute.get("/hoteldetails/:draftId",roleBasedAccess(["hotelier"]),tokenVerification,hotelDraftInfo)
userRoute.put("/hotels/:id",roleBasedAccess(["hotelier"]),tokenVerification,updatingHotelDetails)
/**
 * @swagger
 * /users/hotels/{params}:
 *   get:
 *     summary: Retrieve hotel details by ID.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: params
 *         schema:
 *           type: string
 *         required: true
 *         description: The unique identifier of the hotel to retrieve.
 *       - in: query
 *         name: city
 *         schema:
 *           type: string
 *         description: The city for which to retrieve hotel details.
 *       - in: query
 *         name: check_in_date
 *         schema:
 *           type: string
 *           format: date
 *         description: The check-in date for hotel reservations.
 *       - in: query
 *         name: check_out_date
 *         schema:
 *           type: string
 *           format: date
 *         description: The check-out date for hotel reservations.
 *     responses:
 *       '200':
 *         description: Success response with hotel information.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                 status:
 *                   type: string
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/HotelDocument'
 *       '404':
 *         description: Hotel not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                 status:
 *                   type: string
 *                 message:
 *                   type: string
 *       '400':
 *         description: Bad Request - Invalid parameters.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                 status:
 *                   type: string
 *                 message:
 *                   type: string
 */  


userRoute.get("/hotels/:params",tokenVerification,hotelTotleDetails)
/**
 * @swagger
 * /users/uploads:
 *   post:
 *     summary: Upload a file and get an image URL
 *     description: Uploads a file and returns an image URL.
 *     tags:
 *       - File Upload
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               File:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Successful file upload.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 200
 *                 imageUrl:
 *                   type: string
 *                   example: http://example.com/uploads/image.jpg
 *       400:
 *         description: Bad Request. An error occurred during the upload.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 400
 *                 message:
 *                   type: string
 *                   example: bad request
 *       500:
 *         description: Internal Server Error. An unexpected error occurred.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 500
 *                 message:
 *                   type: string
 *                   example: Internal Server Error
 */

userRoute.post("/uploads",uploads.single("File"),fileUploades )

/**
 * @swagger
 * /users/particularhotels:
 *   get:
 *     summary: Retrieve particular hotel details based on query parameters for updating the hotel details.
 *     description: Retrieve particular hotel details based on query parameters, including docId and hotelId.
 *     tags:
 *       - hotelier hotel details
 *     parameters:
 *       - name: docId
 *         in: query
 *         schema:
 *           type: string
 *         description: The document ID.
 *       - name: hotelId
 *         in: query
 *         schema:
 *           type: string
 *         description: The hotel ID.
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 200
 *                   description: The HTTP status code.
 *                 data:
 *                   type: array
 *                   description: Array of hotel details.
 *                   items:
 *                     $ref: '#/components/schemas/HotelDetails'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 400
 *                   description: The HTTP status code.
 *                 message:
 *                   type: string
 *                   example: "Bad request"
 *                   description: A brief error message.
 *                 errors:
 *                   type: array
 *                   description: An array of validation errors.
 *                   items:
 *                     type: object
 *                     properties:
 *                       field:
 *                         type: string
 *                         example: "docId"
 *                         description: The field that caused the validation error.
 *                       message:
 *                         type: string
 *                         example: "Invalid value"
 *                         description: The error message for the field.
 *       401:
 *         description: Unauthorized
 */
userRoute.get("/particularhotels",roleBasedAccess(["hotelier"]),tokenVerification,particularHoteldetails)

/**
 * @swagger
 * /users/hotels:
 *   delete:
 *     summary: Delete a particular hotel document based on query parameters.
 *     description: Delete a particular hotel document from draftStorage based on the provided query parameters.
 *     tags:
 *       - hotelier hotel details
 *     parameters:
 *       - name: docId
 *         in: query
 *         schema:
 *           type: string
 *         description: The document ID.
 *       - name: hotelId
 *         in: query
 *         schema:
 *           type: string
 *         description: The hotel ID.
 *     responses:
 *       200:
 *         description: Hotel deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 200
 *                   description: The HTTP status code.
 *                 message:
 *                   type: string
 *                   example: "Hotel deleted successfully"
 *                   description: A success message.
 *       400:
 *         description: Bad request or invalid query parameters.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 400
 *                   description: The HTTP status code.
 *                 message:
 *                   type: string
 *                   example: "Bad request"
 *                   description: A brief error message.
 *                 errors:
 *                   type: array
 *                   description: An array of validation errors.
 *                   items:
 *                     type: object
 *                     properties:
 *                       field:
 *                         type: string
 *                         example: "docId"
 *                         description: The field that caused the validation error.
 *                       message:
 *                         type: string
 *                         example: "Invalid value"
 *                         description: The error message for the field.
 *       404:
 *         description: Document not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 404
 *                   description: The HTTP status code.
 *                 message:
 *                   type: string
 *                   example: "Document not found"
 *                   description: A message indicating that the document was not found.
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 500
 *                   description: The HTTP status code.
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 *                   description: A message indicating an internal server error.
 */
userRoute.delete("/hotels",deletingParticularHotel)
/**
 * @swagger
 * /users/hotels/bookingdetails:
 *   post:
 *     summary: Create a hotel booking details.
 *     description: Create a hotel booking details with the provided payload.
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/HotelBookingPayload'
 *     responses:
 *       200:
 *         description: Successfully created hotel booking details.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Provided booking details have been saved successfully.
 *       400:
 *         description: Failed to create hotel booking details.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 400
 *                 status:
 *                   type: string
 *                   example: unsuccessful
 *                 message:
 *                   type: string
 *                   example: Provided booking details have not been saved. Please provide proper data.
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 500
 *                 status:
 *                   type: string
 *                   example: faild
 *                 message:
 *                   type: string
 *                   example: Internal server error.
 *                 error:
 *                   type: string
 *                   example: Unexpected error occurred.
 * components:
 *   schemas:
 *     HotelBookingPayload:
 *       type: object
 *       properties:
 *         hotelName:
 *           type: string
 *         hotelId:
 *           type: string
 *         hotelFulladdress:
 *           type: string
 *         hotelImage:
 *           type: string
 *         checkIndate:
 *           type: string
 *           format: date
 *         checkoutdate:
 *           type: string
 *           format: date
 *         noOfDays:
 *           type: integer
 *         noOfGuest:
 *           type: integer
 *         onlinePaymentMethod:
 *           type: boolean
 *         offlinePaymentMethod:
 *           type: boolean
 *         breakfast:
 *           $ref: '#/components/schemas/HotelBreakfastPackage'
 *         hotelPricesDetails:
 *           $ref: '#/components/schemas/HotelPricesDetails'
 *         hotelAllRoomTypes:
 *           $ref: '#/components/schemas/HotelRoomType'
 *         guestDetails:
 *           $ref: '#/components/schemas/GuestDetails'
 *     HotelBreakfastPackage:
 *       type: object
 *       properties:
 *         packageName:
 *           type: string
 *         packageTime:
 *           type: integer
 *         packageOriginalPrice:
 *           type: number
 *         packageDiscountPrice:
 *           type: number
 *         packagePersions:
 *           type: integer
 *         packageId:
 *           type: integer
 *         packageDescription:
 *           type: string
 *     HotelPricesDetails:
 *       type: object
 *       properties:
 *         hoteTotalPrice:
 *           type: number
 *         hotelDiscountInPercent:
 *           type: number
 *         hotelTaxStateInPercent:
 *           type: number
 *         hoteltTaxCenterInPercent:
 *           type: number
 *         hotelServicePrice:
 *           type: number
 *     HotelRoomType:
 *       type: object
 *       properties:
 *         hotelType:
 *           type: string
 *         hotelImage:
 *           type: string
 *         hotelRoomSize:
 *           type: number
 *         hotelTaxesPrice:
 *           type: number
 *         hotelRoomBedType:
 *           type: string
 *         hotelsCategory:
 *           $ref: '#/components/schemas/HotelCategory'
 *     HotelCategory:
 *       type: object
 *       properties:
 *         hotelFacility:
 *           type: array
 *           items:
 *             type: string
 *         hotelCategoryTypeTitle:
 *           type: string
 *         hotelOriginalPrice:
 *           type: number
 *         hotelDiscountPrice:
 *           type: number
 *     GuestDetails:
 *       type: object
 *       properties:
 *         guestName:
 *           type: string
 *         guestLastName:
 *           type: string
 *         guestEmail:
 *           type: string
 *         guestMobileNo:
 *           type: string
 */

userRoute.post("/hotels/bookingdetails",tokenVerification,hotelBookingDetals)
/**
 * @swagger
 * /users/checkout:
 *   post:
 *     summary: Create a payment order.
 *     description: Create a payment order using Razorpay with the provided payload.
 *     tags:
 *      - payment details
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *     responses:
 *       200:
 *         description: Successfully created a payment order.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 200
 *                 status:
 *                   type: string
 *                   example: success
 *                 order:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     amount:
 *                       type: number
 *                     currency:
 *                       type: string
 *       400:
 *         description: Failed to create a payment order.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 400
 *                 status:
 *                   type: string
 *                   example: failed
 *                 message:
 *                   type: string
 *                   example: Order not created.
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 500
 *                 message:
 *                   type: string
 *                   example: Failed to create a payment order.
 */

userRoute.post("/checkout",checkout );
/**
 * @swagger
 * /users/getkeys:
 *   get:
 *     summary: Get the Razorpay API key.
 *     description: Retrieve the Razorpay API key for processing payments.
 *     tags:
 *       - payment details
 *     responses:
 *       200:
 *         description: Successfully retrieved the Razorpay API key.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 razorpay_key:
 *                   type: string
 *                   example: your_razorpay_api_key
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 500
 *                 message:
 *                   type: string
 *                   example: Failed to retrieve the Razorpay API key.
 */

userRoute.get("/getkeys",rateLimiter,getKey)
/**
 * @swagger
 * /users/paymentverification:
 *   post:
 *     summary: Verify a payment using Razorpay.
 *     description: Verify a payment using the provided payment details.
 *     tags:
 *      - payment details
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               razorpay_payment_id:
 *                 type: string
 *               razorpay_order_id:
 *                 type: string
 *               razorpay_signature:
 *                 type: string
 *     responses:
 *       200:
 *         description: Payment verified successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 200
 *                 status:
 *                   type: string
 *                   example: success
 *       400:
 *         description: Invalid payment details or issue in storing payment details.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 400
 *                 status:
 *                   type: string
 *                   example: failed
 *                 message:
 *                   type: string
 *                   example: Invalid payment details or issue in storing payment details.
 *       401:
 *         description: Unauthorized. The provided signature does not match the expected signature.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 401
 *                 status:
 *                   type: string
 *                   example: failed
 *                 message:
 *                   type: string
 *                   example: Unauthorized
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 500
 *                 message:
 *                   type: string
 *                   example: Internal server error.
 */


userRoute.post("/paymentverification",tokenVerification, paymentVerification);
userRoute.get("/test",tokenVerification,test)

export default userRoute;
