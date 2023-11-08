import mongoose, { Schema, Document } from 'mongoose';

// Define the interface for the payment document
export interface IPayment extends Document {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

// Create the schema
const paymentSchema = new Schema<IPayment>({
  razorpay_payment_id: { type: String, required: true },
  razorpay_order_id: { type: String, required: true },
  razorpay_signature: { type: String, required: true },
});

// Define and export the model
export const PaymentModel = mongoose.model<IPayment>('Payment', paymentSchema);
