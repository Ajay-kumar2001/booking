import {  Response } from "express";
import crypto from "crypto";
import { Payment, PaymentModel } from "../../models/paymentModel";
import { CustomRequest } from "../../utils/request-model";
import userModel from "../../models/userModel";

export const paymentVerification = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  try {
    console.log("form paymentVerification", req.body);
    if (req.body) {
      const { razorpay_payment_id, razorpay_order_id, razorpay_signature } =
        req.body;
      const secret = process.env.RAZORPAT_SECRET as string;

      // Generating the signature by using payment_id and order_id
      const body = `${razorpay_order_id}|${razorpay_payment_id}`;
      const expectedSignature = crypto
        .createHmac("sha256", "Q5FIbuYC57b2AWsZxz0mos8K")
        .update(body.toString())
        .digest("hex");
      // Checking the generated signature and received signature
      const user =await userModel.findOne({_id:req.id})
      if ((razorpay_signature === expectedSignature)&&user) {
        const paymentDetails: Payment = new PaymentModel({
          userId: user.id,
          userName:user.name,
          customerEmail:user.email,
          razorpay_payment_id,
          razorpay_order_id,
          razorpay_signature,
          userEmail:req.email
        });
        // Storing the payment details
        if (paymentDetails) {
          await paymentDetails.save();
          res
            .status(200)
            .json({ code: res.statusCode, message: "verified successfully" });
        } else {
          res.status(400).json({
            status: "failed",
            message: "Issue in storing payment details",
          });
        }
      } else {
        res.status(401).json({
          code: res.statusCode,
          status: "failed",
          message: "Unauthorized",
        });
      }
    } else {
      res.status(400).json({
        code: res.statusCode,
        status: "failed",
        message: "Invalid credentials",
      });
    }
  } catch (error) {
    res.status(400).json({ message: error });
  }
};
