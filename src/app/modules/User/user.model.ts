import { Schema, model } from 'mongoose';
import { IUser } from './user.interface';
import { USER_ROLES, USER_STATUS } from './user.constant';

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    role: {
      type: String,
      enum: Object.values(USER_ROLES),
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(USER_STATUS),
      default: USER_STATUS.ACTIVE,
    },
    invitedAt: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true },
);

export const User = model<IUser>('User', userSchema);
