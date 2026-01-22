import httpStatus from 'http-status';
import { ApiError } from '@/errors';
import { IUser } from '../User/user.interface';
import { User } from '../User/user.model';
import { IInvite } from '../Invite/invite.interface';
import crypto from 'crypto';
import { Invite } from '../Invite/invite.model';
import { USER_STATUS } from '../User/user.constant';
import bcrypt from 'bcrypt';
import { config } from '@/config/config';
import { generateJwtToken } from '@/utils/token';

const loginToDB = async (payload: Partial<IUser>) => {
  const existingUser = await User.findOne({ email: payload?.email }).select(
    '+password',
  );

  if (!existingUser) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      'User with this email does not exist!',
    );
  }

  const isPasswordValid = await bcrypt.compare(
    payload?.password as string,
    existingUser?.password,
  );

  if (!isPasswordValid) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Invalid password provided!');
  }

  if (existingUser?.status === USER_STATUS.INACTIVE) {
    throw new ApiError(httpStatus.FORBIDDEN, 'User account is inactive!');
  }

  const jwtPayload = {
    userId: existingUser?._id,
    email: existingUser?.email,
    role: existingUser?.role,
  };

  const accessToken = generateJwtToken(jwtPayload, 'access');
  const refreshToken = generateJwtToken(jwtPayload, 'refresh');

  return {
    accessToken,
    refreshToken,
  };
};

const inviteUserToDB = async (payload: Partial<IInvite>) => {
  const existingUser = await User.findOne({ email: payload?.email });

  if (existingUser) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `User with email ${payload?.email} already exists!`,
    );
  }

  const existingInvite = await Invite.findOne({
    email: payload?.email,
    expiresAt: { $gt: new Date() },
  });

  if (existingInvite) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'An active invitation already exists for this email!',
    );
  }

  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

  const result = await Invite.create({
    email: payload?.email,
    role: payload?.role,
    token,
    expiresAt,
  });

  return {
    _id: result._id,
    email: result.email,
    expiresAt: result.expiresAt,
  };
};

const registerViaInviteToDB = async (payload: {
  token: string;
  password: string;
}) => {
  const existingInvite = await Invite.findOne({ token: payload?.token });

  if (!existingInvite) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'No invitation found with the provided token!',
    );
  }

  if (existingInvite?.expiresAt < new Date()) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'The invitation for this token has already expired!',
    );
  }

  const existingUser = await User.findOne({ email: existingInvite.email });

  if (existingUser) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `User with email ${existingUser?.email} already exists!`,
    );
  }

  const hashedPassword = await bcrypt.hash(
    payload?.password,
    Number(config.security.bcryptSaltRounds),
  );

  const result = await User.create({
    email: existingInvite?.email,
    password: hashedPassword,
    role: existingInvite?.role,
    status: USER_STATUS.ACTIVE,
    invitedAt: existingInvite?.createdAt,
  });

  await Invite.updateOne(
    { token: payload?.token },
    { $set: { acceptedAt: new Date() } },
  );

  return {
    _id: result._id,
    email: result.email,
    status: result.status,
    invitedAt: result.invitedAt,
  };
};

export const AuthServices = {
  loginToDB,
  inviteUserToDB,
  registerViaInviteToDB,
};
