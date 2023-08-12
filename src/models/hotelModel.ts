import { Schema, Document, model, Model } from "mongoose";
import { HotelDocument } from "../utils/hotel-interface";

const hotelSchema = new Schema<HotelDocument>({
  country: String,
  state: String,
  city: String,
  Adminemail: String,
  hotelsList: [
    {
      hotelName: String,
      hotelId: String,
      hotelAddress: String,
      hotelPrice: String,
      originalHotelPrice: String,
      hotelToolTipDescription: String,
      hotelFulladdress: String,
      breakfastInfo: String,
      cancellationMsg: String,
      games: String,
      hotelImage: String,
      hotelRelatedImages: {
        kitechenImage: String,
        bedroomImage: String,
        hallImage: String,
        hotelImage: String,
      },
      rating: String,
      hotelType: String,
      HotelStatus: String,
      hotelReviews: String,
      hotelDescription: String,
      facilities: [String],
      hotelAllRoomTypes: [
        {
          hotelType: String,
          hotelImage: String,
          hotelRoomSize: Number,
          hotelRoomBedType: String,
          hotelsCategories: [
            {
              hotelFacility: [String],
              hotelCategoryTypeTitle: String,
              hotelOriginalPrice: String,
              hotelDiscountPrice: String,
              hotelTaxesPrice: String,
            },
          ],
        },
      ],
      houserules: {
        rule1: String,
        rule2: String,
        rule3: String,
        rule4: String,
      },
      packageOptions: [
        {
          packageName: String,
          packageTime: Number,
          packageOriginalPrice: Number,
          packageDiscountPrice: Number,
          packagePersions: Number,
          packageId: Number,
          packageDescription: String,
        },
      ],
    },
  ],
});

// Create and export the MongoDB model
const HotelModel: Model<HotelDocument> = model<HotelDocument>(
  "hotel",
  hotelSchema
);
export default HotelModel;
