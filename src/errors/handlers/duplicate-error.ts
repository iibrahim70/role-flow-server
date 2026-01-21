/* eslint-disable @typescript-eslint/no-explicit-any */

import { IErrorResponse } from '@/types';
import httpStatus from 'http-status';

export const handleDuplicateError = (err: any): IErrorResponse => {
  // Try to extract key and value from the error object
  const key = Object.keys(err?.keyPattern || {})[0];
  const value = err?.keyValue?.[key];

  return {
    statusCode: httpStatus.CONFLICT,
    message: `Conflict: The value '${value}' for '${key}' is already in use.`,
    errors: [
      {
        field: key,
        description: `'${value}' is already exists`,
      },
    ],
  };
};
