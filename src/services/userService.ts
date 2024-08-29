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

export const checkUserBalance = (
  userBalance: number,
  planPrice: number
): void => {
  if (userBalance < planPrice) {
    throw new Error('Insufficient balance for the selected plan');
  }
};
