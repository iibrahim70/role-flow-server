import { z } from 'zod';
import { USER_ROLES } from '../User/user.constant';

export const LoginValidationSchema = z.object({
  body: z.object({
    email: z.string(),
    password: z.string(),
  }),
});

export const InviteUserValidationSchema = z.object({
  body: z.object({
    email: z.string(),
    role: z.enum(USER_ROLES),
  }),
});

export const RegisterViaInviteValidationSchema = z.object({
  body: z.object({
    token: z.string(),
    password: z.string(),
  }),
});
