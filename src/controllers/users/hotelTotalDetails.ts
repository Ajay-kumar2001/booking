import { CustomPromisifySymbol } from "util";
import { CustomRequest } from "../../utils/request-model";
import { NextFunction, Response } from "express";
import { SearchQuery } from "../../utils/query-interface -for-search";
import { searching } from "./searching";
import { totalhoteldetails } from "./totalhoteldetails";

export const hotelTotleDetails = (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const QuaryParam = req.query as unknown as SearchQuery;
    const param: string = req.params.params;
    if (param == "totalhoteldetails") {
      //function to get total hotel details
      totalhoteldetails(req, res, next);
    } else if (param == "hoteldetails" && QuaryParam) {
      //function to search particular hotel based on query params
      searching(req, res, next, QuaryParam);
    } else {
      res.status(400).json({
        code: res.statusCode,
        message: "prvoid the proper params and query params",
      });
    }
  } catch (error) {}
};
