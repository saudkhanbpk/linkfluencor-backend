import { Schema, Document } from 'mongoose';
import { BrandMemberRole } from '../types/enums';

export interface IBrand extends Document {
  name?: string;
  email: string;
  photoPath?: string;
  country?: string;
  city?: string;
  mobileNumber?: string;
  address?: string;
  members: Array<{ userId: Schema.Types.ObjectId; role: BrandMemberRole }>;
}
