import { Response, NextFunction } from "express";
import userModel from "../models/userModel";
import jwt from "jsonwebtoken";
import bycrpt from "bcrypt";
import { CustomRequest } from "../utils/request-model";
import {
  signupSchema,
  loginSchema,
  form1ValidationSchema,
  form2ValidationSchema
} from "../validations/joiValidationSchemas";
import draftStorage from "../models/draftModel";
import HotelModel from "../models/hotelModel";
import { CustomError } from "../utils/CustomError";
import { createMainHotelData } from "../utils/createMainHotelData";

/**
 *
 * @param id
 * @returns token for login
 */
const signToken = (user: any) => {
  return jwt.sign({ ...user }, String(process.env.JWT_SECRET), {
    expiresIn: String(process.env.JWT_EXPIRES_IN),
  });
};

/**
 * Single method to handle token for the login
 * @param req
 * @param user
 * @param statusCode
 * @param res
 * @param message
 */
const createSenderToken = (
  req: CustomRequest,
  user: CustomRequest["body"],
  statusCode: number,
  res: Response,
  message: string
) => {
  console.log(user)
  const token = signToken(user);
  const cookiesOption = {
    expires: new Date(
      Date.now() +
        Number(process.env.JWT_COOKIE_EXPIRES_IN) * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  res.cookie("jwt", token, cookiesOption);

  user.password = undefined;

  res.status(statusCode).json({
    status: "success",
    code: res.statusCode,
    token,
    data: {
      user,
    },
    request_time: req.requestTime,
    message: message,
  });
};

/**
 * Method for signup for user
 * @param req
 * @param res
 * @param next
 */
export const signup = async (req: CustomRequest, res: Response) => {
  try {
    // Validate the incoming data with the  joi signupSchema
    let { error, value } = signupSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        code: res.statusCode,
        error: error.details[0].message,
        message: "bad reques",
      });
    }
    // If validation passes, the data will be available in the `value` object
    const { name, email, role, password, confirmpassword } = value;

    if (password !== confirmpassword) {
      return res.status(400).json({
        error: "Passwords don't match",
        code: res.statusCode,
      });
    }

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res
        .status(409)
        .json({ error: "User already exsist", code: res.statusCode });
    }

    const hashedPassword = await bycrpt.hash(password, 10);

    let newUser = await userModel.create({
      name,
      email,
      role,
      password: hashedPassword,
    });
    res.status(201).json({
      status: "success",
      code: res.statusCode,
      data: {
        newUser,
      },
      request_time: req.requestTime,
      message: "You had been signed up successfully",
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      code: res.statusCode,
      message: res.statusMessage,
    });
  }
};

/**
 * Handles user login authentication.
 *
 * @async
 * @param {CustomRequest} req - The request object containing the login data (email and password).
 * @param {Response} res - The response object to send the result back to the client.
 * @returns {Promise<void>} - A promise that resolves after processing the login request.
 *
 * @throws {Error} - Throws an error if there is an unexpected issue during the login process.
 */

export const login = async (req: CustomRequest, res: Response) => {
  // Validate the incoming data with  the joi  loginSchema
  let { error, value } = loginSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      code: res.statusCode,
      error: error.details[0].message,
      message: "bad request",
    });
  }
  // If validation passes, the data will be available in the `value` object
  const { email, password } = value;

  if (!email || !password) {
    return res.status(400).json({
      status: "error",
      code: res.statusCode,
      message: "Please provide email or password",
    });
  }

  const user = await userModel.findOne({ email }).select("+password");

  if (!user) {
    // User with the provided email not found in the database
    return res.status(401).json({ error: "Invalid credentials" });
  }

  if (typeof user.password !== "string") {
    return res.status(500).json({
      status: "error",
      code: res.statusCode,
      message: "Unexpected error occurred",
    });
  }

  const passwordMatch = await bycrpt.compare(password, user.password);

  if (!passwordMatch) {
    // User with the provided email  is not found in the database
    return res.status(401).json({
      status: "error",
      code: res.statusCode,
      message: "Password is incorrect",
    });
  }

  createSenderToken(req, user, 200, res, "You had been logged in successfully");
};

/**
 * Handles the upload process and sends a response with status "ok".
 * This function does not perform any actual file upload, it's just a placeholder for demonstration purposes.
 * It throws a CustomError with "internal server error" message and 500 status code for testing error handling.
 *
 * @param {CustomRequest} req - The request object containing the upload data and other information.
 * @param {Response} res - The response object to send the result back to the client.
 * @param {NextFunction} next - The next middleware function in the request-response cycle.
 * @returns {void} - This function does not return a value explicitly, but sends a response with status "ok".
 * @throws {CustomError} - Throws a CustomError with "internal server error" message and 500 status code.
 */

export const uploades = (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  console.log("called");
  try {
    res.json({ status: "ok" });
    throw new CustomError("internal server error", 500, "failed", "");
  } catch (error) {
    console.log(error);
    next(error);
  }
};

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
    console.log(req.email)
    const { form } = req.body;
    // const existAdminDraft=await draftStorage.findOne({Adminemail:req.email})
    const existDocument = await draftStorage.findOne({
      $and: [
        { country: req.body.country },
        { state: req.body.state },
        { city: req.body.city },
      ],
    });
    const existDocumentWithId = await draftStorage.findById(
      req.body.draftId
    );
    if (
      (form === "form1" || form === "form2" || form === "form3") &&
      ((existDocument && existDocument.status) ||
        (existDocumentWithId && existDocumentWithId.status))
    ) {
      const existHotelsData: any = await draftStorage.findOne({
        $and: [
          { country: req.body.country },
          { state: req.body.state },
          { city: req.body.city },
        ],
      });
      switch (form) {
        case "form1":
          const { error, value } = form1ValidationSchema.validate(req.body);
          if (error) {
            throw new CustomError(
              "enter the valid details",
              400,
              "failed",
              error
            );
          } else {
           await existHotelsData.save()
            return res.status(200).json({
              code: res.statusCode,
              message: "pending exsit",
              data: { draftId: existHotelsData._id },
            });
          }
        case "form2":
          // adding the form2 details to existing hotelsList
          // const {error,value}=form2ValidationSchema.validate(req.body)
          // if (err){
            // throw new CustomError(
              // "enter the valid details",
              // 400,
              // "failed",
              // err
            // );
          // }
          const existHotelDetails: any = await draftStorage.findByIdAndUpdate(
            req.body.draftId
          );
          // checking if the requested document is exist or not
          if (!existHotelDetails) {
            return res.status(404).json({
              code: res.statusCode,
              message: "document not found for update",
            });
          } else if(existHotelDetails.status&& existHotelDetails.hotelsListStatus) {
           let newData= req.body.hotelsList[0]
           let existData=existHotelDetails.hotelsList[existHotelDetails.hotelsList.length-1]
           console.log(existData.hotelAllRoomTypes)
            existHotelDetails.hotelsList.push(newData);
            existData.hotelAllRoomTypes =[...newData.hotelAllRoomtypes];
            existHotelDetails.hotelsListStatus=false;

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
          else{
            console.log("exist hotellist")
            let newData= req.body.hotelsList[0]
           let existData=existHotelDetails.hotelsList[existHotelDetails.hotelsList.length-1]
           console.log(existData.hotelAllRoomTypes)
            existData={...newData}
            // existData.hotelAllRoomTypes =[...newData.hotelAllRoomtypes];
            existHotelDetails.hotelsListStatus=false;

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
            const newData =req.body.hotelsList[0]

             const existData=existHotelData.hotelsList[existHotelData.hotelsList.length - 1]
             existHotelData.hotelsListStatus=true
              existData.latitude=newData.latitude
              existData.longitude=newData.longitude
              existData.houserules =[ ...newData.houserules] ;
              existData.packageOptions =[ ...newData.packageOptions];
              existData.selectedFacilities=[...newData.selectedFacilities]
              existData.hotelNotAvailable=[...newData.hotelNotAvailable]  
              existData.hotelavailableDateUpto=newData.hotelavailableDateUpto
              existData.hotelsListStatus = true;
              existHotelData.status = true;
            existHotelData.hotelsList[
              existHotelData.hotelsList.length - 1
            ].hotelsListStatus = true;
            existHotelData.save();
            console.log("from form3", existHotelData.hotelsList[1]);
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
          console.log("called")
          // validating the form1 req body
          let { error, value } = form1ValidationSchema.validate(req.body);
          if (error) {
            throw new CustomError(
              "enter the valid details",
              400,
              "failed",
              error

            );
            next(error);
          } else {
          // checking the document is exist with the adminemail
            let existAdminDraft = await draftStorage.findOne({Adminemail:req.email, status: false} );
            console.log("exist status9888888888888888888888888888888",existAdminDraft)
            if (existAdminDraft && !existAdminDraft.status) {
              console.log("hello")
              let existDraft: any = await draftStorage.findOne({
                Adminemail: req.email,status:false
              });
              console.log("111111111111111111111111111111",existDraft)
              if (!existDraft) {
                res.status(404).json({
                  code: res.statusCode,
                  status: "failed",
                  message: "document  not found for update ",
                });
              }
                              // updating the data to  the exist document
              else {
                existDraft.hotelsListStatus=false
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
              console.log("create a new data")
              // creating the new draftstorage and storing the data
              const newDraft = await new draftStorage();
              newDraft.status = false;
              newDraft.hotelsListStatus=false;
                newDraft.country = value.country;
                newDraft.state = value.state;
                newDraft.city = value.city;
                newDraft.Adminemail = req.email;
                newDraft.pincode = value.pincode;
                newDraft.apartmentname = value.apartmentname;
                newDraft.streetname = value.streetname;;
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
          if (
            (await draftStorage.findOne({ Adminemail: req.email })) &&
            (await draftStorage.findById(req.body.draftId))
          ) {
            let existDraft: any = await draftStorage.findByIdAndUpdate(
              req.body.draftId
            );
            if (!existDraft) {
              res.status(404).json({
                code: res.statusCode,
                status: "failed",
                message: "document  not found for update ",
              });
            } else {
              existDraft.hotelsListStatus=false;
              existDraft.hotelsList[0] ={...req.body.hotelsList[0] , hotelsListStatus: false};
              existDraft.hotelsList[0].hotelAllRoomTypes=[...req.body.hotelsList[0].hotelAllRoomtypes]
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
              message: "document  not found for update ",
            });
           
          }
          break;
        case "form3":
          // checking the document is exist with the adminemail and id
          if (
            (await draftStorage.findOne({ Adminemail: req.email })) &&
            (await draftStorage.findById(req.body.draftId))
          ) {
            let existDraft: any = await draftStorage.findByIdAndUpdate(
              req.body.draftId
            );
            if (!existDraft) {
              res.status(404).json({
                code: res.statusCode,
                status: "failed",
                message: "document  not found for update ",
              });
            } else {
              console.log()
             const newData =req.body.hotelsList[0]
             const existData=existDraft.hotelsList[0]
              existData.latitude=newData.latitude
              existData.longitude=newData.longitude
              existData.houserules =[ ...newData.houserules] ;
              existData.packageOptions =[ ...newData.packageOptions];
              existData.selectedFacilities=[...newData.selectedFacilities]
              existData.hotelNotAvailable=[...newData.hotelNotAvailable]  
              existData.hotelavailableDateUpto=newData.hotelavailableDateUpto
              existDraft.status = true;
              existDraft.hotelsListStatus=true;


              await existDraft.save();

              res.status(200).json({
                code: res.statusCode,
                status: "successful",
                message:
                  "form 3  data is saved   and totel data saved successfuly",
              });
            }
          } else {
            // document not found  with id or adminemail for update the data of form2
            res.status(404).json({
              code: res.statusCode,
              status: "failed",
              message: "document  not found for update ",
            });

            break;
          }
      }
    }
  } catch (error) {
    console.log(error);
    next(error);
    // throw new CustomError("internal server error",500,"failed" ,error)
  }
};

// method for sending the draftstorage data
export let hotelDraftInfo = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log(req.email)
    let { draftId } = req.params;
    console.log(draftId,req.email);
     if (draftId == "hotelDetails") {
      console.log("total data")
      let totalHotelList = await draftStorage.find({$and:[{status:true},{hotelsListStatus:true}]});
      console.log("value", totalHotelList);
    }
    else if (draftId) {
      const getDraft: any = await draftStorage.findOne({$and :[{Adminemail: req.email},{_id:draftId}] });
      console.log(getDraft)
      if (!getDraft.status) {
        return res.status(200).json({
          code: res.statusCode,
          status: "success",
          data:  getDraft ,
        });
      } else if (
        getDraft.status &&
        !getDraft.hotelsListStatus
      ) {
        return res.status(200).json({
          code: res.statusCode,
          status: "success",
          data: getDraft.hotelsList[getDraft.hotelsList.length - 1],
        });
      }
    }
  } catch (error) {
    throw new CustomError("internal server error", 500, "failed", error);
  }
};
