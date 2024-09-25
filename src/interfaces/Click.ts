import { Schema, Document } from 'mongoose';

export interface IClick extends Document {
  linkId: Schema.Types.ObjectId;
  clickedAt: Date;
  ipAddress: string;
  userAgent: string;
  platform: string;
  country: string | null;
  city: string | null;
  referrer: string | null;
}
