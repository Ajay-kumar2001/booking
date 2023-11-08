import { NextFunction, Response } from "express";
import nodemailer from "nodemailer";
import { CustomError } from "../utils/CustomError";
import { EmailOption } from "../utils/EmailOptions";
export const sendEmail = async (
  mailOptions: EmailOption,
  res: Response,
  next: NextFunction,
  message:string,
): Promise<void> => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
       user:process.env.USER,
       pass:process.env.PASS,
      },
    });
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error)

        next(
          new CustomError(500, "unsuccess", "error in sending email", error)
        );
      } else {
        res.status(200).json({
          code: res.statusCode,
          status: "successful",
          message: message,
        });
      }
    });
  } catch (error) {
    next(new CustomError(500,"unsuccessful","something went wrong in sending email",error));
}
};
