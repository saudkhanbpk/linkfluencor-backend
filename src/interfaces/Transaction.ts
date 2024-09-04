import { Schema, Document } from 'mongoose';
import { TransactionStatus, PaymentMethod } from '../types/enums';

export interface ITransaction extends Document {
  userId: Schema.Types.ObjectId;
  brandId: Schema.Types.ObjectId;
  transactionNumber: string;
  invoiceDate: Date;
  datePaid: Date;
  paymentMethod: PaymentMethod;
  paymentMode: {
    cardNumber: string;
    cardType: string;
  };
  amount: number;
  status: TransactionStatus;
  purchasedBy: Schema.Types.ObjectId;
}
