import { Router } from 'express';
import { ProjectControllers } from './project.controller';
import { validateRequest } from '@/middlewares';
import {
  ProjectUpdateValidationSchema,
  ProjectValidationSchema,
} from './project.validation';
import validateAuth from '@/middlewares/validate-auth';
import { USER_ROLES } from '../User/user.constant';

const router = Router();

router
  .route('/')

  .get(ProjectControllers.getProjects)
  .post(
    validateRequest(ProjectValidationSchema),
    ProjectControllers.createProject,
  );

router
  .route('/:id')

  .patch(
    validateAuth(USER_ROLES.ADMIN),
    validateRequest(ProjectUpdateValidationSchema),
    ProjectControllers.updateProjectById,
  )
  .delete(validateAuth(USER_ROLES.ADMIN), ProjectControllers.deleteProjectById);

export const ProjectRouter = router;
