import { NextFunction, Response } from "express";
import { CustomRequest } from "../../utils/request-model";
import draftStorage from "../../models/draftModel";

export const test = async (
  req: CustomRequest,
  res: Response,
  nex: NextFunction
) => {
  console.log("from test", req.email);
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
        hotelsList: { $push: "$hotelsList" }
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
  
  res.send(hotelierHotelDetails);
};
