import User from '../models/User';
import {
  hashPassword,
  comparePassword,
  generateToken,
} from '../utils/authUtils';
import log from '../utils/logger';

export const registerUser = async (
  firstName: string,
  lastName: string,
  email: string,
  password: string,
  authProvider: string,
  role: string
) => {
  log.info(`Registering new user: ${email}`);

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    log.warn(`User already exists: ${email}`);
    throw new Error('User already exists');
  }

  const hashedPassword = await hashPassword(password);

  const user = new User({
    firstName,
    lastName,
    email,
    password: hashedPassword,
    status: 'active',
    authProvider,
    role,
  });

  await user.save();
  log.info(`User saved ${email}`);

  const token = user.generateAuthToken();

  return { token, user };
};

export const loginUser = async (email: string, password: string) => {
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
};
