import * as dotenv from 'dotenv';

dotenv.config();

export const PORT = process.env.PORT || 3001;
export const MONGODB_URI = process.env.MONGODB_URI;
export const SECRET = process.env.SECRET;
export const loginValidSeconds = 60 * 60 * 12;
export const PASSWORD_MIN_LENGTH = 5;
export const PASSWORD_MAX_LENGTH = 18;
export const USERNAME_MIN_LENGTH = 5;
export const USERNAME_MAX_LENGTH = 16;


