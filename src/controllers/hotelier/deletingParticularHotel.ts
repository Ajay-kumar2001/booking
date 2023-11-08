import { Response, NextFunction } from "express";
import { CustomRequest } from "../../utils/request-model";

import draftStorage, { HotelDocument } from "../../models/draftModel";
import { CustomError } from "../../utils/CustomError";
import { ObjectId } from "mongodb";
import { checkingForExistingHotel } from "../../utils/checkingforexistinghotel";
import { QuaryParams } from "../../utils/query-Iinterface-for-paticularHoteldetails";
import { joiValidationForQueryParams } from "../../validations/joiValidationForQueryParams";
/**
 * Deletes a particular hotel document from the draftStorage based on the provided query parameters.
 *
 * @param {CustomRequest} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @param {NextFunction} next - The Express next function.
 * @returns {Promise<void>} A Promise that resolves once the operation is complete.
 * @throws {CustomError} If there's an error during the operation.
 */

export const deletingParticularHotel = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const queryParams: QuaryParams = req.query as unknown as QuaryParams;
    //validating the query params
    const { error, value }: any =
      joiValidationForQueryParams.validate(queryParams);
    if (error) {
      next(
        new CustomError(
          400,
          "failed",
          "enter the proper id in query params",
          error
        )
      );
    } else {
      const { hotelId, docId } = value;
      if (docId && hotelId) {
        const documentId: object = new ObjectId(docId);
        const particularHotelId: object = new ObjectId(hotelId);
        const updatedDocument: HotelDocument | null =
          await draftStorage.findOneAndUpdate(
            { _id: documentId },
            { $pull: { hotelsList: { _id: particularHotelId } } },
            { new: true } // To return the updated document
          );
  
        if (!updatedDocument) {
          return res
            .status(404)
            .json({ code: res.statusCode, message: "Document not found" });
        } else {
          //function to check if hotelList  contains hotels  or not
          const value = await checkingForExistingHotel(docId);

          res.status(200).json({
            code: res.statusCode,
            message: "Hotel deleted successfully",
          });
        }
      } else if (docId) {
        const documentId: object = new ObjectId(docId);
        const deletedDocument: HotelDocument | null =
          await draftStorage.findByIdAndDelete(documentId, {
            useFindAndModify: false,
          });
        if (!deletedDocument) {
          return res
            .status(404)
            .json({ code: res.statusCode, message: "Document Not Found" });
        } else {
          return res
            .status(200)
            .json({ code: res.statusCode, message: "Deleted Successfully" });
        }
      } else {
        res.status(400).json({
          code: res.statusCode,
          message: "provid the proper quary parameters",
        });
      }
    }
  } catch (error) {
    console.log("error in line no 69 in deleting");
    next(new CustomError(500, "failed", "internal server error", error));
  }
};
