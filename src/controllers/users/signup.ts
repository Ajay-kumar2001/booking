import { Response, NextFunction } from "express";
import userModel from "../../models/userModel";
import jwt from "jsonwebtoken";
import bycrpt from "bcrypt";
import { CustomRequest } from "../../utils/request-model";
import { signupSchema } from "../../validations/JoiValidationForSignup";
import { CustomError } from "../../utils/CustomError";
/**
 *
 * @param id
 * @returns token for login
 */
const signToken = (user: any) => {
  return jwt.sign({ ...user }, String(process.env.JWT_SECRET), {
    expiresIn: String(process.env.JWT_EXPIRES_IN),
  });
};

/**
 * Method for signup for user
 * @param req
 * @param res
 * @param next
 */
export const signup = async (req: CustomRequest, res: Response) => {
  try {
    // Validate the incoming data with the  joi signupSchema
    let { error, value } = signupSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        code: res.statusCode,
        error: error.details[0].message,
        message: "bad reques",
      });
    }
    // If validation passes, the data will be available in the `value` object
    const { name, email, role, password, confirmpassword } = value;

    if (password !== confirmpassword) {
      return res.status(400).json({
        error: "Passwords don't match",
        code: res.statusCode,
      });
    }

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res
        .status(409)
        .json({ error: "User already exsist", code: res.statusCode });
    }

    const hashedPassword = await bycrpt.hash(password, 10);

    let newUser = await userModel.create({
      name,
      email,
      role,
      password: hashedPassword,
    });
    res.status(201).json({
      status: "success",
      code: res.statusCode,
      data: {
        newUser,
      },
      request_time: req.requestTime,
      message: "You had been signed up successfully",
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      code: res.statusCode,
      message: res.statusMessage,
    });
  }
};
