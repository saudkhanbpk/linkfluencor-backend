import CustomError from './CustomError';

class ValidationError extends CustomError {
  constructor(message: string = 'Validation failed') {
    super(message, 400);
  }
}

export default ValidationError;
