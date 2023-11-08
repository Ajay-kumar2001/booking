import { NextFunction } from "express";
import { CustomRequest } from "../../utils/request-model";
import draftStorage, { HotelDocument } from "../../models/draftModel";
import { CustomError } from "../../utils/CustomError";
/**
 * Retrieve hotelier hotel details for a specific admin.
 *
 * @param {CustomRequest} req - The custom request object containing user input and data.
 * @param {Object} res - The response object used to send the response to the client.
 * @param {NextFunction} next - The next function in the middleware chain.
 * @returns {Promise<void>} A promise that resolves with the hotelier hotel details.
 * @throws {CustomError} Throws a custom error with details if there is an issue with retrieving the details.
 */

export const hotelierhoteldetails = async (
  req: CustomRequest,
  res: any,
  next: NextFunction
): Promise<void> => {
  try {
    // const hotelierHotelDetails: any = await draftStorage.find({
    //   $and: [
    //     { Adminemail: req.email },
    //     { status: true },
    //     {"hotelsList.hotelStatus":true}
    //   ],
    // });
    const hotelierHotelDetails = await draftStorage.aggregate([
      {
        $match: { $and: [{ Adminemail: req.email }, { status: true }] }
      },
      {
        $unwind: { path: "$hotelsList" }
      },
      {
        $match: { "hotelsList.hotelStatus": true }
      },
      {
        $group: {
          _id: {
            city: "$city",       
            state: "$state",     
            country: "$country"  
          },
          hotelsList: { $push: "$hotelsList" }// pushing the hotels in to hotelsList
        }
      },
      {
        $project: {
          _id: 0, // Exclude the _id field
          city: "$_id.city",
          state: "$_id.state",
          country: "$_id.country",
          hotelsList: 1 // Include the hotelsList field
        }
      }
    ]).exec();
    
    if (hotelierHotelDetails.length) {
      res.status(200).json({
        code: res.statusCode,
        status: "success",
        data: hotelierHotelDetails,
      });
    } else {
      res.status(404).json({
        code: res.statusCode,
        status: "failed",
        message: "can't find the data",
      });
    }
  } catch (error) {
    next(
      new CustomError(
        400,
        "failed",
        "failed in  getting the hotelierhoteldetails ",
        error
      )
    );
  }
};
