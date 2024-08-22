import { Schema, model, Document } from 'mongoose';
import crypto from 'crypto';

export interface ILink extends Document {
  originalUrl: string;
  shortUrl: string;
  user: Schema.Types.ObjectId;
  team: Schema.Types.ObjectId | null;
  clicks: number;
  targetSite: string;
  createdAt: Date;
  updatedAt: Date;
}

const linkSchema = new Schema<ILink>(
  {
    originalUrl: { type: String, required: true },
    shortUrl: { type: String, required: true, unique: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    team: { type: Schema.Types.ObjectId, ref: 'Team', default: null },
    clicks: { type: Number, default: 0 },
    targetSite: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

linkSchema.statics.generateShortUrl = function (username: string): string {
  const randomString = crypto.randomBytes(4).toString('hex');
  return `${process.env.APP_URL}/${username}/${randomString}`;
};

const Link = model<ILink>('Link', linkSchema);
export default Link;
