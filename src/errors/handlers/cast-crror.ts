import { CastError } from 'mongoose';
import httpStatus from 'http-status';
import { IErrorResponse } from '@/types';

export const handleCastError = (err: CastError): IErrorResponse => {
  return {
    statusCode: httpStatus.BAD_REQUEST,
    message: httpStatus['400_MESSAGE'],
    errors: [
      {
        field: err?.path,
        description: err?.message,
      },
    ],
  };
};
