import { NextFunction,Response } from "express";
import { generateOTP } from "../../utils/generateOTP";
import { EmailOption } from "../../utils/EmailOptions";
import { CustomRequest } from "../../utils/request-model";
import { sendEmail } from "../../middlewares/emailHandler";
import { CustomError } from "../../utils/CustomError";
import { Otp } from "../../utils/interface-for-OTP";
import userModel from "../../models/userModel";
import { User } from "../../utils/user-interface";
declare module "express-session" {
    interface SessionData {
      user: Otp;
    }
  }
  
export const sendingEmail=async(req:CustomRequest,res:Response,next:NextFunction) =>{
    try{
        const otp = generateOTP();
        console.log(otp);
        const userEmail = process.env.USER as string;
        const email=req.email as string
        const mailOptions: EmailOption = {
          from: userEmail,
          to: userEmail,
          subject: "Login with otp",
          html: `Enter this  ${otp}  OPT to verifying the user<b></b>`,
        };
        const expirationTime: Date = new Date(Date.now() + 180000);
        const message = `OTP as beed send  successfully to this email${email}`;
        const user = await userModel.findOne({ email: email })as User;

        const userDetails: Otp = {
          userId: user._id,
          otp: otp,
          expAt: expirationTime,
        };
        req.session.user = userDetails;
        console.log(req.session)
         sendEmail(mailOptions,res,next,message)

    }catch(error){
        next(new CustomError(500,"unsuccessful","something went wrong in sending email",error));
      
    }
}