import { Schema, model, Document } from 'mongoose';
import { PaymentStatus } from '../types/enums';

export interface IPayment extends Document {
  user: Schema.Types.ObjectId;
  amount: number;
  currency: string;
  status: PaymentStatus;
  transactionId: string;
  createdAt: Date;
  updatedAt: Date;
}

const paymentSchema = new Schema<IPayment>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  currency: { type: String, required: true },
  status: { type: String, enum: Object.values(PaymentStatus), default: PaymentStatus.Pending },
  transactionId: { type: String, required: true },
}, {
  timestamps: true,
});

const Payment = model<IPayment>('Payment', paymentSchema);
export default Payment;
