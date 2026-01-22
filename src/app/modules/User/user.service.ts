import httpStatus from 'http-status';
import { IUser } from './user.interface';
import { User } from './user.model';
import { ApiError } from '@/errors';

const getUsersFromDB = async () => {
  const result = await User.find();
  return result;
};

const updateUserRoleByIdToDB = async (
  id: string,
  payload: Pick<IUser, 'role'>,
) => {
  const existingUser = await User.findById(id);

  if (!existingUser) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      `User with ID ${id} was not found`,
    );
  }

  const result = await User.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  return result;
};

const updateUserStatusByIdToDB = async (
  id: string,
  payload: Pick<IUser, 'status'>,
) => {
  const existingUser = await User.findById(id);

  if (!existingUser) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      `User with ID ${id} was not found`,
    );
  }

  const result = await User.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
  return result;
};

export const UserServices = {
  getUsersFromDB,
  updateUserRoleByIdToDB,
  updateUserStatusByIdToDB,
};
