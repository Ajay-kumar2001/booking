import { Request, Response, NextFunction } from "express";
import { ObjectId } from "mongodb";
import draftStorage, { HotelDocument } from "../../models/draftModel";
import {
  hotelBookingDetals,
  updateHotelRooms,
} from "../users/hotelBookingDetails";
import { HotelBookingDocument, HotelBookingModel } from "../../models/hotelBookingModel";
/** Handle the checkout of a customer from a hotel room.
 *
 * @async
 * @function roomsCheckOut
 * @param {Request} req - The Express Request object.
 * @param {Response} res - The Express Response object.
 * @param {NextFunction} next - The Express NextFunction middleware.
 * @throws {Error} Throws an error if something goes wrong.
 * @returns {Response} Returns a JSON response with status and message.
 */

export const roomsCheckOut = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const documetId: object = new ObjectId(req.body.docId);
    const hotelId: object = new ObjectId(req.body.hotelId);
    const roomId: object = new ObjectId(req.body.roomId);
    const roomCategoryId: object = new ObjectId(req.body.roomCategoryId);
    const ordersId:string = req.body.orderId;
    /**Query the database for hotel room details */
    const hotelRoomDetails:any = await draftStorage
      .aggregate([
        { $match: { _id: documetId } },
        { $unwind: { path: "$hotelsList" } },
        { $match: { "hotelsList._id": hotelId } },
        { $unwind: { path: "$hotelsList.hotelAllRoomTypes" } },
        { $match: { "hotelsList.hotelAllRoomTypes._id": roomId } },
        { $unwind: { path: "$hotelsList.hotelAllRoomTypes.hotelsCategories" } },
        {
          $match: {
            "hotelsList.hotelAllRoomTypes.hotelsCategories._id": roomCategoryId,
          },
        },
      ])
      .exec();
    if (!hotelRoomDetails.length) {
      return res.status(400).json({
        code: res.statusCode,
        status: "unsuccessful",
        message: "something went wrong try again",
      });
    } else {
      /**Extract room details */
      const { totalRooms, Occupied, vacant } =
        hotelRoomDetails[0].hotelsList.hotelAllRoomTypes;
      const { roomOccupied, checkIn } =
        hotelRoomDetails[0].hotelsList.hotelAllRoomTypes.hotelsCategories;
      if (roomOccupied && checkIn) {
        var updateOptions = { totalRooms, Occupied, vacant };
        /** Calculate room availability updates */
        if (Occupied > 0) {
          updateOptions = {
            ...updateOptions,
            vacant: vacant + 1,
            Occupied: Occupied - 1,
          };
        } else {
          return res.status(422).json({
            code: res.statusCode,
            status: "unsuccessful",
            message: "there is no occupied rooms in this room type",
          });
        }
      } else {
        return res.status(422).json({
          code: res.statusCode,
          status: "unsuccessful",
          message: "for this room there is no check-in for checkout",
        });
      }
       /**updating  updateOptions details in to  paticular room of the hotel  */ 

      const updatedInhotle:boolean|undefined = await updateHotelRoomsDuringCheckOut(
        documetId,
        hotelId,
        roomId,
        roomCategoryId,
        updateOptions
      );
      /**updating the check in status  in the order collection */
      const updatingOrderCheckOut = await HotelBookingModel.findOneAndUpdate(
        { hotelId: hotelId, docId: documetId, orderId: ordersId },
        { $set: { "orders.checkIn": false } },
        { new: true }
      )as HotelBookingDocument
      if (updatedInhotle && updatingOrderCheckOut) {
        return res
          .status(200)
          .json({
            code: res.statusCode,
            status: "successful",
            message: "customer is check-out successfully",
          });
      } else {
        return res
          .status(400)
          .json({
            code: res.statusCode,
            status: "unsuccessful",
            message: "something went wrong in customer check-out",
          });
      }
    }
  } catch (error) {}
};
/**
 * Updates the hotel room details during a checkout operation.
 *
 * @param {object} documentId - The document ID.
 * @param {object} hotelId - The hotel ID.
 * @param {object} roomId - The room ID.
 * @param {object} roomCategoryId - The room category ID.
 * @param {object} updateOptions - An object containing room availability updates.
 * @returns {Promise<boolean | undefined>} - A Promise indicating the success or failure of the update operation.
 */
const updateHotelRoomsDuringCheckOut = async (
  documentId: object,
  hotelId: object,
  roomId: object,
  roomCategoryId: object,
  updateOptions: any
): Promise<boolean | undefined> => {
  try {
 
    const { totalRooms, Occupied, vacant, roomOccupied } = updateOptions;
    const updateResult = await draftStorage.findOneAndUpdate(
      { _id: documentId, "hotelsList._id": hotelId },
      {
        $set: {
          "hotelsList.$.hotelAllRoomTypes.$[room].totalRooms": totalRooms,
          "hotelsList.$.hotelAllRoomTypes.$[room].Occupied": Occupied,
          "hotelsList.$.hotelAllRoomTypes.$[room].vacant": vacant,
          "hotelsList.$.hotelAllRoomTypes.$[room].hotelsCategories.$[category].roomOccupied":
            false,
          "hotelsList.$.hotelAllRoomTypes.$[room].hotelsCategories.$[category].checkIn":
            false,
        },
      },
      {
        new: true,
        arrayFilters: [
          { "room._id": roomId },
          { "category._id": roomCategoryId },
        ], // Filter to specify the specific room to update
      }
    ) as HotelDocument;

    if (updateResult) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    // return res.status(500)({code:res.statusCode,status:"unsuccessful",message:"something went wrong try again ",error})
  }
};
