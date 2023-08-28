// import { Schema, Document, model, Model } from "mongoose";
// import { HotelDocument } from "../utils/hotel-interface";
// import { boolean } from "joi";

import mongoose, { Schema, Document, Model } from "mongoose";

interface Facility {
  title: string;
  code: string;
}

interface HotelFacility {
  hotelFacility: Facility[];
  hotelCategoryTypeTitle: string;
  hotelOriginalPrice: number;
  hotelDiscountPrice: number;
  hotelTaxesPrice: number;
}

interface HotelCategory {
  hotelType: string;
  hotelImage: string;
  hotelRoomSize: number;
  hotelRoomBedType: string;
  hotelsCategories: HotelFacility[];
}

interface HouseRules {
  rule: string;
}

interface PackageOption {
  packageDiscountPrice: number;
  packageName: {
    name: string;
  };
  packageOriginalPrice: number;
}
interface hotelPricesDetails {
  hoteTotalPrice: number;
  hotelDiscountInPercent: number;
  hotelTaxStateInPercent: number;
  hoteltTaxCenterInPercent: number;
  hotelServicePrice: number;
}

export interface HotelDocument extends Document {
  status: boolean;
  hotelsListStatus: boolean;
  Adminemail: string | undefined;
  country: string;
  state: string;
  pincode: string;
  city: string;
  apartmentname: string;
  streetname: string;
  hotelsList: {
    hotelName: string;
    hotelPrice: number;
    hotelImage: string[];
    roomperguest: number;
    hotelRelatedImages: string[];
    rating: number;
    hotelType: string;
    hotelPricesDetails: hotelPricesDetails;
    hotelDescription: string;
    facilities: string[];
    hotelAllRoomTypes: HotelCategory[];
    latitude: string;
    longitude: string;
    selectedFacilities: string[];
    houserules: HouseRules[];
    hotelNotAvailable: string[];
    hotelavailableDateUpto: string;
    packageOptions: PackageOption[];
  }[];
}

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
      hotelPrice: Number,
      hotelImage: [String],
      roomperguest: Number,
      hotelRelatedImages: [String],
      rating: Number,
      hotelType: String,
      hotelPricesDetails: {
        hoteTotalPrice: Number,
        hotelDiscountInPercent: Number,
        hotelTaxStateInPercent: Number,
        hoteltTaxCenterInPercent: Number,
        hotelServicePrice: Number,
      },
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
              hotelOriginalPrice: Number,
              hotelDiscountPrice: Number,
              hotelTaxesPrice: Number,
            },
          ],
        },
      ],
      latitude: String,
      longitude: String,
      selectedFacilities: [String],
      houserules: [
        {
          rule: String,
        },
      ],
      packageOptions: [
        {
          packageName: { name: String },
          packageOriginalPrice: Number,
          packageDiscountPrice: Number,
        },
      ],
      hotelNotAvailable: [String],
      hotelavailableDateUpto: String,
    },
  ],
});

// Create and export the MongoDB model
const draftStorage: Model<HotelDocument> = mongoose.model<HotelDocument>(
  "draft",
  hotelSchema
);
export default draftStorage;
