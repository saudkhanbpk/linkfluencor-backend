import { Schema, model } from 'mongoose';
import { SubscriptionPlan } from '../types/enums';
import { IInfluencerSubscription } from 'interfaces/InfluencerSubscription';

const influencerSubscriptionSchema = new Schema<IInfluencerSubscription>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    plan: {
      type: String,
      enum: SubscriptionPlan,
      required: true,
    },
    clicksAllowed: { type: Number, required: true },
    clicksUsed: { type: Number, default: 0 },
    purchaseDate: { type: Date, required: true },
  },
  { timestamps: true }
);

const InfluencerSubscriptionSchema = model<IInfluencerSubscription>(
  'InfluencerSubscription',
  influencerSubscriptionSchema
);
export default InfluencerSubscriptionSchema;
