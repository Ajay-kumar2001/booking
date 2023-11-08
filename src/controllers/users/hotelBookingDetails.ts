import { NextFunction, Response } from "express";
import { CustomRequest } from "../../utils/request-model";
import {
  HotelBookingDocument,
  HotelBookingModel,
} from "../../models/hotelBookingModel";
import { CustomError } from "../../utils/CustomError";

export const hotelBookingDetals = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    req.body.id = req.id;
    req.body.email = req.email;
    const bookingDetails: HotelBookingDocument =
      await new HotelBookingModel<HotelBookingDocument>(req.body);
    if (await bookingDetails.save()) {
      res.status(200).json({
        code: res.statusCode,
        message: "provided  booking details  as been saved successfully",
      });
    } else {
      res.status(400).json({
        code: res.statusCode,
        status: "unsuccessful",
        message:
          "provided booking details  as been not saved provide the proper data ",
      });
    }
  } catch (error) {
    next(new CustomError(500, "faild", "internal server error", error));
  }
};
