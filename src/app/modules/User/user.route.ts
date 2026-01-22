import { Router } from 'express';
import { UserControllers } from './user.controller';
import { validateRequest } from '@/middlewares';
import {
  updateUserRoleByIdValidationSchema,
  updateUserStatusByIdValidationSchema,
} from './user.validation';
import validateAuth from '@/middlewares/validate-auth';
import { USER_ROLES } from './user.constant';

const router = Router();

router.get('/', validateAuth(USER_ROLES.ADMIN), UserControllers.getUsers);

router.patch(
  '/:id/role',
  validateAuth(USER_ROLES.ADMIN),
  validateRequest(updateUserRoleByIdValidationSchema),
  UserControllers.updateUserRoleById,
);

router.patch(
  '/:id/status',
  validateAuth(USER_ROLES.ADMIN),
  validateRequest(updateUserStatusByIdValidationSchema),
  UserControllers.updateUserStatusById,
);

export const UserRouter = router;
