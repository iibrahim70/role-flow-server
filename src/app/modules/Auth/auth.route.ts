import { Router } from 'express';
import { AuthControllers } from './auth.controller';
import { validateRequest } from '@/middlewares';
import {
  InviteUserValidationSchema,
  LoginValidationSchema,
  RegisterViaInviteValidationSchema,
} from './auth.validation';
import validateAuth from '@/middlewares/validate-auth';
import { USER_ROLES } from '../User/user.constant';

const router = Router();

router.post(
  '/login',
  validateRequest(LoginValidationSchema),
  AuthControllers.login,
);

router.post(
  '/invite',
  validateAuth(USER_ROLES.ADMIN),
  validateRequest(InviteUserValidationSchema),
  AuthControllers.inviteUser,
);

router.post(
  '/register-via-invite',
  validateRequest(RegisterViaInviteValidationSchema),
  AuthControllers.registerViaInvite,
);

export const AuthRouter = router;
