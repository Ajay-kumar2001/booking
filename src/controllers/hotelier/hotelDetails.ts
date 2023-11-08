import { Response, NextFunction } from "express";
import { CustomRequest } from "../../utils/request-model";
import { form1ValidationSchema } from "../../validations/form1ValidationSchema";
import { form2ValidationSchema } from "../../validations/form2ValidationSchema";
import draftStorage, { HotelDocument } from "../../models/draftModel";
import { CustomError } from "../../utils/CustomError";
/**
 * Handles hotel details based on the provided form data. This function either creates a new draft storage
 * or updates an existing draft storage document based on the form type.
 *
 * @param {CustomRequest} req - The request object containing the form data and other information.
 * @param {Response} res - The response object to send the result back to the client.
 * @param {NextFunction} next - The next middleware function in the request-response cycle.
 * @returns {Promise<void>} - A promise that resolves to send the response to the client.
 * @throws {CustomError} - Throws a CustomError if there is an internal server error.
 */
export let hotelDetails = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { form } = req.body;
    const existDocument: HotelDocument|null = await draftStorage.findOne({
      $and: [
        { country: req.body.country },
        { state: req.body.state },
        { city: req.body.city },
      ],
    });
    const existDocumentWithId: HotelDocument|null  =
      await draftStorage.findById(req.body.draftId);
    if (
      (form === "form1" || form === "form2" || form === "form3") &&
      ((existDocument && existDocument.status) ||
        (existDocumentWithId && existDocumentWithId.status))
    ) {
      const existHotelsData:any = await draftStorage.findOne({
        $and: [
          { country: req.body.country },
          { state: req.body.state },
          { city: req.body.city },
        ],
      });
      switch (form) {
        case "form1":
          var { error, value } = form1ValidationSchema.validate(req.body);
          if (error) {
            throw new CustomError(
              400,
              "failed",
              "enter the valid details",
              error
            );
          } else {
            await existHotelsData.save();
            return res.status(200).json({
              code: res.statusCode,
              message: "pending exsit",
              data: { draftId: existHotelsData._id },
            });
          }
        case "form2":
          // adding the form2 details to existing hotelsList
          var { error, value } = form2ValidationSchema.validate(req.body);
          if (error) {
            throw new CustomError(
              400,
              "failed",
              "enter the valid details",
              error
            );
          } else {
            console.log("from existing",value);
          }
          const existHotelDetails: HotelDocument | null =
            await draftStorage.findByIdAndUpdate(req.body.draftId);
          // checking if the requested document is exist or not
          if (!existHotelDetails) {
            return res.status(404).json({
              code: res.statusCode,
              message: "document not found for update",
            });
          } else if (
            existHotelDetails.status &&
            existHotelDetails.hotelsListStatus
          ) {
            let newData = req.body.hotelsList[0];
            let existData =
              existHotelDetails.hotelsList[
                existHotelDetails.hotelsList.length - 1
              ];
            existHotelDetails.hotelsList.push(newData);
            existData.hotelAllRoomTypes = [...newData.hotelAllRoomTypes];
            existHotelDetails.hotelsListStatus = false;

            existHotelDetails.save();
            return res.status(200).json({
              code: res.statusCode,
              message: "pending",
              data: {
                draftId: existHotelDetails._id,
                updateddata: existHotelDetails,
              },
            });
          } else {
            let newData = req.body.hotelsList[0];
            let existData =
              existHotelDetails.hotelsList[
                existHotelDetails.hotelsList.length - 1
              ];
            existData = { ...newData };
            existHotelDetails.hotelsListStatus = false;

            existHotelDetails.save();
            return res.status(200).json({
              code: res.statusCode,
              message: "pending",
              data: {
                draftId: existHotelDetails._id,
                updateddata: existHotelDetails,
              },
            });
          }
        case "form3":
          const existHotelData: any = await draftStorage.findByIdAndUpdate(
            req.body.draftId
          );
          if (!existHotelData) {
            return res.status(404).json({
              code: res.statusCode,
              message: "document not found for update",
            });
          } else {
            const newData = req.body.hotelsList[0];

            const existData =
              existHotelData.hotelsList[existHotelData.hotelsList.length - 1];
            existData.latitude = newData.latitude;
            existData.longitude = newData.longitude;
            existData.houserules = [...newData.houserules];
            existData.packageOptions = [...newData.packageOptions];
            existData.selectedFacilities = [...newData.selectedFacilities];
            existData.hotelNotAvailable = [...newData.hotelNotAvailable];
            existData.hotelavailableDateUpto = newData.hotelavailableDateUpto;
            existData.hotelStatus=true
            existData.hotelsListStatus = true;
            existHotelData.status = true;
            existHotelData.hotelsList[
              existHotelData.hotelsList.length - 1
            ].hotelsListStatus = true;
            existHotelData.save();
            return res.status(200).json({
              code: res.statusCode,
              message: "successful",
              data: {
                draftId: existHotelData._id,
                updateddata: existHotelData,
              },
            });
          }
      }
      // if document is not found with  country , cit ,state
    } else {
      switch (form) {
        case "form1":
          // validating the form1 req body
          var { error, value } = form1ValidationSchema.validate(req.body);
          if (error) {
            next(
              new CustomError(400, "failed", "enter the valid details", error)
            );
           
          } else {
            // checking the document is exist with the adminemail
            let existAdminDraft: HotelDocument | null =
              await draftStorage.findOne({
                Adminemail: req.email,
                status: false,
              });
            if (existAdminDraft && !existAdminDraft.status) {
              let existDraft: any = await draftStorage.findOne({
                Adminemail: req.email,
                status: false,
              });
              if (!existDraft) {
                res.status(404).json({
                  code: res.statusCode,
                  status: "failed",
                  message: "document  not found for adding the data ",
                });
              }
              // updating the data to  the exist document
              else {
                existDraft.hotelsListStatus = false;
                existDraft.status = false;
                existDraft.country = value.country;
                existDraft.state = value.state;
                existDraft.city = value.city;
                existDraft.Adminemail = req.email;
                existDraft.pincode = value.pincode;
                existDraft.apartmentname = value.apartmentname;
                existDraft.streetname = value.streetname;
                await existDraft.save();
                res.status(200).json({
                  code: res.statusCode,
                  status: "pending",
                  message: "send the remining data",
                  data: { draftId: existDraft._id },
                });
              }
            } else {
              // creating the new draftstorage and storing the data
              const newDraft: HotelDocument | null = await new draftStorage();
              newDraft.status = false;
              newDraft.hotelsListStatus = false;
              newDraft.country = value.country;
              newDraft.state = value.state;
              newDraft.city = value.city;
              newDraft.Adminemail = req.email;
              newDraft.pincode = value.pincode;
              newDraft.apartmentname = value.apartmentname;
              newDraft.streetname = value.streetname;
              await newDraft.save();
              res.status(200).json({
                code: res.statusCode,
                status: "pending",
                message: "send the remining data ",
                data: { draftId: newDraft._id },
              });
            }
          }
          break;
        case "form2":
          // checking the document is exist with the adminemail and id
          var { error, value }= form2ValidationSchema.validate(req.body);
          if (error) {
            next(
              new CustomError(400, "failed", "enter the valid details", error)
            );
          } else {
            console.log("from ",value);
          }

          if (
            (await draftStorage.findOne({ Adminemail: req.email })) &&
            (await draftStorage.findById(req.body.draftId))
          ) {
            let existDraft: any = await draftStorage.findByIdAndUpdate(req.body.draftId);
            if (!existDraft) {
              res.status(404).json({
                code: res.statusCode,
                status: "failed",
                message: "document  not found for update ",
              });
            } else {
              existDraft.hotelsListStatus = false;
              existDraft.hotelsList[0] = {
                ...req.body.hotelsList[0],
                hotelsListStatus: false,
              };
              existDraft.hotelsList[0].hotelAllRoomTypes = [
                ...req.body.hotelsList[0].hotelAllRoomTypes,
              ];
              await existDraft.save();
              res.status(200).json({
                code: res.statusCode,
                status: "pending",
                message: "form 2 data  is saved",
                data: { draftId: existDraft._id },
              });
            }
          } else {

            // document not found  with id or adminemail for update the data of form2
            res.status(404).json({
              code: res.statusCode,
              status: "failed",
              message: "document  not found for adding form 2 data ",
            });
          }
          break;
        case "form3":
          // checking the document is exist with the adminemail and id
          if (
            (await draftStorage.findOne({ Adminemail: req.email })) &&
            (await draftStorage.findById(req.body.draftId))
          ) {
            let existDraft: HotelDocument | null =
              await draftStorage.findByIdAndUpdate(req.body.draftId);
            if (!existDraft) {
              res.status(404).json({
                code: res.statusCode,
                status: "failed",
                message: "document  not found for update ",
              });
            } else {
              const newData = req.body.hotelsList[0];
              const existData = existDraft.hotelsList[0];
              existData.latitude = newData.latitude;
              existData.longitude = newData.longitude;
              existData.houserules = [...newData.houserules];
              existData.packageOptions = [...newData.packageOptions];
              existData.selectedFacilities = [...newData.selectedFacilities];
              existData.hotelNotAvailable = [...newData.hotelNotAvailable];
              existData.hotelavailableDateUpto = newData.hotelavailableDateUpto;
              existData.hotelStatus=true
              existDraft.status = true;
              existDraft.hotelsListStatus = true;

              await existDraft.save();

              res.status(200).json({
                code: res.statusCode,
                status: "successful",
                message:
                  "form 3  data is saved   and totel data saved successfuly",
              });
            }
          } else {
            // document not found  with id or adminemail for update the data of form3
            res.status(404).json({
              code: res.statusCode,
              status: "failed",
              message: "document  not found for adding form 3 data ",
            });

            break;
          }
      }
    }
  } catch (error) {
    console.log(" from line  335", error);
    next(new CustomError(400, "failed", "bad request", error));
  }
};
