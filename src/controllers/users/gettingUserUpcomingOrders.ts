import { NextFunction, Response } from "express";
import {
  HotelBookingDocument,
  HotelBookingModel,
} from "../../models/hotelBookingModel";
import { CustomRequest } from "../../utils/request-model";

export const gettingUserUpcomingOrders = async (
  req:CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (req.email!= undefined) {
       const currentDate= new Date(Date.now()).toISOString().split("T")[0]
       console.log(currentDate)
      const userUpcomingOrders: HotelBookingDocument[] =
      await HotelBookingModel.aggregate([
        {
          $unwind: "$orders" // Unwind the "orders" array
        },
        {
          $match: {
            "orders.userEmail": req.email,
            "orders.checkInDate": { $gte: currentDate }
          }
        },
        {
          $project: {
            _id: "$_id",
            hotelId: "$hotelId",
            docId: "$docId",
            hotelName: "$hotelName",
            orders: {
              $cond: [
                { $eq: ["$orders.userEmail", req.email] },
                "$orders",
                null
              ]
            }
          }
        },
        {
          $group: {
            _id: "$_id",
            hotelId: { $first: "$hotelId" },
            docId: { $first: "$docId" },
            hotelName: { $first: "$hotelName" },
            orders: { $push: "$orders" }
          }
        }
      ]).exec()
        if (userUpcomingOrders.length){
            res
            .status(200)
            .json({
              code: res.statusCode,
              status: "successful",
              message: "successfully featched user upcoming Orders",
              upcomingOrders: userUpcomingOrders,
            });
        }else{
            res
            .status(404)
            .json({
              code: res.statusCode,
              status: "unsuccessful",
              message: "can't find the upcoming orders of the user ",
              upcomingOrders: userUpcomingOrders,
            });  
        }
      
    }
  } catch (error) {}
};
