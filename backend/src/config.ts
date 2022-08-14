import * as dotenv from 'dotenv';

dotenv.config();

export const TEST_MODE = process.env.TEST_MODE;
export const PORT = process.env.PORT || 3001;
export const MONGODB_URI = process.env.MONGODB_URI;
export const TEST_MONGODB_URI = process.env.TEST_MONGODB_URI;
export const SECRET = process.env.SECRET;
export const LOGIN_VALID_SECONDS = 48 * 60 * 60;
export const PASSWORD_MIN_LENGTH = 5;
export const PASSWORD_MAX_LENGTH = 18;
export const USERNAME_MIN_LENGTH = 5;
export const USERNAME_MAX_LENGTH = 16;
export const WORDLIST_TITLE_MIN = 3;
export const WORDLIST_TITLE_MAX = 30;

