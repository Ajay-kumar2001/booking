import mongoose, { Document, Schema } from 'mongoose';
// Defining  interface for BreakfastObject
interface Breakfast{
    packageName: string,
  packageTime: number,
  packageOriginalPrice: number,
  packageDiscountPrice: number,
  packagePersions: number,
  packageId: number,
  packageDescription: string,
}
// Defining  interface for HotelPricesDetails Object
interface HotelPricesDetails{
    hotelTotalPrice: number,
  hotelDiscountInPercent: number,
  hotelTaxStateInPercent: number,
  hoteltTaxCenterInPercent: number,
  hotelServicePrice: number,
}
// Defining  interface for HotelAllRoomTypes Object
interface  hotelsCategory{
    hotelFacility: string[],
    hotelCategoryTypeTitle: string,
    hotelOriginalPrice: number,
    hotelDiscountPrice: number,
    hotelTaxesPrice: number,
}

// Defining  interface for HotelAllRoomTypes Object
interface HotelAllRoomTypes{
    hotelType: string,
    hotelImage: string,
    hotelRoomSize: number,
    hotelTaxesPrice: number,
    hotelRoomBedType: string,
    hotelsCategory:hotelsCategory
}
// Defining  interface for GuestDetails Object
 interface GuestDetails {
    guestName: string,
    guestLastName: string,
    guestEmail: string,
    guestMobileNo: string,
 }
 // Define the interface for the payment document
interface IPayment extends Document {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
  }

// Define a document interface for type checking
export interface HotelBookingDocument extends Document {
   id:string,
   email:string,
    hotelName: string;
    hotelId: string;
    hotelFullAddress: string;
    hotelImage: string;
    checkInDate: Date;
    checkOutDate: Date;
    noOfDays: number;
    noOfGuest: number;
    onlinePaymentMethod: boolean;
    offlinePaymentMethod: boolean;
    breakfast: Breakfast;
    hotelPricesDetails: HotelPricesDetails;
    hotelAllRoomTypes: HotelAllRoomTypes;
    guestDetails: GuestDetails;
    paymentDetails:IPayment
  }
  

// Define a schema for the "breakfast" object
const BreakfastSchema = new Schema<Breakfast>({
  packageName: String,
  packageTime: Number,
  packageOriginalPrice: Number,
  packageDiscountPrice: Number,
  packagePersions: Number,
  packageId: Number,
  packageDescription: String,
});

// Define a schema for the "hotelPricesDetails" object
const HotelPricesDetailsSchema = new Schema<HotelPricesDetails>({
  hotelTotalPrice: Number,
  hotelDiscountInPercent: Number,
  hotelTaxStateInPercent: Number,
  hoteltTaxCenterInPercent: Number,
  hotelServicePrice: Number,
});

// Define a schema for the "hotelAllRoomTypes" object
const HotelAllRoomTypesSchema = new Schema<HotelAllRoomTypes>({
  hotelType: String,
  hotelImage: String,
  hotelRoomSize: Number,
  hotelTaxesPrice: Number,
  hotelRoomBedType: String,
  hotelsCategory: {
    hotelFacility: [String],
    hotelCategoryTypeTitle: String,
    hotelOriginalPrice: Number,
    hotelDiscountPrice: Number,
    hotelTaxesPrice: Number,
  },
});

// Define a schema for the "guestDetails" object
const GuestDetailsSchema = new Schema<GuestDetails>({
  guestName: String,
  guestLastName: String,
  guestEmail: String,
  guestMobileNo: String,
});
// Define a schema for the "paymentdetails" object
const paymentSchema = new Schema<IPayment>({
    razorpay_payment_id: { type: String, required: true },
    razorpay_order_id: { type: String, required: true },
    razorpay_signature: { type: String, required: true },
  });
// Define the main schema for the entire document
const HotelBookingSchema = new Schema({
  id:String,
  email:String,
  hotelName: String,
  hotelId: String,
  hotelFullAddress: String,
  hotelImage: String,
  checkInDate: Date,
  checkOutDate: Date,
  noOfDays: Number,
  noOfGuest: Number,
  onlinePaymentMethod: Boolean,
  offlinePaymentMethod: Boolean,
  breakfast:{type: BreakfastSchema,default:null},
  hotelPricesDetails: {type:HotelPricesDetailsSchema,default:null},
  hotelAllRoomTypes: {type:HotelAllRoomTypesSchema,default:null},
  guestDetails:{type: GuestDetailsSchema,default:null},
  paymentDetails:{type:paymentSchema,default:null}
});

// Create a model from the schema
export const HotelBookingModel = mongoose.model<HotelBookingDocument>('HotelBooking', HotelBookingSchema);

// Export the model and document interface


