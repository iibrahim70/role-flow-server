import mongoose from 'mongoose';
import httpStatus from 'http-status';
import { IErrorResponse } from '@/types';

export const handleValidationError = (
  err: mongoose.Error.ValidationError,
): IErrorResponse => {
  const errors = Object.values(err?.errors).map((val) => {
    return {
      field: val?.path,
      description: val?.message,
    };
  });

  // Join all paths to list the fields in error
  const fields = errors?.map((e) => e?.field)?.join(', ');

  return {
    statusCode: httpStatus.BAD_REQUEST,
    message: `Validation failed for field: ${fields}`,
    errors,
  };
};
