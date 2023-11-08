import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { OTP } from "../../utils/reqOtp-interface";
import { CustomError } from "../../utils/CustomError";
import { otpValidation } from "../../validations/OTP-validation";

export const verifyOtp = async (
  req: Request,
  res: Response,
  next: NextFunction
):Promise<Response|undefined> => {
  try {
    const body: OTP = req.body;
    const { error, value } = otpValidation.validate(body);
    if (error) {
      next(
        new CustomError(
          400,
          "unsuccessful",
          "invalid request provide the proper data ",
          error.details[0]
        )
      );
    } else {
      const { OTP } = value as OTP;
      if (req.session.user != undefined) {
        if (req.session.user.expAt < new Date(Date.now())) {
          return res
            .status(403)
            .json({
              code: res.statusCode,
              status: "unsuccessful",
              message: "otp expired",
            });
        } else {
        
          const { userId, otp } = req.session.user;
          if (otp === OTP) {
           return  res
            .status(200)
            .json({
              code: res.statusCode,
              status: "successful",
              message: "OTP verified successfully ",
            });          } else {
            return res
              .status(400)
              .json({
                code: res.statusCode,
                status: "unsuccessful",
                message: "invalid OTP ",
              });
          }
        }
      } else {
        console.log("form not session", req.session);
       return  res
          .status(403)
          .json({
            code: res.statusCode,
            status: "unsuccessful",
            message: "session  expired",
          });  
      }
    }
  } catch (error) {
    next(new CustomError(500,"unsuccessful","somthing went wrong  please try again",error))
  }
};
