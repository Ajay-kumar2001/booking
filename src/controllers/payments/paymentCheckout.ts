import { Request, Response } from "express";
import Razorpay from "razorpay";

export const checkout = async (req: Request, res: Response): Promise<void> => {
  try {
    const key: string | undefined = process.env.RAZORPAT_KEY;
    const secret: string | undefined = process.env.RAZORPA_SECRET;
    // Creating the Razorpay instance
    const instance: Razorpay = new Razorpay({
      key_id: key as string,
      key_secret: secret as string,
    });

    // Configuring the payment options
    const options = {
      amount: req.body.amount as number,
      currency: "INR",
    };

    // Creating the order
    const order = await instance.orders.create(options);

    order
      ? res.status(200).json({
          code: res.statusCode,
          staus: "success",
          order,
        })
      : res.status(400).json({
          code: res.statusCode,
          status: "failed",
          message: "order not created",
        });
  } catch (error) {
    res.status(500).json({ message: "failed to order" });
  }
};
