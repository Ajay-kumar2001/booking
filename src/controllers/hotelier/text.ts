import { NextFunction, Response } from "express";
import { CustomRequest } from "../../utils/request-model";
import draftStorage from "../../models/draftModel";
import { ObjectId } from "mongodb";

export const test = async (
  req: CustomRequest,
  res: Response,
  nex: NextFunction
) => {
  const documentId: object = new ObjectId(req.body._id);
  const hotelId:object=new ObjectId(req.body.hotelId)

  const exist = await draftStorage.find({ $and: [
    { _id: documentId },{"hotelsList._id":hotelId},
],})
  
  
  res.send(exist);
};
