import express from "express";
import  { signup, login  ,uploades, hotelDetails ,hotelDraftInfo} from "../controllers/userController";
import{ tokenVerification }from "../middlewares/userMiddlewares";
const userRoute = express.Router();
/**
 * @swagger
 * /api/signup:
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
 *               confirmPassword:
 *                 type: string
 *             required:
 *               - username
 *               - email
 *               - role
 *               - password
 *               - confirmPassword
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
 * /api/login:
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

userRoute.post("/hoteldetails",tokenVerification,hotelDetails)
// userRoute.post("/uploads",uploads.array("file",12),uploades)
userRoute.get("/hoteldetails/:draftId",tokenVerification,hotelDraftInfo)
export default userRoute;
