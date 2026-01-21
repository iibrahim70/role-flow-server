/* eslint-disable @typescript-eslint/no-unused-vars */

import { config } from '@/config';
import {
  ApiError,
  handleCastError,
  handleDuplicateError,
  handleValidationError,
  handleZodError,
} from '@/errors';
import { ErrorRequestHandler } from 'express';
import httpStatus from 'http-status';
import { ZodError } from 'zod';

// Error handler middleware for handling global errors
export const globalErrorHandler: ErrorRequestHandler = (
  err,
  req,
  res,
  next,
) => {
  // Setting default values for the response
  let statusCode = err?.statusCode || httpStatus.INTERNAL_SERVER_ERROR;
  let message = err?.message || httpStatus['500_MESSAGE'];
  let errors = [
    {
      field: '',
      description: err?.message || httpStatus['500_MESSAGE'],
    },
  ];

  // Handling Zod validation errors
  if (err instanceof ZodError) {
    const simplified = handleZodError(err);
    statusCode = simplified?.statusCode;
    message = simplified?.message;
    errors = simplified?.errors;
  }

  // Handling mongoose validation errors
  else if (err?.name === 'ValidationError') {
    const simplified = handleValidationError(err);
    statusCode = simplified?.statusCode;
    message = simplified?.message;
    errors = simplified?.errors;
  }

  // Handling duplicate errors
  else if (err?.code === 11000) {
    const simplified = handleDuplicateError(err);
    statusCode = simplified?.statusCode;
    message = simplified?.message;
    errors = simplified?.errors;
  }

  // Handling Cast errors
  else if (err?.name === 'CastError') {
    const simplified = handleCastError(err);
    statusCode = simplified?.statusCode;
    message = simplified?.message;
    errors = simplified?.errors;
  }

  // Handling ApiErrors (custom error class)
  else if (err instanceof ApiError) {
    statusCode = err?.statusCode;
    message = err.message;
    errors = [
      {
        field: '',
        description: err?.message,
      },
    ];
  }

  // Handling general errors (instances of Error)
  else if (err instanceof Error) {
    message = err?.message;
    errors = [
      {
        field: '',
        description: err?.message,
      },
    ];
  }

  // Returning the error response
  res.status(statusCode).json({
    success: false,
    message,
    errors,
    stack: config.server.nodeEnv === 'development' ? err?.stack : null,
  });
};
