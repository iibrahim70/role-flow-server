import { TUserRole } from '../User/user.interface';

export interface IInvite {
  email: string;
  role: TUserRole;
  token: string;
  expiresAt: Date;
  acceptedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}
