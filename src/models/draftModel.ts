// import { Schema, Document, model, Model } from "mongoose";
// import { HotelDocument } from "../utils/hotel-interface";
// import { boolean } from "joi";

import { number } from "joi";
import mongoose, { Schema, Document, Model } from "mongoose";
import { guestReviewSchema } from "./guestReviewMdel";

interface Facility {
  title: string;
  code: string;
}

interface HotelFacility {
  roomNumber:string,
  customerEmail:string,
  roomOccupied:boolean,
  checkIn:boolean,
    roomPerChildren:number,
   roomPerAdults:number,
   roomNotAvailable:string[],
  roomFacility: Facility[];
  roomCategoryTypeTitle: string;
  roomOriginalPrice: number;
  roomDiscountInPercentage: number;
  roomServicesPrice: number;
}

interface HotelCategory {

  totalRooms:number,
  Occupied:number,
  vacant:number,
  hotelRoomType: string;
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
  packageTime:number,
  packagePerson:number
}
interface hotelPricesDetails {
  hotelTotalPrice: number;
  hotelDiscountInPercent: number;
  hotelTaxStateInPercent: number;
  hotelTaxCenterInPercent: number;
  hotelServicePrice: number;
}

export interface HotelDocument extends Document {
  status: boolean;
  hotelsListStatus: boolean;
  Adminemail: string | undefined;
  country: string;
  state: string;
  pincode: number;
  city: string;
  apartmentname: string;
  streetname: string;
  hotelsList: {
    hotelStatus:boolean,
    hotelName: string;
    hotelPrice: number;
    hotelAddress:string,
    hotelImage: string[];
    roomperguest: number;
    hotelRelatedImages: string[];
    rating: number;
    hotelType: string;
    hotelPricesDetails: hotelPricesDetails;
    hotelDescription: string;
    facilities: string[];
    hotelAllRoomTypes: HotelCategory[];
    latitude: number;
    longitude: number;
    selectedFacilities: string[];
    houserules: HouseRules[];
    hotelNotAvailable: string[];
    hotelavailableDateUpto: string;
    packageOptions: PackageOption[];
    orders:string,
    guestReviewId:string
  }[];
}

const hotelSchema = new Schema<HotelDocument>({
  status: Boolean,
  hotelsListStatus: Boolean,
  Adminemail: String,
  country: String,
  state: String,
  pincode: Number,
  city: String,
  apartmentname: String,
  streetname: String,
  hotelsList: [
    {
      hotelStatus:{type:Boolean ,default:false},

      hotelName: String,
      hotelPrice: Number,
      hotelAddress:String,
      hotelImage: [String],
      roomperguest: Number,
      hotelRelatedImages: [String],
      rating: Number,
      hotelType: String,
      hotelPricesDetails: {
        hotelTotalPrice: Number,
        hotelDiscountInPercent: Number,
        hotelTaxStateInPercent: Number,
        hotelTaxCenterInPercent: Number,
        hotelServicePrice: Number,
      },
      hotelDescription: String,
      facilities: [String],
      hotelAllRoomTypes: [
        {
          totalRooms:Number,
          Occupied:Number,
            vacant:Number,
          hotelRoomType: String,
          hotelImage: String,
          hotelRoomSize: Number,
          hotelRoomBedType: String,
          hotelsCategories: [
            {
              roomFacility: [
                {
                  title: String,
                  code: String,
                },
              ],
              roomNumber:String,
              customerEmail:String,
              roomOccupied:{type:Boolean,default :false},
              checkIn:{type:Boolean,default :false},

              roomPerChildren:Number,
               roomPerAdults:Number,
               roomNotAvailable:[String],
              roomCategoryTypeTitle: String,
              roomOriginalPrice: Number,
              roomDiscountInPercentage: Number,
              roomServicesPrice: Number,
            },
          ],
        },
      ],
      latitude: Number,
      longitude: Number,
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
          packageTime:Number,
          packagePerson:Number
        },
      ],
      hotelNotAvailable: [String],
      hotelavailableDateUpto: String,
      orders:String,
      guestReviewId:String,


    },
  ],
});

// Create and export the MongoDB model

const draftStorage: Model<HotelDocument> = mongoose.model<HotelDocument>(
  "draft",
  hotelSchema
);
export default draftStorage;
