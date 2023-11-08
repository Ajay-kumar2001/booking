import { NextFunction, Response } from "express";
import { CustomRequest } from "../../utils/request-model";
import {
  HotelBookingDocument,
  HotelBookingModel,
} from "../../models/hotelBookingModel";
import { CustomError } from "../../utils/CustomError";
import draftStorage, { HotelDocument } from "../../models/draftModel";
import { ObjectId } from "mongodb";
import { Payment, PaymentModel } from "../../models/paymentModel";

export const hotelBookingDetals = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const documetId: object = new ObjectId(req.body.docId);
    const hotelId: object = new ObjectId(req.body.hotelId);
    const roomCategoryId: object = new ObjectId(req.body.roomCategoryId);
    const roomCategoryId2: object = new ObjectId(req.body.roomId);
    const roomId: object = new ObjectId(req.body.roomId);

    const hotelName = req.body.hotelName;
    /**adding the customer payment detais in to  ordder collection */
    const paymentDetails = await PaymentModel.findOne({
      customerEmail: req.email,
    })as Payment;
     const orderId=paymentDetails.razorpay_order_id
     const PaymentId=paymentDetails.razorpay_payment_id
    const existOrder = await HotelBookingModel.findOne({
      $and: [{ hotelName: hotelName }, { hotelId: hotelId }],
    });
    if (existOrder) {
      const orders = {
        ...req.body.orders[0],
        userEmail: req.email,
        orderId:orderId,
        paymentId: PaymentId,
      };

      const orderDetails = await HotelBookingModel.findOneAndUpdate(
        {
          $and: [{ hotelName: hotelName }, { hotelId: hotelId }],
        },
        { $push: { orders: orders } },
        { new: true }
      );
      const { totalRooms, Occupied, vacant } =
      req.body.orders[0].hotelAllRoomTypes;
    const { roomOccupied } =
      req.body.orders[0].hotelAllRoomTypes.hotelsCategory;
    var updateCheckOut = {
      totalRooms: totalRooms,
      Occupied: Occupied,
      vacant: vacant,
      customerEmail: req.email,
      roomOccupied: roomOccupied,
    };
    if (vacant > 0) {
      updateCheckOut = {
        ...updateCheckOut,
        vacant: vacant - 1,
        Occupied: Occupied + 1,
      };
    }else{
    return   res.status(422).json({code:res.statusCode,status:"unsuccessful",message:"no rooms available"})
    }

   const updatedInhotle=await updateHotelRooms(
      documetId,
      hotelId,
      roomId,
      roomCategoryId,
      updateCheckOut
    );

      if (orderDetails&&updatedInhotle) {
       
       return res.status(200).json({
          code: res.statusCode,
          status: "successful",
          message: "hotel booking confirmed successFully",
          data:req.body
        });
      } else {
       return res.status(400).json({
          code: res.statusCode,
          status: "unsuccessful",
          message: " somthing went wrong in booking the hotel try again later",
        });
      }
    } else {
      const date = req.body.orders[0].checkIndate;
      req.body.orders[0] = { ...req.body.orders[0], userEmail: req.email,orderId:orderId,
        paymentId: PaymentId };
        const hotelDetails=await draftStorage.findOne({_id:documetId})as HotelDocument
        if(hotelDetails){
          const hotelierEmail=hotelDetails.Adminemail as string 
          req.body={...req.body,hotelierEmail:hotelierEmail}
        }else{
          return res.status(400).json({code:res.statusCode,status:"unsuccessful",message:"somthig went wrong in booking try again later"})
        }
      const newOrderDetails = await new HotelBookingModel({ ...req.body });
      if (newOrderDetails) {
        const orderId: string = String(newOrderDetails._id);
        const orders = req.body.order;
        const documentRefrance = await draftStorage
          .aggregate([
            { $match: { _id: documetId } },
            { $unwind: { path: "$hotelsList" } },
            { $match: { "hotelsList._id": hotelId } },

            {
              $project: {
                _id: 1,
                hotelsList: {
                  _id: "$hotelsList._id",
                  orders: {
                    $cond: [
                      { $eq: ["$hotelsList._id", hotelId] },
                      orders,
                      "$hotelsList.orders",
                    ],
                  },
                },
              },
            },
          ])
          .exec()
          .then(async (result) => {
            if (result.length === 0) {
               return res.status(404).json({
                code: res.statusCode,
                status: "unsuccess",
                message:
                  " somthing went wrong  can't find the hotel for booking   try again",
              });
              return;
            }
            /** if  we found one matching document*/
            const modifiedDocument = result[0];

            /**  Now, update the document in the collection*/
            draftStorage
              .findOneAndUpdate(
                { _id: documetId, "hotelsList._id": hotelId },
                {
                  $set: {
                    "hotelsList.$.orders": orderId,
                  },
                },
                {
                  new: true,
                }
              )
              .exec()
              .then(async (updatedDocument) => {
                const { totalRooms, Occupied, vacant } =
                req.body.orders[0].hotelAllRoomTypes;
              const { roomOccupied } =
                req.body.orders[0].hotelAllRoomTypes.hotelsCategory;
              var updateCheckOut = {
                totalRooms: totalRooms,
                Occupied: Occupied,
                vacant: vacant,
                customerEmail: req.email,
                roomOccupied: roomOccupied,
              };
              if (vacant > 0) {
                updateCheckOut = {
                  ...updateCheckOut,
                  vacant: vacant - 1,
                  Occupied: Occupied + 1,
                };
              }else{
              return   res.status(422).json({code:res.statusCode,status:"unsuccessful",message:"no rooms available"})
              }
               const updatedInhotle= await updateHotelRooms(
                  documetId,
                  hotelId,
                  roomId,
                  roomCategoryId,
                  updateCheckOut,
                
                );
                newOrderDetails.save();
                if (!updatedDocument&& updatedInhotle) {
                 return res.status(400).json({
                    code: res.statusCode,
                    status: "unsuccessful",
                    message: " somthing went wrong in hotel booking try again",
                  });
                } else  {

                 return res.status(200).json({
                    code: res.statusCode,
                    status: "successful",
                    message: "hotel booking confirmed successFully...",
                    data: req.body.orders[0].hotelAllRoomTypes,
                  });
                }
              })
              .catch((error) => {
                next(
                  new CustomError(
                    500,
                    "unsuccessful",
                    " error somthing went wrong in hotel booking try again",
                    error
                  )
                );
              });
          })
          .catch((error) => {
            next(
              new CustomError(
                500,
                "unsuccessful",
                "can't find the hotel for booking hotel",
                error
              )
            );
          });
      } else {
       return res.status(400).json({
          code: res.statusCode,
          status: "unsuccessful",
          message: " somthing went wrong in booking the hotel try again later",
        });
      }
    }
  } catch (error) {
    next(new CustomError(500, "faild", "internal server error", error));
  }
};

export const updateHotelRooms = async (
  documentId: object,
  hotelId: object,
  roomId: object,
  roomCategoryId: object,
  updateOptions: any
):Promise<boolean|undefined> => {
  try {
    console.log("===========updateCheckOut==================",updateOptions)

    const { totalRooms, Occupied, vacant, roomOccupied } = updateOptions;
    const updateResult = await draftStorage.findOneAndUpdate(
      { _id: documentId, "hotelsList._id": hotelId },
      {
        $set: {
          "hotelsList.$.hotelAllRoomTypes.$[room].totalRooms": totalRooms,
          "hotelsList.$.hotelAllRoomTypes.$[room].Occupied": Occupied,
          "hotelsList.$.hotelAllRoomTypes.$[room].vacant": vacant,
          "hotelsList.$.hotelAllRoomTypes.$[room].hotelsCategories.$[category].roomOccupied":true,
        },
      },
      {
        new: true,
        arrayFilters: [
          { "room._id": roomId },
          { "category._id": roomCategoryId },

        ], // Filter to specify the specific room to update
      }
    );

    if (updateResult) {
       return true;

    } else {
      return false;
    }
  } catch (error) {
    // return res.status(500)({code:res.statusCode,status:"unsuccessful",message:"something went wrong try again ",error})
  }
};
