import { Document, Schema } from 'mongoose';
import { AuthProvider, UserRole, UserStatus } from 'types/enums';

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  status: UserStatus;
  photoPath?: string;
  authProvider: AuthProvider;
  authProviderId?: string;
  gender?: string;
  country?: string;
  city?: string;
  mobileNumber?: string;
  address?: string;
  birthDate?: Date;
  role: UserRole;
  brand?: Schema.Types.ObjectId;
  activationToken?: string;
  otpCode?: string;
  otpExpiry?: Date;
  verifyPassword(_password: string): Promise<boolean>;
  calculateProfileCompletion(): number;
}
