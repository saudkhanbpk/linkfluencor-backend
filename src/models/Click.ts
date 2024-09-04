import { Schema, model } from 'mongoose';
import { IClick } from 'interfaces/Click';

const clickSchema = new Schema<IClick>(
  {
    linkId: { type: Schema.Types.ObjectId, ref: 'Link', required: true },
    clickedAt: { type: Date, default: Date.now },
    ipAddress: { type: String, required: true },
    userAgent: { type: String, required: true },
    platform: { type: String, required: true },
    country: { type: String, required: true },
    city: { type: String, required: true },
    referrer: { type: String, default: null },
  },
  {
    timestamps: true,
  }
);

const Click = model<IClick>('Click', clickSchema);
export default Click;
