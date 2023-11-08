import { NextFunction } from "express";
import { CustomRequest } from "../../utils/request-model";
import draftStorage from "../../models/draftModel";
import { CustomError } from "../../utils/CustomError";
import { SearchQuery } from "../../utils/query-interface -for-search";
import { querySchema } from "../../validations/searchParamsValidatn";
import { number } from "joi";
/**
 * Search for hotels based on query parameters, including city, check-in date, and check-out date.
 *
 * @param {CustomRequest} req - The custom request object containing user input and data.
 * @param {Object} res - The response object used to send the response to the client.
 * @param {NextFunction} next - The next function in the middleware chain.
 * @param {Query} queryParams - The query parameters for searching hotels.
 * @returns {Promise<void>} A promise that resolves with the search results.
 * @throws {CustomError} Throws a custom error with details if there is an issue with validation, retrieving data, or an internal server error occurs.
 */

export const searching = async (
  req: CustomRequest,
  res: any,
  next: NextFunction,
  queryParams: SearchQuery
): Promise<void> => {
  try {
    //validating the query params
    var { error, value } = querySchema.validate(queryParams);
    if (error) {
      next(
        new CustomError(400, "failed", "provoid the valid query params", error)
      );
    } else {
      const { city, check_in_date, check_out_date,roomPerAdults,roomPerChildren } = value as SearchQuery;

      const checkInDate = check_in_date.split("T")[0];
      console.log(checkInDate)
      const totalHotelList = await draftStorage
        .aggregate([
          { $match: { city: city } },
          { $unwind: { path: "$hotelsList" } },
          {
            $match: {
              "hotelsList.hotelNotAvailable": { $nin: [checkInDate] },
            },
          },
          {$unwind:{path:"$hotelsList.hotelAllRoomTypes"}},
          {$unwind:{path:"$hotelsList.hotelAllRoomTypes.hotelsCategories"}},
          {$match:{
          "hotelsList.hotelAllRoomTypes.hotelsCategories.roomPerChildren":{$gte:roomPerChildren},
          "hotelsList.hotelAllRoomTypes.hotelsCategories.roomPerAdults":{$gte:roomPerAdults}}
        }
        ])
        .exec();
        console.log("from searching  ",totalHotelList)
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
    }
  } catch (error) {
    next(
      new CustomError(
        500,
        "failed",
        "internal server error  unable to search hotel details ",
        error
      )
    );
  }
}