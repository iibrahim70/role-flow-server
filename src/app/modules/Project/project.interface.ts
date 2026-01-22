import { ObjectId } from 'mongoose';
import { PROJECT_STATUS } from './project.constant';

export type TProjectStatus = keyof typeof PROJECT_STATUS;

export interface IProject {
  name: string;
  description: string;
  status: TProjectStatus;
  isDeleted: boolean;
  createdBy: ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
