import { Response, NextFunction } from "express";
import { ObjectId } from "mongodb";
import { HotelBookingModel } from "../../models/hotelBookingModel";
import { CustomError } from "../../utils/CustomError";
import { EmailOption } from "../../utils/EmailOptions";
import { CustomRequest } from "../../utils/request-model";
import { generateOTP } from "../../utils/generateOTP";
import { sendEmail } from "../../middlewares/emailHandler";
export const hotelOrdersSearching = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const docId = new ObjectId(req.body.docId);
    const hotelId = new ObjectId(req.body.hotelId);
    const orderId = req.body.orderId;

    const userOrder = await HotelBookingModel.findOne({
      $and: [{ docId: docId }, { hotelId: hotelId }],
    });

    if (userOrder) {
      const order = userOrder.orders.find((order) => order.orderId === orderId);

      if (order) {
        // Found the order with the specified orderId
        res
          .status(200)
          .json({
            code: res.statusCode,
            status: "unsuccessful",
            message: "successfully featched the user orders",
            data: {
              hotelId: userOrder.hotelId,
              docId: userOrder.docId,
              orders: [order],
            },
          });
      } else {
        // Order with the specified orderId not found
        res
          .status(404)
          .json({
            code: res.statusCode,
            status: "unsuccessful",
            message: "Order not found",
          });
      }
    } else {
      // Document with the specified docId and hotelId not found
      res
        .status(404)
        .json({
          code: res.statusCode,
          status: "unsuccessful",
          message: "order not found in this hotel",
        });
    }
  } catch (error) {
    // Handle any errors here
    next(
      new CustomError(
        500,
        "unsuccessful",
        "something went wrong in fearching the order details try again",
        error
      )
    );
  }
};
