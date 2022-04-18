import { Schema, model } from 'mongoose';
import { PASSWORD_MAX_LENGTH, PASSWORD_MIN_LENGTH, USERNAME_MAX_LENGTH, USERNAME_MIN_LENGTH } from '../config';

export interface User {
  _id: string;
  username: string;
  password: string;
}

const userSchema = new Schema<User>({
  username: { type: String, required: true, unique: true, minlength: USERNAME_MIN_LENGTH, maxlength: USERNAME_MAX_LENGTH },
  password: { type: String, required: true, minlength: PASSWORD_MIN_LENGTH, maxlength: PASSWORD_MAX_LENGTH },
});

export const userModel = model<User>('User', userSchema);
