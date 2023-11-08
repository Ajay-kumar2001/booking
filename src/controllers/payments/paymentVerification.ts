import { Request, Response } from "express";
import crypto from "crypto";
import { IPayment, PaymentModel } from "../../models/paymentModel";

export const paymentVerification = async (
  req: Request,
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
      if (razorpay_signature === expectedSignature) {
        const paymentDetails: IPayment = new PaymentModel({
          razorpay_payment_id,
          razorpay_order_id,
          razorpay_signature,
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
