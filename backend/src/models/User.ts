import { Schema, model } from 'mongoose';
import { USERNAME_MAX_LENGTH, USERNAME_MIN_LENGTH } from '../config';

export interface User {
  _id: string;
  goal?: number;
  username: string;
  password: string;
}

const userSchema = new Schema<User>({
  username: { type: String, required: true, unique: true, minlength: USERNAME_MIN_LENGTH, maxlength: USERNAME_MAX_LENGTH },
  password: { type: String, required: true },
  goal: { type: Number },
});

export const userModel = model<User>('User', userSchema);
