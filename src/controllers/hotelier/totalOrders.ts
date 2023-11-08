import { NextFunction, Request, Response } from "express";
import { HotelBookingModel } from "../../models/hotelBookingModel";

export const totalOrders = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const hotelOrders = await HotelBookingModel.find();
  if (!hotelOrders.length) {
    res
      .status(404)
      .json({
        code: res.statusCode,
        status: "unsuccessful",
        message: "can't find the orders  try again",
      });
  } else {
    res
      .status(200)
      .json({
        code: res.statusCode,
        status: "successful",
        message: "successfully fetched the orders",
        hotelorders: hotelOrders,
      });
  }
};
