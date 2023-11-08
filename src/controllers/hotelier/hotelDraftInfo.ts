import { Response, NextFunction } from "express";
import { CustomRequest } from "../../utils/request-model";
import draftStorage, { HotelDocument } from "../../models/draftModel";
import { CustomError } from "../../utils/CustomError";
import { hoteldraftdetails } from "./hoteldraftdetails";
import { totalhoteldetails } from "../users/totalhoteldetails";
import { searching } from "../users/searching";
import { hotelierhoteldetails } from "./hotelierhoteldetails";
import { existHotelDraft } from "./existhoteldraft";
import { SearchQuery } from "../../utils/query-interface -for-search";
import { querySchema } from "../../validations/searchParamsValidatn";
// method for sending the draftstorage data
/**
 * Retrieves hotel draft information based on the given draftId and admin's email.
 *
 * @param {CustomRequest} req - The custom request object containing user input and data.
 * @param {Response} res - The response object used to send the response to the client.
 * @param {NextFunction} next - The next function in the middleware chain.
 * @throws {CustomError} Throws a custom error with details if an internal server error occurs.
 */
export let hotelDraftInfo = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    //id form the params
    const draftId: string = req.params.draftId;
    if (draftId == "hoteldraftdetails") {
      //function to find whether the draft exist with current login
      hoteldraftdetails(req, res, next);
    } else if (draftId == "hotelierhoteldetails") {
      //function to find   particular hotelier hoteldetails
      hotelierhoteldetails(req, res, next);
    } else if (draftId) {
      //function to find existing draft with  particular id provided in params
      existHotelDraft(req, res, next, draftId);
    }
  } catch (error) {
    next(new CustomError(500, "failed", "internal server error", error));
  }
};
