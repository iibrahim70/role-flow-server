import { ZodError } from 'zod';
import httpStatus from 'http-status';
import { IErrorResponse } from '@/types';

export const handleZodError = (err: ZodError): IErrorResponse => {
  const errors = err?.issues?.map((issue) => {
    return {
      field: String(issue?.path[issue?.path?.length - 1]),
      description: issue?.message,
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
