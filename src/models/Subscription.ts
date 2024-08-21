import { Schema, model, Document } from 'mongoose';

export interface ISubscription extends Document {
  user: Schema.Types.ObjectId;
  plan: string;
  clicksLimit: number;
  clicksUsed: number;
  expiresAt: Date;
  active: boolean;
}

const subscriptionSchema = new Schema<ISubscription>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  plan: { type: String, enum: ['free', '50K', '100K', 'unlimited'], default: 'free' },
  clicksLimit: { type: Number, default: 10000 },
  clicksUsed: { type: Number, default: 0 },
  expiresAt: { type: Date, required: true },
  active: { type: Boolean, default: true },
}, {
  timestamps: true,
});

const Subscription = model<ISubscription>('Subscription', subscriptionSchema);
export default Subscription;
