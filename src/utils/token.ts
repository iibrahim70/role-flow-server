import jwt, { JwtPayload, Secret, SignOptions } from 'jsonwebtoken';
import { randomBytes } from 'crypto';
import httpStatus from 'http-status';
import { ApiError } from '../errors';
import { config } from '@/config/config';

export const generateJwtToken = (
  payload: Record<string, unknown>,
  type: 'access' | 'refresh' | 'password-reset',
) => {
  const secret =
    type === 'access'
      ? config.jwt.accessSecret
      : type === 'refresh'
        ? config.jwt.refreshSecret
        : config.jwt.passResetSecret;

  const expiresIn =
    type === 'access'
      ? config.jwt.accessExpiresIn
      : type === 'refresh'
        ? config.jwt.refreshExpiresIn
        : config.jwt.passResetExpiresIn;

  return jwt.sign(payload, secret as string, { expiresIn } as SignOptions);
};

// Function to decode a JWT token
export const validateJwtToken = (token: string, secret: Secret) => {
  try {
    return jwt.verify(token, secret) as JwtPayload;
  } catch {
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      'Access token is expired or invalid.',
    );
  }
};

// Function to generate a random hex token
export const generateRandomHex = (length: number) => {
  return randomBytes(length).toString('hex');
};
