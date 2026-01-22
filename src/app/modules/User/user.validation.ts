import { z } from 'zod';
import { USER_ROLES, USER_STATUS } from './user.constant';

export const updateUserRoleByIdValidationSchema = z.object({
  body: z
    .object({
      role: z.enum(USER_ROLES),
    })
    .strict(), // disallow extra fields
});

export const updateUserStatusByIdValidationSchema = z.object({
  body: z
    .object({
      status: z.enum(USER_STATUS),
    })
    .strict(), // disallow extra fields
});
