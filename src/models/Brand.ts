import { Schema, model, Document } from 'mongoose';
import { BrandMemberRole } from '../types/enums';

export interface IBrand extends Document {
  name: string;
  mainUser: Schema.Types.ObjectId;
  members: Array<{ user: Schema.Types.ObjectId; role: BrandMemberRole }>;
}

const brandSchema = new Schema<IBrand>(
  {
    name: { type: String, required: false },
    mainUser: { type: String, required: false },
    members: [
      {
        user: { type: Schema.Types.ObjectId, ref: 'User' },
        role: {
          type: String,
          enum: Object.values(BrandMemberRole),
          default: BrandMemberRole.Admin,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Brand = model<IBrand>('Brand', brandSchema);
export default Brand;
