import { Request, Response, NextFunction } from "express";
import { HotelBookingModel } from "../../models/hotelBookingModel";
import { ObjectId } from "mongodb";
import draftStorage from "../../models/draftModel";
import { CustomError } from "../../utils/CustomError";

export const checkIn = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const documetId: object = new ObjectId(req.body.docId);
    const hotelId: object = new ObjectId(req.body.hotelId);
    const roomId: object = new ObjectId(req.body.roomId);
    const roomCategoryId: object = new ObjectId(req.body.roomCategoryId);
    const ordersId = req.body.orderId;
console.log(documetId,roomId,roomCategoryId,ordersId)
    const updatedBooking = await HotelBookingModel.findOneAndUpdate(
      {
        hotelId: hotelId,
        docId: documetId,
        "orders.orderId": ordersId,
      },
      {
        $set: {
          "orders.$.checkIn": true,
        },
      },
      {
        new: true,
      }
    );

    const updateCheckInToHotel = await draftStorage.findOneAndUpdate(
      { _id: documetId, "hotelsList._id": hotelId },
      {
        $set: {
          "hotelsList.$.hotelAllRoomTypes.$[room].hotelsCategories.$[category].checkIn":true,
        },
      },
      {new:true,
        arrayFilters:[{"room._id":roomId},{"category._id":roomCategoryId}]
      }
    );

    if (updatedBooking&&updateCheckInToHotel) {
      res.json(updatedBooking);
    } else {
      res.status(404).json({ message: "Booking not found  please try again" });
    }
  } catch (error) {
    next(new CustomError( 500,"unsuccessful","something went wrong in check-in try again later",error))
  }
};
