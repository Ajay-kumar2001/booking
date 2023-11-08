import mongoose, { Document, Model, Schema } from 'mongoose';
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
    customerEmail:string,
    roomOccupied:boolean,
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

// Define a orders interface for type checking
export interface Orders {
   id:string,
   checkIn:string,
   userEmail:string,
   orderId:string,
  paymentId:string,
    hotelName: string;
    hotelId: string;
    hotelFullAddress: string;
    hotelImage: string;
    checkInDate: string;
    checkOutDate: string;
    noOfDays: number;
    noOfGuest: number;
    onlinePaymentMethod: boolean;
    offlinePaymentMethod: boolean;
    totalOrderPrice:number,
    breakfast: Breakfast;
    hotelPricesDetails: HotelPricesDetails;
    hotelAllRoomTypes: HotelAllRoomTypes;
    guestDetails: GuestDetails;
    paymentDetails:IPayment
  }
  export interface HotelBookingDocument extends Document {
    hotelId:string,
    docId:string,
    hotelName:string,
    hotelierEmail:string,
    orders:Orders[]
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
    customerEmail:String,
    roomOccupied:Boolean,
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
const OrderSchema = new Schema({
  id:String,
  checkIn:{type:Boolean,default:false},

  userEmail:String,
  orderId:String,
  paymentId:String,
  hotelName: String,
  hotelId: String,
  hotelFullAddress: String,
  hotelImage: String,
  checkInDate: String,
  checkOutDate: String,
  noOfDays: Number,
  noOfGuest: Number,
  onlinePaymentMethod: Boolean,
  offlinePaymentMethod: Boolean,
  totalOrderPrice:Number,
  breakfast:{type: BreakfastSchema,default:null},
  hotelPricesDetails: {type:HotelPricesDetailsSchema,default:null},
  hotelAllRoomTypes: {type:HotelAllRoomTypesSchema,default:null},
  guestDetails:{type: GuestDetailsSchema,default:null},
  paymentDetails:{type:paymentSchema,default:null}
});
const HotelBookingSchema=new Schema<HotelBookingDocument>({
  hotelId:String,
    docId:String,
    hotelName:String,
    hotelierEmail:String,
  orders:[OrderSchema]
})

// Create a model from the schema
export const HotelBookingModel :Model<HotelBookingDocument>= mongoose.model<HotelBookingDocument>('HotelBooking', HotelBookingSchema);

// Export the model and document interface


