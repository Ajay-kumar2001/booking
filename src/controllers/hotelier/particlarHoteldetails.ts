import { Response, NextFunction } from "express";
import { CustomRequest } from "../../utils/request-model";
import draftStorage from "../../models/draftModel";
import { CustomError } from "../../utils/CustomError";
import { ObjectId } from "mongodb";
import { QuaryParams } from "../../utils/query-Iinterface-for-paticularHoteldetails";
import { joiValidationForQueryParams } from "../../validations/joiValidationForQueryParams";
/**
 * Retrieve particular hotel details based on query parameters, including docId and hotelId.
 *
 * @param {CustomRequest} req - The custom request object containing user input and data.
 * @param {Object} res - The response object used to send the response to the client.
 * @param {NextFunction} next - The next function in the middleware chain.
 * @returns {Promise<void>} A promise that resolves with the particular hotel details.
 * @throws {CustomError} Throws a custom error with details if there is an issue with retrieving the details or if validation fails.
 */

export const particularHoteldetails = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const queryParams: QuaryParams = req.query as unknown as QuaryParams;
    const { error, value } = joiValidationForQueryParams.validate(queryParams);
    if (error) {
      next(
        new CustomError(400, "failed", "provide the proper query params", error)
      );
    } else {
      const { docId, hotelId } = value;

      if (docId && hotelId) {
        //getting of particular hotel for the hotel list
        const documentId = new ObjectId(docId);
        const paticularHotelId = new ObjectId(hotelId);
        const getHotelDetails = await draftStorage
          .aggregate([
            { $match: { _id: documentId } },
            { $unwind: { path: "$hotelsList" } },
            { $match: { "hotelsList._id": paticularHotelId } },
          ])
          .exec();
        if (getHotelDetails) {
          return res
            .status(200)
            .json({ code: res.statusCode, data: getHotelDetails });
        } else {
          return res
            .status(400)
            .json({ code: res.statusCode, message: "error in getting data" });
        }
      } else if (docId) {
        //getting   hotel address
        const documentId = new ObjectId(docId);
        const getHotelDetails = await draftStorage
          .aggregate([
            { $match: { _id: documentId } },
            {
              $project: {
                country: 1,
                state: 1,
                pincode: 1,
                apartmentname: 1,
                streetname: 1,
                city: 1,
              },
            },
          ])
          .exec();
        if (getHotelDetails) {
          return res
            .status(200)
            .json({ code: res.statusCode, data: getHotelDetails });
        }
      } else {
        return res.status(400).json({
          code: res.statusCode,
          message: "provide the proper id's in the  query",
        });
      }
    }
  } catch (error) {}
};
