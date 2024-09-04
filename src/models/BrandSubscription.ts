import { Schema, model } from 'mongoose';
import { SubscriptionPlan } from '../types/enums';
import { IBrandSubscription } from 'interfaces/BrandSubscription';

const brandSubscriptionSchema = new Schema<IBrandSubscription>(
  {
    brandId: {
      type: Schema.Types.ObjectId,
      ref: 'Brand',
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
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = model<IBrandSubscription>(
  'BrandSubscription',
  brandSubscriptionSchema
);

const BrandSubscriptionSchema = model<IBrandSubscription>(
  'BrandSubscription',
  brandSubscriptionSchema
);
export default BrandSubscriptionSchema;
