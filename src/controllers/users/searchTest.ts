import { NextFunction, Request ,Response} from "express";
import { querySchema } from "../../validations/searchParamsValidatn";
import { CustomError } from "../../utils/CustomError";
import { SearchQuery } from "../../utils/query-interface -for-search";
import draftStorage from "../../models/draftModel";

export const searchTest=async(req:Request,res:Response,next:NextFunction)=>{
    try{
        const queryParams=req.query
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