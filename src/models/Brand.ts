import { Schema, model } from 'mongoose';
import { BrandMemberRole } from '../types/enums';
import { IBrand } from 'interfaces/Brand';

const brandSchema = new Schema<IBrand>(
  {
    name: { type: String, required: false },
    email: { type: String, required: true, unique: true },
    photoPath: { type: String, default: null },
    country: { type: String, default: null },
    city: { type: String, default: null },
    mobileNumber: { type: String, default: null },
    address: { type: String, default: null },
    members: [
      {
        userId: {
          type: Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
        role: {
          type: String,
          enum: Object.values(BrandMemberRole),
          default: BrandMemberRole.Admin,
          required: true,
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
