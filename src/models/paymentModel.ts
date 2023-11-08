import mongoose, { Schema, Document, Model } from 'mongoose';

// Define the interface for the payment document
export interface Payment extends Document {
  userId: string,
  userName:string,
  customerEmail:string,
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

// Create the schema
const paymentSchema = new Schema<Payment>({
  userId: {type:String},
  userName:{type:String},
  customerEmail:{type:String},
  razorpay_payment_id: { type: String, required: true },
  razorpay_order_id: { type: String, required: true },
  razorpay_signature: { type: String, required: true },
});

// Define and export the model
export const PaymentModel:Model<Payment> = mongoose.model<Payment>('Payment', paymentSchema);
