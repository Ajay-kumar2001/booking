import { NextFunction, Response } from "express";
import { CustomRequest } from "../utils/request-model";
import { CustomError } from "../utils/CustomError";
const jwt = require("jsonwebtoken");
export const roleBasedAccess = (
  permission: string[]
): ((req: CustomRequest, res: Response, next: NextFunction) => void) => {
  return (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
      const token: string | undefined = req.header("authorization");
      if (token) {
        permission.includes(jwt.verify(token, process.env.JWT_SECRET)._doc.role)
          ? next()
          : res
              .status(401)
              .json({
                code: res.statusCode,
                status: "failed",
                message: "unAuthorized can't access",
              });
      }
    } catch (error) {
      next(new CustomError(500, "failed", "internal server error", error));
    }
  };
};
