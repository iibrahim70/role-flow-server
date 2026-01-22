import { Router } from 'express';
import { AuthRouter } from '../modules/Auth/auth.route';
import { UserRouter } from '../modules/User/user.route';
import { ProjectRouter } from '../modules/Project/project.route';

const router = Router();

const routes = [
  { path: '/auth', route: AuthRouter },
  { path: '/users', route: UserRouter },
  { path: '/projects', route: ProjectRouter },
];

routes.forEach((route) => router.use(route.path, route.route));

export default router;
