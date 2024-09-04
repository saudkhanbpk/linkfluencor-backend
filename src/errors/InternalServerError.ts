import CustomError from './CustomError';

class InternalServerError extends CustomError {
  constructor(message: string = 'Internal server error') {
    super(message, 500);
  }
}

export default InternalServerError;
