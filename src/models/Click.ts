import { Schema, model, Document } from 'mongoose';

export interface IClick extends Document {
  link: Schema.Types.ObjectId;
  clickedAt: Date;
  ipAddress: string;
  userAgent: string;
  platform: string;
  country: string;
  referrer: string | null;
}

const clickSchema = new Schema<IClick>({
  link: { type: Schema.Types.ObjectId, ref: 'Link', required: true },
  clickedAt: { type: Date, default: Date.now },
  ipAddress: { type: String, required: true },
  userAgent: { type: String, required: true },
  platform: { type: String, required: true },
  country: { type: String, required: true },
  referrer: { type: String, default: null },
}, {
  timestamps: true,
});

const Click = model<IClick>('Click', clickSchema);
export default Click;
