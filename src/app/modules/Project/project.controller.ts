import { catchAsync, sendResponse } from '@/utils';
import httpStatus from 'http-status';
import { ProjectServices } from './project.service';

const createProject = catchAsync(async (req, res) => {
  const result = await ProjectServices.createProjectToDB(req?.user, req?.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Project created successfully!',
    data: result,
  });
});

const getProjects = catchAsync(async (req, res) => {
  const result = await ProjectServices.getProjectsFromDB();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Projects retrieved successfully!',
    data: result,
  });
});

const updateProjectById = catchAsync(async (req, res) => {
  const result = await ProjectServices.updateProjectByIdToDB(
    String(req?.params?.id),
    req?.body,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: `Project with ID ${result?._id} updated successfully!`,
    data: result,
  });
});

const deleteProjectById = catchAsync(async (req, res) => {
  const result = await ProjectServices.deleteProjectByIdToDB(
    String(req?.params?.id),
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: `Project with ID ${result?._id} deleted successfully!`,
    data: null,
  });
});

export const ProjectControllers = {
  createProject,
  getProjects,
  updateProjectById,
  deleteProjectById,
};
