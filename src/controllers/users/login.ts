import { Response, NextFunction } from "express";
import userModel from "../../models/userModel";
import jwt from "jsonwebtoken";
import bycrpt from "bcrypt";
import { CustomRequest } from "../../utils/request-model";
import { loginSchema } from "../../validations/joiValidationForLogin";
import { CustomError } from "../../utils/CustomError";

/**
 *
 * @param id
 * @returns token for login
 */
const signToken = (user: any) => {
  
  
  return jwt.sign({ ...user }, String(process.env.JWT_SECRET), {
    expiresIn:3600 ,
  });
};

/**
 * Single method to handle token for the login
 * @param req
 * @param user
 * @param statusCode
 * @param res
 * @param message
 */
const createSenderToken = (
  req: CustomRequest,
  user: CustomRequest["body"],
  statusCode: number,
  res: Response,
  message: string
) => {
  const token = signToken(user);
  // const expirationDate = new Date();
  // expirationDate.setDate(expirationDate.getDate() + Number(process.env.JWT_EXPIRES_IN));
  // // console.log(new Date(  Date.now() +    Number(process.env.JWT_EXPIRES_IN) * 24 * 60 * 60 * 1000))
  // const cookiesOption = {
  //   expires: expirationDate,
  //   httpOnly: true,
  // };

  //  res.cookie("jwt", token);

  user.password = undefined;

  res.status(statusCode).json({
    status: "success",
    code: res.statusCode,
    token,
    data: {
      user,
    },
    request_time: req.requestTime,
    message: message,
  });
};

/**
 * Handles user login authentication.
 *
 * @async
 * @param {CustomRequest} req - The request object containing the login data (email and password).
 * @param {Response} res - The response object to send the result back to the client.
 * @returns {Promise<void>} - A promise that resolves after processing the login request.
 *
 * @throws {Error} - Throws an error if there is an unexpected issue during the login process.
 */

export const login = async (req: CustomRequest, res: Response) => {
  // Validate the incoming data with  the joi  loginSchema
  let { error, value } = loginSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      code: res.statusCode,
      error: error.details[0].message,
      message: "bad request",
    });
  }
  // If validation passes, the data will be available in the `value` object
  const { email, password } = value;

  if (!email || !password) {
    return res.status(400).json({
      status: "error",
      code: res.statusCode,
      message: "Please provide email or password",
    });
  }

  const user = await userModel.findOne({ email }).select("+password");

  if (!user) {
    // User with the provided email not found in the database
    return res.status(401).json({ error: "Invalid credentials" });
  }

  if (typeof user.password !== "string") {
    return res.status(500).json({
      status: "error",
      code: res.statusCode,
      message: "Unexpected error occurred",
    });
  }

  const passwordMatch = await bycrpt.compare(password, user.password);

  if (!passwordMatch) {
    // User with the provided email  is not found in the database
    return res.status(401).json({
      status: "error",
      code: res.statusCode,
      message: "Password is incorrect",
    });
  }

  createSenderToken(req, user, 200, res, "You had been logged in successfully");
};
