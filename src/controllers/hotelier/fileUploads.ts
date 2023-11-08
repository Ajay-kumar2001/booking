import { Response, NextFunction } from "express";
import { CustomRequest } from "../../utils/request-model";
import { CustomError } from "../../utils/CustomError";
import { UploadedFile } from "../../utils/interface-for-fileData";
const imageToBase64 = require("image-to-base64");
/**
 * Handles the upload process and sends a response with status "ok".
 * This function does not perform any actual file upload, it's just a placeholder for demonstration purposes.
 * It throws a CustomError with "internal server error" message and 500 status code for testing error handling.
 *
 * @param {CustomRequest} req - The request object containing the upload data and other information.
 * @param {Response} res - The response object to send the result back to the client.
 * @param {NextFunction} next - The next middleware function in the request-response cycle.
 * @returns {void} - This function does not return a value explicitly, but sends a response with status "ok".
 * @throws {CustomError} - Throws a CustomError with "internal server error" message and 500 status code.
 */

export const fileUploades = (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const fileData: UploadedFile = req.file as UploadedFile;
    const { path } = fileData;

    if (path) {
      const imageUrl =
        `http://${process.env.IP_ADDRESS}:${process.env.PORT}/` + path;
      res.status(200).json({ code: res.statusCode, imageUrl: imageUrl });
    } else {
      res.status(400).json({ code: res.statusCode, message: "" });
    }
  } catch (error) {
    next(
      new CustomError(
        400,
        "failed",
        "error in generating  the image URL",
        error
      )
    );
  }
};
