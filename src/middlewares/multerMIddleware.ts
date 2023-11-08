import multer, { FileFilterCallback } from "multer";
import fs from "fs";
import { fileValidation } from "../validations/joiValidationForFileUploads";
import { Response, NextFunction } from "express";
import { CustomError } from "../utils/CustomError";
import { CustomRequest } from "../utils/request-model";
/**
 * Middleware for handling file uploads with Multer.
 *
 * @param {CustomRequest} req - The custom request object.
 * @param {Response} res - The response object used to send the response to the client.
 * @param {NextFunction} next - The next function in the middleware chain.
 */
// method for handling the file uploads
const storage = multer.diskStorage({
  destination: (req: CustomRequest, file: Express.Multer.File, cb) => {
    cb(null, "uploads");
  },
  // Encrypting the file name of uploaded file
  filename: (req: CustomRequest, file: Express.Multer.File, cb) => {
    const fileName =
      file.originalname.split(".")[0] +
      "-" +
      Date.now() +
      "." +
      file.originalname.split(".")[1];
    cb(null, fileName);
  },
});

// Configuring the storage for Multer

export const uploads = multer({
  storage: storage,
  fileFilter: function (
    req: CustomRequest,
    file: Express.Multer.File,
    cb: FileFilterCallback
  ) {
    const { error, value } = fileValidation.validate({
      fileName: file.originalname,
    });
    if (error) {
      // invalid filename
      cb(
        new CustomError(
          400,
          "failed",
          "error in  file uploading",
          error
        ),
        false
      );
    } else {
      const mimetype:string=file.mimetype.toLowerCase()
      if(mimetype==="image/png"||mimetype==="image/jpg"||mimetype==="image/jpeg"){
        cb(null, true);
      }
      else{
        cb(new CustomError(
          523,"invalid","Invalid image format",''),false)
      }
    }
  },
  // size limit configuration for file
  limits: {
    fileSize: 1024 * 1024 * 5, //  MB
    fieldNameSize: 100, // Maximum field name size in bytes
  },
});
