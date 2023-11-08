import { NextFunction, Request, Response } from "express";
import { HotelBookingModel } from "../../models/hotelBookingModel";
import { GuestReviewModel } from "../../models/guestReviewMdel";
import { CLIENT_RENEG_LIMIT } from "tls";

export const getHotelReviews = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const params = req.params;
  const { id } = params;
  const hotelReviews = await GuestReviewModel.findById({ _id: id });
  if (!hotelReviews) {
    res
      .status(404)
      .json({
        code: res.statusCode,
        status: "unsuccessful",
        message: "can't find the reviews  of this hotel try again",
      });
  } else {
    res
      .status(200)
      .json({
        code: res.statusCode,
        status: "successful",
        message: "successfully featched the hotelReviews",
        hotelorders: hotelReviews,
      });
  }
};
