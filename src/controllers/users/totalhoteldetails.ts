import { NextFunction } from "express";
import { CustomRequest } from "../../utils/request-model";
import draftStorage, { HotelDocument } from "../../models/draftModel";
/**
 * Retrieve the total hotel details.
 *
 * @param {CustomRequest} req - The custom request object containing user input and data.
 * @param {Object} res - The response object used to send the response to the client.
 * @param {NextFunction} next - The next function in the middleware chain.
 * @returns {Promise<void>} A promise that resolves with the total hotel details.
 */

export const totalhoteldetails = async (
  req: CustomRequest,
  res: any,
  next: NextFunction
): Promise<void> => {
  const totalHotelList: any = await draftStorage.find({
    $and: [{ status: true }, { hotelsListStatus: true }],
  });
  if (totalHotelList.length) {
    res.status(200).json({
      code: res.statusCode,
      status: "success",
      message: "total hotle  information",
      data: totalHotelList,
    });
  } else {
    res.status(404).json({
      code: res.statusCode,
      status: "failed",
      message: "can't find the data",
    });
  }
};
