// const { error } = require("console");
// const jwt = require("jsonwebtoken");
// import multer, { FileFilterCallback } from "multer";
// import fs from "fs";
// import { fileValidation } from "../validations/joiValidationSchemas";
// import {  Response, NextFunction } from "express";
// import { AbstractError } from "../utils/AbstractError";
// import { CustomError } from "../utils/CustomError";
// import userModel from "../models/userModel";
// import { CustomRequest } from "../utils/request-model";

// //method for verifying the token expiration time
// export const tokenVerification =async (req: CustomRequest, res: any, next: any) => {
//   try {
//     const token = req.header("authorization");

//     // Verifying the token for token expiration
//     jwt.verify(token, process.env.JWT_SECRET, async (error: any, decoded: any) => {
//       if (error) {
//         return res
//           .status(401)
//           .json({
//             code: res.statusCode,
//             status: "failed",
//             message: " invalid Token ",
//           });
//       } else {
//         req.email=decoded._doc.email 
//         console.log("email fro verifecation",req.email)
//         // Convert to milliseconds
//         const expirationTime = decoded.exp * 1000;
//         // Get current time in milliseconds
//         const currentTime = new Date().getTime();
//         // Checking the token expiration time with the current time
//         if (expirationTime > currentTime) {
//           console.log(expirationTime, currentTime);
//           next();
//         } else {
//           console.log(expirationTime, currentTime);
//           res.status(401).json({
//             status: "unsuccessful",
//             code: res.statusCode,
//             message: "Unauthorized",
//           });
//         }
//       }
//     });
//   } catch (error) {
//     res.status(500).json({
//       status: "unSuccessful",
//       code: res.statusCode,
//       message: "internal server error",
//     });
//   }
// };

// // method for handling the file uploads
// const storage = multer.diskStorage({
//   destination: (req: CustomRequest, file: Express.Multer.File, cb) => {
//     const uploadDir = "C:/Users/booking-management/booking-management-master/uploads";
//     if (!fs.existsSync(uploadDir)) {
//       fs.mkdirSync(uploadDir);
//     }
//     cb(null, uploadDir);
//   },
//   // Encrypting the file name of uploaded file
//   filename: (req: CustomRequest, file: Express.Multer.File, cb) => {
//     console.log("multer", file.originalname);
//     cb(
//       null,
//       file.originalname.split(".")[0] +
//         "-" +
//         Date.now() +
//         "." +
//         file.originalname.split(".")[1]
//     );
//   },
// });

// // Configuring the storage for Multer

// export const uploads = multer({
//   storage: storage,
//   fileFilter: function (
//     req: CustomRequest,
//     file: Express.Multer.File,
//     cb: FileFilterCallback
//   ) {
//     const { error, value } = fileValidation.validate({
//       fileName: file.originalname,
//     });
//     if (error) {
//       // invalid filename
//       cb(
//         new CustomError(
//           "error in  file uploading",
//           400,
//           "failed",
//           error.message
//         ),
//         false
//       );
//     } else {
//       // valid filename
//       cb(null, true);
//     }
//   },
//   // size limit configuration for file
//   limits: {
//     fileSize: 1024 * 1024 * 1, //  MB
//     fieldNameSize: 100, // Maximum field name size in bytes
//   },
// });


// //error handling middleware

// export const errorHandler = (
//   err: Error,
//   req: CustomRequest,
//   res: Response,
//   next: NextFunction
// ) => {
//   if (err instanceof AbstractError) {
//     const { statusCode, status, message, error } = err;
//    console.log("from middleware",error)
//     return res.status(statusCode).json({
//       code: statusCode,
//       status: status,
//       message: message,
//       errormessage: error,
//     });
//   }
// else{
//   return res.status(500).json({
//     code: res.statusCode,
//     status: "failed",
//     message: "internal server error",
//     errormessage: error,
//   });
// }
// };
