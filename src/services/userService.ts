import User from '../models/User';
import log from '../utils/logger';
import { UserStatus } from '../types/enums';

export const getAllUsers = async () => {
  try {
    log.info('Fetching all users');
    const users = await User.find();
    log.info(`Fetched ${users.length} users`);
    return users;
  } catch (error: any) {
    log.error(`Error fetching users: ${error.message}`);
    throw error;
  }
};

export const createUser = async (
  email: string,
  password: string | null,
  authProvider: string,
  authProviderId: string,
  role: string,
  brand: string,
  activationToken: string
) => {
  try {
    log.info(`Creating user: ${email}`);
    const user = new User({
      email,
      password,
      status: authProvider === 'local' ? UserStatus.Pending : UserStatus.Active,
      authProvider,
      authProviderId,
      role,
      brand,
      activationToken,
    });

    await user.save();
    log.info(`User saved ${email}`);
    return user;
  } catch (error: any) {
    log.error(`Error creating user: ${error.message}`);
    throw error;
  }
};

export const activateUser = async (activationToken: string) => {
  try {
    log.info(`Fetching user with activation token: ${activationToken}`);
    const user = await User.findOne({ activationToken });
    if (user) {
      log.info(`Fetched user: ${user}`);
      user.status = UserStatus.Active;
      log.info(`Activating user: ${user}`);
      user.activationToken = null as any;
    } else {
      log.warn(`User with activation token: ${activationToken} not found`);
    }
    return user;
  } catch (error: any) {
    log.error(
      `Error fetching user with activation token ${activationToken}: ${error.message}`
    );
    throw error;
  }
};

export const getUserById = async (id: string) => {
  try {
    log.info(`Fetching user with id: ${id}`);
    const user = await User.findById(id);
    if (user) {
      log.info(`Fetched user: ${user}`);
    } else {
      log.warn(`User with id: ${id} not found`);
    }
    return user;
  } catch (error: any) {
    log.error(`Error fetching user with id ${id}: ${error.message}`);
    throw error;
  }
};

export const validateUserExistence = async (email: string) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    log.warn(`User already exists: ${email}`);
    throw new Error('User already exists');
  }
};

export const updateUser = async (id: string, updateData: any) => {
  try {
    log.info(`Updating user with id: ${id}`);
    const updatedUser = await User.findByIdAndUpdate(id, updateData, {
      new: true,
    });
    if (updatedUser) {
      log.info(`Updated user with id: ${id}`);
    } else {
      log.warn(`User with id: ${id} not found`);
    }
    return updatedUser;
  } catch (error: any) {
    log.error(`Error updating user with id ${id}: ${error.message}`);
    throw error;
  }
};

export const deleteUser = async (id: string) => {
  try {
    log.info(`Deleting user with id: ${id}`);
    const deletedUser = await User.findByIdAndDelete(id);
    if (deletedUser) {
      log.info(`Deleted user: ${deletedUser}`);
    } else {
      log.warn(`User with id: ${id} not found`);
    }
    return deletedUser;
  } catch (error: any) {
    log.error(`Error deleting user with id ${id}: ${error.message}`);
    throw error;
  }
};

export const getProfileCompletion = async (id: string) => {
  try {
    log.info(`Fetching user with id: ${id}`);
    const user = await User.findById(id);
    if (user) {
      log.info(`Fetched user: ${user}`);
      const completion = user.calculateProfileCompletion();
      log.info(`Profile completion for user ${id}: ${completion}%`);
      return completion;
    } else {
      log.warn(`User with id: ${id} not found`);
      return null;
    }
  } catch (error: any) {
    log.error(`Error fetching user with id ${id}: ${error.message}`);
    throw error;
  }
};
