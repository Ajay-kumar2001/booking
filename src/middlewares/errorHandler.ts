import { Response, NextFunction } from "express";
import { AbstractError } from "../utils/AbstractError";
import { CustomRequest } from "../utils/request-model";
/**
 * Error handling middleware for handling custom errors and internal server errors.
 *
 * @param {Error} err - The error object.
 * @param {CustomRequest} req - The custom request object.
 * @param {Response} res - The response object used to send the error response to the client.
 * @param {NextFunction} next - The next function in the middleware chain.
 */

export const errorHandler = (
  err: Error,
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof AbstractError) {
    const { statusCode, status, message, error } = err;
    return res.status(statusCode).json({
      code: statusCode,
      status: status,
      message: message,
      errormessage: error,
    });
  } else {
    return res.status(500).json({
      code: res.statusCode,
      status: "failed",
      message: "internal server error",
    });
  }
};
