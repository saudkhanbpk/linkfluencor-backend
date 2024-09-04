import { Schema, Document } from 'mongoose';
import { SubscriptionPlan } from '../types/enums';

export interface IBrandSubscription extends Document {
  brandId: Schema.Types.ObjectId;
  plan: SubscriptionPlan;
  clicksAllowed: number;
  clicksUsed: number;
  purchaseDate: Date;
  renewalDate: Date;
  createdBy: Schema.Types.ObjectId;
}
