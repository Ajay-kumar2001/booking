import { NextFunction } from "express";
import draftStorage, { HotelDocument } from "../../models/draftModel";
import { CustomRequest } from "../../utils/request-model";
/**
 * Retrieve hotel draft details for a specific hotel.
 *
 * @param {CustomRequest} req - The custom request object containing user input and data.
 * @param {Object} res - The response object used to send the response to the client.
 * @param {NextFunction} next - The next function in the middleware chain.
 * @returns {Promise<void>} A promise that resolves with the hotel draft details.
 */

export const hoteldraftdetails = async (
  req: CustomRequest,
  res: any,
  next: NextFunction
): Promise<void> => {
  const draft: HotelDocument | null = await draftStorage.findOne({
    $and: [{ Adminemail: req.email }, { status: false }],
  });
  const existHotelListDraft: HotelDocument | null = await draftStorage.findOne({
    $and: [
      { Adminemail: req.email },
      { status: true },
      { hotelsListStatus: false },
    ],
  });
  if (draft && !draft.status) {
    res.status(200).json({
      code: res.statusCode,
      status: "success",
      message: "this is existing draft of this admin",
      data: draft,
    });
  } else if (
    existHotelListDraft &&
    existHotelListDraft.status &&
    !existHotelListDraft.hotelsListStatus
  ) {
    res.status(200).json({
      code: res.statusCode,
      status: "success",
      message: "this is the existing draft of this admin",
      data: existHotelListDraft.hotelsList[
        existHotelListDraft.hotelsList.length - 1
      ],
    });
  } else {
    res.status(400).json({
      code: res.statusCode,
      status: "failed",
      message: " no draft exist ",
    });
  }
};
