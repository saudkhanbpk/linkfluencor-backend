import CustomError from './CustomError';

class ConflictError extends CustomError {
  constructor(message: string = 'Conflict') {
    super(message, 409);
  }
}

export default ConflictError;
