import mongoose, { Document, Model } from 'mongoose';
// Define the Categories interface
interface Categories  {
  staff: number;
  facilities: number;
  cleanness: number;
  comfort: number;
  valueformoney: number;
  location: number;
  freewifi: number;
}
// Define the UserReview interface
interface UserReview  {
  review: string;
  userEmail:string,
  reviewTitle: string;
  reviewMessage: string;
  reviewRating: number;
  reviewerName: string;
  categories:Categories
}



// Define the GuestReview interface
export interface GuestReview extends Document {
  hotelName:string,
  hotelId:string,
  userReviews: UserReview[];
}
 
  // Define the Categories schema
  const categoriesSchema = new mongoose.Schema({
    staff: Number,
    facilities: Number,
    cleanness: Number,
    comfort: Number,
    valueformoney: Number,
    location: Number,
    freewifi: Number,
  });
// Define the UserReview schema
const userReviewSchema = new mongoose.Schema({
  review: String,
  userEmail:String,
    reviewTitle: String,
    reviewMessage: String,
    reviewRating: Number,
    reviewerName: String,
    categories:{type:categoriesSchema,default:null}
  });
 
  
  // Define the GuestReview schema
  export const guestReviewSchema= new mongoose.Schema<GuestReview>({
    hotelName:String,
    hotelId:String,
    userReviews: [userReviewSchema], // Embed the UserReview schema as an array
  });
  
  // Create the main schema using the GuestReview schema
  export  const GuestReviewModel :Model<GuestReview>= mongoose.model('GuestReview', guestReviewSchema);
  
  