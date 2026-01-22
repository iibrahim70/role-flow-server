import { Schema, model } from 'mongoose';
import { IInvite } from './invite.interface';
import { USER_ROLES } from '../User/user.constant';

const inviteSchema = new Schema<IInvite>(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    role: {
      type: String,
      enum: Object.values(USER_ROLES),
      required: true,
    },
    token: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    acceptedAt: {
      type: Date,
    },
  },
  { timestamps: true },
);

export const Invite = model<IInvite>('Invite', inviteSchema);
