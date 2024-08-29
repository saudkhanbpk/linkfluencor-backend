import { Schema, model, Document } from 'mongoose';
import { TransactionStatus } from '../types/enums';

export interface ITransaction extends Document {
  user: Schema.Types.ObjectId;
  transactionNumber: string;
  invoiceDate: Date;
  datePaid: Date;
  paymentMode: {
    cardNumber: string;
    cardType: string;
  };
  amount: number;
  status: TransactionStatus;
}

const transactionSchema = new Schema<ITransaction>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    transactionNumber: { type: String, required: true, unique: true },
    invoiceDate: { type: Date, required: true },
    datePaid: { type: Date, required: true },
    paymentMode: {
      cardNumber: { type: String, required: true },
      cardType: { type: String, required: true },
    },
    amount: { type: Number, required: true },
    status: {
      type: String,
      enum: Object.values(TransactionStatus),
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Transaction = model<ITransaction>('Transaction', transactionSchema);
export default Transaction;
