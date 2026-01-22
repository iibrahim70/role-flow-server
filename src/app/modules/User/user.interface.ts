import { USER_ROLES, USER_STATUS } from './user.constant';

export type TUserRole = keyof typeof USER_ROLES;
export type TUserStatus = keyof typeof USER_STATUS;

export interface IUser {
  name: string;
  email: string;
  password: string;
  role: TUserRole;
  status: TUserStatus;
  invitedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}
