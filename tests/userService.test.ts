import {
  getAllUsers,
  getUserById,
  updateUser,
} from '../src/services/userService';
import User from '../src/models/User';
import log from '../src/utils/logger';

jest.mock('../src/models/User');
jest.mock('../src/utils/logger');

describe('UserService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllUsers', () => {
    it('should log fetching all users and return users', async () => {
      const mockUsers = [{ id: 1, name: 'John Doe' }];
      (User.find as jest.Mock).mockResolvedValue(mockUsers);

      const users = await getAllUsers();

      expect(log.info).toHaveBeenCalledWith('Fetching all users');
      expect(log.info).toHaveBeenCalledWith(
        `Fetched ${mockUsers.length} users`
      );
      expect(users).toEqual(mockUsers);
    });

    it('should log error and throw error if fetching users fails', async () => {
      const errorMessage = 'Database error';
      (User.find as jest.Mock).mockRejectedValue(new Error(errorMessage));

      await expect(getAllUsers()).rejects.toThrow(errorMessage);
      expect(log.error).toHaveBeenCalledWith(
        `Error fetching users: ${errorMessage}`
      );
    });
  });

  describe('getUserById', () => {
    it('should log fetching user by id and return user if found', async () => {
      const mockUser = { id: 1, name: 'John Doe' };
      (User.findById as jest.Mock).mockResolvedValue(mockUser);

      const user = await getUserById('1');

      expect(log.info).toHaveBeenCalledWith('Fetching user with id: 1');
      expect(log.info).toHaveBeenCalledWith(`Fetched user: ${mockUser}`);
      expect(user).toEqual(mockUser);
    });

    it('should log warning if user not found', async () => {
      (User.findById as jest.Mock).mockResolvedValue(null);

      const user = await getUserById('1');

      expect(log.info).toHaveBeenCalledWith('Fetching user with id: 1');
      expect(log.warn).toHaveBeenCalledWith('User with id: 1 not found');
      expect(user).toBeNull();
    });

    it('should log error and throw error if fetching user by id fails', async () => {
      const errorMessage = 'Database error';
      (User.findById as jest.Mock).mockRejectedValue(new Error(errorMessage));

      await expect(getUserById('1')).rejects.toThrow(errorMessage);
      expect(log.error).toHaveBeenCalledWith(
        `Error fetching user with id 1: ${errorMessage}`
      );
    });
  });

  describe('updateUser', () => {
    it('should log updating user and return updated user', async () => {
      const mockUser = { id: 1, name: 'John Doe' };
      const updateData = { name: 'Jane Doe' };
      (User.findByIdAndUpdate as jest.Mock).mockResolvedValue({
        ...mockUser,
        ...updateData,
      });

      const updatedUser = await updateUser('1', updateData);

      expect(log.info).toHaveBeenCalledWith('Updating user with id: 1');
      expect(log.info).toHaveBeenCalledWith('Updating user with id: 1');
      expect(updatedUser).toEqual({ ...mockUser, ...updateData });
    });

    it('should log error and throw error if updating user fails', async () => {
      const errorMessage = 'Database error';
      const updateData = { name: 'Jane Doe' };
      (User.findByIdAndUpdate as jest.Mock).mockRejectedValue(
        new Error(errorMessage)
      );

      await expect(updateUser('1', updateData)).rejects.toThrow(errorMessage);
      expect(log.error).toHaveBeenCalledWith(
        `Error updating user with id 1: ${errorMessage}`
      );
    });
  });
});
