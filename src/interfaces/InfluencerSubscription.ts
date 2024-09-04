import { Schema, Document } from 'mongoose';
import { SubscriptionPlan } from '../types/enums';

export interface IInfluencerSubscription extends Document {
  userId: Schema.Types.ObjectId;
  plan: SubscriptionPlan;
  clicksAllowed: number;
  clicksUsed: number;
  purchaseDate: Date;
}
