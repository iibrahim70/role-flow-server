import httpStatus from 'http-status';
import { IProject } from './project.interface';
import { Project } from './project.model';
import { ApiError } from '@/errors';
import { JwtPayload } from 'jsonwebtoken';

const createProjectToDB = async (user: JwtPayload, payload: IProject) => {
  payload.createdBy = user?.userId;

  const result = await Project.create(payload);
  return result;
};

const getProjectsFromDB = async () => {
  const result = await Project.find({ isDeleted: false });
  return result;
};

const updateProjectByIdToDB = async (
  id: string,
  payload: Partial<IProject>,
) => {
  const existingProject = await Project.findOne({ _id: id, isDeleted: false });

  if (!existingProject) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      `Project with ID ${id} was not found`,
    );
  }

  const result = await Project.findByIdAndUpdate(
    { _id: id, isDeleted: false },
    payload,
    { new: true, runValidators: true },
  );

  return result;
};

const deleteProjectByIdToDB = async (id: string) => {
  const existingProject = await Project.findOne({ _id: id, isDeleted: false });

  if (!existingProject) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      `Project with ID ${id} was not found`,
    );
  }

  const result = await Project.findByIdAndUpdate(
    { _id: id, isDeleted: false },
    { isDeleted: true, status: 'DELETED' },
    { new: true, runValidators: true },
  );

  return result;
};

export const ProjectServices = {
  createProjectToDB,
  getProjectsFromDB,
  updateProjectByIdToDB,
  deleteProjectByIdToDB,
};
