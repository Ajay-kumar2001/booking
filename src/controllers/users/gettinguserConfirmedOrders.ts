import { NextFunction, Response } from "express";
import {
  HotelBookingDocument,
  HotelBookingModel,
} from "../../models/hotelBookingModel";
import { CustomRequest } from "../../utils/request-model";
import orders from "razorpay/dist/types/orders";

export const gettinguserConfirmedOrders = async (
  req:CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (req.email!= undefined) {
       const currentDate= new Date(Date.now()).toISOString().split("T")[0]
       console.log(currentDate)
      const userCompletedOrders: HotelBookingDocument[] =
      await HotelBookingModel.aggregate([
        {
          $unwind: "$orders" 
        },
        {
          $match: {
            "orders.userEmail": req.email,
            "orders.checkOutDate": { $lte: currentDate },
            $or:[{"orders.onlinePaymentMethod":true},{"orders.offlinePaymentMethod":true}]
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
        if (userCompletedOrders.length){
            res
            .status(200)
            .json({
              code: res.statusCode,
              status: "successful",
              message: "successfully featched user completed Orders",
              completedOrders: userCompletedOrders,
            });
        }else{
            res
            .status(404)
            .json({
              code: res.statusCode,
              status: "unsuccessful",
              message: "can't find the completed orders of the user ",
              upcomingOrders: userCompletedOrders,
            });  
        }
      
    }
  } catch (error) {}
};
