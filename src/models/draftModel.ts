import { Schema, Document, model, Model } from "mongoose";
import { HotelDocument } from "../utils/hotel-interface";
import { boolean } from "joi";

const hotelSchema = new Schema<HotelDocument>({
  status: Boolean,
  hotelsListStatus: Boolean,
  Adminemail: String,
  country: String,
  state: String,
  pincode: String,
  city: String,
  apartmentname: String,
  streetname: String,
  hotelsList: [
    {
      hotelName: String,
      hotelAddress: String,
      hotelPrice: String,
      originalHotelPrice: String,
      hotelImage: String,
      roomperguest: String,
      hotelRelatedImages: [String],
      rating: String,
      hotelType: String,
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
              hotelFacility: [
                {
                  title: String,
                  code: String,
                },
              ],
              hotelCategoryTypeTitle: String,
              hotelOriginalPrice: String,
              hotelDiscountPrice: String,
              hotelTaxesPrice: String,
            },
          ],
        },
      ],
    latitude:String,
    longitude: String,
    selectedFacilities:[String],
      houserules:[
        {
          rule:String
        }
      ], 
       
      packageOptions: [
        {
          packageName: {name:String},
          packageOriginalPrice: Number,
          packageDiscountPrice: Number,
        },
      ],
      hotelNotAvailable:[String],
     hotelavailableDateUpto:String
    },
  ],
});

// Create and export the MongoDB model
const draftStorage: Model<HotelDocument> = model<HotelDocument>(
  "draft",
  hotelSchema
);
export default draftStorage;
