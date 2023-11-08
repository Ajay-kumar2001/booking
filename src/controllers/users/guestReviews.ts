import { NextFunction, Request, Response } from "express";
import { GuestReviewModel } from "../../models/guestReviewMdel";
import draftStorage from "../../models/draftModel";
import { ObjectId } from "mongodb";
import { CustomError } from "../../utils/CustomError";
export const guestReviews  = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Extract the hotelId and hotelName from the request body
    const { hotelId, hotelName } = req.body;

    // Find an existing review with the same hotelId and hotelName
    const userReview = await GuestReviewModel.findOne({
      $and: [{ hotelId: hotelId }, { hotelName: hotelName }],
    });

    if (!userReview) {
      // If no existing review is found, create a new one
      const newUserReview = await new GuestReviewModel(req.body);
      const documetId: object = new ObjectId(req.body.documentId);
      const hotelId: object = new ObjectId(req.body.hotelId);

      // Attempt to save the new review
      if (await newUserReview.save()) {
        const guestReviewId: string = String(newUserReview._id);

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
                  guestReviewId: {
                    $cond: [
                      { $eq: ["$hotelsList._id", hotelId] },
                      guestReviewId,
                      "$hotelsList.guestReviewId",
                    ],
                  },
                },
              },
            },
          ])
          .exec()
          .then((result) => {
            if (result.length === 0) {
              res.status(404).json({
                code: res.statusCode,
                status: "unsuccess",
                message: " hotel not found for postng the review",
              });
              return;
            }
            // if  we found one matching document
            const modifiedDocument = result[0];

            // Now, update the document in the collection
            draftStorage
              .findOneAndUpdate(
                { _id: documetId, "hotelsList._id": hotelId },
                {
                  $set: {
                    "hotelsList.$.guestReviewId": guestReviewId,
                  },
                },
                { new: true }
              )
              .exec()
              .then((updatedDocument) => {
                if (!updatedDocument) {             
                  res.status(400).json({
                    code: res.statusCode,
                    status: "unsuccessful",
                    message: " error somthing went wrong in posting the review",
                  });
                }
              })
              .catch((error) => {
                next(
                  new CustomError(
                    500,
                    "unsuccessful",
                    " error somthing went wrong in posting the review",
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
                "can't find the hotel to post the review",
                error
              )
            );
          });
        res.status(201).json({
          code: res.statusCode,
          status: "success",
          message: "Review posted successfully",
        });
      } else {
        res.status(500).json({
          code: res.statusCode,
          status: "unsuccessful",
          message:
            "Internal server error; something went wrong while saving the review",
        });
      }
    } else {
      // If an existing review is found, check if a review with the same userEmail exists
      const userEmail = req.body.userReviews[0].userEmail;
      console.log("User email:", userEmail);

      const userReviewExist = await GuestReviewModel.findOne({
        $and: [
          { hotelId: hotelId },
          { hotelName: hotelName },
          { "userReviews.userEmail": userEmail },
        ],
      });

      if (userReviewExist) {
        // If a review with the same userEmail already exists, return a conflict response
        res.status(409).json({
          code: res.statusCode,
          status: "unsuccessful",
          message: "Can't post the review; it already exists for this user",
        });
      } else {
        // If no review with the same userEmail exists, push the new review into the existing userReviews array
        const object = req.body.userReviews[0];

        const updatedUserReview = await GuestReviewModel.findOneAndUpdate(
          { $and: [{ hotelId: hotelId }, { hotelName: hotelName }] },
          { $push: { userReviews: object } },
          { new: true }
        );

        if (updatedUserReview) {
          res.status(201).json({
            code: res.statusCode,
            status: "success",
            message: "Review posted successfully",
          });
        }
      }
    }
  } catch (error) {
    next(
        new CustomError(
          500,
          "unsuccessful",
          "something went wrong can't post the review  to this hotel try again ",
          error
        )
      );
  }
};
