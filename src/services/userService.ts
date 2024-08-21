import User from '../models/User';
import log from '../utils/logger';

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

export const createUser = async (userData: any) => {
  try {
    log.info('Creating new user');
    const newUser = new User(userData);
    const savedUser = await newUser.save();
    log.info(`Created user: ${savedUser}`);
    return savedUser;
  } catch (error: any) {
    log.error(`Error creating user: ${error.message}`);
    throw error;
  }
};

export const updateUser = async (id: string, updateData: any) => {
  try {
    log.info(`Updating user with id: ${id}`);
    const updatedUser = await User.findByIdAndUpdate(id, updateData, { new: true });
    if (updatedUser) {
      log.info(`Updated user: ${updatedUser}`);
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