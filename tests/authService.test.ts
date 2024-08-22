import { registerUser } from '../src/services/authService';
import User from '../src/models/User';
import { hashPassword } from '../src/utils/authUtils';
import log from '../src/utils/logger';

jest.mock('../src/models/User');
jest.mock('../src/utils/authUtils');
jest.mock('../src/utils/logger');

describe('registerUser', () => {
  const mockUser = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    password: 'hashedPassword',
    authProvider: 'local',
    role: 'user',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should register a new user successfully', async () => {
    (User.findOne as jest.Mock).mockResolvedValue(null);
    (hashPassword as jest.Mock).mockResolvedValue('hashedPassword');
    (User.prototype.save as jest.Mock).mockResolvedValue(mockUser);

    await registerUser(
      mockUser.firstName,
      mockUser.lastName,
      mockUser.email,
      'plainPassword',
      mockUser.authProvider,
      mockUser.role
    );

    expect(User.findOne).toHaveBeenCalledWith({ email: mockUser.email });
    expect(hashPassword).toHaveBeenCalledWith('plainPassword');
    expect(User.prototype.save).toHaveBeenCalled();
    expect(log.info).toHaveBeenCalledWith(
      `Registering new user: ${mockUser.email}`
    );
  });

  it('should throw an error if the user already exists', async () => {
    (User.findOne as jest.Mock).mockResolvedValue(mockUser);

    await expect(
      registerUser(
        mockUser.firstName,
        mockUser.lastName,
        mockUser.email,
        'plainPassword',
        mockUser.authProvider,
        mockUser.role
      )
    ).rejects.toThrow('User already exists');

    expect(User.findOne).toHaveBeenCalledWith({ email: mockUser.email });
    expect(log.warn).toHaveBeenCalledWith(
      `User already exists: ${mockUser.email}`
    );
  });

  it('should handle errors during registration', async () => {
    (User.findOne as jest.Mock).mockRejectedValue(new Error('Database error'));

    await expect(
      registerUser(
        mockUser.firstName,
        mockUser.lastName,
        mockUser.email,
        'plainPassword',
        mockUser.authProvider,
        mockUser.role
      )
    ).rejects.toThrow('Database error');

    expect(User.findOne).toHaveBeenCalledWith({ email: mockUser.email });
    expect(log.error).toHaveBeenCalledWith(
      expect.stringContaining('Error registering user')
    );
  });
});
