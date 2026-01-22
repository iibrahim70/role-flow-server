import { catchAsync, sendResponse } from '@/utils';
import httpStatus from 'http-status';
import { AuthServices } from './auth.service';

const login = catchAsync(async (req, res) => {
  const result = await AuthServices.loginToDB(req?.body);

  res.cookie('accessToken', result?.accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 30 * 60 * 1000,
    sameSite: 'strict',
  });

  res.cookie('refreshToken', result?.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 7 * 24 * 60 * 60 * 1000,
    sameSite: 'strict',
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Login successful!',
    data: result,
  });
});

const inviteUser = catchAsync(async (req, res) => {
  const result = await AuthServices.inviteUserToDB(req?.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Invitation sent successfully!',
    data: result,
  });
});

const registerViaInvite = catchAsync(async (req, res) => {
  const result = await AuthServices.registerViaInviteToDB(req?.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User registered successfully!',
    data: result,
  });
});

export const AuthControllers = {
  login,
  inviteUser,
  registerViaInvite,
};
