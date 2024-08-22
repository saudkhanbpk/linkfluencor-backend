import crypto from 'crypto';

export const generateShortUrl = (): string =>
  crypto.randomBytes(3).toString('hex');
