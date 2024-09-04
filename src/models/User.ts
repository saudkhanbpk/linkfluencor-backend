import mongoose, { Schema } from 'mongoose';
import { comparePassword, generateToken } from '../utils/authUtils';
import { AuthProvider, UserRole, UserStatus } from '../types/enums';
import { IUser } from '../interfaces/User';

const userSchema = new Schema<IUser>(
  {
    firstName: { type: String },
    lastName: { type: String },
    email: { type: String, required: true, unique: true },
    password: {
      type: String,
      // eslint-disable-next-line no-unused-vars
      required: function (this: IUser) {
        return this.authProvider === AuthProvider.Local;
      },
    },
    status: { type: String, UserStatus, default: UserStatus.Pending },
    photoPath: { type: String, default: null },
    authProvider: {
      type: String,
      enum: AuthProvider,
      required: true,
    },
    authProviderId: { type: String, default: null },
    gender: { type: String, default: null },
    country: { type: String, default: null },
    city: { type: String, default: null },
    mobileNumber: { type: String, default: null },
    address: { type: String, default: null },
    birthDate: { type: Date, default: null },
    role: {
      type: String,
      enum: UserRole,
      required: true,
    },
    brand: {
      type: Schema.Types.ObjectId,
      ref: 'Brand',
      default: null,
    },
    activationToken: { type: String, default: null },
    otpCode: { type: String, default: null },
    otpExpiry: { type: Date, default: null },
  },
  {
    timestamps: true,
  }
);
userSchema.methods.verifyPassword = async function (
  password: string
): Promise<boolean> {
  return comparePassword(password, this.password);
};

userSchema.methods.generateAuthToken = function (): string {
  return generateToken(this._id);
};

const User = mongoose.model<IUser>('User', userSchema);

export default User;
