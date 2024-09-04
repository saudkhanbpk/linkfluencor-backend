import CustomError from './CustomError';

class AuthenticationError extends CustomError {
  constructor(message: string = 'Authentication failed') {
    super(message, 401);
  }
}

export default AuthenticationError;
