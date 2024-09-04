import { Schema, model } from 'mongoose';
import { TransactionStatus, PaymentMethod } from '../types/enums';
import { ITransaction } from 'interfaces/Transaction';

const transactionSchema = new Schema<ITransaction>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', default: null },
    brandId: { type: Schema.Types.ObjectId, ref: 'Brand', default: null },
    transactionNumber: { type: String, required: true, unique: true },
    invoiceDate: { type: Date, required: true },
    datePaid: { type: Date, required: true },
    paymentMethod: {
      type: String,
      enum: PaymentMethod,
      required: true,
    },

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
    purchasedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Transaction = model<ITransaction>('Transaction', transactionSchema);
export default Transaction;
