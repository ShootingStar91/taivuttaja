import { Schema, model } from 'mongoose';
import { USERNAME_MAX_LENGTH, USERNAME_MIN_LENGTH } from '../config';
import { TEST_MODE } from '../config';
const collection = TEST_MODE ? 'test_users' : 'users';

export interface User {
  _id: string;
  goal?: number;
  username: string;
  password?: string;
  token?: string;
  strictAccents: boolean;
}

const userSchema = new Schema<User>({
  username: { type: String, required: true, unique: true, minlength: USERNAME_MIN_LENGTH, maxlength: USERNAME_MAX_LENGTH },
  password: { type: String, required: true },
  goal: { type: Number },
  strictAccents: { type: Boolean, required: true, default: false },
}, { collection });

export const userModel = model<User>('User', userSchema);
