import { Schema, model, Document } from 'mongoose';
import jwt from 'jsonwebtoken';
import { createSubscription } from '../services/subscriptionService';

import { comparePassword } from '../utils/authUtils';
import { UserRole, AuthProvider, UserStatus } from '../types/enums';

interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  team: Schema.Types.ObjectId | null;
  emailVerifiedAt: Date | null;
  status: UserStatus;
  photoPath: string | null;
  token: string | null;
  tokenExpiry: Date | null;
  otpCode: string | null;
  otpExpiry: Date | null;
  role: UserRole;
  authProvider: AuthProvider;
  authProviderId: string | null;
  verifyPassword: (_password: string) => Promise<boolean>;
  generateAuthToken: () => string;
  subscription: Schema.Types.ObjectId | null;
  createdAt: Date;
  updatedAt: Date | null;
}

const userSchema = new Schema<IUser>({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: {
    type: String,
    // eslint-disable-next-line no-unused-vars
    required: function (this: IUser) {
      return this.authProvider === AuthProvider.Local;
    },
  },
  team: { type: Schema.Types.ObjectId, ref: 'Team', default: null },
  emailVerifiedAt: { type: Date, default: null },
  status: {
    type: String,
    enum: Object.values(UserStatus),
    default: UserStatus.Inactive,
  },
  photoPath: { type: String, default: null },
  token: { type: String, default: null },
  tokenExpiry: { type: Date, default: null },
  otpCode: { type: String, default: null },
  otpExpiry: { type: Date, default: null },
  role: { type: String, enum: Object.values(UserRole), default: UserRole.User },
  authProvider: {
    type: String,
    enum: Object.values(AuthProvider),
    required: true,
  },
  authProviderId: { type: String, default: null },
  subscription: {
    type: Schema.Types.ObjectId,
    ref: 'Subscription',
    default: null,
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: null },
});

userSchema.methods.verifyPassword = async function (
  password: string
): Promise<boolean> {
  return comparePassword(password, this.password);
};

userSchema.methods.generateAuthToken = function (): string {
  const token = jwt.sign(
    { _id: this._id, role: this.role },
    process.env.JWT_SECRET as string,
    { expiresIn: '1h' }
  );
  return token;
};

userSchema.pre('save', function (next: (_err?: Error) => void) {
  const requiredFields = ['firstName', 'lastName', 'email', 'authProvider'];
  const missingFields = requiredFields.filter(field => !(this as any)[field]);

  if (missingFields.length > 0) {
    const error = new Error(
      `Missing required fields: ${missingFields.join(', ')}`
    );
    return next(error);
  }

  next();
});

userSchema.post('save', async function (user: IUser) {
  if (!user.subscription) {
    const subscription = await createSubscription(user._id);
    user.subscription = subscription._id;
    await user.save();
  }
});

const User = model<IUser>('User', userSchema);

export default User;
