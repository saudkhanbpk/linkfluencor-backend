import CustomError from './CustomError';

class AuthorizationError extends CustomError {
  constructor(message: string = 'Access denied') {
    super(message, 403);
  }
}

export default AuthorizationError;
