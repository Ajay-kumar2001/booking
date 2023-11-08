import { NextFunction, Request, Response } from "express";
import {
  HotelBookingDocument,
  HotelBookingModel,
} from "../../models/hotelBookingModel";
import { CustomRequest } from "../../utils/request-model";

export const getOrders = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const params = req.params;
  const { id } = params;
  const hotelOrders = await HotelBookingModel.find({
    $and: [ { hotelierEmail: req.email }],
  }) 
  if (!hotelOrders.length) {
    res.status(404).json({
      code: res.statusCode,
      status: "unsuccessful",
      message: "can't find the orders  of this hotel try again",
    });
  } else {
    res.status(200).json({
      code: res.statusCode,
      status: "successful",
      message: "successfully featched the orders",
      hotelorders: hotelOrders,
    });
  }
};
