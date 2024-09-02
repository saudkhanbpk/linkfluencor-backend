import User from '../models/User';
import { AuthProvider, UserStatus } from '../types/enums';
import {
  hashPassword,
  comparePassword,
  generateToken,
  generateActivationToken,
} from '../utils/authUtils';
import log from '../utils/logger';
import { sendActivationEmail, sendWelcomeEmail } from '../utils/emailUtils';

export const registerUser = async (
  firstName: string,
  lastName: string,
  email: string,
  password: string,
  authProvider: string,
  role: string
) => {
  try {
    log.info(`Registering new user: ${email}`);

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      log.warn(`User already exists: ${email}`);
      throw new Error('User already exists');
    }

    let hashedPassword = null;

    if (authProvider === AuthProvider.Local) {
      if (!password) {
        throw new Error('Password is required for internal authentication');
      }
      hashedPassword = await hashPassword(password);
    }

    const activationToken = generateActivationToken();

    const user = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      status: UserStatus.Inactive,
      authProvider,
      role,
    });

    await user.save();
    log.info(`User saved ${email}`);
    await sendActivationEmail(user.email, activationToken);
    await sendWelcomeEmail(user.email);
    log.info(`Activation email sent to ${email}`);

    return { user, token: user.generateAuthToken() };
  } catch (error: any) {
    log.error(`Error registering user: ${error.message}`);
    throw error;
  }
};

export const googleSignIn = async (profile: any) => {
  try {
    log.info(`Signing in user via Google: ${profile.emails[0].value}`);

    let user = await User.findOne({ email: profile.emails[0].value });

    if (!user) {
      log.info(`User not found, creating new user: ${profile.emails[0].value}`);
      user = new User({
        firstName: profile.name.givenName,
        lastName: profile.name.familyName,
        email: profile.emails[0].value,
        authProvider: AuthProvider.Google,
        AuthProviderId: profile.id,
        role: 'user',
        status: UserStatus.Inactive,
      });

      await user.save();
      log.info(`User created successfully: ${profile.emails[0].value}`);
    }

    const token = generateToken(user._id);
    return { user, token };
  } catch (error: any) {
    log.error(`Error signing in with Google ${error.message}`);
    throw error;
  }
};

export const facebookSignIn = async (profile: any) => {
  try {
    log.info(`Signing in user via Facebook: ${profile.emails[0].value}`);

    let user = await User.findOne({ email: profile.emails[0].value });

    if (!user) {
      log.info(`User not found, creating new user: ${profile.emails[0].value}`);
      user = new User({
        firstName: profile.name.givenName,
        lastName: profile.name.familyName,
        email: profile.emails[0].value,
        authProvider: AuthProvider.Facebook,
        AuthProviderId: profile.id,
        role: 'user',
        status: UserStatus.Inactive,
      });

      await user.save();
      log.info(`User created successfully: ${profile.emails[0].value}`);
    }

    const token = generateToken(user._id);
    return { user, token };
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
      throw new Error('Invalid credentials');
    }

    const isMatch = await comparePassword(password, user.password);

    if (!isMatch) {
      log.warn(`Login failed: Incorrect password for email ${email}`);
      throw new Error('Invalid credentials');
    }

    const token = generateToken(user._id);

    log.info(`User logged in successfully: ${email}`);

    return { token, user };
  } catch (error: any) {
    log.error(`Error logging in user: ${error.message}`);
    throw error;
  }
};
