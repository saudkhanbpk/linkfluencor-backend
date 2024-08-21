import { Schema, model, Document } from 'mongoose';
import { SubscriptionPlan } from '../types/enums';

export interface ISubscription extends Document {
  user: Schema.Types.ObjectId;
  plan: SubscriptionPlan;
  clicksLimit: number;
  clicksUsed: number;
  expiresAt: Date;
  active: boolean;
}

const subscriptionSchema = new Schema<ISubscription>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  plan: { type: String, enum: Object.values(SubscriptionPlan), default: SubscriptionPlan.Free },
  clicksLimit: { type: Number, default: 10000 },
  clicksUsed: { type: Number, default: 0 },
  expiresAt: { type: Date, required: true },
  active: { type: Boolean, default: true },
}, {
  timestamps: true,
});

const Subscription = model<ISubscription>('Subscription', subscriptionSchema);
export default Subscription;
