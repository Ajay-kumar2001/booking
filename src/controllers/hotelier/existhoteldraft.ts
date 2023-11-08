import { NextFunction } from "express";
import { CustomRequest } from "../../utils/request-model";
import draftStorage, { HotelDocument } from "../../models/draftModel";
import { CustomError } from "../../utils/CustomError";
/**
 * Check if a hotel draft with a specific ID exists and return the corresponding data.
 *
 * @param {CustomRequest} req - The custom request object containing user input and data.
 * @param {Object} res - The response object used to send the response to the client.
 * @param {NextFunction} next - The next function in the middleware chain.
 * @param {string} draftId - The ID of the hotel draft to check for existence.
 * @returns {Promise<void>} A promise that resolves once the check is complete.
 * @throws {CustomError} Throws a custom error with details if an internal server error occurs.
 */

export const existHotelDraft = async (
  req: CustomRequest,
  res: any,
  next: NextFunction,
  draftId: string
): Promise<void> => {
  try {
    const getDraft: HotelDocument | null = await draftStorage.findOne({
      $and: [{ Adminemail: req.email }, { _id: draftId }],
    });
    if (getDraft && getDraft && !getDraft.status) {
      return res.status(200).json({
        code: res.statusCode,
        status: "success",
        data: getDraft,
      });
    } else if (getDraft && getDraft.status && !getDraft.hotelsListStatus) {
      return res.status(200).json({
        code: res.statusCode,
        status: "success",
        data: getDraft.hotelsList[getDraft.hotelsList.length - 1],
      });
    }
  } catch (error) {
    next(new CustomError(500, "failed", "internal error", error));
  }
};
