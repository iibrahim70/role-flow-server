import { catchAsync, sendResponse } from '@/utils';
import httpStatus from 'http-status';
import { UserServices } from './user.service';

const getUsers = catchAsync(async (req, res) => {
  const result = await UserServices.getUsersFromDB();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Users retrieved successfully!',
    data: result,
  });
});

const updateUserRoleById = catchAsync(async (req, res) => {
  const result = await UserServices.updateUserRoleByIdToDB(
    String(req?.params?.id),
    req?.body,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: `User with ID ${result?._id} updated successfully!`,
    data: result,
  });
});

const updateUserStatusById = catchAsync(async (req, res) => {
  const result = await UserServices.updateUserStatusByIdToDB(
    String(req?.params?.id),
    req?.body,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: `User with ID ${result?._id} updated successfully!`,
    data: result,
  });
});

export const UserControllers = {
  getUsers,
  updateUserRoleById,
  updateUserStatusById,
};
