import { NextFunction, Request, Response } from "express";
import draftStorage from "../../models/draftModel";
import { CustomError } from "../../utils/CustomError";

export const searchingWithCountrty = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { country } = req.query;
    const hotels = await draftStorage.find({ country: country });
    if (hotels.length) {
      res
        .status(200)
        .json({
          code: res.statusCode,
          status: "successful",
          message: "successfully featched holtes based on country",
          data: hotels,
        });

    }
    else{
        res
        .status(400)
        .json({
          code: res.statusCode,
          status: "unsuccessful",
          message: "can't featched holtes based on country",
        });
    }
  } catch (error) {
    next(new CustomError(500,"unsuccessful","somthing went wrong in featching hotels with country",error))
  }
};
