import { Response, NextFunction } from "express";
import { CustomRequest } from "../../utils/request-model";
import { Form1Validaton } from "../../validations/joiValidationForForm1Update";
import draftStorage from "../../models/draftModel";
import { CustomError } from "../../utils/CustomError";
import { ObjectId } from "mongodb";
import { joiSchemaform2 } from "../../validations/joiValidationForForm2Update";
import { joiSchemaform3 } from "../../validations/joiValidationForForm3pdate";
/**
 * Update hotel details for a specific form (form1, form2, or form3) based on the request body and parameters.
 *
 * @param {CustomRequest} req - The custom request object containing user input and data.
 * @param {Object} res - The response object used to send the response to the client.
 * @param {NextFunction} next - The next function in the middleware chain.
 * @returns {Promise<void>} A promise that resolves after updating the hotel details.
 * @throws {CustomError} Throws a custom error with details if there is an issue with validation, updating data, or an internal server error occurs.
 */

export const updatingHotelDetails = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // Your string representation of the ObjectId

    const docId: string = req.params.id;
    const form: string = req.body.form;
    switch (form) {
      //updating the form 1 data
      case "form1":
        var { error, value } = Form1Validaton.validate(req.body);
        if (error) {
          next(
            new CustomError(400, "failed", "enter the valid details", error)
          );
        } else {
          const documentId = new ObjectId(docId);
          const updated = await draftStorage.findByIdAndUpdate(
            documentId,
            { $set: value },
            { new: true, runValidators: true }
          );
          if (updated != null) {
            return res
              .status(200)
              .json({ code: res.statusCode, message: "form1 is updated" });
          } else {
            return res.status(404).json({
              code: res.statusCode,
              message: "can't find the document",
            });
          }
        }

      case "form2":
        var { error, value } = joiSchemaform2.validate(req.body);
        if (error) {
          next(
            new CustomError(400, "failed", "enter the valid details", error)
          );
        } else {
          const hotelId: string = value.hotelId;
          // Convert the string to ObjectId
          const documentId = new ObjectId(docId);

          //updating the hotel details of form2
          const updatedDataOfForm2 = await draftStorage.updateOne(
            {
              _id: documentId,
              "hotelsList._id": hotelId,
            },
            {
              $set: {
                "hotelsList.$.hotelPricesDetails": {
                  ...value.hotelsList[0].hotelPricesDetails,
                },
                "hotelsList.$.hotelAddress": value.hotelsList[0].hotelAddress,
                "hotelsList.$.hotelName": value.hotelsList[0].hotelName,
                "hotelsList.$.hotelPrice": value.hotelsList[0].hotelPrice,
                "hotelsList.$.hotelImage": [...value.hotelsList[0].hotelImage],
                "hotelsList.$.roomperguest": value.hotelsList[0].roomperguest,
                "hotelsList.$.hotelRelatedImages": [
                  ...value.hotelsList[0].hotelRelatedImages,
                ],
                "hotelsList.$.rating": value.hotelsList[0].rating,
                "hotelsList.$.hotelType": value.hotelsList[0].hotelType,
                "hotelsList.$.hotelDescription":
                  value.hotelsList[0].hotelDescription,
                "hotelsList.$.facilities": [...value.hotelsList[0].facilities],
                "hotelsList.$.hotelAllRoomTypes": [
                  ...value.hotelsList[0].hotelAllRoomTypes,
                ],
              },
            }
          );

          if (
            updatedDataOfForm2.acknowledged &&
            updatedDataOfForm2.modifiedCount
          ) {
            return res
              .status(200)
              .json({ code: res.statusCode, message: "form2 is updated" });
          } else {
            return res.status(400).json({
              code: res.statusCode,
              status: "failed",
              message: "Error in updating",
            });
          }
        }

      case "form3":
        var { error, value } = joiSchemaform3.validate(req.body);
        if (error) {
          next(
            new CustomError(400, "failed", "enter the valid details", error)
          );
        } else {
          const hotelObjectId: string = value.hotelId;
          // Convert the string to ObjectId
          const documentID: object = new ObjectId(docId);
          const hotelListId: object = new ObjectId(hotelObjectId);
          //updating the hotel details of form3
          const updatedDataOfForm3 = await draftStorage.updateOne(
            {
              _id: documentID,
              "hotelsList._id": hotelListId,
            },
            {
              $set: {
                "hotelsList.$.latitude": value.hotelsList[0].latitude,
                "hotelsList.$.longitude": value.hotelsList[0].longitude,
                "hotelsList.$.selectedFacilities": [
                  ...value.hotelsList[0].selectedFacilities,
                ],
                "hotelsList.$.houserules": [...value.hotelsList[0].houserules],
                "hotelsList.$.packageOptions": [
                  ...value.hotelsList[0].packageOptions,
                ],
                "hotelsList.$.hotelNotAvailable": [
                  ...value.hotelsList[0].hotelNotAvailable,
                ],
                "hotelsList.$.hotelavailableDateUpto":
                  value.hotelsList[0].hotelavailableDateUpto,
              },
            }
          );
          if (
            updatedDataOfForm3.acknowledged &&
            updatedDataOfForm3.matchedCount
          ) {
            return res
              .status(200)
              .json({ code: res.statusCode, message: "form3 is updated" });
          } else {
            return res
              .status(400)
              .json({ code: res.statusCode, message: "error in updating" });
          }
        }

      //
    }
  } catch (error) {
    console.log("error from pudate");
    next(new CustomError(500, "failed", "internal server error", error));

    next(error);
  }
};
