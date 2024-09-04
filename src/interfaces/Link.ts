import { Schema, Document } from 'mongoose';

export interface ILink extends Document {
  originalUrl: string;
  shortUrl: string;
  createdBy: Schema.Types.ObjectId;
  brand: Schema.Types.ObjectId | null;
  clickCount: number;
  targetSite: string;
  prefix: string | null;
  tags: Array<string> | null;
}
