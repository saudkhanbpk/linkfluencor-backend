import CustomError from './CustomError';

class NotFoundError extends CustomError {
  constructor(message: string = 'Resource not found') {
    super(message, 404);
  }
}

export default NotFoundError;
