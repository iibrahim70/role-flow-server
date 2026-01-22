import { USER_STATUS } from '@/app/modules/User/user.constant';
import { TUserRole } from '@/app/modules/User/user.interface';
import { User } from '@/app/modules/User/user.model';
import { config } from '@/config/config';
import { ApiError } from '@/errors';
import { catchAsync } from '@/utils';
import { validateJwtToken } from '@/utils/token';
import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';

const validateAuth = (...requiredRoles: TUserRole[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    let token: string | undefined;

    // Step 1: Get token form cookies
    if (req?.cookies?.accessToken) {
      token = req?.cookies?.accessToken;
    }

    // Step 2: Get token from Authorization header
    const authorization = req?.headers?.authorization;

    if (authorization) {
      if (!authorization.startsWith('Bearer ')) {
        throw new ApiError(
          httpStatus.UNAUTHORIZED,
          'Authorization header must start with "Bearer <token>".',
        );
      }

      token = authorization.split(' ')[1];
    }

    // Step 3: Check if no token is found
    if (!token) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Access token is missing!');
    }

    // Step 4: Verify JWT and decode payload
    const decoded = validateJwtToken(token, config.jwt.accessSecret as string);

    // Step 5: Find user by ID from decoded token
    const existingUser = await User.findById(decoded?.userId);

    if (!existingUser) {
      throw new ApiError(
        httpStatus.NOT_FOUND,
        `User with ID: ${decoded?.userId} not found!`,
      );
    }

    // Step 6: Check user status
    if (existingUser?.status === USER_STATUS.INACTIVE) {
      throw new ApiError(httpStatus.FORBIDDEN, 'User account is inactive!');
    }

    // Step 7: Role-based authorization (only if roles provided)
    if (requiredRoles && !requiredRoles.includes(decoded?.role)) {
      throw new ApiError(
        httpStatus.UNAUTHORIZED,
        'You do not have access to this resource.',
      );
    }

    // Step 8: Attach user info to request
    req.user = decoded;
    next();
  });
};

export default validateAuth;
