import { Schema, model, Document } from 'mongoose';
import crypto from 'crypto';
import { config } from '../config/env';

export interface ILink extends Document {
  originalUrl: string;
  shortUrl: string;
  user: Schema.Types.ObjectId;
  team: Schema.Types.ObjectId | null;
  clicks: number;
  targetSite: string;
  prefix: string | null;
  tags: Array<string> | null;
  createdAt: Date;
  updatedAt: Date;
}

const linkSchema = new Schema<ILink>(
  {
    originalUrl: { type: String, required: true },
    shortUrl: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: function (value: string) {
          const forbiddenValues = ['user', 'auth'].map(val =>
            val.toLowerCase()
          );
          return !forbiddenValues.includes(value.toLowerCase());
        },
        message: (props: any) => `${props.value} is not a valid short URL!`,
      },
    },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    team: { type: Schema.Types.ObjectId, ref: 'Team', default: null },
    clicks: { type: Number, default: 0 },
    targetSite: { type: String, required: true },
    prefix: { type: String, default: null, maxlength: 6 },
    tags: { type: [String], default: null },
  },
  {
    timestamps: true,
  }
);

linkSchema.pre<ILink>('save', function (next) {
  if (!/^https?:\/\//i.test(this.originalUrl)) {
    this.originalUrl = `http://${this.originalUrl}`;
  }
  next();
});

linkSchema.statics.generateShortUrl = function (username: string): string {
  const randomString = crypto.randomBytes(4).toString('hex');
  return `${config.appUrl}/${username}/${randomString}`;
};

const Link = model<ILink>('Link', linkSchema);
export default Link;
