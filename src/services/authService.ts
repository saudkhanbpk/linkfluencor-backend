import User from '../models/User';
import {
  AuthProvider,
  BrandMemberRole,
  SubscriptionPlan,
  UserRole,
} from '../types/enums';
import {
  comparePassword,
  generateToken,
  generateActivationToken,
  handlePasswordHashing,
} from '../utils/authUtils';
import log from '../utils/logger';
import { addUserToBrand, handleBrandAssociation } from './brandService';
import { createUser, validateUserExistence } from '../services/userService';
import { handleEmailNotifications } from '../utils/emailUtils';
import { createSubscription } from '../services/subscriptionService';
import AuthorizationError from '../errors/AuthorizationError';
import NotFoundError from '../errors/NotFoundError';

export const registerUser = async (
  email: string,
  password: string,
  authProvider: AuthProvider,
  authProviderId: string,
  role: UserRole,
  brandName: string
) => {
  try {
    log.info(`Registering new user: ${email}`);

    await validateUserExistence(email);

    const hashedPassword = await handlePasswordHashing(password, authProvider);

    const brand =
      role === UserRole.BrandUser
        ? await handleBrandAssociation(brandName, email)
        : null;

    const user = await createUser(
      email,
      hashedPassword,
      authProvider,
      authProviderId,
      role,
      brand ? brand._id : null,
      generateActivationToken()
    );

    if (brand) {
      await addUserToBrand(user.id, brand.id, BrandMemberRole.Admin);
    }

    await createSubscription(user.id, role, SubscriptionPlan.Free);

    await handleEmailNotifications(
      user.email,
      user.status,
      user.activationToken
    );

    log.info(`User registered successfully: ${user.email}`);
    return { user, token: user.generateAuthToken() };
  } catch (error: any) {
    log.error(`Error registering user: ${error.message}`);
    throw error;
  }
};

export const googleSignIn = async (profile: any) => {
  try {
    log.info(`Signing in user via Google: ${profile.emails[0].value}`);

    const usr = await User.findOne({ email: profile.emails[0].value });

    if (!usr) {
      log.info(`User not found, creating new user: ${profile.emails[0].value}`);
      const { user, token } = await registerUser(
        profile.emails[0].value,
        '',
        AuthProvider.Google,
        profile.id,
        UserRole.User,
        ''
      );
      log.info(`User created successfully: ${profile.emails[0].value}`);
      return { user, token };
    }

    const token = generateToken(usr._id);
    return { user: usr, token };
  } catch (error: any) {
    log.error(`Error signing in with Google ${error.message}`);
    throw error;
  }
};

export const facebookSignIn = async (profile: any) => {
  try {
    log.info(`Signing in user via Facebook: ${profile.emails[0].value}`);

    const usr = await User.findOne({ email: profile.emails[0].value });

    if (!usr) {
      log.info(`User not found, creating new user: ${profile.emails[0].value}`);
      const { user, token } = await registerUser(
        profile.emails[0].value,
        '',
        AuthProvider.Google,
        profile.id,
        UserRole.User,
        ''
      );
      log.info(`User created successfully: ${profile.emails[0].value}`);
      return { user, token };
    }

    const token = generateToken(usr._id);
    return { user: usr, token };
  } catch (error: any) {
    log.error(`Error signing in with Facebook ${error.message}`);
    throw error;
  }
};

export const loginUser = async (email: string, password: string) => {
  try {
    log.info(`Attempting login for email: ${email}`);
    const user = await User.findOne({ email });

    if (!user) {
      log.warn(`Login failed: User not found for email ${email}`);
      throw new NotFoundError('Invalid credentials');
    }

    const isMatch = await comparePassword(password, user.password);

    if (!isMatch) {
      log.warn(`Login failed: Incorrect password for email ${email}`);
      throw new AuthorizationError('Invalid credentials');
    }

    const token = generateToken(user._id);

    log.info(`User logged in successfully: ${email}`);

    return { token, user };
  } catch (error: any) {
    log.error(`Error logging in user: ${error.message}`);
    throw error;
  }
};
