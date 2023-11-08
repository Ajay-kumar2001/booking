import { Request, Response } from 'express';

export const getKey = (req: Request, res: Response): void => {
  res.status(200).json({ razorpay_key: process.env.RAZORPAT_KEY as string });
};

